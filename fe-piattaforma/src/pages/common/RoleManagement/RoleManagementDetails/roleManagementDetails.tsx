import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Container } from 'design-react-kit';
import './roleManagementDetails.scss';
import { Form, Input, Accordion, InfoPanel } from '../../../../components';
import DetailLayout from '../../../../components/DetailLayout/detailLayout';
import PageTitle from '../../../../components/PageTitle/pageTitle';
import useGuard from '../../../../hooks/guard';
import './roleManagementDetails.scss';

import {
  CreateCustomRole,
  DeleteCustomRole,
  EditCustomRole,
  GetGroupsListValues,
  GetRoleDetails,
} from '../../../../redux/features/roles/rolesThunk';
import { useAppSelector } from '../../../../redux/hooks';
import {
  GroupI,
  RolesStateI,
  selectGroupsList,
  selectRoleDetails,
} from '../../../../redux/features/roles/rolesSlice';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../hoc/withFormHandler';

import {
  CommonFields,
  newForm,
  newFormField,
} from '../../../../utils/formHelper';
import { scrollTo } from '../../../../utils/common';

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

interface RolesManagementDetailsI extends withFormHandlerProps {
  creation?: boolean;
  edit?: boolean;
}

const RolesManagementDetails: React.FC<RolesManagementDetailsI> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { codiceRuolo } = useParams();
  const {
    creation = false,
    edit = false,
    form = {},
    getFormValues = () => ({}),
    setFormValues = () => ({}),
    onInputChange = () => ({}),
    isValidForm = false,
  } = props;
  const role = useAppSelector(selectRoleDetails);
  const groups = useAppSelector(selectGroupsList);
  const [formEnabled, setEnableForm] = useState(creation || edit);
  const [functionalities, setFunctionalities] = useState<GroupI[]>([]);

  const { hasUserPermission } = useGuard();

  const getRoleDetails = () => {
    if (!creation && codiceRuolo) dispatch(GetRoleDetails(codiceRuolo));
  };

  useEffect(() => {
    getRoleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codiceRuolo]);

  const updateRoleName = (nomeRuolo: string) => {
    if (nomeRuolo) {
      setFormValues({
        roleName: nomeRuolo,
      });
    }
  };

  const updateFunctionalities = (
    dettaglioGruppi: RolesStateI['role']['dettaglioGruppi']
  ) => {
    if (dettaglioGruppi?.length) {
      const roleGroups = dettaglioGruppi.map((group) => group.codice);
      const checkedGroups = groups.filter((group) =>
        roleGroups.includes(group.codice)
      );
      setFunctionalities(checkedGroups);
    }
  };

  const handleDuplicateFlow = ({
    dettaglioGruppi = [],
    dettaglioRuolo,
  }: {
    dettaglioGruppi: RolesStateI['role']['dettaglioGruppi'];
    dettaglioRuolo: RolesStateI['role']['dettaglioRuolo'];
  }) => {
    if (dettaglioGruppi?.length) {
      setTimeout(() => updateFunctionalities(dettaglioGruppi), 0);
    }
    if (dettaglioRuolo) {
      setTimeout(
        () => updateRoleName(`${dettaglioRuolo?.nome} duplicato`),
        100
      );
    }
  };

  useEffect(() => {
    if (location.state && groups?.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handleDuplicateFlow(location.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, groups]);

  useEffect(() => {
    if (!creation && role.dettaglioGruppi && groups?.length) {
      updateFunctionalities(role.dettaglioGruppi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role.dettaglioGruppi, groups]);

  useEffect(() => {
    if (!creation && role.dettaglioRuolo?.nome) {
      updateRoleName(role.dettaglioRuolo.nome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role.dettaglioRuolo]);

  useEffect(() => {
    setFunctionalities([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  useEffect(() => {
    dispatch(GetGroupsListValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeRole = (group: GroupI) => {
    let temp = [...functionalities];
    if (temp.find((f) => group.codice === f.codice)) {
      temp = temp.filter((f) => f.codice !== group.codice);
    } else {
      temp.push(group);
    }
    setFunctionalities(temp);
  };

  const checkActionDisabled = () => {
    let valid = true;
    valid = valid && !!functionalities.length;
    if (creation) valid = valid && isValidForm;
    return !valid;
  };

  const handleSave = async () => {
    if (functionalities.length && isValidForm) {
      let roleCode;
      if (creation) {
        await dispatch(
          CreateCustomRole({
            nomeRuolo: getFormValues().roleName?.toString().trim() || '',
            codiciGruppi: functionalities.map((func) => func.codice),
          })
        );
        roleCode = getFormValues().roleName;
      } else if (codiceRuolo && role?.dettaglioRuolo?.tipologia === 'NP') {
        await dispatch(
          EditCustomRole(codiceRuolo, {
            nomeRuolo: getFormValues().roleName?.toString().trim() || '',
            codiciGruppi: functionalities.map((func) => func.codice),
          })
        );
        roleCode = codiceRuolo;
      }
      setEnableForm(false);
      scrollTo(0);
      navigate(`/gestione-ruoli/${roleCode}`, {
        replace: true,
      });
    }
  };

  const handleDelete = async () => {
    if (codiceRuolo && role?.dettaglioRuolo?.tipologia === 'NP') {
      await dispatch(DeleteCustomRole(codiceRuolo));
      navigate('/gestione-ruoli', {
        replace: true,
      });
    }
  };

  return (
    <>
      <PageTitle breadcrumb={arrayBreadcrumb} />
      <Container>
        <DetailLayout
          titleInfo={{
            title: creation
              ? (form.roleName?.value || 'Nome ruolo').toString()
              : role?.dettaglioRuolo?.nome || '',
            status: creation ? undefined : role?.dettaglioRuolo?.stato,
            upperTitle: { icon: 'it-settings', text: 'Ruolo' },
          }}
          formButtons={[]}
          buttonsPosition='BOTTOM'
          goBackTitle='Vai alla Lista Ruoli'
          goBackPath='/gestione-ruoli'
        />
        <Form className='mt-4'>
          <Input
            {...form.roleName}
            disabled={creation ? false : !formEnabled}
            label={creation ? 'Inserisci nome ruolo' : 'Nome'}
            className='role-management-details-container__input my-4'
            onInputBlur={onInputChange}
          />
        </Form>
        {(groups || []).map((group, index) => (
          <Accordion
            title={group.descrizione}
            key={group.codice}
            lastBottom={index === groups.length - 1}
            checkbox
            disabledCheckbox={!formEnabled}
            isChecked={
              !!functionalities?.find((grp) => grp.codice === group.codice)
            }
            handleOnCheck={() => handleChangeRole(group)}
          >
            <InfoPanel
              list={group.permessi.map((permesso) => permesso.descrizione)}
            />
          </Accordion>
        ))}
        <div
          className={clsx('d-flex', 'flex-row', 'justify-content-end', 'my-4')}
        >
          {formEnabled ? (
            <>
              <Button
                color='primary'
                outline
                onClick={() => {
                  if (creation) {
                    navigate(-1);
                  } else {
                    setEnableForm(!formEnabled);
                  }
                }}
                className='mr-2 role-management-details-container__button-width'
              >
                Annulla
              </Button>
              <Button
                disabled={checkActionDisabled()}
                color='primary'
                onClick={handleSave}
                className='role-management-details-container__button-width'
              >
                {`Salva${!creation ? ' modifiche' : ''}`}
              </Button>
            </>
          ) : role?.dettaglioRuolo?.tipologia === 'NP' ? (
            <>
              {hasUserPermission(['del.ruoli']) ? (
                <Button
                  color='primary'
                  outline
                  onClick={handleDelete}
                  className='mr-2 role-management-details-container__button-width'
                >
                  Elimina ruolo
                </Button>
              ) : null}
              {hasUserPermission(['add.upd.permessi']) ? (
                <Button
                  color='primary'
                  onClick={() => setEnableForm(!formEnabled)}
                  className='role-management-details-container__button-width'
                >
                  Modifica
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      </Container>
    </>
  );
};

const form = newForm([
  newFormField({
    ...CommonFields.NOME,
    field: 'roleName',
    id: 'roleName',
    required: true,
  }),
]);
export default memo(withFormHandler({ form }, RolesManagementDetails));
