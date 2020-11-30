import { Dispatch, memo, SetStateAction } from "react";
import { NAIRA } from "../constant";
import { GameCoin } from "../icon";

const GameView2 = memo(function ({
  coin,
  cash,
  title,
  description,
  winnings,
  playerJoined,
  playerNeeded,
  type,
  btn1func,
  btn2func,
}: {
  title?: string;
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
      <span className="name">{title ?? "Lucky games"}</span>
      <span className="date">{description}</span>
      <span style={{ color: "white" }}>Players Needed: {playerNeeded}</span>
      <span style={{ color: "white" }}>Players Joined: {playerJoined}</span>
      <div className="viewee">
        <span className="stake">
          <NAIRA /> {cash}
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
        </div>
      )}
    </div>
  );
});

export default GameView2;
