
import { Games, modalType, NotiErrorType, PlayerType, errorType } from "./enum";

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
  toastNotification: {
    isOpen: modalType;
    msg: string;
    error: errorType;
  };
}

export interface ActionType<T = any> {
  type: "NOTIFICATION" | "GAME_DETAILS" | "TOAST";
  payload: T;
}

export interface reducerType {
  event: eventReeducerType;
}
