package it.pa.repdgt.surveymgmt.service;

import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.constants.DomandeStrutturaQ1AndQ2Constants;
import it.pa.repdgt.shared.entity.*;
import it.pa.repdgt.shared.entity.key.ServizioCittadinoKey;
import it.pa.repdgt.shared.entity.tipologica.FasciaDiEtaEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import it.pa.repdgt.shared.entityenum.StatoQuestionarioEnum;
import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.shared.repository.tipologica.FasciaDiEtaRepository;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.CittadinoServizioBean;
import it.pa.repdgt.surveymgmt.bean.CittadinoUploadBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection.DatiIstanza;
import it.pa.repdgt.surveymgmt.dto.NuovoCittadinoDTO;
import it.pa.repdgt.surveymgmt.collection.SezioneQ3Collection;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.exception.QuestionarioCompilatoException;
import it.pa.repdgt.surveymgmt.exception.ServizioException;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.mongo.repository.SezioneQ3Respository;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniServizioParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoServizioProjection;
import it.pa.repdgt.surveymgmt.projection.GetCittadinoProjection;
import it.pa.repdgt.surveymgmt.repository.*;
import it.pa.repdgt.surveymgmt.request.NuovoCittadinoServizioRequest;
import it.pa.repdgt.surveymgmt.util.CSVServizioUtil;
import it.pa.repdgt.surveymgmt.util.EncodeUtils;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections4.CollectionUtils;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.PostConstruct;
import org.springframework.transaction.annotation.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@Validated
public class CittadiniServizioService implements DomandeStrutturaQ1AndQ2Constants {

    Map<String, Integer> mappaMesi = new HashMap<>();
    Map<Character, Integer> mappaOmocodia = new HashMap<>();

    @PostConstruct
    public void init() {
        mappaOmocodia.put('L', 0);
        mappaOmocodia.put('M', 1);
        mappaOmocodia.put('N', 2);
        mappaOmocodia.put('P', 3);
        mappaOmocodia.put('Q', 4);
        mappaOmocodia.put('R', 5);
        mappaOmocodia.put('S', 6);
        mappaOmocodia.put('T', 7);
        mappaOmocodia.put('U', 8);
        mappaOmocodia.put('V', 9);

        mappaMesi.put("A", Calendar.JANUARY);
        mappaMesi.put("B", Calendar.FEBRUARY);
        mappaMesi.put("C", Calendar.MARCH);
        mappaMesi.put("D", Calendar.APRIL);
        mappaMesi.put("E", Calendar.MAY);
        mappaMesi.put("H", Calendar.JUNE);
        mappaMesi.put("L", Calendar.JULY);
        mappaMesi.put("M", Calendar.AUGUST);
        mappaMesi.put("P", Calendar.SEPTEMBER);
        mappaMesi.put("R", Calendar.OCTOBER);
        mappaMesi.put("S", Calendar.NOVEMBER);
        mappaMesi.put("T", Calendar.DECEMBER);
    }

    private static final String FORMATO_DATA_PATTERN = "dd-MM-yyyy";

    private static final Integer RANGE_SECOLO = 23;
    private static final SimpleDateFormat simpleDateFormat = new SimpleDateFormat(FORMATO_DATA_PATTERN);

    private static final String CF_REGX = "^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$";

    @Autowired
    private CittadinoService cittadinoService;
    @Autowired
    private ServizioSqlService servizioSqlService;
    @Autowired
    private CittadinoServizioRepository cittadinoServizioRepository;
    @Autowired
    private CittadinoRepository cittadinoRepository;
    @Autowired
    private ServizioXCittadinoRepository servizioXCittadinoRepository;
    @Autowired
    private FasciaDiEtaRepository fasciaDiEtaRepository;
    @Autowired
    private SezioneQ3Respository sezioneQ3Respository;
    @Autowired
    private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoService;
    @Autowired
    private QuestionarioCompilatoRepository questionarioCompilatoSqlRepository;
    @Autowired
    private QuestionarioInviatoOnlineRepository questionarioInviatoOnlineRepository;
    @Autowired
    private ServizioSqlRepository servizioSqlRepository;

    @LogMethod
    @LogExecutionTime
    public CittadinoServizioBean getAllCittadiniServizioByProfilazioneAndFiltroPaginati(
            Long idServizio,
            @NotNull @Valid final SceltaProfiloParam profilazione,
            @NotNull @Valid final FiltroListaCittadiniServizioParam filtroListaCittadiniServizio,
            Integer currPage,
            Integer pageSize) {
        CittadinoServizioBean bean = new CittadinoServizioBean();
        // Recupero codiceFiscale e codiceRuolo con cui si è profilato l'utente loggato
        // alla piattaforma
        final String codiceFiscaleUtenteLoggato = profilazione.getCfUtenteLoggato().trim();

        // Verifico se il facilitatore è il creatore di quel servizio
        if (!this.servizioSqlRepository.findByFacilitatoreAndIdServizio(codiceFiscaleUtenteLoggato, idServizio)
                .isPresent()) {
            final String messaggioErrore = String.format(
                    "Servizio non accessibile per l'utente con codice fiscale '%s in quanto non risulta il creatore del servizio'",
                    codiceFiscaleUtenteLoggato);
            throw new ServizioException(messaggioErrore, CodiceErroreEnum.A02);
        }

        // Recupero tutti i cittadini del servizion con id idServizio in base ai filtri
        // selezionati
        final List<CittadinoServizioProjection> listaCittadiniServizio = this.getAllServiziByProfilazioneAndFiltro(
                idServizio,
                filtroListaCittadiniServizio,
                currPage,
                pageSize);

        bean.setListaCittadiniServizio(listaCittadiniServizio);
        bean.setNumCittadini(listaCittadiniServizio.size());
        bean.setNumQuestionariCompilati(
                listaCittadiniServizio.stream()
                        .filter(c -> StatoQuestionarioEnum.COMPILATA.toString()
                                .equalsIgnoreCase(c.getStatoQuestionario()))
                        .count());
        return bean;
    }

