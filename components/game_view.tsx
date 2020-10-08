import { AxiosResponse } from "axios";
import moment from "moment";
import { memo } from "react";
import { queryCache, useQueryCache } from "react-query";
import { GameCoin } from "../icon";

const GameView = memo(function ({
  date,
  name,
  coin,
  cash,
}: {
  name: string;
  date: Date;
  id: string;
  cash: number;
  coin: number;
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
        <span className="cash">
          $ {cash.toLocaleString().slice(0, 7)}
          {cash.toString().length >= 6 ?? "+"}
        </span>
        <span className="coin">
          <GameCoin width={10} height={10} />
          {coin.toLocaleString().slice(0, 7)}
          {coin.toString().length >= 6 ?? "+"}
        </span>
        <span className="earning"></span>
      </div>
      <div className="action">
        <span className="btn">view</span>
        <span className="btn">cancel</span>
      </div>
    </div>
  );
});

export default GameView;
