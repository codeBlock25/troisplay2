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
  game
}: {
  name: string;
  date: Date;
  id: string;
  cash: number;
    coin: number;
  game: Games
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

  console.log("me");
  return (
    <div className="game_content_view">
      <span className="name">{name}</span>
      <span className="date">{moment(date).format("Do MMMM, YYYY")}</span>
      <div className="viewee">
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
      </div>
      <div className="action">
        <span className="btn">view</span>
        <span className="btn">cancel</span>
      </div>
    </div>
  );
});

export default GameView;
