import React, { useEffect, useRef } from 'react';

function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  effect: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (typeof effect === 'function') effect();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [effect, ref]);
}

/**
 * Component that alerts if you click outside of it
 */

interface ClickOustidePropI {
  children: JSX.Element;
  callback: () => void;
}

const ClickOutside: React.FC<ClickOustidePropI> = (props) => {
  const { children, callback } = props;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, callback);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutside;
