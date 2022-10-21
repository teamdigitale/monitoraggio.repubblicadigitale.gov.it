import React, { memo, useEffect, useState } from 'react';
import { Container } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import CardDocument from '../../../components/CardDocument/cardDocument';
import {
  selectDevice,
  setPublishedContent,
} from '../../../redux/features/app/appSlice';
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
  ActionTracker,
  GetDocumentsFilters,
  GetDocumentsList,
} from '../../../redux/features/forum/forumThunk';
import {
  selectEntityPagination,
  setEntityPagination,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { formFieldI } from '../../../utils/formHelper';
import { selectUser } from '../../../redux/features/user/userSlice';
import WorkdocsRegistrationModal from './workdocsRegistrationModal';
import useGuard from "../../../hooks/guard";

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
  const device = useAppSelector(selectDevice);
  const docsList = useAppSelector(selectDocsList);
  const filtersList = useAppSelector(selectFilters);
  const dropdownFilterOptions = useAppSelector(selectFilterOptions);
  const pagination = useAppSelector(selectEntityPagination);
  const { utenteRegistratoInWorkdocs } = useAppSelector(selectUser) || {};
  const [searchDropdown, setSearchDropdown] = useState<
    { filterId: string; value: formFieldI['value'] }[]
  >([]);
  const [popularDocuments, setPopularDocuments] = useState([]);
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();

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
    const itemPerPage = '12';
    const res = await dispatch(
      GetDocumentsList(
        {
          sort: [{ label: 'downloads', value: 'downloads' }],
          page: [{ label: '0', value: '0' }],
          items_per_page: [{ label: itemPerPage, value: itemPerPage }],
        },
        false
      )
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
    handleOnChangePage(0, 9);
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

  const handleCollaborationToolRegistration = () => {
    dispatch(ActionTracker({ target: 'wd' }));
    window.open(process.env.REACT_APP_WORKDOCS_BASE_URL, '_blank');
    window.location.reload();
  };

  const handleCollaborationTool = () => {
    if (utenteRegistratoInWorkdocs) {
      handleCollaborationToolRegistration();
    } else {
      dispatch(
        openModal({
          id: 'workdocs-registration',
        })
      );
    }
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
          cta={hasUserPermission(['new.doc']) ? () =>
            dispatch(
              openModal({
                id: 'documentModal',
                payload: {
                  title: 'Carica documento',
                },
              })
            )
          : undefined}
          ctaToolCollaboration={handleCollaborationTool}
          cards={popularDocuments}
          isDocument
          isDocumentsCta
        >
          <Container className='pb-5'>
            <div
              className={clsx(
                'row',
                device.mediaIsPhone
                  ? 'justify-content-center'
                  : 'justify-content-start'
              )}
            >
              {docsList.length ? (
                docsList.map((doc, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'my-2',
                      !device.mediaIsPhone && 'mx-2',
                      'align-cards'
                    )}
                  >
                    <CardDocument {...doc} />
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
      {!utenteRegistratoInWorkdocs ? (
        <WorkdocsRegistrationModal
          onRegistrationComplete={handleCollaborationToolRegistration}
        />
      ) : null}
    </>
  );
};

export default memo(Documents);
