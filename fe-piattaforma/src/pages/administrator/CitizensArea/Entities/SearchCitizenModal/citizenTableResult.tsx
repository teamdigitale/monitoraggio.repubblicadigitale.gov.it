import React, { useEffect, useState } from 'react';
import { CittadinoInfoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { Table } from '../../../../../components';
import { TableHeadingSearchResults } from '../../utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';

interface CitizenTableResultI {
  data: CittadinoInfoI[];
  onCitizenSelected?: (citizen: TableRowI | string) => void;
}

const CitizenTableResult: React.FC<CitizenTableResultI> = ({
  data,
  onCitizenSelected,
}) => {
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

  const onActionCheck: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (onCitizenSelected) onCitizenSelected(td);
    },
  };

  return (
    <Table
      {...tableValues}
      id='table'
      onActionClick={onActionClick}
      withActions
      onActionRadio={onActionCheck}
    />
  );
};

export default CitizenTableResult;
