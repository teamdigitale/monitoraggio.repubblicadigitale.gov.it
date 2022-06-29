import React from 'react';
import Form from '../../Form/form';
import Input from '../../Form/input';

// This component can be customized to use location service when it
// will be implemented
// props list is basic but can be changed and extended for more features
// Now is use to select Headquarters address
interface AddressFormI {
  address: string;
  onAddressChange: (address: string) => void;
}

const AddressForm: React.FC<AddressFormI> = ({ address, onAddressChange }) => {
  return (
    <Form>
      <Form.Row>
        <Input
          className='mt-3'
          label={`Indirizzo`}
          col='col-12'
          value={address}
          onInputChange={(value) => onAddressChange(value as string)}
          placeholder='Inserisci un indirizzo'
        />
      </Form.Row>
    </Form>
  );
};

export default AddressForm;
