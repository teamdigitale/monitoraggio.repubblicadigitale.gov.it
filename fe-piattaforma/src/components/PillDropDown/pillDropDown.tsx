import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
  LinkListItem,
} from 'design-react-kit';

export interface PageTypeI {
  isDocument?: boolean;
  isNotifications?: boolean;
  onChange?: ({ label, value }: { label: string; value: string }) => void;
}

const pillDropdownOptions = [
  {
    label: 'Più recenti',
    value: 'created',
  },
  {
    label: 'Più popolari',
    value: 'likes',
  },
  {
    label: 'Più letti',
    value: 'views',
  },
  {
    label: 'Più commentati',
    value: 'comments',
  },
];

const pillDropdownOptionsDocument = [
  {
    label: 'Più recenti',
    value: 'created',
  },
  {
    label: 'Più scaricati',
    value: 'downloads',
  },
  {
    label: 'Più commentati',
    value: 'comments',
  },
];

const pillDropdownOptionsNotification = [
  {
    label: 'Più recenti',
    value: 'created_desc',
  },
  {
    label: 'Meno recenti',
    value: 'created_asc',
  },
];

const PillDropDown: React.FC<PageTypeI> = (props) => {
  const { isDocument, isNotifications = false, onChange = () => ({}) } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<{ label: string; value: string }>(
    pillDropdownOptions[0]
  );

  useEffect(() => {
    if (onChange) onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Dropdown
      className={clsx(
        'comment-container__comment-dropdown',
        'd-flex',
        'flex-row',
        'align-items-center',
        'mt-4'
      )}
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      <div>
        <p className='text-nowrap'> Ordina per: </p>
      </div>
      <DropdownToggle caret className='bg-transparent shadow-none'>
        <div className={clsx('d-flex', 'flex-row', 'align-items-center')}>
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'justify-content-around',
              'align-items-center',
              'border',
              'rounded-pill'
            )}
          >
            <span className='text-secondary pl-2 text-nowrap'>
              {selected?.label}
            </span>
            <Icon
              icon='it-arrow-down-triangle'
              color='secondary'
              className='pl-2'
            />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu role='menu' tag='ul' className='py-0'>
        <LinkList role='none'>
          {isDocument
            ? pillDropdownOptionsDocument.map((item, index) => (
                <div key={index}>
                  <li role='none' onClick={() => setIsOpen(!isOpen)}>
                    <Button
                      className='text-secondary'
                      role='menuitem'
                      onClick={() => setSelected(item)}
                    >
                      <div
                        className={clsx(
                          'd-flex',
                          'flex-row',
                          'justify-content-start',
                          'align-items-center'
                        )}
                      >
                        <div
                          className={clsx(
                            selected?.value === item.value &&
                              'font-weight-bolder'
                          )}
                        >
                          {item.label}
                        </div>
                      </div>
                    </Button>
                  </li>
                  <LinkListItem divider role='menuitem' aria-hidden={true} />
                </div>
              ))
            : isNotifications
            ? pillDropdownOptionsNotification.map((item, ind) => (
                <div key={ind}>
                  <li role='none' onClick={() => setIsOpen(!isOpen)}>
                    <Button
                      className='text-secondary'
                      role='menuitem'
                      onClick={() => setSelected(item)}
                    >
                      <div
                        className={clsx(
                          'd-flex',
                          'flex-row',
                          'justify-content-start',
                          'align-items-center'
                        )}
                      >
                        <div
                          className={clsx(
                            selected?.value === item.value &&
                              'font-weight-bolder'
                          )}
                        >
                          {item.label}
                        </div>
                      </div>
                    </Button>
                  </li>
                  <LinkListItem divider role='menuitem' aria-hidden={true} />
                </div>
              ))
            : pillDropdownOptions.map((item, i) => (
                <div key={i}>
                  <li role='none' onClick={() => setIsOpen(!isOpen)}>
                    <Button
                      className='text-secondary'
                      role='menuitem'
                      onClick={() => setSelected(item)}
                    >
                      <div
                        className={clsx(
                          'd-flex',
                          'flex-row',
                          'justify-content-start',
                          'align-items-center'
                        )}
                      >
                        <div
                          className={clsx(
                            selected?.value === item.value &&
                              'font-weight-bolder'
                          )}
                        >
                          {item.label}
                        </div>
                      </div>
                    </Button>
                  </li>
                  <LinkListItem divider role='menuitem' aria-hidden={true} />
                </div>
              ))}
        </LinkList>
      </DropdownMenu>
    </Dropdown>
  );
};

export default PillDropDown;
