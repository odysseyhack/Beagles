import initialState from "../initialState";
import { beginApiCall, apiCallError, endApiCall } from "../actions/apiStatusActions";
import * as api from "../../api/api";
import { userSignOffType } from "./userStore";

const storeBookingSuccess = "BOOKING_STORE_SUCCESS";

// export const storeBooking = (booking, mobIdToken) => async (dispatch,getState) => { };
export const storeBooking = (booking, mobIdToken) => async dispatch => {
  dispatch(beginApiCall());
  try {
    const result = await api.registerTravelDetails(mobIdToken, booking);

    if (result.registrationOK || result.processingOK) {
      dispatch({ type: storeBookingSuccess, booking });
    } else {
      dispatch(endApiCall());
    }
    return {
      processingOK: result.processingOK || result.registrationOK,
      errorMessage: result.errorMessage
    };
  } catch (error) {
    dispatch(apiCallError(error));
    throw error;
  }
};

export const reducer = (state = initialState.booking, action) => {
  if (action.type === storeBookingSuccess) {
    return action.booking;
  } else if (action.type === userSignOffType) {
    return null;
  }
  return state;
};
