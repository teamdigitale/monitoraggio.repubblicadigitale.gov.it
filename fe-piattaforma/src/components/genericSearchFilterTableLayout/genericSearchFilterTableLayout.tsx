import React, { ReactElement, useEffect, useState } from 'react';
import { DropdownFilterI, FilterI } from '../DropdownFilter/dropdownFilter';
import { DropdownFilter, SearchBar } from '../index';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
import {
  cleanEntityFilters,
  deleteFiltroCriterioRicerca,
  resetFiltersState,
  resetPaginationState,
} from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { useDispatch } from 'react-redux';
//import Sidebar, { SidebarI } from './sidebar';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import ButtonsBar, { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import Sticky from 'react-sticky-el';
import CardCounter, { CardCounterI } from '../CardCounter/cardCounter';
import { cleanEntityFiltersCitizen } from '../../redux/features/citizensArea/citizensAreaSlice';
import { cleanForumFilters } from '../../redux/features/forum/forumSlice';

export interface SearchInformationI {
  onHandleSearch?: (searchValue: string) => void;
  placeholder: string;
  title: string;
  autocomplete: boolean;
  isClearable: boolean;
  onReset?: () => void;
}

interface GenericSearchFilterTableLayoutI {
  dropdowns?: DropdownFilterI[];
  searchInformation?: SearchInformationI;
  Sidebar?: ReactElement;
  showButtons?: boolean;
  filtersList?: any;
  cta?: (() => void) | undefined;
  ctaHref?: string;
  textCta?: string | undefined;
  iconCta?: string;
  ctaPrintText?: string;
  ctaPrint?: () => void;
  buttonsList?: ButtonInButtonsBar[];
  cardsCounter?: CardCounterI[];
  ctaDownload?: (() => void) | undefined;
  resetFilterDropdownSelected?: (filterKey: string) => void;
  citizen?: boolean;
  isDetail?: boolean;
  citizenList?: boolean;
  tooltip?: boolean;
  tooltiptext?: string;
}

const GenericSearchFilterTableLayout: React.FC<
  GenericSearchFilterTableLayoutI
