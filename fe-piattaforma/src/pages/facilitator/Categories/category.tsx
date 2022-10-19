import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DeleteEntityModal from '../../../components/AdministrativeArea/Entities/General/DeleteEntityModal/DeleteEntityModal';

import {
  DropdownFilterI,
  // FilterI,
} from '../../../components/DropdownFilter/dropdownFilter';

import GenericSearchFilterTableLayout, {
  SearchInformationI,
} from '../../../components/genericSearchFilterTableLayout/genericSearchFilterTableLayout';
import PageTitle from '../../../components/PageTitle/pageTitle';
import Table, { newTable, TableRowI } from '../../../components/Table/table';
import { DeleteCategory, GetCategoriesList } from '../../../redux/features/forum/categories/categoriesThunk';
import { selectCategoriesList } from '../../../redux/features/forum/forumSlice';
import {
  closeModal,
  openModal,
} from '../../../redux/features/modal/modalSlice';
import { useAppSelector } from '../../../redux/hooks';
// import { useAppSelector } from '../../../redux/hooks';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
// import { formFieldI } from '../../../utils/formHelper';
import ManageCategory from '../../administrator/AdministrativeArea/Entities/modals/manageCategory';
import { TableCategories } from '../../administrator/AdministrativeArea/Entities/utils';



const Category = () => {
  // const entity = 'categorie';
  // const categoryDropdownLabel = 'filtroCategories';
  // const dropdownFilterOptions = useAppSelector(selectCategoryFilterOptions);
  // const filtersList = useAppSelector(selectCategoryFilters);
  const dispatch = useDispatch();
  const categoriesList = useAppSelector(selectCategoriesList);

  useEffect(() => {
    dispatch(GetCategoriesList({ type: 'all' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const [searchDropdown, setSearchDropdown] = useState<
  //   { filterId: string; value: formFieldI['value'] }[]
  // >([]);
  // const [filterDropdownSelected, setFilterDropdownSelected] =
  //   useState<string>('');

  // const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
  //   console.log(values, filterKey);

  //   // setFilterDropdownSelected(filterKey);
  //   // dispatch(setCategoryFilters({ [filterKey]: [...values] }));
  // };

  // const getAllFilters = () => {
  //   // if (filterDropdownSelected !== 'filtroCategories')
  //   //    dispatch(GetCategoryFilterValues({ entity, dropdownType: 'categoria' }));
  // };

  // const { filtroCriterioRicerca, filtroCategories } = filtersList;

  // useEffect(() => {
  //   getAllFilters();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filtroCriterioRicerca, filtroCategories]);

  const getCategoryLabel = (category: 'document_categories' | 'board_categories' | 'community_categories') => {
    switch (category) {
      case 'board_categories': return 'Bacheca'
      case 'community_categories': return 'Community'
      case 'document_categories': return 'Documenti'
    }
  }

  const updateTableValues = () => {
    //TODO align keys when API Integration is done
    const table = newTable(
      TableCategories,
      categoriesList.map((td: any) => {
        return {
          id: td.id,
          label: td.name,
          section: getCategoryLabel(td.type),
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
        dispatch(openModal({
          id: 'category',
          payload: {
            title: 'Modifica Categoria',
            id: td.id,
            term_type: categoriesList.find(c => c.id === td.id).type,
            term_name: td.label
          }
        }))
      }
    },
  };

  useEffect(() => {
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesList]);

  const [tableValues, setTableValues] = useState(updateTableValues());

  const handleOnSearch = (searchValue: string) => {
    console.log(searchValue);

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
          onCellClick={(field, row) => console.log(field, row)}
          //onRowClick={row => console.log(row)}
          withActions
        //totalCounter={pagination?.totalElements}
        />
      </GenericSearchFilterTableLayout>
      <DeleteEntityModal
        onClose={() => dispatch(closeModal())}
        onConfirm={async (payload: any) => {
          if (payload.id) {
            await dispatch(DeleteCategory(payload.id))
            dispatch(GetCategoriesList({ type: 'all' }))
            dispatch(closeModal())
          }
        }}
      />
      <ManageCategory />
    </>
  );
};

export default Category;