    private List<CittadinoServizioProjection> getAllServiziByProfilazioneAndFiltro(
            Long idServizio,
            @NotNull @Valid FiltroListaCittadiniServizioParam filtroListaCittadiniServizio,
            @NotNull Integer currPage,
            @NotNull Integer pageSize) {
        String criterioRicercaCittadinoServizioLike = null;
        String criterioRicercaCittadinoServizio = null;
        if (filtroListaCittadiniServizio.getCriterioRicerca() != null) {
            criterioRicercaCittadinoServizio = EncodeUtils
                    .encrypt(EncodeUtils.decrypt(filtroListaCittadiniServizio.getCriterioRicerca()));
            criterioRicercaCittadinoServizioLike = "%".concat(criterioRicercaCittadinoServizio).concat("%");
        }
        return cittadinoServizioRepository.findAllCittadiniServizioPaginatiByFiltro(
                idServizio,
                criterioRicercaCittadinoServizio,
                filtroListaCittadiniServizio.getStatiQuestionario());
    }

    @LogMethod
    @LogExecutionTime
    public Integer countCittadiniServizioByFiltro(
            Long idServizio,
            @NotNull @Valid FiltroListaCittadiniServizioParam filtroListaCittadiniServizio) {
        String criterioRicercaCittadinoServizioLike = null;
        String criterioRicercaCittadinoServizio = null;
        if (filtroListaCittadiniServizio.getCriterioRicerca() != null) {
            criterioRicercaCittadinoServizio = EncodeUtils
                    .encrypt(EncodeUtils.decrypt(filtroListaCittadiniServizio.getCriterioRicerca()));
            criterioRicercaCittadinoServizioLike = "%".concat(criterioRicercaCittadinoServizio).concat("%");
        }
        return cittadinoServizioRepository.findAllCittadiniServizioByFiltro(
                idServizio,
                criterioRicercaCittadinoServizio,
                filtroListaCittadiniServizio.getStatiQuestionario()).size();
    }

    @LogMethod
    @LogExecutionTime
    public List<String> getAllStatiQuestionarioCittadinoServizioDropdown(
            Long idServizio,
            final FiltroListaCittadiniServizioParam filtroListaCittadiniServizio,
            SceltaProfiloParam sceltaProfilo) {
        // Verifico se il facilitatore è il creatore di quel servizio
        if (!this.servizioSqlRepository.findByFacilitatoreAndIdServizio(sceltaProfilo.getCfUtenteLoggato(), idServizio)
                .isPresent()) {
            final String messaggioErrore = String.format(
                    "Servizio non accessibile per l'utente con codice fiscale '%s in quanto non risulta il creatore del servizio'",
                    sceltaProfilo.getCfUtenteLoggato());
            throw new ServizioException(messaggioErrore, CodiceErroreEnum.A02);
        }
        return filtroListaCittadiniServizio.getStatiQuestionario().isEmpty()
                ? this.getAllStatiQuestionarioByProfilazioneAndFiltro(idServizio, filtroListaCittadiniServizio)
                : this.getAllStatiQuestionarioByProfilazioneAndFiltro(idServizio, filtroListaCittadiniServizio)
                        .containsAll(filtroListaCittadiniServizio.getStatiQuestionario())
                                ? filtroListaCittadiniServizio.getStatiQuestionario()
                                : new ArrayList<>();
    }

    @LogMethod
    @LogExecutionTime
    public List<String> getAllStatiQuestionarioByProfilazioneAndFiltro(
            Long idServizio,
            @NotNull @Valid FiltroListaCittadiniServizioParam filtroListaCittadiniServizio) {
        String criterioRicercaCittadinoServizioLike = null;
        String criterioRicercaCittadinoServizio = null;
        if (filtroListaCittadiniServizio.getCriterioRicerca() != null) {
            criterioRicercaCittadinoServizio = filtroListaCittadiniServizio.getCriterioRicerca();
            criterioRicercaCittadinoServizioLike = "%".concat(criterioRicercaCittadinoServizio).concat("%");
        }

        return cittadinoServizioRepository.getAllStatiQuestionarioCittadinoServizioDropdown(idServizio,
                criterioRicercaCittadinoServizio);
    }

    @LogMethod
    @LogExecutionTime
    public List<GetCittadinoProjection> getAllCittadiniByCodFisc(
            @NotNull String criterioRicerca) {
        criterioRicerca = EncodeUtils.encrypt(EncodeUtils.decrypt(criterioRicerca));
        return cittadinoServizioRepository.getAllCittadiniByCodFisc(criterioRicerca);
    }

