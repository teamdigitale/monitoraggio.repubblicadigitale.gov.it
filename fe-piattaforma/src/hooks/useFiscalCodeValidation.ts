import { useCallback, useState } from 'react';
//import { Validator } from '@marketto/codice-fiscale-utils';
import CodiceFiscale from 'codice-fiscale-js'

export const useFiscalCodeValidation = () => {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const isValidFiscalCode = useCallback((query: string) => {
   // let result = Validator.codiceFiscale(query).valid && query.length === 16;
   return CodiceFiscale.check(query) && query.length === 16
  }, []);

  const onQueryChange = useCallback(
    (query: string) => {
      const upperCaseQuery = query.toUpperCase();
      setCanSubmit(isValidFiscalCode(upperCaseQuery));
    },
    [isValidFiscalCode]
  );

  return { canSubmit, onQueryChange, setCanSubmit,isValidFiscalCode };
};
