import React from 'react';
import clsx from 'clsx';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';

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

  const device = useAppSelector(selectDevice);

  return (
    <>
      {!formDisabled && showMandatory && (
        <div
          className={clsx(
            marginShowMandatory && !device.mediaIsPhone && 'pl-5 ml-3',
            marginShowMandatory && device.mediaIsPhone && 'ml-2',
            customMargin,
            'mt-2',
            'mandatory-fields'
          )}
        >
          * Campo obbligatorio
        </div>
      )}
      <form
        className={clsx('form ', className)}
        id={id}
        autoComplete={autocomplete ? 'on' : 'off'}
      >
        <fieldset disabled={formDisabled} form={id}>
          <legend className='sr-only'>{legend}</legend>
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
    </>
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
