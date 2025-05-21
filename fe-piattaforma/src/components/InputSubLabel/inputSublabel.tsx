import React, { ChangeEvent, useEffect, useState } from 'react';
import { isSafariBrowser } from '../../utils/common';
import clsx from 'clsx';
import { formFieldI } from '../../utils/formHelper';


interface InputSublabelProps {
  label: string;
  field?: string;
  description: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: formFieldI['value'];
  onInputChange: (value: string, field?: string) => void;
  col?: string; 
}

const InputSublabel: React.FC<InputSublabelProps> = ({
  label,
  field,
  description,
  placeholder = '',
  required = false,
  value = '',
  className = '',
  onInputChange,
  col = ''
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value); 
    onInputChange(e.target.value, field); 
  };
  const [val, setVal] = useState<formFieldI['value']>(value);

  useEffect(() => {
      setVal(value);
    }, [value]);

  return (
    <div id="input-sublabel" className={clsx('form-group', col)} style={{ width: '100%', paddingLeft: '5px', paddingRight: '5px' }}>
      <label className="form-label" style={{ fontWeight: 600, fontSize: '0.777778rem' }}>
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      <p className="form-text"
            style={{
              textAlign: 'left',
              marginLeft: '9px',
              marginTop: '40px',
              fontSize: '0.9rem',
            }}>{description}</p>
      <input
        style={{ borderBottom: '1px solid #0073e5', width: '100%' }}
        placeholder={placeholder}
        type="text"
        value={typeof val === 'number' ? val : val?.toString() || ''}
        onChange={handleChange}
        className={clsx(className, 'pr-lg-3', isSafariBrowser() && 'safari-field-color', 'w-100')}
      />
    </div>
  );
};

export default InputSublabel;