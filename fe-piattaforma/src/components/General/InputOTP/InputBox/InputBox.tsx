import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import './InputBox.scss';

interface InputBoxI {
  value: string;
  focus: boolean;
  error: boolean;
  onChange: (val: string) => void;
  onFocusChange: (val: string) => void;
  onInputClick: () => void;
}

const InputBox = ({
  value,
  focus,
  error,
  onChange,
  onFocusChange,
  onInputClick,
}: InputBoxI) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Code to manage focus change
  useEffect(() => {
    if (focus) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [inputRef, focus]);

  return (
    <input
      ref={inputRef}
      className={clsx('input-box', error && '__error')}
      value={value}
      maxLength={1}
      onClick={() => onInputClick()}
      // Prevent click focus
      onFocus={() => (focus ? null : inputRef.current?.blur())}
      onKeyUp={(e) => onFocusChange(e.key)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default InputBox;
