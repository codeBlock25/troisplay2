import { Games, modalType, NotiErrorType, PlayerType } from "./enum";

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
}

export interface ActionType<T = any> {
  type: "NOTIFICATION" | "GAME_DETAILS";
  payload: T;
}

export interface reducerType {
  event: eventReeducerType;
}
