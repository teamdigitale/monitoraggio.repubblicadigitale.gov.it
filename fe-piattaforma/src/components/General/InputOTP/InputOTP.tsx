import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import InputBox from './InputBox/InputBox';

const InputOTP = () => {
  const [value, setValue] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [focus, setFocus] = useState(0);

  // Automatic submit, maybe will be modified when ux will be
  // more clear
  useEffect(() => {
    if (value.every((code) => code !== '')) handleSubmit();
  }, [value]);

  const handleInputChange = (value: string, index: number) => {
    setValue((prev) => prev.map((el, i) => (index === i ? value : el)));
  };

  // This function manage automatic focus change when user press keys
  // to modify input value
  const handleFocusChange = (key: string) => {
    if (key === 'Delete' || key === 'Backspace') {
      if (focus) setFocus((prev) => prev - 1);
    } else {
      if (focus < 5) setFocus((prev) => prev + 1);
    }
  };

  // This function will be modified in future integration
  const handleSubmit = () => {
    setError(true);
    setFocus(6);
  };

  return (
    <div className={clsx('w-100', 'd-flex', 'flex-column', 'px-3')}>
      <div className='d-flex justify-content-between mb-3'>
        {value.map((el, i) => (
          <InputBox
            key={i}
            value={el}
            error={error}
            focus={i == focus}
            // Handle focus in case of error
            onInputClick={() => {
              if (focus > 5) {
                setFocus(5);
                setError(false);
              }
            }}
            onFocusChange={handleFocusChange}
            onChange={(val) => handleInputChange(val, i)}
          />
        ))}
      </div>

      <small className='text-danger text-left'>
        {error && 'Questo codice non è corretto. Riprova'}
      </small>
    </div>
  );
};

export default InputOTP;
