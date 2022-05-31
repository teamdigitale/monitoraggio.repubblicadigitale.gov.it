import React, { ReactElement, useState } from 'react';
import { Icon, Button } from 'design-react-kit';
import { useTranslation } from 'react-i18next';

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
      <div className='d-flex justify-content-between align-items-center w-100'>
        <div className='d-flex justify-content-start px-2 py-2 align-items-center'>
          {isOpen ? (
            <Button onClick={() => setIsOpen(false)}>
              <Icon icon='it-less-circle' className='accordion-row--icon' />
            </Button>
          ) : null}
          {!isOpen ? (
            <Button onClick={() => setIsOpen(true)}>
              <Icon icon='it-plus-circle' className='accordion-row--icon' />
            </Button>
          ) : null}
          <span className='font-weight-semibold'>{title}</span>
        </div>
        <Button>
          <div className='d-flex justify-content-start'>
            <Icon icon='it-chevron-right' onClick={clickViewAction} />
          </div>
        </Button>
      </div>
      {isOpen && innerInfo && (
        <div className='info-container px-4  py-2 d-flex justify-content-between align-items-center'>
          <div className='d-flex flex-column pl-4'>
            {Object.keys(innerInfo).map((x, index) => (
              <div className='info-row' key={index}>
                <span className='text-uppercase font-weight-semibold info-title'>
                  {t(x)}:{' '}
                </span>
                <span>{innerInfo[x]}</span>
              </div>
            ))}
          </div>
          {StatusElement && <div className='mr-4'>{StatusElement}</div>}
          {status && <div className='mr-4'>{status}</div>}
        </div>
      )}
    </div>
  );
};

export default AccordionRow;