    @LogMethod
    @LogExecutionTime
    @Transactional(rollbackFor = Exception.class)
    public CittadinoEntity creaNuovoCittadino(
            @NotNull final Long idServizio,
            @NotNull final NuovoCittadinoServizioRequest nuovoCittadinoRequest) {
        String codiceFiscaleDecrypted;
        // Verifico se il facilitatore è il creatore di quel servizio
        if (!this.servizioSqlRepository
                .findByFacilitatoreAndIdServizio(nuovoCittadinoRequest.getCfUtenteLoggato(), idServizio).isPresent()) {
            final String messaggioErrore = String.format(
                    "Servizio non accessibile per l'utente con codice fiscale '%s in quanto non risulta il creatore del servizio'",
                    nuovoCittadinoRequest.getCfUtenteLoggato());
            throw new ServizioException(messaggioErrore, CodiceErroreEnum.A02);
        }
        final List<CittadinoEntity> cittadinoDBFetchList = this.cittadinoService
                .getCittadinoByCodiceFiscaleList(
                        nuovoCittadinoRequest.getCodiceFiscale());
        CittadinoEntity cittadino = new CittadinoEntity();
        if (CollectionUtils.isNotEmpty(cittadinoDBFetchList)) {
            if (nuovoCittadinoRequest.getNuovoCittadino()) {
                final String messaggioErrore = String.format(
                        "Cittadino gia' esistente",
                        cittadinoDBFetchList.get(0).getCodiceFiscale());
                throw new CittadinoException(messaggioErrore, CodiceErroreEnum.U07);
            }
            cittadino = cittadinoDBFetchList.get(0);
        } else {
            if (nuovoCittadinoRequest.getCodiceFiscale() != null
                    && !nuovoCittadinoRequest.getCodiceFiscale().isEmpty()) {
                codiceFiscaleDecrypted = EncodeUtils.decrypt(nuovoCittadinoRequest.getCodiceFiscale());
                if (codiceFiscaleDecrypted.length() != 16)
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Il codice fiscale deve essere composto da 16 caratteri");
                if (!isCittadinoMaggiorenne(codiceFiscaleDecrypted))
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Il cittadino non e' maggiorenne");
                nuovoCittadinoRequest.setCodiceFiscale(EncodeUtils.encrypt(codiceFiscaleDecrypted));
            }
            mapNuovoCittadinoRequestToCittadino(cittadino, nuovoCittadinoRequest);
        }
        // verifico se già esiste il cittadino per quel determinato servizio
        // e in caso affermativo sollevo eccezione
        if (this.esisteCittadinoByIdServizioAndCodiceFiscale(idServizio, cittadino.getCodiceFiscale())) {
            final String messaggioErrore = String.format(
                    "Cittadino gia' esistente sul Servizio con id=%s",
                    cittadino.getCodiceFiscale(),
                    idServizio);
            throw new CittadinoException(messaggioErrore, CodiceErroreEnum.U23);
        }
        cittadino.setDataOraAggiornamento(new Date());
        cittadino = cittadinoRepository.save(cittadino);
        // associo il cittadino al servizio
        this.associaCittadinoAServizio(idServizio, cittadino, null);

        // recupero il servizio
        ServizioEntity servizioDBFetch = servizioSqlService.getServizioById(idServizio);

        if (StatoEnum.NON_ATTIVO.getValue().equals(servizioDBFetch.getStato()))
            servizioDBFetch.setStato(StatoEnum.ATTIVO.getValue());

        // creo il questionario in stato NON_INVIATO
        this.creaQuestionarioNonInviato(servizioDBFetch, cittadino);

        return cittadino;
    }

    @LogMethod
    @LogExecutionTime
    public NuovoCittadinoDTO creaNuovoCittadinoImportCsv(
            @NotNull final Long idServizio,
            @NotNull final NuovoCittadinoServizioRequest nuovoCittadinoRequest, String idRegistroAttivita) {
        String codiceFiscaleDecrypted;
        boolean nuovoCittadino = true;
        // Verifico se il facilitatore è il creatore di quel servizio
        if (!this.servizioSqlRepository
                .findByFacilitatoreAndIdServizio(nuovoCittadinoRequest.getCfUtenteLoggato(), idServizio).isPresent()) {
            final String messaggioErrore = String.format(
                    "Servizio non accessibile per l'utente con codice fiscale '%s in quanto non risulta il creatore del servizio'",
                    nuovoCittadinoRequest.getCfUtenteLoggato());
            throw new ServizioException(messaggioErrore, CodiceErroreEnum.A02);
        }
        if (nuovoCittadinoRequest.getCodiceFiscale() != null && !nuovoCittadinoRequest.getCodiceFiscale().isEmpty()) {
            codiceFiscaleDecrypted = EncodeUtils.decrypt(nuovoCittadinoRequest.getCodiceFiscale());
            codiceFiscaleDecrypted = codiceFiscaleDecrypted.toUpperCase();
            if (codiceFiscaleDecrypted.length() != 16)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Il codice fiscale deve essere composto da 16 caratteri");
            if (!isCittadinoMaggiorenne(codiceFiscaleDecrypted))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Il cittadino non e' maggiorenne");
            nuovoCittadinoRequest.setCodiceFiscale(EncodeUtils.encrypt(codiceFiscaleDecrypted));
        }
        /*
         * if (nuovoCittadinoRequest.getCodiceFiscaleNonDisponibile()) {
         * throw new CittadinoException("Il codice fiscale non e' disponibile",
         * CodiceErroreEnum.U24);
         * }
         */
        final List<CittadinoEntity> cittadinoDBFetchList = this.cittadinoService
                .getCittadinoByCodiceFiscaleList(
                        nuovoCittadinoRequest.getCodiceFiscale());
        CittadinoEntity cittadino = new CittadinoEntity();
        if (CollectionUtils.isNotEmpty(cittadinoDBFetchList)) {
            if (nuovoCittadinoRequest.getNuovoCittadino()) {
                final String messaggioErrore = String.format(
                        "Cittadino gia' esistente",
                        cittadinoDBFetchList.get(0).getCodiceFiscale());
                throw new CittadinoException(messaggioErrore, CodiceErroreEnum.U07);
            }
            cittadino = cittadinoDBFetchList.get(0);
            nuovoCittadino = false;
        } else {
            mapNuovoCittadinoRequestToCittadino(cittadino, nuovoCittadinoRequest);
        }
        // verifico se già esiste il cittadino per quel determinato servizio
        // e in caso affermativo sollevo eccezione
        if (this.esisteCittadinoByIdServizioAndCodiceFiscale(idServizio, cittadino.getCodiceFiscale())) {
            final String messaggioErrore = String.format(
                    "Cittadino gia' esistente sul Servizio con id=%s",
                    cittadino.getCodiceFiscale(),
                    idServizio);
            throw new CittadinoException(messaggioErrore, CodiceErroreEnum.U23);
        }
        cittadino.setDataOraAggiornamento(new Date());
        cittadino.setCodInserimento(idRegistroAttivita);
        cittadino = cittadinoRepository.save(cittadino);
        // associo il cittadino al servizio
        this.associaCittadinoAServizio(idServizio, cittadino, idRegistroAttivita);

        // recupero il servizio
        ServizioEntity servizioDBFetch = servizioSqlService.getServizioById(idServizio);

        if (StatoEnum.NON_ATTIVO.getValue().equals(servizioDBFetch.getStato())) {
            servizioDBFetch.setStato(StatoEnum.ATTIVO.getValue());
            servizioSqlRepository.save(servizioDBFetch);
        }
        // creo il questionario in stato NON_INVIATO
        List<QuestionarioCompilatoEntity> questionarioCompilatoEntities = new ArrayList<>();
        questionarioCompilatoEntities.add(creaQuestionarioNonInviatoImportCsv(servizioDBFetch, cittadino));
        cittadino.setQuestionarioCompilato(questionarioCompilatoEntities);
        NuovoCittadinoDTO resultCittadino = new NuovoCittadinoDTO(cittadino, nuovoCittadino);
        return resultCittadino;
    }

