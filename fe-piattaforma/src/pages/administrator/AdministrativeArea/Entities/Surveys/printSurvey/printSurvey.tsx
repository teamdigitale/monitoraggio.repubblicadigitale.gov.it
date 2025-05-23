import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
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
import Logo from '/public/assets/img/logo-eu-pnrr.png';
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
  const [dataServizioFormattata, setDataServizioFormattata] = useState('');
  useEffect(() => {
    if (serviceId) dispatch(GetServicesDetail(serviceId));
    if (idQuestionario) dispatch(GetSurveyInfo(idQuestionario, true));
  }, [serviceId, idQuestionario, dispatch]);

  useEffect(() => {
    if (serviceDetails?.dettaglioServizio?.dataServizio) {
      const timestampDataServizio =
        serviceDetails?.dettaglioServizio?.dataServizio;
      const dataServizio = new Date(timestampDataServizio);
      const dataServizioFormattata =
        timestampDataServizio && !isNaN(dataServizio.getTime())
          ? dataServizio.toLocaleDateString('it-IT')
          : 'Data non disponibile';
      setDataServizioFormattata(dataServizioFormattata);
    }
  }, [serviceDetails]);

  const getAnswerType = (
    question: PrintSurveyQuestionI,
    section: PrintSuveySectionI
  ) => {
    //18/09/2024 NASCOSTE SEZIONI FASCIA DI ETA' E GENERE DA STAMPA PER ADEGUAMENTO
    if (!(['2','3','4','5', '6'].includes(question.id as string))){

      if (question.id === '9') {
        const didascalia = <span style={{ fontWeight: 'normal' }}>(scrivere la Provincia per esteso)</span>;
        const updatedQuestion = {
          ...question,
          title: (
            <>
              {question.title} {didascalia}
            </>
          ),
        };
        question = updatedQuestion;
      }

    switch (question.type) {
      case 'range':
        return <PrintFieldRating info={question} className={classQuestion} />;
      case 'object':
        if (question?.properties) {
          return (
            <PrintSelectField
              info={question}
              className={clsx(classQuestion, question.flag && 'align-bottom')}
              noLabel={!!question.flag}
              halfWidth={!!question.flag}
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
        if (question.enum && question.id === '9') {
          return <PrintTextField info={question} className={classQuestion} />;
        } else if (question.enum) {
          return <PrintSelectField info={question} className={classQuestion} />;
        } else {
          return <PrintTextField info={question} className={classQuestion} />;
        }
      case 'date':
      case 'number':
      case 'time':
      default:
        return <PrintTextField info={question} className={classQuestion} />;
    }
  }
  };
  return (
    <div className='container my-3 pt-3 print-survey'>
      <div className='d-flex justify-content-between'>
        <div>
          <p className='h3 primary-color-a9 m-0'>Facilita</p>
          <span className='primary-color-a9 m-0'>
            La piattaforma dei servizi di facilitazione digitale
          </span>
        </div>
        <div className='header-container__main__logo mb-4'>
          <img src={Logo} alt='PNRR' />
        </div>
      </div>
      <DetailLayout
        titleInfo={{
          title: serviceDetails?.dettaglioServizio?.nomeServizio,
          upperTitle: {
            icon: 'it-calendar',
            text:
              serviceDetails?.progettiAssociatiAlServizio?.[0]?.nomeBreve ||
              'Progetto',
          },
          subTitle: dataServizioFormattata,
          //   'Facilitatore: ' +
          //   serviceDetails?.dettaglioServizio?.nominativoFacilitatore,
        }}
        showGoBack={false}
        noTitleEllipsis
      />
      <div className='mt-5'>
        {(sections || []).map(
          (section: SurveySectionI, i: number) =>
            (i === 0 || i === 3) && (
              <div key={section.id} className='mb-3'>
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
            )
        )}
      </div>
    </div>
  );
};

export default PrintSurvey;
