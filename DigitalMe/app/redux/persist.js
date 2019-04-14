import { AsyncStorage } from "react-native";
import { SecureStore } from "expo";
import initialState from "./initialState";
import throttle from "lodash/throttle";

//https://github.com/redux-saga/redux-saga/issues/627

export const loadState = async () => {
  try {
    // const serializedState = await SecureStore.getItemAsync("state");
    const serializedState = await AsyncStorage.getItem("state");
    if (serializedState !== null) {
      var data = JSON.parse(serializedState);
      data.apiCallsInProgress = 0;
      return data;
    }
  } catch (err) {
    console.log(err);
  }
  return initialState;
};

const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    // SecureStore.setItemAsync("state", serializedState);
    AsyncStorage.setItem("state", serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

// todo: user redux-persist
export const persistStore = store =>
  store.subscribe(() => saveState(store.getState()));
