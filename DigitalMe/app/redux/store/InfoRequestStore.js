import initialState from "../initialState";
import * as api from "../../api/api";
import { attributesToInfo } from "../../types/mobTypes";
import { beginApiCall, apiCallError } from "../actions/apiStatusActions";

const infoRequestAccepted = "ACCEPT_INFOREQUEST_SUCCESS";
const infoRequestDeclined = "DECLINE_INFOREQUEST_SUCCESS";

// export const acceptRequest = (infoRequest, booking) => async (dispatch,getState) => { };

export function acceptRequest(infoRequest) {
  return async function(dispatch, getState) {
    try {
      const booking = getState().booking;
      const passport = getState().passport;
      dispatch(beginApiCall());

      const infoAttributes = infoRequest.requestedAttributes.map(value =>
        attributesToInfo(value, passport, booking)
      );

      const params = { passport, booking, infoRequest, infoAttributes };
      const result = await api.authorizeInfoRequest(params);

      dispatch({ type: infoRequestAccepted });

      return result.registrationOK || result.processingOK;
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
}

export function declineRequest(infoRequest, mobIdToken) {
  return async function(dispatch, getState) {
    try {
      dispatch(beginApiCall());

      const result = await api.declineInfoRequest(mobIdToken, infoRequest);

      dispatch({ type: infoRequestDeclined });

      return result.registrationOK || result.processingOK;
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  };
}

export const reducer = (state = initialState.apiCallsInProgress, action) => {
  return state;
};
