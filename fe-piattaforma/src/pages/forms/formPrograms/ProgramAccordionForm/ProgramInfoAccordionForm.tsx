import React, { memo } from 'react';
import { Accordion } from '../../../../components/index';
import FormGeneralInfo from '../formGeneralInfo';

import TargetDateFormPrograms, {
  formForSectionT,
} from '../targetDateFormPrograms';

const ProgramInfoAccordionForm = () => {
  const accordions = [
    {
      title: 'Numero punti di facilitazione',
      section: 'puntiFacilitazione',
    },
    { title: 'Utenti unici', section: 'utentiUnici' },
    { title: 'Numero servizi', section: 'servizi' },
    { title: 'Numero facilitatori', section: 'facilitatori' },
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
            formForSection={accordion.section as formForSectionT}
            formDisabled
            creation={false}
          />
        </Accordion>
      ))}
    </>
  );
};

export default memo(ProgramInfoAccordionForm);
