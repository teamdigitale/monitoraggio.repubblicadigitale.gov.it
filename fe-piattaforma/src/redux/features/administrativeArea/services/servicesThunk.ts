import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../app/appSlice';

import { RootState } from '../../../store';
import { mapOptions } from '../../../../utils/common';
import {
  setEntityFilterOptions,
  setEventsList,
  setServicesDetail,
} from '../administrativeAreaSlice';

const GetAllEventsAction = { type: 'citizensArea/GetAllEvents' };

export interface ServicesI {
  id: string;
  name: string;
  serviceType: string;
  date: string;
  facilitatore: string;
  status: string;
}

export const GetAllEvents =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetAllEventsAction, payload });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { filters, pagination },
      } = select((state: RootState) => state);
      const entityEndpoint = `/eventi/all`;
      const body = {
        ...filters,
      };
      let res;
      if (body) {
        res = await API.post(entityEndpoint, body, { params: pagination });
      } else {
        res = await API.get(entityEndpoint, { params: pagination });
      }
      if (res?.data) {
        dispatch(setEventsList({ data: res.data?.data?.list }));
      }
    } catch (error) {
      console.log('GetEntityValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesAction = {
  type: 'citizensArea/GetEntityFilterValues',
};
export const GetEntityFilterValues =
  (payload?: any) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...GetFilterValuesAction, payload });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        citizensArea: { pagination },
      } = select((state: RootState) => state);
      const entityFilterEndpoint = `areaCittadini/eventi/stati/dropdown/`;
      const res = await API.post(entityFilterEndpoint, { params: pagination });
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            stati: mapOptions(res.data.data.list),
          })
        );
      }
    } catch (error) {
      console.log('GetEntityFilterValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetServicesDetailAction = {
  type: 'citizensArea/GetServicesDetail',
};
export const GetServicesDetail =
  (id: string | undefined, payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetServicesDetailAction, id, payload });
      const res = await API.get('areaAmministrativa/services/servizio1');
      if (res?.data) {
        dispatch(setServicesDetail(res.data.data));
      }
    } catch (error) {
      console.log('GetEntityDetail citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetServicesDetailFiltersAction = {
  type: 'citizensArea/GetServicesDetailFilters',
};
export const GetServicesDetailFilters =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...GetServicesDetailFiltersAction, payload });
      dispatch(showLoader());
      const res = await API.post(
        'areaCittadini/servizi/dettaglio/stati/dropdown'
      );
      if (res?.data) {
        dispatch(
          setEntityFilterOptions({
            stati: mapOptions(res.data.data.list),
          })
        );
      }
    } catch (error) {
      console.log('GetEntityFilterValues citizensArea error', error);
    } finally {
      dispatch(hideLoader());
    }
  };
