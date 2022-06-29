import React from 'react';
import { Icon, Table as TableKit, Button } from 'design-react-kit';
import clsx from 'clsx';
import { TableI } from '../table';
import { CRUDActionTypes } from '../../../utils/common';

const TableDesktop: React.FC<TableI> = (props) => {
  const {
    className,
    heading = [],
    id = 'table',
    onActionClick,
    onCellClick = () => ({}),
    onRowClick = () => ({}),
    values = [],
    withActions = false,
    rolesTable = false,
  } = props;

  return (
    <TableKit
      className={clsx('table-container', className)}
      id={id}
      tabIndex={-1}
    >
      {heading?.length ? (
        <thead>
          <tr className='lightgrey-bg-c1 neutral-2-color-b4'>
            {heading.map((th) => (
              <th
                key={th.label}
                scope='col'
                className={clsx(
                  `th-${th.size || 'auto'}`,
                  'table-container__intestazione'
                )}
              >
                <span>{th.label.toUpperCase()}</span>
                {/* <Icon           // TODO: decommentare quando aggiungono il sort
                  icon='it-arrow-down-triangle'
                  color='secondary'
                  className='mb-2'
                /> */}
              </th>
            ))}
            {withActions && (
              <th
                scope='col'
                className={rolesTable ? 'th-actions-roles' : 'th-actions'}
              />
            )}
          </tr>
        </thead>
      ) : null}
      {values?.length ? (
        <tbody>
          {values.map((td, i) => (
            <tr
              key={`tr-${i}`}
              onClick={() => onRowClick(td)}
              className='primary-color-a6 '
            >
              {heading.map((th, j) => (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-services-have-key-services
                <td
                  key={`td-${i}-${j}`}
                  onClick={() => onCellClick(th.field, td)}
                  className='py-4'
                >
                  {td[th.field]}
                </td>
              ))}
              {onActionClick ? (
                <td>
                  <div
                    className={clsx(
                      'd-flex',
                      'justify-content-end',
                      'align-content-center',
                      'mt-1'
                    )}
                  >
                    {onActionClick[CRUDActionTypes.INFO] ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.INFO](td)}
                        className='mr-2 p-0'
                        aria-label='Informazioni'
                      >
                        <Icon
                          icon='it-info-circle'
                          color='primary'
                          size='sm'
                          aria-label='Informazioni'
                        />
                      </Button>
                    ) : null}
                    {onActionClick[CRUDActionTypes.CREATE] ? (
                      <Button
                        onClick={() =>
                          onActionClick[CRUDActionTypes.CREATE](td)
                        }
                        className='mr-2 p-0'
                        aria-label='Aggiungi nuovo'
                      >
                        <Icon
                          icon='it-plus-circle'
                          color='primary'
                          size='sm'
                          aria-label='Aggiungi nuovo'
                        />
                      </Button>
                    ) : null}
                    {onActionClick[CRUDActionTypes.EDIT] ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.EDIT](td)}
                        className='mr-2 p-0'
                        aria-label='Modifica riga'
                      >
                        <Icon
                          icon='it-pencil'
                          color='primary'
                          size='sm'
                          aria-label='Modifica riga'
                        />
                      </Button>
                    ) : null}
                    {onActionClick[CRUDActionTypes.DELETE] ? (
                      <Button
                        onClick={() =>
                          onActionClick[CRUDActionTypes.DELETE](td)
                        }
                        className='mr-2 p-0'
                        aria-label='Elimina elemento riga'
                      >
                        <Icon
                          icon='it-delete'
                          color='primary'
                          size='sm'
                          aria-label='Elimina elemento riga'
                        />
                      </Button>
                    ) : null}
                    {onActionClick[CRUDActionTypes.CLONE] ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.CLONE](td)}
                        className='mr-2 p-0'
                      >
                        <Icon
                          icon='it-copy'
                          color='primary'
                          size='sm'
                          aria-label='Copia elemento riga'
                        />
                      </Button>
                    ) : null}
                    {onActionClick[CRUDActionTypes.VIEW] ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.VIEW](td)}
                        className='p-0'
                        aria-label='Pulsante selezione riga'
                      >
                        <Icon
                          icon='it-chevron-right'
                          color='primary'
                          size='sm'
                          aria-label='Vedi dettaglio elemento riga'
                          focusable={false}
                        />
                      </Button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      ) : null}
    </TableKit>
  );
};

export default TableDesktop;
