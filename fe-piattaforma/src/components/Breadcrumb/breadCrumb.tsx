import React from 'react';
import {
  Breadcrumb as BreadcrumbKit,
  BreadcrumbItem,
  Container,
} from 'design-react-kit';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

export interface BreadcrumbI {
  label?: string;
  url?: string;
}
export interface BreadcrumbProps {
  breadcrumbArray: BreadcrumbI[];
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  // const { hash } = location;

  return (
    <Container className='mt-3'>
      <BreadcrumbKit className='mt-0 pt-3'>
        {pathnames.map((item, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

          const mainSection = [
            'programmi',
            'progetti',
            'enti',
            'utenti',
            'questionari',
          ];

          return (
            <BreadcrumbItem key={index}>
              <NavLink
                to={routeTo || ''}
                className={clsx(
                  index === 0 && 'pl-3 font-weight-bold text-secondary',
                  (pathnames?.length > 2 && index === 1) ||
                    mainSection.includes(item)
                    ? 'primary-color'
                    : 'text-secondary',
                  'text-capitalize'
                )}
                style={{
                  borderLeft: index === 0 ? '5px solid #06c' : 'none',
                  textDecoration:
                    index === 1 ||
                    (mainSection.includes(item) && pathnames?.length > 2)
                      ? 'underline'
                      : 'none',
                }}
              >
                {item.replace(/-/g, ' ')}
              </NavLink>
              {index < pathnames?.length - 1 ? (
                <span className='separator'>/</span>
              ) : null}
            </BreadcrumbItem>
          );
        })}
        {/*hash && hash.split('#')?.[1] ? (
          <>
            {' '}
            <span className='separator'>/</span>{' '}
            <NavLink to={`#${hash.split('#')?.[1]}`} className='pl-2 font-weight-bold text-secondary primary-color'>
              {hash.split('#')?.[1]}
            </NavLink>
          </>
        ) : null*/}
      </BreadcrumbKit>
    </Container>
  );
};

export default Breadcrumb;
