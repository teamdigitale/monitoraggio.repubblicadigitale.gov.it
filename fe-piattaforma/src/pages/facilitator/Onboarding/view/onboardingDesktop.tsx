import React from 'react';
import { Button, Icon } from 'design-react-kit';
import { Form, Input, Select } from '../../../../components';
import '../onboarding.scss';
import Profile from '/public/assets/img/change-profile.png';
import { OnboardingI } from '../onboarding';

const OnboardingDesktop: React.FC<OnboardingI> = (props) => {
  console.log('OnboardingDesktop', props);

  const {
    addProfilePicture,
    onInputChange,
    onSubmitForm,
    optionsSelect,
    form,
  } = props;

  return (
    <div className='mt-5'>
      <h1 className='h3 mt-2 mb-2 text-primary'>
        Compila i dati del tuo profilo e completa la registrazione
      </h1>
      <div className='col-12  mt-4'>
        <p className='h6 complementary-1-color-b8 font-weight-normal'>
          Per completare il tuo profilo da facilitatore abbiamo bisogno di
          alcuni tuoi dati. <br /> Completa i campi obbligatori per procedere.
        </p>
        <div className='d-flex flex-row mt-5 pb-4 align-items-center pt-3 '>
          <div
            onMouseDown={addProfilePicture}
            role='button'
            tabIndex={0}
            className=' position-relative'
          >
            <img
              src={Profile}
              alt=''
              className='onboarding__img-profile mr-2'
            />
            <div className='onboarding__icon-container primary-bg position-absolute rounded-circle'>
              <Icon
                size='lg'
                icon='it-camera'
                padding
                color='white'
                aria-label='Foto'
              />
            </div>
          </div>
          <div>
            <p className='complementary-1-color-b8 mb-0'>
              <strong>Foto profilo*</strong>
            </p>
            <p className='complementary-1-color-b8' style={{ fontSize: 14 }}>
              Carica una foto per personalizzare il tuo profilo.
            </p>
          </div>
        </div>
        <Form className='mt-5 mb-5 pt-5 onboarding__form-container'>
          <Form.Row>
            <Input
              {...form?.name}
              label='Nome*'
              placeholder='Inserisci nome'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
            <Input
              {...form?.surname}
              label='Cognome*'
              placeholder='Inserisci cognome'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
          </Form.Row>
          <Form.Row>
            <Input
              {...form?.email}
              label='Email'
              placeholder='Inserisci email'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
            <Input
              {...form?.birthdate}
              label='Data di nascita'
              placeholder='Inserisci data di nascita'
              col='col-12 col-md-6'
              type='date'
              onInputChange={onInputChange}
            />
          </Form.Row>
          <Form.Row>
            <Input
              {...form?.mobile}
              label='Mobile'
              placeholder='Inserisci mobile'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
            <Input
              {...form?.telephone}
              label='Telefono fisso'
              placeholder='Inserisci telefono fisso'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
          </Form.Row>
          <Form.Row>
            <Input
              {...form?.residency}
              label='Indirizzo di residenza'
              placeholder='Inserisci residenza'
              col='col-12 col-md-6'
              onInputChange={onInputChange}
            />
            <Select
              {...form?.citizenship}
              label='Cittadinanza'
              placeholder='Seleziona cittadinanza'
              className='col-12 col-md-6'
              options={optionsSelect}
              onInputChange={onInputChange}
              value={form?.citizenship.value?.toString()}
            />
          </Form.Row>
          <div className='d-flex justify-content-end mb-3 mt-5'>
            <Button color='primary' onClick={onSubmitForm}>
              Invia
            </Button>
          </div>
          <p className='primary-color-a12 mt-2 mb-3 pb-2'>
            *Campo obbligatorio
          </p>
        </Form>
      </div>
    </div>
  );
};

export default OnboardingDesktop;
