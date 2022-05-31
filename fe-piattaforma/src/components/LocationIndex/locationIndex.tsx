import React, { useState } from 'react';
import { Button, Collapse, Icon, LinkList } from 'design-react-kit';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface subRoute {
  label: string;
  path: string;
}

interface LocationIndexProps {
  title: string;
  routes: subRoute[] | undefined;
}

const LocationIndex: React.FC<LocationIndexProps> = ({ routes, title }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);

  const expanded = {
    'aria-expanded': true,
  };
  return (
    <div
      className='right-icon d-flex justify-content-between  flex-column'
      {...(collapseOpen ? expanded : {})}
    >
      <Button
        className={clsx(
          'primary-color d-flex',
          'd-flex',
          'justify-content-center',
          'align-item-center'
        )}
        onClick={() => setCollapseOpen(!collapseOpen)}
      >
        <span className='h5 font-weight-semibold'>{title}</span>

        <Icon
          className='right'
          icon='it-expand'
          color='primary'
          aria-hidden
          aria-label='freccia destra'
          size='sm'
        />
      </Button>
      <Collapse isOpen={collapseOpen}>
        <LinkList sublist className='mt-3'>
          {routes &&
            routes.map((sub, index) => (
              <li key={`sub-${index}`} className='my-2 px-3 list-unstyled'>
                <Link
                  className='ml-2 font-weight-normal text-decoration-none'
                  to={sub.path}
                  onClick={() => setCollapseOpen(!collapseOpen)}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
        </LinkList>
      </Collapse>
    </div>
  );
};

export default LocationIndex;
