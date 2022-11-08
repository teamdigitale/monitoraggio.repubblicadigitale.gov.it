import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectPrintSurveySections,
  SurveySectionI,
} from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { formFieldI } from '../../../../../../utils/formHelper';
import PrintBoxField from './components/printBoxField';
import PrintSelectField from './components/printSelectField';
import PrintTextField from './components/printTextField';
import { GetSurveyInfo } from '../../../../../../redux/features/administrativeArea/surveys/surveysThunk';
import { useAppSelector } from '../../../../../../redux/hooks';
import PrintFieldRating from './components/printFieldRating';
import { selectServices } from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { GetServicesDetail } from '../../../../../../redux/features/administrativeArea/services/servicesThunk';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import Logo from '/public/assets/img/logo-scritta-blu-x2.png';
import './printSurvey.scss';

export interface PrintSurveyQuestionI extends Omit<formFieldI, 'type'> {
  type: string;
  title: string;
  enum: string[];
  properties: { [key: string]: { [key: string]: string } };
}

interface PrintSuveySectionI {
  id: string;
  type: string;
  sectionTitle: string;
  questions: {
    [key: string]: PrintSurveyQuestionI;
  };
}

const PrintSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const { serviceId, idQuestionario } = useParams();
  const sections = useAppSelector(selectPrintSurveySections);
  const serviceDetails = useAppSelector(selectServices)?.detail;
  const classQuestion = 'd-inline-block mr-3 mb-3 question';

  useEffect(() => {
    if (serviceId) dispatch(GetServicesDetail(serviceId));
    if (idQuestionario) dispatch(GetSurveyInfo(idQuestionario, true));
  }, [serviceId, idQuestionario]);

  const getAnswerType = (
    question: PrintSurveyQuestionI,
    section: PrintSuveySectionI
  ) => {
    switch (question.type) {
      case 'range':
        return (
          <PrintFieldRating
            info={question}
            className={classQuestion}
          />
        );
      case 'object':
        if (question?.properties) {
          return (
            <PrintSelectField
              info={question}
              className={clsx(
                classQuestion,
                question.flag && 'align-bottom'
              )}
              noLabel={question.flag ? true : false}
              halfWidth={question.flag ? true : false}
              multipleChoice={question.id !== '18'}
            />
          );
        } else if (question?.enumLevel1 && question?.enumLevel2) {
          return (
            <PrintBoxField
              info={question}
              className={classQuestion}
              optionsLevel2={question.enumLevel2}
            />
          );
        } else if (
          question?.enumLevel1 &&
          !question?.enumLevel2 &&
          question?.relatedTo
        ) {
          return (
            <PrintBoxField
              info={question}
              className={classQuestion}
              optionsLevel2={
                section.questions?.[question.relatedTo]?.enumLevel2 || []
              }
            />
          );
        } else {
          return null;
        }
      case 'multiple':
      case 'string':
        if (question?.enum?.length) {
          return (
            <PrintSelectField
              info={question}
              className={classQuestion}
            />
          );
        } else {
          return (
            <PrintTextField
              info={question}
              className={classQuestion}
            />
          );
        }
      case 'date':
      case 'number':
      case 'time':
      default:
        return (
          <PrintTextField
            info={question}
            className={classQuestion}
          />
        );
    }
  };

  return (
    <div className='container my-3 py-5 print-survey'>
      <div className='header-container__main__logo mb-4'>
        <img src={Logo} alt='logo' />
      </div>
      <DetailLayout
        titleInfo={{
          title: serviceDetails?.dettaglioServizio?.nomeServizio,
          upperTitle: {
            icon: 'it-calendar',
            text:
              serviceDetails?.progettiAssociatiAlServizio[0]?.nomeBreve ||
              'Progetto',
          },
          subTitle:
            'Facilitatore: ' +
            serviceDetails?.dettaglioServizio?.nominativoFacilitatore,
        }}
        showGoBack={false}
      />
      <div className='mt-5'>
        {(sections || []).map((section: SurveySectionI, i: number) => (
          <div key={i} className='mb-3'>
            <h1 className='h2 primary-color-a6 mb-3'>
              {section?.sectionTitle}
            </h1>
            {section?.questions &&
              Object.keys(section?.questions).map((key) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <>{getAnswerType(section?.questions?.[key], section)}</>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintSurvey;
