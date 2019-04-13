import { beginApiCall, apiCallError } from "../actions/apiStatusActions";
import initialState from "../initialState";
import * as api from "../../api/api";
import { userSignOffType, signInSuccess } from "./userStore";

const passportRegisteredSuccessType = "REGISTER_PASSPORT_SUCCESS";

export function registerPassport(username, password, passportData) {
  return async dispatch => {
    dispatch(beginApiCall());
    try {
      const response = await api.registerPassport(
        username,
        password,
        passportData
      );

      if (response.registrationOK) {
        passportData.mobIdToken = response.mobIdToken;
        passportData.mobValidUntil = response.validUntil;

        //create user
        const user = {
          name: passportData.lastName,
          username: username,
          password: password
        };

        dispatch({
          type: passportRegisteredSuccessType,
          passport: passportData
        });
        dispatch(signInSuccess(user));
      } else {
        dispatch({ type: passportRegisteredSuccessType, passport: null });
      }
      return response.registrationOK;
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
}

export const reducer = (state = initialState.passport, action) => {
  if (action.type === passportRegisteredSuccessType) {
    return action.passport;
  } else if (action.type === userSignOffType) {
    return null;
  }
  return state;
};
