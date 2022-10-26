import React, { useEffect, useState } from 'react';
import { Icon } from 'design-react-kit';
import { useAppSelector } from '../../../redux/hooks';
import { selectModalPayload, selectModalState } from '../../../redux/features/modal/modalSlice';
import GenericModal from '../../Modals/GenericModal/genericModal';
import { selectUser } from '../../../redux/features/user/userSlice';
import FormAddComment from '../../../pages/forms/formComments/formAddComment';

const id = 'delete-forum-entity';

interface DeleteForumModalI {
    onConfirm: (payload: any) => void;
    onClose: () => void;
}

const DeleteForumModal = ({ onClose, onConfirm }: DeleteForumModalI) => {
    const payload = useAppSelector(selectModalPayload);
    const userId = useAppSelector(selectUser)?.id
    const [reason, setReason] = useState("")
    const open = useAppSelector(selectModalState)

    useEffect(() => {
        if (open) setReason("")
    }, [open])

    return (
        <GenericModal
            id={id}
            primaryCTA={{
                label: 'Conferma',
                disabled: payload?.author?.toString() !== userId?.toString() && reason.trim() === "",
                onClick: () => onConfirm({ ...payload, reason }),
            }}
            secondaryCTA={{
                label: 'Annulla',
                onClick: onClose,
            }}
            centerButtons
            onClose={onClose}
        >
            <div className='d-flex flex-column justify-content-center'>
                <div className='d-flex justify-content-center mb-4'>
                    <Icon
                        icon='it-error'
                        style={{ width: '111px', height: '111px', fill: '#FF9900' }}
                        aria-label='Errore'
                    />
                </div>
                <div className='text-center'>{payload?.text}</div>
                {payload && payload.author?.toString() !== userId?.toString() ? (
                    <div className='mx-auto'>
                        <FormAddComment
                            creation
                            sendNewValues={(newReason: string) => setReason(newReason)}
                        />
                    </div>
                ) : null}
            </div>
        </GenericModal>
    );
};

export default DeleteForumModal;
