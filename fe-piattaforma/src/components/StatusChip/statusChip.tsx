import clsx from 'clsx';
import { Button, Chip, ChipLabel, UncontrolledTooltip } from 'design-react-kit';
import React, { memo } from 'react';

interface StatusChipI {
  status: string;
  noTooltip?: boolean;
  rowTableId?: string | number;
  className?: string;
}

const statusTypes = {
  COMPLETE: 'COMPLETATO',
  DRAFT: 'IN BOZZA',
  INACTIVE: 'NON_ATTIVO',
  ACTIVE: 'ATTIVO',
  NOT_SENT: 'NON INVIATO',
  SENT: 'INVIATO',
  FILLED_OUT: 'COMPILATO',
};

export const statusBgColor = (status: string) => {
  switch (status) {
    case statusTypes.ACTIVE:
    case 'active':
    case statusTypes.COMPLETE:
    case statusTypes.SENT:
      return 'primary-bg-a9';
    case statusTypes.FILLED_OUT:
      return 'primary-bg-c7';
    case statusTypes.DRAFT:
    case 'draft':
      return 'analogue-2-bg-a2';
    case statusTypes.INACTIVE:
    case 'inactive':
      return 'neutral-1-bg-b4';
    case statusTypes.NOT_SENT:
      return 'light-grey-bg';
    default:
      return 'complementary-1-bg-a2';
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case statusTypes.COMPLETE:
    case statusTypes.ACTIVE:
    case 'active':
    case statusTypes.SENT:
      return 'text-white';
    case statusTypes.FILLED_OUT:
      return 'white-color';
    case statusTypes.DRAFT:
    case 'draft':
      return 'primary-color-a9';
    case statusTypes.INACTIVE:
    case 'inactive':
    case statusTypes.NOT_SENT:
      return 'neutral-1-color-b6';
    default:
      return 'complementary-1-bg-a2';
  }
};

const StatusChip: React.FC<StatusChipI> = (props) => {
  const { status, noTooltip = false, rowTableId } = props;

  if (!status) return null;

  return (
    <>
      <Button
        className='px-0 py-0'
        id={`button-status-${rowTableId ? rowTableId : new Date().getTime()}`}
        // onClick={() => console.log('tooltip')}
      >
        <Chip
          className={clsx(
            'table-container__status-label',
            statusBgColor(status),
            'no-border'
          )}
        >
          <ChipLabel className={statusColor(status)}>
            {status?.toUpperCase()}
          </ChipLabel>
        </Chip>{' '}
      </Button>
      {!noTooltip && (
        <UncontrolledTooltip
          placement='top'
          target={`button-status-${
            rowTableId ? rowTableId : new Date().getTime()
          }`}
        >
          {status}
        </UncontrolledTooltip>
      )}
    </>
  );
};

export default memo(StatusChip);
