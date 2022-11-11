import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TargetsForm, {
  SectionT,
} from '../../../../components/AdministrativeArea/Entities/General/TargetForm/TargetsForm';
import { Accordion } from '../../../../components/index';
import { selectProjects } from '../../../../redux/features/administrativeArea/administrativeAreaSlice';
import { useAppSelector } from '../../../../redux/hooks';
import FormProjectGeneralInfo from '../formProjectGeneralInfo';
import { GetProjectDetail } from '../../../../redux/features/administrativeArea/projects/projectsThunk';

interface ProjectAccordionFormI {
  legend?: string | undefined;
}

const ProjectAccordionForm: React.FC<ProjectAccordionFormI> = (props) => {
  const { legend = '' } = props;
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const projectDetails =
    useAppSelector(selectProjects).detail.dettagliInfoProgetto;

  useEffect(() => {
    if (projectId) {
      dispatch(GetProjectDetail(projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <>
      <FormProjectGeneralInfo legend={legend} formDisabled />
      <h2 className='h5 mb-4' style={{ color: 'rgb(92, 111, 130)' }}>
        Obiettivi progetto
      </h2>
      {accordions.map((accordion, index) => (
        <Accordion
          title={accordion.title}
          key={index}
          className='general-info-accordion-container-project'
          detailAccordion
        >
          <TargetsForm
            section={accordion.section as SectionT}
            disabled
            entityDetail={projectDetails}
            legend="form obbiettivi progetto, i campi con l'asterisco sono obbligatori"
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
