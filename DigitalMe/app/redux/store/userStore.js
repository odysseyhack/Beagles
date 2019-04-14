import initialState from "../initialState";
import { beginApiCall, endApiCall, apiCallError } from "../actions/apiStatusActions";
import * as api from "../../api/api";

const userLoginSuccessType = "USER_LOGIN_SUCCESS";
export const userSignOffType = "SIGNOFF_USER_OPTIMISTIC";

export const signOffUser = mobIdToken => async dispatch => {
  dispatch(beginApiCall());
  try {
    const result = await api.forgetMe([mobIdToken]);

    if (result.registrationOK || result.processingOK) {
      dispatch({ type: userSignOffType });
    }
    dispatch(endApiCall());

    return {
      processingOK: result.registrationOK || result.processingOK,
      errorMessage: result.errorMessage
    };
  } catch (error) {
    dispatch(apiCallError(error));
    throw error;
  }
};

export function signInSuccess(user) {
  return { type: userLoginSuccessType, user };
}

export const reducer = (state = initialState.user, action) => {
  switch (action.type) {
    case userLoginSuccessType:
      return action.user;
    case userSignOffType:
      return null;
    default:
      return state;
  }
};
