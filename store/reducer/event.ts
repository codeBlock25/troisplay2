import {
  Games,
  modalType,
  NotiErrorType,
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
    default:
      return { ...state };
  }
};
