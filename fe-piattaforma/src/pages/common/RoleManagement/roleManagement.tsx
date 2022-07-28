import { Container } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../../components';
import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import PageTitle from '../../../components/PageTitle/pageTitle';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../components/Table/table';
import { setEntityFilters } from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectRolesList } from '../../../redux/features/roles/rolesSlice';
import {
  GetGroupsListValues,
  GetRoleDetails,
  GetRolesListValues,
} from '../../../redux/features/roles/rolesThunk';
import { useAppSelector } from '../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../redux/features/app/appSlice';
import useGuard from '../../../hooks/guard';

const arrayBreadcrumb = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Profilazione',
  },
];

const RoleManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const ruoliList = useAppSelector(selectRolesList);
  const { hasUserPermission } = useGuard();

  const handleOnSearch = (searchValue: string) => {
    dispatch(
      setEntityFilters({ nomeLike: { label: searchValue, value: searchValue } })
    );
  };

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder: 'Inserisci il nome del ruolo che stai cercando',
    isClearable: true,
    title: 'Cerca ruolo',
  };

  const TableHeading: TableHeadingI[] = [
    {
      label: 'Ruolo',
      field: 'name',
      size: 'small',
    },
  ];

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      (ruoliList || []).map((td) => ({
        id: td.codiceRuolo,
        name: td.nomeRuolo,
      }))
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (Array.isArray(ruoliList) && ruoliList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruoliList]);

  const getRolesList = () => {
    dispatch(GetRolesListValues());
  };
  const getGroupsList = () => {
    dispatch(GetGroupsListValues());
  };

  useEffect(() => {
    getRolesList();
    getGroupsList();
    dispatch(
      updateBreadcrumb([
        {
          label: 'Gestione ruoli',
          url: '/gestione-ruoli',
          link: false,
        },
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClone = async (codiceRuolo: string) => {
    const roleClone = await dispatch(GetRoleDetails(codiceRuolo));
    if (roleClone) {
      navigate('/gestione-ruoli/crea-nuovo', {
        state: roleClone,
        replace: true,
      });
    }
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td?.id}`);
    },
    [CRUDActionTypes.CLONE]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        handleOnClone(td.id.toString());
      }
    },
    [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        navigate(`/gestione-ruoli/${td.id.toString()}/modifica`);
      }
    },
  };

  const addRole = () => {
    navigate('/gestione-ruoli/crea-nuovo');
  };

  return (
    <>
      <PageTitle title='Elenco Ruoli' breadcrumb={arrayBreadcrumb} />
      <Container className={device.mediaIsPhone ? 'px-4' : ''}>
        <GenericSearchFilterTableLayout
          searchInformation={searchInformation}
          showButtons={false}
          textCta={
            hasUserPermission(['new.ruoli']) ? 'Aggiungi ruolo' : undefined
          }
          iconCta='it-plus'
          cta={hasUserPermission(['new.ruoli']) ? () => addRole() : undefined}
        >
          <Table
            {...tableValues}
            id='table'
            onActionClick={onActionClick}
            withActions
            rolesTable
          />
        </GenericSearchFilterTableLayout>
      </Container>
    </>
  );
};

export default memo(RoleManagement);
