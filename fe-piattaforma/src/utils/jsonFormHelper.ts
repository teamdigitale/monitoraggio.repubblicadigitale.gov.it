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
  SurveyCreationBodyI,
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
    schemaUI: string;
    title: string;
  }[]
) => {
  schema: string;
  schemaUI: string;
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
    const schemaUI: SchemaUiI = {
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
        schemaUI.elements.push(newSchemaUiRow());
      }
      schemaUI.elements[schemaUI.elements.length - 1].elements.push(
        newSchemaUiCol(form[formField])
      );
    });

    return {
      schema: JSON.stringify(schema),
      schemaUI: JSON.stringify(schemaUI),
    };
  } else {
    return {
      schema: sectionsSchemaResponse[sectionId].schema,
      schemaUI: sectionsSchemaResponse[sectionId].schemaUI,
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
      if (formField.format === 'date') {
        return {
          ...baseTypeObject,
          type: 'date',
          regex: RegexpType.DATE,
        };
      } else if (formField.enum?.length) {
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
        id: compile
          ? `field-${(
              schema.properties[field].title ||
              schema.properties[field].id ||
              ''
            ).replace(/\s/g, '-')}`
          : `${new Date().getTime()}`,
        value: compile ? '' : schema.properties[field].title || '',
        label: compile ? schema.properties[field].title || '' : '',
        required: compile
          ? getSchemaRequired(schema.properties[field], schema, field)
          : schema.required.includes(field),
        preset: schema.default.includes(field),
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

export const questionarioJsonMock: SurveyCreationBodyI = {
  'survey-name': 'Primo accesso',
  'survey-description': 'Questionario prova',
  sections: [
    {
      id: 'anagraphic-citizen-section',
      title: 'Anagrafica del cittadino',
      schema:
        '{"type":"object","properties":{"1.1":{"id":"1.1","title":"Nome","type":"string"},"1.2":{"id":"1.2","title":"Cognome","type":"string"},"1.3":{"id":"1.3","title":"Codice fiscale","type":"string"},"1.4":{"id":"1.4","title":"Codice fiscale non disponibile","type":"object","properties":{"val 1":{"type":"boolean"}}}},"required":["1.1","1.2","1.3","1.4"]}',
      schemaUI:
        '{"type":"Group","label":"Sezione","elements":[{"type":"HorizontalLayout","elements":[{"type":"Control","scope":"#/properties/Nome","label":"Nome"},{"type":"Control","scope":"#/properties/Cognome","label":"Cognome"}]},{"type":"HorizontalLayout","elements":[{"type":"Control","scope":"#/properties/Codice fiscale","label":"Codice fiscale"},{"type":"Control","scope":"#/properties/Codice fiscale non disponibile","label":"Codice fiscale non disponibile"}]}]}',
      'default-section': true,
    },
    {
      id: 'anagraphic-booking-section',
      title: 'Anagrafica della prenotazione',
      schema:
        '{"type":"object","properties":{"2.1":{"id":"2.1","title":"Prima volta usufruisce del servizio di facilitazione/formazione","type":"string","enum":["val 1","val 2"]},"2.2":{"id":"2.2","title":"Se non è la prima volta, indicare il servizio di cui si è fruito in passato","type":"string","enum":["val 1","val 2"]}},"required":["2.1","2.2"]}',
      schemaUI:
        '{"type":"Group","label":"Sezione","elements":[{"type":"HorizontalLayout","elements":[{"type":"Control","scope":"#/properties/Prima volta usufruisce del servizio di facilitazione/formazione","label":"Prima volta usufruisce del servizio di facilitazione/formazione"},{"type":"Control","scope":"#/properties/Se non è la prima volta, indicare il servizio di cui si è fruito in passato","label":"Se non è la prima volta, indicare il servizio di cui si è fruito in passato"}]}]}',
      'default-section': true,
    },
    {
      id: 'anagraphic-service-section',
      title: 'Anagrafica del servizio',
      schema:
        '{"type":"object","properties":{"3.1":{"id":"3.1","title":"Tipo di servizio prenotato","type":"string","enum":["val 1","val 2"]},"3.2":{"id":"3.2","title":"Specificare ambito facilitazione / formazione","type":"string"}},"required":["3.1","3.2"]}',
      schemaUI:
        '{"type":"Group","label":"Sezione","elements":[{"type":"HorizontalLayout","elements":[{"type":"Control","scope":"#/properties/Tipo di servizio prenotato","label":"Tipo di servizio prenotato"},{"type":"Control","scope":"#/properties/Specificare ambito facilitazione / formazione","label":"Specificare ambito facilitazione / formazione"}]}]}',
      'default-section': true,
    },
    {
      id: 'content-service-section',
      title: 'Contenuti del servizio',
      schema:
        '{"type":"object","properties":{"4.1":{"id":"4.1","title":"Come hai saputo di questo servizio specifico?","type":"string","enum":["val 1","val 2"]},"4.2":{"id":"4.2","title":"Quale motivo ti ha spinto a prenotare?","type":"string"},"4.3":{"id":"4.3","title":"Hai intenzione di tornare?","type":"string"},"4.4":{"id":"4.4","title":"Cosa ti è più utile per risolvere i problemi legati al digitale?","type":"string"}},"required":["4.1","4.2","4.3","4.4"]}',
      schemaUI:
        '{"type":"Group","label":"Sezione","elements":[{"type":"HorizontalLayout","elements":[{"type":"Control","scope":"#/properties/Come hai saputo di questo servizio specifico?","label":"Come hai saputo di questo servizio specifico?"},{"type":"Control","scope":"#/properties/Quale motivo ti ha spinto a prenotare?","label":"Quale motivo ti ha spinto a prenotare?"}]},{"type":"HorizontalLayout","elements":[{"type":"Control","scope":"#/properties/Hai intenzione di tornare?","label":"Hai intenzione di tornare?"},{"type":"Control","scope":"#/properties/Cosa ti è più utile per risolvere i problemi legati al digitale?","label":"Cosa ti è più utile per risolvere i problemi legati al digitale?"}]}]}',
      'default-section': true,
    },
  ],
};

const transformJsonQuestionToForm = (schema: SchemaI) => {
  const questionsFields = generateForm(schema);
  const questions: SurveyQuestionI[] = [];
  Object.keys(questionsFields).map((field) => {
    if (!questionsFields[field].flag) {
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
    }
  });
  return questions;
};

export const transformJsonToForm = (
  questionarioJson: SurveyCreationBodyI //= questionarioJsonMock
) => {
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
  (questionarioJson.sections || []).map((section) => {
    modelSurvey.sections.push(
      newSection({
        sectionTitle: section.title,
        id: section.id,
        questions: transformJsonQuestionToForm(JSON.parse(section.schema)),
      })
    );
  });
  console.log('from json to form', modelSurvey);
  return modelSurvey;
};
