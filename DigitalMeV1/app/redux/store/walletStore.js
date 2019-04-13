import initialState from "../initialState";
import { beginApiCall, apiCallError } from "../actions/apiStatusActions";
import * as api from "../../api/api";

const getWalletstatusSuccess = "GET_WALLETSTATUS_SUCCESS";

export const actionCreators = {
  getWalletstatus: mobIdToken => async (dispatch, getState) => {
    dispatch(beginApiCall());
    try {
      const result = await api.getWalletstatus(mobIdToken);

      dispatch({ type: getWalletstatusSuccess });

      return ({ valid, validUntil, errorMessage } = result);
    } catch (error) {
      dispatch(apiCallError(error));
      throw error;
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState.apiCallsInProgress;

  return state;
};
