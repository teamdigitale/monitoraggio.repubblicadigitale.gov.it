import clsx from 'clsx';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Sticky from 'react-sticky-el';
/* import Sticky from 'react-sticky-el'; */
import { selectDevice } from '../../redux/features/app/appSlice';
// import {
//   cleanForumFilters,
//   deleteFiltroCriterioRicercaForum,
// } from '../../redux/features/forum/forumSlice';
import { useAppSelector } from '../../redux/hooks';
import ButtonsBar, { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import CardSlider from '../CardSlider/cardSlider';
import DropdownFilter, {
  DropdownFilterI,
  FilterI,
} from '../DropdownFilter/dropdownFilter';
import Slider from '../General/Slider/Slider';
import PageTitle from '../PageTitle/pageTitle';
import PillDropDown from '../PillDropDown/pillDropDown';
import SectionTitle from '../SectionTitle/sectionTitle';
import {
  cleanForumFilters,
  setForumFilters,
} from '../../redux/features/forum/forumSlice';
import useGuard from '../../hooks/guard';
import './ForumLayout.scss';
import { ForumCardsI } from '../CardShowcase/cardShowcase';
import { usePathContent } from '../../utils/functionHelper';

export interface ForumLayoutI {
  dropdowns?: DropdownFilterI[];
  filtersList?: any;
  cards?: ForumCardsI[];
  buttonsList?: ButtonInButtonsBar[];
  textCtaToolCollaboration?: string | undefined;
  iconCtaToolCollaboration?: string;
  isSubtitle?: boolean;
  sectionTitle?: string;
  subtitle?: string;
  sortFilter?: boolean;
  isDocument?: boolean;
  isNews?: boolean;
  isCommunity?: boolean;
  title?: string;
  cta?: (() => void) | undefined;
  ctaToolCollaboration?: (() => void) | undefined;
  ctaHref?: string;
  textCta?: string | undefined;
  iconCta?: string;
  isDetail?: boolean;
  resetFilterDropdownSelected?: (filterKey: string) => void;
  sectionInfo?: boolean;
  isDocumentsCta?: boolean;
}

const ForumLayout: React.FC<ForumLayoutI> = (props) => {
  const {
    ctaToolCollaboration,
    textCtaToolCollaboration,
    iconCtaToolCollaboration,
    sectionTitle,
    sortFilter = false,
    isDocument = false,
    isNews = false,
    isCommunity = false,
    title,
    subtitle,
    cta,
    ctaHref,
    textCta,
    iconCta,
    dropdowns,
    buttonsList,
    isDetail,
    filtersList,
    resetFilterDropdownSelected,
    cards = [],
    sectionInfo = false,
    children,
    isDocumentsCta = false,
  } = props;

  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();
  const pathName = location.pathname;
  const [showChips, setShowChips] = useState<boolean>(false);

  useEffect(() => {
    setShowChips(
      !!dropdowns?.length || !!Object.keys(filtersList || []).length
    );
  }, [dropdowns, filtersList]);

  const { description } = usePathContent(pathName);

  const getFilterLabel = (key: string) => {
    // TODO update keys when API integration is done
    switch (key) {
      case 'filtroCriterioRicerca':
      case 'filtroNomeRuolo':
      case 'criterioRicerca':
        return 'Ricerca';
      case 'filtroPolicies':
      case 'policies':
      case 'interventions':
        return 'Intervento';
      case 'filtroStati':
      case 'stati':
      case 'statiQuestionario':
      case 'stato':
        return 'Stato';
      case 'filtroIdsProgrammi':
      case 'idsProgrammi':
      case 'programmi':
      case 'programs':
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
      case 'filtroCategories':
      case 'categories':
        return 'Categoria';
      default:
        key;
    }
  };

  const cleanFilters = (
    filterKey: string,
    value: string | number | string[]
  ) => {
    dispatch(cleanForumFilters({ filterKey, value: value }));
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
            <Icon
              icon='it-close'
              aria-label={`Elimina filtro ${filter.label}`}
            />
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
                <Icon
                  icon='it-close'
                  aria-label={`Elimina filtro ${f.label}`}
                />
              </Button>
            </Chip>
          ))}
        </>
      );
    }
  };

  const numberOfSlides = () => {
    if (device.mediaIsDesktop) {
      return 3;
    } else if (device.mediaIsTablet) {
      return 1;
    } else if (device.mediaIsPhone) {
      return 1;
    } else {
      return 3;
    }
  };

  const formatSlides = (list: any[], slideLength: number) => {
    const slides = [];
    const slidesNumb = Math.ceil(list.length / slideLength);
    for (let i = 0; i < slidesNumb; i++) {
      const pos = i * slideLength;
      slides.push(list.slice(pos, pos + slideLength));
    }
    return slides;
  };

  const handleSortFilterChange = ({ value }: { value: string }) => {
    dispatch(setForumFilters({ sort: [{ label: value, value }] }));
  };

  return (
    <>
      <div className='lightgrey-bg-b4 py-4'>
        {/* TITOLO */}
        <PageTitle
          title={title}
          sectionInfo={sectionInfo}
          subtitle={subtitle}
        />

        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'justify-content-between',
            'align-items-center',
            'container',
            'pt-3',
            'pb-5'
          )}
        >
          <SectionTitle title={sectionTitle} isForumLayout />
          <div
            className={clsx(
              ctaToolCollaboration && 'd-flex',
              device.mediaIsTablet && 'flex-column-reverse'
            )}
          >
            {hasUserPermission(['acc.clb']) &&
            ctaToolCollaboration &&
            !device.mediaIsPhone ? (
              <Button
                outline
                color='primary'
                icon
                className={clsx(
                  'd-flex',
                  'align-items-center',
                  !device.mediaIsTablet && 'mr-3'
                )}
                onClick={ctaToolCollaboration}
                aria-label={ctaToolCollaboration?.toString()}
              >
                {iconCtaToolCollaboration ? (
                  <Icon
                    icon={iconCtaToolCollaboration}
                    color='primary'
                    className='mr-1'
                    aria-label={ctaToolCollaboration?.toString()}
                    aria-hidden
                  />
                ) : null}
                <span className='text-nowrap'>{textCtaToolCollaboration}</span>
              </Button>
            ) : null}

            {cta && !device.mediaIsPhone ? (
              <Button
                color='primary'
                icon
                className={clsx(
                  'page-title__cta',
                  device.mediaIsTablet && 'mb-3'
                )}
                onClick={cta}
                data-testid='create-new-entity'
                aria-label={`Crea ${
                  isCommunity ? 'topic' : isDocument ? 'documento' : 'news'
                }`}
              >
                {iconCta ? (
                  <Icon
                    color='white'
                    icon={iconCta}
                    className='mr-1'
                    aria-label='Crea'
                    aria-hidden
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
                    aria-label=''
                  />
                ) : null}
                {textCta}
              </NavLink>
            ) : null}
          </div>
        </div>
        <div className='container'>
          <Slider cardSlider isItemsHome={!device.mediaIsPhone}>
            {formatSlides(cards, numberOfSlides()).map(
              (el: ForumCardsI[], i: number) => (
                <div
                  key={`slide-${i}`}
                  className='d-flex flex-row align-items-start w-100'
                >
                  {el.map((e: ForumCardsI, index: number) => (
                    <div
                      key={`card-${i}-${index}`}
                      style={{
                        width: device.mediaIsDesktop ? '30%' : '100%',
                      }}
                      className='h-auto flex-grow-0 sliding-cards'
                    >
                      <CardSlider
                        id={e.id}
                        isDocument={isDocument}
                        isNews={isNews}
                        isCommunity={isCommunity}
                        category_label={e.category_label}
                        date={e.date}
                        title={e.title}
                        downloads={e.downloads}
                        comment_count={e.comment_count}
                        likes={e.likes}
                        views={e.views}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </Slider>
        </div>
      </div>
      <div
        className={clsx(
          'container',
          !device.mediaIsDesktop
            ? 'd-flex flex-column'
            : 'd-flex flex-row justify-content-between align-items-start w-100'
        )}
      >
        <div className='d-flex flex-column'>
          <SectionTitle
            title={description}
            className='justify-content-start , pt-2'
          />
          {dropdowns?.length ? (
            <div
              className={clsx(
                'd-flex',
                device.mediaIsPhone ? 'flex-wrap' : 'flex-nowrap',
                'pt-lg-3',
                'pt-0',
                'pl-1',
                buttonsList?.length && 'w-50'
              )}
            >
              {dropdowns.map((dropdown, index) => (
                <DropdownFilter
                  key={index}
                  filterName={dropdown.filterName || ''}
                  {...dropdown}
                  isDetail={isDetail}
                />
              ))}
            </div>
          ) : null}

          {buttonsList?.length && (
            <div
              className={clsx(
                'd-flex',
                'flex-row',
                'flex-wrap',
                'pt-lg-3',
                'pt-0',
                'w-50',
                isDetail && 'justify-content-end'
              )}
            >
              <ButtonsBar buttons={buttonsList} />
            </div>
          )}
          <div
            className={clsx(
              showChips &&
                'container d-flex justify-content-between align-items-baseline'
            )}
          >
            {showChips ? (
              <div
                className={clsx(
                  'd-flex',
                  'flex-row',
                  'my-4',
                  'flex-wrap',
                  'align-items-center'
                )}
              >
                {Object.keys(filtersList).map((filterKey, index) => (
                  <div
                    key={index}
                    className={clsx(device.mediaIsPhone && 'pb-3')}
                  >
                    {getLabelsChips(filtersList[filterKey], index, filterKey)}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {sortFilter && (
          <div
            className={clsx(
              !device.mediaIsDesktop
                ? 'd-flex justify-content-start ml-2 mb-4'
                : 'pb-2 pr-3 pt-lg-3'
            )}
          >
            <PillDropDown
              isDocument={isDocument}
              onChange={handleSortFilterChange}
            />
          </div>
        )}
      </div>

      {children}
      {device.mediaIsPhone && cta && !ctaToolCollaboration ? (
        <div>
          <Sticky
            mode='bottom'
            stickyClassName={clsx(
              'sticky',
              'bg-white',
              device.mediaIsPhone && 'pr-3'
            )}
          >
            <div className='container'>
              <ButtonsBar
                forumAlignment
                isDocumentsCta={isDocumentsCta}
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
      ) : device.mediaIsPhone && cta && ctaToolCollaboration ? (
        <div>
          <Sticky
            mode='bottom'
            stickyClassName={clsx(
              'sticky',
              'bg-white',
              device.mediaIsPhone && 'pr-3'
            )}
          >
            <div className='container'>
              <ButtonsBar
                forumAlignment
                buttons={[
                  {
                    size: 'xs',
                    color: 'primary',
                    iconForButton: iconCta || '',
                    text: textCta || '',
                    onClick: cta,
                    className: 'align-self-end',
                  },
                  {
                    size: 'xs',
                    outline: true,
                    color: 'primary',
                    iconForButton: iconCtaToolCollaboration || '',
                    iconColor: 'primary',
                    text: textCtaToolCollaboration || '',
                    onClick: ctaToolCollaboration,
                    className: 'align-self-end',
                  },
                ]}
              />
            </div>
          </Sticky>
        </div>
      ) : null}
    </>
  );
};

export default ForumLayout;
