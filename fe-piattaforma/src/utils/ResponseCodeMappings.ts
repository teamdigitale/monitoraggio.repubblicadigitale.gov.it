const documentTypeMap: Record<string, string> = {
  A: 'Carta di Identità',
  B: 'Patente',
  C: 'Passaporto',
  D: 'Permesso di soggiorno',
  E: 'Altro',
};

const genderMap: Record<string, string> = {
  A: 'F',
  B: 'M',
  C: 'Non binario',
  D: 'Preferisco non rispondere',
};

const ageGroupMap: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

const educationLevelMap: Record<string, string> = {
  A: 'Licenza elementare',
  B: 'Licenza media',
  C: 'Diploma di scuola superiore',
  D: 'Istruzione post secondaria non terziaria',
  E: 'Diploma di qualifica professionale',
  F: 'Certificato di specializzazione tecnica superiore (IFTS)',
  G: 'Diploma di tecnico superiore (ITS)',
  H: 'Laurea a ciclo breve / diploma universitario',
  I: 'Laurea specialistica / magistrale / vecchio ordinamento o livello equivalente',
  J: 'Master o livello equivalente',
  K: 'Dottorato o livello equivalente',
  L: 'Non conosciuto / non fornito / altro',
};

const occupationalStatusMap: Record<string, string> = {
  A: 'Dipendente',
  B: 'Imprenditore',
  C: 'Libero professionista',
  D: 'Non occupato',
  E: 'Studente o studentessa / in formazione',
  F: 'Casalinga/o',
  G: 'Persona ritirata dal lavoro / pensionato/a',
  H: 'Altro',
};

const citizenshipMap: Record<string, string> = {
  A: 'Italiana',
  B: 'Straniera, di un Paese ALL’INTERNO dell’Unione Europea',
  C: 'Straniera, di un Paese AL DI FUORI dell’Unione Europea',
};

const serviceBookingTypeMap: Record<string, string> = {
  A: 'Facilitazione individuale',
  B: 'Facilitazione di gruppo',
  C: 'Formazione in presenza',
  D: 'Formazione online',
  E: 'Altro',
};

const serviceNameMap: Record<string, string> = {
  A: 'Facilitazione individuale',
  B: 'Facilitazione di gruppo',
  C: 'Formazione in presenza',
  D: 'Formazione online',
  E: 'Altro',
};

const firstLevelCompetenceMap: Record<string, string> = {
  A: 'Alfabetizzazione su informazioni e dati',
  B: 'Comunicazione e collaborazione',
  C: 'Creazione di contenuti digitali',
  D: 'Sicurezza',
  E: 'Risolvere i problemi tecnici (es.: software e hardware)',
};

const secondLevelCompetenceMap: Record<string, string> = {
  '1': 'Navigare, ricercare e filtrare dati, informazioni e contenuti digitali (es.: consultare siti istituzionali, cercare atti e norme, leggere notizie online, guardare video su piattaforme in abbonamento)',
  '2': 'Valutare dati, informazioni e contenuti digitali (es.: riconoscere le fake news)',
  '3': 'Gestire dati, informazioni e contenuti digitali (es.: organizzare file, scaricare contenuti multimediali, utilizzare videogiochi)',
  '4': 'Interagire attraverso le tecnologie digitali (es.: usare servizi di messaggistica istantanea, effettuare chiamate o videochiamate via Internet)',
  '5': 'Condividere informazioni attraverso le tecnologie digitali (es.: usare la PEC, comunicare il domicilio digitale)',
  '6': 'Esercitare la cittadinanza attraverso le tecnologie digitali (es.: utilizzare i servizi pubblici digitali, fare acquisti online, gestire servizi bancari e di pagamento via Internet)',
  '7': 'Collaborare attraverso le tecnologie digitali',
  '8': 'Conoscere le regole di comportamento per il reciproco rispetto online (netiquette)',
  '9': 'Gestire l’identità digitale (es.: richiedere e usare SPID, CNS e CIE e identificativi social)',
  '10': 'Creazione di contenuti digitali',
  '11': 'Proteggere i dispositivi (es.: impostare e gestire password, riconoscere ed evitare i messaggi di phishing)',
  '12': 'Proteggere i dati personali e la privacy (es.: gestire i cookie, comunicare dati bancari per i pagamenti online)',
  '13': 'Risolvere i problemi tecnici (es.: software e hardware)',
};

