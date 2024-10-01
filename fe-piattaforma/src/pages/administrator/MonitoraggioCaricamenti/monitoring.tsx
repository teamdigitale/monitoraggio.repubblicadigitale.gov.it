import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Accordion,
  EmptySection,
  Paginator,
  StatusChip,
  Table,
} from '../../../components';
import { newTable, TableRowI } from '../../../components/Table/table';
import { useAppSelector } from '../../../redux/hooks';
import {
  resetProgramDetails,
  selectEntityFilters,
  selectEntityList,
  selectEntityPagination,
  setEntityPagination,
} from '../../../redux/features/administrativeArea/administrativeAreaSlice';
import { TableHeading } from './utils';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import { useNavigate } from 'react-router-dom';
import {
  GetEntityValues
} from '../../../redux/features/administrativeArea/administrativeAreaThunk';
import useGuard from '../../../hooks/guard';
import IconNote from '/public/assets/img/it-note-primary.png';
import MonitoringSearchFilters from './monitoringSearchFilters';
import './monitoring.scss';

const entity = 'programma';


const Monitoring = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hasUserPermission } = useGuard();
  const { programmi: programmiList = [] } = useAppSelector(selectEntityList);
  const filtersList = useAppSelector(selectEntityFilters);
  const pagination = useAppSelector(selectEntityPagination);
  const { filtroCriterioRicerca, filtroPolicies, filtroStati } = filtersList;
  const numbers = [46, 112, 47259, 53293];
  const [statisticheElaborate, setStatisticheElaborate] = useState<any[]>([numbers[0].toLocaleString('it-IT'),numbers[1].toLocaleString('it-IT'),numbers[2].toLocaleString('it-IT'),numbers[3].toLocaleString('it-IT')]);
  const { pageNumber } = pagination;
  useEffect(() => {
    dispatch(setEntityPagination({ pageSize: 8 }));
    dispatch(resetProgramDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTableValues = () => {
    const table = newTable(
      TableHeading,
      programmiList.map((td: any) => {
        return {
          label: td.nomeBreve || td.nome,
          id: td.codice || td.id,
          policy: td.policy,
          enteGestore: td.enteGestore || td.nomeEnteGestore,
          status: <StatusChip status={td.stato} rowTableId={td.id} />,
        };
      })
    );
    return table;
  };
  
  const [tableValues, setTableValues] = useState(updateTableValues());  
  const [numeroRisultati, setNumeroRisultati] = useState(pagination.totalElements);
  
  useEffect(() => {
    if (Array.isArray(programmiList) && programmiList.length)
      setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmiList]);

  const getProgramsList = () => {    
    dispatch(GetEntityValues({ entity }));
  };

  useEffect(() => {
    if (pagination.totalElements !== 0) {
      setNumeroRisultati(pagination.totalElements);
    }
  }, [pagination.totalElements]);

  const setStatistiche = (numbers: number[]) => {
    const formattedNumbers = numbers.map(num => num.toLocaleString('it-IT'));
    setStatisticheElaborate(formattedNumbers);
  }

  useEffect(() => {
    getProgramsList();
    setNumeroRisultati(pagination.totalElements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCriterioRicerca, filtroPolicies, filtroStati, pageNumber]);

  const handleOnChangePage = (pageNumber: number = pagination?.pageNumber) => {
    dispatch(setEntityPagination({ pageNumber }));
  };

  const onActionClick: CRUDActionsI = hasUserPermission(['view.card.prgm.full'])
    ? {
        [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
          if (typeof td !== 'string') {
            const programId = programmiList.filter(
              (program: any) =>
                program?.codice?.toString().toLowerCase() ===
                td.id.toString().toLowerCase()
            )[0].id;
            navigate(`${programId}/info`);
          }
        },
      }
    : {};    
  return (
    <div>
      Monitora l'avanzamento dei caricamenti massivi dei dati degli enti. La visualizzazione di base è preimpostata in <br />
      automatico sulla data odierna. Utilizza i filtri per effettuare una ricerca avanzata.

      <div style={{ margin: '50px' }} />
      <Accordion title={'Ricerca avanzata'} className="custom-accordion">
        <MonitoringSearchFilters/>
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
              onCellClick={(field, row) => console.log(field, row)}
              //onRowClick={row => console.log(row)}
              withActions
              totalCounter={pagination?.totalElements}
            />
            {pagination?.pageNumber ? (
              <Paginator
                activePage={pagination?.pageNumber}
                center
                refID='#table'
                pageSize={pagination?.pageSize}
                total={pagination?.totalPages}
                onChange={handleOnChangePage}
              />
            ) : null}
          </>
        ) : (
          <EmptySection
            title='Non sono stati effettuati'
            subtitle='caricamenti massivi'
            icon={IconNote}
            withIcon
          />
        )}
    </div>
    
  );
};

export default Monitoring;
