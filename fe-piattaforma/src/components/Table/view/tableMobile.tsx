import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import AccordionRow, { AccordionRowI } from '../../AccordionRow/accordionRow';
import { TableRowI } from '../table';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import EmptySection from '../../EmptySection/emptySection';
import clsx from 'clsx';

interface MobileTableI {
  onActionClick?: CRUDActionsI;
  onTooltipInfo?: string;
  values?: TableRowI[];
  totalCounter?: number;
}

const TableMobile: React.FC<MobileTableI> = ({
  onActionClick,
  onTooltipInfo = '',
  values = [],
  totalCounter,
}) => {
  const [valuesForMobile, setValuesForMobile] = useState<AccordionRowI[]>();

  useEffect(() => {
    if (values && values.length) {
      const temp = values.map((item) => {
        const { attributo, actions, id, name, nome, label, status, ...rest } =
          item;

        return {
          title: nome || label || name || attributo,
          status,
          id,
          actions,
          clickViewAction:
            (!item?.citizen || (item?.citizen && item?.associatoAUtente)) &&
            onActionClick?.[CRUDActionTypes.VIEW]
              ? () => onActionClick?.[CRUDActionTypes.VIEW](item)
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
          <AccordionRow {...item} key={index} onTooltipInfo={onTooltipInfo} />
        ))
      ) : (
        <div className='my-3'>
          <EmptySection title='Questa sezione è vuota' subtitle='' />
        </div>
      )}
      {totalCounter ? (
        <div
          className={clsx('text-right', 'neutral-2-color-b4')}
        >{`${values.length} di ${totalCounter}`}</div>
      ) : null}
    </div>
  );
};

export default TableMobile;
