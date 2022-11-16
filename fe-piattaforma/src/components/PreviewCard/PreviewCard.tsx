import React from 'react';
import './PreviewCard.scss';
import PreviewImg from '../../../public/assets/img/file_upload.png';
import { Button } from 'design-react-kit';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import './PreviewCard.scss';

interface PreviewCardI {
  disabled: boolean;
  onClick: () => void;
}

const PreviewCard = ({ disabled = false, onClick }: PreviewCardI) => {
  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        'preview-card-container',
        'd-flex',
        device.mediaIsPhone ? 'flex-column' : 'flex-row',
        'justify-content-between',
        'align-items-center',
        'p-4',
        'my-4',
        'w-100'
      )}
    >
      <div className={clsx('d-flex', 'align-items-center', 'flex-row')}>
        <img
          src={PreviewImg}
          alt='Preview-img'
          className={clsx(device.mediaIsPhone && 'h-50')}
        />
        <div className={clsx('d-flex flex-column align-items-start pl-4')}>
          <h1 className='h4 primary-color preview-card-container__title'>
            Guarda l&apos;anteprima
          </h1>
          <p className='text-muted preview-card-container__description'>
            Visualizza l&apos; anteprima della news prima di pubblicarla
          </p>
        </div>
      </div>
      <Button
        disabled={disabled}
        color='primary'
        outline
        className='button-preview'
        onClick={onClick}
      >
        <span>Anteprima</span>
      </Button>
    </div>
  );
};

export default PreviewCard;
