import clsx from 'clsx';
import {
  Accordion as AccordionKit,
  AccordionBody,
  AccordionHeader,
  Button,
  Icon,
  Label,
} from 'design-react-kit';
import { Form, Input } from '../../components';
import React, { memo, useState } from 'react';
import './accordion.scss';
import isEqual from 'lodash.isequal';

interface AccordionI {
  title: string;
  totElem?: number;
  children?: JSX.Element | JSX.Element[];
  cta?: string;
  className?: string;
  checkbox?: boolean;
  disabledCheckbox?: boolean;
  isChecked?: boolean;
  handleOnCheck?: () => void;
  lastBottom?: boolean;
}

const Accordion: React.FC<AccordionI> = (props) => {
  const {
    title,
    totElem,
    children,
    cta,
    className,
    lastBottom,
    checkbox,
    disabledCheckbox,
    isChecked,
    handleOnCheck,
  } = props;
  const [collapseOpen, setCollapseOpen] = useState(false);

  return (
    <AccordionKit
      iconLeft
      className={clsx(
        className,
        'position-relative',
        !lastBottom && 'accordion-container__borders'
      )}
    >
      <AccordionHeader
        active={collapseOpen}
        onToggle={() => setCollapseOpen(!collapseOpen)}
      >
        <div className='d-flex justify-content-between'>
          <span>
            {title} {totElem && '(' + totElem + ')'}
          </span>
        </div>
      </AccordionHeader>
      {checkbox && (
        <div
          className={clsx(
            'position-absolute',
            !collapseOpen && 'accordion-container__form-checkbox',
            collapseOpen && 'accordion-container__form-checkbox--collapsed'
          )}
        >
          <Form id={`form-${title}`}>
            <Input
              id={`checkbox-${title.replace(/\s/g, '-')}`}
              field='authorization'
              type='checkbox'
              withLabel={false}
              className='shadow-none accordion-container__input-checkbox'
              aria-label={`checkbox-${title}`}
              checked={isChecked}
              disabled={disabledCheckbox}
              onInputChange={handleOnCheck}
              aria-labelledby={`checkbox-${title.replace(
                /\s/g,
                '-'
              )}Description`}
            />
            <Label
              id={`checkbox-${title.replace(/\s/g, '-')}Description`}
              check
              className='d-none'
            >
              {title}
            </Label>
          </Form>
        </div>
      )}
      <AccordionBody active={collapseOpen}>
        {children}
        {cta && (
          <div className='d-flex justify-content-end'>
            <Button
              onClick={() => console.log('cta')}
              className='d-flex justify-content-between'
            >
              <Icon
                color='primary'
                icon='it-plus-circle'
                size='sm'
                className='mr-2'
                aria-label='Aggiungi'
              />
              {cta}
            </Button>
          </div>
        )}
      </AccordionBody>
    </AccordionKit>
  );
};

export default memo(Accordion, (prevProps, currentProps) => {
  return !!isEqual(prevProps, currentProps);
});
