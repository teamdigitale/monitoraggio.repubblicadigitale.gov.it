import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Chip, ChipLabel, Icon } from 'design-react-kit';
import { useDispatch } from 'react-redux';
//import Sidebar, { SidebarI } from './sidebar';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-sticky-el';

export interface SearchInformationI {
  onHandleSearch?: (searchValue: string) => void;
  placeholder: string;
  title: string;
  autocomplete: boolean;
  isClearable: boolean;
  onReset?: () => void;
}

interface GenericSearchFilterTableLayoutI {
  searchInformation?: SearchInformationI;
  Sidebar?: ReactElement;
  showButtons?: boolean;
  filtersList?: any;
  cta?: (() => void) | undefined;
  ctaHref?: string;
  textCta?: string | undefined;
  iconCta?: string;
  ctaPrintText?: string;
  ctaPrint?: () => void;
  ctaDownload?: (() => void) | undefined;
  resetFilterDropdownSelected?: (filterKey: string) => void;
  citizen?: boolean;
  isDetail?: boolean;
  citizenList?: boolean;
  tooltip?: boolean;
  tooltiptext?: string;
  minLength?: number;
}

const monitoringSearchFilters = () => {



  const getFilterLabel = (key: string) => {
    // TODO update keys when API integration is done
    switch (key) {
      case 'filtroCriterioRicerca':
      case 'filtroNomeRuolo':
      case 'criterioRicerca':
      case 'searchValue':
        return 'Ricerca';
      case 'filtroPolicies':
      case 'policies':
        return 'Intervento';
      case 'filtroStati':
      case 'stati':
      case 'statiQuestionario':
      case 'stato':
        return 'Stato';
      case 'filtroIdsProgrammi':
      case 'idsProgrammi':
      case 'programmi':
        return 'Programma';
      case 'filtroIdsProgetti':
      case 'idsProgetti':
      case 'progetti':
        return 'Progetto';
      case 'profili':
        return 'Profilo';
      case 'ruoli':
        return 'Ruolo';
      case 'idsSedi':
      case 'sedi':
        return 'Sede';
      case 'tipologiaServizio':
        return 'Tipo di servizio prenotato';
      case 'categorySections':
        return 'Sezione';
      default:
        key;
    }
  };

  

  



  const { t } = useTranslation();

  const [ente, setEnte] = useState<string>('');
  const [intervento, setIntervento] = useState<string>('');
  const [dataInizio, setDataInizio] = useState<string>('2024-09-13');
  const [dataFine, setDataFine] = useState<string>('2024-09-13');
  const [progetto, setProgetto] = useState<string>('');
  const [programma, setProgramma] = useState<string>('');

  // Funzione per applicare i filtri (simulata)
  const applicaFiltri = () => {
    console.log({
      ente,
      intervento,
      dataInizio,
      dataFine,
      progetto,
      programma,
    });
  };

  // Funzione per cancellare i filtri
  const cancellaFiltri = () => {
    setEnte('');
    setIntervento('');
    setDataInizio('2024-09-13');
    setDataFine('2024-09-13');
    setProgetto('');
    setProgramma('');
  };

  return (
    <div className="ricerca-avanzata">
      <div className="form-group">
        <label>Ente</label>
        <input
          type="text"
          value={ente}
          onChange={(e) => setEnte(e.target.value)}
          placeholder="Inizia a scrivere il nome dell'ente"
        />
      </div>

      <div className="form-group">
        <label>Intervento</label>
        <select value={intervento} onChange={(e) => setIntervento(e.target.value)}>
          <option value="">Seleziona</option>
          {/* Opzioni esempio */}
          <option value="intervento1">Intervento 1</option>
          <option value="intervento2">Intervento 2</option>
        </select>
      </div>

      <div className="form-group">
        <label>Data inizio</label>
        <input
          type="date"
          value={dataInizio}
          onChange={(e) => setDataInizio(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Data fine</label>
        <input
          type="date"
          value={dataFine}
          onChange={(e) => setDataFine(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Progetto</label>
        <select value={progetto} onChange={(e) => setProgetto(e.target.value)}>
          <option value="">Seleziona</option>
          {/* Opzioni esempio */}
          <option value="progetto1">Progetto 1</option>
          <option value="progetto2">Progetto 2</option>
        </select>
      </div>

      <div className="form-group">
        <label>Programma</label>
        <select value={programma} onChange={(e) => setProgramma(e.target.value)}>
          <option value="">Seleziona</option>
          {/* Opzioni esempio */}
          <option value="programma1">Programma 1</option>
          <option value="programma2">Programma 2</option>
        </select>
      </div>

      <div className="form-actions">
        <button onClick={cancellaFiltri}>Cancella filtri</button>
        <button onClick={applicaFiltri}>Applica filtri</button>
      </div>
    </div>
  );
};

export default monitoringSearchFilters;
