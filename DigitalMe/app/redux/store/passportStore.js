import { beginApiCall, apiCallError } from "../actions/apiStatusActions";
import initialState from "../initialState";
import * as api from "../../api/api";
import { userSignOffType, signInSuccess } from "./userStore";

const registeredSuccess = "REGISTER_PASSPORT_SUCCESS";
const passportHackPassport = "HACK_PASSPORT";

export function registerPassport(passportData) {
  return async function(dispatch, getState) {
    dispatch(beginApiCall());
    try {
      const response = await api.registerPassport(passportData);
      if (response.registrationOK) {
        passportData.mobIdToken = response.mobIdToken;
        passportData.mobValidUntil = response.validUntil;

        const signature = await generateSignature(passportData.documentNumber);
        passportData.documentNumberSignature = signature;

        dispatch({ type: registeredSuccess, passport: passportData });
        dispatch(signInSuccess({ name: passportData.lastName }));
      } else {
        dispatch({ type: registeredSuccess, passport: null });
      }
      return response.registrationOK;
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
}

export function hackPassportNumber(newNumber) {
  return async dispatch => {
    dispatch({ type: passportHackPassport, newNumber: newNumber });
  };
}

async function generateSignature(value) {
  const response = await api.generatesignaturePost(value);
  if (
    response.errorMessage === undefined ||
    response.errorMessage === null ||
    response.errorMessage === ""
  ) {
    return response.signatures[0];
    //return "TestTest:)";
  }
}

export const reducer = (state = initialState.passport, action) => {
  if (action.type === registeredSuccess) {
    return action.passport;
  } else if (action.type === passportHackPassport) {
    debugger;
    const newState = { ...state, documentNumber: action.newNumber };
    return newState;
  } else if (action.type === userSignOffType) {
    return null;
  }
  return state;
};
