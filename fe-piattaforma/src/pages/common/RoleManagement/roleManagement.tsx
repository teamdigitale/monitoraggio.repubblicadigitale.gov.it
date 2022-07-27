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
import {
  selectRolesList,
} from '../../../redux/features/roles/rolesSlice';
import { GetRolesListValues } from '../../../redux/features/roles/rolesThunk';
import { useAppSelector } from '../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import {
  selectDevice,
  updateBreadcrumb,
} from '../../../redux/features/app/appSlice';

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

  useEffect(() => {
    getRolesList();
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

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(`${typeof td === 'string' ? td : td?.id}`);
    },
    [CRUDActionTypes.CLONE]: (td: TableRowI | string) => {
      console.log(td);
    },
    [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
      console.log(td);
    },
  };

  const addRole = () => {
    console.log('aggiungi ruolo');
  };

  return (
    <>
      <PageTitle title='Elenco Ruoli' breadcrumb={arrayBreadcrumb} />
      <Container className={device.mediaIsPhone ? 'px-4' : ''}>
        <GenericSearchFilterTableLayout
          searchInformation={searchInformation}
          showButtons={false}
          textCta='Aggiungi ruolo'
          iconCta='it-plus'
          cta={addRole}
        >
          <Table
            {...tableValues}
            id='table'
            onActionClick={onActionClick}
            onCellClick={(field, row) => console.log(field, row)}
            //onRowClick={row => console.log(row)}
            withActions
            rolesTable
          />
        </GenericSearchFilterTableLayout>
      </Container>
    </>
  );
};

export default memo(RoleManagement);
