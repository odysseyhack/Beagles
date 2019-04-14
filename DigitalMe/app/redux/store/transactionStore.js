import initialState from "../initialState";
import { beginApiCall, apiCallError } from "../actions/apiStatusActions";
import * as api from "../../api/api";

const getTransactionReportSuccess = "GET_TRANSACTIONREPORT_SUCCESS";

export const actionCreators = {
  getTransactionReport: mobIdToken => async (dispatch, getState) => {
    dispatch(beginApiCall());
    try {
      const result = await api.getTransactionReport(mobIdToken);
      dispatch({ type: getTransactionReportSuccess });

      return {
        transactions: result.transactions,
        errorMessage: result.errorMessage
      };
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
