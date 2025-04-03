import React, { ReactElement, useEffect, useState } from 'react';
import { ItemListElemI, ItemsListI } from '../../utils/common';
import Sticky from 'react-sticky-el';
import { Accordion, ButtonsBar, Paginator } from '../index';
import { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import CardStatusAction from '../CardStatusAction/cardStatusAction';
import SectionTitle from '../SectionTitle/sectionTitle';
import { Button, FormGroup, Icon } from 'design-react-kit';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import clsx from 'clsx';
import { openModal } from '../../redux/features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { formTypes } from '../../pages/administrator/AdministrativeArea/Entities/utils';
import CardStatusActionProject from '../CardStatusAction/cardStatusActionProject';
import CardStatusActionHeadquarters from '../CardStatusAction/cardStatusActionHeadquarters';
import CardStatusActionSurveys from '../CardStatusAction/cardStatusActionSurveys';
import CardStatusActionPartnerAuthority from '../CardStatusAction/cardStatusActionPartnerAuthority';
import EmptySection from '../EmptySection/emptySection';
import IconNote from '/public/assets/img/it-note-primary.png';
import { selectEntityPagination, setEntityPagination } from '../../redux/features/administrativeArea/administrativeAreaSlice';
import { selectProfile } from '../../redux/features/user/userSlice';

interface DetailLayoutI {
  nav?: ReactElement;
  formButtons?: ButtonInButtonsBar[] | undefined;
  itemsAccordionList?: ItemsListI[] | null | undefined;
  titleInfo: {
    title: string;
    status?: string | undefined;
    upperTitle: {
      icon: string;
      text: string;
    };
    subTitle?: string;
    headingRole?: boolean;
    iconAvatar?: boolean;
    name?: string | undefined;
    surname?: string | undefined;
  };
  itemsList?: ItemsListI | null | undefined;
  showItemsList?: boolean;
  buttonsPosition?: 'TOP' | 'BOTTOM';
  showGoBack?: boolean;
  goBackTitle?: string;
  goBackPath?: string;
  children?: ReactElement | undefined;
  currentTab?: string;
  surveyDefault?: ItemsListI | null | undefined;
  isRadioButtonItem?: boolean;
  onRadioChange?: (surveyDefault: string) => void;
  isUserProfile?: boolean | string | undefined;
  citizenList?: boolean;
  citizenDeleteChange?: boolean;
  enteIcon?: boolean;
  profilePicture?: string | undefined;
  isRoleManagement?: boolean;
  infoProgBtn?: boolean;
  infoProjBtn?: boolean;
  noTitleEllipsis?: boolean;
}
const DetailLayout: React.FC<DetailLayoutI> = ({
  formButtons,
  itemsAccordionList,
  titleInfo,
  nav,
  itemsList,
  showItemsList = true,
  buttonsPosition = 'BOTTOM',
  showGoBack = true,
  goBackTitle = 'Torna indietro',
  goBackPath,
  children,
  currentTab,
  surveyDefault,
  isRadioButtonItem = false,
  isUserProfile = false,
  onRadioChange,
  citizenList = false,
  citizenDeleteChange = false,
  enteIcon = false,
  profilePicture,
  isRoleManagement = false,
  infoProgBtn = false,
  infoProjBtn = false,
  noTitleEllipsis = false,
}) => {
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();
  const pagination = useAppSelector(selectEntityPagination);
  const ruolo = useAppSelector(selectProfile)?.codiceRuolo;
  const idEnteRuolo = useAppSelector(selectProfile)?.idEnte;

  const handleOnChangePage = (
      pageNumber: number = pagination?.pageNumber,
      pageSize = 4
    ) => {
      dispatch(setEntityPagination({ pageNumber, pageSize }));
  };
  const [currentItems, setCurrentItems] = useState<ItemListElemI[]>([]);

  useEffect(() => {
    if (currentTab === 'sedi' && itemsList?.items) {
      // 1. Ordina l'intera lista PRIMA di applicare la paginazione
      const sortedItems = itemsList.items
        .map((item) => ({
          ...item,
          res: showIconBasedOnRole(item),
        }))
        .sort((a, b) => a.res - b.res);
  
      // 2. Applica la paginazione DOPO l'ordinamento
      const start = (pagination.pageNumber - 1) * pagination.pageSize;
      const end = pagination.pageNumber * pagination.pageSize;
      const paginatedItems = sortedItems.slice(start, end);
  
      setCurrentItems(paginatedItems);
    }
  }, [currentTab, pagination.pageNumber, pagination.pageSize, itemsList]);
  

  useEffect(() => {
    if (currentTab === 'sedi') {
      dispatch(setEntityPagination({ pageNumber: 1, pageSize: 4 }));
    }else{
      setCurrentItems([]);
    }
  }, [currentTab]);

  const showIconBasedOnRole = (item: ItemListElemI) => {
    // 1 MODIFICA
    // 2 VISUALIZZA
    // 3 -    
  
    switch (ruolo) {
      case 'DTD':
        return 1;
      case 'DEG':
      case 'REG':
        return 2;
      case 'REGP':
      case 'DEGP':
      case 'REPP':
      case 'DEPP':
        if(idEnteRuolo == item?.identeDiRiferimento) return 1;
        else return 2;
      case 'FAC':
      case 'VOL':
        return 3;
    }
    return 3;
  };
    
  return (
    <>
      <div>
        {showGoBack && (
          <Button
            onClick={() =>
              goBackPath && goBackTitle !== 'Torna indietro'
                ? navigate(goBackPath, { replace: true })
                : navigate(-1)
            }
            className={clsx(device.mediaIsPhone ? 'px-0 mb-5 mr-5' : 'px-0')}
            aria-label='torna indietro'
          >
            <Icon
              icon='it-chevron-left'
              color='primary'
              aria-label='torna indietro'
              aria-hidden
            />
            <span className='primary-color'>{goBackTitle}</span>
          </Button>
        )}
        <SectionTitle
          enteIcon={enteIcon}
          isUserProfile={isUserProfile}
          profilePicture={profilePicture}
          {...titleInfo}
          noTitleEllipsis={noTitleEllipsis}
        />
        {nav && (
          <div
            className={clsx(
              'd-flex',
              'justify-content-center',
              'w-100',
              'mt-5',
              device.mediaIsPhone && citizenList ? 'mb-0' : 'mb-5'
            )}
          >
            {nav}
          </div>
        )}
        <div id='content-tab'>{children}</div>
        {currentTab === 'sedi' ? (
          <div className={clsx('text-left', 'mb-5', 'mx-3')}>
          {<>
            Questa sezione riporta le sedi associate al progetto.
          </>}
          </div>

        ) : null}
        {itemsAccordionList?.length
          ? itemsAccordionList.map((singleItem, index) => (
              <Accordion
                title={singleItem.title || ''}
                totElem={singleItem.items.length}
                cta={`Aggiungi ${singleItem.title}`}
                onClickCta={() =>
                  dispatch(
                    openModal({
                      id:
                        singleItem.title === 'Referenti'
                          ? formTypes.REFERENTE
                          : singleItem.title === 'Delegati'
                          ? formTypes.DELEGATO
                          : singleItem.title === 'Facilitatori'
                          ? formTypes.FACILITATORE
                          : formTypes.SEDE,
                      payload: { title: `Aggiungi ${singleItem.title}` },
                    })
                  )
                }
                key={index}
                lastBottom={index === itemsAccordionList.length - 1}
              >
                {singleItem.items?.length ? (
                  singleItem.items.map((item) => (
                    <CardStatusAction
                      key={item.id}
                      title={`${item.cognome ? item.cognome : ''} ${
                        item.nome
                      }`.trim()}
                      status={item.stato}
                      onActionClick={item.actions}
                      id={item.id}
                      fullInfo={item.fullInfo}
                      cf={item.codiceFiscale}
                    />
                  ))
                ) : (
                  <EmptySection
                    title={`Non sono presenti ${singleItem.title?.toLowerCase()} associati.`}
                    icon={IconNote}
                    withIcon
                    noMargin
                  />
                )}
              </Accordion>
            ))
          : null}
        {currentTab === 'questionari' ? (
          surveyDefault?.items?.length && showItemsList ? (
            <div>
              <CardStatusActionSurveys
                title={surveyDefault?.items[0].nome}
                status={surveyDefault?.items[0].stato}
                id={surveyDefault?.items[0].id}
                fullInfo={surveyDefault?.items[0]?.fullInfo}
                onActionClick={surveyDefault?.items[0]?.actions}
              />
              {isRadioButtonItem &&
                !device.mediaIsPhone &&
                currentTab === 'questionari' &&
                itemsList?.items?.length && (
                  <h3 className='h5 text-muted mx-3 my-4 pt-2'>
                    Questionari disponibili
                  </h3>
                )}
            </div>
          ) : null
        ) : null}
        {showItemsList &&
        itemsList?.items?.length &&
        currentTab === 'questionari' ? (
          <>
            {itemsList.title && (
              <h2 className='h4 neutral-1-color-a7'>{itemsList.title}</h2>
            )}
            {((currentTab === 'questionari' && isRadioButtonItem) ||
              currentTab !== 'questionari') && (
              <FormGroup check>
                {itemsList.items.map((item) => {
                  return (
                    <CardStatusActionSurveys
                      moreThanOneSurvey={
                        currentTab === 'questionari' && isRadioButtonItem
                      }
                      title={item.nome}
                      status={item.stato}
                      key={item.id}
                      id={item.id}
                      fullInfo={item.fullInfo}
                      onActionClick={item.actions}
                      onCheckedChange={(surveyChecked: string) =>
                        onRadioChange ? onRadioChange(surveyChecked) : null
                      }
                    />
                  );
                })}
              </FormGroup>
            )}
          </>
        ) : null}
        {currentTab === 'progetti' && showItemsList && itemsList?.items?.length
          ? itemsList.items.map((item) => {
              return (
                <CardStatusActionProject
                  title={item.nome}
                  status={item.stato}
                  key={item.id}
                  id={item.id}
                  fullInfo={item.fullInfo}
                  onActionClick={item.actions}
                />
              );
            })
          : null}
        {currentTab === 'enti-partner' &&
        showItemsList &&
        itemsList?.items?.length
          ? itemsList.items
              .filter(item => !item.enteDiRiferimento)
              .map((item) => {
                return (
                  <CardStatusActionPartnerAuthority
                    title={item.nome}
                    status={item.stato}
                    key={item.id}
                    id={item.id}
                    fullInfo={item.fullInfo}
                    onActionClick={item.actions}
                  />
                );
              })
          : null}
          {currentTab === 'sedi' && showItemsList && currentItems?.length
            ? currentItems
                .map((item) => ({
                  ...item,
                  res: showIconBasedOnRole(item),
                }))
                .sort((a, b) => a.res - b.res) // Ordina per res (1 prima, poi 2, poi 3)
                .map((item) => (
                  <CardStatusActionHeadquarters
                    title={item.nome}
                    status={item.stato}
                    key={item.id}
                    id={item.id}
                    fullInfo={item.fullInfo}
                    onActionClick={item.actions}
                    showPencil={item.res === 1}
                    showEye={item.res === 2}
                    showBlank={item.res === 3}
                  />
                ))
            : null}
          {pagination?.totalPages && currentTab === 'sedi' &&(
            <div className='pb-5'>
              <Paginator
                activePage={pagination.pageNumber}
                pageSize={pagination.pageSize}
                total={itemsList?.items ? Math.ceil(itemsList.items.length / pagination.pageSize) : 0}
                onChange={handleOnChangePage}
              />
            </div>
          )}
        {showItemsList && itemsList?.items?.length && currentTab === 'info' ? (
          <>
            {itemsList.title && (
              <h2 className='h4 neutral-1-color-a7'>{itemsList.title}</h2>
            )}
            {itemsList.items.map((item) => {
              return (
                <CardStatusAction
                  title={item.nome}
                  status={item.stato}
                  key={item.id}
                  id={item.id}
                  onActionClick={item.actions}
                />
              );
            })}
          </>
        ) : null}
        {buttonsPosition === 'TOP' &&
        formButtons &&
        formButtons.length !== 0 ? (
          <Sticky mode='bottom' stickyClassName='sticky bg-white'>
            <ButtonsBar buttons={formButtons} />
          </Sticky>
        ) : null}
      </div>

      {buttonsPosition === 'BOTTOM' &&
      formButtons &&
      formButtons.length !== 0 ? (
        <div className='mt-5 w-100'>
          <Sticky
            mode='bottom'
            stickyClassName={clsx(
              'sticky',
              'bg-white',
              'container',
              isUserProfile && 'pr-4',
              isRoleManagement && 'pr-4',
              device.mediaIsPhone && 'pr-5',
              device.mediaIsTablet && 'pr-0'
            )}
          >
            {formButtons.length === 2 &&
            (infoProgBtn ||
              (infoProjBtn &&
                titleInfo?.status !== 'ATTIVABILE' &&
                titleInfo?.status !== 'NON ATTIVO')) ? (
              <div
                className={clsx(
                  'd-flex',
                  'justify-content-between',
                  'w-100',
                  device.mediaIsPhone && 'flex-column container'
                )}
              >
                <ButtonsBar buttons={formButtons.slice(0, 1)} />
                <ButtonsBar buttons={formButtons.slice(1)} />
              </div>
            ) : (
              <div className={clsx(!citizenList && 'container', 'text-center')}>
                <ButtonsBar
                  citizenDeleteChange={citizenDeleteChange}
                  buttons={formButtons}
                  isUserProfile={!!isUserProfile}
                />
              </div>
            )}
          </Sticky>
        </div>
      ) : null}
    </>
  );
};

export default DetailLayout;
