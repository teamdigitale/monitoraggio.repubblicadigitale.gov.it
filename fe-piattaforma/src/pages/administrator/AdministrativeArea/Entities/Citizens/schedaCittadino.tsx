import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Icon } from 'design-react-kit';
import { Input } from '../../../../../components';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../redux/hooks';
import {
  selectSchedaCittadino,
  resetSchedaCittadino,
} from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import { generaSchedaSingola } from '../../../../../pdf/generate';
import { schedaCittadinoFields, schedaCittadinoTitle } from '../../../../../pdf/fieldsConfig';


const SchedaCittadino: React.FC = () => {
  const { idCittadino: _idCittadino } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scheda = useAppSelector(selectSchedaCittadino);

  useEffect(() => {
    return () => {
      dispatch(resetSchedaCittadino());
    };
  }, [dispatch]);

  const handleDownloadPDF = () => {
    if (!scheda) return;
    generaSchedaSingola(
      scheda,
      schedaCittadinoFields,
      schedaCittadinoTitle,
      '/assets/img/logo-scritta-blu-x2.png',
      `scheda_cittadino_${scheda.idCittadino}.pdf`
    );
  };

  if (!scheda) {
    return (
      <div className='container pb-5'>
        <Button
          className='px-0 mb-4'
          color='link'
          onClick={() => navigate('/area-amministrativa/cittadini', { state: { fromScheda: true } })}
        >
          <Icon icon='it-chevron-left' size='sm' className='mr-1' aria-hidden />
          Ricerca cittadini
        </Button>
        <div className='alert alert-warning'>
          Nessun dato disponibile. Torna alla ricerca per visualizzare la scheda
          di un cittadino.
        </div>
      </div>
    );
  }

  return (
    <div className='container pb-5'>
      <Button
        className='px-0 mb-4'
        color='link'
        onClick={() => navigate('/area-amministrativa/cittadini', { state: { fromScheda: true } })}
      >
        <Icon icon='it-chevron-left' size='sm' className='mr-1' aria-hidden />
        Ricerca cittadini
      </Button>

      <h5 className='text-uppercase primary-color-b1 font-weight-bold text-center mb-4'>
        Cittadino
      </h5>

      <div className='row mb-1'>
        <div className='col-12'>
          <Input
            label='Codice identificativo unico'
            value={scheda.codiceFiscale}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Genere'
            value={scheda.genere}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Fascia di età'
            value={scheda.fascia}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Titolo di studio'
            value={scheda.titoloDiStudio}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Stato occupazionale'
            value={scheda.occupazione}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-3'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Cittadinanza'
            value={scheda.cittadinanza}
            col='col-12'
            disabled
          />
        </div>
      </div>

      {/* Sezione Primo Servizio Fruito */}
      <h2 className='h5 mb-3 mt-4' style={{ color: 'rgb(92, 111, 130)' }}>
        Primo servizio fruito
      </h2>

      <div className='row mb-1'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Regione o provincia autonoma'
            value={scheda.regioneProvincia}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Ente titolare del progetto'
            value={scheda.nomeGestore}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col-12 col-lg-6'>
          <Input
            label='CUP'
            value={scheda.cup}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Nome del progetto'
            value={scheda.nomeServizio}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Nome del punto di facilitazione'
            value={scheda.nomePuntoFacilitazione}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Indirizzo del punto di facilitazione'
            value={scheda.indirizzoPuntoFacilitazione}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-1'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Nome del facilitatore'
            value={scheda.nomeFacilitatore}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Data di erogazione'
            value={scheda.dataServizio}
            col='col-12'
            disabled
          />
        </div>
      </div>

      <div className='row mb-3'>
        <div className='col-12 col-lg-6'>
          <Input
            label='Tipologia del servizio'
            value={scheda.tipologiaServizio}
            col='col-12'
            disabled
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Input
            label='Competenza digitale'
            value={scheda.competenzaDigitale || '-'}
            col='col-12'
            disabled
          />
        </div>
      </div>

      {/* CTA Scarica PDF allineata al bordo destro dei campi sopra */}
      <div className='row'>
        <div className='col-12 d-flex justify-content-end pr-3'>
          <Button color='primary' onClick={handleDownloadPDF}>
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
    </div>
  );
};

export default SchedaCittadino;
