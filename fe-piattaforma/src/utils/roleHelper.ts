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
