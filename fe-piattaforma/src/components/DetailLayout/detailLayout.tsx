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
//import { formTypes } from '../../pages/administrator/AdministrativeArea/Entities/utils';

interface DetailLayoutI {
  nav?: ReactElement;
  formButtons?: ButtonInButtonsBar[] | undefined;
  itemsAccordionList?: ItemsListI[] | null | undefined;
  titleInfo: {
    title: string;
    status: string;
    upperTitle: {
      icon: string | any;
      text: string;
    };
    subTitle?: string;
    headingRole?: boolean;
  };
  itemsList?: ItemsListI | null | undefined;
  showItemsList?: boolean;
  buttonsPosition: 'TOP' | 'BOTTOM';
  showGoBack?: boolean;
  goBackTitle?: string;
  children?: ReactElement | undefined;
  currentTab?: string;
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
  children,
  currentTab,
}) => {
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  return (
    <>
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
      {buttonsPosition === 'TOP' && formButtons && formButtons.length !== 0 ? (
        <>
          <div aria-hidden='true'>
            <Sticky mode='bottom'>
              {formButtons.length === 3 ? (
                device.mediaIsPhone ? (
                  <div
                    className={clsx(
                      'd-flex',
                      'flex-row',
                      'justify-content-between',
                      'bg-white',
                      'flex-wrap'
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
                      'bg-white',
                      'sticky-body'
                    )}
                  >
                    <ButtonsBar buttons={formButtons.slice(0, 1)} />
                    <ButtonsBar buttons={formButtons.slice(1)} />
                  </div>
                )
              ) : (
                <ButtonsBar buttons={formButtons} />
              )}
            </Sticky>
          </div>
          <div className='sr-only'>
            <ButtonsBar buttons={formButtons} />
          </div>
        </>
      ) : null}
      {itemsAccordionList && itemsAccordionList.length
        ? itemsAccordionList.map((singleItem, index) => (
            <Accordion
              title={singleItem.title ? singleItem.title : ''}
              totElem={singleItem.items.length}
              cta={`Aggiungi ${singleItem.title}`}
              onClickCta={() =>
                dispatch(
                  openModal({
                    id:
                      singleItem.title === 'Referenti'
                        ? formTypes.REFERENTE
                        : formTypes.DELEGATO,
                    payload: { title: `Aggiungi ${singleItem.title}` },
                  })
                )
              }
              key={index}
              lastBottom={index === itemsAccordionList.length - 1}
            >
              {singleItem.items.map((item, index: number) => (
                <CardStatusAction
                  key={index}
                  title={item.nome}
                  status={item.stato}
                  onActionClick={item.actions}
                  id={item.id}
                  fullInfo={item.fullInfo}
                />
              ))}
            </Accordion>
          ))
        : null}
      {showItemsList && itemsList && itemsList.items?.length ? (
        <>
          {itemsList.title && (
            <h2 className='h4 neutral-1-color-a7'>{itemsList.title}</h2>
          )}{' '}
          {itemsList.items.map((item, index) => {
            if (index === 0) {
              return (
                <div>
                  <CardStatusAction
                    moreThanOneSurvey={currentTab === 'questionari'}
                    title={item.nome}
                    status={item.stato}
                    key={item.id}
                    id={item.id}
                    fullInfo={item.fullInfo}
                    onActionClick={item.actions}
                  />
                  {device.mediaIsDesktop && currentTab === 'questionari' && (
                    <h3 className='h4 text-muted'> Altri questionari </h3>
                  )}
                </div>
              );
            } else {
              return (
                <CardStatusAction
                  moreThanOneSurvey={currentTab === 'questionari'}
                  title={item.nome}
                  status={item.stato}
                  key={item.id}
                  id={item.id}
                  fullInfo={item.fullInfo}
                  onActionClick={item.actions}
                />
              );
            }
          })}{' '}
        </>
      ) : null}
      {buttonsPosition === 'BOTTOM' &&
      formButtons &&
      formButtons.length !== 0 ? (
        <>
          <div aria-hidden='true'>
            <Sticky mode='bottom'>
              <ButtonsBar buttons={formButtons} />
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
