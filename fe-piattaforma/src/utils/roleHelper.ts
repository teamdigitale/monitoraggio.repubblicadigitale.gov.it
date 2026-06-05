import { userRoles } from '../pages/administrator/AdministrativeArea/Entities/utils';

interface RolesTableI {
  [key: string]: {
    label: string;
  };
}

const rolesTable: RolesTableI = {
  DTD: {
    label: 'DTD Amministratore',
  },
  DSCU: {
    label:
      'Dipartimento per le politiche giovanili e il Servizio Civile Universale',
  },
  REG: {
    label: 'Referente Ente Gestore Programma',
  },
  // TODO add here other roles
};

export const getRoleLabel = (role = '-') =>
  rolesTable[role.toUpperCase()]?.label || role;

/**
 * Codici ruolo che operano a livello "programma": il discriminante per
 * identificare univocamente la card del profilo attivo e' `idProgramma`.
 */
export const PROGRAMMA_ROLE_CODES: readonly string[] = [
  userRoles.REG,
  userRoles.DEG,
];

/**
 * Codici ruolo che operano a livello "progetto": il discriminante per
 * identificare univocamente la card del profilo attivo e' `idProgetto`.
 */
export const PROGETTO_ROLE_CODES: readonly string[] = [
  userRoles.REGP,
  userRoles.DEGP,
  userRoles.VOL,
  userRoles.FAC,
  userRoles.REPP,
  userRoles.DEPP,
];

export const isProgrammaRole = (codiceRuolo?: string): boolean =>
  !!codiceRuolo && PROGRAMMA_ROLE_CODES.includes(codiceRuolo);

export const isProgettoRole = (codiceRuolo?: string): boolean =>
  !!codiceRuolo && PROGETTO_ROLE_CODES.includes(codiceRuolo);
