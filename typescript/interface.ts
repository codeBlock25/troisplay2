
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
  exit: {
    open: modalType;
    func?: () => Promise<void>;
    game?: Games;
  };
  back: {
    msg: "",
    open: modalType;
    func?: () => Promise<void>;
    game?: Games;
  };
}

export interface ActionType<T = any> {
  type: "NOTIFICATION" | "GAME_DETAILS" | "TOAST" | "EXIT" | "BACK";
  payload: T;
}

export interface reducerType {
  event: eventReeducerType;
}
