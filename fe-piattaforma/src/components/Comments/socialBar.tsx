import React from 'react';
import { Button, Icon } from 'design-react-kit';
import CuoreBluVuoto from '../../../public/assets/img/hollow-blue-heart.png';
import CuoreBluPieno from '../../../public/assets/img/filled-blue-heart.png';
import clsx from 'clsx';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

export interface SocialI {
  onLike?: (() => void) | undefined;
  onComment?: (() => void) | undefined;
  views?: number | undefined;
  likes?: number | undefined;
  comments?: number | undefined;
  replies?: number | undefined;
  downloads?: number | undefined;
  showReplies?: boolean | undefined;
  user_like?: boolean | undefined;
  onShowReplies?: (() => void) | undefined;
}

const SocialBar: React.FC<SocialI> = (props) => {
  const {
    showReplies,
    onShowReplies,
    onLike,
    onComment,
    views,
    likes,
    comments,
    user_like,
    downloads,
    replies,
  } = props;

  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        'd-flex',
        'align-items-center',
        device.mediaIsPhone && 'flex-column'
      )}
    >
      <div
        style={{ flexGrow: '1' }}
        className={clsx(
          'd-flex',
          'justify-content-between',
          (!onShowReplies || device.mediaIsPhone) && 'w-100'
        )}
      >
        <div className='d-flex'>
          {likes !== undefined ? (
            <div className='d-flex flex-row align-items-center pr-4'>
              <Icon icon={CuoreBluVuoto} size='xs' aria-label='like vuoto' />
              <p className='neutral-1-color pl-2'> {likes} </p>
            </div>
          ) : null}
          {comments !== undefined ? (
            <div className='d-flex flex-row align-items-center pr-4'>
              <Icon
                icon='it-comment'
                color='primary'
                size='sm'
                aria-label='icone risposta'
              />
              <p className='neutral-1-color pl-2'> {comments} </p>
            </div>
          ) : null}
          {views !== undefined ? (
            <div className='d-flex flex-row align-items-center'>
              <Icon
                icon='it-password-visible'
                color='primary'
                size='sm'
                aria-label='icona visualizzato'
              />
              <p className='neutral-1-color pl-2'>{views}</p>
            </div>
          ) : null}
          {downloads !== undefined ? (
            <div className='d-flex flex-row align-items-center'>
              <Icon
                icon='it-download'
                color='primary'
                size='sm'
                aria-label='download effetuati'
              />
              <p className='neutral-1-color pl-2'>{downloads}</p>
            </div>
          ) : null}
        </div>
        <div className='d-flex justify-content-end'>
          {onLike ? (
            <Button
              onClick={() => onLike()}
              className='mr-4'
              style={{ padding: '0' }}
            >
              <div
                className={clsx(
                  'd-flex',
                  'flex-row',
                  'align-items-center'
                  /*   device.mediaIsDesktop && 'justify-content-end' */
                )}
              >
                <Icon
                  icon={user_like ? CuoreBluPieno : CuoreBluVuoto}
                  size='xs'
                  aria-label='like'
                />
                {device.mediaIsDesktop ? (
                  <p className='primary-color font-weight-bold pl-2 letter-spacing'>
                    {user_like ? 'NON MI PIACE' : 'MI PIACE'}
                  </p>
                ) : null}
              </div>
            </Button>
          ) : null}

          {onComment ? (
            <Button onClick={() => onComment()} style={{ padding: '0' }}>
              <div className={clsx('d-flex', 'flex-row', 'align-items-center')}>
                <Icon
                  icon='it-comment'
                  color='primary'
                  size='sm'
                  aria-label='rispota'
                />
                {device.mediaIsDesktop ? (
                  <p className='primary-color font-weight-bold pl-2 letter-spacing'>
                    COMMENTA
                  </p>
                ) : null}
              </div>
            </Button>
          ) : null}
        </div>
      </div>
      {onShowReplies ? (
        <div className={clsx(device.mediaIsPhone && 'align-self-start')}>
          <Button
            onClick={() => onShowReplies()}
            size='xs'
            className={clsx(
              'p-0',
              !device.mediaIsPhone && 'pl-3',
              'd-flex',
              'flex-row',
              'align-items-center'
            )}
          >
            <div
              className={clsx(
                'd-flex',
                'flex-row',
                'align-items-center',
                device.mediaIsPhone
                  ? 'justify-content-start py-3 pl-0'
                  : 'justify-content-end pl-2'
              )}
            >
              <Icon icon='it-list' color='primary' size='sm' />
              <p
                className={clsx(
                  'primary-color',
                  'font-weight-bold',
                  'pl-2',
                  'text-nowrap',
                  'letter-spacing'
                )}
              >
                {`${showReplies ? 'NASCONDI RISPOSTE' : 'MOSTRA RISPOSTE'}`}
              </p>
              <span
                className='primary-color pl-1 letter-spacing'
                style={{ fontWeight: 400 }}
              >{`(${replies})`}</span>
            </div>
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default SocialBar;