> = ({
  dropdowns,
  searchInformation,
  Sidebar,
  showButtons = true,
  filtersList,
  children,
  cta,
  ctaHref,
  textCta,
  iconCta,
  ctaPrintText,
  ctaPrint,
  buttonsList,
  cardsCounter,
  ctaDownload,
  resetFilterDropdownSelected,
  citizen,
  isDetail,
  citizenList = false,
  tooltip = false,
  tooltiptext = '',
}) => {
  const dispatch = useDispatch();
  const [showChips, setShowChips] = useState<boolean>(false);
  const device = useAppSelector(selectDevice);

  useEffect(() => {
    dispatch(resetFiltersState());
    dispatch(resetPaginationState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilterLabel = (key: string) => {
    // TODO update keys when API integration is done
    switch (key) {
      case 'filtroCriterioRicerca':
      case 'filtroNomeRuolo':
      case 'criterioRicerca':
        return 'Ricerca';
      case 'filtroPolicies':
      case 'policies':
        return 'Intervento';
      case 'filtroStati':
      case 'stati':
      case 'statiQuestionario':
      case 'stato':
        return 'Stato';
      case 'filtroIdsProgrammi':
      case 'idsProgrammi':
      case 'programmi':
        return 'Programma';
      case 'filtroIdsProgetti':
      case 'idsProgetti':
      case 'progetti':
        return 'Progetto';
      case 'profili':
        return 'Profilo';
      case 'ruoli':
        return 'Ruolo';
      case 'idsSedi':
      case 'sedi':
        return 'Sede';
      case 'tipologiaServizio':
        return 'Tipo di servizio prenotato';
      case 'categorySections':
        return 'Sezione';
      default:
        key;
    }
  };

  const cleanFilters = (
    filterKey: string,
    value: string | number | string[]
  ) => {
    if (citizen) {
      dispatch(cleanEntityFiltersCitizen({ filterKey, value: value }));
    } else {
      dispatch(cleanEntityFilters({ filterKey, value: value }));
      dispatch(cleanForumFilters({ filterKey, value: value }));
    }
    if (
      filterKey === 'filtroCriterioRicerca' ||
      filterKey === 'criterioRicerca'
    )
      dispatch(deleteFiltroCriterioRicerca());
    if (resetFilterDropdownSelected) resetFilterDropdownSelected(filterKey);
  };

  const getLabelsChips = (
    filter:
      | { label: string; value: string | number }
      | { label: string; value: string | number }[],
    i: number,
    filterKey: string
  ) => {
    if (filterKey === 'pillDropdown' || filterKey === 'sort') return null;
    if (!Array.isArray(filter) && filter) {
      return (
        <Chip key={i} className='mr-2 rounded-pill'>
          <ChipLabel className='mx-1 my-1'>
            {getFilterLabel(filterKey)}: {filter}
          </ChipLabel>
          <Button close onClick={() => cleanFilters(filterKey, filter.value)}>
            <Icon icon='it-close' aria-label='Chiudi chip' />
          </Button>
        </Chip>
      );
    } else if (Array.isArray(filter) && filter?.length) {
      return (
        <>
          {filter.map((f: FilterI, j: number) => (
            <Chip key={i + '-' + j} className='mr-2 rounded-pill'>
              <ChipLabel className='mx-1 my-1'>
                {getFilterLabel(filterKey)}: {f.label}
              </ChipLabel>
              <Button close onClick={() => cleanFilters(filterKey, f.value)}>
                <Icon icon='it-close' aria-label='Chiudi chip' />
              </Button>
            </Chip>
          ))}
        </>
      );
    }
  };

  useEffect(() => {
    setShowChips(
      !!dropdowns?.length || !!Object.keys(filtersList || []).length
    );
  }, [dropdowns, filtersList]);

  const { t } = useTranslation();

  return (
    <div>
      {cardsCounter && (
        <div className='d-flex justify-content-center mb-5'>
          <div
            className={clsx(
              'd-flex',
              !device.mediaIsPhone ? 'flex-row' : 'flex-column'
            )}
          >
            {(cardsCounter || []).map((card: CardCounterI, i: number) => (
              <CardCounter
                key={i}
                title={card.title}
                counter={card.counter}
                icon={card.icon}
                className={card.className || ''}
              />
            ))}
          </div>
        </div>
      )}
      <div
        className={clsx(
          'd-flex',
          !isDetail ? 'justify-content-between' : 'justify-content-end',
          'align-items-center',
          'mt-2',
          'flex-wrap'
          /*  'flex-lg-nowrap' */
        )}
      >
        {searchInformation?.onHandleSearch && (
          <div
            className={clsx('flex-grow-1', 'col-12', cta && 'col-md-9', 'pl-0')}
          >
            <div
              className={clsx(
                device.mediaIsPhone && !cta
                  ? 'w-100'
                  : device.mediaIsPhone
                  ? 'w-100'
                  : 'col-9',
                'pl-0'
              )}
              data-testid='create-new-element'
            >
              <SearchBar
                autocomplete={searchInformation.autocomplete}
                onSubmit={searchInformation.onHandleSearch}
                placeholder={
                  device.mediaIsPhone ? '' : searchInformation.placeholder
                }
                isClearable={searchInformation.isClearable}
                title={searchInformation.title}
                id='search-filter-table-layout'
                tooltip={tooltip}
                tooltipText={tooltiptext}
                onReset={searchInformation.onReset}
              />
            </div>
          </div>
        )}

        {cta && !device.mediaIsPhone ? (
          <div
            className={clsx(
              'cta-container',
              'ml-auto',
              'col-12',
              'col-md-3',
              'pb-4'
            )}
          >
            {!device.mediaIsPhone ? (
              <Button
                color='primary'
                icon
                className='page-title__cta'
                onClick={cta}
                data-testid='create-new-entity'
              >
                {iconCta ? (
                  <Icon
                    color='white'
                    icon={iconCta}
                    className='mr-2'
                    aria-label='Aggiungi'
                  />
                ) : null}
                <span className='text-nowrap'>{textCta}</span>
              </Button>
            ) : ctaHref ? (
              <NavLink color='primary' className='page-title__cta' to={ctaHref}>
                {iconCta ? (
                  <Icon
                    color='white'
                    icon={iconCta}
                    className='mr-2'
                    aria-label='Aggiungi'
                  />
                ) : null}
                {textCta}
              </NavLink>
            ) : null}
            {ctaPrint && (
              <Button
                color='primary'
                icon
                outline
                className='page-title__cta mt-3'
                onClick={ctaPrint}
              >
                <Icon
                  color='primary'
                  icon='it-print'
                  className='mr-2'
                  aria-label='Stampa questionario'
                />
                <span className='text-nowrap'>{ctaPrintText}</span>
              </Button>
            )}
          </div>
        ) : null}
      </div>
      <div className='d-flex flex-wrap justify-content-between'>
        {dropdowns?.length && (
          <div className={clsx('d-flex', 'flex-row', 'flex-wrap', 'pb-lg-3')}>
            {dropdowns.map((dropdown, index) => (
              <DropdownFilter
                key={index}
                filterName={dropdown.filterName || ''}
                {...dropdown}
                isDetail={isDetail}
                isGeneric
              />
            ))}
          </div>
        )}

        {buttonsList?.length && (
          <div
            className={clsx(
              'd-flex',
              !device.mediaIsDesktop ? 'flex-column pt-4' : 'flex-row',
              !citizenList && 'py-lg-3',
              'pt-0',
              isDetail && 'justify-content-end'
            )}
          >
            <ButtonsBar citizenList={citizenList} buttons={buttonsList} />
          </div>
        )}
      </div>

      <div
        className={clsx(
          showChips && showButtons
            ? 'd-flex justify-content-between align-items-baseline'
            : showChips && !showButtons
            ? 'd-flex justify-content-start align-items-baseline'
            : 'd-flex justify-content-end align-items-baseline'
        )}
      >
        {showChips ? (
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'mb-4',
              'flex-wrap',
              'align-items-center'
            )}
          >
            {Object.keys(filtersList).map((filterKey, index) => (
              <div key={index} className={clsx(device.mediaIsPhone && 'pb-3')}>
                {getLabelsChips(filtersList[filterKey], index, filterKey)}
              </div>
            ))}
          </div>
        ) : null}

        {ctaDownload ? (
          <div className='d-flex justify-content-end'>
            <Button
              onClick={ctaDownload}
              className={clsx(
                'primary-color-b1',
                'd-flex',
                'flex-row',
                'justify-content-center',
                'align-items-center',
                'px-0',
                'pl-lg-4',
                'pb-5',
                'mb-2'
              )}
            >
              <div className='mr-1'>
                <Icon
                  icon='it-download'
                  color='primary'
                  size='sm'
                  aria-label='Scarica elenco'
                />
              </div>
              {!device.mediaIsPhone && (
                <span className='ml-2'>{t('download_list')}</span>
              )}
            </Button>
          </div>
        ) : (
          <div className='mb-5' />
        )}
      </div>

      {Sidebar ? (
        <div className='d-flex'>
          {Sidebar}
          <div className='w-75'>{children}</div>
        </div>
      ) : (
        <div>{children}</div>
      )}
      {device.mediaIsPhone && cta && (
        <div>
          <Sticky mode='bottom' stickyClassName='sticky bg-white'>
            <div className='container'>
              <ButtonsBar
                buttons={[
                  {
                    size: 'xs',
                    color: 'primary',
                    iconForButton: iconCta || '',
                    text: textCta || '',
                    onClick: cta,
                    className: 'align-self-end',
                  },
                ]}
              />
            </div>
          </Sticky>
        </div>
      )}
    </div>
  );
};

export default GenericSearchFilterTableLayout;
