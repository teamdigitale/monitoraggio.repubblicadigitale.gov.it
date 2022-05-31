import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from 'design-react-kit';
import './tabGroup.scss';

interface ArrayTabsI {
  label: string;
  id: string;
  path?: string;
}

interface TabGroupI {
  arrayTabs: ArrayTabsI[];
  activeTab?: string | undefined;
  setActiveTab?: (id: string) => void;
}

const TabGroup: React.FC<TabGroupI> = (props) => {
  const { arrayTabs, activeTab, setActiveTab } = props;

  return (
    <div className='tab-group-container container'>
      <ul
        className='d-flex align-items-center justify-content-around m-0 mb-3 border-bottom border-primary'
        role='menu'
      >
        {arrayTabs?.length &&
          arrayTabs.map((li) => (
            <li key={li.id} role='none'>
              <div className='d-flex justify-content-center'>
                {li.path ? (
                  <NavLink
                    to={li.path}
                    className='primary-color-b1 py-2'
                    role='menuitem'
                  >
                    {li.label}
                  </NavLink>
                ) : (
                  <Button
                    onClick={() => (setActiveTab ? setActiveTab(li.id) : null)}
                    className='primary-color-b1'
                    role='menuitem'
                  >
                    {li.label}
                  </Button>
                )}
              </div>
              <div
                className={clsx(
                  activeTab === li.id &&
                    'primary-bg-b1 tab-group-container__tab-bar',
                  activeTab !== li.id &&
                    'bg-transparent tab-group-container__tab-bar'
                )}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default memo(TabGroup);
