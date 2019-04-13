import * as types from "../actions/actionTypes";
import initialState from "../initialState";

function actionTypeEndsInSuccess(type) {
  return type.substring(type.length - 8) === "_SUCCESS";
}

export default function apiCallStatusReducer(
  state = initialState.apiCallsInProgress,
  action
) {
  if (action.type == types.BEGIN_API_CALL) {
    return state + 1;
  } else if (
    action.type === types.END_API_CALL ||
    action.type === types.API_CALL_ERROR ||
    actionTypeEndsInSuccess(action.type)
  ) {
    const newCount = state - 1;
    if (newCount < 0) {
      return 0;
    }
    return newCount;
  }

  return state;
}
