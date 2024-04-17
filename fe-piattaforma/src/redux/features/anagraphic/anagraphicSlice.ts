import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { RegexpType, validator } from '../../../utils/validator';

export interface UserAnagraphicStateI {
  id: string;
  nome: string;
  cognome: string;
  profilePic: string;
}

export interface AnagraphicStateI {
  idsToGet: string[];
  anagraphics: { [key: string]: UserAnagraphicStateI; };
}

const initialState: AnagraphicStateI = {
  idsToGet: [],
  anagraphics: {},
};

export const anagraphicSlice = createSlice({
  name: 'anagraphic',
  initialState,
  reducers: {
    cleanIdsToGet: (state, action: PayloadAction<any>) => {
      state.idsToGet = state.idsToGet.filter(
        (x) => !action.payload.includes(x)
      );
    },
    getAnagraphicID: (
      state,
      action: PayloadAction<{ id: string | number }>
    ) => {
      if (
        action?.payload?.id?.toString()?.trim()?.length &&
        validator(
          { regex: RegexpType.NUMBER },
          action?.payload?.id?.toString()?.trim(),
          true
        )
      ) {
        state.idsToGet = [
          ...new Set([...state.idsToGet, action.payload.id.toString()?.trim()]),
        ];
      }
    },
    setAnagraphics: (state, action: PayloadAction<any>) => {
      state.anagraphics = {
        ...state.anagraphics,
        ...action.payload,
      };
    },
  },
});

export const { getAnagraphicID, cleanIdsToGet, setAnagraphics } =
  anagraphicSlice.actions;

export const selectIdsToGet = (state: RootState) => state.anagraphic.idsToGet;
export const selectAnagraphics = (state: RootState) =>
  state.anagraphic.anagraphics;

export default anagraphicSlice.reducer;
