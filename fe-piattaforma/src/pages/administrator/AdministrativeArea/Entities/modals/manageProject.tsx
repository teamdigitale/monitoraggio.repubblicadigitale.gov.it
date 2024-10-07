import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes, policy } from '../utils';
import { formFieldI } from '../../../../../utils/formHelper';
import {
  closeModal,
  selectModalState,
} from '../../../../../redux/features/modal/modalSlice';
import {
  createProject,
  GetProjectDetail,
  updateProject,
} from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { selectDevice } from '../../../../../redux/features/app/appSlice';

import { ProgressBar, Stepper } from '../../../../../components';
import { useAppSelector } from '../../../../../redux/hooks';
import FormProjectGeneralInfo from '../../../../forms/formProjects/formProjectGeneralInfo';

import {
  resetProjectDetails,
  selectPrograms,
  selectProjects,
  setProjectDetails,
  setProjectGeneralInfo,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import clsx from 'clsx';
import TargetsForm from '../../../../../components/AdministrativeArea/Entities/General/TargetForm/TargetsForm';
import { useParams } from 'react-router-dom';
import { GetProgramDetail } from '../../../../../redux/features/administrativeArea/programs/programsThunk';

interface ProgramInformationI {
  formDisabled?: boolean;
  creation?: boolean;
  legend?: string | undefined;
}

const id = formTypes.PROGETTO;

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}

