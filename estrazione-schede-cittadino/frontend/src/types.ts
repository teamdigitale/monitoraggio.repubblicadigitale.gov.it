export interface PrimoServizioCittadino {
  idCittadino: number;
  codiceFiscale: string;
  genere: string | null;
  fascia: string | null;
  titoloDiStudio: string | null;
  occupazione: string | null;
  cittadinanza: string | null;
  idServizio: number | null;
  regioneProvincia: string | null;
  nomeGestore: string | null;
  cup: string | null;
  nomeServizio: string | null;
  nomePuntoFacilitazione: string | null;
  indirizzoPuntoFacilitazione: string | null;
  nomeFacilitatore: string | null;
  dataServizio: string | null;
  tipologiaServizio: string | null;
  competenzaDigitale: string | null;
  policyProgramma: string | null;
}

export interface ScartoRicerca {
  riga: number;
  codice: string;
}

export interface RicercaMultiplaResult {
  trovati: PrimoServizioCittadino[];
  nonTrovati: ScartoRicerca[];
}
