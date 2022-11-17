import React, { useEffect, useRef } from 'react';
import { selectDevice } from '../redux/features/app/appSlice';
import { useAppSelector } from '../redux/hooks';

function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  effect: () => void,
  isDesktop?: boolean,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (typeof effect === 'function') effect();
      }
    }

    isDesktop
      ? document.addEventListener('mousedown', handleClickOutside, isDesktop)
      : document.addEventListener('touchend', handleClickOutside, isDesktop);
    return () => {
      isDesktop
        ? document.removeEventListener('mousedown', handleClickOutside, isDesktop)
        : document.removeEventListener('touchend', handleClickOutside, isDesktop);
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
  const device = useAppSelector(selectDevice);
  useOutsideAlerter(wrapperRef, callback, device.mediaIsDesktop);

  return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutside;
