import React, { useEffect, useState } from 'react';
import Form from '../../Form/form';
import Input from '../../Form/input';
import axios from 'axios';
import Select from '../../Form/select';

/**
 * The address form get values for Provinces, cities and CAPs from static files
 * and in detail page every select field act like a readOnly/disabled input.
 * When a new province is selected I reset city and CAP but the select seem to be design
 * to not accept a value not in the options list, so it will continue to display previous
 * selection.
 */

interface Province {
  name: string;
  state: string;
}

interface City {
  name: string;
  cap: string[];
}

interface AddressFormI {
  address: string;
  CAP: string;
  province: string;
  city: string;
  onAddressChange: (
    address: string,
    province: string,
    city: string,
    CAP: string
  ) => void;
  formDisabled?: boolean | undefined;
}

const AddressForm: React.FC<AddressFormI> = ({
  address,
  CAP,
  province,
  city,
  onAddressChange,
  formDisabled = false,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [CAPS, setCAPS] = useState<string[]>([]);

  useEffect(() => {
    axios('/assets/indirizzi/province.json').then((res) =>
      setProvinces(
        res.data.map((province: any) => ({
          name: province.nome,
          state: province.regione,
        }))
      )
    );
  }, []);

  const onSelectProvince = (value: string) => {
    onAddressChange(address, value.split('/')[0], '', '');
    axios(`/assets/indirizzi/comuni/${value.split('/')[1]}.json`).then((res) =>
      setCities(
        res.data
          .filter(
            (city: any) =>
              city.provincia.nome.toLowerCase() ===
              value.split('/')[0].toLowerCase()
          )
          .map((city: any) => ({
            name: city.nome,
            province: city.provincia.nome,
            cap: city.cap,
          }))
      )
    );
  };

  const onSelectCity = (value: string) => {
    const selected = cities.find(
      (c) => c.name.toLowerCase() === value.toLowerCase()
    );

    if (selected) {
      onAddressChange(
        address,
        province,
        selected.name,
        selected.cap.length === 1 ? selected.cap[0] : ''
      );

      setCAPS([...selected.cap]);
    }
  };

  return (
    <Form formDisabled={formDisabled}>
      <Form.Row>
        <Input
          className='mb-3'
          label={`Indirizzo`}
          col='col-12 col-lg-6'
          value={address}
          onInputChange={(value) =>
            onAddressChange(value as string, CAP, province, city)
          }
          placeholder='Inserisci un indirizzo'
        />
        {formDisabled ? (
          <>
            <Input
              className='mt-6'
              label={`Provincia`}
              col='col-12 col-lg-6'
              value={province}
            />
            <Input
              className='mt-3'
              label={`CAP`}
              col='col-12 col-lg-6'
              value={CAP}
            />
            <Input
              className='mt-3'
              label={`Comune`}
              col='col-12 col-lg-6'
              value={city}
            />
          </>
        ) : (
          <>
            <Select
              className='mt-6'
              label='Provincia'
              col='col-12 col-lg-6'
              value={province}
              options={provinces.map((p) => ({
                value: `${p.name}/${p.state}`,
                label: p.name,
              }))}
              onInputChange={(value) => onSelectProvince(value as string)}
            />
            <Select
              className='mt-3'
              label='Comune'
              col='col-12 col-lg-6'
              value={city}
              options={cities.map((c, _i) => ({
                value: c.name,
                label: c.name,
              }))}
              onInputChange={(value) => onSelectCity(value as string)}
            />
            <Select
              className='mt-3'
              label='CAP'
              col='col-12 col-lg-6'
              value={CAP}
              options={CAPS.map((c) => ({ value: c, label: c }))}
              onInputChange={(value) =>
                onAddressChange(address, province, city, value as string)
              }
            />
          </>
        )}
      </Form.Row>
    </Form>
  );
};

export default AddressForm;
