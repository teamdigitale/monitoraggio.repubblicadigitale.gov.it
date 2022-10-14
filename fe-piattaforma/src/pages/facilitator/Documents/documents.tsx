import React, { memo, useEffect, useState } from 'react';
import { Container } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import CardDocument from '../../../components/CardDocument/cardDocument';
import { setPublishedContent } from '../../../redux/features/app/appSlice';
import { EmptySection, Paginator } from '../../../components';
import {
  DropdownFilterI,
  FilterI,
} from '../../../components/DropdownFilter/dropdownFilter';
import { useAppSelector } from '../../../redux/hooks';
import { openModal } from '../../../redux/features/modal/modalSlice';
import ManageDocument from '../../administrator/AdministrativeArea/Entities/modals/manageDocument';
import ForumLayout from '../../../components/ForumLayout/ForumLayout';
import {
  selectDocsList,
  selectFilterOptions,
  selectFilters,
  setForumFilters,
} from '../../../redux/features/forum/forumSlice';
import {
  GetDocumentsFilters,
  GetDocumentsList,
} from '../../../redux/features/forum/forumThunk';
import {
  selectEntityPagination,
  setEntityPagination,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { formFieldI } from '../../../utils/formHelper';

export const DocumentCardMock = {
  typology: 'TIPOLOGIA',
  date: '02/07/2022',
  title: 'Lorem ipsum dolor sit amet',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed ...',
  fileType: 'PDF',
  authority: 'Regione Lombardia',
  download: 28,
  comment: 12,
};

export const DocumentCardSliderMock = [
  {
    typology: 'TIPOLOGIA 1',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 2',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 3',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 4',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 5',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 6',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 7',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
  {
    typology: 'TIPOLOGIA 8',
    date: '02/07/2022',
    title: 'Lorem ipsum dolor sit amet',
    download: 28,
    comment: 12,
  },
];

// const DocumentsMock = [DocumentCardMock, DocumentCardMock, DocumentCardMock];

const documentCta = {
  textCta: 'Carica documento',
  iconCta: 'it-plus',
};

const toolCollaborationCta = {
  textCtaToolCollaboration: 'Vai al tool di Collaboration',
  iconCtaToolCollaboration: 'it-external-link',
};

// for dropdown filters, don't change
const typologyDropdownLabel = 'categories';
const policyDropdownLabel = 'interventions';
const programDropdownLabel = 'programs';

const Documents = () => {
  const docsList = useAppSelector(selectDocsList);
  const filtersList = useAppSelector(selectFilters);
  const dropdownFilterOptions = useAppSelector(selectFilterOptions);
  const pagination = useAppSelector(selectEntityPagination);
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [popularDocuments, setPopularDocuments] = useState([]);
  const dispatch = useDispatch();

  const { interventions, programs, categories, sort } = filtersList;
  const { pageNumber } = pagination;

  const handleOnChangePage = (
    pageNumber: number = pagination?.pageNumber,
    pageSize = pagination?.pageSize
  ) => {
    dispatch(setEntityPagination({ pageNumber, pageSize }));
  };

  const getDocsList = () => {
    dispatch(GetDocumentsList());
  };

  const getPopularDocs = async () => {
    const res = await dispatch(
      GetDocumentsList({ sort: [{ label: 'likes', value: 'likes' }] }, false)
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (res?.data?.data?.items) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPopularDocuments(res?.data?.data?.items);
    }
  };

  const getAllFilters = () => {
    dispatch(GetDocumentsFilters());
  };

  useEffect(() => {
    //handleOnChangePage(1, 8);
    dispatch(setPublishedContent(true));
    getPopularDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDocsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventions, programs, categories, sort?.[0], pageNumber]);

  useEffect(() => {
    getAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventions, programs, categories]);

  const handleDropdownFilters = (values: FilterI[], filterKey: string) => {
    dispatch(setForumFilters({ [filterKey]: [...values] }));
  };

  const handleOnSearchDropdownOptions = (
    searchValue: formFieldI['value'],
    filterId: string
  ) => {
    const searchDropdownValues = [...searchDropdown];
    if (
      searchDropdownValues?.length &&
      searchDropdownValues?.findIndex((f) => f.filterId === filterId) !== -1
    ) {
      searchDropdownValues[
        searchDropdownValues.findIndex((f) => f.filterId === filterId)
      ].value = searchValue;
    } else {
      searchDropdownValues.push({ filterId: filterId, value: searchValue });
    }
    setSearchDropdown(searchDropdownValues);
  };

  const dropdowns: DropdownFilterI[] = [
    {
      filterName: 'Tipologia',
      options:
        dropdownFilterOptions && dropdownFilterOptions['categories']
          ? dropdownFilterOptions['categories'].map(({ label, id }) => ({
              label,
              value: id,
            }))
          : [],
      id: typologyDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, typologyDropdownLabel),
      className: 'mr-3',
      values: filtersList[typologyDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, typologyDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === typologyDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Intervento',
      options:
        dropdownFilterOptions && dropdownFilterOptions['interventions']
          ? dropdownFilterOptions['interventions'].map(({ label, id }) => ({
              label,
              value: id,
            }))
          : [],
      id: policyDropdownLabel,
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, policyDropdownLabel),
      className: 'mr-3',
      values: filtersList[policyDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, policyDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === policyDropdownLabel
      )[0]?.value,
    },
    {
      filterName: 'Programma',
      options: (dropdownFilterOptions['programs'] || []).map(
        ({ label, id }) => ({
          label,
          value: id,
        })
      ),
      onOptionsChecked: (options) =>
        handleDropdownFilters(options, programDropdownLabel),
      id: programDropdownLabel,
      className: 'mr-3',
      values: filtersList[programDropdownLabel] || [],
      handleOnSearch: (searchKey) => {
        handleOnSearchDropdownOptions(searchKey, programDropdownLabel);
      },
      valueSearch: searchDropdown?.filter(
        (f) => f.filterId === programDropdownLabel
      )[0]?.value,
    },
  ];

  const handleCollaborationTool = () => {
    // TODO implement custom logic here
    // check if user is already registered in workdocs
    // if yes redirect to workdocs
    // else open registration modal
    // then redirect to workdocs
    console.log('tool di collaborazione');
  };

  return (
    <>
      <div>
        <ForumLayout
          title='Documenti'
          sectionTitle='I documenti più scaricati'
          sectionInfo
          dropdowns={dropdowns}
          filtersList={filtersList}
          {...toolCollaborationCta}
          {...documentCta}
          sortFilter
          cta={() =>
            dispatch(
              openModal({
                id: 'documentModal',
              })
            )
          }
          ctaToolCollaboration={handleCollaborationTool}
          cards={popularDocuments}
          isDocument
          isDocumentsCta
        >
          <Container className='pb-5'>
            <div className='row'>
              {docsList?.length ? (
                docsList.map((doc, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'col-12',
                      'col-md-6',
                      'col-lg-4',
                      'my-2',
                      'align-cards'
                    )}
                  >
                    <CardDocument
                      // TODO update key with a unique value
                      {...doc}
                    />
                  </div>
                ))
              ) : (
                <EmptySection title='Non ci sono documenti' />
              )}
            </div>
          </Container>
          {pagination?.pageNumber ? (
            <div className='pb-5'>
              <Paginator
                activePage={pagination?.pageNumber}
                center
                pageSize={pagination?.pageSize}
                total={pagination?.totalPages}
                onChange={handleOnChangePage}
              />
            </div>
          ) : null}
        </ForumLayout>
      </div>
      <ManageDocument creation />
    </>
  );
};

export default memo(Documents);
