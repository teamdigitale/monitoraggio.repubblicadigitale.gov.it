import Table, { TableHeadingI, TableRowI } from '../Table/table';
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Paginator from '../Paginator/paginator';
import { Page } from '../../models/Page.model';
import { RegistroAttivita } from '../../models/RegistroAttivita.model';
import { useAppDispatch } from '../../redux/hooks';
import { searchActivityReport } from '../../services/activityReportService';
import { hideLoader, showLoader } from '../../redux/features/app/appSlice';
import { ProjectInfo } from '../../models/ProjectInfo.model';
import { ProjectContext } from '../../contexts/ProjectContext';
import { CRUDActionsI, CRUDActionTypes } from '../../utils/common';
import { useParams } from 'react-router-dom';
import { downloadResume } from '../../utils/csvUtils';
import StatusChip from '../StatusChip/statusChip';

const tableHeading: TableHeadingI[] = [
  {
    label: 'ID Caricamento',
    field: 'id',
    size: 'medium',
    classNames: 'text-primary',
  },
  {
    label: 'Referente',
    field: 'operatore',
    size: 'medium',
  },
  {
    label: 'Data e ora avvio',
    field: 'dataInizioInserimento',
    size: 'medium',
  },
  {
    label: 'Totale Righe',
    field: 'totaleRigheFile',
    size: 'medium',
  },
  {
    label: 'Righe Scartate ',
    field: 'righeScartate',
    size: 'medium',
  },
  {
    label: 'Servizi Caricati',
    field: 'serviziAcquisiti',
    size: 'medium',
  },
  {
    label: 'Cittadini Beneficiari',
    field: 'cittadiniAggiunti',
    size: 'medium',
  },
  {
    label: 'Stato',
    field: 'statoChip',
    size: 'medium',
  },
];

const onActionClick: CRUDActionsI = {
  [CRUDActionTypes.DOWNLOAD]: (activityReport: TableRowI | string) => {
    const report = activityReport as RegistroAttivita;
    downloadResume(report);
  },
};

const ActivityReportTable = forwardRef(function ActivityReportTable(
  _props,
  ref: ForwardedRef<{ search: () => void }>
) {
  const [pagination, setPagination] = useState<Page<RegistroAttivita> | null>();
  const dispatch = useAppDispatch();
  const projectContext = useContext<ProjectInfo | undefined>(ProjectContext);
  const { projectId, authorityId } = useParams();

  const searchReports = useCallback(
    (newPage: number, showLoaderFlag = true) => {
      if (projectId && (authorityId || projectContext)) {
        if(showLoaderFlag)
          dispatch(showLoader());
        searchActivityReport(
          newPage - 1,
          10,
          parseInt(projectId),
          authorityId ? parseInt(authorityId) : projectContext!.idEnte
        )
        .then((res) => {
          // mappo gli stati per inserirli in tabella in modo semplificato ('IN CORSO', 'COMPLETATO', 'FALLITO')
          const statusMap: { [key: string]: string } = {
            IN_PROGRESS: 'IN CORSO',
            SUCCESS: 'COMPLETATO',
            FAIL_MONGO: 'FALLITO',
            FAIL_S3_API: 'FALLITO',
            'FAIL-S3_UPLOAD': 'FALLITO',
            GENERIC_FAIL: 'FALLITO'
          };  
          const updatedContent = res.data.content.map((item: RegistroAttivita) => {
            const updatedItem = {
              ...item,
              stato: statusMap[item.jobStatus] || item.stato,
              statoChip: <StatusChip status={statusMap[item.jobStatus] || item.stato} />,
            };
            if (statusMap[item.jobStatus] === 'FALLITO') {
              updatedItem.cittadiniAggiunti = 0;
              updatedItem.serviziAcquisiti = 0;
              updatedItem.totaleRigheFile = 0;
              updatedItem.righeScartate = 0;
            }
            return updatedItem;
          });
          setPagination({ ...res.data, content: updatedContent, number: newPage });
        })
          .catch(() => {
            setPagination(null);
          })
          .finally(() => dispatch(hideLoader()));
      }
    },
    [dispatch, projectContext, projectId, authorityId]
  );

  useEffect(() => {
    searchReports(1);
  }, [projectId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPagination((prev) => {
        const number = prev?.number || 1; // Usa il valore aggiornato
        searchReports(number, false);
        return prev; // Restituisci il valore precedente per evitare di sovrascrivere
      });
    }, 30000);
  
    return () => clearInterval(interval);
  }, [searchReports]);

  useImperativeHandle(
    ref,
    () => {
      return {
        search() {
          if (pagination) searchReports(pagination.number);
        },
      };
    },
    [searchReports, pagination]
  );
  return (
    <>
      <div className='row'>
        <div className='col'>
          <h2 className='h3'>Registro dei caricamenti</h2>
        </div>
      </div>
      <div className='row'>
        <div className='col-6'>
          <p>
            Consulta l'elenco dei caricamenti già effettuati dal tuo ente e
            scarica i report delle righe scartate durante ogni caricamento.
          </p>
        </div>
      </div>

      <div className='row my-4'>
        <div className='col'>
          <Table
            id='table-caricamento-massivo'
            heading={tableHeading}
            values={pagination?.content ?? []}
            totalCounter={pagination?.totalElements ?? -1}
            onActionClick={onActionClick}
            actionHeadingLabel='Report righe scartate'
          />
          {pagination && pagination?.content?.length > 0 && (
            <Paginator
              total={pagination.totalPages}
              pageSize={pagination.size}
              onChange={searchReports}
            />
          )}
        </div>
      </div>
    </>
  );
});

export default ActivityReportTable;
