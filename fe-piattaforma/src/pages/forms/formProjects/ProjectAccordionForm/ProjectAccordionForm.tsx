import React, { memo } from 'react';
import { Accordion } from '../../../../components/index';
import { formForSectionT } from '../../formPrograms/targetDateFormPrograms';
// import { formForSectionEnum } from '../../formPrograms/targetDateFormPrograms';
import FormProjectGeneralInfo from '../formProjectGeneralInfo';
import TargetDateFormProjects from '../targetDateFormProjects';

const ProjectAccordionForm = () => {
  const accordions = [
    {
      title: 'Numero punti di facilitazione',
      section: 'puntiFacilitazione',
    },
    { title: 'Numero utenti unici', section: 'utentiUnici' },
    { title: 'Numero servizi', section: 'servizi' },
    { title: 'Numero facilitatori', section: 'facilitatori' },
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
            formForSection={accordion.section as formForSectionT}
            formDisabled
          />
        </Accordion>
      ))}
    </>
  );
};

export default memo(ProjectAccordionForm);
