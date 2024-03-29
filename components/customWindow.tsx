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
  PlayerType,
} from "../typescript/enum";
import { reducerType } from "../typescript/interface";
import moment from "moment";
import { MyGamesAction, setCustomWindow, toast } from "../store/action";
import Axios from "axios";
import { url } from "../constant";
import { getToken, whoIsThis } from "../functions";
import { isEmpty, isString } from "lodash";
import { ScaleLoader } from "react-spinners";

export default function CustomWindow() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [winner, setWinner] = useState<GameRec>(GameRec.win);

  const { windowData, record, my_games } = useSelector<
    reducerType,
    {
      my_games: {
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
            correct_answer: string;
          };
          player2?: {
            answer: string;
            waiting: boolean;
            correct_answer: string;
          };
        };
      }[];
      windowData: {
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
              correct_answer: string;
            };
            player2?: {
              answer: string;
              waiting: boolean;
              correct_answer: string;
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
      windowData: state.event.customWindow,
      record: state.init.playerRecord,
      my_games: state.init.my_games
    };
  });
  const hanleSubmit = async () => {
    if (loading2) return;
    setLoading2(true);
    await Axios.post(
      `${url}/games/custom-game/judge`,
      {
        choice: answer,
        game_id: windowData.request._id,
      },
      { headers: { authorization: `Bearer ${getToken()}` } }
    )
      .then(() => {
        setCustomWindow(dispatch, {
          isOpen: modalType.close,
          game: undefined,
        });
      })
      .catch(() => {
        toast(dispatch, {
          msg: "An Error Occured please reload the page and try again.",
        }).error();
      })
      .finally(() => setLoading2(false));
  };
  useEffect(() => {
    setWinner(GameRec.win);
    setAnswer(windowData.request?.battleScore.player1?.answer ?? "");
  }, [windowData]);
  const handleJoin = async (payWith: PayType) => {
    if (loading) return;
    setLoading(true);
    await Axios.get(`${url}/games/custom-game/challange`, {
      headers: { authorization: `Bearer ${getToken()}` },
      params: { gameID: windowData?.request._id, payWith, answer },
    })
      .then(({data: {game}}) => {
        toast(dispatch, { msg: "" }).close();
        toast(dispatch, {
          msg:
            "The game is all set, sit tight and with for your judge daty to come, In the mean time you can try more games here on Trois.",
        }).success();
        MyGamesAction.add({dispatch,payload: game})
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
  return (
    <div
      className={
        windowData.isOpen === modalType.open
          ? "CustomWindow open"
          : "CustomWindow"
      }
    >
      <div className="container">
        <h3 className="title">
          {windowData.request?.battleScore.player1.title}
        </h3>
        <p className="txt">
          <b>Description: </b>
          {windowData.request?.battleScore.player1.description}
        </p>
        <p className="txt">
          <b>Join Expiration Date: </b>
          {moment(
            windowData.request?.battleScore.player1.endDate ?? new Date()
          ).format("Do MMMM, YYYY hh:mm a")}
        </p>
        <p className="txt">
          <b>Game Exit Date: </b>
          {moment(
            windowData.request?.battleScore?.player1?.endDate ?? new Date()
          ).format("Do MMMM, YYYY")}{" "}
          {moment(
            windowData.request?.battleScore.player1.endGameTime ?? new Date()
          ).format("hh:mm a")}
          .
        </p>
        <p className="txt">
          <b>Join Fee $: </b>
          {windowData?.request?.price_in_value}
        </p>
        <p className="txt">
          <b>
            Join Fee <GameCoin />:{" "}
          </b>
          {windowData?.request?.price_in_coin}
        </p>
        <p className="txt">
          <b>Player 1's answer: </b>
          {windowData?.request?.battleScore?.player1?.answer ?? ""}.
        </p>
        {windowData?.request?.battleScore?.player2?.answer ? (
          <p className="txt">
            <b>Player 2's answer: </b>
            {windowData?.request?.battleScore?.player2?.answer ?? ""}.
          </p>
        ) : (
          <></>
        )}
        {(record.player?.userID ?? "") ===
          (windowData?.request?.members[0] ?? "") &&
        isEmpty(windowData?.request?.battleScore?.player2) ? (
          <div className="center">
            <p className="text" style={{ padding: "20px 0" }}>
              Waiting for player 2
            </p>
          </div>
        ) : (windowData?.request?.battleScore?.player1?.correct_answer &&
            whoIsThis({
              my_id: record.player.userID,
              game_members: windowData.request.members,
            }) === PlayerType.first) ||
          (windowData?.request?.battleScore?.player2?.correct_answer &&
            whoIsThis({
              my_id: record.player.userID,
              game_members: windowData.request.members,
            }) === PlayerType.second) ? (
          <div className="center">
            <Typography variant="body2">
              Waiting for the next player to judge
            </Typography>
            {windowData?.request?.battleScore?.player1?.correct_answer ?? (
              <p className="txt">
                <b>Player 1's correct answer: </b>
                {windowData?.request?.battleScore?.player1?.correct_answer ??
                  ""}
                .
              </p>
            )}
            {windowData?.request?.battleScore?.player2?.correct_answer ?? (
              <p className="txt">
                <b>Player 2's correct answer: </b>
                {windowData?.request?.battleScore?.player2?.correct_answer ??
                  ""}
                .
              </p>
            )}
          </div>
        ) : !isEmpty(windowData?.request?.battleScore?.player2) ? (
          <div className="center">
            <Typography variant="body2">
              What's the correct answer to this game
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={winner === GameRec.win}
                  onChange={(e) => {
                    setAnswer(windowData.request.battleScore.player1.answer);
                    setWinner(e.target.checked ? GameRec.win : GameRec.lose);
                  }}
                  name="checkedA"
                />
              }
              label={`${
                isString(windowData?.request?.battleScore?.player1?.answer)
                  ? windowData?.request?.battleScore?.player1?.answer
                  : ""
              }`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={winner === GameRec.lose}
                  onChange={(e) => {
                    setAnswer(windowData.request.battleScore.player2.answer);
                    setWinner(e.target.checked ? GameRec.lose : GameRec.win);
                  }}
                  name="checkedB"
                />
              }
              label={`${
                windowData?.request?.battleScore?.player2?.answer ?? ""
              } `}
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
          {!isEmpty(windowData?.request?.battleScore?.player2) ? (
            <Button
              className="btn"
              onClick={() => {
                hanleSubmit();
              }}
            >
              {loading2 ? <ScaleLoader /> : "Judge"}
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
