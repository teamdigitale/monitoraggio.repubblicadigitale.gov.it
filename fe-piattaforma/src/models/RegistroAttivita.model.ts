import { TableRowI } from '../components/Table/table';

export interface RegistroAttivita extends TableRowI {
  id: number;
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
  fileName: string;
  isFileUpdated?: boolean;
  jobStatus: string;
}

export type RegistroAttivitaWithoutID = Omit<RegistroAttivita, 'id'>;
