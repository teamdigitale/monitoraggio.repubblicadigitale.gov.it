import React, { memo } from 'react';
import { Accordion } from '../../../../components/index';
import FormGeneralInfo from '../formGeneralInfo';
import TargetDateFormPrograms, {
  formForSectionEnum,
} from '../targetDateFormPrograms';

const GeneralInfoAccordionForm = () => {
  const accordions = [
    {
      title: 'Numero punti di facilitazione',
      section: formForSectionEnum.facilitationNumber,
    },
    { title: 'Utenti unici', section: formForSectionEnum.uniqueUsers },
    { title: 'Numero servizi', section: formForSectionEnum.services },
    { title: 'Numero facilitatori', section: formForSectionEnum.facilitators },
  ];
  return (
    <>
      <FormGeneralInfo formDisabled />
      {accordions.map((accordion, index) => (
        <Accordion
          title={accordion.title}
          key={index}
          className='general-info-accordion-container'
        >
          <TargetDateFormPrograms
            formForSection={accordion.section}
            formDisabled
          />
        </Accordion>
      ))}
    </>
  );
};

export default memo(GeneralInfoAccordionForm);
