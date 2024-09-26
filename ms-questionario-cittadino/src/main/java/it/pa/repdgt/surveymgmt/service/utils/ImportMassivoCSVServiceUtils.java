package it.pa.repdgt.surveymgmt.service.utils;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.entity.QuestionarioCompilatoEntity;
import it.pa.repdgt.shared.entity.ServizioEntity;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioSqlRepository;
import it.pa.repdgt.surveymgmt.repository.ServizioXCittadinoRepository;
import it.pa.repdgt.surveymgmt.service.ServizioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportMassivoCSVServiceUtils {

    @Autowired
    private ServizioXCittadinoRepository servizioXCittadinoRepository;
    @Autowired
    private ServizioSqlRepository servizioSqlRepository;
    @Autowired
    private QuestionarioCompilatoRepository questionarioCompilatoRepository;
    @Autowired
    private ServizioService servizioService;

    @Transactional
    public void rollbackCaricamentoMassivo(Long idRegistroAttivita) throws Exception {

        servizioXCittadinoRepository.deleteAllByCodInserimento(idRegistroAttivita.toString());
        List<ServizioEntity> listaServizi = servizioSqlRepository.findAllByCodInserimentoWithoutSXC(idRegistroAttivita.toString());
        List<QuestionarioCompilatoEntity> listaQuestionari = questionarioCompilatoRepository.findByCodInserimento(idRegistroAttivita.toString());
        servizioService.eliminaQuestionariMongoByListaQuestionari(listaQuestionari);
        servizioService.eliminaServiziMongoByListaServizi(listaServizi);
        questionarioCompilatoRepository.deleteAllByCodInserimento(idRegistroAttivita.toString());
        servizioService.eliminaTipologiaServizioByListaServizi(listaServizi);
        servizioService.eliminaServiziByListaServizi(listaServizi);

    }
    
}
