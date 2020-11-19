import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameCoin } from "../icon";
import {
  choices,
  GameRec,
  Games,
  modalType,
  PayType,
} from "../typescript/enum";
import { reducerType } from "../typescript/interface";
import moment from "moment";
import { setCustomWindow, toast } from "../store/action";
import Axios from "axios";
import { url } from "../constant";
import { getToken } from "../functions";
import { isEmpty, isString } from "lodash";

export default function CustomWindow() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [winner, setWinner] = useState<GameRec>(GameRec.win);

  const { window, record } = useSelector<
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
            player2?: {
              answer: string;
              waiting: boolean;
            };
          };
        };
      };
      record: {
        player: {
          userID: string;
          full_name: string;
          phone_number: string;
          playerpic: string;
          playername: string;
          email: string;
          location: string;
        };
        deviceSetup: {
          userID: string;
          isDarkMode: boolean;
          remember: boolean;
          online_status: boolean;
          email_notification: boolean;
          app_notification: boolean;
          mobile_notification: boolean;
        };
        referal: {
          userID: string;
          activeReferal: number;
          inactiveReferal: number;
          refer_code: string;
        };
        wallet: {
          userID: string;
          currentCoin: number;
          pendingCoin: number;
        };
        gamerecord: {
          userID: string;
          date_mark: Date;
          game: Games;
          won: string;
          earnings: number;
        }[];
        cashwallet: {
          userID: string;
          currentCash: number;
          pendingCash: number;
        };
      };
    }
  >((state) => {
    return {
      window: state.event.customWindow,
      record: state.init.playerRecord,
    };
  });
  const hanleSubmit = async () => {
    if (loading2) return;
    setLoading2(true);
    await Axios.post(
      `${url}/games/custom/judge`,
      {
        choice: answer,
        game_id: window.request._id,
      },
      { headers: { authorization: `Bearer ${getToken()}` } }
    )
      .then()
      .catch()
      .finally(() => setLoading2(false));
  };
  useEffect(() => {
    setWinner(GameRec.win);
  }, [window]);
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
          game: undefined,
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
  console.log(
    (record.player?.userID ?? "") !== (window?.request?.members[0] ?? ""),
    record.player?.userID ?? "",
    window?.request?.members[0] ?? "",
    window?.request?.members
  );
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
          {moment(
            window.request?.battleScore.player1.endDate ?? new Date()
          ).format("Do MMMM, YYYY hh:mm a")}
        </p>
        <p className="txt">
          <b>Game Exit Date: </b>
          {moment(
            window.request?.battleScore?.player1?.endDate ?? new Date()
          ).format("Do MMMM, YYYY")}{" "}
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
        <p className="txt">
          <b>Player 1's answer: </b>
          {window?.request?.battleScore?.player1?.answer ?? ""}.
        </p>
        {window?.request?.battleScore?.player2?.answer ? (
          <p className="txt">
            <b>Player 2's answer: </b>
            {window?.request?.battleScore?.player2?.answer ?? ""}.
          </p>
        ) : (
          <></>
        )}
        {(record.player?.userID ?? "") ===
          (window?.request?.members[0] ?? "") &&
        isEmpty(window?.request?.battleScore?.player2) ? (
          <div className="center">
            <p className="text" style={{ padding: "20px 0" }}>
              Waiting for player 2
            </p>
          </div>
        ) : !isEmpty(window?.request?.battleScore?.player2) ? (
          <div className="center">
            <Typography variant="body2">
              What the correct anser to this games
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={winner === GameRec.win}
                  onChange={(e) => {
                    setAnswer(window.request.battleScore.player1.answer);;
                    setWinner(e.target.checked ? GameRec.win : GameRec.lose);
                  }}
                  name="checkedA"
                />
              }
              label={`${
                isString(window?.request?.battleScore?.player1?.answer)
                  ? window?.request?.battleScore?.player1?.answer
                  : ""
              }`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={winner === GameRec.lose}
                  onChange={(e) => {
                    setAnswer(window.request.battleScore.player2.answer);
                    setWinner(e.target.checked ? GameRec.lose : GameRec.win);
                  }}
                  name="checkedB"
                />
              }
              label={`${window?.request?.battleScore?.player2?.answer ?? ""} `}
            />
          </div>
        ) : (
          <TextField
            variant="filled"
            className="inputBox"
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}
        <div className="action">
          {!isEmpty(window?.request?.battleScore?.player2) ? (
            <Button
              className="btn"
              onClick={() => {
                hanleSubmit();
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
                game: undefined,
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
