import React from 'react';
import TimeSelect from '../../../../General/TimeSelect/TimeSelect';

interface TimeSelectionSectionI {
  timeSpan: string[] | undefined;
  disabled: boolean;
  onTimeChange: (span: string[]) => void;
}

const TimeSelectSection: React.FC<TimeSelectionSectionI> = ({
  timeSpan = ['', ''],
  disabled,
  onTimeChange,
}) => {
  return (
    <div className='row'>
      <div className='col-6'>
        <TimeSelect
          disabled={disabled}
          value={timeSpan[0]}
          placeholder='08:00'
          max={timeSpan[1]}
          onTimeSelect={(time: string) => onTimeChange([time, timeSpan[1]])}
        />
      </div>
      <div className='col-6'>
        <TimeSelect
          disabled={disabled}
          min={timeSpan[0]}
          value={timeSpan[1]}
          placeholder='18:00'
          onTimeSelect={(time: string) => onTimeChange([timeSpan[1], time])}
        />
      </div>
    </div>
  );
};

export default TimeSelectSection;
