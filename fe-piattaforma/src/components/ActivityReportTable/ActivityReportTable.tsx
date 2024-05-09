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

const tableHeading: TableHeadingI[] = [
  {
    label: 'Operatore',
    field: 'operatore',
    size: 'medium',
  },
  {
    label: 'Data',
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

const ActivityReportTable = forwardRef(function ActivityReportTable(
  _props,
  ref: ForwardedRef<{ search: () => void }>
) {
  const [pagination, setPagination] = useState<Page<RegistroAttivita> | null>();
  const dispatch = useAppDispatch();
  const projectContext = useContext<ProjectInfo | undefined>(ProjectContext);

  const searchReports = useCallback(
    (newPage: number) => {
      if (projectContext) {
        dispatch(showLoader());
        searchActivityReport(newPage - 1, parseInt(projectContext.id))
          .then((res) => setPagination(res.data))
          .catch(() => {
            setPagination(null);
          })
          .finally(() => dispatch(hideLoader()));
      }
    },
    [dispatch, projectContext]
  );

  useEffect(() => {
    searchReports(1);
  }, [projectContext]);

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
      <Table
        id='table'
        heading={tableHeading}
        values={pagination?.content ?? []}
        totalCounter={pagination?.totalElements ?? -1}
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
