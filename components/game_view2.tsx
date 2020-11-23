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
