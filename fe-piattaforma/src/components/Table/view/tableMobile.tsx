import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import AccordionRow, { AccordionRowI } from '../../AccordionRow/accordionRow';
import { TableRowI } from '../table';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';
import EmptySection from '../../EmptySection/emptySection';

interface MobileTableI {
  onActionClick?: CRUDActionsI;
  values?: TableRowI[];
}

const TableMobile: React.FC<MobileTableI> = ({
  onActionClick,
  values = [],
}) => {
  const [valuesForMobile, setValuesForMobile] = useState<AccordionRowI[]>();

  useEffect(() => {
    if (values && values.length) {
      const temp = values.map((item) => {
        const { actions, id, name, nome, label, status, ...rest } = item;
        return {
          title: nome || label || name,
          status,
          id,
          actions,
          clickViewAction: () => onActionClick?.[CRUDActionTypes.VIEW](item),
          innerInfo: isEmpty(rest) ? undefined : { ...rest },
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
          <AccordionRow {...item} key={index} />
        ))
      ) : (
        <div className='my-3'>
          <EmptySection title='Questa sezione è vuota' subtitle='' />
        </div>
      )}
    </div>
  );
};

export default TableMobile;
