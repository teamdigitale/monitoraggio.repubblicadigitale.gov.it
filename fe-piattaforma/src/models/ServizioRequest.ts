export interface ServizioRequest{
    nomeServizio: string;
    idEnteServizio: number;
    idEnte:number;
    idSedeServizio: number;
    idProgetto: number;
    idProgramma: number;
    cfUtenteLoggato:string;
    codiceRuoloUtenteLoggato:string;
    data: string;
    durataServizio: string;
    tipoDiServizioPrenotato: string[];
    sezioneQuestionarioCompilatoQ3: string;
  }