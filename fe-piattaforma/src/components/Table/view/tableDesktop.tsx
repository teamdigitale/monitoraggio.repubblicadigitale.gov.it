import React, { useState } from 'react';
import {
  Button,
  FormGroup,
  Icon,
  Label,
  Table as TableKit,
  UncontrolledTooltip,
} from 'design-react-kit';
import clsx from 'clsx';
import { TableI } from '../table';
import { CRUDActionTypes } from '../../../utils/common';
import Form from '../../Form/form';
import Input from '../../Form/input';
import EmptySection from '../../EmptySection/emptySection';
import { calculatePaginationBounds } from '../../../utils/pagination.utils';

const TableDesktop: React.FC<TableI> = (props) => {
  const {
    className,
    heading = [],
    id = 'table',
    onActionClick,
    onTooltipInfo,
    onRowClick = () => ({}),
    values = [],
    withActions = false,
    rolesTable = false,
    onActionRadio,
    totalCounter,
    pageNumber,
    citizenTable,
    pageSize,
    succesCSV,
  } = props;
  const [rowChecked, setRowChecked] = useState<string>('');
  const { displayItem } = calculatePaginationBounds(
    pageNumber,
    pageSize,
    totalCounter
  );

  return values?.length ? (
    <>
      <TableKit
        className={clsx('table-container', className)}
        id={id}
        tabIndex={-1}
      >
        {heading?.length ? (
          <thead>
            <tr className='bg-and-text-color'>
              {onActionRadio && (
                <th
                  scope='col'
                  className={rolesTable ? 'th-actions-roles' : 'th-actions'}
                />
              )}
              {heading.map((th) => (
                <th
                  key={th.field}
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
        <tbody>
          {values.map((td, i) => (
            <tr key={`tr-${i}`} onClick={() => onRowClick(td)}>
              {onActionRadio && (
                <td>
                  <Form id='form-table-dsk' showMandatory={false}>
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
                        {`Seleziona ${td?.nome || td?.label || td?.name}`}
                      </Label>
                    </FormGroup>
                  </Form>
                </td>
              )}
              {heading.map((th, j) => (
                <td key={`td-${i}-${j}`} className='py-4'>
                  {td[th.field] || '-'}
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
                    {(
                      td.actions
                        ? td.actions.toString().includes(CRUDActionTypes.INFO)
                        : onActionClick[CRUDActionTypes.INFO]
                    ) ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.INFO](td)}
                        className='mr-4 p-0'
                        aria-label='Informazioni'
                      >
                        <Icon
                          icon='it-info-circle'
                          color='primary'
                          size='sm'
                          aria-label='Informazioni'
                          aria-hidden
                        />
                      </Button>
                    ) : null}
                    {(
                      td.actions
                        ? td.actions.toString().includes(CRUDActionTypes.CREATE)
                        : onActionClick[CRUDActionTypes.CREATE]
                    ) ? (
                      <Button
                        onClick={() =>
                          onActionClick[CRUDActionTypes.CREATE](td)
                        }
                        className='mr-4 p-0'
                        aria-label='Aggiungi nuovo'
                      >
                        <Icon
                          icon='it-plus-circle'
                          color='primary'
                          size='sm'
                          aria-label='Aggiungi nuovo'
                          aria-hidden
                        />
                      </Button>
                    ) : null}
                    {(
                      td.actions
                        ? td.actions.toString().includes(CRUDActionTypes.EDIT)
                        : onActionClick[CRUDActionTypes.EDIT]
                    ) ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.EDIT](td)}
                        className='mr-4 p-0'
                        aria-label={`Modifica ${
                          td?.nome || td?.label || td?.name
                        }`}
                      >
                        <Icon
                          icon='it-pencil'
                          color='primary'
                          size='sm'
                          aria-label='Modifica'
                          aria-hidden
                        />
                      </Button>
                    ) : null}
                    {(
                      td.actions
                        ? td.actions.toString().includes(CRUDActionTypes.DELETE)
                        : onActionClick[CRUDActionTypes.DELETE]
                    ) ? (
                      <Button
                        onClick={() =>
                          onActionClick[CRUDActionTypes.DELETE](td)
                        }
                        className='mr-4 p-0'
                        aria-label={`Elimina ${
                          td?.nome || td?.label || td?.name
                        }`}
                      >
                        <Icon
                          icon='it-less-circle'
                          color='primary'
                          size='sm'
                          aria-label='Elimina'
                          aria-hidden
                        />
                      </Button>
                    ) : null}
                    {(
                      td.actions
                        ? td.actions.toString().includes(CRUDActionTypes.CLONE)
                        : onActionClick[CRUDActionTypes.CLONE]
                    ) ? (
                      <Button
                        onClick={() => onActionClick[CRUDActionTypes.CLONE](td)}
                        className='mr-4 p-0'
                        aria-label={`Clona ${
                          td?.nome || td?.label || td?.name
                        }`}
                      >
                        <Icon
                          icon='it-copy'
                          color='primary'
                          size='sm'
                          aria-label='Clona'
                          aria-hidden
                        />
                      </Button>
                    ) : null}
                    {(
                      td.actions
                        ? td.actions.toString().includes(CRUDActionTypes.VIEW)
                        : onActionClick[CRUDActionTypes.VIEW]
                    ) ? (
                      !td?.citizen || (td?.citizen && td?.associatoAUtente) ? (
                        <Button
                          onClick={() =>
                            onActionClick[CRUDActionTypes.VIEW](td)
                          }
                          className='p-0'
                          aria-label={`Vai al dettaglio di ${
                            td?.nome || td?.label || td?.name
                          }`}
                        >
                          <Icon
                            icon='it-chevron-right'
                            color='primary'
                            size='sm'
                            focusable={false}
                            aria-label='Vai al dettaglio'
                            aria-hidden
                          />
                        </Button>
                      ) : null
                    ) : null}
                  </div>
                </td>
              ) : null}
              {((onTooltipInfo || td?.onTooltipInfo) && td?.isPresentInList) ||
              td?.failedCSV ? (
                <td id={`tooltip-${td.id}-${i}`}>
                  <div className='d-inline-flex position-relative'>
                    <UncontrolledTooltip
                      placement='left'
                      target={`tooltip-${td.id}-${i}`}
                    >
                      {onTooltipInfo}
                      {td.onTooltipInfo}
                    </UncontrolledTooltip>
                    <Icon
                      icon='it-info-circle'
                      size='sm'
                      color='primary'
                      className='mt-2'
                      aria-label='Informazioni'
                      aria-hidden
                    />
                  </div>
                </td>
              ) : citizenTable || succesCSV ? (
                <td />
              ) : null}
            </tr>
          ))}
        </tbody>
      </TableKit>
      {totalCounter && pageNumber ? (
        <div className={clsx('text-right', 'total-counter-text-color')}>
          {displayItem}
        </div>
      ) : null}
    </>
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
              <tr className='bg-and-text-color'>
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
