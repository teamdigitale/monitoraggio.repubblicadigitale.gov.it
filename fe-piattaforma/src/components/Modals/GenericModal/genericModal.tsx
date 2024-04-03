import React, { ReactChild, ReactNode } from 'react';
import { Button, Icon, ModalBody, ModalFooter } from 'design-react-kit';
import Modal from '../modals';
import withModalState from '../../../hoc/withModalState';
import {
  closeModal,
  ModalPayloadI,
} from '../../../redux/features/modal/modalSlice';
import SearchBar from '../../SearchBar/searchBar';
import clsx from 'clsx';
import './genericModal.scss';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useDispatch } from 'react-redux';

const genericId = 'genericModal';

export interface CallToAction {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}

export interface GenericModalI {
  closable?: boolean;
  description?: string | undefined;
  footer?: ReactChild;
  id?: string;
  onClose?: () => void;
  payload?: ModalPayloadI | undefined;
  primaryCTA?: CallToAction | undefined;
  secondaryCTA?: CallToAction | undefined;
  tertiaryCTA?: CallToAction | null;
  title?: string | undefined;
  centerButtons?: boolean;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  noSpaceAfterTitle?: boolean;
  noPaddingPrimary?: boolean;
  noPaddingSecondary?: boolean;
  withIcon?: boolean;
  icon?: string;
  iconColor?: string;
  bigIcon?: boolean;
  isRoleManaging?: boolean;
  isSurveyOnline?: boolean;
  isSuccesModal?: boolean;
  isUserRole?: boolean;
  darkTitle?: boolean;
  isRocketChatModal?: boolean;
  subtitle?:ReactNode;
}

const GenericModal: React.FC<GenericModalI> = (props) => {
  const {
    children,
    description,
    footer,
    id = genericId,
    onClose,
    payload,
    primaryCTA,
    secondaryCTA,
    tertiaryCTA,
    title,
    centerButtons,
    hasSearch,
    searchPlaceholder = 'Search',
    noSpaceAfterTitle = false,
    noPaddingPrimary = false,
    noPaddingSecondary = false,
    withIcon = false,
    icon = '',
    isRoleManaging = false,
    iconColor = '',
    bigIcon = false,
    isSurveyOnline = false,
    isSuccesModal = false,
    isUserRole = false,
    //darkTitle = false,
    isRocketChatModal = false,
    subtitle,
  } = props;

  const handleAction = (action: 'primary' | 'secondary' | 'tertiary') => {
    switch (action) {
      case 'primary': {
        if (primaryCTA?.onClick) primaryCTA.onClick();
        break;
      }
      case 'secondary': {
        if (secondaryCTA?.onClick) secondaryCTA.onClick();
        if (onClose) onClose();
        break;
      }
      case 'tertiary': {
        if (tertiaryCTA?.onClick) {
          tertiaryCTA.onClick();
          return;
        }
        if (onClose) onClose();
        break;
      }
    }
  };

  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  return (
    <Modal
      id={id}
      {...props}
      isRoleManaging={isRoleManaging}
      isUserRole={isUserRole}
      isRocketChatModal={isRocketChatModal}
    >
      {withIcon && icon ? (
        <div
          className={clsx(
            'd-flex',
            'flex-column',
            'justify-content-around',
            'align-items-center',
            isRoleManaging && device.mediaIsPhone ? 'px-2' : 'px-5'
          )}
        >
          <div
            className={clsx(
              'icon-container',
              isSuccesModal && 'bg-white',
              'p-3',
              'd-flex',
              'align-items-center',
              isSurveyOnline && 'mt-5 mb-4'
            )}
          >
            <Icon
              icon={icon}
              style={{
                width: bigIcon ? '60px' : isSuccesModal ? '150px' : '50px',
                height: isSuccesModal ? '150px' : '80px',
              }}
              color={iconColor}
              className='my-0 mx-3 pl-1'
            />
          </div>
        </div>
      ) : (
        <button className='hidden-btn' aria-label='modale' />
      )}
      <>
        {isRocketChatModal && (
          <Button
            onClick={() => dispatch(closeModal())}
            className='close-button align-self-end'
            aria-label='Chiudi modale'
          >
            <Icon
              color='primary'
              icon='it-close-big'
              size='sm'
              aria-label='chiudi modale'
              aria-hidden
            />
          </Button>
        )}
        {title || payload?.title ? (
          <div
            className={clsx(
              'modal-header-container',
              !noSpaceAfterTitle && 'mb-4',
              noSpaceAfterTitle && 'pb-0 mb-0',
              withIcon ? 'mt-1 pt-1' : isRocketChatModal ? '' : 'mt-4 pt-3'
            )}
          >
            <p
              className={clsx(
                'font-weight-semibold',
                isRoleManaging
                  ? 'primary-color-a10 h3 pb-4'
                  : 'primary-color h4',
                'my-auto',
                //darkTitle && 'primary-color-a10'
              )}
            >
              {title || payload?.title}
            </p>
          </div>
        ) : (
          <button className='hidden-btn' aria-label='header della modale' />
        )}
        {subtitle && (
          <div className={clsx('text-center', 'text-primary', 'mb-4')}>
            {subtitle}
          </div>
        )}
      </>
      {hasSearch || description || payload?.description || children ? (
        <ModalBody
          className="p-0"
          style={{ maxHeight: isRocketChatModal ? '70vh' : '' }}
        >
          {hasSearch ? (
            //
            <div className="row mx-5">
              <div className="col-12">
                <SearchBar
                  autocomplete={false}
                  onSubmit={() => console.log('ricerca modale')}
                  placeholder={searchPlaceholder}
                  isClearable
                  id="search-generic-modal"
                />
              </div>
            </div>
          ) : null}
          {description || payload?.description ? (
            <p
              className={clsx(
                isSurveyOnline && 'text-muted text-center h5',
                'mx-auto'
              )}
            >
              {description || payload?.description}
            </p>
          ) : null}
          {children}
        </ModalBody>
      ) : (
        <button className="hidden-btn" aria-label="contenuto della modale" />
      )}

      {footer || primaryCTA || secondaryCTA ? (
        <ModalFooter
          className={clsx(
            centerButtons
              ? 'd-flex justify-content-center'
              : device.mediaIsPhone
              ? 'd-flex flex-row justify-content-center'
              : tertiaryCTA
              ? 'd-flex flex-row justify-content-between'
              : ''
          )}
        >
          {footer}
          {tertiaryCTA ? (
            <div className='d-flex flex-row justify-content-start'>
              <Button
                {...tertiaryCTA}
                color='secondary'
                className={clsx(
                  device.mediaIsPhone ? 'cta-button' : 'mr-2 cta-button',
                  device.mediaIsPhone && noPaddingSecondary && 'pt-0'
                )}
                onClick={() => handleAction('tertiary')}
                size='xs'
                aria-label={tertiaryCTA.label}
              >
                {tertiaryCTA.label}
              </Button>
            </div>
          ) : (
            <button className='hidden-btn' aria-label='footer della modale' />
          )}
          {primaryCTA || secondaryCTA ? (
            <div
              className={clsx(
                device.mediaIsPhone
                  ? 'd-flex flex-column align-items-center'
                  : 'd-flex flex-row justify-content-end'
              )}
            >
              {secondaryCTA ? (
                <Button
                  {...secondaryCTA}
                  color='secondary'
                  className={clsx(
                    device.mediaIsPhone ? 'cta-button mb-2' : 'mr-2 cta-button',
                    device.mediaIsPhone && noPaddingSecondary && 'pt-0'
                  )}
                  onClick={() => handleAction('secondary')}
                  size='xs'
                  aria-label={secondaryCTA.label}
                >
                  {secondaryCTA.label}
                </Button>
              ) : (
                <button
                  className='hidden-btn'
                  aria-label='footer della modale'
                />
              )}
              {primaryCTA ? (
                <Button
                  {...primaryCTA}
                  className={clsx(
                    device.mediaIsPhone ? 'cta-button' : 'cta-button',
                    device.mediaIsPhone && noPaddingPrimary && 'pt-0'
                  )}
                  color='primary'
                  onClick={() => handleAction('primary')}
                  size='xs'
                  aria-label={primaryCTA.label}
                >
                  {primaryCTA.label}
                </Button>
              ) : (
                <button
                  className='hidden-btn'
                  aria-label='footer della modale'
                />
              )}
            </div>
          ) : (
            <button className='hidden-btn' aria-label='footer della modale' />
          )}
        </ModalFooter>
      ) : (
        <button className='hidden-btn' aria-label='footer della modale' />
      )}
    </Modal>
  );
};

// GenericModal.id = id;

export default withModalState(GenericModal);
