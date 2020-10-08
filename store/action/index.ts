import { ClassType } from "react";
import {
  errorType,
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

export const toast = (
  dispatch: (t: ActionType) => void,
  payload: {
    isOpen: modalType;
    msg: string;
  }
): {
  error: () => void;
  success: () => void;
  close: () => void;
} => {
  return {
    error: () =>
      dispatch({
        type: "TOAST",
        payload: { ...payload, error: errorType.error },
      }),
    success: () =>
      dispatch({
        type: "TOAST",
        payload: { ...payload, error: errorType.success },
      }),
    close: () =>
      dispatch({
        type: "TOAST",
        payload: { error: errorType.non, msg: "", isOpen: modalType.close },
      }),
  };
};
