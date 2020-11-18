import {
  Games,
  modalType,
  NotiErrorType,
  errorType,
  PlayerType,
  ReasonType,
  PayType,
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
    payWith: PayType.cash,
  },
  toastNotification: {
    isOpen: modalType.close,
    msg: "",
    error: errorType.non,
  },
  exit: {
    open: modalType.close,
    func: undefined,
    game: Games.non,
  },
  customWindow: {
    isOpen: modalType.close,
    request: undefined,
  },
  action: ReasonType.non,
  back: {
    msg: "",
    open: modalType.close,
    func: undefined,
    game: Games.non,
  },
};

export const eventReducer = (
  state = initialState,
  action: ActionType
): eventReeducerType => {
  switch (action.type) {
    case "CUSTOMWINDOW":
      return { ...state, customWindow: {isOpen: action.payload.isOpen, request: action.payload.game} };
    case "ACTION":
      return { ...state, action: action.payload };
    case "NOTIFICATION":
      return { ...state, notification: action.payload };
    case "GAME_DETAILS":
      return { ...state, game_details: action.payload };
    case "TOAST":
      return { ...state, toastNotification: action.payload };
    case "EXIT":
      return { ...state, exit: action.payload };
    case "BACK":
      return { ...state, back: action.payload };
    default:
      return { ...state };
  }
};
