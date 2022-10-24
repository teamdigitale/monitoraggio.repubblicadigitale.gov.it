import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resetUserDetails } from '../redux/features/administrativeArea/administrativeAreaSlice';
import { resetCustomBreadcrumb, resetInfoIdsBreadcrumb, showBreadCrumb } from '../redux/features/app/appSlice';
//import { resetEntityState } from '../redux/features/administrativeArea/administrativeAreaSlice';
import { resetAreaCittadiniState } from '../redux/features/citizensArea/citizensAreaSlice';
import { resetModalState } from '../redux/features/modal/modalSlice';
import { useAppDispatch } from '../redux/hooks';
import { scrollTo } from '../utils/common';

const LocationInterceptor = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    // TODO subscribe here all reset actions
    //dispatch(resetEntityState());
    dispatch(resetAreaCittadiniState());
    dispatch(resetModalState());
    dispatch(showBreadCrumb());
    dispatch(resetCustomBreadcrumb());
    dispatch(resetInfoIdsBreadcrumb());
    dispatch(resetUserDetails());
    scrollTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

export default LocationInterceptor;
