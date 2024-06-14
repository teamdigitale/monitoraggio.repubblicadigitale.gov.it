package it.pa.repdgt.shared.exception;

import lombok.Getter;

@Getter
public enum CodiceErroreEnum {
	C01("Errore Risorsa non trovata"), C02("Errore storicizazione ente"),
	C03("Errore Utente con ruolo DEGP/REGP non definito per il progetto"),
	C04("Errore Utente con ruolo DEG/REG non definito per il programma"),
	C05("Errore Utente con ruolo DEPP/REPP non definito per il progetto"),
	C06("Errore Combinazione (Programma,Progetto) non trovata"), C07("Errore integrazione dati utente")

	, G01("Errore Generico"), G02("Errore Richiesta errata"), G03("Errore Pagina richista non esistente")

	, R01("Errore Ruolo già esistente"), R02("Errore impossibile aggiornare il ruolo"),
	R03("Errore impossibile cancellare il ruolo DTD/DSCU"), R04("Errore impossibile cancellare il ruoli predefiniti"),
	R05("Errore impossibile cancellare ruolo associato ad utente"), R06("Errore impossibile cancellare ruolo"),
	R07("Errore impossibile attivare il ruolo per l'utente"), R08("Errore Tipologia ruolo non presente"),
	R09("Errore Impossibile aggiornare ruolo predefinito"), R10("Errore Impossibile cancellare i ruoli di DTD e DSCU"),
	R11("Errore Impossibile cancellare i ruoli predefiniti"),
	R12("Errore Impossibile cancellare i ruoli associati agli utenti"),
	R13("Errore Impossibile assegnare un ruolo predefinito all'infuori di DTD e DSCU"),
	R14("Errore Il codice ruolo inserito non corrisponde a nessun ruolo esistente"),
	R15("Errore Impossibile cancellare un ruolo non associato all'utente"),
	RG01("Errore impossibile creare associazione ruolo al gruppo"),
	RG02("Errore impossibile aggiornare associazione ruolo al gruppo")

	, U01("Errore utente con codice fiscale già presente"), U02("Errore cancellazione utente con ruolo associato"),
	U03("Errore l'utente con codice fiscale possiede già il ruolo"),
	U04("Errore impossibile associare il ruolo all'utente"),
	U05("Errore Impossibile cancellare ruolo non associato all'utente"), U06("Errore ruolo non definito per l'utente"),
	U07("Errore utente con codice fiscale o numero documento già presente"),
	U08("Errore codice fiscale o numero documento non specificato"),
	U09("Errore impossibile aggiungere ruolo all'utente"), U10("Errore impossibile cancellare ruolo all'utente"),
	U11("Errore utente con id non trovato"), U12("Errore impossibile cancellare un utente che non esiste"),
	U13("Errore Impossibile cancellare l'utente con codice fiscale poiché ha almeno un ruolo associato"),
	U14("Errore Impossibile assegnare il ruolo con codice"),
	U15("Errore Impossibile assegnare il ruolo con codice poiché l'utente con id non esiste"),
	U16("Errore L'utente con id ha già il ruolo con codice assegnato"), U17("Errore download immagine profilo utente"),
	U18("Errore Associazione tra utente e ruolo non trovata."), U19("Errore export csv utenti"),
	U20("Errore utente con codice fiscale non esistente"), U21("Errore email utente già esistente"),
	U22("Errore upload immagine profilo ente"),
	U23("Errore utente con codice fiscale o numero documento già presente sul servizio indicato")
	,U24("Errore codice fiscale non disponibile")
	, S01("Errore file upload cittadino non valido"), S02("Errore export csv servizio"),
	S03("Errore servizio non accessibile per l'utente"),
	S04("Errore creazione servizio. Nessun questionario template associato al programma"),
	S05("Errore creazione servizio. Utente non ha ruolo FACILITATORE"),
	S06("Errore aggiornare servizio. Utente non ha ruolo FACILITATORE"),
	S07("Errore impossibile eliminare il servizio."),
	S08("Errore creazione servizio. Servizio con stesso nome già esistente"), S09("Errore servizio non esistente")

	, SD01("Errore creazione sede"), SD02("Errore aggiornamento sede")

