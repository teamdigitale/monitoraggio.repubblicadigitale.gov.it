import React, { useEffect, useState } from 'react';
import { CittadinoInfoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import { newTable, TableRowI } from '../../../../../components/Table/table';
import { Table } from '../../../../../components';
import { TableHeadingSearchResults } from '../../utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectServices } from '../../../../../redux/features/administrativeArea/administrativeAreaSlice';

interface CitizenTableResultI {
  data: CittadinoInfoI[];
  onCitizenSelected?: (citizen: TableRowI | string) => void;
}

const CitizenTableResult: React.FC<CitizenTableResultI> = ({
  data,
  onCitizenSelected,
}) => {
  const citizensList = useAppSelector(selectServices)?.detail?.cittadini;

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingSearchResults,
      data.map((td) => ({
        nome: td.nome || '',
        cognome: td.cognome || '',
        codiceFiscale: td.codiceFiscale || '',
        id: td.idCittadino || '',
        isPresentInList:
          citizensList.cittadini?.filter(
            (cit) => cit.idCittadino === td.idCittadino
          )?.length > 0,
      }))
    );
    return {
      ...table,
    };
  };

  const [tableValues, setTableValues] = useState(updateTableValues());

  useEffect(() => {
    if (citizensList?.cittadini && data) {
      setTableValues(updateTableValues());
    }
  }, [data, citizensList]);

  const onActionCheck: CRUDActionsI = {
    [CRUDActionTypes.SELECT]: (td: TableRowI | string) => {
      if (onCitizenSelected) onCitizenSelected(td);
    },
  };

  return (
    <Table
      {...tableValues}
      id='table'
      onTooltipInfo={
        'Il cittadino è già presente nella tua lista "I miei cittadini"'
      }
      withActions
      onActionRadio={onActionCheck}
      citizenTable
    />
  );
};

export default CitizenTableResult;
