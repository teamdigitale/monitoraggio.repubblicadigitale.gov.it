import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
//import { resetEntityState } from '../redux/features/administrativeArea/administrativeAreaSlice';
import { resetAreaCittadiniState } from '../redux/features/citizensArea/citizensAreaSlice';
import { resetModalState } from '../redux/features/modal/modalSlice';
import { useAppDispatch } from '../redux/hooks';

const LocationInterceptor = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // TODO subscribe here all reset actions
    //dispatch(resetEntityState());
    dispatch(resetAreaCittadiniState());
    dispatch(resetModalState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

export default LocationInterceptor;
