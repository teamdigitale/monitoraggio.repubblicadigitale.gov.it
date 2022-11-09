import React, { memo } from 'react';
import TargetsForm, {
  SectionT,
} from '../../../../components/AdministrativeArea/Entities/General/TargetForm/TargetsForm';
import { Accordion } from '../../../../components/index';
import { selectPrograms } from '../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../redux/hooks';
import FormGeneralInfo from '../formGeneralInfo';

interface ProgramInfoAccordionFormI {
  legend?: string | undefined;
}

const ProgramInfoAccordionForm: React.FC<ProgramInfoAccordionFormI> = (
  props
) => {
  const { legend = '' } = props;
  const programDetails =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;

  return (
    <>
      <FormGeneralInfo legend={legend} formDisabled edit />
      <h2 className='h5 mb-4' style={{ color: 'rgb(92, 111, 130)' }}>
        Obiettivi programma
      </h2>
      {accordions.map((accordion, index) => (
        <Accordion
          title={accordion.title}
          key={index}
          className='general-info-accordion-container'
          detailAccordion
        >
          <TargetsForm
            entityDetail={programDetails}
            section={accordion.section as SectionT}
            disabled
            legend="form obbiettivi programma, i campi con l'asterisco sono obbligatori"
          />
        </Accordion>
      ))}
    </>
  );
};

const accordions = [
  {
    title: 'Numero punti di facilitazione',
    section: 'puntiFacilitazione',
  },
  { title: 'Utenti unici', section: 'utentiUnici' },
  { title: 'Numero servizi', section: 'servizi' },
  { title: 'Numero facilitatori', section: 'facilitatori' },
];

export default memo(ProgramInfoAccordionForm);
