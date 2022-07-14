import React, { ReactElement, useState } from 'react';
import { Icon, Button } from 'design-react-kit';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface AccordionRowI {
  title: string;
  clickViewAction?: () => void;
  innerInfo?:
    | {
        [key: string]: string;
      }
    | undefined;
  status?: string | undefined;
  StatusElement?: ReactElement | undefined;
}

const AccordionRow: React.FC<AccordionRowI> = ({
  title,
  clickViewAction,
  innerInfo,
  status,
  StatusElement,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <div className='accordion-row'>
      <div
        className={clsx(
          'd-flex',
          'justify-content-between',
          'align-items-center',
          'w-100'
        )}
      >
        <div
          className={clsx(
            'd-flex',
            'justify-content-start',
            'px-2',
            'py-2',
            'align-items-center'
          )}
        >
          {isOpen ? (
            <Button onClick={() => setIsOpen(false)}>
              <Icon
                icon='it-less-circle'
                className='accordion-row--icon'
                aria-label='nascondi elemento'
              />
            </Button>
          ) : null}
          {!isOpen ? (
            <Button onClick={() => setIsOpen(true)}>
              <Icon
                icon='it-plus-circle'
                className='accordion-row--icon'
                aria-label='mostra elemento'
              />
            </Button>
          ) : null}
          <span className='font-weight-semibold'>{title}</span>
        </div>
        <Button>
          <div className='d-flex justify-content-start'>
            <Icon
              icon='it-chevron-right'
              onClick={clickViewAction}
              aria-label='seleziona programma'
            />
          </div>
        </Button>
      </div>
      <div>
        {innerInfo?.['defaultSCD'] && innerInfo?.['defaultRFD'] ? (
          <div className='d-flex flex-row justify-content-center'>
            <div className='d-flex flex-row mr-2'>
              {innerInfo['defaultSCD']}{' '}
              <span className='ml-2'>Default SCD</span>
            </div>
            <div className='d-flex flex-row ml-2'>
              {innerInfo['defaultRFD']}{' '}
              <span className='ml-2'>Default RFD</span>
            </div>
          </div>
        ) : null}
      </div>
      {isOpen && innerInfo && (
        <div
          className={clsx(
            'info-container',
            'px-4',
            'py-2',
            'd-flex',
            'justify-content-between',
            'align-items-center'
          )}
        >
          <div className='d-flex flex-column pl-4'>
            {Object.keys(innerInfo)
              .filter((el) => el !== 'defaultSCD' && el !== 'defaultRFD')
              .map((x, index) => (
                <div className='info-row' key={index}>
                  <span className='text-uppercase font-weight-semibold info-title'>
                    {t(x)}:{' '}
                  </span>
                  <span>{innerInfo[x]}</span>
                </div>
              ))}
          </div>
          <div
            className={clsx(
              'd-flex',
              'flex-column',
              'justify-content-start',
              'mb-3',
              'pb-5',
              'pt-1'
            )}
          >
            {StatusElement && <div className='mr-4'>{StatusElement}</div>}
            {status && <div>{status}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionRow;