    private CittadinoEntity mapNuovoCittadinoRequestToCittadino(CittadinoEntity cittadino,
            NuovoCittadinoServizioRequest nuovoCittadinoRequest) {
        if (nuovoCittadinoRequest.getCodiceFiscale() != null) {
            cittadino.setCodiceFiscale(nuovoCittadinoRequest.getCodiceFiscale());
        }
        if (fasciaDiEtaRepository.existsById(nuovoCittadinoRequest.getFasciaDiEtaId())) {
            Optional<FasciaDiEtaEntity> fascOptional = fasciaDiEtaRepository.findById(nuovoCittadinoRequest.getFasciaDiEtaId());
            cittadino.setFasciaDiEta(fascOptional.isPresent() ? fascOptional.get() : null);
        }
        cittadino.setCittadinanza(nuovoCittadinoRequest.getCittadinanza());
        cittadino.setGenere(nuovoCittadinoRequest.getGenere());
        cittadino.setDataOraCreazione(new Date());
        cittadino.setOccupazione(nuovoCittadinoRequest.getStatoOccupazionale());
        cittadino.setTitoloDiStudio(nuovoCittadinoRequest.getTitoloStudio());
        cittadino.setProvinciaDiDomicilio(nuovoCittadinoRequest.getProvinciaDiDomicilio());
        return cittadino;
    }

    public boolean isCittadinoMaggiorenne(String codiceFiscale) {
        try {
            Date dataDiNascita = estraiDataDiNascita(codiceFiscale);
            return isMaggiorenne(dataDiNascita);
        } catch (ParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Errore nella data di nascita");
        }
    }

    private Date estraiDataDiNascita(String codiceFiscaleDecrypted) throws ParseException {
        boolean isFemmina = codiceFiscaleDecrypted.charAt(9) >= '4';
        int giornoDiNascita = convertiCarattereInNumero(codiceFiscaleDecrypted.charAt(9)) * 10
            + convertiCarattereInNumero(codiceFiscaleDecrypted.charAt(10)) - (isFemmina ? 40 : 0);

        int secolo = convertiCarattereInNumero(codiceFiscaleDecrypted.charAt(6)) * 10
            + convertiCarattereInNumero(codiceFiscaleDecrypted.charAt(7));
        int annoDiNascita = (secolo <= RANGE_SECOLO) ? 2000 + secolo : 1900 + secolo;
        Calendar cal = Calendar.getInstance();
        cal.set(annoDiNascita, mappaMesi.get(String.valueOf(codiceFiscaleDecrypted.charAt(8)).toUpperCase()),
                giornoDiNascita);
        return cal.getTime();
    }

    private int convertiCarattereInNumero(char carattere) {
        if (Character.isDigit(carattere)) {
            return Character.getNumericValue(carattere);
        } else {
            return mappaOmocodia.getOrDefault(Character.toUpperCase(carattere), -1);
        }
    }

    private boolean isMaggiorenne(Date dataNascita) {
        Date oggi = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(dataNascita);
        cal.add(Calendar.YEAR, 18);
        return oggi.after(cal.getTime());
    }

    public boolean esisteCittadinoByIdServizioAndIdCittadino(@NotNull final Long idServizio,
            @NotNull final Long idCittadino) {
        return this.servizioXCittadinoRepository.findCittadinoByIdServizioAndIdCittadino(idServizio, idCittadino) > 0;
    }

    public boolean esisteCittadinoByIdServizioAndCodiceFiscale(@NotNull final Long idServizio,
        @NotNull final String codiceFiscale) {
        return this.servizioXCittadinoRepository.findCittadinoByIdServizioAndCodiceFiscale(idServizio, codiceFiscale) > 0;
    }

    @LogMethod
    @LogExecutionTime
    public void associaCittadinoAServizio(@NotNull final Long idServizio, @NotNull final CittadinoEntity cittadino, String idRegistroAttivita) {
        ServizioXCittadinoEntity servizioXCittadino = new ServizioXCittadinoEntity();
        ServizioCittadinoKey key = new ServizioCittadinoKey(cittadino.getId(), idServizio);
        servizioXCittadino.setId(key);
        servizioXCittadino.setDataOraAggiornamento(new Date());
        servizioXCittadino.setDataOraCreazione(new Date());
        if(idRegistroAttivita != null)
            servizioXCittadino.setCodInserimento(idRegistroAttivita);
        servizioXCittadinoRepository.save(servizioXCittadino);
    }

    @LogMethod
    @LogExecutionTime
    @Transactional(rollbackFor = Exception.class)
    public void creaQuestionarioNonInviato(@NotNull final ServizioEntity servizioDBFetch,
            @NotNull final CittadinoEntity cittadino) {

        // creo il template questionario compilato per Mongo
        QuestionarioCompilatoCollection questionarioCompilatoCreato = creoQuestionarioCompilatoCollection(
                cittadino,
                servizioDBFetch);

        // salvo il questionario compilato su MySql
        this.salvaQuestionarioCompilatoSql(cittadino, servizioDBFetch, questionarioCompilatoCreato);

        // salvo il questionario Compilato su Mongo
        this.questionarioCompilatoMongoService.save(questionarioCompilatoCreato);
    }

    @LogMethod
    @LogExecutionTime
    public QuestionarioCompilatoEntity creaQuestionarioNonInviatoImportCsv(
            @NotNull final ServizioEntity servizioDBFetch, @NotNull final CittadinoEntity cittadino) {

        // creo il template questionario compilato per Mongo
        QuestionarioCompilatoCollection questionarioCompilatoCreato = creoQuestionarioCompilatoCollection(
                cittadino,
                servizioDBFetch);

        // salvo il questionario compilato su MySql
        QuestionarioCompilatoEntity questionarioCompilatoEntity = this.salvaQuestionarioCompilatoSqlImportCsv(cittadino,
                servizioDBFetch, questionarioCompilatoCreato);

        // salvo il questionario Compilato su Mongo
        this.questionarioCompilatoMongoService.save(questionarioCompilatoCreato);

        return questionarioCompilatoEntity;
    }

