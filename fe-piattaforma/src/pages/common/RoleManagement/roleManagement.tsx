import { Container } from 'design-react-kit';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EmptySection, Table } from '../../../components';
import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import PageTitle from '../../../components/PageTitle/pageTitle';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../components/Table/table';
import {
  selectEntityFilters,
  setEntityFilters,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectRolesList } from '../../../redux/features/roles/rolesSlice';
import {
  GetGroupsListValues,
  GetRoleDetails,
  GetRolesListValues,
} from '../../../redux/features/roles/rolesThunk';
import { useAppSelector } from '../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import { selectDevice } from '../../../redux/features/app/appSlice';
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
  const filtersList = useAppSelector(selectEntityFilters);
  const ruoliList = useAppSelector(selectRolesList);
  const { hasUserPermission } = useGuard();

  const { filtroNomeRuolo } = filtersList;

  const handleOnSearch = (searchValue: string) => {
    dispatch(setEntityFilters({ filtroNomeRuolo: searchValue }));
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
      (ruoliList || []).map((td) => {
        const actions = [];
        if (td.codiceRuolo) {
          actions.push([CRUDActionTypes.VIEW]);
          actions.push([CRUDActionTypes.CLONE]);
        }
        if (td.modificabile) {
          actions.push([CRUDActionTypes.EDIT]);
        }
        return {
          id: td.codiceRuolo,
          name: td.nomeRuolo,
          actions: actions.join(','),
        };
      })
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
    dispatch(
      GetRolesListValues(
        filtroNomeRuolo
          ? { filtroNomeRuolo: filtroNomeRuolo?.toString() || '' }
          : {}
      )
    );
  };

  const getGroupsList = () => {
    dispatch(GetGroupsListValues());
  };

  useEffect(() => {
    getGroupsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRolesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroNomeRuolo]);

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
      <PageTitle title='Elenco ruoli' breadcrumb={arrayBreadcrumb} />
      <Container className={device.mediaIsPhone ? 'px-4' : ''}>
        <GenericSearchFilterTableLayout
          searchInformation={searchInformation}
          filtersList={filtersList}
          textCta={
            hasUserPermission(['new.ruoli']) ? 'Aggiungi ruolo' : undefined
          }
          iconCta='it-plus'
          cta={hasUserPermission(['new.ruoli']) ? () => addRole() : undefined}
        >
          {ruoliList?.length && tableValues?.values?.length ? (
            <Table
              {...tableValues}
              id='table'
              onActionClick={onActionClick}
              withActions
              rolesTable
            />
          ) : (
            <div className='pb-5'>
              <EmptySection title='Non sono presenti ruoli' icon='it-note' withIcon />
            </div>
          )}
        </GenericSearchFilterTableLayout>
      </Container>
    </>
  );
};

export default memo(RoleManagement);
