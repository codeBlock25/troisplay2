import {
  Games,
  modalType,
  NotiErrorType,
  errorType,
  PlayerType,
} from "../../typescript/enum";
import { ActionType, eventReeducerType } from "../../typescript/interface";

const initialState: eventReeducerType = {
  notification: {
    type: NotiErrorType.ok,
    msg: "",
    isOpen: modalType.close,
  },
  game_details: {
    player: PlayerType.first,
    game: Games.non,
    id: "",
    price: 0,
  },
  toastNotification: {
    isOpen: modalType.close,
    msg: "",
    error: errorType.non,
  },
};

export const eventReducer = (
  state = initialState,
  action: ActionType
): eventReeducerType => {
  switch (action.type) {
    case "NOTIFICATION":
      return { ...state, notification: action.payload };
    case "GAME_DETAILS":
      return { ...state, game_details: action.payload };
    case "TOAST":
      return { ...state, toastNotification: action.payload };
    default:
      return { ...state };
  }
};
