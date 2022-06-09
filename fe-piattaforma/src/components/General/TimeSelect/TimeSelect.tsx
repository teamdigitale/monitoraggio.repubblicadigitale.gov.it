import { padStart } from 'lodash';
import React from 'react';
import Select, { OptionType } from '../../Form/select';

// This is a custom component for time selection in a limited list
// of time value
// It can accept a min<string> (ex. 'hh:mm'), a max<string> (ex. 'hh:mm)
// and a minutesStep<number> (default 30) to have dynamically generated options
// Now is used in Headquarter Creation/Modify

interface TimeSelectI {
  min?: string;
  max?: string;
  minutesStep?: number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  value: string;
  onTimeSelect: (time: string) => void;
}

const TimeSelect: React.FC<TimeSelectI> = ({
  min = '00:00',
  max = '24:00',
  minutesStep = 30,
  placeholder = '',
  label = '',
  disabled = false,
  value,
  onTimeSelect,
}) => {
  const getSelectOptionsHandler: (
    step: number,
    min: string,
    max: string
  ) => OptionType[] = (step = 30, min = '00:00', max = '24:00') => {
    const options: OptionType[] = [];

    // Defining the start time
    let currentHour = parseInt(min.split(':')[0]);
    let currentMinutes = parseInt(min.split(':')[1]);

    // Defining the end time
    const endHour = parseInt(max.split(':')[0]);
    const endMinutes = parseInt(max.split(':')[1]);

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinutes <= endMinutes)
    ) {
      // Time format to pass as option
      const current = [
        padStart(`${currentHour}`, 2, '0'),
        padStart(`${currentMinutes}`, 2, '0'),
      ].join(':');
      options.push({
        label: current,
        value: current,
      });

      if (currentMinutes + step < 60) {
        currentMinutes = currentMinutes + step;
      } else {
        currentHour = currentHour + 1;
        currentMinutes = 60 - (currentMinutes + step);
      }
    }

    return options;
  };

  return (
    <Select
      label={label}
      isDisabled={disabled}
      value={value}
      onInputChange={(value) => onTimeSelect(value as string)}
      placeholder={placeholder}
      options={getSelectOptionsHandler(minutesStep, min, max)}
    />
  );
};

export default TimeSelect;
