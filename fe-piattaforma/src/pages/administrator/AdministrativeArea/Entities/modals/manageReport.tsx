import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { withFormHandlerProps } from '../../../../../hoc/withFormHandler';
import { GetCommentsList } from '../../../../../redux/features/forum/comments/commentsThunk';
import { GetItemDetail } from '../../../../../redux/features/forum/forumThunk';
import {
  CreateCommentReport,
  CreateItemReport,
} from '../../../../../redux/features/forum/reports/reportsThunk';
import {
  closeModal,
  selectModalPayload,
} from '../../../../../redux/features/modal/modalSlice';
import { selectUser } from '../../../../../redux/features/user/userSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import FormAddComment from '../../../../forms/formComments/formAddComment';

const modalId = 'report-modal';

interface ManageReportFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface ManageReportI extends ManageReportFormI, withFormHandlerProps {}

const ManageReport: React.FC<ManageReportI> = ({
  clearForm,
  formDisabled,
  creation = false,
}) => {
  const [newReport, setNewReport] = useState('');
  const payload = useAppSelector(selectModalPayload);
  const dispatch = useDispatch();
  const { id } = useParams();
  const userId = useAppSelector(selectUser)?.id;

  const handleSaveReport = async () => {
    if (newReport.trim() !== '' && payload) {
      switch (payload.entity) {
        case 'board':
        case 'community':
        case 'document':
          if (id && userId) {
            await dispatch(CreateItemReport(id, newReport));
            dispatch(GetItemDetail(id, userId, payload.entity));
          }
          break;
        case 'comment':
          await dispatch(CreateCommentReport(payload.id, newReport));
          break;
        default:
          break;
      }

      id && userId && (await dispatch(GetCommentsList(id, userId)));
      setNewReport('');
      dispatch(closeModal());
    }
  };

  return (
    <GenericModal
      id={modalId}
      primaryCTA={{
        disabled: newReport.trim() === '',
        label: creation ? 'Conferma' : 'Invia',
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
        sendNewValues={(newReport: string) => setNewReport(newReport)}
      />
    </GenericModal>
  );
};

export default ManageReport;
