import clsx from 'clsx';
import { Collapse, FormGroup, Label } from 'design-react-kit';
import React from 'react';
import { dayOfWeek } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';
import { OpenDay } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import TimeSelectSection from '../TimeSelectSection/TimeSelectSection';

interface OpenDaysSelectI {
  openDays: OpenDay[];
  onAddOpenDay: (i: number) => void;
  onRemoveOpenDay: (i: number) => void;
  onTimeChange: (i: number, timeSpan: string[][]) => void;
  isReadOnly?: boolean | undefined;
}

const OpenDaysSelect: React.FC<OpenDaysSelectI> = ({
  openDays,
  isReadOnly = false,
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
          <div className={clsx(!isMobile && 'row')} key={i}>
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
              <Form formDisabled={isReadOnly}>
                {isReadOnly ? (
                  <Input value={v} withLabel={false} />
                ) : (
                  <FormGroup check>
                    <Input
                      id={`input-checkbox-day-${i}`}
                      type='checkbox'
                      checked={openDays.some((day) => day.index === i)}
                      onInputChange={(value) => {
                        if (value) {
                          onAddOpenDay(i);
                        } else {
                          onRemoveOpenDay(i);
                        }
                      }}
                      withLabel={false}
                    />
                    <Label for={`input-checkbox-day-${i}`} check>
                      {v}
                    </Label>
                  </FormGroup>
                )}
              </Form>
            </div>
            <div className={clsx(!isMobile && 'col')}>
              <Collapse
                className={clsx(isMobile && 'pt-5')}
                isOpen={!isMobile || openDays.some((day) => day.index === i)}
              >
                <TimeSelectSection
                  isReadOnly={isReadOnly}
                  disabled={!openDays.some((day) => day.index === i)}
                  timeSpan={openDays.find((day) => day.index === i)?.hourSpan}
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
            (isReadOnly && openDays.find((day) => day.index === idx)) ||
            !isReadOnly
        )}
    </div>
  );
};

export default OpenDaysSelect;