    @LogMethod
    @LogExecutionTime
    public QuestionarioCompilatoCollection creoQuestionarioCompilatoCollection(
            CittadinoEntity cittadino,
            ServizioEntity servizio) {
        final String idQuestionarioTemplateQ3AssociatoAlServizio = servizio.getIdTemplateCompilatoQ3();
        final Optional<SezioneQ3Collection> SezioneQuestionarioQ3DBFetch = sezioneQ3Respository
                .findById(idQuestionarioTemplateQ3AssociatoAlServizio);

        if (!SezioneQuestionarioQ3DBFetch.isPresent()) {
            final String messaggioErrore = String.format(
                    "Servizio con id={} non ha associato templateQ3 con id={} associato. "
                            + "Verifica che il templateQ3 con id={} esiste su MongoDB",
                    servizio.getId(), idQuestionarioTemplateQ3AssociatoAlServizio,
                    idQuestionarioTemplateQ3AssociatoAlServizio);
            throw new QuestionarioCompilatoException(messaggioErrore, CodiceErroreEnum.QT08);
        }

        List<DatiIstanza> sezioniQuestionarioTemplateIstanze = new ArrayList<>();

        String jsonStringSezioneQ1 = this.creaSezioneQuestionarioQ1ByCittadino(cittadino);

        // creo questionario compilato inserendo sezione: Q1 (Anagrafica Cittadino), Q3
        // (Anagrafica Servizio)
        QuestionarioCompilatoCollection questionarioCompilato = new QuestionarioCompilatoCollection();
        questionarioCompilato.setIdQuestionarioCompilato(UUID.randomUUID().toString());
        DatiIstanza q1 = new DatiIstanza();
        q1.setDomandaRisposta(new JsonObject(jsonStringSezioneQ1));

        String jsonStringSezioneQ2 = this.creaSezioneQuestionarioQ2ByCittadino(cittadino.getId(), servizio.getId());
        DatiIstanza q2 = new DatiIstanza();
        q2.setDomandaRisposta(new JsonObject(jsonStringSezioneQ2));

        DatiIstanza q3 = new DatiIstanza();
        q3.setDomandaRisposta(SezioneQuestionarioQ3DBFetch.get().getSezioneQ3Compilato());
        sezioniQuestionarioTemplateIstanze.add(q1);
        sezioniQuestionarioTemplateIstanze.add(q2);
        sezioniQuestionarioTemplateIstanze.add(q3);
        questionarioCompilato.setSezioniQuestionarioTemplateIstanze(sezioniQuestionarioTemplateIstanze);
        questionarioCompilato.setDataOraCreazione(new Date());
        questionarioCompilato.setDataOraUltimoAggiornamento(new Date());

        return questionarioCompilato;
    }

    @LogMethod
    @LogExecutionTime
    public String creaSezioneQuestionarioQ1ByCittadino(@NotNull final CittadinoEntity cittadino) {
        return String.format(SEZIONE_Q1_TEMPLATE,
                ID_DOMANDA_CODICE_FISCALE, cittadino.getCodiceFiscale(),
                ID_DOMANDA_CODICE_FISCALE_NON_DISPONIBILE, cittadino.getCodiceFiscale() == null
                        || cittadino.getCodiceFiscale().isEmpty(),
                ID_DOMANDA_TIPO_DOCUMENTO, null, //cittadino.getTipoDocumento(),
                ID_DOMANDA_NUMERO_DOCUMENTO, null, //cittadino.getNumeroDocumento(),
                ID_DOMANDA_GENERE, cittadino.getGenere(),
                ID_DOMANDA_FASCIA_DI_ETA, cittadino.getFasciaDiEta().getFascia(),
                ID_DOMANDA_TITOLO_DI_STUDIO, cittadino.getTitoloDiStudio(),
                ID_DOMANDA_STATO_OCCUPAZIONALE, cittadino.getOccupazione(),
                ID_DOMANDA_PROVINCIA, cittadino.getProvinciaDiDomicilio(),
                ID_DOMANDA_CITTADINANZA, cittadino.getCittadinanza());
    }

    @LogMethod
    @LogExecutionTime
    public String creaSezioneQuestionarioQ2ByCittadino(@NotNull final Long idCittadino,
            @NotNull final Long idServizio) {
        Optional<ServizioEntity> primoServizio = servizioSqlService.getPrimoServizioByIdCittadino(idServizio,
                idCittadino);
        Boolean esistePrimoServizio = primoServizio.isPresent();

        String tipologiaServiziString = "";

        if (esistePrimoServizio) {
            List<TipologiaServizioEntity> tipologiaServiziList = primoServizio.get().getListaTipologiaServizi();

            if (tipologiaServiziList != null && tipologiaServiziList.size() > 0) {
                StringBuilder tipologiaServiziStringBuilder = new StringBuilder();
                tipologiaServiziList.forEach(tipologiaServizio -> {
                    if (tipologiaServizio.getTitolo() != null) {
                        tipologiaServiziStringBuilder.append(tipologiaServizio.getTitolo().concat(", "));
                    }
                });
                tipologiaServiziString = tipologiaServiziStringBuilder.substring(0,
                        tipologiaServiziStringBuilder.length() - 2);
            }
        }
        final String jsonStringSezioneQ2 = String.format(SEZIONE_Q2_TEMPLATE,
                ID_DOMANDA_PRIMA_VOLTA, esistePrimoServizio ? "No" : "Sì",
                ID_DOMANDA_TIPO_PRIMO_SERVIZIO, esistePrimoServizio ? tipologiaServiziString : "");

        return jsonStringSezioneQ2;
    }

