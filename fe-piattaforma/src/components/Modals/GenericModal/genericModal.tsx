import React, { ReactChild } from 'react';
import { Button, ModalBody, ModalFooter } from 'design-react-kit';
import Modal from '../modals';
import withModalState from '../../../hoc/withModalState';
import { ModalPayloadI } from '../../../redux/features/modal/modalSlice';
import SearchBar from '../../SearchBar/searchBar';
import clsx from 'clsx';
import './genericModal.scss';
import { useAppSelector } from '../../../redux/hooks';
import { selectDevice } from '../../../redux/features/app/appSlice';

const genericId = 'genericModal';

interface CallToAction {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}

export interface GenericModalI {
  description?: string;
  footer?: ReactChild;
  id?: string;
  onClose?: () => void;
  payload?: ModalPayloadI | undefined;
  primaryCTA?: CallToAction;
  secondaryCTA?: CallToAction;
  tertiaryCTA?: CallToAction | null;
  title?: string | undefined;
  centerButtons?: boolean;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  noSpaceAfterTitle?: boolean;
  noPaddingPrimary?: boolean;
  noPaddingSecondary?: boolean;
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

  return (
    <Modal id={id} {...props}>
      <div
        className={clsx(
          'modal-header-container',
          !noSpaceAfterTitle && 'mb-4',
          noSpaceAfterTitle && 'pb-0 mb-0',
          'mt-4',
          'pt-3'
        )}
      >
        <p className='h5 font-weight-semibold primary-color my-auto'>
          {title || payload?.title}
        </p>
      </div>
      <ModalBody className='h-50 p-0'>
        {hasSearch && (
          <SearchBar
            autocomplete={false}
            onSubmit={() => console.log('ricerca modale')}
            placeholder={searchPlaceholder}
            isClearable
            id='search-generic-modal'
          />
        )}
        {description || payload?.description}
        {children}
      </ModalBody>
      <ModalFooter
        className={
          centerButtons
            ? 'd-flex justify-content-center'
            : device.mediaIsPhone
            ? 'd-flex flex-row justify-content-center'
            : ''
        }
      >
        {footer || primaryCTA || secondaryCTA ? (
          <>
            {footer}
            {tertiaryCTA ? (
              <Button
                {...tertiaryCTA}
                color='secondary'
                className={clsx(
                  device.mediaIsPhone ? 'cta-button' : 'mr-2 cta-button',
                  device.mediaIsPhone && noPaddingSecondary && 'pt-0'
                )}
                onClick={() => handleAction('tertiary')}
                size='xs'
              >
                {tertiaryCTA.label}
              </Button>
            ) : null}
            {secondaryCTA ? (
              <Button
                {...secondaryCTA}
                color='secondary'
                className={clsx(
                  device.mediaIsPhone ? 'cta-button' : 'mr-2 cta-button',
                  device.mediaIsPhone && noPaddingSecondary && 'pt-0'
                )}
                onClick={() => handleAction('secondary')}
                size='xs'
              >
                {secondaryCTA.label}
              </Button>
            ) : null}
            {primaryCTA ? (
              <Button
                {...primaryCTA}
                className={clsx(
                  device.mediaIsPhone ? 'cta-button' : 'ml-2 cta-button',
                  device.mediaIsPhone && noPaddingPrimary && 'pt-0'
                )}
                color='primary'
                onClick={() => handleAction('primary')}
                size='xs'
              >
                {primaryCTA.label}
              </Button>
            ) : null}
          </>
        ) : null}
      </ModalFooter>
    </Modal>
  );
};

// GenericModal.id = id;

export default withModalState(GenericModal);
