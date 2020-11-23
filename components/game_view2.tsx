import { Dispatch, memo, SetStateAction } from "react";
import { NAIRA } from "../constant";
import { GameCoin } from "../icon";

const GameView2 = memo(function ({
  coin,
  cash,
  description,
  winnings,
  playerJoined,
  playerNeeded,
  type,
  btn1func,
  btn2func,
}: {
  type?: "picker" | "normal";
  cash: number;
  coin: number;
  winnings: number;
  description: string;
  playerNeeded: number;
  playerJoined: number;
  btn1func?: () =>
    | Promise<void>
    | void
    | boolean
    | Dispatch<SetStateAction<any>>;
  btn2func?: () =>
    | Promise<void>
    | void
    | boolean
    | Dispatch<SetStateAction<any>>;
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
        <span className="stake">
          <NAIRA /> {cash}
        </span>
        <span className="coin">
          <GameCoin width={10} height={10} /> {coin}
        </span>
        <span className="Win">
          <NAIRA /> {winnings}
        </span>
      </div>
      {type && type === "picker" && (
        <div className="action">
          <span className="btn" onClick={btn1func}>
            play with <NAIRA />
          </span>
          <span className="btn" onClick={btn2func}>
            play with <GameCoin />
          </span>
        </div>
      )}
    </div>
  );
});

export default GameView2;
