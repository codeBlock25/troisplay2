
import { initReducerType } from "../store/reducer/initial";
import {
  Games,
  modalType,
  NotiErrorType,
  PlayerType,
  errorType,
  choices,
  ReasonType,
} from "./enum";

export interface eventReeducerType {
  notification: {
    type: NotiErrorType;
    msg: string;
    isOpen: modalType.close;
  };
  game_details: {
    price: number;
    game: Games;
    id?: string;
    player: PlayerType;
  };
  action: ReasonType;
  customWindow: {
    isOpen: modalType;
    request?: {
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
          waiting: boolean;
          answer: string;
        };
      };
    };
  };
  toastNotification: {
    isOpen: modalType;
    msg: string;
    error: errorType;
  };
  exit: {
    open: modalType;
    func?: () => Promise<void>;
    game?: Games;
  };
  back: {
    msg: "";
    open: modalType;
    func?: () => Promise<void>;
    game?: Games;
  };
}

export interface ActionType<T = any> {
  type:
    | "NOTIFICATION"
    | "GAME_DETAILS"
    | "TOAST"
    | "EXIT"
    | "BACK"
    | "ACTION"
    | "CUSTOMWINDOW"
    | "INIT"
    | "PLAYED";
  payload: T;
}

export interface reducerType {
  event: eventReeducerType;
  init: initReducerType;
}