const publicServiceDomainMap: Record<string, string> = {
  A: 'App IO',
  B: 'Sistemi di pagamenti elettronici (pagoPA)',
  C: 'Servizi anagrafici tramite ANPR (es. richiedere certificati)',
  D: 'Fascicolo sanitario elettronico',
  E: 'Fatturazione elettronica',
  F: 'Cultura e turismo (es. consultare biblioteche e archivi, prenotare biglietti per musei e spettacoli o servizi turistici)',
  G: 'Istruzione (es. fare l’iscrizione a servizi per l’infanzia, mense e trasporti scolastici, richiedere agevolazioni, consultare il registro elettronico)',
  H: 'Formazione (es. iscriversi all’università o a corsi per adulti)',
  I: 'Sport (es. prenotazione impianti sportivi)',
  J: 'Servizi di sostegno all’occupazione (es. iscriversi al centro per l’impiego, consultare l’Informalavoro, rivolgersi a career service o servizi di consulenza)',
  K: 'Commercio e impresa (es. sportelli unici per le attività produttive)',
  L: 'Servizi previdenziali e assistenziali (es. accedere a prestazioni assistenziali e previdenziali, servizi per l’immigrazione)',
  M: 'Servizi sanitari diversi da FSE (es. prenotare visite ed esami con il Centro Unico di Prenotazione, scegliere il medico di famiglia, ritirare referti, richiedere l’assistenza domiciliare)',
  N: 'Adempimenti fiscali (es. dichiarazione dei redditi precompilata)',
  O: 'Servizi tributari e contravvenzioni (es. dichiarazioni IMU, TASI, TARi, consultazione accertamenti e pagamenti delle contravvenzioni)',
  P: 'Urbanistica ed edilizia (es. Gestire pratiche edilizie SCIA e CILA)',
  Q: 'Infrastrutture e mobilità (es. fare il biglietto o l’abbonamento per il trasporto pubblico locale, effettuare pagamenti per parcheggi, taxi e ZTL)',
  R: 'Utilizzo di piattaforme di partecipazione',
  S: 'Nessuna delle precedenti',
};

const discoveryMethodServiceMap: Record<string, string> = {
  A: 'Sportello',
  B: 'Telefono',
  C: 'Sito internet',
  D: 'Social media',
  E: 'TV',
  F: 'Radio',
  G: 'Giornale',
  H: 'Durante un evento online',
  I: 'Durante un evento in presenza',
  J: 'Durante un evento della Settimana nazionale per le competenze Digitali',
  K: 'Materiale informativo e promozionale stampato',
  L: 'Passaparola',
  M: 'Facilitatore/ Formatore',
};

const bookingReasonMap: Record<string, string> = {
  A: 'Migliorare nello studio',
  B: 'Ricerca di lavoro',
  C: 'Migliorare nel mio lavoro',
  D: 'Cambiare lavoro',
  E: 'Cultura e crescita personale',
  F: 'Avere maggiore dimestichezza nell’utilizzo dei servizi digitali in generale',
  G: 'Risolvere problemi specifici relativi ai servizi pubblici',
  H: 'Risolvere problemi specifici relativi agli acquisti e ai pagamenti online',
  I: 'Frequento volentieri questo punto di facilitazione',
  J: 'Non ho un motivo particolare',
  K: 'Recuperare un precedente servizio non fruito',
  L: 'Altro',
};

const repeatExperienceMap: Record<string, string> = {
  A: 'Sì, per facilitazione',
  B: 'Sì, per formazione',
  C: 'Non saprei',
  D: 'No, non ne ho bisogno',
  E: 'No, riconosco il bisogno ma non trovo giovamento nel tornare',
};

const digitalProblemSolvingMap: Record<string, string> = {
  A: 'Chiedere aiuto a parenti e amici',
  B: 'Chiedere aiuto ai colleghi',
  C: 'Punto di facilitazione',
  D: 'Facilitazione online (es.: videochiamata)',
  E: 'Formazione e seminari in presenza gratuiti',
  F: 'Formazione e seminari in presenza a pagamento',
  G: 'Formazione e seminari online',
  H: 'Piattaforma “ACCEDI”',
  I: 'Motori di ricerca su Internet',
  J: 'Video (es.: YouTube)',
  K: 'Podcast',
  L: 'Blog e forum online',
  M: 'Chat (es.: WhatsApp) e chatbot',
  N: 'Materiale informativo, giornali, articoli e altre pubblicazioni stampate',
  O: 'Materiale informativo, giornali, articoli e altre pubblicazioni online',
};

export {
  documentTypeMap,
  genderMap,
  ageGroupMap,
  educationLevelMap,
  occupationalStatusMap,
  publicServiceDomainMap,
  secondLevelCompetenceMap,
  firstLevelCompetenceMap,
  citizenshipMap,
  serviceBookingTypeMap,
  discoveryMethodServiceMap,
  bookingReasonMap,
  repeatExperienceMap,
  serviceNameMap,
  digitalProblemSolvingMap,
};
