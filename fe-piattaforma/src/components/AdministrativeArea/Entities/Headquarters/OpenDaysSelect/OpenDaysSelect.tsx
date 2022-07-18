import clsx from 'clsx';
import { Collapse, FormGroup, Label } from 'design-react-kit';
import React from 'react';
import { dayOfWeek } from '../../../../../pages/administrator/AdministrativeArea/Entities/utils';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Form from '../../../../Form/form';
import Input from '../../../../Form/input';
import { OpenDayHours } from '../AccordionAddressList/AccordionAddress/AccordionAddress';
import TimeSelectSection from '../TimeSelectSection/TimeSelectSection';

interface OpenDaysSelectI {
  openDays: OpenDayHours[];
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
                      id={`input-checkbox-day-${index}-${i}`}
                      type='checkbox'
                      checked={openDays.some((day) =>
                        dayOfWeek[i]
                          .toUpperCase()
                          .includes(day.giornoAperturaSede.toUpperCase())
                      )}
                      onInputChange={(value) => {
                        if (value) {
                          onAddOpenDay(i);
                        } else {
                          onRemoveOpenDay(i);
                        }
                      }}
                      withLabel={false}
                    />
                    <Label for={`input-checkbox-day-${index}-${i}`} check>
                      {v}
                    </Label>
                  </FormGroup>
                )}
              </Form>
            </div>
            <div className={clsx(!isMobile && 'col')}>
              <Collapse
                className={clsx(isMobile && 'pt-5')}
                isOpen={
                  !isMobile ||
                  openDays.some((day) =>
                    dayOfWeek[i]
                      .toUpperCase()
                      .includes(day.giornoAperturaSede.toUpperCase())
                  )
                }
              >
                <TimeSelectSection
                  isReadOnly={isReadOnly}
                  disabled={
                    !openDays.some((day) =>
                      dayOfWeek[i]
                        .toUpperCase()
                        .includes(day.giornoAperturaSede.toUpperCase())
                    )
                  }
                  timeSpan={openDays
                    .filter((day) =>
                      dayOfWeek[i]
                        .toUpperCase()
                        .includes(day.giornoAperturaSede.toUpperCase())
                    )
                    .map((day) => [
                      day.orarioAperturaSede,
                      day.orarioChiusuraSede,
                    ])}
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
              openDays.find((day) =>
                dayOfWeek[idx]
                  .toUpperCase()
                  .includes(day.giornoAperturaSede.toUpperCase())
              )) ||
            !isReadOnly
        )}
    </div>
  );
};

export default OpenDaysSelect;
