import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { backWin, exitWin } from "../store/action";
import { Games, modalType } from "../typescript/enum";
import { reducerType } from "../typescript/interface";

export default function BackWindow() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { back_ } = useSelector<
    reducerType,
    {
      back_: { open: modalType; func?: () => Promise<void>; game?: Games , msg: string};
    }
  >((state) => {
    return { back_: state.event.back };
  });
  const theme = "dark-mode";
  return (
    <section
      className={`exit_window theme ${theme} ${
        back_.open === modalType.open && "open"
      }`}
    >
      <div className="container">
        <h3 className="title">
          Action needed.
        </h3>
        <p className="txt">
          {back_.msg}</p>
        <div className="action">
          <Button
            className={`btn_ theme ${theme}`}
            onClick={async () => {
              if (loading) return;
              if (!back_.func) return;
              setLoading(true);
              await back_.func().finally(() => {
                setLoading(false);
                backWin(dispatch, {...back_, open: modalType.close, msg: "",});
              });
            }}
          >
            stay
          </Button>
          <Button
            className={`btn_ theme ${theme}`}
            onClick={() => {
              if (loading) return;
              backWin(dispatch, { open: modalType.close, func: null, msg: "" });
            }}
          >
            back
          </Button>
        </div>
      </div>
    </section>
  );
}
