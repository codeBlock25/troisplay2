import { cloneDeep, remove, set, sortBy } from "lodash";
import { ClassType } from "react";
import { Dispatch } from "redux";
import {
  choices,
  errorType,
  Games,
  modalType,
  NotiErrorType,
  notificationHintType,
  PayType,
  PlayerType,
  ReasonType,
} from "../../typescript/enum";
import { ActionType } from "../../typescript/interface";

export const initReduceGameState = {
  init: ({
    dispatch,
    payload,
  }: {
    dispatch: Dispatch<ActionType<any>>;
    payload: {
      roomGames: any;
      my_games: any;
      gameDefaults: any;
      playerRecord: any;
      spin_details: any;
      notifications: any;
    };
  }) => {
    dispatch({ type: "INIT", payload: { ...payload, luckyGames: [] } });
  },
  clear: () => {},
  lucky_games: () => {},
  room_games: () => {},
  my_games: () => {},
  request_games: () => {},
  spin_games: () => {},
};

export const MyGamesAction = {
  add: ({
    dispatch,
    payload,
  }: {
    dispatch: Dispatch<ActionType<any>>;
    payload: any;
  }) => {
    dispatch({ type: "PLAYED", payload });
  },
  remover: () => {},
  clear: () => {},
  reInit: () => {},
  update: ({
    dispatch,
    newGame,
    games,
    oldGameID,
  }: {
    dispatch: Dispatch<ActionType<any>>;
    oldGameID: string;
    newGame: any;
    games: {
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
          correct_answer: string;
        };
        player2?: {
          answer: string;
          waiting: boolean;
          correct_answer: string;
        };
      };
    }[];
  }) => {
    let games_ = cloneDeep(games);
    remove(games_, { _id: oldGameID });
    let update = [...games_, newGame];
    dispatch({ type: "GAME_UPDATE", payload: update });
  },
};

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
  dispatch({ type: "ACTION", payload });
};

export const setGameDetails = (
  dispatch: (t: ActionType) => void,
  payload: {
    player: PlayerType;
    id: string;
    price: number;
    payType?: PayType;
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
    msg: string;
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
        player2?: {
          answer: string;
          waiting: boolean;
        };
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

export const NotificationAction = {
  markRead: ({
    notifications,
    dispatch,
  }: {
    notifications: {
      message: string;
      time: Date;
      type: notificationHintType;
      hasNew: boolean;
    }[];
    dispatch: Dispatch<ActionType>;
  }) => {
    let allNotifications = cloneDeep(notifications);
    let removed = remove(allNotifications, { hasNew: true });
    removed.map((noti) => {
      set(noti, "hasNew", false);
    });
    dispatch({
      type: "NOTIFICATIONS",
      payload: sortBy([...allNotifications, ...removed], { time: -1 }),
    });
  },
};
