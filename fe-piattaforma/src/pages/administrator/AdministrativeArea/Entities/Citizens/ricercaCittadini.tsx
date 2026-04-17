import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Nav } from 'design-react-kit';
import { NavLink } from '../../../../../components';
import RicercaSingola from './ricercaSingola';
import RicercaMultipla from './ricercaMultipla';
import { resetRicercaCittadiniState } from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import type { PrimoServizioCittadinoI, ScartoRicercaI } from '../../../../../redux/features/ricercaCittadini/ricercaCittadiniSlice';
import { generaSchedaSingola, generaSchedeMultiple } from '../../../../../pdf/generate';
import { schedaCittadinoFields, schedaCittadinoTitle } from '../../../../../pdf/fieldsConfig';

const tabs = {
  SINGOLA: 'tab-ricerca-singola',
  MULTIPLA: 'tab-ricerca-multipla',
};

const RicercaCittadini: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs.SINGOLA);
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fromScheda = (location.state as { fromScheda?: boolean })?.fromScheda;
    if (!fromScheda) {
      dispatch(resetRicercaCittadiniState());
    }
  }, [dispatch, location.state]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setTabKey((k) => k + 1);
    dispatch(resetRicercaCittadiniState());
  }, [dispatch]);

  const handleAccessoScheda = useCallback(
    (idCittadino: number | string) => {
      navigate(`${idCittadino}`);
    },
    [navigate]
  );

  return (
    <div>
      <p className='mt-4 mb-5 pb-3'>
        Effettua una ricerca tra i cittadini registrati su Facilita per aver
        partecipato ad attivit&agrave; di facilitazione o formazione. Puoi
        cercare le loro schede singolarmente oppure per liste tramite codice
        fiscale, codice identificativo alfanumerico o ID cittadino, e scaricarle
        in PDF.
      </p>

      <Nav tabs className='mt-5 mb-5 pb-3 justify-content-center' style={{ overflow: 'visible', padding: '2px 2px 0 2px' }} role='menu'>
        <li role='none' style={{ marginTop: '1px' }}>
          <NavLink
            onClick={() => handleTabChange(tabs.SINGOLA)}
            active={activeTab !== tabs.SINGOLA}
            role='menuitem'
          >
            Ricerca Singola
          </NavLink>
        </li>
        <li role='none' style={{ marginTop: '1px' }}>
          <NavLink
            onClick={() => handleTabChange(tabs.MULTIPLA)}
            active={activeTab !== tabs.MULTIPLA}
            role='menuitem'
          >
            Ricerca Multipla
          </NavLink>
        </li>
      </Nav>

      <div className='mt-5'>
        {activeTab === tabs.SINGOLA && (
          <RicercaSingola
            key={`singola-${tabKey}`}
            onAccessoScheda={handleAccessoScheda}
            onDownloadScheda={(cittadino: PrimoServizioCittadinoI) => {
              generaSchedaSingola(
                cittadino,
                schedaCittadinoFields,
                schedaCittadinoTitle,
                '/assets/img/logo-scritta-blu-x2.png',
                `scheda_cittadino_${cittadino.idCittadino}.pdf`
              );
            }}
          />
        )}
        {activeTab === tabs.MULTIPLA && (
          <RicercaMultipla
            key={`multipla-${tabKey}`}
            onDownloadSchede={(trovati) => {
              generaSchedeMultiple(
                trovati,
                schedaCittadinoFields,
                schedaCittadinoTitle,
                '/assets/img/logo-scritta-blu-x2.png',
                `schede_cittadini_${trovati.length}.pdf`
              );
            }}
            onDownloadElencoScarti={(nonTrovati: ScartoRicercaI[]) => {
              const righe = nonTrovati.map((s) =>
                typeof s === 'string' ? s : `${s.riga};${s.codice}`
              );
              const header = typeof nonTrovati[0] === 'string' ? '' : 'Numero riga;ID alfanumerico\n';
              const csv = header + righe.join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `elenco_scarti_${nonTrovati.length}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RicercaCittadini;
