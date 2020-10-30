import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameCoin } from "../icon";
import { choices, Games, modalType, PayType } from "../typescript/enum";
import { reducerType } from "../typescript/interface";
import moment from "moment";
import { setCustomWindow, toast } from "../store/action";
import Axios from "axios";
import { url } from "../constant";
import { getToken } from "../functions";

export default function CustomWindow() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const { window } = useSelector<
    reducerType,
    {
      window: {
        isOpen: modalType;
        request?: {
          date: Date;
          gameDetail: string;
          gameID: Games;
          gameMemberCount: number;
          gameType: Games;
          members: string[];
          playCount: number;
          price_in_coin: number;
          price_in_value: number;
          _id: string;
          battleScore: {
            player1: {
              endDate: Date;
              title: string;
              description: string;
              answer: string;
              endGameTime: Date;
              choice: choices;
            };
            player2?: {};
          };
        };
      };
    }
  >((state) => {
    return {
      window: state.event.customWindow,
    };
  });
  const handleJoin = async (payWith: PayType) => {
    if (loading) return;
    setLoading(true);
    await Axios.get(`${url}/games/custom-game/challange`, {
      headers: { authorization: `Bearer ${getToken()}` },
      params: { gameID: window?.request._id, payWith, answer },
    })
      .then(() => {
        toast(dispatch, { msg: "" }).close();
        toast(dispatch, {
          msg:
            "The game is all set, sit tight and with for your judge daty to come, In the mean time you can try more games here on Trois.",
        }).success();
        setCustomWindow(dispatch, {
          isOpen: modalType.close,
          request: undefined,
        });
        setAnswer("");
      })
      .catch(() => {
        toast(dispatch, { msg: "" }).close();
        toast(dispatch, {
          msg:
            "An Error Occured retrying to communicate with Troisplay Server, Please check you internet connection and try again.",
        }).fail();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div
      className={
        window.isOpen === modalType.open ? "CustomWindow open" : "CustomWindow"
      }
    >
      <div className="container">
        <h3 className="title">{window.request?.battleScore.player1.title}</h3>
        <p className="txt">
          <b>Description: </b>
          {window.request?.battleScore.player1.description}
        </p>
        <p className="txt">
          <b>Join Expiration Date: </b>
          {window.request?.battleScore.player1.endDate}
        </p>
        <p className="txt">
          <b>Game Exit Date: </b>
          {moment(
            window.request?.battleScore?.player1?.endDate ?? new Date()
          ).format("Do MMMM, YYYY")}
          {"  "}
          {moment(
            window.request?.battleScore.player1.endGameTime ?? new Date()
          ).format("hh:mm a")}
          .
        </p>
        <p className="txt">
          <b>Join Fee $: </b>
          {window?.request?.price_in_value}
        </p>
        <p className="txt">
          <b>
            Join Fee <GameCoin />:{" "}
          </b>
          {window?.request?.price_in_coin}
        </p>
        {!window?.request?.battleScore?.player2 ? (
          <TextField
            variant="filled"
            className="inputBox"
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        ) : (
          <></>
        )}
        <div className="action">
          {window?.request?.battleScore?.player2 ? (
            <Button
              className="btn"
              onClick={() => {
              }}
            >
              Judge
            </Button>
          ) : (
            <>
              <Button
                className="btn"
                onClick={() => {
                  handleJoin(PayType.cash);
                }}
              >
                Join with Cash
              </Button>
              <Button
                className="btn"
                onClick={() => {
                  handleJoin(PayType.coin);
                }}
              >
                Join with Coin
              </Button>
            </>
          )}
          <Button
            className="btn"
            onClick={() => {
              if (loading) return;
              setCustomWindow(dispatch, {
                isOpen: modalType.close,
                request: undefined,
              });
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