    @LogMethod
    @LogExecutionTime
    @Transactional(rollbackFor = Exception.class)
    public void salvaQuestionarioCompilatoSql(
            @NotNull final CittadinoEntity cittadino,
            @NotNull final ServizioEntity servizio,
            @NotNull final QuestionarioCompilatoCollection questionarioCompilatoCollection) {
        QuestionarioCompilatoEntity questCompilatoMySql;
        questCompilatoMySql = new QuestionarioCompilatoEntity();
        questCompilatoMySql.setId(questionarioCompilatoCollection.getIdQuestionarioCompilato());
        questCompilatoMySql.setDataOraCreazione(new Date());
        questCompilatoMySql.setCittadino(cittadino);
        questCompilatoMySql.setDataOraAggiornamento(new Date());
        questCompilatoMySql.setIdEnte(servizio.getIdEnteSedeProgettoFacilitatore().getIdEnte());
        questCompilatoMySql.setIdFacilitatore(servizio.getIdEnteSedeProgettoFacilitatore().getIdFacilitatore());
        questCompilatoMySql.setIdProgetto(servizio.getIdEnteSedeProgettoFacilitatore().getIdProgetto());
        questCompilatoMySql.setIdSede(servizio.getIdEnteSedeProgettoFacilitatore().getIdSede());
        questCompilatoMySql.setIdServizio(servizio.getId());
        questCompilatoMySql.setStato(StatoQuestionarioEnum.NON_COMPILATA.toString());
        questCompilatoMySql.setIdQuestionarioTemplate(servizio.getIdQuestionarioTemplateSnapshot());

        this.questionarioCompilatoSqlRepository.save(questCompilatoMySql);

    }

    @LogMethod
    @LogExecutionTime
    public QuestionarioCompilatoEntity salvaQuestionarioCompilatoSqlImportCsv(
            @NotNull final CittadinoEntity cittadino,
            @NotNull final ServizioEntity servizio,
            @NotNull final QuestionarioCompilatoCollection questionarioCompilatoCollection) {
        QuestionarioCompilatoEntity questCompilatoMySql;
        questCompilatoMySql = new QuestionarioCompilatoEntity();
        questCompilatoMySql.setId(questionarioCompilatoCollection.getIdQuestionarioCompilato());
        questCompilatoMySql.setDataOraCreazione(new Date());
        questCompilatoMySql.setCittadino(cittadino);
        questCompilatoMySql.setDataOraAggiornamento(new Date());
        questCompilatoMySql.setIdEnte(servizio.getIdEnteSedeProgettoFacilitatore().getIdEnte());
        questCompilatoMySql.setIdFacilitatore(servizio.getIdEnteSedeProgettoFacilitatore().getIdFacilitatore());
        questCompilatoMySql.setIdProgetto(servizio.getIdEnteSedeProgettoFacilitatore().getIdProgetto());
        questCompilatoMySql.setIdSede(servizio.getIdEnteSedeProgettoFacilitatore().getIdSede());
        questCompilatoMySql.setIdServizio(servizio.getId());
        questCompilatoMySql.setStato(StatoQuestionarioEnum.NON_COMPILATA.toString());
        questCompilatoMySql.setIdQuestionarioTemplate(servizio.getIdQuestionarioTemplateSnapshot());
        return this.questionarioCompilatoSqlRepository.save(questCompilatoMySql);
    }

    @LogMethod
    @LogExecutionTime
    @Transactional(rollbackFor = Exception.class)
    public List<CittadinoUploadBean> caricaCittadiniSuServizio(MultipartFile fileCittadiniCSV, Long idServizio,
            String codiceFiscaleUtenteLoggato) {
        List<CittadinoUploadBean> esiti = new ArrayList<>();

        if (this.servizioSqlService.getServizioById(idServizio) == null) {
            throw new ServizioException("Servizio con id " + idServizio + " non esistente", CodiceErroreEnum.S09);
        }

        // Verifico se il facilitatore è il creatore di quel servizio
        if (!this.servizioSqlRepository.findByFacilitatoreAndIdServizio(codiceFiscaleUtenteLoggato, idServizio)
                .isPresent()) {
            final String messaggioErrore = String.format(
                    "Servizio non accessibile per l'utente con codice fiscale '%s in quanto non risulta il creatore del servizio'",
                    codiceFiscaleUtenteLoggato);
            throw new ServizioException(messaggioErrore, CodiceErroreEnum.A02);
        }

        try {
            // estraggo i cittadini dal file csv
            List<CittadinoUploadBean> cittadiniUpload = CSVServizioUtil
                    .excelToCittadini(fileCittadiniCSV.getInputStream());
            for (CittadinoUploadBean cittadinoUpload : cittadiniUpload) {
                if (this.checkPassCittadinoUpload(cittadinoUpload)) {
                    Pattern pattern = Pattern.compile(CF_REGX);
                    String cf = cittadinoUpload.getCodiceFiscale();
                    Matcher matcher = pattern.matcher(cf != null ? cf : "");
                    if ((cf != null
                            && !("").equals(cf)
                            && matcher.find())
                            || (cf == null)) {
                        bonificaRecordUpload(cittadinoUpload);
                        Optional<CittadinoEntity> optionalCittadinoDBFetch = this.cittadinoService
                                .getCittadinoByCodiceFiscale(cittadinoUpload.getCodiceFiscale());

                        CittadinoEntity cittadino = new CittadinoEntity();
                        // se il cittadino non esiste già a sistema
                        if (!optionalCittadinoDBFetch.isPresent()) {
                            try {
                                popolaCittadino(cittadino, cittadinoUpload);
                                inserisciCittadino(cittadino, idServizio);
                                cittadinoUpload.setEsito("UPLOAD - OK");
                            } catch (NumberFormatException e) {
                                cittadinoUpload.setEsito("UPLOAD - KO - ANNO DI NASCITA IN FORMATO NON VALIDO");
                            }
                        } else {
                            CittadinoEntity cittadinoDBFetch = optionalCittadinoDBFetch.get();
                            // verifico se già esiste il cittadino per quel determinato servizio
                            // e in caso affermativo aggiungo KO
                            if (this.esisteCittadinoByIdServizioAndIdCittadino(idServizio, cittadinoDBFetch.getId())) {
                                cittadinoUpload.setEsito(String.format(
                                        "UPLOAD - KO - CITTADINO GIA' ESISTENTE SUL SERVIZIO",
                                        cittadinoDBFetch.getCodiceFiscale(),
                                        idServizio));
                            } else {
                                cittadino.setId(cittadinoDBFetch.getId());
                                try {
                                    popolaCittadino(cittadino, cittadinoUpload);
                                    inserisciCittadino(cittadino, idServizio);
                                    cittadinoUpload.setEsito("UPLOAD - OK");
                                } catch (NumberFormatException e) {
                                    cittadinoUpload.setEsito("UPLOAD - KO - ANNO DI NASCITA IN FORMATO NON VALIDO");
                                }
                            }
                        }
                    } else {
                        cittadinoUpload.setEsito("UPLOAD - KO - FORMATO CF NON VALIDO");
                    }
                }
                esiti.add(cittadinoUpload);
            }

            return esiti;
        } catch (IOException e) {
            throw new ServizioException("Impossibile effettuare upload lista cittadini", e, CodiceErroreEnum.CIT01);
        }
    }

