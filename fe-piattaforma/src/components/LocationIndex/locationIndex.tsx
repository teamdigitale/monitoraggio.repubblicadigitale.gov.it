import React, { useState } from 'react';
import { Button, Collapse, Icon, LinkList } from 'design-react-kit';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import useGuard from '../../hooks/guard';
import { RolePermissionI } from '../../redux/features/roles/rolesSlice';

interface subRoute {
  label: string;
  path: string;
  visible?: RolePermissionI[];
}

interface LocationIndexProps {
  title: string;
  routes: subRoute[] | undefined;
}

const LocationIndex: React.FC<LocationIndexProps> = ({ routes, title }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { hasUserPermission } = useGuard();

  const expanded = {
    'aria-expanded': true,
  };
  return (
    <div
      className={clsx(
        'right-icon',
        'd-flex',
        'justify-content-between',
        'flex-column'
      )}
      {...(collapseOpen ? expanded : {})}
    >
      <Button
        className={clsx(
          'primary-color d-flex',
          'd-flex',
          'justify-content-center',
          'align-items-center'
        )}
        onClick={() => setCollapseOpen(!collapseOpen)}
      >
        <span className='h5 font-weight-semibold mb-0'>{title}</span>

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
            routes
              .filter(({ visible = ['hidden'] }) => hasUserPermission(visible))
              .map((sub, index) => (
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
