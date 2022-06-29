import React from 'react';
import clsx from 'clsx';

interface FormI {
  className?: string;
  children: JSX.Element | JSX.Element[];
  formDisabled?: boolean;
  id?: string;
  legend?: string;
}

const Form = (props: FormI) => {
  const {
    className,
    children,
    formDisabled = false,
    id = `form-${new Date().getTime()}`,
    legend = 'Default form legend',
  } = props;

  return (
    <form className={clsx('form ', className)} id={id}>
      <fieldset disabled={formDisabled} form={id}>
        <legend className='sr-only'>{legend}</legend>
        {children}
      </fieldset>
    </form>
  );
};

const Row: React.FC<{
  className?: FormI['className'];
  children: FormI['children'];
}> = (props) => {
  const { className, children } = props;
  return <div className={clsx('form-row', className)}>{children}</div>;
};

Form.Row = Row;

export default Form;
