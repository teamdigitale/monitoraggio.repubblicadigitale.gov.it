import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  resetPublishedContentState,
  resetCustomBreadcrumb,
  resetInfoIdsBreadcrumb,
  showBreadCrumb,
} from '../redux/features/app/appSlice';
import { resetUserDetails } from '../redux/features/administrativeArea/administrativeAreaSlice';
import { resetAreaCittadiniState } from '../redux/features/citizensArea/citizensAreaSlice';
import { resetForumRecords } from '../redux/features/forum/forumSlice';
import { resetModalState } from '../redux/features/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getUnreadNotificationsCount, scrollTo } from '../utils/common';
import { validateSession } from '../utils/sessionHelper';
import { selectProfile } from '../redux/features/user/userSlice';

const LocationInterceptor = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userRole = useAppSelector(selectProfile)?.codiceRuolo

  useEffect(() => {
    // TODO subscribe here all reset actions
    //dispatch(resetEntityState());
    dispatch(resetAreaCittadiniState());
    dispatch(resetModalState());
    dispatch(resetPublishedContentState());
    dispatch(showBreadCrumb());
    dispatch(resetCustomBreadcrumb());
    dispatch(resetInfoIdsBreadcrumb());
    dispatch(resetForumRecords());
    dispatch(resetUserDetails());
    scrollTo(0);
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (userRole) {
      getUnreadNotificationsCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, location.pathname])

  return null;
};

export default LocationInterceptor;
