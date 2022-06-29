import React, { memo } from 'react';
import { Accordion } from '../../../../components/index';
import { formForSectionEnum } from '../../formPrograms/targetDateFormPrograms';
import FormProjectGeneralInfo from '../formProjectGeneralInfo';
import TargetDateFormProjects from '../targetDateFormProjects';

const ProjectAccordionForm = () => {
  const accordions = [
    {
      title: 'Numero punti di facilitazione',
      section: formForSectionEnum.facilitationNumber,
    },
    { title: 'Numero utenti unici', section: formForSectionEnum.uniqueUsers },
    { title: 'Numero servizi', section: formForSectionEnum.services },
    { title: 'Numero facilitatori', section: formForSectionEnum.facilitators },
  ];
  return (
    <>
      <FormProjectGeneralInfo formDisabled />
      {accordions.map((accordion, index) => (
        <Accordion
          title={accordion.title}
          key={index}
          className='general-info-accordion-container-project'
        >
          <TargetDateFormProjects
            formForSection={accordion.section}
            formDisabled
          />
        </Accordion>
      ))}
    </>
  );
};

export default memo(ProjectAccordionForm);
