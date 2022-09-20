package it.pa.repdgt.opendata.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import it.pa.repdgt.opendata.bean.OpenDataCittadinoCSVBean;
import it.pa.repdgt.opendata.projection.OpenDataCittadinoProjection;
import it.pa.repdgt.opendata.repository.CittadinoRepository;
import it.pa.repdgt.shared.awsintegration.service.S3Service;
import lombok.Setter;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@ExtendWith(MockitoExtension.class)
public class OpenDataServiceTest {
	
	@Mock
	private S3Service s3Service;
	@Mock
	private OpenDataCSVService openDataCSVService;
	@Mock
	private CittadinoRepository cittadinoRepository;

	@Autowired
	@InjectMocks
	private OpenDataService openDataService;
	
	@Value("${AWS.S3.BUCKET-NAME:}")
	private String nomeDelBucketS3;
	final static String NOME_FILE = "opendata_cittadini.csv";
	List<OpenDataCittadinoCSVBean> listaOpenDataCittadino;
	OpenDataCittadinoProjectionImplementation openDataCittadinoProjection;
	File file;
	ResponseBytes<GetObjectResponse> responseBytes;
	
	@BeforeEach
	public void setUp() {
		openDataCittadinoProjection = new OpenDataCittadinoProjectionImplementation();
		openDataCittadinoProjection.setIdProgetto("1L");
		openDataCittadinoProjection.setIdProgramma("1L");
		file = new File(NOME_FILE);
	}
	
	@Test
	public void caricaFileListaCittadiniSuAmazonS3Test() throws IOException {
		when(this.openDataCSVService.getAllOpenDataCittadino()).thenReturn(listaOpenDataCittadino);
		doNothing().when(cittadinoRepository).azzeraCountDownloadAndAggiornaDimensioneFile(NOME_FILE, String.valueOf(0L));
		openDataService.caricaFileListaCittadiniSuAmazonS3();
	}
	
	@Test
	public void cancellaFileTest() throws IOException {
		file.createNewFile();
		openDataService.cancellaFile(file);
	}
	
	@Test
	public void cancellaFileKOTest() throws IOException {
		//test KO per file inesistente
		Assertions.assertThrows(FileNotFoundException.class, () -> openDataService.cancellaFile(file));
		assertThatExceptionOfType(FileNotFoundException.class);
	}
	
	@Test
	public void getCountFileTest() throws IOException {
		when(cittadinoRepository.getCountDownload(NOME_FILE)).thenReturn(1L);
		openDataService.getCountFile(NOME_FILE);
	}
	
	@Test
	public void getPresignedUrlTest() throws IOException {
		doNothing().when(cittadinoRepository).updateCountDownload(Mockito.anyString(), Mockito.any(Date.class));
		when(this.s3Service.getPresignedUrl(NOME_FILE, this.nomeDelBucketS3)).thenReturn(NOME_FILE);
		openDataService.getPresignedUrl(NOME_FILE);
	}
	
	@Test
	public void getDimensioneFileOpenDataTest() {
		when(cittadinoRepository.findDimensioneFileOpenData(NOME_FILE)).thenReturn("4309");
		openDataService.getDimensioneFileOpenData(NOME_FILE);
	}
	
	@Setter
	public class OpenDataCittadinoProjectionImplementation implements OpenDataCittadinoProjection {
		private String genere;
		private String titoloDiStudio;
		private Integer annoDiNascita;
		private String occupazione;
		private String policy;
		private String servizioId;
		private String tipologiaServizio;
		private String nomeServizio;
		private String IdTemplateQ3Compilato;
		private String sedeId;
		private String nomeSede;
		private String comuneSede;
		private String provinciaSede;
		private String regioneSede;
		private String capSede;
		private String idProgramma;
		private String idProgetto;

		@Override
		public String getGenere() {
			return genere;
		}

		@Override
		public String getTitoloDiStudio() {
			return titoloDiStudio;
		}

		@Override
		public Integer getAnnoDiNascita() {
			return annoDiNascita;
		}

		@Override
		public String getOccupazione() {
			return occupazione;
		}

		@Override
		public String getPolicy() {
			return policy;
		}

		@Override
		public String getServizioId() {
			return servizioId;
		}

		@Override
		public String getTipologiaServizio() {
			return tipologiaServizio;
		}

		@Override
		public String getNomeServizio() {
			return nomeServizio;
		}

		@Override
		public String getIdTemplateQ3Compilato() {
			return IdTemplateQ3Compilato;
		}

		@Override
		public String getSedeId() {
			return sedeId;
		}

		@Override
		public String getNomeSede() {
			return nomeSede;
		}

		@Override
		public String getComuneSede() {
			return comuneSede;
		}

		@Override
		public String getProvinciaSede() {
			return provinciaSede;
		}

		@Override
		public String getRegioneSede() {
			return regioneSede;
		}

		@Override
		public String getCapSede() {
			return capSede;
		}

		@Override
		public String getIdProgramma() {
			return idProgramma;
		}

		@Override
		public String getIdProgetto() {
			return idProgetto;
		}
		
	}
}
