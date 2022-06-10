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
  onTimeChange: (i: number, timeSpan: string[]) => void;
}

const OpenDaysSelect: React.FC<OpenDaysSelectI> = ({
  openDays,
  onAddOpenDay,
  onRemoveOpenDay,
  onTimeChange,
}) => {
  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;

  return (
    <>
      <div className='row mb-3'>
        <div className={`${isMobile ? 'col-12' : 'col-6'}`}>
          <p className='h5 font-weight-medium text-secondary'>
            Giorni di Apertura
          </p>
        </div>
        {!isMobile && (
          <div className={`${isMobile ? 'd-none' : ''} col-6`}>
            <p className='h5 font-weight-medium text-secondary'>
              Fascia Oraria
            </p>
          </div>
        )}
      </div>
      <>
        {dayOfWeek.map((v, i) =>
          isMobile ? (
            <div className='mb-2'>
              <Form className='border-bottom pb-3'>
                <FormGroup className='mt-0' check>
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
              </Form>
              <Collapse
                className='pt-5'
                isOpen={openDays.some((day) => day.index === i)}
              >
                <TimeSelectSection
                  disabled={!openDays.some((day) => day.index === i)}
                  timeSpan={openDays.find((day) => day.index === i)?.hourSpan}
                  onTimeChange={(timeSpan: string[]) =>
                    onTimeChange(i, timeSpan)
                  }
                />
              </Collapse>
            </div>
          ) : (
            <div className='row mb-3' key={i}>
              <div className='col-12 col-sm-6'>
                <Form>
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
                </Form>
              </div>
              <div className='col'>
                <TimeSelectSection
                  disabled={!openDays.some((day) => day.index === i)}
                  timeSpan={openDays.find((day) => day.index === i)?.hourSpan}
                  onTimeChange={(timeSpan: string[]) =>
                    onTimeChange(i, timeSpan)
                  }
                />
              </div>
            </div>
          )
        )}
      </>
    </>
  );
};

export default OpenDaysSelect;
