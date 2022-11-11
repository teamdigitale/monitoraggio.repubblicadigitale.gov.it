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

  console.log('replies', replies);

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
              <Icon
                icon={CuoreBluVuoto}
                size='xs'
                aria-label='like vuoto'
                aria-hidden
              />
              <p className='neutral-1-color pl-2'> {likes} </p>
            </div>
          ) : null}
          {comments !== undefined ? (
            <div className='d-flex flex-row align-items-center pr-4'>
              <Icon
                icon='it-comment'
                color='primary'
                size='sm'
                aria-label='Commenti'
                aria-hidden
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
                aria-label='Views'
                aria-hidden
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
                aria-hidden
              />
              <p className='neutral-1-color pl-2'>{downloads}</p>
            </div>
          ) : null}
        </div>
        <div className='d-flex justify-content-end'>
          {onLike ? (
            <Button
              onClick={() => onLike()}
              style={{ padding: '0' }}
              className={clsx(
                'd-flex',
                'flex-row',
                'align-items-center',
                'mr-4'
                /*   device.mediaIsDesktop && 'justify-content-end' */
              )}
              aria-label={user_like ? 'NON MI PIACE' : 'MI PIACE'}
            >
              <Icon
                icon={user_like ? CuoreBluPieno : CuoreBluVuoto}
                size='xs'
                aria-label='likes'
                aria-hidden
              />
              {device.mediaIsDesktop ? (
                <p className='primary-color font-weight-bold pl-2 letter-spacing'>
                  {user_like ? 'NON MI PIACE' : 'MI PIACE'}
                </p>
              ) : null}
            </Button>
          ) : null}

          {onComment ? (
            <Button
              onClick={() => onComment()}
              style={{ padding: '0' }}
              className={clsx('d-flex', 'flex-row', 'align-items-center')}
              aria-label='Commenta'
            >
              <Icon
                icon='it-comment'
                color='primary'
                size='sm'
                aria-label='commenta'
                aria-hidden
              />
              {device.mediaIsDesktop ? (
                <p className='primary-color font-weight-bold pl-2 letter-spacing'>
                  COMMENTA
                </p>
              ) : null}
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
              'align-items-center',
              'd-flex',
              'flex-row',
              'align-items-center',
              device.mediaIsPhone
                ? 'justify-content-start py-3 pl-0'
                : 'justify-content-end pl-2'
            )}
            aria-label={`${
              showReplies ? 'NASCONDI RISPOSTE' : 'MOSTRA RISPOSTE'
            }`}
          >
            <Icon
              icon='it-list'
              color='primary'
              size='sm'
              aria-label='lista risposte'
              aria-hidden
            />
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
            {replies ? (
              <span
                className='primary-color pl-1 letter-spacing'
                style={{ fontWeight: 400 }}
              >{`(${replies})`}</span>
            ) : null}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default SocialBar;
