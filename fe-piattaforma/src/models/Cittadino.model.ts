export interface Cittadino {
    id: number;
    codiceFiscale?: string;
    codiceFiscaleNonDisponibile: boolean;
    tipoDocumento?: string;
    numeroDocumento?: string;
    genere: string;
    fasciaDiEta: string;
    titoloDiStudio: string;
    occupazione: string;
    provinciaDiDomicilio: string;
    cittadinanza: string;
  }