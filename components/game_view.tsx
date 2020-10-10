import { AxiosResponse } from "axios";
import moment from "moment";
import { memo } from "react";
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
  type="normal",
  btn1func,
  btn2func,
  btn1view,
  btn2view,v1,v2,v3
}: {
    v1?: number | string;
  v2?: number | string
  v3?: number | string
  name: string;
  date: Date;
  id: string;
  cash: number;
    coin: number;
  game: Games
  type:"game_view"|"normal" | "lucky" | "room",
    btn1func?: () => Promise<void>
  btn1view?: JSX.Element
  btn2func?:()=>Promise<void>
  btn2view?: JSX.Element
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
      <div className="viewee">
        {
          type === "lucky" ? (
            <>
            <span className="stake">$ {v1 ?? 0}
            </span>
            <span className="coin">
              <GameCoin width={10} height={10} /> {v2 ?? 0}
            </span>
              <span className="Win">$ {v3 ?? 0}</span>
              </>
        ):
          type === "room" ? (
            <>
            <span className="entry ($)">$ {v1 ?? 0}
            </span>
            <span className="entry (coin)">
              <GameCoin width={10} height={10} /> {v2 ?? 0}
            </span>
              <span className="Members">{v3 ?? 0}</span>
              </>
              )
        :(
        <>
          <span className="stake">
            $ {cash.toLocaleString().slice(0, 7)}
            {cash.toString().length >= 6 ?? "+"}
          </span>
          <span className="coin">
            <GameCoin width={10} height={10} />
            {coin.toLocaleString().slice(0, 7)}
            {coin.toString().length >= 6 ?? "+"}
          </span>
          <span className="earning">$ {getPrice(game,cash,defaults?.data?.default)}</span>
        </>
        )}
      </div>
      {
        type==="normal"?
       (
          <div className="action">
        <span className="btn">{btn1view ?? "view"}</span>
        <span className="btn">{btn2view ??"cancel"}</span>
      </div>
      ): (
          <div className="action">
        <span className="btn" onClick={btn1func}>{btn1view ??"play with $"}</span>
        <span className="btn" onClick={btn2func}>{btn2view ?? <>play with <GameCoin/></>}</span>
      </div>
      )}
    </div>
  );
});

export default GameView;
