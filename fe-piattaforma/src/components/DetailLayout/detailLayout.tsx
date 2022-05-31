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

interface DetailLayoutI {
  nav?: ReactElement;
  Form?: ReactElement | undefined;
  formButtons: ButtonInButtonsBar[];
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
  buttonsPosition: 'TOP' | 'BOTTOM';
  showGoBack?: boolean;
  goBackTitle?: string;
}
const DetailLayout: React.FC<DetailLayoutI> = ({
  Form,
  formButtons,
  itemsAccordionList,
  titleInfo,
  nav,
  itemsList,
  buttonsPosition,
  showGoBack = true,
  goBackTitle = 'Torna indietro',
}) => {
  const navigate = useNavigate();
  const device = useAppSelector(selectDevice);

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
        <div className='d-flex justify-content-center w-100 mt-5 mb-5'>
          {nav}
        </div>
      )}
      {Form && <div>{Form}</div>}
      {buttonsPosition === 'TOP' && formButtons && formButtons.length !== 0 ? (
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
      {itemsAccordionList && itemsAccordionList.length
        ? itemsAccordionList.map((singleItem, index) => (
            <Accordion
              title={singleItem.title ? singleItem.title : ''}
              totElem={singleItem.items.length}
              cta='Aggiungi referente'
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
      {itemsList && itemsList.items?.length ? (
        <>
          {itemsList.title && <h2 className='h4'>{itemsList.title}</h2>}{' '}
          {itemsList.items.map((item) => (
            <CardStatusAction
              title={item.nome}
              status={item.stato}
              key={item.id}
              id={item.id}
              fullInfo={item.fullInfo}
              onActionClick={item.actions}
            />
          ))}{' '}
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
