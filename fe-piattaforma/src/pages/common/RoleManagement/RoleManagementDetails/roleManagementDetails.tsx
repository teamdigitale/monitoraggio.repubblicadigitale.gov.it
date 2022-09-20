import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container } from 'design-react-kit';
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
import { ButtonInButtonsBar } from '../../../../components/ButtonsBar/buttonsBar';
import { setInfoIdsBreadcrumb } from '../../../../redux/features/app/appSlice';

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
  const roleName = useAppSelector(selectRoleDetails)?.dettaglioRuolo?.nome;
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

  useEffect(() => {
    // For breadcrumb
    if (codiceRuolo && roleName) {
      dispatch(
        setInfoIdsBreadcrumb({ id: encodeURI(codiceRuolo), nome: roleName, updateRoleBreadcrumb: true })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codiceRuolo, roleName]);

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
        const res = await dispatch(
          CreateCustomRole({
            nomeRuolo: getFormValues().roleName?.toString().trim() || '',
            codiciGruppi: functionalities.map((func) => func.codice),
          })
        );
        roleCode = getFormValues().roleName;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          setEnableForm(false);
          scrollTo(0);
          navigate(`/gestione-ruoli/${roleCode}`, {
            replace: true,
          });
        }
      } else if (codiceRuolo && role?.dettaglioRuolo?.tipologia === 'NP') {
        const res = await dispatch(
          EditCustomRole(codiceRuolo, {
            nomeRuolo: getFormValues().roleName?.toString().trim() || '',
            codiciGruppi: functionalities.map((func) => func.codice),
          })
        );
        roleCode = codiceRuolo;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          setEnableForm(false);
          scrollTo(0);
          navigate(`/gestione-ruoli/${roleCode}`, {
            replace: true,
          });
          // update details
          dispatch(GetRoleDetails(roleCode));
        }
      }
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

  const getButtons = () => {
    const buttons: ButtonInButtonsBar[] = [];
    if (formEnabled) {
      buttons.push({
        text: 'Annulla',
        color: 'primary',
        outline: true,
        onClick: () => {
          if (creation) {
            navigate(-1);
          } else {
            setEnableForm(!formEnabled);
          }
        },
        className: 'mr-2 role-management-details-container__button-width',
      });
      buttons.push({
        text: `Salva${!creation ? ' modifiche' : ''}`,
        disabled: checkActionDisabled(),
        color: 'primary',
        onClick: () => handleSave(),
        className: 'role-management-details-container__button-width',
      });
    } else {
      if (
        hasUserPermission(['del.ruoli']) &&
        role?.dettaglioRuolo?.stato === 'NON ATTIVO'
      ) {
        buttons.push({
          text: 'Elimina ruolo',
          color: 'primary',
          outline: true,
          onClick: () => handleDelete(),
          className: 'mr-2 role-management-details-container__button-width',
        });
      }
      if (
        hasUserPermission(['add.upd.permessi']) &&
        role?.dettaglioRuolo?.modificabile
      ) {
        buttons.push({
          text: 'Modifica',
          color: 'primary',
          onClick: () => setEnableForm(!formEnabled),
          className: 'role-management-details-container__button-width',
        });
      }
    }
    return buttons;
  };

  return (
    <>
      <PageTitle />
      <Container>
        <DetailLayout
          titleInfo={{
            title: creation
              ? (form.roleName?.value || 'Nome ruolo').toString()
              : role?.dettaglioRuolo?.nome || '',
            status: creation ? undefined : role?.dettaglioRuolo?.stato,
            upperTitle: { icon: 'it-settings', text: 'Ruolo' },
          }}
          formButtons={getButtons()}
          buttonsPosition='BOTTOM'
          goBackTitle='Vai alla Lista Ruoli'
          goBackPath='/gestione-ruoli'
        >
          <>
            <Form id='form-role-management' className='mt-4'>
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
                roleList
              >
                <InfoPanel
                  list={group.permessi.map((permesso) => permesso.descrizione)}
                />
              </Accordion>
            ))}
          </>
        </DetailLayout>
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
