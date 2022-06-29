import React, { useEffect, useState } from 'react';
import AccordionRow, { AccordionRowI } from '../../AccordionRow/accordionRow';
import { TableRowI } from '../table';
import { CRUDActionsI, CRUDActionTypes } from '../../../utils/common';

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
      const temp = values.map(({ nome, label, status, ...rest }) => ({
        title: nome || label,
        status,
        clickViewAction: onActionClick?.[CRUDActionTypes.VIEW],
        innerInfo: { ...rest },
      }));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setValuesForMobile([...temp]);
    }
  }, [values]);

  return (
    <div>
      {valuesForMobile?.map((item, index: number) => (
        <AccordionRow {...item} key={index} />
      ))}
    </div>
  );
};

export default TableMobile;
