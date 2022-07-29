import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../hoc/withFormHandler';
import {
  GetUserDetails,
  UserAddRole,
} from '../../../../../redux/features/administrativeArea/user/userThunk';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { newForm, newFormField } from '../../../../../utils/formHelper';
import { Form, Select } from '../../../../../components';
import { selectRolesList } from '../../../../../redux/features/roles/rolesSlice';
import { GetRolesListValues } from '../../../../../redux/features/roles/rolesThunk';

const id = 'AddUserRole';

const AddUserRole: React.FC<withFormHandlerProps> = (props) => {
  const { isValidForm, form, onInputChange = () => ({}) } = props;
  const dispatch = useDispatch();
  const { userId } = useParams();
  const ruoliList = useAppSelector(selectRolesList);

  useEffect(() => {
    dispatch(GetRolesListValues({ tipologiaRuoli: 'NP' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddRole = async () => {
    if (isValidForm && form?.ruolo?.value && userId) {
      const res = await dispatch(
        UserAddRole({ idUtente: userId, ruolo: form.ruolo.value.toString() })
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res) {
        dispatch(GetUserDetails(userId));
        dispatch(closeModal());
      }
    }
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: !isValidForm,
        label: 'Salva',
        onClick: handleAddRole,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => dispatch(closeModal()),
      }}
      title='Aggiungi nuovo ruolo'
    >
      <Form className='mt-5 mb-0'>
        <Form.Row
          className={clsx('justify-content-between', 'px-0', 'px-lg-5', 'mx-2')}
        >
          <Select
            {...form?.ruolo}
            value={form?.ruolo.value as string}
            col='col-12 col-lg-6'
            label='Ruolo'
            placeholder='Seleziona ruolo'
            options={ruoliList.map((role) => ({
              value: role.codiceRuolo,
              label: role.nomeRuolo,
            }))}
            onInputChange={onInputChange}
            wrapperClassName='mb-5'
            aria-label='ruolo'
            required
          />
        </Form.Row>
      </Form>
    </GenericModal>
  );
};

const form = newForm([
  newFormField({
    field: 'ruolo',
    id: 'ruolo',
    type: 'select',
    required: true,
  }),
]);

export default withFormHandler({ form }, AddUserRole);
