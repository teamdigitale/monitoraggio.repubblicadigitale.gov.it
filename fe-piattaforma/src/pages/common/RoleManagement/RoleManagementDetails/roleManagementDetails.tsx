import { Button, Container } from 'design-react-kit';
import React, { memo, useState } from 'react';
import { Form, Input, Accordion, InfoPanel } from '../../../../components';
import DetailLayout from '../../../../components/DetailLayout/detailLayout';
import PageTitle from '../../../../components/PageTitle/pageTitle';
import './roleManagementDetails.scss';

interface RoleDetailsI {
  name?: string;
}

const arrayBreadcrumb = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Profilazione',
    url: '/gestione-ruoli',
  },
  {
    label: 'current',
  },
];

const funzionalitaMock = [
  {
    name: 'Censimento ente',
    id: '1',
  },
  {
    name: 'Visualizzazione scheda ente',
    id: '2',
  },
  {
    name: 'Visualizzazione lista enti',
    id: '3',
  },
  {
    name: 'Modifica scheda ente',
    id: '4',
    authorized: true,
  },
  {
    name: 'Eliminazione ente',
    id: '5',
  },
  {
    name: 'Compilazione questionario',
    id: '6',
    authorized: true,
  },
  {
    name: 'Modifica questionario',
    id: '7',
  },
  {
    name: 'Visualizzazione questionario',
    id: '8',
    authorized: true,
  },
  {
    name: 'Eliminazione questionario',
    id: '9',
  },
  {
    name: 'Invio questionario',
    id: '10',
  },
];

const RolesManagementDetails: React.FC<RoleDetailsI> = (props) => {
  const { name = 'Facilitatore' } = props;
  const [formEnabled, setEnableForm] = useState(false);
  const [functionalities, setFunctionalities] = useState<
    { name: string; id: string }[]
  >([]);

  const handleChangeRole = (elem: { name: string; id: string }) => {
    let temp = [...functionalities];
    if (temp.find((f) => f.id === elem.id)) {
      temp = temp.filter((f) => f.id !== elem.id);
    } else {
      temp.push(elem);
    }
    setFunctionalities(temp);
    // TO DO: integrare chiamata per settare funzionalità del ruolo
  };

  return (
    <>
      <PageTitle breadcrumb={arrayBreadcrumb} />
      <Container>
        <DetailLayout
          titleInfo={{
            title: 'Referente Ente Gestore di programma',
            status: 'ATTIVO',
            upperTitle: { icon: 'it-settings', text: 'Ruolo' },
          }}
          formButtons={[]}
          buttonsPosition='TOP'
          goBackTitle='Vai alla Lista Ruoli'
        />
        <Form className='mt-4'>
          <Input
            id='role-name'
            field='role-name'
            disabled
            label='Nome'
            value={name}
            className='role-management-details-container__input my-4'
          />
        </Form>
        {(funzionalitaMock || []).map((f, index) => (
          <Accordion
            title={f.name}
            key={index}
            lastBottom={index === funzionalitaMock.length - 1}
            checkbox
            disabledCheckbox={!formEnabled}
            isChecked={
              functionalities.find((func) => func.id === f.id) ? true : false
            }
            handleOnCheck={() => handleChangeRole(f)}
          >
            <InfoPanel list={['test', 'test', 'test']} />
            {/* TODO: carica lista dettaglio funzionalità */}
          </Accordion>
        ))}
        <div className='d-flex flex-row justify-content-end my-4'>
          {formEnabled ? (
            <>
              <Button
                color='primary'
                outline
                onClick={() => setEnableForm(!formEnabled)}
                className='mr-2 role-management-details-container__button-width'
              >
                Annulla
              </Button>
              <Button
                color='primary'
                onClick={() => console.log('salva modifiche', functionalities)}
                className='role-management-details-container__button-width'
              >
                Salva modifiche
              </Button>
            </>
          ) : (
            <>
              <Button
                color='primary'
                outline
                onClick={() => console.log('elimina ruolo')}
                className='mr-2 role-management-details-container__button-width'
              >
                Elimina ruolo
              </Button>
              <Button
                color='primary'
                onClick={() => setEnableForm(!formEnabled)}
                className='role-management-details-container__button-width'
              >
                Modifica
              </Button>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default memo(RolesManagementDetails);
