import { createStore, combineReducers } from "redux";
import { eventReducer } from "./reducer/event";

const reducer = combineReducers({
  event: eventReducer,
});

const store = createStore(reducer);

export default store;
