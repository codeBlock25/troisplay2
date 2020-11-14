import { createStore, combineReducers } from "redux";
import { eventReducer } from "./reducer/event";
import InitialReducer from "./reducer/initial";

const reducer = combineReducers({
  event: eventReducer,
  init: InitialReducer
});

const store = createStore(reducer);

export default store;
