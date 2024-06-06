import Table, { TableHeadingI } from '../Table/table';
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

const tableHeading: TableHeadingI[] = [
  {
    label: 'ID Caricamento',
    field: 'id',
    size: 'medium',
    classNames: 'text-primary',
  },
  {
    label: 'Operatore',
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
    label: 'Servizi Acquisiti',
    field: 'serviziAcquisiti',
    size: 'medium',
  },
  {
    label: 'Cittadini aggiunti',
    field: 'cittadiniAggiunti',
    size: 'medium',
  },
  {
    label: 'Rilevazione di esperienza compilate',
    field: 'rilevazioneDiEsperienzaCompilate',
    size: 'medium',
  },
];

const onActionClick: CRUDActionsI = {
  [CRUDActionTypes.DOWNLOAD]: () => null,
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
      <h2 className='h3'>Registro dei caricamenti</h2>
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
    </>
  );
});

export default ActivityReportTable;
