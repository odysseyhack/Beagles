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

      //Harm de mapper hier heeft een booking nodig
      const attributes = infoRequest.requestedAttributes.map(value =>
        attributesToInfo(value, passport, booking)
      );

      const result = await api.authorizeInfoRequest(
        passport,
        booking,
        infoRequest,
        attributes
      );

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

export const reducer = (state, action) => {
  state = state || initialState;

  // if (action.type === infoRequestAccepted) {
  //   return {
  //     ...state,
  //     startDateIndex: action.startDateIndex,
  //     isLoading: true
  //   };
  // }

  // if (action.type === receiveWeatherForecastsType) {
  //   return {
  //     ...state,
  //     startDateIndex: action.startDateIndex,
  //     forecasts: action.forecasts,
  //     isLoading: false
  //   };
  // }

  return state;
};