	, Q01("Errore questionario template inesistente"), Q02("Errore Il questionario risulta già compilato"),
	QT01("Errore export csv questionari template"), QT02("Errore impossibile aggiornare il questionario"),
	QT03("Errore impossibile cancellare il questionario"),
	QT04("Errore impossibile recuperare il questionario poichè inesistente su MongoDB"),
	QT05("Errore impossibile recuperare il questionario poichè inesistente su MySql"),
	QT06("Errore impossibile avere un programma senza associato alcun questionario template"),
	QT07("Errore impossibile salvare il questionario template perchè id questionario template già esistente"),
	QT08("Errore creazione questionario compilato. SezioneQuestionarioQ3 attualmente associata al servizio del cittadino non presente su MongoDB.")

	, QC01("Errore questionario compilato non presente su mySql"),
	QC02("Errore questionario compilato non presente su MongoDB")

	, CIT01("Errore upload cittadini"), CIT02("Errore impossibile aggiornare cittadino"),
	CIT03("Errore export csv cittadini")

	, E01("Errore invio email")

	, EN01("Errore export csv enti"), EN02("Errore file upload enti non valido"),
	EN03("Errore Impossibile assegnare ente come gestore del programma"),
	EN04("Errore Impossibile assegnare referente/delegato ente partner per progetto"),
	EN05("Errore file upload enti partner non valido"),
	EN06("Errore Impossibile terminare/cancellare associazione referente"),
	EN07("Errore Impossibile associare facilitatore/volontario sulla sede-ente-progetto"),
	EN08("Errore Impossibile cancellare associazione facilitatore/volontario sulla sede-ente-progetto"),
	EN09("Errore Impossibile terminare/cancellare associazione Ente-Sede-Progetto"),
	EN10("Errore ente con partita iva già presente"),
	EN11("Errore Impossibile assegnare referente/delegato ente gestore programma per il programma "),
	EN12("Errore Impossibile assegnare referente/delegato ente gestore progetto per il progetto "),
	EN13("Errore Impossibile aggiornare ente"), EN14("Errore Impossibile modificare ente gestore programma"),
	EN15("Errore Impossibile modificare ente gestore progetto"),
	EN16("Errore Impossibile cancellare ente partner per progetto"),
	EN17("Errore Impossibile cancellare ente gestore programma per programma"),
	EN18("Errore Impossibile cancellare ente gestore progetto per progetto"),
	EN19("Errore Impossibile terminare ente gestore programma per programma"),
	EN20("Errore Impossibile terminare ente gestore progetto per progetto"),
	EN21("Errore Impossibile terminare ente partner per progetto"),
	EN22("Errore Impossibile terminare referente/delegato gestore programma"),
	EN23("Errore Impossibile terminare referente/delegato gestore progetto"),
	EN24("Errore Ente partner non presente per idEnte idProgetto indicati"),
	EN25("Errore Ente con stesso nome già esistente")

	, T01("Errore token non valido"), T02("Errore token scaduto")

	, P01("Errore creazione programma"),
	P02("Errore creazione programma. Questionario template default associato non esistente"),
	P03("Errore impossibile terminare programma"), P04("Errore impossibile cancellare programma"),
	P05("Errore impossibile assegnare programma ad ente gestore"), P06("Errore impossibile aggiornare programma"),
	P07("Errore impossibile associare questionario al programma"), P08("Errore export csv programmi")

	, PR01("Errore creazione progetto"), PR02("Errore impossibile cancellare progetto"),
	PR03("Errore impossibile terminare progetto"), PR04("Errore impossibile aggiornare progetto"),
	PR05("Errore impossibile assegnare progetto ad ente gestore"),
	PR06("Errore impossibile assegnare progetto ad al programma"), PR07("Errore attivare progetto"),
	PR08("Errore export csv progetti"),
	PR09("Errore Impossibile Assegnare gestore progetto per il progetto. Unico Facilitatore o Volontario attivo sul progetto")

	, D01("Errore chiamata servizio Drupal")

	, WD01("Errore creazione utente Workdocs"), WD02("Errore attivazione utente Workdocs")

	, RC01("Errore tecnico creazione utente RocketChat"), RC02("Errore creazione utente RocketChat"),
	RC03("Errore recupero token utente RocketChat")

	, A02("Errore tentativo accesso a risorsa non permesso"),
	A03("Non si dispone dei permessi per compilare il questionario"),
	A04("Sezionario q4 completamente mancante, almeno una risposta deve essere selezionata"),
	A05("La sezione q4 e' stata compilata ma nessuna risposta e' stata selezionata");

	private String descrizioneErrore;

	private CodiceErroreEnum(String descrizioneErrore) {
		this.descrizioneErrore = descrizioneErrore;
	}
}