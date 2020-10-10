import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { exitWin } from "../store/action";
import { Games, modalType } from "../typescript/enum";
import { reducerType } from "../typescript/interface";

export default function Exitwindow() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { exit } = useSelector<
    reducerType,
    {
      exit: { open: modalType; func?: () => Promise<void>; game?: Games };
    }
  >((state) => {
    return { exit: state.event.exit };
  });
  const theme = "dark-mode";
  return (
    <section
      className={`exit_window theme ${theme} ${
        exit.open === modalType.open && "open"
      }`}
    >
      <div className="container">
        <h3 className="title">
          {exit.game === Games.custom_game ? "Reject Game" : "Exit Game."}
        </h3>
        <p className="txt">
          {exit.game === Games.custom_game
            ? "Are yu sure you want to reject this game. Please note this is a one time option as you want be able to undo this action."
            : `Are you sure you want to leave this game. please not by leaving this game without concluding on a winner you automatically lose this game.`}
        </p>
        <div className="action">
          <Button
            className={`btn_ theme ${theme}`}
            onClick={async () => {
              if (loading) return;
              if (!exit.func) return;
              setLoading(true);
              await exit.func().finally(() => {
                setLoading(false);
                exitWin(dispatch, { open: modalType.close, func: null });
              });
            }}
          >
            {loading ? (
              <SyncLoader size="10px" color={"white"} />
            ) : exit.game === Games.custom_game ? (
              "reject"
            ) : (
              "leave"
            )}
          </Button>
          <Button
            className={`btn_ theme ${theme}`}
            onClick={() => {
              if (loading) return;
              exitWin(dispatch, { open: modalType.close, func: null });
            }}
          >
            {exit.game === Games.custom_game ? "cancel" : "stay"}
          </Button>
        </div>
      </div>
    </section>
  );
}
