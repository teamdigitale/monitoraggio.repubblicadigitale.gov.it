export interface Cittadino {
  id?: number;
  codiceFiscale?: string;
  codiceFiscaleNonDisponibile: boolean;
  tipoDocumento?: string;
  numeroDocumento?: string;
  genere: string;
  fasciaDiEta: string;
  titoloDiStudio: string;
  occupazione: string;
  cittadinanza: string;
  provinciaDiDomicilio: string;
  nuovoCittadino?: boolean;
}

export interface CittadinoCSV extends Omit<Cittadino, "occupazione" | "fasciaDiEta" | "titoloDiStudio"> {
  fasciaDiEtaId: number;
  statoOccupazionale: string;
  titoloStudio: string;
  idEnte: string,
  idProgramma: string,
  idProgetto: string,
  cfUtenteLoggato:string;
}
