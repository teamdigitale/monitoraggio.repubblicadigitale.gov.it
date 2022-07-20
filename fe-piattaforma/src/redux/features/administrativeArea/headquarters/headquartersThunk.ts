import { Dispatch } from '@reduxjs/toolkit';
import { AddressInfoI } from '../../../../components/AdministrativeArea/Entities/Headquarters/AccordionAddressList/AccordionAddress/AccordionAddress';
import API from '../../../../utils/apiHelper';
import { hideLoader, showLoader } from '../../app/appSlice';
import {
  setHeadquarterDetails,
  setHeadquartersList,
} from '../administrativeAreaSlice';

export interface HeadquarterLight {
  id: string;
  nome: string;
}

export interface HeadquarterFacilitator {
  nome: string;
  cognome: string;
  id: string;
  stato: string;
}

const SetHeadquartersDetailsAction = {
  type: 'headquarters/SetHeadquartersDetails',
};
export const SetHeadquartersDetails =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SetHeadquartersDetailsAction, payload }); // TODO manage dispatch for dev env only
      dispatch(showLoader());
      if (payload.id) {
        await API.put(`/sedi/${payload.id}`, {
          ...payload,
          id: undefined,
        });
      } else {
        await API.post('/headquarters', { ...payload });
      }
      // dispatch(setSediDetails({ ...payload, id: new Date().getTime() }));
    } finally {
      dispatch(hideLoader());
    }
  };

const GetHeadquartersDetailAction = {
  type: 'administrativeArea/GetHeadquartersDetail',
};
export const GetHeadquarterDetails =
  (idSede: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetHeadquartersDetailAction, idSede });
      const res = await API.get(`sede/light/${idSede}`);
      console.log(res);

      if (res?.data) {
        dispatch(
          setHeadquarterDetails({
            dettagliInfoSede: res.data.dettaglioSede,
          })
        );
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

const GetHeadquartersListAction = {
  type: 'administrativeArea/GetHeadquartersList',
};

export const GetHeadquartersBySearch =
  (search: string) => async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...GetHeadquartersListAction });
    try {
      if (search) {
        const res = await API.get(`/sede/cerca/${search}`);

        if (res.data) {
          dispatch(setHeadquartersList(res.data));
        }
      } else {
        dispatch(setHeadquartersList([]));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const AssignHeadquarterAction = {
  type: 'administrativeArea/AssignHeadquarter',
};

export const AssignAuthorityHeadquarter =
  (authorityId: string, headquarterDetails: any, projectId: string) =>
  async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...AssignHeadquarterAction });
    try {
      let headquarterId = headquarterDetails?.id;

      const body = {
        ...headquarterDetails,
        indirizziSedeFasceOrarie:
          headquarterDetails.indirizziSedeFasceOrarie.map(
            (addressInfo: AddressInfoI) => ({
              ...addressInfo.indirizzoSede,
              fasceOrarieAperturaIndirizzoSede: {
                ...addressInfo.fasceOrarieAperturaIndirizzoSede,
              },
            })
          ),
      };

      if (headquarterId) {
        await API.put(`/sede/aggiorna/${headquarterId}`, { ...body });
      } else {
        const res = await API.post('/sede', {
          ...body,
        });

        if (res?.data) {
          headquarterId = res.data.idSedeCreata;
        }
      }

      if (headquarterId) {
        await API.get(
          `/sede/associa/ente/${authorityId}/sede/${headquarterId}/progetto/${projectId}/ruoloEnte/ruolo`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const RemoveHeadquarterAction = {
  type: 'administrativeArea/RemoveHeadquarter',
};

export const RemoveAuthorityHeadquarter =
  (authorityId: string, headquarterId: string, projectId: string) =>
  async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...RemoveHeadquarterAction });
    try {
      await API.delete(
        `/sede/cancellaOTerminaAssociazione/ente/${authorityId}/sede/${headquarterId}/progetto/${projectId}`
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };
