import React, { useState } from 'react';
import GenericModal from '../../../../Modals/GenericModal/genericModal';

import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';

import { formTypes } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { formFieldI } from '../../../../../utils/formHelper';
import FormHeadquarters from '../HeadquartersForm/formHeadquarters';
import { AddressInfoI } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import { Form } from '../../../..';
import { Toggle } from 'design-react-kit';
import AccordionAddressList from '../AccordionAddressList/AccordionAddressList';
import AddressInfoForm from '../AddressInfoForm/AddressInfoForm';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectProjects } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useDispatch } from 'react-redux';
import { AssignAuthorityHeadquarter } from '../../../../../redux/features/administrativeArea/headquarters/headquartersThunk';

const id = formTypes.SEDE;

interface ManageSediFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageSediI extends withFormHandlerProps, ManageSediFormI {}

const ManageHeadquarter: React.FC<ManageSediI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  // This has to be populated with data from the store as soon we have a
  // well defined mock
  const [addressList, setAddressList] = useState<AddressInfoI[]>([
    {
      indirizzoSede: {
        via: '',
        civico: '',
        comune: '',
        provincia: '',
        cap: '',
        regione: '',
        nazione: '',
      },
      fasceOrarieAperturaIndirizzoSede: [],
    },
  ]);

  // flag for conditionally render multiple address selection
  const [movingHeadquarter, setMovingHeadquarter] = useState<boolean>(false);
  const { projectId } = useParams();
  const authorityId =
    useAppSelector(selectProjects).detail?.idEnteGestoreProgetto;
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (movingHeadquarter) setAddressList((prevList) => [prevList[0]]);
  // }, [movingHeadquarter]);

  const handleSaveSite = async () => {
    // addressList need in future probably will have some validators but now
    // there is no clue about the headquarter model structure and requirements

    if (isFormValid) {
      if (newFormValues && addressList.length > 0) {
        if (projectId && authorityId) {
          await dispatch(
            AssignAuthorityHeadquarter(authorityId, newFormValues, projectId)
          );
        }
      }
    }
  };

  return (
    <GenericModal
      id={id}
      hasSearch
      primaryCTA={{
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveSite,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => clearForm?.(),
      }}
      centerButtons
    >
      <FormHeadquarters
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newData) => setNewFormValues({ ...newData })}
        setIsFormValid={(value: boolean | undefined) => setIsFormValid(!!value)}
      />
      <Form className='px-5 mb-3'>
        <Form.Row>
          <div className='col-10 col-md-6'>
            <Toggle
              label='Sede Itinerante'
              checked={movingHeadquarter}
              onChange={(e) => setMovingHeadquarter(e.target.checked)}
            />
          </div>
        </Form.Row>
      </Form>
      {movingHeadquarter ? (
        <AccordionAddressList
          addressList={addressList}
          onSetAddressList={(addressList: AddressInfoI[]) =>
            setAddressList([...addressList])
          }
        />
      ) : (
        <AddressInfoForm
          addressInfo={addressList[0]}
          onAddressInfoChange={(addressInfo: AddressInfoI) =>
            setAddressList([addressInfo])
          }
        />
      )}
    </GenericModal>
  );
};

export default ManageHeadquarter;
