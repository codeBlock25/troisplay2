import { urlObjectKeys } from "next/dist/next-server/lib/utils";
import { ParsedUrlQueryInput } from "querystring";
import { initReducerType } from "../store/reducer/initial";
import {
  Games,
  modalType,
  NotiErrorType,
  PlayerType,
  errorType,
  choices,
  ReasonType,
  PayType,
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
    payWith: PayType;
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
          correct_answer: string;
        };
        player2?: {
          waiting: boolean;
          answer: string;
          correct_answer: string;
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
export interface UrlObject {
  auth?: string | null;
  hash?: string | null;
  host?: string | null;
  hostname?: string | null;
  href?: string | null;
  pathname?: string | null;
  protocol?: string | null;
  search?: string | null;
  slashes?: boolean | null;
  port?: string | number | null;
  query?: string | null | ParsedUrlQueryInput;
}

export interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
}

export type Url = UrlObject | string;

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
    | "NOTIFICATIONS"
    | "GAME_UPDATE"
    | "PLAYED";
  payload: T;
}

export interface reducerType {
  event: eventReeducerType;
  init: initReducerType;
}

// <div className={`btn_ theme ${theme}`} onClick={() => matchPlay()}>
//   {loading === TwoButtonLoader.first_loading ? (
//     <SyncLoader size="10px" color={`white`} />
//   ) : (
//     <>Play</>
//   )}
// </div>;
