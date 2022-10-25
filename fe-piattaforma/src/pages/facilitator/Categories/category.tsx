import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';

import { DropdownFilterI } from '../../../components/DropdownFilter/dropdownFilter';

import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import PageTitle from '../../../components/PageTitle/pageTitle';
import Table, { newTable, TableRowI } from '../../../components/Table/table';
import {
  DeleteCategory,
  GetCategoriesList,
} from '../../../redux/features/forum/categories/categoriesThunk';
import { selectCategoriesList } from '../../../redux/features/forum/forumSlice';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import ManageCategory from '../../administrator/AdministrativeArea/Entities/modals/manageCategory';
import { TableCategories } from '../../administrator/AdministrativeArea/Entities/utils';

const Category = () => {
  const dispatch = useDispatch();
  const categoriesList = useAppSelector(selectCategoriesList);

  useEffect(() => {
    dispatch(GetCategoriesList({ type: 'all' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategoryLabel = (
    category:
      | 'document_categories'
      | 'board_categories'
      | 'community_categories'
  ) => {
    switch (category) {
      case 'board_categories':
        return 'Bacheca';
      case 'community_categories':
        return 'Community';
      case 'document_categories':
        return 'Documenti';
    }
  };

  const updateTableValues = () => {
    const table = newTable(
      TableCategories,
      categoriesList.map((td: any) => {
        const actions = [];
        if (td.name?.toString()?.toLowerCase()?.trim() !== 'altro') {
          actions.push([CRUDActionTypes.EDIT]);
          actions.push([CRUDActionTypes.DELETE]);
        } else {
          actions.push(['none']);
        }
        return {
          id: td.id,
          label: td.name,
          section: getCategoryLabel(td.type),
          actions: actions.join(','),
        };
      })
    );
    return table;
  };

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.DELETE]: (td: TableRowI | string) => {
      dispatch(
        openModal({
          id: 'delete-entity',
          payload: {
            id: typeof td !== 'string' ? td.id : null,
            text: 'Confermi di voler eliminare questa categoria?',
          },
        })
      );
    },
    [CRUDActionTypes.EDIT]: (td: TableRowI | string) => {
      if (typeof td !== 'string') {
        dispatch(
          openModal({
            id: 'category',
            payload: {
              title: 'Modifica Categoria',
              id: td.id,
              term_type: categoriesList.find((c) => c.id === td.id).type,
              term_name: td.label,
            },
          })
        );
      }
    },
  };

  useEffect(() => {
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesList]);

  const [tableValues, setTableValues] = useState(updateTableValues());

  const handleOnSearch = (searchValue: string) => {
    if (searchValue?.length >= 2)
      dispatch(GetCategoriesList({ type: 'all', keys: searchValue }));
  };

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Categoria',
      options: [],
      id: 'sezione',
      onOptionsChecked: (options) => console.log(options),
      className: 'mr-3',
      values: [],
      handleOnSearch: (searchKey) => console.log(searchKey),
      valueSearch: '',
    },
  ];

  const searchInformation: SearchInformationI = {
    autocomplete: false,
    onHandleSearch: handleOnSearch,
    placeholder: 'Inserisci il nome della categoria che stai cercando',
    isClearable: true,
    title: 'Cerca categoria',
  };

  const categoryCta = {
    textCta: 'Aggiungi categoria',
    iconCta: 'it-plus',
  };

  return (
    <>
      <PageTitle title='Elenco categorie' />
      <GenericSearchFilterTableLayout
        dropdowns={dropdowns}
        filtersList={{}}
        {...categoryCta}
        cta={() =>
          dispatch(
            openModal({
              id: 'category',
              payload: { title: 'Aggiungi Categoria' },
            })
          )
        }
        searchInformation={searchInformation}
      >
        <Table
          {...tableValues}
          id='table'
          onActionClick={onActionClick}
          withActions
        />
      </GenericSearchFilterTableLayout>
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={async (payload: any) => {
          if (payload.id) {
            const res = await dispatch(DeleteCategory(payload.id));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (res) {
              dispatch(GetCategoriesList({ type: 'all' }));
              dispatch(closeModal());
            }
          }
        }}
      />
      <ManageCategory />
    </>
  );
};

export default Category;
