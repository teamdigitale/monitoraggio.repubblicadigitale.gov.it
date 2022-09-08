import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';
import Select, { OptionType, SelectI } from './select';

interface Country {
  prefix: string;
  code: string;
  label: string;
}

interface PrefixPhoneI extends SelectI {
  disabled?: boolean;
}

const defaultValue = { label: `IT +39`, value: '+39' };

const PrefixPhone: React.FC<PrefixPhoneI> = (props) => {
  const { disabled = false } = props;
  const [countries, setCountries] = useState<OptionType[]>([]);

  const initValues = async () => {
    const countryList = [
      ...(await axios('/assets/indirizzi/countries.json')).data,
    ];
    if (countryList?.length) {
      setCountries(
        countryList.map((country: Country) => ({
          label: `${country.code} ${country.prefix}`,
          value: country.prefix,
        }))
      );
    }
  };

  useEffect(() => {
    initValues();
  }, []);

  return (
    <Select
      {...props}
      label={props.label || 'Prefisso'}
      placeholder={props.placeholder || 'Seleziona prefisso'}
      col={props.col || 'col-4 col-lg-2'}
      options={countries}
      defaultValue={props.defaultValue || defaultValue}
      isDisabled={disabled}
    />
  );
};

export default memo(PrefixPhone);
