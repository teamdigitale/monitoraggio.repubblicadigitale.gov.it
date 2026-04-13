import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface PrimoServizioCittadinoI {
  idCittadino: number;
  codiceFiscale: string;
  genere: string;
  fascia: string;
  titoloDiStudio: string;
  occupazione: string;
  cittadinanza: string;
  idServizio: number;
  regioneProvincia: string;
  nomeGestore: string;
  cup: string;
  nomeServizio: string;
  nomePuntoFacilitazione: string;
  indirizzoPuntoFacilitazione: string;
  nomeFacilitatore: string;
  dataServizio: string;
  tipologiaServizio: string;
  competenzaDigitale: string | null;
}

export interface ScartoRicercaI {
  riga: number;
  codice: string;
}

export interface RicercaMultiplaResultI {
  trovati: PrimoServizioCittadinoI[];
  nonTrovati: (ScartoRicercaI | string)[];
}

interface RicercaCittadiniStateI {
  ricercaSingola: {
    result: PrimoServizioCittadinoI[];
    hasSearched: boolean;
    errorMessage: string;
  };
  ricercaMultipla: {
    result: RicercaMultiplaResultI | null;
    hasSearched: boolean;
  };
  schedaCittadino: PrimoServizioCittadinoI | null;
}

const initialState: RicercaCittadiniStateI = {
  ricercaSingola: {
    result: [],
    hasSearched: false,
    errorMessage: '',
  },
  ricercaMultipla: {
    result: null,
    hasSearched: false,
  },
  schedaCittadino: null,
};

export const ricercaCittadiniSlice = createSlice({
  name: 'ricercaCittadini',
  initialState,
  reducers: {
    resetRicercaCittadiniState: () => initialState,
    setRicercaSingolaResult: (
      state,
      action: PayloadAction<PrimoServizioCittadinoI[]>
    ) => {
      state.ricercaSingola.result = action.payload;
      state.ricercaSingola.hasSearched = true;
      state.ricercaSingola.errorMessage = action.payload.length > 0
        ? ''
        : 'Il cittadino non \u00e8 presente su Facilita. Verifica l\u2019esattezza dei dati inseriti ed effettua una nuova ricerca.';
    },
    resetRicercaSingola: (state) => {
      state.ricercaSingola = initialState.ricercaSingola;
    },
    setRicercaMultiplaResult: (
      state,
      action: PayloadAction<RicercaMultiplaResultI>
    ) => {
      state.ricercaMultipla.result = action.payload;
      state.ricercaMultipla.hasSearched = true;
    },
    resetRicercaMultipla: (state) => {
      state.ricercaMultipla = initialState.ricercaMultipla;
    },
    setSchedaCittadino: (
      state,
      action: PayloadAction<PrimoServizioCittadinoI | null>
    ) => {
      state.schedaCittadino = action.payload;
    },
    resetSchedaCittadino: (state) => {
      state.schedaCittadino = null;
    },
  },
});

export const {
  resetRicercaCittadiniState,
  setRicercaSingolaResult,
  resetRicercaSingola,
  setRicercaMultiplaResult,
  resetRicercaMultipla,
  setSchedaCittadino,
  resetSchedaCittadino,
} = ricercaCittadiniSlice.actions;

export const selectRicercaSingola = (state: RootState) =>
  state.ricercaCittadini.ricercaSingola;

export const selectRicercaMultipla = (state: RootState) =>
  state.ricercaCittadini.ricercaMultipla;

export const selectSchedaCittadino = (state: RootState) =>
  state.ricercaCittadini.schedaCittadino;

export default ricercaCittadiniSlice.reducer;
