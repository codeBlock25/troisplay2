import { Button } from '@material-ui/core';
import React from 'react';
import { GameCoin } from "../icon";

export default function Picker({
  title,
  subText,
  earn,
  btnFunc,
  btnText,
  image,
}: {
  image: string;
  title: string;
  subText: string;
  earn: number | string;
  btnText: string;
  btnFunc: () => void;
}) {
  return (
    <div className="noti">
      <div className="main">
        <div className="date">
          <span>{title}</span>
          <span>{subText}.</span>
        </div>
        <div className="btw">
          <span className="avatar" />
        </div>
      </div>
      <div className="games" style={{ backgroundImage: `url(${image})` }} />
      <span className="cash">
        <strong>Earn:</strong> <GameCoin />
        {` ` + earn}
      </span>
      <div className="action">
        <Button className="btn_" onClick={btnFunc}>
          {btnText}
        </Button>
      </div>
    </div>
  );
}