const ManageProject: React.FC<FormEnteGestoreProgettoFullInterface> = ({
  // clearForm = () => ({}),
  formDisabled,
  creation = false,
  legend = '',
}) => {
  // const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const { projectId, entityId } = useParams();
  const open = useAppSelector(selectModalState);
  const [validSteps, setValidSteps] = useState(new Array(5).fill(false));

  useEffect(() => {
    if (open && creation) {
      dispatch(setProjectDetails({}));
      setCurrentStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSaveProject = async () => {
    if (validSteps.every((step) => step)) {
      if (creation && entityId) {
        await dispatch(createProject(entityId, newFormValues));
        setCurrentStep(0);
        // here dispatch create new program
        dispatch(GetProgramDetail(entityId));
      } else if (projectId) {
        // dispatch(createProjectDetails(newFormValues));
        await dispatch(updateProject(projectId, newFormValues));
        setCurrentStep(0);
        // TODO here dispatch update program
      }
      dispatch(closeModal());
    }
  };

  const handleCancel = () => {
    if (!creation && projectId) {
      dispatch(GetProjectDetail(projectId));
      setCurrentStep(0);
    }
    dispatch(closeModal());
  };

  const steps = [
    {
      title: 'Informazioni generali',
      primaryCTA: {
        disabled: !validSteps[0],
        label: 'Avanti',
        onClick: () => updateDetailInfoHandler(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: handleCancel,
      },
      tertiatyCTA: null,
    },
    {
      title: 'Numero punti di facilitazione',
      primaryCTA: {
        disabled: !validSteps[1],
        label: 'Avanti',
        onClick: () => updateDetailInfoHandler(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: handleCancel,
      },
      tertiatyCTA: {
        label: 'Indietro',
        onClick: () => setCurrentStep((prev) => prev - 1),
      },
    },
    {
      title: 'Numero utenti unici',
      primaryCTA: {
        disabled: !validSteps[2],
        label: 'Avanti',
        onClick: () => updateDetailInfoHandler(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: handleCancel,
      },
      tertiatyCTA: {
        label: 'Indietro',
        onClick: () => setCurrentStep((prev) => prev - 1),
      },
    },
    {
      title: 'Numero servizi',
      primaryCTA: {
        disabled: !validSteps[3],
        label: 'Avanti',
        onClick: () => updateDetailInfoHandler(),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: handleCancel,
      },
      tertiatyCTA: {
        label: 'Indietro',
        onClick: () => setCurrentStep((prev) => prev - 1),
      },
    },
    {
      title: 'Numero facilitatori',
      primaryCTA: {
        disabled: !validSteps[4],
        label: 'Conferma',
        onClick: handleSaveProject,
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: handleCancel,
      },
      tertiatyCTA: {
        label: 'Indietro',
        onClick: () => setCurrentStep((prev) => prev - 1),
      },
    },
  ];

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const device = useAppSelector(selectDevice);
  const projectDetails =
    useAppSelector(selectProjects).detail.dettagliInfoProgetto;
  const { dettagliInfoProgramma: programDetails } =
    useAppSelector(selectPrograms).detail || {};

  const stepsArray = () => {
    const allSteps: string[] = [];
    steps.map((step) => allSteps.push(step.title));

    return allSteps;
  };

  const dispatch = useDispatch();

  const updateDetailInfoHandler = () => {
    dispatch(setProjectGeneralInfo({ currentStep, newFormValues }));
    setCurrentStep((prev) => prev + 1);
  };

  /*
  useEffect(() => {
    if (currentStep) {
      switch (currentStep) {
        case 1:
        default:
          dispatch(setProjectGeneralInfo({ currentStep, newFormValues }));
          break;

        case 2:
          dispatch(setProjectGeneralInfo({ currentStep, newFormValues }));
          break;

        case 3:
          dispatch(setProjectGeneralInfo({ currentStep, newFormValues }));
          break;
        case 4:
          dispatch(setProjectGeneralInfo({ currentStep, newFormValues }));
          break;
        case 5:
          dispatch(setProjectGeneralInfo({ currentStep, newFormValues }));
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    setPropstoGenericModal(steps[currentStep - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isFormValid]);

  */

  let currentForm = <span></span>;

  switch (currentStep) {
    case 0:
      currentForm = (
        <FormProjectGeneralInfo
          formDisabled={!!formDisabled}
          intoModal
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewFormValues({ ...newData });
          }}
          setIsFormValid={(value: boolean | undefined) =>
            setValidSteps((prev) =>
              prev.map((step, i) => (i === 0 ? value : step))
            )
          }
          creation={creation}
          program={programDetails}
          legend={legend}
        />
      );
      break;
    case 1:
      currentForm = (
        <TargetsForm
          section='puntiFacilitazione'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setValidSteps((prev) =>
              prev.map((step, i) => (i === 1 ? value : step))
            )
          }
          entityDetail={projectDetails}
          maxDate={projectDetails?.dataFine?.toString()}
          minDate={projectDetails?.dataInizio?.toString()}
        />
      );
      break;
    case 2:
      currentForm = (
        <TargetsForm
          section='utentiUnici'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setValidSteps((prev) =>
              prev.map((step, i) => (i === 2 ? value : step))
            )
          }
          entityDetail={projectDetails}
          maxDate={projectDetails?.dataFine?.toString()}
          minDate={projectDetails?.dataInizio?.toString()}
        />
      );
      break;
    case 3:
      currentForm = (
        <TargetsForm
          section='servizi'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setValidSteps((prev) =>
              prev.map((step, i) => (i === 3 ? value : step))
            )
          }
          entityDetail={projectDetails}
          maxDate={projectDetails?.dataFine?.toString()}
          minDate={projectDetails?.dataInizio?.toString()}
        />
      );
      break;
    case 4:
      currentForm = (
        <TargetsForm
          section='facilitatori'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          setIsFormValid={(value: boolean | undefined) =>
            setValidSteps((prev) =>
              prev.map((step, i) => (i === 4 ? value : step))
            )
          }
          entityDetail={projectDetails}
          maxDate={projectDetails?.dataFine?.toString()}
          minDate={projectDetails?.dataInizio?.toString()}
        />
      );
      break;
  }

  useEffect(() => {
    dispatch(resetProjectDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  return (
    <GenericModal
      id={id}
      primaryCTA={steps[currentStep].primaryCTA}
      secondaryCTA={steps[currentStep].secondaryCTA}
      tertiaryCTA={steps[currentStep].tertiatyCTA || null}
    >
      <div
        className={clsx(
          'd-flex',
          'justify-content-center',
          'flex-column',
          'align-items-center',
          'my-4'
        )}
      >
        {device.mediaIsPhone ? (
          <ProgressBar currentStep={currentStep} steps={stepsArray()} />
        ) : (
          <Stepper nSteps={5} currentStep={currentStep} />
        )}
      </div>
      {device.mediaIsPhone ? null : (
        <p
          className={clsx(
            'mt-1',
            'h-5',
            'primary-color',
            'mx-5',
            'px-5',
            'font-weight-semibold'
          )}
        >
          {steps[currentStep].title == 'Numero facilitatori' && projectDetails?.policy == policy.SCD ? 'Numero volontari' : steps[currentStep].title}
        </p>
      )}
      <div
        style={{
          maxHeight: device.mediaIsPhone ? '100%' : '340px',
        }}
        className='px-5'
      >
        {currentForm}
      </div>
    </GenericModal>
  );
};

export default ManageProject;
