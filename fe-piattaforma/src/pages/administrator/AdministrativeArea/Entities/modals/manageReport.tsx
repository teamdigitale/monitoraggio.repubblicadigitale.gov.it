import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { closeModal } from '../../../../../redux/features/modal/modalSlice';
import FormAddComment from '../../../../forms/formComments/formAddComment';

const id = 'reportModal';

interface ManageReportFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageReportI extends ManageReportFormI, withFormHandlerProps { }

const ManageReport: React.FC<ManageReportI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newReport, setNewReport] = useState('');
  const dispatch = useDispatch();

  const handleSaveReport = () => {
    console.log(newReport);
  };

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        disabled: newReport.trim() !== '',
        label: creation ? 'Conferma' : 'Salva',
        onClick: handleSaveReport,
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: () => {
          clearForm?.();
          dispatch(closeModal());
        },
      }}
      centerButtons
    >
      <p
        className={clsx(
          'd-flex',
          'justify-content-center',
          'my-4',
          'pt-3',
          'h5',
          'primary-color-a10',
          'font-weight-semibold'
        )}
      >
        <Icon icon='it-error' color='danger' className='mr-3' />
        Invia segnalazione
      </p>
      <FormAddComment
        creation={creation}
        formDisabled={!!formDisabled}
        sendNewValues={(newReport: string) =>
          setNewReport(newReport)
        }
      />
    </GenericModal>
  );
};

export default ManageReport;
