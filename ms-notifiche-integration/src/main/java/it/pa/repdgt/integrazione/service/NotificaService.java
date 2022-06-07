package it.pa.repdgt.integrazione.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import it.pa.repdgt.shared.awsintegration.service.EmailService;
import it.pa.repdgt.shared.entity.ProgettoEntity;
import it.pa.repdgt.shared.entity.UtenteEntity;
import it.pa.repdgt.shared.entityenum.StatoEnum;
import lombok.extern.slf4j.Slf4j;

@Service
@Scope("singleton")
@Slf4j
public class NotificaService {
	private final static int N = 10;
	@Autowired
	private ProgettoService progettoService;
	
	@Autowired
	private EmailService emailService;
	
//					   ┌───────────── second (0-59)
//					   │ ┌───────────── minute (0 - 59)
//					   │ │ ┌───────────── hour (0 - 23)
//					   │ │ │ ┌───────────── day of the month (1 - 31)
//					   │ │ │ │ ┌───────────── month (1 - 12) (or JAN-DEC)
//					   │ │ │ │ │ ┌───────────── day of the week (0 - 7)
//					   │ │ │ │ │ │              (or MON-SUN -- 0 or 7 is Sunday)
//					   │ │ │ │ │ │
//					   * * * * * *
	@Scheduled(cron = "0 0 0 * * *")
	public void inviaNotificaEmail() {
		final List<ProgettoEntity> progettiAttivabili = this.progettoService.getProgettoByStatoProgetto(StatoEnum.ATTIVABILE.getValue());
		
		for(ProgettoEntity attivabile : progettiAttivabili) {
			final Long giorniTrascorsiDaDataAttivabilitaProgetto = this.progettoService.getGiorniTrascorsiDaDataAttivabilitaProgetto(attivabile);

			if(giorniTrascorsiDaDataAttivabilitaProgetto == null) {
				log.warn("Manca Data attivibilità progetto - skip invio email");
				continue;
			}
//			Email da inviare è sempre e solo ai REFERENTI DI PROGETTO
//			String oggetto = "oggetto email di test";
//			String indirizzoDestinatario = "referentiGestoriDiQuelProgetto"; 
//			String corpoEmail = "<html><head>Email di test</head><body><p>Ciao Mondo</p></body></html>";
			
//			final List<String> indirizziInCC = new ArrayList<>();
			if(giorniTrascorsiDaDataAttivabilitaProgetto == N) {
				// logica invio notifica
				System.out.println("per il progetto con id " + attivabile.getId() + " sono passati "+"N"+" giorni");
				// metto in copia  nessuno
			}
			if(giorniTrascorsiDaDataAttivabilitaProgetto == 2*N) {
				// logica invio notifica
				System.out.println("per il progetto con id " + attivabile.getId() + " passati 2*"+"N"+" giorni");
				List<UtenteEntity> utentiReferentiDelegatiProgramma = this.progettoService.getReferentiProgramma(attivabile.getId());
				for(UtenteEntity referenteDelegato: utentiReferentiDelegatiProgramma) {
					System.out.println("referente: " + referenteDelegato.getNome() + " " + referenteDelegato.getCognome());
				}
				
				// metto in copia  REFERENTI DI PROGRAMMA
//				indirizziInCC.add();
			}
			if(giorniTrascorsiDaDataAttivabilitaProgetto >= 3*N) {
				// logica invio notifica
				System.out.println("per il progetto con id " + attivabile.getId() + " passati 3*"+"N"+" giorni");
				List<UtenteEntity> utentiReferentiDelegatiProgramma = this.progettoService.getReferentiProgramma(attivabile.getId());
				for(UtenteEntity referenteDelegato: utentiReferentiDelegatiProgramma) {
					System.out.println("referente: " + referenteDelegato.getNome() + " " + referenteDelegato.getCognome());
				}
				List<UtenteEntity> dtdS = this.progettoService.getDTDs();
				for(UtenteEntity dtd: dtdS) {
					System.out.println("DTD: " + dtd.getNome() + " " + dtd.getCognome());
				}
				// metto in copia REFERENTI DI PROGRAMMA e DTD
//				indirizziInCC.add();
			}
			
//			Invio Email
//			this.emailService.inviaEmail(oggetto, indirizzoMittente, indirizzoDestinatario, nomeTemplateHtml);
		}
	}
}