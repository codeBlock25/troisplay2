import { memo } from "react";
import { GameCoin } from "../icon";

const GameView2 = memo(function ({
  coin,
  cash,
  description,
  winnings,
  playerJoined,
  playerNeeded,
}: {
  cash: number;
  coin: number;
  winnings: number;
  description: string;
  playerNeeded: number;
  playerJoined: number;
}) {
  return (
    <div className="game_content_view">
      <span className="name">lucky games</span>
      <span className="name" style={{ fontSize: 14, color: "orange" }}>
        Description:
      </span>
      <span className="date">{description}</span>
      <span style={{ color: "white" }}>Players Needed: {playerNeeded}</span>
      <span style={{ color: "white" }}>Players Joined: {playerJoined}</span>
      <div className="viewee">
        <span className="stake">$ {cash}</span>
        <span className="coin">
          <GameCoin width={10} height={10} /> {coin}
        </span>
        <span className="Win">$ {winnings}</span>
      </div>
    </div>
  );
});

export default GameView2;

/*
{
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
}
*/
