import React, { useEffect, useState } from 'react';
import {
  newTable,
  TableHeadingI,
  TableRowI,
} from '../../../../../components/Table/table';
import clsx from 'clsx';
import { StatusChip, Table } from '../../../../../components';
import { CRUDActionsI, CRUDActionTypes } from '../../../../../utils/common';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { ServizioCittadinoI } from '../../../../../redux/features/citizensArea/citizensAreaSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, UncontrolledTooltip } from 'design-react-kit';
import PasswordVisible from '/public/assets/img/it-password-visible.png';

const TableHeadingEntities: TableHeadingI[] = [
  {
    label: 'Nome',
    field: 'nomeServizio',
  },
  {
    label: 'Facilitatore',
    field: 'nomeCompletoFacilitatore',
  },
  {
    label: 'Stato questionario',
    field: 'statoQuestionario',
  },
];

const CitizenServices: React.FC<{
  servizi: ServizioCittadinoI[];
}> = ({ servizi }) => {
  const navigate = useNavigate();

  const updateTableValues = () => {
    const table = newTable(
      TableHeadingEntities,
      (servizi || []).map((td) => ({
        idServizio: td.idServizio || '',
        nomeServizio: td.nomeServizio || '',
        nomeCompletoFacilitatore: td.nomeCompletoFacilitatore || '',
        statoQuestionario: (
          <>
            <StatusChip
              status={td.statoQuestionario}
              rowTableId={td.idServizio}
            />
            {td.statoQuestionario === 'COMPILATO' && (
              <>
                <Button
                  onClick={() =>
                    navigate(
                      `/area-amministrativa/servizi/${td.idServizio}/cittadini/compilato/${td.idQuestionarioCompilato}`,
                      { replace: true }
                    )
                  }
                  className='py-0 px-2'
                  aria-label='Visualizza questionario compilato'
                  id={`button-view-${td.idQuestionarioCompilato}`}
                >
                  <Icon
                    icon={PasswordVisible}
                    className='icons__icon-visible-password'
                    color='primary'
                    size='sm'
                    aria-label='Vedi questionario compilato'
                    aria-hidden
                    focusable={false}
                  />
                </Button>
                <UncontrolledTooltip
                  placement='top'
                  target={`button-view-${td.idQuestionarioCompilato}`}
                >
                  Visualizza questionario
                </UncontrolledTooltip>
              </>
            )}
          </>
        ),
        idQuestionarioCompilato: td.idQuestionarioCompilato || '',
        associatoAUtente: td.associatoAUtente || false,
        citizen: true,
      }))
    );
    return {
      ...table,
      values: table.values,
    };
  };
  const [tableValues, setTableValues] = useState(updateTableValues());
  useEffect(() => {
    setTableValues(updateTableValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servizi]);

  const onActionClick: CRUDActionsI = {
    [CRUDActionTypes.VIEW]: (td: TableRowI | string) => {
      navigate(
        `/area-amministrativa/servizi/${
          typeof td !== 'string' ? td.idServizio : td
        }/info`
      );
    },
  };

  const device = useAppSelector(selectDevice);

  return (
    <>
      <div
        className={clsx(
          device.mediaIsPhone && 'flex-column',
          'd-flex',
          'justify-content-between',
          'mb-2'
        )}
      >
        <div>
          <h1 className='h4 primary-color-b1'>Servizi</h1>
        </div>
      </div>
      <Table
        {...tableValues}
        id='table'
        onActionClick={onActionClick} // td?.associatoAUtente
        onCellClick={(field, row) => console.log(field, row)}
        withActions
      />
    </>
  );
};

export default CitizenServices;
