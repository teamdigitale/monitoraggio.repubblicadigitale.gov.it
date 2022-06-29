import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface ProjectStateI {
  details?: {
    generalInfo?: {
      name: string;
    };
    facilitationNumber?: {
      name: string;
    };
    uniqueUsers?: {
      name: string;
    };
    services?: {
      name: string;
    };
    facilitators?: {
      name: string;
    };
  };
}
const initialState: ProjectStateI = {};
export const progrettoSlice = createSlice({
  name: 'progetto',
  initialState,
  reducers: {
    setProjectDetails: (state, action: PayloadAction<any>) => {
      if (action.payload.currentStep === 2) {
        state.details = {
          ...state.details,
          generalInfo: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 3) {
        state.details = {
          ...state.details,
          facilitationNumber: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 4) {
        state.details = {
          ...state.details,
          uniqueUsers: action.payload.newFormValues,
        };
      } else if (action.payload.currentStep === 5) {
        state.details = {
          ...state.details,
          services: action.payload.newFormValues,
        };
      } else {
        state.details = {
          ...state.details,
          facilitators: action.payload.newFormValues,
        };
      }
    },
    resetProjectDetails: (state) => {
      state.details = {};
    },
  },
});
export const { setProjectDetails, resetProjectDetails } =
  progrettoSlice.actions;
//export const selectProgram = (state: RootState) => state.programma.programma;
export default progrettoSlice.reducer;
