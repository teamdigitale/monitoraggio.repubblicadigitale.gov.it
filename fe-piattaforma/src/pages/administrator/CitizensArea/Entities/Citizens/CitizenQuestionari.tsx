import React, { useEffect, useState } from 'react';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import { Button, Icon } from 'design-react-kit';
import clsx from 'clsx';
import { StatusChip, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';

const TableHeadingEntities: TableHeadingI[] = [
  {
    label: 'ID',
    field: 'id',
    size: 'small',
  },
  {
    label: 'Tipologia',
    field: 'type',
  },
  {
    label: 'Facilitatore',
    field: 'facilitatore',
  },
  {
    label: 'Data ultima modifica',
    field: 'lastChange',
  },
  {
    label: 'Stato',
    field: 'status',
  },
];

const CitizenQuestionari: React.FC<{
  questionari: {
    id: number;
    type: string;
    facilitatore: string;
    lastChange: string;
    status: string;
  }[];
}> = ({ questionari }) => {
  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEntities,
      questionari.map((td) => ({
        id: td.id,
        type: td.type,
        facilitatore: td.facilitatore,
        lastChange: td.lastChange,
        status: <StatusChip status={td.status} rowTableId={td.id} />,
      }))
    );
    return {
      ...table,
      values: table.values,
    };
  };
  const [tableValues, setTableValues] = useState(updateTableValues());
  useEffect(() => {
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionari]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      console.log('go to surveys', td);
    },
  };

  const device = useAppSelector(selectDevice);

  return (
    <>
      <div
        className={clsx(
          device.mediaIsPhone && 'flex-column',
          'd-flex',
          'justify-content-between',
          'mb-2'
        )}
      >
        <div>
          <h1 className='h4 primary-color-b1'>Questionari</h1>
        </div>
        <div>
          <Button
            className={clsx(
              'd-flex',
              'flex-row',
              'justify-content-center',
              'align-items-center',
              'text-nowrap'
            )}
            onClick={() => {
              console.log('compila nuovo surveys');
            }}
          >
            <Icon
              icon='it-plus-circle'
              size='sm'
              className='primary-color-b1 mr-2'
              aria-label='Nuovo questionario'
            />
            <span>Compila nuovo questionario</span>
          </Button>
        </div>
      </div>
      <Table
        {...tableValues}
        id='table'
        onActionClick={onActionClick}
        onCellClick={(field, row) => console.log(field, row)}
        withActions
      />
    </>
  );
};

export default CitizenQuestionari;
