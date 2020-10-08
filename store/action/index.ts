import {
  Games,
  modalType,
  NotiErrorType,
  PlayerType,
} from "../../typescript/enum";
import { ActionType } from "../../typescript/interface";

export const notify = (
  dispatch: (t: ActionType) => void,
  payload: {
    type: NotiErrorType;
    msg: string;
    isOpen: modalType;
  }
): void => {
  dispatch({ type: "NOTIFICATION", payload });
};
export const setGameDetails = (
  dispatch: (t: ActionType) => void,
  payload: {
    player: PlayerType;
    game: Games;
    id: string;
    price: number;
  }
): void => {
  dispatch({ type: "GAME_DETAILS", payload });
};
