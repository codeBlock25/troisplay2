import { ClassType } from "react";
import {
  choices,
  errorType,
  Games,
  modalType,
  NotiErrorType,
  PlayerType,
  ReasonType,
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

export const setAction = (
  dispatch: (t: ActionType) => void,
  payload: ReasonType
) => {
  dispatch({type: "ACTION", payload})
}

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

export const exitWin = (
  dispatch: (t: ActionType) => void,
  payload: {
    open: modalType;
    func?: () => Promise<void>;
    game?: Games;
  }
): void => {
  dispatch({ type: "EXIT", payload });
};

export const backWin = (
  dispatch: (t: ActionType) => void,
  payload: {
    open: modalType;
    func?: () => Promise<void> | void | boolean;
    game?: Games;
    msg: string
  }
): void => {
  dispatch({ type: "BACK", payload });
};

export const setCustomWindow = (
  dispatch: (t: ActionType) => void,
  payload: {
    isOpen: modalType;
    game: {
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: Games;
      members: string[];
      playCount: number;
      price_in_coin: number;
      price_in_value: number;
      _id: string;
      battleScore: {
        player1: {
          endDate: Date;
          title: string;
          description: string;
          answer: string;
          endGameTime: Date;
          choice: choices;
        };
        player2?: {};
      };
    };
  }
): void => {
  dispatch({ type: "CUSTOMWINDOW", payload });
};

export const toast = (
  dispatch: (t: ActionType) => void,
  payload: {
    msg: string;
  }
): {
  error: () => void;
  success: () => void;
  close: () => void;
  fail: () => void;
} => {
  return {
    error: () =>
      dispatch({
        type: "TOAST",
        payload: { ...payload, error: errorType.error, isOpen: modalType.open },
      }),
    success: () =>
      dispatch({
        type: "TOAST",
        payload: {
          ...payload,
          error: errorType.success,
          isOpen: modalType.open,
        },
      }),
    close: () =>
      dispatch({
        type: "TOAST",
        payload: { error: errorType.non, msg: "", isOpen: modalType.close },
      }),
    fail: () =>
      dispatch({
        type: "TOAST",
        payload: { ...payload, error: errorType.fail, isOpen: modalType.open },
      }),
  };
};