    private boolean checkPassCittadinoUpload(CittadinoUploadBean cittadinoUpload) {
        final String codiceFiscale = cittadinoUpload.getCodiceFiscale();
        if ((codiceFiscale == null || "".equals(codiceFiscale.trim()))
                ){
            cittadinoUpload.setEsito(
                    "UPLOAD - KO - CODICE FISCALE" +/*, NUMERO DOCUMENTO", TIPO DOCUMENTO*/  " NON VALORIZZATO");
            return false;
        }
        if (cittadinoUpload.getGenere() == null || "".equals(cittadinoUpload.getGenere().trim())) {
            cittadinoUpload.setEsito("UPLOAD - KO - GENERE DEVE ESSERE VALORIZZATO");
            return false;
        }
        if (cittadinoUpload.getFasciaDiEtaId() == null || "".equals(cittadinoUpload.getFasciaDiEtaId())) {
            cittadinoUpload.setEsito("UPLOAD - KO - FASCIA_ETA DEVE ESSERE VALORIZZATO");
            return false;
        }
        if (cittadinoUpload.getTitoloStudio() == null || "".equals(cittadinoUpload.getTitoloStudio().trim())) {
            cittadinoUpload.setEsito("UPLOAD - KO - TITOLO_STUDIO DEVE ESSERE VALORIZZATO");
            return false;
        }
        if (cittadinoUpload.getStatoOccupazionale() == null
                || "".equals(cittadinoUpload.getStatoOccupazionale().trim())) {
            cittadinoUpload.setEsito("UPLOAD - KO - STATO_OCCUPAZIONALE DEVE ESSERE VALORIZZATO");
            return false;
        }
        if (cittadinoUpload.getCittadinanza() == null || "".equals(cittadinoUpload.getCittadinanza().trim())) {
            cittadinoUpload.setEsito("UPLOAD - KO - CITTADINANZA DEVE ESSERE VALORIZZATO");
            return false;
        }
        return true;
    }

    private void bonificaRecordUpload(CittadinoUploadBean cittadinoUpload) {
        if (cittadinoUpload.getFasciaDiEtaId() != null)
            cittadinoUpload.setFasciaDiEtaId(cittadinoUpload.getFasciaDiEtaId().replace("'", "’"));
        if (cittadinoUpload.getCittadinanza() != null)
            cittadinoUpload.setCittadinanza(cittadinoUpload.getCittadinanza().replace("'", "’"));
        if (cittadinoUpload.getCodiceFiscale() != null)
            cittadinoUpload.setCodiceFiscale(cittadinoUpload.getCodiceFiscale().replace("'", "’"));
        if (cittadinoUpload.getGenere() != null)
            cittadinoUpload.setGenere(cittadinoUpload.getGenere().replace("'", "’"));
        if (cittadinoUpload.getStatoOccupazionale() != null)
            cittadinoUpload.setStatoOccupazionale(cittadinoUpload.getStatoOccupazionale().replace("'", "’"));
        if (cittadinoUpload.getTitoloStudio() != null)
            cittadinoUpload.setTitoloStudio(cittadinoUpload.getTitoloStudio().replace("'", "’"));
    }

    public void inserisciCittadino(CittadinoEntity cittadino, Long idServizio) {
        cittadino = cittadinoRepository.save(cittadino);

        // associo il cittadino al servizio
        this.associaCittadinoAServizio(idServizio, cittadino, null);

        // recupero il servizio
        ServizioEntity servizioDBFetch = servizioSqlService.getServizioById(idServizio);

        if (StatoEnum.NON_ATTIVO.getValue().equals(servizioDBFetch.getStato())) {
            servizioDBFetch.setStato(StatoEnum.ATTIVO.getValue());
            servizioSqlRepository.save(servizioDBFetch);
        }

        // creo il questionario in stato NON_INVIATO
        this.creaQuestionarioNonInviato(servizioDBFetch, cittadino);

    }

    public void popolaCittadino(CittadinoEntity cittadino, CittadinoUploadBean cittadinoUpload) {
        cittadino.setCodiceFiscale(cittadinoUpload.getCodiceFiscale());
        cittadino.setDataOraCreazione(new Date());
        cittadino.setDataOraAggiornamento(new Date());

        cittadino
                .setFasciaDiEta(fasciaDiEtaRepository.findById(Long.valueOf(cittadinoUpload.getFasciaDiEtaId())).get());
        cittadino.setCittadinanza(cittadinoUpload.getCittadinanza());
        cittadino.setGenere(cittadinoUpload.getGenere());
        cittadino.setOccupazione(cittadinoUpload.getStatoOccupazionale());
        cittadino.setTitoloDiStudio(cittadinoUpload.getTitoloStudio());
    }

