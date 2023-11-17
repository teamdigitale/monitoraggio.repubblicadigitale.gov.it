import React, { ReactElement, useState } from 'react';
import {
  Icon,
  Button,
  UncontrolledTooltip,
  FormGroup,
  Label,
} from 'design-react-kit';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import Form from '../Form/form';
import Input from '../Form/input';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

export interface AccordionRowI {
  id: string;
  title: string;
  clickViewAction?: () => void;
  clickEditAction?: () => void;
  clickDeleteAction?: () => void;
  innerInfo?:
    | {
        [key: string]: string;
      }
    | undefined;
  status?: string | undefined;
  StatusElement?: ReactElement | undefined;
  onTooltipInfo?: string;
  onActionRadio?: CRUDActionsI | undefined;
}

const AccordionRow: React.FC<AccordionRowI> = ({
  id,
  title,
  clickViewAction,
  clickEditAction,
  clickDeleteAction,
  innerInfo,
  status,
  StatusElement,
  onTooltipInfo = '',
  onActionRadio,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const device = useAppSelector(selectDevice);

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
          {innerInfo ? (
            <>
              {isOpen ? (
                <Button onClick={() => setIsOpen(false)}>
                  <Icon
                    icon='it-less-circle'
                    className='accordion-row--icon'
                    aria-label={`Riduci informazioni di ${title}`}
                  />
                </Button>
              ) : null}
              {!isOpen ? (
                <Button onClick={() => setIsOpen(true)}>
                  <Icon
                    icon='it-plus-circle'
                    className='accordion-row--icon'
                    aria-label={`Espandi informazioni di ${title}`}
                  />
                </Button>
              ) : null}
            </>
          ) : null}
          <span className='font-weight-semibold'>{title}</span>
        </div>
        <div className={clsx(device.mediaIsPhone && 'd-flex flex-row')}>
          {clickEditAction ? (
            <Button
              className={clsx(
                'd-flex justify-content-start',
                device.mediaIsPhone && 'px-2'
              )}
            >
              <Icon
                icon='it-pencil'
                color='primary'
                onClick={clickEditAction}
                aria-label={`Modifica ${title}`}
              />
            </Button>
          ) : null}
          {clickDeleteAction ? (
            <Button
              className={clsx(
                'd-flex justify-content-start',
                device.mediaIsPhone && 'px-2'
              )}
            >
              <Icon
                icon='it-less-circle'
                color='primary'
                onClick={clickDeleteAction}
                aria-label={`Elimina ${title}`}
              />
            </Button>
          ) : null}
          {clickViewAction ? (
            <Button
              className={clsx(
                'd-flex justify-content-start',
                device.mediaIsPhone && 'px-2'
              )}
            >
              <Icon
                icon='it-chevron-right'
                onClick={clickViewAction}
                aria-label={`Vai al dettaglio di ${title}`}
              />
            </Button>
          ) : null}
        </div>
        {((onTooltipInfo || innerInfo?.onTooltipInfo) &&
          innerInfo?.isPresentInList) ||
        innerInfo?.failedCSV ? (
          <div
            className='d-inline-flex position-relative'
            id={`tooltip-${innerInfo.id}`}
          >
            <UncontrolledTooltip
              placement='bottom'
              target={`tooltip-${innerInfo.id}`}
              /*  isOpen={openOne}
                  toggle={() => toggleOne(!openOne)} */
            >
              {onTooltipInfo}
              {innerInfo.onTooltipInfo}
            </UncontrolledTooltip>
            <Icon
              icon='it-info-circle'
              size='sm'
              color='primary'
              aria-label='Informazioni'
              aria-hidden
            />
          </div>
        ) : null}
      </div>
      <div>
        {innerInfo?.['defaultSCD'] && innerInfo?.['defaultRFD'] ? (
          <div className='d-flex flex-row justify-content-center'>
            <div className='d-flex flex-row mr-2'>
              {innerInfo['defaultSCD']}
              <span className='ml-2'>Default SCD</span>
            </div>
            <div className='d-flex flex-row ml-2'>
              {innerInfo['defaultRFD']}
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
          <div className='d-flex flex-column'>
            {Object.keys(innerInfo)
              .filter(
                (el) =>
                  el !== 'defaultSCD' &&
                  el !== 'defaultRFD' &&
                  el !== 'isPresentInList'
              )
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
          {onActionRadio && (
            <Form id='form-table-dsk' showMandatory={false}>
              <FormGroup check>
                <Input
                  name='group'
                  type='radio'
                  id={`radio-${id}`}
                  // checked={id === idRadioSelected}
                  withLabel={false}
                  onInputChange={() => {
                    onActionRadio[CRUDActionTypes.SELECT]({
                      id: id,
                      label: title,
                    });
                  }}
                />
                <Label className='sr-only' check htmlFor={`radio-${id}`}>
                  {`Seleziona ${title}`}
                </Label>
              </FormGroup>
            </Form>
          )}
        </div>
      )}
    </div>
  );
};

export default AccordionRow;
