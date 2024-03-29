import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';

interface CurtainI {
  open: boolean;
  noscroll: boolean;
  onClick?: () => void;
}

const Curtain: React.FC<CurtainI> = (props) => {
  const { open, children, onClick } = props;
  const body = document.getElementsByTagName('body')[0];

  if (!open) {
    return null;
  }

  const handleOnClick = () => {
    if (onClick) onClick();
  };

  return ReactDOM.createPortal(
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={clsx('curtain-wrapper', 'position-fixed', 'w-100', 'h-100')}
      role='dialog'
      onMouseDown={handleOnClick}
      aria-label='Curtain modale'
    >
      {children}
    </div>,
    body
  );
};

export default Curtain;
