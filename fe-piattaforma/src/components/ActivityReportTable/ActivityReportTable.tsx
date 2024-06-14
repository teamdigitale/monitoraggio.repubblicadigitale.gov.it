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

const tableHeading: TableHeadingI[] = [
  {
    label: 'ID Caricamento',
    field: 'id',
    size: 'medium',
    classNames: 'text-primary',
  },
  {
    label: 'Rereferente / Delegato',
    field: 'operatore',
    size: 'medium',
  },
  {
    label: 'Data e ora',
    field: 'dataInserimento',
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
    label: 'Report righe scartate',
    field: 'rilevazioneDiEsperienzaCompilate',
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
  const { projectId, enteId } = useParams();

  const searchReports = useCallback(
    (newPage: number) => {
      if (projectId && (enteId || projectContext)) {
        dispatch(showLoader());
        searchActivityReport(
          newPage - 1,
          parseInt(projectId),
          enteId ? parseInt(enteId) : projectContext!.idEnte
        )
          .then((res) => setPagination(res.data))
          .catch(() => {
            setPagination(null);
          })
          .finally(() => dispatch(hideLoader()));
      }
    },
    [dispatch, projectContext, projectId, enteId]
  );

  useEffect(() => {
    searchReports(1);
  }, [projectId]);

  useImperativeHandle(
    ref,
    () => {
      return {
        search() {
          if (pagination) searchReports(pagination.number + 1);
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
            Consulta l'elenco dei caricamenti giá effettuati dal tuo ente e
            scarica i report delle righe scartate durante ogni caricamento.
          </p>
        </div>
      </div>

      <div className='row my-4'>
        <div className='col'>
          <Table
            id='table'
            heading={tableHeading}
            values={pagination?.content ?? []}
            totalCounter={pagination?.totalElements ?? -1}
            withActions
            onActionClick={onActionClick}
          />
          {pagination && pagination.content.length > 0 && (
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
