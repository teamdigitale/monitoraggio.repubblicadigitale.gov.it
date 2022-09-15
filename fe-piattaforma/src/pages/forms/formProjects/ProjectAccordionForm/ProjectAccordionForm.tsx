import React, { memo } from 'react';
import TargetsForm, {
  SectionT,
} from '../../../../components/AdministrativeArea/Entities/General/TargetForm/TargetsForm';
import { Accordion } from '../../../../components/index';
import { selectProjects } from '../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../redux/hooks';
import FormProjectGeneralInfo from '../formProjectGeneralInfo';

const ProjectAccordionForm = () => {
  const projectDetails =
    useAppSelector(selectProjects).detail.dettagliInfoProgetto;

  return (
    <>
      <FormProjectGeneralInfo formDisabled />
      {accordions.map((accordion, index) => (
        <Accordion
          title={accordion.title}
          key={index}
          className='general-info-accordion-container-project'
        >
          <TargetsForm
            section={accordion.section as SectionT}
            disabled
            entityDetail={projectDetails}
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
  { title: 'Numero utenti unici', section: 'utentiUnici' },
  { title: 'Numero servizi', section: 'servizi' },
  { title: 'Numero facilitatori', section: 'facilitatori' },
];

export default memo(ProjectAccordionForm);
