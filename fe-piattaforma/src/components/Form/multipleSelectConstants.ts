
export const navigationDataOptions = [
    { label: 'Navigare, ricercare e filtrare dati, informazioni e contenuti digitali', value: 'dataNavigation' },
    { label: 'Valutare dati, informazioni e contenuti digitali', value: 'dataEvaluation' },
    { label: 'Gestire dati, informazioni e contenuti digitalii', value: 'dataManagement' },
  ];
  
  export const communicationsOptions = [
    { label: 'Interagire attraverso le tecnologie digitali', value: 'digitalTechnologiesInteraction' },
    { label: 'Condividere informazioni attraverso le tecnologie digitali', value: 'digitalTechnologiesSharing' },
    { label: 'Esercitare la cittadinanza attraverso le tecnologie digitali ', value: 'digitalTechnologiesCitizenship' },
    { label: 'Collaborare attraverso le tecnologie digitali', value: 'digitalTechnologiesCollaboration' },
    { label: 'Netiquette', value: 'netiquette' },
    { label: 'Gestire l’identità digitale', value: 'digitalIdentityManagement' },
    { label: 'Creazione di contenuti digitali ', value: 'digitalIdentityCreation' },
  ];
  
  export const securityOptions = [
    { label: 'Proteggere i dispositivi', value: 'devicesProtection' },
    { label: 'Proteggere i dati personali e la privacy', value: 'dataPrivacyProtection' },
    { label: 'Risolvere i problemi tecnici', value: 'technicalProblemsResolution' },
  ];
  
  export const groupOptions = [
    { label: 'Navigazione internet, alfabetizzazione e dati', options: navigationDataOptions },
    { label: 'Comunicazione e collaborazione', options: communicationsOptions },
    { label: 'Sicurezza', options: securityOptions },
  ];groupOptions