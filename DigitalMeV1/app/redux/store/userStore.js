import initialState from "../initialState";
import { beginApiCall,endApiCall, apiCallError } from "../actions/apiStatusActions";
import * as api from "../../api/api";

const userLoginSuccessType = "USER_LOGIN_SUCCESS";

// By convention, actions that end in "_SUCCESS" are assumed to have been the result of a completed
// API call. But since we're doing an optimistic delete, we're hiding loading state.
// So this action name deliberately omits the "_SUCCESS" suffix.
// If it had one, our apiCallsInProgress counter would be decremented below zero
// because we're not incrementing the number of apiCallInProgress when the delete request begins.
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
