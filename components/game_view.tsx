import { AxiosResponse } from "axios";
import moment from "moment";
import { Dispatch, memo, SetStateAction } from "react";
import { queryCache, useQueryCache } from "react-query";
import { getPrice } from "../functions";
import { GameCoin } from "../icon";
import { Games } from "../typescript/enum";

const GameView = memo(function ({
  date,
  name,
  coin,
  cash,
  game,
  type = "normal",
  btn1func,
  btn2func,
  btn1view,
  btn2view,
  v1,
  v2,
  v3,
  date2,
}: {
  date2?: Date;
  v1?: number | string;
  v2?: number | string;
  v3?: number | string;
  v4?: number | string;
  name: string;
  date: Date;
  id: string;
  cash: number;
  coin: number;
  game: Games;
  type: "game_view" | "normal" | "lucky" | "room" | "custom" | "custom2";
  btn1func?: () =>
    | Promise<void>
    | void
    | boolean
    | Dispatch<SetStateAction<any>>;
  btn1view?: JSX.Element | string;
  btn2func?: () =>
    | Promise<void>
    | void
    | boolean
    | Dispatch<SetStateAction<any>>;
  btn2view?: JSX.Element | string;
}) {
  const defaults: AxiosResponse<{
    default: {
      commission_roshambo: {
        value: number;
        value_in: "$" | "%" | "c";
      };
      commission_penalty: {
        value: number;
        value_in: "$" | "%" | "c";
      };
      commission_guess_mater: {
        value: number;
        value_in: "$" | "%" | "c";
      };
      commission_custom_game: {
        value: number;
        value_in: "$" | "%" | "c";
      };
      cashRating: number;
      min_stack_roshambo: number;
      min_stack_penalty: number;
      min_stack_guess_master: number;
      min_stack_custom: number;
      referRating: number;
    };
  }> = useQueryCache().getQueryData("defaults");
  return (
    <div className="game_content_view">
      <span className="name">{name}</span>
      <span className="date">{moment(date).format("Do MMMM, YYYY")}</span>
      {date2 ? (
        <span className="date">
          End Date: {moment(date2).format("Do MMMM, YYYY hh:mm a")}
        </span>
      ) : (
        <></>
      )}
      <div className="viewee">
        {type === "lucky" ? (
          <>
            <span className="stake">$ {v1 ?? 0}</span>
            <span className="Win">$ {v3 ?? 0}</span>
          </>
        ) : type === "room" ? (
          <>
            <span className="entry ($)">$ {v1 ?? 0}</span>
            <span className="Members">{v3 ?? 0}</span>
          </>
        ) : (
          <>
            <span className="stake">
              $ {cash.toLocaleString().slice(0, 7)}
              {cash.toString().length >= 6 ?? "+"}
            </span>
            <span className="earning">
              $ {getPrice(game, cash, defaults?.data?.default)}
            </span>
          </>
        )}
      </div>
      {type === "normal" ? (
        <div className="action">
          <span className="btn" onClick={btn1func}>
            {btn1view ?? "view"}
          </span>
          <span className="btn" onClick={btn2func}>
            {btn2view ?? "cancel"}
          </span>
        </div>
      ) : type === "custom" ? (
        <div className="action">
          <span className="btn" onClick={btn1func}>
            {btn1view ?? "view"}
          </span>
          <span className="btn" onClick={btn2func}>
            {btn2view ?? "reject"}
          </span>
        </div>
      ) : type === "custom2" ? (
        <div className="action">
          <span className="btn" onClick={btn1func}>
            {btn1view ?? "view"}
          </span>
        </div>
      ) : (
        <div className="action">
          <span className="btn" onClick={btn1func}>
            {btn1view ?? "play with $"}
          </span>
        </div>
      )}
    </div>
  );
});

export default GameView;
