import React, { useState } from 'react';
import { Button } from 'design-react-kit';
import { Input } from '../../../../../components';
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

  const handleAccessoScheda = () => {
    if (result) {
      dispatch(setSchedaCittadino(result));
      onAccessoScheda?.(result.idCittadino);
    }
  };

  const handleDownloadScheda = () => {
    if (result) {
      onDownloadScheda?.(result);
    }
  };

  return (
    <div>
      <div className='row mt-5 mb-5' style={{ alignItems: 'flex-end' }}>
        <div className='col-12 col-lg-8'>
          <Input
            id='ricerca-cittadino-input'
            field='ricerca-cittadino'
            label='Codice fiscale / ID numerico e ID alfanumerico'
            placeholder='Inserisci codice fiscale, ID numerico o ID alfanumerico'
            value={searchValue}
            onInputChange={(value) => setSearchValue(String(value ?? ''))}
            col='col-12'
          />
        </div>
        <div
          className={clsx(
            'd-flex',
            'col-12',
            'col-lg-4',
            'justify-content-start',
            'justify-content-lg-end'
          )}
          style={{ paddingBottom: '16px' }}
        >
          <Button
            color='primary'
            className='mr-3'
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
        <div className='mb-5'>
          <div className='alert alert-warning' role='alert'>
            {errorMessage}
          </div>
        </div>
      )}

      {hasSearched && result && (
        <div className='mb-5'>
          <div
            className={clsx(
              'p-4',
              'rounded',
              'border',
              'border-primary',
              'bg-white'
            )}
          >
            <div className='row mb-2'>
              <div className='col-6'>
                <strong>Tipologia servizio:</strong> {result.tipologiaServizio}
              </div>
              <div className='col-6'>
                <strong>Nome servizio:</strong> {result.nomeServizio}
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-6'>
                <strong>Data primo servizio:</strong> {result.dataServizio}
              </div>
              <div className='col-6'>
                <strong>Gestore:</strong> {result.nomeGestore}
              </div>
            </div>
          </div>
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
              Accesso scheda
            </Button>
            <Button color='primary' onClick={handleDownloadScheda}>
              Download scheda
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RicercaSingola;
