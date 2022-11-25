import clsx from 'clsx';
import { Chip, ChipLabel } from 'design-react-kit';
import React, { memo } from 'react';
import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import './statusChip.scss';
interface StatusChipI {
  status?: string | undefined;
  noTooltip?: boolean;
  rowTableId?: string | number | undefined;
  className?: string;
  chipWidth?: boolean;
}

const statusTypes = {
  COMPLETE: 'COMPLETATO',
  DRAFT: 'IN BOZZA',
  INACTIVE: 'NON ATTIVO',
  ACTIVE: 'ATTIVO',
  NOT_SENT: 'NON INVIATO',
  SENT: 'INVIATO',
  FILLED_OUT: 'COMPILATO',
  NOT_FILLED_OUT: 'NON COMPILATO',
  TERMINATED: 'TERMINATO',
  ACTIVABLE: 'ATTIVABILE',
};

export const statusBgColor = (status: string) => {
  switch (status) {
    case 'active':
    case statusTypes.ACTIVE:
    case statusTypes.COMPLETE:
    case statusTypes.SENT:
      return 'primary-bg-a9';
    case statusTypes.FILLED_OUT:
      return 'primary-bg-c7';
    case statusTypes.DRAFT:
    case 'draft':
      return 'analogue-2-bg-a2';
    case statusTypes.NOT_FILLED_OUT:
    case statusTypes.INACTIVE:
    case statusTypes.NOT_SENT:
    case 'inactive':
      return 'neutral-1-bg-a1';
    case statusTypes.TERMINATED:
      return 'neutral-2-bg-b5';
    case statusTypes.ACTIVABLE:
      return 'activable';
    default:
      return 'neutral-1-bg-a1';
  }
};

export const statusColor = (status: string) => {
  switch (status) {
    case 'active':
    case statusTypes.COMPLETE:
    case statusTypes.ACTIVE:
    case statusTypes.SENT:
      return 'text-white';
    case statusTypes.FILLED_OUT:
      return 'white-color';
    case statusTypes.DRAFT:
    case 'draft':
      return 'primary-color-a9';
    case statusTypes.NOT_FILLED_OUT:
    case statusTypes.INACTIVE:
    case statusTypes.NOT_SENT:
    case 'inactive':
      return 'not-active-chip';
    case statusTypes.TERMINATED:
      return 'text-white';
    case statusTypes.ACTIVABLE:
      return 'text-white';
    default:
      return 'neutral-1-bg-a1';
  }
};

const StatusChip: React.FC<StatusChipI> = (props) => {
  const { status, rowTableId, chipWidth } = props;
  const device = useAppSelector(selectDevice);

  if (!status) return null;

  return (
    <div className='px-0 py-0'>
      <Chip
        id={`chip-status-${rowTableId ? rowTableId : new Date().getTime()}`}
        className={clsx(
          'table-container__status-label',
          statusBgColor(status),
          'no-border',
          chipWidth && 'px-2',
          device.mediaIsPhone && 'my-2'
        )}
      >
        <ChipLabel
          className={clsx(
            statusColor(status),
            chipWidth && 'px-3',
            status === 'NON ATTIVO' && 'not-active-chip'
          )}
          role='status'
        >
          {status?.toUpperCase().replace('_', ' ')}
        </ChipLabel>
      </Chip>
    </div>
  );
};

export default memo(StatusChip);
