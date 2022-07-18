import React, { ReactElement } from 'react';
import { ItemsListI } from '../../utils/common';
import Sticky from 'react-sticky-el';
import { Accordion, ButtonsBar } from '../index';
import { ButtonInButtonsBar } from '../ButtonsBar/buttonsBar';
import CardStatusAction from '../CardStatusAction/cardStatusAction';
import SectionTitle from '../SectionTitle/sectionTitle';
import { Button, Icon } from 'design-react-kit';
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

interface DetailLayoutI {
  nav?: ReactElement;
  formButtons?: ButtonInButtonsBar[] | undefined;
  itemsAccordionList?: ItemsListI[] | null | undefined;
  titleInfo: {
    title: string;
    status: string;
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
  buttonsPosition: 'TOP' | 'BOTTOM';
  showGoBack?: boolean;
  goBackTitle?: string;
  goBackPath?: string;
  children?: ReactElement | undefined;
  currentTab?: string;
  surveyDefault?: ItemsListI | null | undefined;
  isRadioButtonItem?: boolean;
  onRadioChange?: (surveyDefault: string) => void;
}
const DetailLayout: React.FC<DetailLayoutI> = ({
  formButtons,
  itemsAccordionList,
  titleInfo,
  nav,
  itemsList,
  showItemsList = true,
  buttonsPosition,
  showGoBack = true,
  goBackTitle = 'Torna indietro',
  //goBackPath = '/',
  children,
  currentTab,
  surveyDefault,
  isRadioButtonItem = false,
  onRadioChange,
}) => {
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  return (
    <>
      <div>
        {showGoBack && (
          <Button
            onClick={() => navigate(-1)}
            className={clsx(device.mediaIsPhone ? 'px-0 mb-5 mr-5' : 'px-0')}
          >
            <Icon
              icon='it-chevron-left'
              color='primary'
              aria-label='Torna indietro'
            />
            <span className='primary-color'>{goBackTitle}</span>
          </Button>
        )}
        <SectionTitle {...titleInfo} />
        {nav && (
          <div
            className={clsx(
              'd-flex',
              'justify-content-center',
              'w-100',
              'mt-5',
              'mb-5'
            )}
          >
            {nav}
          </div>
        )}
        <div>{children}</div>
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
                      title={`${item.nome} ${item.cognome}`.trim()}
                      status={item.stato}
                      onActionClick={item.actions}
                      id={item.id}
                      fullInfo={item.fullInfo}
                      cf={item.codiceFiscale}
                    />
                  ))
                ) : (
                  <EmptySection
                    title={`Non esistono ${singleItem.title?.toLowerCase()} associati`}
                    aside
                  />
                )}
              </Accordion>
            ))
          : null}
        {(currentTab === 'questionari'
          && surveyDefault?.items?.length
          && showItemsList
        ) ? (
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
                  <h3 className='h4 text-muted mx-3'> Altri questionari </h3>
                )}
            </div>
          ) : <EmptySection title='Non ci sono questionari' />}
        {showItemsList &&
        itemsList?.items?.length &&
        currentTab === 'questionari' ? (
          <>
            {itemsList.title && (
              <h2 className='h4 neutral-1-color-a7'>{itemsList.title}</h2>
            )}{' '}
            {((currentTab === 'questionari' && isRadioButtonItem) ||
              currentTab !== 'questionari') &&
              itemsList.items.map((item) => {
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
              })}{' '}
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
          ? itemsList.items.map((item) => {
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
        {currentTab === 'sedi' && showItemsList && itemsList?.items?.length
          ? itemsList.items.map((item) => {
              return (
                <CardStatusActionHeadquarters
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

        {buttonsPosition === 'BOTTOM' &&
        formButtons &&
        formButtons.length !== 0 ? (
          <>
            <div aria-hidden='true'>
              <Sticky mode='bottom' stickyClassName='sticky bg-white'>
                <ButtonsBar buttons={formButtons} />
              </Sticky>
            </div>
            <div className='sr-only'>
              <ButtonsBar buttons={formButtons} />
            </div>
          </>
        ) : null}
      </div>

      {buttonsPosition === 'TOP' && formButtons && formButtons.length !== 0 ? (
        <>
          <div aria-hidden='true' className='mt-5 w-100'>
            <Sticky mode='bottom' stickyClassName='sticky bg-white container'>
              {formButtons.length === 3 ? (
                device.mediaIsPhone ? (
                  <div
                    className={clsx(
                      'd-flex',
                      'flex-row',
                      'justify-content-between',
                      'flex-wrap',
                      'container',
                      'w-100'
                    )}
                  >
                    <ButtonsBar buttons={formButtons.slice(1)} />
                    <ButtonsBar buttons={formButtons.slice(0, 1)} />
                  </div>
                ) : (
                  <div
                    className={clsx(
                      'd-flex',
                      'flex-row',
                      'justify-content-between',
                      'container',
                      'w-100'
                    )}
                  >
                    <ButtonsBar buttons={formButtons.slice(0, 1)} />
                    <ButtonsBar buttons={formButtons.slice(1)} />
                  </div>
                )
              ) : (
                <div className='container text-center'>
                  <ButtonsBar buttons={formButtons} />
                </div>
              )}
            </Sticky>
          </div>
          <div className='sr-only'>
            <ButtonsBar buttons={formButtons} />
          </div>
        </>
      ) : null}
    </>
  );
};

export default DetailLayout;
