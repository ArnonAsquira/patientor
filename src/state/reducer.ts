import { State } from "./state";
import { Diagnosis, Entry, Patient, SinglePatient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "DISPLAY_PATIENT";
      payload: SinglePatient;
    }
  | {
      type: "SET_DIAGNOSIS";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: { id: string; entry: Entry };
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DIAGNOSIS":
      return {
        ...state,
        diagnosis: action.payload,
      };
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "DISPLAY_PATIENT":
      return {
        ...state,
        patient: action.payload,
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patient: {
          ...state.patient,
          entries: [
            ...(state.patient.entries as Entry[]),
            action.payload.entry,
          ],
        },
      };
    default:
      return state;
  }
};
