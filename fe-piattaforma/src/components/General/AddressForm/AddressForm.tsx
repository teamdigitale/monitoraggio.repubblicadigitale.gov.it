import React, { useCallback, useEffect, useState } from 'react';
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
  state: string;
  city: string;
  onAddressChange: (
    address: string,
    province: string,
    state: string,
    city: string,
    CAP: string
  ) => void;
  formDisabled?: boolean | undefined;
}

const AddressForm: React.FC<AddressFormI> = ({
  address,
  CAP,
  province,
  state,
  city,
  onAddressChange,
  formDisabled = false,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [CAPS, setCAPS] = useState<string[]>([]);

  const initValues = useCallback(() => {
    axios('/assets/indirizzi/province.json')
      .then((response) => {
        const provs = [...response.data];
        setProvinces(
          provs.map((province) => ({
            name: province.nome,
            state: province.regione,
          }))
        );
        if (province && state) {
          axios(`/assets/indirizzi/comuni/${state.toLowerCase()}.json`)
            .then((response) => {
              const cits = [...response.data];
              const filteredCities = cits.filter(
                (city) =>
                  city.provincia.nome.toLowerCase() === province.toLowerCase()
              );
              setCities(
                filteredCities.map((city) => ({
                  name: city.nome,
                  province: city.provincia.nome,
                  cap: city.cap,
                }))
              );
              const currentCity = filteredCities.find((c) => c.nome === city);
              if (currentCity) {
                setCAPS([...currentCity.cap]);
              }
            })
            .catch((error) => {
              console.error('Failed to fetch cities', error);
            });
        }
      })
      .catch((error) => {
        console.error('Failed to fetch provinces', error);
      });
  }, [city, province, state]);

  useEffect(() => {
    initValues();
  }, [province, city, initValues]);

  const onSelectProvince = (value: string) => {
    console.log(value, 'il value di select');
    value = setProvinceAndRegion(value);
    const [selectedProvince, selectedRegion] = value.split('/');
    const selectedState = selectedRegion.replace(/\s+/g, '-').toLowerCase();
    onAddressChange(address, selectedProvince, selectedState, city, CAP);

    axios(`/assets/indirizzi/comuni/${selectedState}.json`)
      .then((response) => {
        const citiesData = response.data.filter(
          (city: any) =>
            city.provincia.nome.toLowerCase() === selectedProvince.toLowerCase()
        );
        setCities(
          citiesData.map((city: any) => ({
            name: city.nome,
            province: city.provincia.nome,
            cap: city.cap,
          }))
        );
      })
      .catch((error) => {
        console.error('Failed to fetch cities for selected province', error);
      });
  };

  const setProvinceAndRegion = useCallback((value: string): string => {
    if (value.includes('Bolzano')) {
      return 'Bolzano/Trentino-Alto Adige';
    }
    return value;
  }, []);

  const onSelectCity = (value: string) => {
    const selected = cities.find(
      (c) => c.name.toLowerCase() === value.toLowerCase()
    );

    if (selected) {
      onAddressChange(
        address,
        province,
        state,
        selected.name,
        selected.cap.length === 1 ? selected.cap[0] : ''
      );
      setCAPS([...selected.cap]);
    }
  };

  return (
    <Form id='form-address' formDisabled={formDisabled} showMandatory={false}>
      <Form.Row>
        <Input
          className='mb-3'
          label={`Via e numero civico`}
          required
          disabled={formDisabled}
          col='col-12 col-lg-6'
          value={address}
          onInputChange={(value) =>
            onAddressChange(value as string, province, state, city, CAP)
          }
          placeholder='Inserisci un indirizzo'
        />
        {formDisabled ? (
          <>
            <Input
              // className='mt-6'
              label={`Provincia`}
              col='col-12 col-lg-6'
              value={province}
            />
            <Input
              // className='mt-3'
              label={`CAP`}
              col='col-12 col-lg-6'
              value={CAP}
            />
            <Input
              // className='mt-3'
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
              value={province && state ? `${province}/${state}` : ''}
              required
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
              isDisabled={!province}
              required
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
              isDisabled={!city}
              value={city ? CAP : ''}
              required
              options={CAPS.map((c) => ({ value: c, label: c }))}
              onInputChange={(value) =>
                onAddressChange(address, province, state, city, value as string)
              }
            />
          </>
        )}
      </Form.Row>
    </Form>
  );
};

export default AddressForm;
