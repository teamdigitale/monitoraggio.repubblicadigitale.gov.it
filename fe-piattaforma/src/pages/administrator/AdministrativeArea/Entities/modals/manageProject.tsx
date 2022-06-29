import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes } from '../utils';
import { formFieldI } from '../../../../../utils/formHelper';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import { createProjectDetails } from '../../../../../redux/features/administrativeArea/projects/projectsThunk';
import { selectDevice } from '../../../../../redux/features/app/appSlice';

import { ProgressBar, Stepper } from '../../../../../components';
import { useAppSelector } from '../../../../../redux/hooks';
import FormProjectGeneralInfo from '../../../../forms/formProjects/formProjectGeneralInfo';

import TargetDateFormProjects from '../../../../forms/formProjects/targetDateFormProjects';
import {
  resetProjectDetails,
  setProjectGeneralInfo,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import clsx from 'clsx';

interface ProgramInformationI {
  formDisabled?: boolean;
  creation?: boolean;
}

const id = formTypes.PROGETTO;

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}

const ManageProject: React.FC<FormEnteGestoreProgettoFullInterface> = ({
  clearForm = () => ({}),
  formDisabled,
  creation = false,
}) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleSaveProgram = () => {
    if (isFormValid) {
      if (creation) {
        dispatch(createProjectDetails(newFormValues));
        setCurrentStep(1);
        // here dispatch create new program
      } else {
        dispatch(createProjectDetails(newFormValues));
        setCurrentStep(1);
        // TODO here dispatch update program
      }
      dispatch(closeModal());
    }
  };

  const steps = [
    {
      title: 'Informazioni generali',
      primaryCTA: {
        disabled: !isFormValid,
        label: 'Step Successivo',
        onClick: () => {
          setCurrentStep(currentStep + 1);
          clearForm();
        },
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
        },
      },
      tertiatyCTA: null,
    },
    {
      title: 'Numero punti di facilitazione',
      primaryCTA: {
        disabled: !isFormValid,
        label: 'Step Successivo',
        onClick: () => setCurrentStep(currentStep + 1),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => clearForm?.(),
      },
      tertiatyCTA: {
        label: 'Step precedente',
        onClick: () => setCurrentStep(currentStep - 1),
      },
    },
    {
      title: 'Numero utenti unici',
      primaryCTA: {
        disabled: !isFormValid,
        label: 'Step Successivo',
        onClick: () => setCurrentStep(currentStep + 1),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => clearForm?.(),
      },
      tertiatyCTA: {
        label: 'Step precedente',
        onClick: () => setCurrentStep(currentStep - 1),
      },
    },
    {
      title: 'Numero servizi',
      primaryCTA: {
        disabled: !isFormValid,
        label: 'Step Successivo',
        onClick: () => setCurrentStep(currentStep + 1),
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => clearForm?.(),
      },
      tertiatyCTA: {
        label: 'Step precedente',
        onClick: () => setCurrentStep(currentStep - 1),
      },
    },
    {
      title: 'Numero facilitatori',
      primaryCTA: {
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveProgram,
      },
      secondaryCTA: {
        label: 'Annulla',
        onClick: () => clearForm?.(),
      },
      tertiatyCTA: {
        label: 'Step precedente',
        onClick: () => setCurrentStep(currentStep - 1),
      },
    },
  ];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [propstoGenericModal, setPropstoGenericModal] = useState(steps[0]);
  const [newFormValues, setNewFormValues] = useState<{
    [key: string]: formFieldI['value'];
  }>({});
  const device = useAppSelector(selectDevice);

  const stepsArray = () => {
    const allSteps: string[] = [];
    steps.map((step) => allSteps.push(step.title));

    return allSteps;
  };

  const dispatch = useDispatch();

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

  const renderingForm = () => {
    switch (currentStep) {
      case 1:
      default: {
        return (
          <FormProjectGeneralInfo
            formDisabled={!!formDisabled}
            intoModal
            sendNewValues={(newData?: {
              [key: string]: formFieldI['value'];
            }) => {
              setNewFormValues({ ...newData });
            }}
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        );
      }
      case 2: {
        return (
          <TargetDateFormProjects
            formForSection='facilitationNumber'
            intoModal
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        );
      }
      case 3: {
        return (
          <TargetDateFormProjects
            formForSection='uniqueUsers'
            intoModal
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        );
      }
      case 4: {
        return (
          <TargetDateFormProjects
            formForSection='services'
            intoModal
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        );
      }
      case 5: {
        return (
          <TargetDateFormProjects
            formForSection='facilitators'
            intoModal
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        );
      }
    }
  };

  useEffect(() => {
    dispatch(resetProjectDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creation]);

  return (
    <GenericModal
      id={id}
      primaryCTA={propstoGenericModal.primaryCTA}
      secondaryCTA={propstoGenericModal.secondaryCTA}
      tertiaryCTA={propstoGenericModal.tertiatyCTA || null}
    >
      <div
        className={clsx(
          'd-flex',
          'justify-content-center',
          'flex-column',
          'align-items-center',
          'mb-5'
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
          {steps[currentStep - 1].title}
        </p>
      )}
      <div
        style={{
          maxHeight: device.mediaIsPhone ? '100%' : '340px',
          overflowY: 'auto',
        }}
      >
        {renderingForm()}
      </div>
    </GenericModal>
  );
};

export default ManageProject;
