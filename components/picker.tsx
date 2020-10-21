import { Button } from '@material-ui/core';
import React from 'react';

export default function Picker({title, subText, earn, btnFunc, btnText}: {title: string, subText: string,earn: number, btnText: string, btnFunc: ()=>void}) {
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
  <div className="games lucky" />
  <span className="cash">
    <strong>Earn:</strong> {earn}
  </span>
  <div className="action">
    <Button
      className="btn_"
      onClick={btnFunc}
    >
    {btnText}
    </Button>
  </div>
</div>

  );
}
