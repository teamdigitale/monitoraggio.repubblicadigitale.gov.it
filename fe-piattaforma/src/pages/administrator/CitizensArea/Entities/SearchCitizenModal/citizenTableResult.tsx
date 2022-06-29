import React, { useEffect, useState } from 'react';
import { CittadinoInfoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { Table } from '../../../../../components';
import { TableHeadingSearchResults } from '../../utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';

interface CitizenTableResultI {
  data: CittadinoInfoI[];
}

const CitizenTableResult: React.FC<CitizenTableResultI> = ({ data }) => {
  const updateTableValues = () => {
    const table = newTable(
      TableHeadingSearchResults,
      data.map((td) => ({
        nome: td.nome || '',
        cognome: td.cognome || '',
        codiceFiscale: td.codiceFiscale || '',
      }))
    );
    return {
      ...table,
    };
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    setTableValues(updateTableValues());
  }, [data]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.INFO]: (td: TableRowI | string) => {
      console.log('info', td);
    },
  };

  return (
    <Table
      {...tableValues}
      id='table'
      onActionClick={onActionClick}
      withActions
    />
  );
};

export default CitizenTableResult;
