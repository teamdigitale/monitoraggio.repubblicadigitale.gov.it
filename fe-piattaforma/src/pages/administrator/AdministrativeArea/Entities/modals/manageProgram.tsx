import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { formTypes } from '../utils';
import { formFieldI } from '../../../../../utils/formHelper';
import {
  closeModal,
  selectModalState,
} from '../../../../../redux/features/modal/modalSlice';
import {
  createProgram,
  GetProgramDetail,
  updateProgram,
} from '../../../../../redux/features/administrativeArea/programs/programsThunk';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import { ProgressBar, Stepper } from '../../../../../components';
import FormGeneralInfo from '../../../../forms/formPrograms/formGeneralInfo';
// import TargetDateFormPrograms from '../../../../forms/formPrograms/targetDateFormPrograms';
import {
  resetProgramDetails,
  selectPrograms,
  setProgramDetails,
  setProgramGeneralInfo,
} from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import TargetsForm from '../../../../../components/AdministrativeArea/Entities/General/TargetForm/TargetsForm';
interface ProgramInformationI {
  formDisabled?: boolean;
  creation?: boolean;
  edit?: boolean;
}

const id = formTypes.PROGRAMMA;

interface FormEnteGestoreProgettoFullInterface
  extends withFormHandlerProps,
    ProgramInformationI {}

const ManageProgram: React.FC<FormEnteGestoreProgettoFullInterface> = ({
  // clearForm = () => ({}),
  formDisabled,
  creation = false,
  edit = false,
}) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const { entityId } = useParams();
  const navigate = useNavigate();
  const open = useAppSelector(selectModalState);

  useEffect(() => {
    if (open && creation) {
      dispatch(setProgramDetails({}));
      setCurrentStep(0);
    }
  }, [open]);

  const handleSaveProgram = async () => {
    if (isFormValid) {
      if (creation) {
        const res: any = await dispatch(createProgram(newFormValues));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res?.data?.idProgrammaCreato) {
          navigate(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            `/area-amministrativa/programmi/${res.data.idProgrammaCreato}/info`
          );
        }

        if (!res?.data?.errorCode) dispatch(closeModal());
      } else {
        if (entityId) {
          await dispatch(updateProgram(entityId, newFormValues));
          dispatch(GetProgramDetail(entityId));
        }
        dispatch(closeModal());
      }
      setCurrentStep(0);
    }
  };

  const handleCancel = () => {
    if (!creation && entityId) {
      dispatch(GetProgramDetail(entityId));
      setCurrentStep(0);
    }
    dispatch(closeModal());
  };

  const steps = [
    {
      title: 'Informazioni generali',
      primaryCTA: {
        disabled: !isFormValid,
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
        disabled: !isFormValid,
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
        disabled: !isFormValid,
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
        disabled: !isFormValid,
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
        disabled: !isFormValid,
        label: 'Conferma',
        onClick: handleSaveProgram,
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
  const programDetails =
    useAppSelector(selectPrograms).detail.dettagliInfoProgramma;

  const stepsArray = () => {
    const allSteps: string[] = [];
    steps.map((step) => allSteps.push(step.title));

    return allSteps;
  };

  const dispatch = useDispatch();

  const updateDetailInfoHandler = () => {
    dispatch(setProgramGeneralInfo({ currentStep, newFormValues }));
    setCurrentStep((prev) => prev + 1);
  };

  /*
  useEffect(() => {
    if (currentStep) {
      switch (currentStep) {
        case 1:
        default:
          dispatch(setProgramGeneralInfo({ currentStep, newFormValues }));
          break;

        case 2:
          dispatch(setProgramGeneralInfo({ currentStep, newFormValues }));
          break;

        case 3:
          dispatch(setProgramGeneralInfo({ currentStep, newFormValues }));
          break;
        case 4:
          dispatch(setProgramGeneralInfo({ currentStep, newFormValues }));
          break;
        case 5:
          dispatch(setProgramGeneralInfo({ currentStep, newFormValues }));
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);
  */

  /*
  useEffect(() => {
    setPropstoGenericModal(steps[currentStep - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isFormValid]);

  */

  let currentForm = <span></span>;

  switch (currentStep) {
    case 0:
      currentForm = (
        <FormGeneralInfo
          edit={edit}
          intoModal
          formDisabled={!!formDisabled}
          sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) => {
            setNewFormValues({ ...newData });
          }}
          setIsFormValid={(value: boolean | undefined) =>
            setIsFormValid(!!value)
          }
          creation={creation}
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
          entityDetail={programDetails}
        />
      );
      /*(
          <TargetDateFormPrograms
            intoModal
            formForSection='puntiFacilitazione'
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        ); */
      break;
    case 2:
      currentForm = (
        <TargetsForm
          section='utentiUnici'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          entityDetail={programDetails}
        />
      );
      /*(
          <TargetDateFormPrograms
            intoModal
            formForSection='utentiUnici'
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        );*/
      break;
    case 3:
      currentForm = (
        <TargetsForm
          section='servizi'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          entityDetail={programDetails}
        />
      );
      /*(
          <TargetDateFormPrograms
            intoModal
            formForSection='servizi'
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        ); */
      break;
    case 4:
      currentForm = (
        <TargetsForm
          section='facilitatori'
          sendValues={(newData?: { [key: string]: formFieldI['value'] }) =>
            setNewFormValues({ ...newData })
          }
          entityDetail={programDetails}
        />
      );
      /*(
          <TargetDateFormPrograms
            intoModal
            formForSection='facilitatori'
            formDisabled={!!formDisabled}
            sendNewValues={(newData?: { [key: string]: formFieldI['value'] }) =>
              setNewFormValues({ ...newData })
            }
            setIsFormValid={(value: boolean | undefined) =>
              setIsFormValid(!!value)
            }
            creation={creation}
          />
        ); */

      break;
  }

  useEffect(() => {
    if (creation) dispatch(resetProgramDetails());
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
            'mb-5',
            'h-5',
            'primary-color',
            'mx-5',
            'px-5',
            'font-weight-semibold'
          )}
        >
          {steps[currentStep].title}
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

export default ManageProgram;
