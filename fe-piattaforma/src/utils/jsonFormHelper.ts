/* JSON FORM DOCS
  https://jsonforms.io/examples/basic
  https://rjsf-team.github.io/react-jsonschema-form/
*/
import { InputType } from 'design-react-kit/node_modules/reactstrap/es/Input';
import {
  SurveyQuestionI,
  SurveyStateI,
} from '../redux/features/administrativeArea/surveys/surveysSlice';
import {
  newSection,
  SurveyResponseBodyI,
} from '../redux/features/administrativeArea/surveys/surveysThunk';
import { formFieldI, FormI, newForm, newFormField } from './formHelper';
import { RegexpType } from './validator';

interface schemaFieldPropertiesI {
  [key: string]: schemaFieldI;
}
interface schemaFieldI {
  id?: string;
  title?: string;
  type?: string;
  format?: string;
  enum?: string[];
  minimum?: string | number;
  maximum?: string | number;
  properties?: schemaFieldPropertiesI;
  flag?: boolean;
  dependencyFlag?: string;
  dependencyNotFlag?: string;
  order?: number;
  relatedFrom?: string;
  relatedTo?: string;
  enumLevel1?: string[];
  enumLevel2?: { label: string; value: string; upperLevel: string }[];
  keyService?: string;
  regex?: string;
  privacy?: boolean;
}
export interface SchemaI {
  id?: schemaFieldI['id'];
  title?: schemaFieldI['title'];
  type?: schemaFieldI['type'];
  properties: schemaFieldPropertiesI;
  required: string[];
  default: string[];
}

interface SchemaUiColI {
  type: 'Control';
  label: string;
  scope: string;
}
interface SchemaUiRowI {
  type: 'HorizontalLayout';
  elements: SchemaUiColI[];
}
export interface SchemaUiI {
  type: string;
  label: string;
  elements: SchemaUiRowI[];
}

const getType = ({ type = 'text', options }: formFieldI) => {
  const baseTypeObject = {
    type: 'string',
  };
  switch (type) {
    case 'text':
    default:
      return baseTypeObject;
    case 'date':
      return {
        ...baseTypeObject,
        type: 'string',
        format: 'date',
      };
    case 'range':
      return {
        ...baseTypeObject,
        type: 'integer',
        minimum: 1,
        maximum: 5,
      };
    case 'number':
      return {
        ...baseTypeObject,
        type: 'integer',
      };
    case 'select':
      return {
        ...baseTypeObject,
        type: 'string',
        enum: (options || []).map((opt: { label: string }) => opt.label),
      };
    case 'checkbox': {
      const properties: { [key: string]: { type: string } } = {};
      (options || []).forEach(({ label }) => {
        properties[label] = { type: 'boolean' };
      });
      return {
        ...baseTypeObject,
        type: 'object',
        properties,
      };
    }
  }
};

const newSchemaUiRow: () => SchemaUiRowI = () => ({
  type: 'HorizontalLayout',
  elements: [],
});

const newSchemaUiCol: (formField: formFieldI) => SchemaUiColI = (
  formField
) => ({
  type: 'Control',
  scope: `#/properties/${formField.field}`,
  label: formField.field,
});

export const generateJsonFormSchema: (
  form: FormI,
  sectionId: number,
  sectionsSchemaResponse: {
    id: string;
    schema: string;
    schemaui: string;
    title: string;
  }[]
) => {
  schema: string;
  schemaui: string;
} = (form, sectionId, sectionsSchemaResponse) => {
  if (sectionId !== 0 && sectionId !== 1) {
    const schema: SchemaI = {
      // id: section.id,
      // title: section.sectionTitle,
      type: 'object',
      properties: {},
      required: [],
      default: [],
    };
    const schemaui: SchemaUiI = {
      type: 'Group',
      label: 'Sezione',
      elements: [],
    };

    Object.keys(form).forEach((formField, index) => {
      const idQuestion = form[formField].id || new Date().getTime().toString();

      schema.properties[idQuestion] = {
        id: idQuestion,
        title: form[formField].field,
        ...getType(form[formField]),
      };

      if (form[formField].required) {
        schema.required.push(idQuestion);
      }

      if (form[formField].required) {
        schema.default.push(idQuestion);
      }

      if (index % 2 === 0) {
        schemaui.elements.push(newSchemaUiRow());
      }
      schemaui.elements[schemaui.elements.length - 1].elements.push(
        newSchemaUiCol(form[formField])
      );
    });

    return {
      schema: JSON.stringify(schema),
      schemaui: JSON.stringify(schemaui),
    };
  } else {
    return {
      schema: sectionsSchemaResponse[sectionId].schema,
      schemaui: sectionsSchemaResponse[sectionId].schemaui,
    };
  }
};

