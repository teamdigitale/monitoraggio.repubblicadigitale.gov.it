import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment/moment';
import DetailLayout from '../../../../../../components/DetailLayout/detailLayout';
import { OptionType } from '../../../../../../components/Form/select';
import {
  selectQuestionarioTemplateSnapshot,
  selectServiceQuestionarioTemplateIstanze,
  selectServices,
} from '../../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import {
  GetCompiledSurveyCitizenService,
  GetServicesDetail,
} from '../../../../../../redux/features/administrativeArea/services/servicesThunk';
import { SurveySectionPayloadI } from '../../../../../../redux/features/administrativeArea/surveys/surveysSlice';
import { setInfoIdsBreadcrumb } from '../../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../../redux/hooks';
import { formatAndParseJsonString } from '../../../../../../utils/common';
import { FormI } from '../../../../../../utils/formHelper';
import { generateForm } from '../../../../../../utils/jsonFormHelper';
import JsonFormRender from '../components/jsonFormRender';

const ViewSurvey: React.FC = () => {
  const dispatch = useDispatch();
  const { serviceId, idQuestionarioCompilato } = useParams();
  const [sections, setSections] = useState<SurveySectionPayloadI[]>([]);
  const surveyStore: string | SurveySectionPayloadI[] = useAppSelector(
    selectQuestionarioTemplateSnapshot
  )?.sezioniQuestionarioTemplate;
  const compiledSurveyCitizen = useAppSelector(
    selectServiceQuestionarioTemplateIstanze
  );
  const serviceDetails = useAppSelector(selectServices)?.detail;
  const [arrayForms, setArrayForms] = useState<FormI[]>([]);

  useEffect(() => {
    // For breadcrumb
    if (serviceId && serviceDetails?.dettaglioServizio?.nomeServizio) {
      dispatch(
        setInfoIdsBreadcrumb({
          id: serviceId,
          nome: serviceDetails?.dettaglioServizio?.nomeServizio,
        })
      );
    }
  }, [serviceId, serviceDetails]);

  useEffect(() => {
    // se refresh get service detail & risposte compilato
    dispatch(GetServicesDetail(serviceId));
    if (idQuestionarioCompilato)
      dispatch(GetCompiledSurveyCitizenService(idQuestionarioCompilato));
  }, []);

  useEffect(() => {
    if (surveyStore?.length && typeof surveyStore !== 'string')
      setSections(surveyStore); // le sezioni sono del questionario associato al servizio
  }, [surveyStore]);

  const getValuesSurvey = (section: {
    id: string;
    properties: any;
    title: string;
  }) => {
    let values = {};
    const valuesInArray = section?.properties || section;
    Object.keys(valuesInArray).map((key: string) => {
      if (typeof valuesInArray[key] === 'object') {
        Object.keys(valuesInArray[key]).map((id: string) => {
          values = {
            ...values,
            ...{
              [id]:
                valuesInArray[key][id]?.length > 1
                  ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    valuesInArray[key][id].map((e) =>
                      e.toString().replaceAll('§', ',')
                    )
                  : valuesInArray[key][id][0]
                      .toString()
                      .split('§')
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      .map((e) => e.toString().replaceAll('§', ',')),
            },
          };
        });
      } else if (typeof valuesInArray[key] === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const val = JSON.parse(
          decodeURI(valuesInArray[key]).replaceAll("'", '"')
        );
        values = {
          ...values,
          ...val,
        };
      }
    });
    return values;
  };

  useEffect(() => {
    const forms: FormI[] = [];
    // create form and prefill the sections
    if (sections?.length) {
      (sections || []).map((section: SurveySectionPayloadI, index: number) => {
        const newForm = generateForm(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          JSON.parse(section.schema?.json),
          true
        );
        if (newForm['18']?.options) {
          newForm['18'].options = newForm['18']?.options?.map(
            (opt: OptionType) => ({
              label: opt.label,
              value: opt.value.toString().toUpperCase(),
            })
          );
        }
        if (
          compiledSurveyCitizen?.length &&
          compiledSurveyCitizen?.[index]?.domandaRisposta?.json
        ) {
          const sectionParsed: {
            id: string;
            properties: { [key: string]: string[] };
            title: string;
          } = formatAndParseJsonString(
            compiledSurveyCitizen?.[index]?.domandaRisposta?.json
          );
          const values: { [key: string]: string } =
            getValuesSurvey(sectionParsed);
          Object.keys(newForm).map((key: string) => {
            newForm[key].value = values[key];
            if (key === '19') {
              newForm[key].value =
                moment(values[key]?.toString(), 'DD-MM-YYYY').format(
                  'YYYY-MM-DD'
                ) || '';
            }
          });
        }
        forms.push(newForm);
      });
    }
    setArrayForms(forms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, compiledSurveyCitizen]);

  return (
    <div className='mb-5 container'>
      <div className='container'>
        <DetailLayout
          titleInfo={{
            title:
              serviceDetails?.questionarioTemplateSnapshot?.nomeQuestionarioTemplate?.toString(),
            status: '',
            upperTitle: { icon: 'it-file', text: 'Questionario' },
          }}
          buttonsPosition='BOTTOM'
          goBackTitle='Cittadini partecipanti'
          goBackPath={`/area-amministrativa/servizi/${serviceId}/cittadini`}
        />
        {sections?.length
          ? sections.map((section: SurveySectionPayloadI, index: number) => (
              <>
                <p
                  className={clsx(
                    'h5',
                    'primary-color',
                    'lightgrey-bg-c2',
                    'mb-4',
                    'mt-3',
                    'p-3',
                    'font-weight-bold'
                  )}
                >
                  {section.titolo}
                </p>
                <JsonFormRender form={arrayForms[index]} viewMode />
              </>
            ))
          : null}
      </div>
    </div>
  );
};

export default ViewSurvey;
