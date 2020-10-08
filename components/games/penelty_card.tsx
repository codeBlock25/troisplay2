import { Button, Fab } from "@material-ui/core";
import { Album, Close, Forward } from "@material-ui/icons";
import Axios, { AxiosResponse } from "axios";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import { url } from "../../constant";
import {
  notify,
  setCashWalletCoin,
  setExit,
  setGame,
  setGamepickerform,
  setMyGames,
  setSearchSpec,
  setWalletCoin,
} from "../../store/action";
import {
  eventReducerType,
  gameType,
  modalType,
  NotiErrorType,
} from "../../store/reducer/event";
import { initialStateType } from "../../store/reducer/initial";
import { PayType } from "../gamepicker";
import { playerR } from "../gamepickerform";
import { IniReducerType } from "../panel";
import { CheckerType, PlayType } from "./roshambo";

enum PenaltyOption {
  left,
  right,
  center,
}

export default function Penalty_card() {
  const [{ token }] = useCookies(["token"]);
  const dispatch: Function = useDispatch();
  const [isDemoPlay, setDemoState] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [round1knowState, setKnownState1] = useState<CheckerType>(2);
  const [round2knowState, setKnownState2] = useState<CheckerType>(2);
  const [round3knowState, setKnownState3] = useState<CheckerType>(2);
  const [round4knowState, setKnownState4] = useState<CheckerType>(2);
  const [round5knowState, setKnownState5] = useState<CheckerType>(2);
  const [playStateLoad, setPlayStateLoading] = useState<boolean>(false);
  const [playType, setPlayType] = useState<PlayType>(PlayType.non);
  const [playCount, setPlayCount] = useState<number>(0);
  const [round1, setRound1] = useState<{
    round: number;
    value: PenaltyOption;
  }>({
    round: 1,
    value: PenaltyOption.left,
  });
  const [round2, setRound2] = useState<{
    round: number;
    value: PenaltyOption;
  }>({
    round: 2,
    value: PenaltyOption.left,
  });
  const [round3, setRound3] = useState<{
    round: number;
    value: PenaltyOption;
  }>({
    round: 3,
    value: PenaltyOption.left,
  });
  const [round4, setRound4] = useState<{
    round: number;
    value: PenaltyOption;
  }>({
    round: 4,
    value: PenaltyOption.left,
  });
  const [round5, setRound5] = useState<{
    round: number;
    value: PenaltyOption;
  }>({
    round: 5,
    value: PenaltyOption.left,
  });
  const {
    theme,
    game,
    gameID,
    price,
    games,
    coin,
    cash,
    player,
    defaults,
  } = useSelector<
    {
      initial: initialStateType;
      event: eventReducerType;
    },
    {
      theme: string;
      game: gameType;
      gameID: string;
      price: number;
      coin: number;
      cash: number;
      games: {
        _id?: string;
        gameMemberCount?: number;
        members?: string[];
        priceType?: string;
        price_in_coin?: number;
        price_in_value?: number;
        gameType?: string;
        gameDetail?: string;
        gameID?: gameType;
        played?: boolean;
        date?: Date;
      }[];
      defaults: {
        commission_roshambo: {
          value: number;
          value_in: "$" | "c" | "%";
        };
        commission_penalty: {
          value: number;
          value_in: "$" | "c" | "%";
        };
        commission_guess_mater: {
          value: number;
          value_in: "$" | "c" | "%";
        };
        commission_custom_game: {
          value: number;
          value_in: "$" | "c" | "%";
        };
        cashRating: number;
        min_stack_roshambo: number;
        min_stack_penalty: number;
        min_stack_guess_master: number;
        min_stack_custom: number;
        referRating: number;
      };
      player: playerR;
    }
  >((state) => {
    return {
      theme: state.initial.theme,
      game: state.event.game,
      gameID: state.event.gameID,
      price: state.event.searchspec.price,
      games: state.initial.my_games,
      coin: state.initial.wallet.currentCoin,
      cash: state.initial.cashwallet.currentCash,
      player: state.event.play_as,
      defaults: state.initial.defaults,
    };
  });

  const handleSubmit = async (payWith?: PayType) => {
    if (loading) return;
    setLoading(true);
    if (isEmpty(gameID)) {
      await Axios({
        method: "POST",
        url: `${url}/games/penalty`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          price_in_cash: price,
          gameInPut: {
            round1: round1.value,
            round2: round2.value,
            round3: round3.value,
            round4: round4.value,
            round5: round5.value,
          },
          payWith,
        },
      })
        .then(
          ({
            data: { game },
          }: AxiosResponse<{
            game: {
              _id?: string;
              gameMemberCount?: number;
              members?: string[];
              priceType?: string;
              price_in_coin?: number;
              price_in_value?: number;
              gameType?: string;
              gameDetail?: string;
              gameID?: gameType;
              played?: boolean;
              date?: Date;
            };
          }>) => {
            dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
            dispatch(setGame(gameType.non, ""));
            dispatch(setMyGames([game, ...games]));
            if (payWith === PayType.cash) {
              dispatch(setCashWalletCoin(cash - price));
            }
            if (payWith === PayType.coin) {
              dispatch(setWalletCoin(coin - price * defaults.cashRating));
            }
            dispatch(setGamepickerform(modalType.close));
            dispatch(
              notify({
                isOPen: modalType.open,
                msg:
                  "Congratulations!!!! You have successfully played a game, please wait for Player 2",
                type: NotiErrorType.state,
              })
            );
          }
        )
        .catch((err) => {
          if (err.message === "Request failed with status code 401") {
            dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
            dispatch(setGame(gameType.non, ""));
            dispatch(setGamepickerform(modalType.close));
            if (window.innerWidth < 650) {
              toast.dark("Insufficient Fund", { position: "bottom-right" });
            } else {
              toast.dark("Insufficient Fund");
            }
            return;
          }
          if (window.innerWidth < 650) {
            toast.error(
              "An error occured please recheck your connection and try again",
              { position: "bottom-right" }
            );
          } else {
            toast.error(
              "An error occured please recheck your connection and try again"
            );
          }
        })
        .finally(() => {
          setLoading(false);
          setDemoState(true);
          setRound1({ round: 1, value: PenaltyOption.left });
          setRound2({ round: 2, value: PenaltyOption.left });
          setRound3({ round: 3, value: PenaltyOption.left });
          setRound4({ round: 4, value: PenaltyOption.left });
          setRound5({ round: 5, value: PenaltyOption.left });
        });
    } else {
      await Axios({
        method: "POST",
        url: `${url}/games/penalty/challange`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          id: gameID,
          gameInPut: {
            round1: round1.value,
            round2: round2.value,
            round3: round3.value,
            round4: round4.value,
            round5: round5.value,
          },
        },
      })
        .then(
          ({
            data: { winner, price },
          }: AxiosResponse<{ winner: boolean; price: number }>) => {
            dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
            dispatch(setGame(gameType.non, ""));
            dispatch(setGamepickerform(modalType.close));
            dispatch(setWalletCoin(coin + price));
            dispatch(
              notify({
                isOPen: modalType.open,
                msg: winner
                  ? `Congratualations You just won this game and have gained $${price}`
                  : "Sorry you lost.",
                type: winner ? NotiErrorType.success : NotiErrorType.error,
              })
            );
          }
        )
        .catch((err) => {
          console.log(err);
          if (window.innerWidth < 650) {
            toast.error(
              "An error occured please recheck your connection and try again",
              { position: "bottom-right" }
            );
          } else {
            toast.error(
              "An error occured please recheck your connection and try again"
            );
          }
        })
        .finally(() => {
          setLoading(false);
          setDemoState(true);
          setRound1({ round: 1, value: PenaltyOption.left });
          setRound2({ round: 2, value: PenaltyOption.left });
          setRound3({ round: 3, value: PenaltyOption.left });
          setRound4({ round: 4, value: PenaltyOption.left });
          setRound5({ round: 5, value: PenaltyOption.left });
        });
    }
  };

  const handleCheck = async (
    round: number,
    gameInPut: number
  ): Promise<void> => {
    if (playStateLoad) return;
    setPlayStateLoading(true);
    await Axios({
      method: "POST",
      url: `${url}/games/penalty/challange/one-on-one`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        id: gameID,
        gameInPut,
        round,
      },
    })
      .then(
        ({
          data: { winner, final, price },
        }: AxiosResponse<{
          winner: boolean;
          final: boolean;
          price: number;
        }>) => {
          switch (round) {
            case 1:
              setKnownState1(winner ? CheckerType.won : CheckerType.lost);
              break;
            case 2:
              setKnownState2(winner ? CheckerType.won : CheckerType.lost);
              break;
            case 3:
              setKnownState3(winner ? CheckerType.won : CheckerType.lost);
              break;
            case 4:
              setKnownState4(winner ? CheckerType.won : CheckerType.lost);
              break;
            case 5:
              setKnownState5(winner ? CheckerType.won : CheckerType.lost);
              break;
            default:
              return;
          }
          if (final) {
            dispatch(setCashWalletCoin(cash + price));
            setLoading(false);
            setDemoState(true);
            dispatch(setGame(gameType.non, ""));
            setKnownState1(CheckerType.unknown);
            setKnownState2(CheckerType.unknown);
            setKnownState3(CheckerType.unknown);
            setKnownState4(CheckerType.unknown);
            setKnownState5(CheckerType.unknown);
            setRound1({ round: 1, value: PenaltyOption.left });
            setRound2({ round: 2, value: PenaltyOption.left });
            setRound3({ round: 3, value: PenaltyOption.left });
            setRound4({ round: 4, value: PenaltyOption.left });
            setRound5({ round: 5, value: PenaltyOption.left });
            if (price > 0) {
              dispatch(
                notify({
                  isOPen: modalType.open,
                  msg: `Congratualations You just won this game and have gained $${price}`,
                  type: NotiErrorType.success,
                })
              );
            } else {
              dispatch(
                notify({
                  isOPen: modalType.open,
                  msg: `Ooooh sorry, you just lostthis game.`,
                  type: NotiErrorType.error,
                })
              );
            }
          }
          setPlayCount((prev) => {
            return prev + 1;
          });
        }
      )
      .catch(console.error)
      .finally(() => {
        setPlayStateLoading(false);
      });
  };

  if (game === gameType.penalth_card)
    return (
      <div className={`gameworld theme ${theme}`}>
        {playType === PlayType.non && player === playerR.second ? (
          <div className="container">
            <div className="content">
              <div className="action">
                <Button
                  className="btn_"
                  onClick={() => {
                    setPlayType(PlayType.one_by_one);
                  }}
                >
                  Play
                </Button>
                <Button
                  className="btn_"
                  onClick={() => {
                    setPlayType(PlayType.all);
                    dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
                  }}
                >
                  Stimulate Play
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="world spin penalty">
            {" "}
            {!isEmpty(gameID) && (
              <Fab
                className="close_btn"
                onClick={() => {
                  dispatch(
                    setExit({
                      open: modalType.open,
                      func: async () => {
                        await Axios({
                          method: "POST",
                          url: `${url}/games/penalty/exit`,
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          data: {
                            id: gameID,
                          },
                        })
                          .then(() => {
                            dispatch(setGame(gameType.non, ""));
                            setLoading(false);
                            setDemoState(true);
                            setKnownState1(CheckerType.unknown);
                            setKnownState2(CheckerType.unknown);
                            setKnownState3(CheckerType.unknown);
                            setKnownState4(CheckerType.unknown);
                            setKnownState5(CheckerType.unknown);
                            setRound1({ round: 1, value: PenaltyOption.left });
                            setRound2({ round: 2, value: PenaltyOption.left });
                            setRound3({ round: 3, value: PenaltyOption.left });
                            setRound4({ round: 4, value: PenaltyOption.left });
                            setRound5({ round: 5, value: PenaltyOption.left });
                            dispatch(
                              setSearchSpec({ game: gameType.non, price: 0 })
                            );
                            dispatch(setGamepickerform(modalType.close));
                          })
                          .catch(() => {
                            toast.error("Network Error!.");
                          });
                      },
                    })
                  );
                }}
              >
                <Close />
              </Fab>
            )}
            <h3 className="title">
              {isEmpty(gameID) ? "Taker" : "Goalkeeper"}
            </h3>
            <h3 className="title">
              {player === playerR.second
                ? "Try to catch the ball by guessing Player one's shot direction"
                : "Set your shot directions"}
            </h3>
            <p className={`txt theme ${theme}`}>
              NOTE: You Pick your moves by clicking/tapping the icons to each
              option, hit play when your okay with your set pattern.
            </p>
            <div className="content">
              <div className="round">
                <span className={`name theme ${theme}`}>
                  First Penalty Take:
                </span>
                <span
                  className={`value ${
                    round1.value === PenaltyOption.left ? "left" : ""
                  }`}
                  title={
                    round1.value === PenaltyOption.left
                      ? "Left shot"
                      : round1.value === PenaltyOption.right
                      ? "Right shot"
                      : ""
                  }
                  onClick={() => {
                    setRound1((prev) => {
                      return {
                        round: 1,
                        value:
                          prev.value === PenaltyOption.left
                            ? PenaltyOption.right
                            : prev.value === PenaltyOption.right
                            ? PenaltyOption.left
                            : PenaltyOption.left,
                      };
                    });
                  }}
                >
                  {round1.value === PenaltyOption.left ? (
                    <Forward />
                  ) : round1.value === PenaltyOption.right ? (
                    <Forward />
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(gameID) && playType === PlayType.one_by_one && (
                  <Button
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleCheck(round1.round, round1.value)}
                    className={`btn_check theme ${theme} ${
                      round1knowState === CheckerType.unknown
                        ? "play"
                        : round1knowState === CheckerType.won
                        ? "won"
                        : round1knowState === CheckerType.lost
                        ? "lost"
                        : ""
                    }`}
                  >
                    {round1knowState === CheckerType.unknown
                      ? "play"
                      : round1knowState === CheckerType.won
                      ? "won"
                      : round1knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </Button>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>
                  Second Penalty Take:
                </span>
                <span
                  className={`value ${
                    round2.value === PenaltyOption.left ? "left" : ""
                  }`}
                  title={
                    round2.value === PenaltyOption.left
                      ? "Left shot"
                      : round2.value === PenaltyOption.right
                      ? "Right shot"
                      : ""
                  }
                  onClick={() => {
                    setRound2((prev) => {
                      return {
                        round: 2,
                        value:
                          prev.value === PenaltyOption.left
                            ? PenaltyOption.right
                            : prev.value === PenaltyOption.right
                            ? PenaltyOption.left
                            : PenaltyOption.left,
                      };
                    });
                  }}
                >
                  {round2.value === PenaltyOption.left ? (
                    <Forward />
                  ) : round2.value === PenaltyOption.right ? (
                    <Forward />
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(gameID) && playType === PlayType.one_by_one && (
                  <Button
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleCheck(round2.round, round2.value)}
                    className={`btn_check theme ${theme} ${
                      round2knowState === CheckerType.unknown
                        ? "play"
                        : round2knowState === CheckerType.won
                        ? "won"
                        : round2knowState === CheckerType.lost
                        ? "lost"
                        : ""
                    }`}
                  >
                    {round2knowState === CheckerType.unknown
                      ? "play"
                      : round2knowState === CheckerType.won
                      ? "won"
                      : round2knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </Button>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>
                  Thrid Penalty Take:
                </span>
                <span
                  className={`value ${
                    round3.value === PenaltyOption.left ? "left" : ""
                  }`}
                  title={
                    round3.value === PenaltyOption.left
                      ? "Left shot"
                      : round3.value === PenaltyOption.right
                      ? "Right shot"
                      : ""
                  }
                  onClick={() => {
                    setRound3((prev) => {
                      return {
                        round: 3,
                        value:
                          prev.value === PenaltyOption.left
                            ? PenaltyOption.right
                            : prev.value === PenaltyOption.right
                            ? PenaltyOption.left
                            : PenaltyOption.left,
                      };
                    });
                  }}
                >
                  {round3.value === PenaltyOption.left ? (
                    <Forward />
                  ) : round3.value === PenaltyOption.right ? (
                    <Forward />
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(gameID) && playType === PlayType.one_by_one && (
                  <Button
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleCheck(round3.round, round3.value)}
                    className={`btn_check theme ${theme} ${
                      round3knowState === CheckerType.unknown
                        ? "play"
                        : round3knowState === CheckerType.won
                        ? "won"
                        : round3knowState === CheckerType.lost
                        ? "lost"
                        : ""
                    }`}
                  >
                    {round3knowState === CheckerType.unknown
                      ? "play"
                      : round3knowState === CheckerType.won
                      ? "won"
                      : round3knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </Button>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>
                  Fouth Penalty Take:
                </span>
                <span
                  className={`value ${
                    round4.value === PenaltyOption.left ? "left" : ""
                  }`}
                  title={
                    round4.value === PenaltyOption.left
                      ? "Left shot"
                      : round4.value === PenaltyOption.right
                      ? "Right shot"
                      : ""
                  }
                  onClick={() => {
                    setRound4((prev) => {
                      return {
                        round: 4,
                        value:
                          prev.value === PenaltyOption.left
                            ? PenaltyOption.right
                            : prev.value === PenaltyOption.right
                            ? PenaltyOption.left
                            : PenaltyOption.left,
                      };
                    });
                  }}
                >
                  {round4.value === PenaltyOption.left ? (
                    <Forward />
                  ) : round4.value === PenaltyOption.right ? (
                    <Forward />
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(gameID) && playType === PlayType.one_by_one && (
                  <Button
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleCheck(round4.round, round4.value)}
                    className={`btn_check theme ${theme} ${
                      round4knowState === CheckerType.unknown
                        ? "play"
                        : round4knowState === CheckerType.won
                        ? "won"
                        : round4knowState === CheckerType.lost
                        ? "lost"
                        : ""
                    }`}
                  >
                    {round4knowState === CheckerType.unknown
                      ? "play"
                      : round4knowState === CheckerType.won
                      ? "won"
                      : round4knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </Button>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>
                  Fifth Penalty Take:
                </span>
                <span
                  className={`value ${
                    round5.value === PenaltyOption.left ? "left" : ""
                  }`}
                  title={
                    round5.value === PenaltyOption.left
                      ? "Left shot"
                      : round5.value === PenaltyOption.right
                      ? "Right shot"
                      : ""
                  }
                  onClick={() => {
                    setRound5((prev) => {
                      return {
                        round: 5,
                        value:
                          prev.value === PenaltyOption.left
                            ? PenaltyOption.right
                            : prev.value === PenaltyOption.right
                            ? PenaltyOption.left
                            : PenaltyOption.left,
                      };
                    });
                  }}
                >
                  {round5.value === PenaltyOption.left ? (
                    <Forward />
                  ) : round5.value === PenaltyOption.right ? (
                    <Forward />
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(gameID) && playType === PlayType.one_by_one && (
                  <Button
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleCheck(round5.round, round5.value)}
                    className={`btn_check theme ${theme} ${
                      round5knowState === CheckerType.unknown
                        ? "play"
                        : round5knowState === CheckerType.won
                        ? "won"
                        : round5knowState === CheckerType.lost
                        ? "lost"
                        : ""
                    }`}
                  >
                    {round5knowState === CheckerType.unknown
                      ? "play"
                      : round5knowState === CheckerType.won
                      ? "won"
                      : round5knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </Button>
                )}
              </div>
            </div>
            {isEmpty(gameID) ? (
              <div className="game_action">
                <Button
                  className={`btn_ theme ${theme}`}
                  onClick={() => {
                    handleSubmit(PayType.cash);
                  }}
                >
                  {loading ? (
                    <MoonLoader size="20px" color={`white`} />
                  ) : (
                    "Play with cash"
                  )}
                </Button>
                <Button
                  className={`btn_ ${theme} theme`}
                  onClick={() => {
                    handleSubmit(PayType.coin);
                  }}
                >
                  {loading ? (
                    <MoonLoader size="20px" color={`white`} />
                  ) : (
                    "Play with coin"
                  )}
                </Button>
              </div>
            ) : playType === PlayType.all ? (
              <Button
                className={`btn_ theme ${theme}`}
                onClick={() => handleSubmit()}
              >
                {isEmpty(gameID) ? (
                  loading ? (
                    <MoonLoader size="20px" color={`white`} />
                  ) : (
                    "Play"
                  )
                ) : loading ? (
                  <MoonLoader size="20px" color={`white`} />
                ) : (
                  "challange"
                )}
              </Button>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    );
  else return <></>;
}
