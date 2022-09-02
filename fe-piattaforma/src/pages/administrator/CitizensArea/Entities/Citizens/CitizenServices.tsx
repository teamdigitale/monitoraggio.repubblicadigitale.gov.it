import React, { useEffect, useState } from 'react';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import clsx from 'clsx';
import { StatusChip, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { ServizioCittadinoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import { useNavigate } from 'react-router-dom';

const TableHeadingEntities: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nomeServizio',
  },
  {
    label: 'Facilitatore',
    field: 'nomeCompletoFacilitatore',
  },
  {
    label: 'Stato questionario',
    field: 'statoQuestionario',
  },
];

const CitizenServices: React.FC<{
  servizi: ServizioCittadinoI[];
}> = ({ servizi }) => {
  const navigate = useNavigate();

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEntities,
      (servizi || []).map((td) => ({
        idServizio: td.idServizio || '',
        nomeServizio: td.nomeServizio || '',
        nomeCompletoFacilitatore: td.nomeCompletoFacilitatore || '',
        statoQuestionario: (
          <StatusChip
            status={td.statoQuestionario}
            rowTableId={td.idServizio}
          />
        ),
        idQuestionarioCompilato: td.idQuestionarioCompilato || '',
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
  }, [servizi]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/servizi/${
          typeof td !== 'string' ? td.idServizio : td
        }/info`
      );
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
          <h1 className='h4 primary-color-b1'>Servizi</h1>
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

export default CitizenServices;
