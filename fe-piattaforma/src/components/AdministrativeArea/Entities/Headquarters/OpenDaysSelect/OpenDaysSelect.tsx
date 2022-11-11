import clsx from 'clsx';
import { Collapse, FormGroup, Label } from 'design-react-kit';
import React from 'react';
import {
  dayCode,
  dayOfWeek,
} from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';
import { OpenDayHours } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import TimeSelectSection from '../TimeSelectSection/TimeSelectSection';

interface OpenDaysSelectI {
  openDays: OpenDayHours;
  onAddOpenDay: (i: number) => void;
  onRemoveOpenDay: (i: number) => void;
  onTimeChange: (i: number, timeSpan: string[][]) => void;
  isReadOnly?: boolean | undefined;
  index?: number;
}

const OpenDaysSelect: React.FC<OpenDaysSelectI> = ({
  openDays,
  isReadOnly = false,
  index = 0,
  onAddOpenDay,
  onRemoveOpenDay,
  onTimeChange,
}) => {
  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  

  return (
    <div>
      {dayOfWeek

        .map((v, i) => (
          <div className={clsx(!isMobile && 'row', !isReadOnly && 'mb-4')} key={i}>
            <div className={clsx(!isMobile && 'col col-sm-6')}>
              <div className='row'>
                <div className={`${isMobile ? 'col-12' : 'col-6'}`}>
                  <p
                    className={clsx(
                      'h6',
                      'font-weight-medium',
                      'text-secondary',
                      i !== 0 && 'text-white'
                    )}
                  >
                    Giorni di Apertura
                  </p>
                </div>
              </div>
              <Form id='form-open-days' formDisabled={isReadOnly} className='mr-2'>
                {isReadOnly ? (
                  <Input value={v} withLabel={false} />
                ) : (
                  <FormGroup check>
                    <Input
                      id={`input-checkbox-day-${index}-${i}`}
                      type='checkbox'
                      checked={Object.entries(openDays).some(
                        ([key, value]) => key.includes(dayCode[i]) && value !== null
                      )}
                      onInputChange={(value) => {
                        if (value) {
                          onAddOpenDay(i);
                        } else {
                          onRemoveOpenDay(i);
                        }
                      }}
                      withLabel={false}
                      className='mr-2'
                    />
                    <Label for={`input-checkbox-day-${index}-${i}`} check>
                      {v}
                    </Label>
                  </FormGroup>
                )}
              </Form>
            </div>
            <div className={clsx(!isMobile && 'col mr-2')}>
              <Collapse
                className={clsx(isMobile && 'pt-5')}
                isOpen={
                  !isMobile ||
                  Object.entries(openDays).some(
                    ([key, value]) => key.includes(dayCode[i]) && value
                  )
                }
              >
                <TimeSelectSection
                  isReadOnly={isReadOnly}
                  disabled={
                    !Object.entries(openDays).some(
                      ([key, value]) => key.includes(dayCode[i]) && value !== null
                    )
                  }
                  timeSpan={[
                    [
                      openDays[`${dayCode[i]}OrarioApertura1`] || '',
                      openDays[`${dayCode[i]}OrarioChiusura1`] || '',
                    ],
                    [
                      openDays[`${dayCode[i]}OrarioApertura2`] || '',
                      openDays[`${dayCode[i]}OrarioChiusura2`] || '',
                    ],
                  ]}
                  onTimeChange={(timeSpan: string[][]) =>
                    onTimeChange(i, timeSpan)
                  }
                />
              </Collapse>
            </div>
          </div>
        ))
        .filter(
          (_d, idx) =>
            (isReadOnly &&
              Object.entries(openDays).some(
                ([key, value]) => key.includes(dayCode[idx]) && value
              )) ||
            !isReadOnly
        )}
    </div>
  );
};

export default OpenDaysSelect;