type baseTypeObjectI = {
  regex: string;
  type: InputType;
};
const getTypeReverse: (formField: schemaFieldI) => baseTypeObjectI = (
  formField: schemaFieldI
) => {
  const baseTypeObject: baseTypeObjectI = {
    regex: formField.regex ? formField.regex : RegexpType.ALPHA_NUMERIC_INPUT,
    type: 'text',
  };
  switch (formField.type) {
    case 'string':
    default: {
      if (formField.enum?.length) {
        return {
          ...baseTypeObject,
          type: 'select',
          options: formField.enum.map((option) => ({
            label: option,
            value: option,
          })),
        };
      }
      return baseTypeObject;
    }
    case 'date': {
      return {
        ...baseTypeObject,
        type: 'date',
        regex: RegexpType.DATE,
      };
    }
    case 'time': {
      return {
        ...baseTypeObject,
        type: 'time',
        regex: RegexpType.TIME,
      };
    }
    case 'number':
    case 'integer': {
      if (formField.minimum && formField.maximum) {
        return {
          ...baseTypeObject,
          type: 'range',
          regex: RegexpType.NUMBER,
        };
      }
      return {
        ...baseTypeObject,
        type: 'number',
        regex: RegexpType.NUMBER,
      };
    }
    case 'object': {
      if (formField.properties) {
        return {
          ...baseTypeObject,
          type: 'checkbox',
          options: Object.keys(formField.properties).map((option) => ({
            label: option,
            value: option,
          })),
        };
      }
      if (formField.enumLevel1) {
        return {
          ...baseTypeObject,
          type: 'checkbox',
        };
      }
      if (formField.enumLevel2) {
        return {
          ...baseTypeObject,
          type: 'checkbox',
        };
      }
      return baseTypeObject;
    }
  }
};

const getSchemaRequired = (
  property: schemaFieldI,
  schema: SchemaI,
  field: string
) => {
  if (property.dependencyFlag) {
    const flagId = property.dependencyFlag;
    return schema.properties[flagId] === '' ? true : false;
  } else if (property.dependencyNotFlag) {
    const flagId = property.dependencyNotFlag;
    return schema.properties[flagId] === '' ? false : true;
  } else {
    return schema.required.includes(field);
  }
};

export const generateForm: (schema: SchemaI, compile?: boolean) => FormI = (
  schema,
  compile = false
) =>
  newForm(
    Object.keys(schema.properties).map((field) =>
      newFormField({
        ...getTypeReverse(schema.properties[field]),
        field,
        id: `field-${(
          schema.properties[field].id ||
          schema.properties[field].title ||
          `${new Date().getTime()}`
        ).replace(/\s/g, '-')}`,
        value: compile ? '' : schema.properties[field].title || '',
        label: compile ? schema.properties[field].title || '' : '',
        required: compile
          ? getSchemaRequired(schema.properties[field], schema, field)
          : schema.required.includes(field),
        preset: schema.default.includes(field) || false,
        flag: schema.properties[field].flag ? true : false,
        privacy: schema.properties[field].privacy ? true : false,
        format: schema.properties[field].format || '',
        order: schema.properties[field].order || 1,
        dependencyFlag: schema.properties[field].dependencyFlag || '',
        dependencyNotFlag: schema.properties[field].dependencyNotFlag || '',
        relatedFrom: schema.properties[field].relatedFrom || '',
        relatedTo: schema.properties[field].relatedTo || '',
        enumLevel1: schema.properties[field].enumLevel1 || undefined,
        enumLevel2: schema.properties[field].enumLevel2 || undefined,
        keyService: schema.properties[field].keyService || undefined,
      })
    )
  );

const transformJsonQuestionToForm = (schema: SchemaI) => {
  const questionsFields = generateForm(schema);
  const questions: SurveyQuestionI[] = [];
  Object.keys(questionsFields).map((field) => {
    let valuesField = '';
    if (questionsFields[field]?.options) {
      valuesField = JSON.stringify(questionsFields[field]?.options);
    } else if (questionsFields[field]?.enumLevel1) {
      const arrayValues: { label: string; value: string }[] = [];
      questionsFields[field].enumLevel1?.map((val) =>
        arrayValues.push({ label: val, value: val })
      );
      valuesField = JSON.stringify(arrayValues);
    } else if (questionsFields[field]?.enumLevel2) {
      const arrayValues: { label: string; value: string }[] = [];
      questionsFields[field].enumLevel2?.map((val) =>
        arrayValues.push({ label: val.label, value: val.value })
      );
      valuesField = JSON.stringify(arrayValues);
    }

    questions.push({
      id: `${field}`,
      form: newForm([
        newFormField({
          field: 'question-description',
          required: true,
          value: questionsFields[field]?.value || '',
        }),
        newFormField({
          field: 'question-type',
          required: true,
          value: questionsFields[field]?.type?.toString() || 'text',
        }),
        newFormField({
          field: 'question-values',
          value: valuesField,
        }),
        newFormField({
          field: 'question-required',
          value: `${questionsFields[field]?.required}`,
        }),
        newFormField({
          field: 'question-default',
          required: true,
          value: questionsFields[field]?.preset || false,
          regex: RegexpType.BOOLEAN,
        }),
      ]),
    });
  });
  return questions;
};

export const transformJsonToForm = (questionarioJson: SurveyResponseBodyI) => {
  const modelSurvey: SurveyStateI = {
    surveyId: questionarioJson['survey-id'] || '',
    surveyStatus: questionarioJson['survey-status'] || '',
    defaultRFD: questionarioJson['default-RFD'] || false,
    defaultSCD: questionarioJson['default-SCD'] || false,
    lastUpdate: questionarioJson['last-update'] || '',
    form: {},
    sections: [],
    compilingSurveyForms: [],
  };
  modelSurvey.form = newForm([
    newFormField({
      field: 'survey-name',
      required: true,
      value: questionarioJson['survey-name']?.toString() || '',
    }),
    newFormField({
      field: 'survey-description',
      required: true,
      value: questionarioJson['survey-description']?.toString() || '',
    }),
  ]);
  (questionarioJson['survey-sections'] || []).map((section) => {
    modelSurvey.sections.push(
      newSection({
        sectionTitle: section.title,
        id: section.id,
        questions: transformJsonQuestionToForm(JSON.parse(section.schema.json)),
      })
    );
  });
  return modelSurvey;
};
