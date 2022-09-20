import React, { memo } from 'react';
import TargetsForm, {
  SectionT,
} from '../../../../components/AdministrativeArea/Entities/General/TargetForm/TargetsForm';
import { Accordion } from '../../../../components/index';
import { selectPrograms } from '../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../redux/hooks';
import FormGeneralInfo from '../formGeneralInfo';

const ProgramInfoAccordionForm = () => {
  const programDetails =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;

  return (
    <>
      <FormGeneralInfo formDisabled edit />
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
