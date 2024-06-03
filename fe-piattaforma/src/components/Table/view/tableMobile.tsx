import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import AccordionRow, { AccordionRowI } from '../../AccordionRow/accordionRow';
import { TableRowI } from '../table';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import EmptySection from '../../EmptySection/emptySection';
import clsx from 'clsx';
import { calculatePaginationBounds } from '../../../utils/pagination.utils';

interface MobileTableI {
  onActionClick?: CRUDActionsI;
  onTooltipInfo?: string;
  values?: TableRowI[];
  totalCounter?: number;
  onActionRadio?: CRUDActionsI;
  pageNumber?: number;
  pageSize?: number;
}

const TableMobile: React.FC<MobileTableI> = ({
  onActionClick,
  onTooltipInfo = '',
  values = [],
  totalCounter,
  pageNumber,
  pageSize,
  onActionRadio,
}) => {
  const [valuesForMobile, setValuesForMobile] = useState<AccordionRowI[]>();

  const { displayItem } = calculatePaginationBounds(
    pageNumber,
    pageSize,
    totalCounter
  );

  useEffect(() => {
    if (values && values.length) {
      const temp = values.map((item) => {
        const {
          attributo,
          actions,
          id,
          name,
          nome,
          cognome,
          label,
          status,
          ...rest
        } = item;

        return {
          title: id,
          /*title: cognome
                                          ? cognome + ' ' + nome
                                          : nome || nome || label || name || attributo,*/
          status,
          id,
          actions,
          clickViewAction:
            (!item?.citizen || (item?.citizen && item?.associatoAUtente)) &&
            onActionClick?.[CRUDActionTypes.VIEW]
              ? () => onActionClick?.[CRUDActionTypes.VIEW](item)
              : undefined,
          clickEditAction: onActionClick?.[CRUDActionTypes.EDIT]
            ? () => onActionClick?.[CRUDActionTypes.EDIT](item)
            : undefined,
          clickDeleteAction: onActionClick?.[CRUDActionTypes.DELETE]
            ? () => onActionClick?.[CRUDActionTypes.DELETE](item)
            : undefined,
          clickDownloadAction: onActionClick?.[CRUDActionTypes.DOWNLOAD]
            ? () => onActionClick?.[CRUDActionTypes.DOWNLOAD](item)
            : undefined,
          innerInfo: isEmpty(rest) ? undefined : { id, ...rest },
        };
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setValuesForMobile([...temp]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <div>
      {valuesForMobile ? (
        valuesForMobile.map((item, index: number) => (
          <AccordionRow
            {...item}
            key={index}
            onTooltipInfo={onTooltipInfo}
            onActionRadio={onActionRadio}
          />
        ))
      ) : (
        <div className='my-3'>
          <EmptySection title='Questa sezione è vuota' subtitle='' />
        </div>
      )}
      {totalCounter ? (
        <div className={clsx('text-right', 'total-counter-text-color')}>
          {displayItem}
        </div>
      ) : null}
    </div>
  );
};

export default TableMobile;
