import { TableRowI } from '../components/Table/table';

export interface RegistroAttivita extends TableRowI {
  operatore: string;
  dataInserimento?: string;
  totaleRigheFile: number;
  righeScartate: number;
  serviziAcquisiti: number;
  cittadiniAggiunti: number;
  rilevazioneDiEsperienzaCompilate: number;
  codiceRuoloUtenteLoggato: string;
  idEnte: number;
  idProgetto: number;
}
