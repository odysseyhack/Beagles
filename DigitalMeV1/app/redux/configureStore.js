import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { loadState, persistStore } from "./persist";

import apiCallsInProgress from "./reducers/apiStatusReducer";
import { reducer as user } from "./store/userStore";
import { reducer as passport } from "./store/passportStore";
// import passportReducer from "./reducers/passportReducer";
import { reducer as infoRequest } from "./store/InfoRequestStore";
import { reducer as wallet } from "./store/walletStore";
import { reducer as transactions } from "./store/transactionStore";
import { reducer as booking } from "./store/bookingStore";

const rootReducer = combineReducers({
  apiCallsInProgress,
  user,
  passport,
  infoRequest,
  wallet,
  transactions,
  booking
});

const configureStore = async () => {
  const initialState = await loadState();
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
  persistStore(store);
  return store;
};

export default configureStore;

// export default configureStore = initialState => {
//   const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
//   persistStore(store);
//   return store;
// };

// export default function configureStore(initialState) {
//   return createStore(rootReducer, initialState, applyMiddleware(thunk));
// }
