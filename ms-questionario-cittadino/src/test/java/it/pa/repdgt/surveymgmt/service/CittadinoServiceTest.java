package it.pa.repdgt.surveymgmt.service;

import java.util.List;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.projection.ProjectionFactory;
import it.pa.repdgt.shared.entity.CittadinoEntity;
import it.pa.repdgt.shared.entity.RuoloEntity;
import it.pa.repdgt.shared.entity.SedeEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.mapper.CittadinoMapper;
import it.pa.repdgt.surveymgmt.mongo.repository.QuestionarioCompilatoMongoRepository;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.param.FiltroListaCittadiniParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.projection.DettaglioServizioSchedaCittadinoProjection;
import it.pa.repdgt.surveymgmt.repository.CittadinoRepository;
import it.pa.repdgt.surveymgmt.repository.QuestionarioCompilatoRepository;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;

@ExtendWith(MockitoExtension.class)
public class CittadinoServiceTest {

	@Mock
	private CittadinoRepository cittadinoRepository;
	@Mock
	private RuoloService ruoloService;
	@Mock
	private SedeService sedeService;
	@Mock
	private EnteSedeProgettoFacilitatoreService enteSedeProgettoFacilitatoreService;
	@Mock
	private CittadinoMapper cittadinoMapper;
	@Mock
	private QuestionarioCompilatoRepository questionarioCompilatoRepository;
	@Mock
	private QuestionarioCompilatoMongoRepository questionarioCompilatoMongoRepository;

	@Autowired
	@InjectMocks
	private CittadinoService cittadinoService;

	CittadinoEntity cittadino;
	CittadiniPaginatiParam cittadiniPaginatiParam;
	RuoloEntity ruolo;
	List<RuoloEntity> listaRuoli;
	FiltroListaCittadiniParam filtro;
	SedeEntity sede1;
	List<String> listaIdsSedi;
	List<DettaglioServizioSchedaCittadinoProjection> listaDettagliCittadinoProjection;
	ProjectionFactory dettaglioSchedaCittadino;
	DettaglioServizioSchedaCittadinoProjection dettaglioSchedaCittadinoProjection;
	UtenteEntity facilitatore;
	CittadinoRequest cittadinoRequest;
	List<CittadinoProjection> listaCittadiniProjection;
	SceltaProfiloParam sceltaProfiloParam;
}
