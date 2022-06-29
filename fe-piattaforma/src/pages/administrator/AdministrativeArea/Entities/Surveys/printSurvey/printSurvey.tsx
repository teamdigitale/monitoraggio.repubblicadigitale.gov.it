import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { SurveyCreationBodyI } from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { formFieldI, FormI } from '../../../../../../utils/formHelper';
import { generateForm } from '../../../../../../utils/jsonFormHelper';
import PrintBoxField from './components/printBoxField';
import PrintSelectField from './components/printSelectField';
import PrintTextField from './components/printTextField';

const PrintSurvey: React.FC = () => {
  const [formMock, setFormMock] = useState<SurveyCreationBodyI>({});
  const [sectionsForm, setSectionsForm] = useState<FormI[]>([]);
  const [sectionsTitle, setSectionsTitle] = useState<string[]>();

  const loadMock = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await import('/mock/responseQuestionario.json');
    setFormMock(response?.default);
  };

  const updateFormToOrder = (form: FormI) => {
    return Object.keys(form).sort(
      (a, b) => Number(form[a].order) - Number(form[b].order)
    );
  };

  useEffect(() => {
    loadMock();
  }, []);

  useEffect(() => {
    if (formMock && formMock.sections) {
      const sections: FormI[] = [];
      const titles: string[] = [];
      formMock.sections.map((section) => {
        sections.push(generateForm(JSON.parse(section.schema), true));
        titles.push(section.title);
      });
      setSectionsForm(sections);
      setSectionsTitle(titles);
    }
  }, [formMock]);

  const getAnswerType = (question: formFieldI, section: FormI) => {
    switch (question.type) {
      case 'checkbox':
      case 'select':
        if (question.enumLevel1 && question.relatedTo) {
          return (
            <PrintBoxField
              info={question}
              className='d-inline-block mr-3 mb-5'
              optionsLevel2={section[question.relatedTo].enumLevel2}
            />
          );
        } else if (question.enumLevel2) {
          return null;
        } else {
          return (
            <PrintSelectField
              info={question}
              className={clsx(
                'd-inline-block',
                'mr-3',
                'mb-5',
                question.flag && 'align-bottom'
              )}
              noLabel={question.flag ? true : false}
              halfWidth={question.flag ? true : false}
            />
          );
        }
      case 'text':
      case 'date':
      case 'number':
      default:
        return (
          <PrintTextField
            info={question}
            className='d-inline-block mr-3 mb-5'
          />
        );
    }
  };

  const orderSection = (section: FormI) => {
    const orderQuestions = updateFormToOrder(section);
    return (
      <>
        {orderQuestions.map((key) => (
          <>{getAnswerType(section[key], section)}</>
        ))}
      </>
    );
  };

  return (
    <div className='container my-3 py-5'>
      {(sectionsForm || []).map((section: FormI, i: number) => (
        <div key={i} className='mb-5'>
          <h1 className='h2 primary-color-a6 mb-5'>
            {sectionsTitle ? sectionsTitle[i] : i}
          </h1>
          {orderSection(section)}
        </div>
      ))}
    </div>
  );
};

export default PrintSurvey;
