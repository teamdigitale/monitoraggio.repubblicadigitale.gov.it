import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React from 'react';
import './cardDocument.scss';

interface PublishingAuthorityI {
  authority?: string | undefined;
}

const PublishingAuthority: React.FC<PublishingAuthorityI> = ({ authority }) => {
  return (
    <div className='d-flex align-items-center'>
      <Icon icon='it-pa' fill='#2578CB' aria-label='Editore' aria-hidden />
      <p
        className={clsx(
          'document-card-container__authority',
          'ml-2',
          'text-serif',
          'font-italic',
          'font-weight-bold'
        )}
      >
        {authority}
      </p>
    </div>
  );
};

export default PublishingAuthority;
