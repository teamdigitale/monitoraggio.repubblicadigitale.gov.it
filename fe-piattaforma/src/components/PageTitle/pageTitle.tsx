import clsx from 'clsx';
import { Container } from 'design-react-kit';
import React, { memo } from 'react';
import './pageTitle.scss';

interface BreadcrumbI {
  label?: string;
  url?: string;
}
export interface PageTitleI {
  breadcrumb?: BreadcrumbI[];
  title?: string;
  hasBackground?: boolean;
}

const PageTitle: React.FC<PageTitleI> = (props) => {
  const { hasBackground, title } = props;

  return (
    <div className={clsx('page-title', hasBackground && 'lightgrey-bg-a1')}>
      <Container className='mt-3'>
        <div className='d-flex flex-row justify-content-between align-items-center'>
          {title && <h1 className='h2 py-2 mb-2 primary-color-a9'>{title}</h1>}
        </div>
      </Container>
    </div>
  );
};

export default memo(PageTitle);
