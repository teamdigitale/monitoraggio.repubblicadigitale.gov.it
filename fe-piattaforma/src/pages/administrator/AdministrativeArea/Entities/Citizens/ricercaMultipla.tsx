import React, { useState, useMemo } from 'react';
import { Button, Icon } from 'design-react-kit';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectRicercaMultipla,
  resetRicercaMultipla,
} from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import type { PrimoServizioCittadinoI, ScartoRicercaI } from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import { RicercaMultiplaCittadini } from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniThunk';

const MAX_RIGHE = 100;

interface RicercaMultiplaProps {
  onDownloadSchede?: (trovati: PrimoServizioCittadinoI[]) => void;
  onDownloadElencoScarti?: (
    nonTrovati: (ScartoRicercaI | string)[]
  ) => void;
}

const RicercaMultipla: React.FC<RicercaMultiplaProps> = ({
  onDownloadSchede,
  onDownloadElencoScarti,
}) => {
  const dispatch = useDispatch();
  const { result, hasSearched } = useAppSelector(selectRicercaMultipla);
  const [inputValue, setInputValue] = useState('');

  const righe = useMemo(() => {
    if (!inputValue.trim()) return [];
    return inputValue
      .split('\n')
      .map((r) => r.replace(/;+$/, '').trim())
      .filter((r) => r.length > 0);
  }, [inputValue]);

  const contatoreRighe = righe.length;
  const isOverLimit = contatoreRighe > MAX_RIGHE;

  const handleCaricaElenco = () => {
    if (contatoreRighe === 0 || isOverLimit) return;
    dispatch(RicercaMultiplaCittadini(righe));
  };

  const handleAnnulla = () => {
    setInputValue('');
    dispatch(resetRicercaMultipla());
  };

  return (
    <div>
      <p className='mb-4'>
        Inserisci l&apos;elenco dei codici identificativi alfanumerici dei
        cittadini da cercare, uno per riga, senza segni di punteggiatura. Puoi
        copiare e incollare direttamente un elenco.
      </p>

      <div className='d-flex mb-4'>
        <div className='flex-grow-1' style={{ paddingLeft: '2px' }}>
          <textarea
            className={clsx(
              'form-control',
              isOverLimit && 'border-danger'
            )}
            style={{ border: '1px solid #d9dadb', minHeight: '200px', resize: 'vertical' }}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (hasSearched) {
                dispatch(resetRicercaMultipla());
              }
            }}
            placeholder={
              'ID alfanumerico 1\nID alfanumerico 2\nID alfanumerico 3\nID alfanumerico n'
            }
          />
          <div
            className={clsx(
              'd-flex',
              'justify-content-between',
              'align-items-center',
              'mt-2'
            )}
          >
            <small className={clsx(isOverLimit ? 'text-danger' : 'text-muted')}>
              {`max ${MAX_RIGHE} righe`}
            </small>
            <small className={clsx(isOverLimit ? 'text-danger' : 'text-muted')}>
              {contatoreRighe} / {MAX_RIGHE} righe
            </small>
          </div>
        </div>
        <div className='d-flex flex-column justify-content-start ml-3' style={{ minWidth: '150px' }}>
          <Button
            color='primary'
            className='mb-2 w-100'
            onClick={handleCaricaElenco}
            disabled={contatoreRighe === 0 || isOverLimit}
          >
            Cerca elenco
          </Button>
          <Button
            outline
            color='primary'
            className='w-100'
            onClick={handleAnnulla}
            disabled={!inputValue && !hasSearched}
          >
            Annulla ricerca
          </Button>
        </div>
      </div>

      {hasSearched && result && (
        <div className='mb-5'>
          {result.trovati.length > 0 && (
            <div
              className={clsx(
                'd-flex',
                'justify-content-between',
                'align-items-center',
                'p-3',
                'mb-3',
                'rounded',
                'border',
                'border-primary',
                'bg-white'
              )}
            >
              <span className='font-weight-semibold primary-color-b1'>
                Numero cittadini trovati: {result.trovati.length}
              </span>
              <Button
                color='primary'
                style={{ minWidth: '200px' }}
                onClick={() =>
                  onDownloadSchede?.(result.trovati)
                }
              >
                <Icon
                  icon='it-download'
                  color='white'
                  size='sm'
                  className='mr-2'
                  aria-hidden
                />
                Scarica schede
              </Button>
            </div>
          )}

          {result.nonTrovati.length > 0 && (
            <div
              className={clsx(
                'd-flex',
                'justify-content-between',
                'align-items-center',
                'p-3',
                'mb-3',
                'rounded',
                'border',
                'border-primary',
                'bg-white'
              )}
            >
              <span className='font-weight-semibold primary-color-b1'>
                Numero cittadini non trovati: {result.nonTrovati.length}
              </span>
              <Button
                color='primary'
                style={{ minWidth: '200px' }}
                onClick={() => onDownloadElencoScarti?.(result.nonTrovati)}
              >
                <Icon
                  icon='it-download'
                  color='white'
                  size='sm'
                  className='mr-2'
                  aria-hidden
                />
                Scarica elenco
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RicercaMultipla;
