import React from 'react';
import {
  Breadcrumb as BreadcrumbKit,
  BreadcrumbItem,
  Container,
} from 'design-react-kit';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBreadcrumb } from '../../redux/features/app/appSlice';

export interface BreadcrumbI {
  label?: string;
  url?: string;
  link: boolean;
}

const Breadcrumb = () => {
  const breadcrumbList = useSelector(selectBreadcrumb);

  return (
    <Container className='mt-3 pl-0'>
      <BreadcrumbKit className='mt-4 pt-4'>
        {breadcrumbList.map((item, index) => (
          <BreadcrumbItem key={index} className='mb-2'>
            {item.link && item.url ? (
              <NavLink
                to={item.url}
                className='primary-color font-weight-semibold text-decoration-underline'
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                className={clsx(index === 0 && 'font-weight-semibold pl-2')}
                style={{
                  borderLeft: index === 0 ? '4px solid #0073E5' : 'none',
                }}
              >
                {item.label}
              </span>
            )}
            {index < breadcrumbList.length - 1 && (
              <span className='separator'>/</span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbKit>
    </Container>
  );
};

export default Breadcrumb;
