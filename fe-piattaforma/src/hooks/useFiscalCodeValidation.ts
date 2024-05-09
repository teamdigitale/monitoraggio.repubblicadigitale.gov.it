import { useCallback, useState } from 'react';
import { Validator } from '@marketto/codice-fiscale-utils';

export const useFiscalCodeValidation = () => {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const isValidFiscalCode = useCallback((query: string) => {
    return Validator.codiceFiscale(query).valid && query.length === 16;
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
