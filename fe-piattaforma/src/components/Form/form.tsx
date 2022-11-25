import React from 'react';
import clsx from 'clsx';

interface FormI {
  autocomplete?: boolean | undefined;
  className?: string;
  children: JSX.Element | JSX.Element[] | undefined | null | string;
  formDisabled?: boolean;
  id: string;
  legend?: string | undefined;
  showMandatory?: boolean;
  marginShowMandatory?: boolean;
  customMargin?: string;
}

const Form = (props: FormI) => {
  const {
    autocomplete = false,
    className,
    children,
    formDisabled = false,
    id,
    legend = '',
    showMandatory = true,
    marginShowMandatory = true,
    customMargin = '',
  } = props;

  return (
    <form
      className={clsx('form ', className)}
      id={id}
      autoComplete={autocomplete ? 'on' : 'off'}
    >
      <fieldset disabled={formDisabled} form={id}>
        <legend className='sr-only'>{legend}</legend>
        {!formDisabled && showMandatory && (
          <div
            className={clsx(
              'mandatory-fields',
              marginShowMandatory &&
                'form-row justify-content-between px-0 px-lg-5 mx-2',
              customMargin ? customMargin : 'mb-5'
            )}
          >
            * Campo obbligatorio
          </div>
        )}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ...child.props,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              formDisabled,
            });
          }
          return null;
        })}
      </fieldset>
    </form>
  );
};

const Row: React.FC<{
  className?: FormI['className'];
  children: FormI['children'];
  formDisabled?: boolean;
}> = (props) => {
  const { className, children, formDisabled = false } = props;
  return (
    <div className={clsx('form-row', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...child.props,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            disabled: child.props.disabled || formDisabled,
          });
        }
        return null;
      })}
    </div>
  );
};

Form.Row = Row;

export default Form;