    /*
     * @LogMethod
     * 
     * @LogExecutionTime
     * public void inviaQuestionario(@NotNull final String idQuestionario, @NotNull
     * final Long idCittadino) {
     * QuestionarioCompilatoEntity questionarioCompilato =
     * questionarioCompilatoSqlRepository.findById(idQuestionario)
     * .orElseThrow(() -> new ServizioException("id questionario inesistente",
     * CodiceErroreEnum.Q01) );
     * CittadinoEntity cittadino = questionarioCompilato.getCittadino();
     * 
     * if(cittadino == null || !idCittadino.equals(cittadino.getId())) {
     * throw new ServizioException("coppia cittadino - id questionario inesistente",
     * CodiceErroreEnum.Q01);
     * }
     * inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(idQuestionario,
     * questionarioCompilato, cittadino);
     * }
     */

    /*
     * @LogMethod
     * 
     * @LogExecutionTime
     * 
     * @Transactional(rollbackFor = Exception.class)
     * public void inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(
     * final String idQuestionario,
     * QuestionarioCompilatoEntity questionarioCompilato,
     * CittadinoEntity cittadino) {
     * if(questionarioCompilato.getStato().equals(StatoQuestionarioEnum.COMPILATO.
     * getValue()))
     * throw new ServizioException("Il questionario risulta già compilato",
     * CodiceErroreEnum.Q02);
     * //inviaLinkAnonimo(cittadino,idQuestionario);
     * questionarioCompilato.setStato(StatoQuestionarioEnum.INVIATO.getValue());
     * questionarioCompilatoSqlRepository.save(questionarioCompilato);
     * }
     */

    /*
     * @LogMethod
     * 
     * @LogExecutionTime
     * 
     * @Transactional(rollbackFor = Exception.class)
     * public void inviaLinkAnonimo(CittadinoEntity cittadino,String idQuestionario)
     * {
     * new Thread( () -> {
     * try {
     * String token = this.generaToken(cittadino, idQuestionario);
     * //recuper nome e data servizio
     * ServizioEntity servizio =
     * servizioSqlRepository.findServizioByQuestionarioCompilato(idQuestionario).get
     * ();
     * SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
     * String[] argsTemplate = new String[] { cittadino.getNome(),
     * servizio.getNome(), sdf.format(servizio.getDataServizio()), idQuestionario,
     * token};
     * 
     * // stacco un thread per invio email
     * this.emailService.inviaEmail(
     * cittadino.getEmail(),
     * EmailTemplateEnum.QUESTIONARIO_ONLINE,
     * argsTemplate
     * );
     * } catch(Exception ex) {
     * log.error("Impossibile inviare la mail al cittadino con id={}.",
     * cittadino.getId());
     * log.error("{}", ex);
     * throw new ServizioException("Impossibile inviare la mail", ex,
     * CodiceErroreEnum.E01);
     * }
     * }).start();
     * }
     */

    @Transactional(rollbackFor = Exception.class)
    @LogMethod
    @LogExecutionTime
    public String generaToken(CittadinoEntity cittadino, String idQuestionarioCompilato) {
        // Recupera QuestionarioInviato a partire dal questionario compialato e codice
        // fiscale/numDocumento cittadino se esiste.
        // Altrimenti crea un QuestionarioInviato ex-novo
        QuestionarioInviatoOnlineEntity invioQuestionario = questionarioInviatoOnlineRepository
                .findByIdQuestionarioCompilatoAndCodiceFiscale(idQuestionarioCompilato, cittadino.getCodiceFiscale())
                .orElse(null);

        invioQuestionario.setCodiceFiscale(cittadino.getCodiceFiscale());
        // invioQuestionario.setNumDocumento(cittadino.getNumeroDocumento());
        invioQuestionario.setIdQuestionarioCompilato(idQuestionarioCompilato);

        String token = UUID.randomUUID().toString();
        invioQuestionario.setToken(token);
        invioQuestionario.setDataOraCreazione(new Date());

        questionarioInviatoOnlineRepository.save(invioQuestionario);

        return token;
    }

    /*
     * @Transactional
     * 
     * @LogMethod
     * 
     * @LogExecutionTime
     * public void inviaQuestionarioATuttiCittadiniNonAncoraInviatoByServizio(Long
     * idServizio, String codiceFiscaleUtenteLoggato)
     * {
     * // Verifico se il facilitatore è il creatore di quel servizio
     * if( !this.servizioSqlRepository.findByFacilitatoreAndIdServizio(
     * codiceFiscaleUtenteLoggato, idServizio).isPresent() ) {
     * final String messaggioErrore = String.
     * format("Servizio non accessibile per l'utente con codice fiscale '%s in quanto non risulta il creatore del servizio'"
     * ,codiceFiscaleUtenteLoggato);
     * throw new ServizioException(messaggioErrore, CodiceErroreEnum.A02);
     * }
     * 
     * // recupero tutti i questionari compilati con STATO = NON INVIATO per quel
     * servizio
     * List<QuestionarioCompilatoEntity> questionarioCompilatoList =
     * this.questionarioCompilatoSqlRepository.findByIdServizioAndStato(idServizio,
     * StatoQuestionarioEnum.NON_INVIATO.toString());
     * 
     * questionarioCompilatoList
     * .stream()
     * .forEach(questionarioCompilato -> {
     * String idQuestionarioCompilato = questionarioCompilato.getId();
     * CittadinoEntity cittadinoAssociatoQuestionarioCompilato =
     * questionarioCompilato.getCittadino();
     * this.inviaLinkAnonimoAndAggiornaStatoQuestionarioCompilato(
     * idQuestionarioCompilato, questionarioCompilato,
     * cittadinoAssociatoQuestionarioCompilato);
     * });
     * }
     */

    public boolean checkPermessoIdQuestionarioCompilato(SceltaProfiloParam sceltaProfilo, String idQuestionario) {
        switch (sceltaProfilo.getCodiceRuoloUtenteLoggato()) {
            case "FAC":
            case "VOL":
                Long servizioId = questionarioCompilatoSqlRepository.findById(idQuestionario).get().getIdServizio();
                return servizioSqlRepository.findById(servizioId).get().getIdEnteSedeProgettoFacilitatore()
                        .getIdFacilitatore().equals(sceltaProfilo.getCfUtenteLoggato());
        }
        return false;
    }
}