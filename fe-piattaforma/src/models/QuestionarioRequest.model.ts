import { ConsensoTrattamentoDatiRequestModel } from './ConsensoTrattamentoDatiRequest.model';
export interface QuestionarioRequestModel {
  fasciaDiEtaIdDaAggiornare: string | number;
  cittadinanzaDaAggiornare: string;
  codiceFiscaleDaAggiornare: string;
  genereDaAggiornare: string;
  numeroDocumentoDaAggiornare: string;
  occupazioneDaAggiornare: string;
  tipoDocumentoDaAggiornare?: string | undefined;
  titoloDiStudioDaAggiornare: string;
  consensoTrattamentoDatiRequest: ConsensoTrattamentoDatiRequestModel;
  sezioneQ1Questionario: string;
  sezioneQ2Questionario: string;
  sezioneQ3Questionario: string;
  sezioneQ4Questionario: string;
}