import React from 'react';
import TimeSelect from '../../../../General/TimeSelect/TimeSelect';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import Input from '../../../../Form/input';
import Form from '../../../../Form/form';

interface TimeSelectionSectionI {
  timeSpan?: string[][] | undefined;
  disabled: boolean;
  onTimeChange: (span: string[][]) => void;
  isReadOnly?: boolean | undefined;
}

const TimeSelectSection: React.FC<TimeSelectionSectionI> = ({
  timeSpan = [
    ['', ''],
    ['', ''],
  ],
  disabled,
  isReadOnly = false,
  onTimeChange,
}) => {
  const device = useAppSelector(selectDevice);
  const isMobile = device.mediaIsPhone;
  return (
    <div className='d-flex flex-column jutify-content-center'>
      <div className={`${isMobile ? 'd-none' : ''} col-12`}>
        <p className='h6 font-weight-medium text-secondary'>Fascia Oraria 1</p>
      </div>
      <div className='row'>
        <div className='col-6'>
          {isReadOnly ? (
            <Form formDisabled className='mb-3'>
              <Input value={timeSpan.flat()[0]} withLabel={false} />
            </Form>
          ) : (
            <TimeSelect
              disabled={disabled}
              value={timeSpan.flat()[0]}
              placeholder='09:00'
              max={timeSpan.flat()[1]}
              onTimeSelect={(time: string) =>
                onTimeChange([
                  [time, timeSpan.flat()[1]],
                  [timeSpan.flat()[2], timeSpan.flat()[3]],
                ])
              }
            />
          )}
        </div>
        <div className='col-6'>
          {isReadOnly ? (
            <Form formDisabled>
              <Input value={timeSpan.flat()[1]} withLabel={false} />
            </Form>
          ) : (
            <TimeSelect
              disabled={disabled}
              min={timeSpan.flat()[0]}
              value={timeSpan.flat()[1]}
              placeholder='13:00'
              onTimeSelect={(time: string) =>
                onTimeChange([
                  [timeSpan.flat()[0], time],
                  [timeSpan.flat()[2], timeSpan.flat()[3]],
                ])
              }
            />
          )}
        </div>
      </div>
      <div className={`${isMobile ? 'd-none' : ''} col-12`}>
        <p className='h6 font-weight-medium text-secondary'>Fascia Oraria 2</p>
      </div>
      <div className='row'>
        <div className='col-6'>
          {isReadOnly ? (
            <Form formDisabled className='mb-5'>
              <Input value={timeSpan.flat()[2]} withLabel={false} />
            </Form>
          ) : (
            <TimeSelect
              disabled={disabled}
              value={timeSpan.flat()[2]}
              placeholder='14:00'
              max={timeSpan.flat()[3]}
              onTimeSelect={(time: string) =>
                onTimeChange([
                  [timeSpan.flat()[0], timeSpan.flat()[1]],
                  [time, timeSpan.flat()[3]],
                ])
              }
            />
          )}
        </div>
        <div className='col-6'>
          {isReadOnly ? (
            <Form formDisabled>
              <Input value={timeSpan.flat()[3]} withLabel={false} />
            </Form>
          ) : (
            <TimeSelect
              disabled={disabled}
              min={timeSpan.flat()[2]}
              value={timeSpan.flat()[3]}
              placeholder='18:00'
              onTimeSelect={(time: string) =>
                onTimeChange([
                  [timeSpan.flat()[0], timeSpan.flat()[1]],
                  [timeSpan.flat()[2], time],
                ])
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelectSection;
