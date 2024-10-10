import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Accordion,
  EmptySection,
  Paginator,
  Table,
} from '../../../components';
import { newTable, TableRowI } from '../../../components/Table/table';
import { useAppSelector } from '../../../redux/hooks';
import {
  selectEntityFilters,
  selectEntityPagination,
  setEntityPagination,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { TableHeading } from './utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import { useNavigate } from 'react-router-dom';
import {
  GetMonitoraggioCaricamentiValues
} from '../../../redux/features/administrativeArea/administrativeAreaThunk';
import useGuard from '../../../hooks/guard';
import IconNote from '/public/assets/img/it-note-primary.png';
import MonitoringSearchFilters, { initialFormValues } from './monitoringSearchFilters';
import './monitoring.scss';
import { selectPermissions } from '../../../redux/features/user/userSlice';
import { withFormHandlerProps } from '../../../hoc/withFormHandler';

const entity = 'programma';

interface MonitoringFormI {
  formDisabled?: boolean;
  creation?: boolean;
}

interface MonitoringI extends withFormHandlerProps, MonitoringFormI {}

interface CaricamentiResponse {
  cittadiniCaricati: number;
  monitoraggioCaricamentiEntity: []; // Array di oggetti di tipo MonitoraggioCaricamentoEntity
  numeroCaricamenti: number;
  numeroEnti: number;
  numeroPagine: number;
  numeroTotaleElementi: number;
  serviziCaricati: number;
}

const Monitoring: React.FC<MonitoringI> = ({
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();
  const [caricamentiList, setCaricamentiList] = useState<any[]>([]);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  // const { filtroCriterioRicerca, filtroPolicies, filtroStati } = filtersList;
  const [statisticheElaborate, setStatisticheElaborate] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<typeof initialFormValues>(initialFormValues);

  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 10}));
  }, []);

  // const handleTableValuesChange = (newTableValues: CaricamentiResponse) => {
  //     setCaricamentiList(newTableValues.monitoraggioCaricamentiEntity);
  //     setNumeroRisultati(newTableValues.numeroTotaleElementi);
  //     setStatistiche([newTableValues.numeroEnti, newTableValues.numeroCaricamenti, newTableValues.serviziCaricati, newTableValues.cittadiniCaricati]);
  // };


  const fetchData = async (currPage: number = 1) => { 
    try {
      const payload: any = {
        ...(Number(formValues.programma.value) !== 0 && { idProgramma: Number(formValues.programma.value) }),
        ...(Number(formValues.progetto.value) !== 0 && { idProgetto: Number(formValues.progetto.value) }),
        ...(Number(formValues.ente.value) !== 0 && { idEnti: [Number(formValues.ente.value)] }),
        ...(formValues.intervento.value !== '' && { intervento: formValues.intervento.value }),
        ...(formValues.dataFine.value && { dataFine: new Date(formValues.dataFine.value) }),
        ...(formValues.dataInizio.value && { dataInizio: new Date(formValues.dataInizio.value) }),
        pageSize: 10,
        currPage: currPage - 1,
      };
      const newTableValues = await GetMonitoraggioCaricamentiValues(payload)(dispatch);
      setCaricamentiList(newTableValues.monitoraggioCaricamentiEntity);
      setNumeroRisultati(newTableValues.numeroTotaleElementi);
      setStatistiche([newTableValues.numeroEnti, newTableValues.numeroCaricamenti, newTableValues.serviziCaricati, newTableValues.cittadiniCaricati]);
      dispatch(setEntityPagination({ pageNumber: currPage, pageSize: 10, totalElements: newTableValues.numeroTotaleElementi, totalPages: newTableValues.numeroPagine }));
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    setTableValues(updateTableValues());
  }, [caricamentiList]);

  const permissions = useAppSelector(selectPermissions);

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      caricamentiList.map((td: any) => {
        return {
          data: td.dataCaricamenti,
          ente: td.nomeEnte,
          intervento: td.intervento,
          progetto: td.nomeProgetto,
          programma: td.nomeProgramma,
          caricamenti: td.numCaricamenti,
          serviziCaricati: td.serviziAggiunti,
          cittadiniCaricati: td.cittadiniAssociati
        };
      })
    );
    return table;
  };

  const [tableValues, setTableValues] = useState(updateTableValues());
  const [numeroRisultati, setNumeroRisultati] = useState(0);

  useEffect(() => {
    if (Array.isArray(caricamentiList) && caricamentiList.length)
      setTableValues(updateTableValues());
  }, [caricamentiList]);

  // const getProgramsList = () => {
  //   dispatch(GetEntityValues({ entity }));
  // };

  const setStatistiche = (numbers: number[]) => {
    const formattedNumbers = numbers.map(num => num.toLocaleString('it-IT'));
    setStatisticheElaborate(formattedNumbers);
  }

  // useEffect(() => {
  //   getProgramsList();
  //   setNumeroRisultati(pagination.totalElements);
  // }, [filtroCriterioRicerca, filtroPolicies, filtroStati, pageNumber]);

  const onActionClick: CRUDActionsI = hasUserPermission(['view.card.prgm.full'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          if (typeof td !== 'string') {
            const programId = caricamentiList.filter(
              (program: any) =>
                program?.codice?.toString().toLowerCase() ===
                td.id.toString().toLowerCase()
            )[0].id;
            navigate(`${programId}/info`);
          }
        },
      }
    : {};


    const setFormValuesFunction = (formValues : any) => {
      setFormValues(formValues);
    }

  return (
    <div>
      Monitora l'avanzamento dei caricamenti massivi dei dati degli enti. La visualizzazione di base è preimpostata in <br />
      automatico sulla data odierna. Utilizza i filtri per effettuare una ricerca avanzata.

      <div style={{ margin: '50px' }} />
      <Accordion title={'Ricerca avanzata'} className="custom-accordion" opened={true}>
        <MonitoringSearchFilters onSearch={fetchData} formValues={formValues} setFormValues={setFormValuesFunction}/>
      </Accordion>
      <div style={{ margin: '50px' }} />

      <span className="results"><b>Risultati</b> ({numeroRisultati})</span>

      <div className="square-container">
        <div className="square">
          <span className='statisticheValue'>{statisticheElaborate[0]}</span>
          <span className='statisticheDescrizione'>Enti</span>
        </div>
        <div className="square">
          <span className='statisticheValue'>{statisticheElaborate[1]}</span>
          <span className='statisticheDescrizione'>Caricamenti</span>
        </div>
        <div className="square">
          <span className='statisticheValue'>{statisticheElaborate[2]}</span>
          <span className='statisticheDescrizione'>Servizi caricati</span>
        </div>
        <div className="square">
          <span className='statisticheValue'>{statisticheElaborate[3]}</span>
          <span className='statisticheDescrizione'>Cittadini caricati</span>
        </div>
      </div>

      {tableValues?.values?.length ? (
        <>
          <Table
            {...tableValues}
            id='table'
            onActionClick={onActionClick}
            onCellClick={() => navigate('/')}
            withActions
            totalCounter={pagination?.totalElements}
          />
          {pagination?.pageNumber ? (
            <Paginator
              // activePage={pagination?.pageNumber}
              // center
              // // refID='#table'
              pageSize={pagination?.pageSize}
              total={pagination?.totalPages}
              onChange={fetchData}
            />
          ) : null}
        </>
      ) : (
        <EmptySection
          title='Non sono stati effettuati caricamenti massivi'
          icon={IconNote}
          withIcon
        />
      )}
    </div>
  );
};

export default Monitoring;