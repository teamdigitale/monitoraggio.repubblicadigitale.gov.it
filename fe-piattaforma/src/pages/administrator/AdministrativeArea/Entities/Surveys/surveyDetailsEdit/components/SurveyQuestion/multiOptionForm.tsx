import clsx from 'clsx';
import { Button, Col, Icon } from 'design-react-kit';
import React, { useEffect } from 'react';
import { Form, Input } from '../../../../../../../../components';
import { OptionType } from '../../../../../../../../components/Form/select';
import withFormHandler, {
  withFormHandlerProps,
} from '../../../../../../../../hoc/withFormHandler';
import {
  formFieldI,
  newForm,
  newFormField,
} from '../../../../../../../../utils/formHelper';

interface MultiOptionFormI extends withFormHandlerProps {
  onFormChange?: (values: OptionType[]) => void;
  areValuesDefault?: boolean;
  values?: string;
}

const MultiOptionForm: React.FC<MultiOptionFormI> = (props) => {
  const {
    form,
    //isValidForm,
    getFormValues = () => ({}),
    onInputChange,
    onFormChange = () => ({}),
    updateFormField = () => ({}),
    updateForm = () => ({}),
    areValuesDefault,
    values,
  } = props;

  useEffect(() => {
    if (values) {
      const listValues = JSON.parse(values) || [];
      // TODO check for improvements
      form &&
        Object.keys(form).forEach((f, index) => {
          form[f].value = listValues[index]?.value;
        });

      const tmpForm: formFieldI[] = [];

      listValues.map((val: { label: string; value: string }, index: number) => {
        if (form && index > Object.keys(form).length - 1) {
          const newField = newFormField({
            field: `multi-option-${new Date().getTime().toString()}-${index}`,
            required: true,
            value: val.value,
          });
          tmpForm.push(newField);
        }
        updateForm(newForm(tmpForm));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const transformFormToOptions = Object.values(getFormValues()).map(
      (option = '') => ({ label: option.toString(), value: option.toString() })
    );
    onFormChange(transformFormToOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const addOption = () => {
    updateFormField(
      newFormField({
        field: `multi-option-${new Date().getTime().toString()}`,
        required: true,
      })
    );
  };

  const removeOption = (option: string) => {
    updateFormField(option, 'remove');
  };

  if (!form) return null;

  return (
    <Form.Row>
      <Col md={12} sm={12} lg={6}>
        <p className='mb-0'>Lista valori</p>
        <ul
          aria-label='Lista valori'
          className='survey-question-container__list'
        >
          {Object.keys(form).map((option) => (
            <React.Fragment key={option}>
              {form[option] ? (
                <li className='d-flex flex-row'>
                  <Input
                    {...form[option]}
                    id={option}
                    onInputChange={onInputChange}
                    withLabel={false}
                    disabled={areValuesDefault}
                    className={clsx(
                      areValuesDefault && 'mt-3',
                      'position-relative'
                    )}
                  />
                  {form[option].value &&
                  form[option].valid &&
                  !areValuesDefault &&
                  Object.keys(form).length > 1 ? (
                    <Button
                      onClick={() => removeOption(option)}
                      className='survey-question-container__buttons position-absolute'
                    >
                      <Icon
                        className='minus'
                        color='primary'
                        icon='it-delete'
                        size='sm'
                        aria-label='Elimina opzione'
                      />
                    </Button>
                  ) : null}
                </li>
              ) : null}
            </React.Fragment>
          ))}
        </ul>
        {!areValuesDefault && (
          <Button
            onClick={() => addOption()}
            className={clsx(
              'survey-question-container__button-add',
              'font-italic',
              'font-weight-normal'
            )}
          >
            <Icon
              className='plus mr-3'
              color='primary'
              icon='it-plus-circle'
              size=''
              aria-label='Aggiungi opzione'
            />
            Aggiungi opzione
          </Button>
        )}
      </Col>
    </Form.Row>
  );
};

const form = newForm([
  newFormField({
    field: `multi-option-${new Date().getTime().toString()}`,
    required: true,
  }),
]);
export default withFormHandler({ form }, MultiOptionForm);
