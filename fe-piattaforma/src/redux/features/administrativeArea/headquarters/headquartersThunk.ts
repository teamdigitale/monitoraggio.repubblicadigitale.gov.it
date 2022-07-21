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
  codiceFiscale?: string;
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
export const GetHeadquarterLightDetails =
  (headquarterId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetHeadquartersDetailAction, headquarterId });
      const res = await API.get(`sede/light/${headquarterId}`);

      if (res?.data) {
        dispatch(
          setHeadquarterDetails({
            dettagliInfoSede: res.data.dettaglioSede,
            facilitatoriSede: res.data.facilitatoriSede,
            dettaglioProgetto: res.data.dettaglioProgetto,
          })
        );
      }
    } catch (error) {
      console.log('GetHeadquartersDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const GetHeadquarterDetails =
  (headquarterId: string, authorityId: string, projectId: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetHeadquartersDetailAction, headquarterId });
      const res = await API.get(
        `sede/${projectId}/${authorityId}/${headquarterId}`
      );

      if (res?.data) {
        dispatch(
          setHeadquarterDetails({
            dettagliInfoSede: res.data.dettaglioSede,
            facilitatoriSede: res.data.facilitatoriSede,
            dettaglioProgetto: res.data.dettaglioProgetto,
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

      dispatch(setHeadquarterDetails(null));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const AssignFacilitatorAction = {
  type: 'administrativeArea/AssignFacilitator',
};

export const AssignHeadquarterFacilitator =
  (
    userDetail: any,
    authorityId: string,
    projectId: string,
    headquarterId: string
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...AssignFacilitatorAction });
    const endpoint = '/sede/associa/facilitatore';

    const body = {
      cfUtente: userDetail?.codiceFiscale?.toString().toUpperCase(),
      idEnte: authorityId,
      idProgetto: projectId,
      idSede: headquarterId,
      tipoContratto: userDetail?.tipoContratto,
    };

    try {
      if (userDetail?.id) {
        await API.post(endpoint, body);
      } else {
        const payload = {
          telefono: userDetail?.telefono,
          codiceFiscale: userDetail?.codiceFiscale?.toString().toUpperCase(),
          cognome: userDetail?.cognome,
          email: userDetail?.email,
          mansione: userDetail?.mansione,
          nome: userDetail?.nome,
          ruolo: '',
          tipoContratto: userDetail?.tipoContratto, // TODO: valore?
        };

        const res = await API.post(`/utente`, payload);
        if (res) {
          await API.post(endpoint, body);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

const RemoveFacilitatorAction = {
  type: 'administrativeArea/RemoveFacilitator',
};

export const RemoveHeadquarterFacilitator =
  (
    userCF: any,
    authorityId: string,
    projectId: string,
    headquarterId: string
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(showLoader());
    dispatch({ ...RemoveFacilitatorAction });
    const endpoint = '/sede/associa/facilitatore';

    const body = {
      cfUtente: userCF,
      idEnte: authorityId,
      idProgetto: projectId,
      idSede: headquarterId,
    };

    try {
      await API.post(endpoint, {
        ...body,
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };
