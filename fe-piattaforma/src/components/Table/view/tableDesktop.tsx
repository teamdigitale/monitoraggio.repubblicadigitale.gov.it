import React, { useState } from 'react';
import {
  Icon,
  Table as TableKit,
  Button,
  FormGroup,
  Label,
} from 'design-react-kit';
import clsx from 'clsx';
import { TableI } from '../table';
import { CRUDActionTypes } from '../../../utils/common';
import Form from '../../Form/form';
import Input from '../../Form/input';
import EmptySection from '../../EmptySection/emptySection';

const TableDesktop: React.FC<TableI> = (props) => {
  const {
    className,
    heading = [],
    id = 'table',
    onActionClick,
    onRowClick = () => ({}),
    values = [],
    withActions = false,
    rolesTable = false,
    onActionRadio,
  } = props;
  const [rowChecked, setRowChecked] = useState<string>('');

  return values?.length ? (
    <TableKit
      className={clsx('table-container', className)}
      id={id}
      tabIndex={-1}
    >
      {heading?.length ? (
        <thead>
          <tr className='lightgrey-bg-a1 neutral-2-color-b4'>
            {onActionRadio && (
              <th
                scope='col'
                className={rolesTable ? 'th-actions-roles' : 'th-actions'}
              />
            )}
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
            <tr key={`tr-${i}`} onClick={() => onRowClick(td)}>
              {onActionRadio && (
                <td>
                  <Form>
                    <FormGroup check>
                      <Input
                        name='group'
                        type='radio'
                        id={`radio-${td.id}`}
                        checked={rowChecked === td.id}
                        withLabel={false}
                        onInputChange={() => {
                          setRowChecked(td.id.toString());
                          onActionRadio[CRUDActionTypes.SELECT](td);
                        }}
                      />
                      <Label
                        className='sr-only'
                        check
                        htmlFor={`radio-${td.id}`}
                      >
                        <span>{`Select Row`}</span>
                      </Label>
                    </FormGroup>
                  </Form>
                </td>
              )}
              {heading.map((th, j) => (
                <td key={`td-${i}-${j}`} className='py-4'>
                  {td[th.field]}
                </td>
              ))}
              {onActionClick ? (
                <td className='px-0'>
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
  ) : (
    <div className='d-flex flex-column align-items-center'>
      <div className='w-100 d-flex flex-row'>
        <TableKit
          className={clsx('table-container', className)}
          id={id}
          tabIndex={-1}
        >
          {heading?.length ? (
            <thead>
              <tr className='lightgrey-bg-a1 neutral-2-color-b4'>
                {onActionRadio && (
                  <th
                    scope='col'
                    className={rolesTable ? 'th-actions-roles' : 'th-actions'}
                  />
                )}
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
              </tr>
            </thead>
          ) : null}
        </TableKit>
      </div>
      <div className='mt-3 mb-5'>
        <EmptySection title='Questa sezione è vuota' subtitle='' />
      </div>
    </div>
  );
};

export default TableDesktop;
