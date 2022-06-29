interface RolesTableI {
  [key: string]: {
    label: string;
  };
}

const rolesTable: RolesTableI = {
  DTD: {
    label: 'Dipartimento per la trasformazione digitale',
  },
  DSCU: {
    label:
      'Dipartimento per le politiche giovanili e il Servizio Civile Universale',
  },
};

export const getRoleLabel = (role = '-') =>
  rolesTable[role.toUpperCase()]?.label || role;
