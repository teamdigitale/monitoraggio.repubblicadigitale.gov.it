import React, { ReactElement, useEffect, useState } from 'react';
import { DropdownFilterI, FilterI } from '../DropdownFilter/dropdownFilter';
import { DropdownFilter, SearchBar } from '../index';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
import {
  cleanEntityFilters,
  resetFiltersState,
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

export interface SearchInformationI {
  onHandleSearch?: (searchValue: string) => void;
  placeholder: string;
  title: string;
  autocomplete: boolean;
  isClearable: boolean;
}

interface GenericSearchFilterTableLayoutI {
  dropdowns?: DropdownFilterI[];
  searchInformation: SearchInformationI;
  Sidebar?: ReactElement;
  showButtons?: boolean;
  filtersList?: any;
  cta?: () => void;
  ctaHref?: string;
  textCta?: string;
  iconCta?: string;
  ctaPrintText?: string;
  ctaPrint?: () => void;
  buttonsList?: ButtonInButtonsBar[];
  cardsCounter?: CardCounterI[];
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
}) => {
  const dispatch = useDispatch();
  const [showChips, setShowChips] = useState<boolean>(false);

  useEffect(() => {
    dispatch(resetFiltersState());
  }, []);

  const getFilterLabel = (key: string) => {
    switch (key) {
      case 'criterioRicerca':
        return 'Ricerca';
      case 'policies':
        return 'Policy';
      case 'stati':
        return 'Stato';
      case 'programmi':
        return 'Programma';
      case 'progetti':
        return 'Progetto';
      case 'profili':
        return 'Profilo';
      case 'ruoli':
        return 'Ruolo';
      default:
        key;
    }
  };

  const getLabelsChips = (filter: { label: string, value: string | number} | { label: string, value: string | number}[], i: number, filterKey: string) => { console.log(filter)
    if (!Array.isArray(filter) && filter?.value) {
      return (
        <Chip key={i} className='mr-2'>
          <ChipLabel className='px-1'>
            {getFilterLabel(filterKey)}: {filter.label}
          </ChipLabel>
          <Button
            close
            onClick={() => {
              console.log('clean entity filters');
              dispatch(cleanEntityFilters({ filterKey, value: filter.value }));
            }}
          >
            <Icon icon='it-close' aria-label='Chiudi chip' />
          </Button>
        </Chip>
      );
    } else if (Array.isArray(filter) && filter?.length > 0) {
      return (
        <>
          {filter.map((f: FilterI, j: number) => (
            <Chip key={i + '-' + j} className='mr-2'>
              <ChipLabel className='mx-1 my-2'>
                {getFilterLabel(filterKey)}: {f.label}
              </ChipLabel>
              <Button
                close
                onClick={() => {
                  console.log('sono il clean entity filters');
                  dispatch(cleanEntityFilters({ filterKey, value: f.value }));
                }}
              >
                <Icon icon='it-close' aria-label='Chiudi chip' />
              </Button>
            </Chip>
          ))}
        </>
      );
    }
  };
  useEffect(() => {
    if (dropdowns?.length && filtersList && Object.keys(filtersList).length) {
      setShowChips(true);
    } else {
      setShowChips(false);
    }
  }, [dropdowns, filtersList]);

  const { t } = useTranslation();

  const device = useAppSelector(selectDevice);
  return (
    <>
      {cardsCounter && (
        <div className='d-flex justify-content-center mb-5'>
          <div className='d-flex flex-row'>
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
          'justify-content-between',
          'align-items-center',
          'mt-2',
          'mb-3',
          'flex-wrap',
          'flex-lg-nowrap'
        )}
      >
        {searchInformation?.onHandleSearch && (
          <div
            className={clsx('flex-grow-1', 'col-12', cta && 'col-md-9', 'pl-0')}
          >
            <div
              className={clsx(!cta && 'w-100', 'col-9', 'pl-0')}
              data-testid='create-new-element'
            >
              <SearchBar
                autocomplete={searchInformation.autocomplete}
                onSubmit={searchInformation.onHandleSearch}
                placeholder={searchInformation.placeholder}
                isClearable={searchInformation.isClearable}
                title={searchInformation.title}
                id='search-filter-table-layout'
              />
            </div>
          </div>
        )}

        <div
          className={clsx(
            'cta-container',
            'ml-auto',
            'col-12',
            'col-md-3',
            'pb-4'
          )}
        >
          {cta && !device.mediaIsPhone ? (
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
      </div>
      <div className='d-flex justify-content-between w-100'>
        {dropdowns?.length && (
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'flex-wra',
              'p',
              'pt-lg-3',
              'pt-0',
              buttonsList?.length && 'w-50'
            )}
          >
            {dropdowns.map((dropdown, index) => (
              <DropdownFilter
                key={index}
                filterName={dropdown.filterName || ''}
                {...dropdown}
              />
            ))}
          </div>
        )}
        {buttonsList?.length && (
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'flex-wrap',
              'pt-lg-3',
              'pt-0',
              'w-50'
            )}
          >
            <ButtonsBar buttons={buttonsList} />
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
              'mt-4',
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
        {showButtons ? (
          <div className='d-flex justify-content-end'>
            <Button
              onClick={() => {
                console.log('download');
              }}
              className={clsx(
                'primary-color-b1',
                'd-flex',
                'flex-row',
                'justify-content-center',
                'align-items-center',
                'px-0',
                'px-lg-4'
              )}
            >
              <div>
                <Icon
                  icon='it-download'
                  color='primary'
                  size='sm'
                  aria-label='Scarica elenco'
                />
              </div>
              {!device.mediaIsPhone && (
                <span className='ml-4'>{t('download_list')}</span>
              )}
            </Button>
          </div>
        ) : null}
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
        <Sticky mode='bottom'>
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
        </Sticky>
      )}
    </>
  );
};

export default GenericSearchFilterTableLayout;
