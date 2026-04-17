import React, { useState, useMemo } from 'react';
import { Button, Icon } from 'design-react-kit';
import Table, { newTable, TableHeadingI } from '../../../../../components/Table/table';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectRicercaSingola,
  resetRicercaSingola,
  setSchedaCittadino,
} from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import type { PrimoServizioCittadinoI } from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import { RicercaSingolaCittadino } from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniThunk';

const TableHeading: TableHeadingI[] = [
  { label: 'Intervento', field: 'intervento', size: 'medium' },
  { label: 'ID cittadino', field: 'idCittadino', size: 'medium' },
  { label: 'Programma', field: 'programma', size: 'medium' },
  { label: 'Data primo servizio', field: 'dataPrimoServizio', size: 'medium' },
];

interface RicercaSingolaProps {
  onAccessoScheda?: (idCittadino: number) => void;
  onDownloadScheda?: (cittadino: PrimoServizioCittadinoI) => void;
}

const RicercaSingola: React.FC<RicercaSingolaProps> = ({
  onAccessoScheda,
  onDownloadScheda,
}) => {
  const dispatch = useDispatch();
  const { result, hasSearched, errorMessage } =
    useAppSelector(selectRicercaSingola);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    dispatch(RicercaSingolaCittadino(searchValue.trim()));
  };

  const handleReset = () => {
    setSearchValue('');
    dispatch(resetRicercaSingola());
  };

  const tableValues = useMemo(() => {
    if (result.length === 0) return newTable(TableHeading, []);
    return newTable(
      TableHeading,
      result.map((r) => ({
        id: r.idCittadino,
        intervento: r.policyProgramma || '-',
        idCittadino: r.idCittadino,
        programma: r.nomeServizio || '-',
        dataPrimoServizio: r.dataServizio || '-',
      }))
    );
  }, [result]);

  const handleAccessoScheda = () => {
    if (result.length > 0) {
      dispatch(setSchedaCittadino(result[0]));
      onAccessoScheda?.(result[0].idCittadino);
    }
  };

  const handleDownloadScheda = () => {
    if (result.length > 0) {
      onDownloadScheda?.(result[0]);
    }
  };

  return (
    <div>
      <div className='row mb-5 align-items-center'>
        <div className='col-12 col-lg-9'>
          <input
            id='ricerca-cittadino-input'
            type='text'
            className='form-control ricerca-cittadino-input'
            placeholder="Inserisci il codice fiscale o il codice identificativo alfanumerico o l'ID del cittadino"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div
          className={clsx(
            'd-flex',
            'col-12',
            'col-lg-3',
            'justify-content-start',
            'justify-content-lg-end',
            'mt-3',
            'mt-lg-0'
          )}
        >
          <Button
            color='primary'
            className='mr-2'
            onClick={handleSearch}
            disabled={!searchValue.trim()}
          >
            Cerca
          </Button>
          <Button
            outline
            color='primary'
            onClick={handleReset}
            disabled={!searchValue && !hasSearched}
          >
            Annulla ricerca
          </Button>
        </div>
      </div>

      {hasSearched && errorMessage && (
        <div className='mb-5 pb-3'>
          <div className='alert alert-warning' role='alert'>
            {errorMessage}
          </div>
        </div>
      )}

      {hasSearched && result.length > 0 && (
        <div className='mb-5 pb-3' style={{ paddingLeft: '2px' }}>
          <Table
            {...tableValues}
            id='table-ricerca-singola'
            className='table-compact'
          />
          <div
            className={clsx(
              'd-flex',
              'justify-content-end',
              'align-items-center',
              'py-3'
            )}
          >
            <Button
              outline
              color='primary'
              className='mr-3'
              onClick={handleAccessoScheda}
            >
              Visualizza scheda
            </Button>
            <Button color='primary' onClick={handleDownloadScheda}>
              <Icon
                icon='it-download'
                color='white'
                size='sm'
                className='mr-2'
                aria-hidden
              />
              Scarica PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RicercaSingola;
