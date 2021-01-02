import Axios, { AxiosResponse } from "axios";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { url } from "../../constant";
import { CloseIcon, ForwardIcon, GameCoin, GoalPostIcon } from "../../icon";
import { getGamePlay, getPrice, getToken } from "../../functions";
import {
  MyGamesAction,
  notify,
  setGameDetails,
  toast,
} from "../../store/action";
import {
  CheckerType,
  GameRec,
  Games,
  modalType,
  NotiErrorType,
  PayType,
  PenaltyOption,
  PlayerType,
  PlayType,
  TwoButtonLoader,
} from "../../typescript/enum";
import { reducerType } from "../../typescript/interface";
import { useRouter } from "next/router";

export default function Penalty_card() {
  const dispatch = useDispatch();
  const [winner, setWinner] = useState<GameRec>(GameRec.draw);
  const [loading, setLoading] = useState<TwoButtonLoader>(
    TwoButtonLoader.no_loading
  );
  const [round1knowState, setKnownState1] = useState<CheckerType>(
    CheckerType.unknown
  );
  const [round2knowState, setKnownState2] = useState<CheckerType>(
    CheckerType.unknown
  );
  const [round3knowState, setKnownState3] = useState<CheckerType>(
    CheckerType.unknown
  );
  const [round4knowState, setKnownState4] = useState<CheckerType>(
    CheckerType.unknown
  );
  const [round5knowState, setKnownState5] = useState<CheckerType>(
    CheckerType.unknown
  );
  const { push, asPath } = useRouter();
  const [p2Round1knowState, _setP2KnownState1] = useState<PenaltyOption>(
    PenaltyOption.left
  );
  const [p2Round2knowState, _setP2KnownState2] = useState<PenaltyOption>(
    PenaltyOption.left
  );
  const [p2Round3knowState, _setP2KnownState3] = useState<PenaltyOption>(
    PenaltyOption.left
  );
  const [p2Round4knowState, _setP2KnownState4] = useState<PenaltyOption>(
    PenaltyOption.left
  );
  const [p2Round5knowState, _setP2KnownState5] = useState<PenaltyOption>(
    PenaltyOption.left
  );
  const [playStateLoad, setPlayStateLoading] = useState<boolean>(false);
  const [playType, setPlayType] = useState<PlayType>(PlayType.all);
  const [done, setDone] = useState(false);
  const { defaults } = useSelector<
    reducerType,
    {
      defaults: {
        commission_roshambo: {
          value: number;
          value_in: "$" | "%" | "c";
        };
        commission_penalty: {
          value: number;
          value_in: "$" | "%" | "c";
        };
        commission_guess_mater: {
          value: number;
          value_in: "$" | "%" | "c";
        };
        commission_custom_game: {
          value: number;
          value_in: "$" | "%" | "c";
        };
        cashRating: number;
        min_stack_roshambo: number;
        min_stack_penalty: number;
        min_stack_guess_master: number;
        min_stack_custom: number;
        referRating: number;
      };
    }
  >((state) => {
    return {
      defaults: state.init.gameDefaults,
    };
  });

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
  const { details } = useSelector<
    reducerType,
    {
      details: {
        price: number;
        game: Games;
        id?: string;
        player: PlayerType;
      };
    }
  >((state) => {
    return {
      details: state.event.game_details,
    };
  });
  const theme = "dark-mode";

  const handleSubmit = async (payWith?: PayType) => {
    try {
      if (loading !== TwoButtonLoader.no_loading) return;
      let token = getToken();
      if (payWith === PayType.cash) {
        setLoading(TwoButtonLoader.first_loading);
      } else {
        setLoading(TwoButtonLoader.second_loading);
      }
      if (isEmpty(details.id)) {
        await Axios({
          method: "POST",
          url: `${url}/games/penalty`,
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: {
            price_in_cash: details.price,
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
                gameID?: Games;
                played?: boolean;
                date?: Date;
              };
            }>) => {
              MyGamesAction.add({ dispatch, payload: game });
              setGameDetails(dispatch, {
                player: PlayerType.first,

                id: undefined,
                price: 0,
              });
              toast(dispatch, {
                msg: `Congratulations!!!! You have successfully played a game, please wait for Player 2's challange.`,
              }).success();
              push("/games");
            }
          )
          .catch((err) => {
            if (err.message === "Request failed with status code 401") {
              toast(dispatch, {
                msg: `Insufficient Fund, please fund your ${
                  payWith === PayType.cash ? "cash wallet" : "coin wallet"
                } to continue the game.`,
              }).fail();
              return;
            }
            if (err.message === "Request failed with status code 404") {
              toast(dispatch, {
                msg:
                  "Opps!  This game already exist, Join as Player 2 to continue or create another game with a different amount.",
              }).fail();
              return;
            }
            toast(dispatch, {
              msg: `An Error occured could not connect to troisplay game server please check you interner connection and Try Again.`,
            }).error();
          })
          .finally(() => {
            setLoading(TwoButtonLoader.no_loading);
            setPlayType(PlayType.non);
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
            id: details.id,
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
              data: { winner, price, game_result, battlePlan },
            }: AxiosResponse<{
              winner: GameRec;
              price: number;
              game_result: {
                round1: CheckerType;
                round2: CheckerType;
                round3: CheckerType;
                round4: CheckerType;
                round5: CheckerType;
              };
              battlePlan: {
                round1: PenaltyOption;
                round2: PenaltyOption;
                round3: PenaltyOption;
                round4: PenaltyOption;
                round5: PenaltyOption;
              };
            }>) => {
              // setPlayType(PlayType.non);
              // setGameDetails(dispatch, {
              //   player: PlayerType.first,

              //   id: undefined,
              //   price: 0,
              // });
              _setP2KnownState1(battlePlan.round1);
              _setP2KnownState2(battlePlan.round2);
              _setP2KnownState3(battlePlan.round3);
              _setP2KnownState4(battlePlan.round4);
              _setP2KnownState5(battlePlan.round5);
              setWinner(winner);
              setDone(true);
              setPlayType(PlayType.one_by_one);
              setKnownState1(game_result.round1);
              setKnownState2(game_result.round2);
              setKnownState3(game_result.round3);
              setKnownState4(game_result.round4);
              setKnownState5(game_result.round5);
              // if (winner) {
              //   notify(dispatch, {
              //     type: NotiErrorType.success,
              //     msg: `Congratualation your have just won the game and earned $ ${price}. you can withdraw you cash price or use it to play more games.`,
              //     isOpen: modalType.open,
              //   });
              // } else {
              //   notify(dispatch, {
              //     type: NotiErrorType.error,
              //     msg: `Sorry your have just lost this game and lost $ ${price}. you can try other games for a better chance.`,
              //     isOpen: modalType.open,
              //   });
              // }
            }
          )
          .catch((err) => {
            // setPlayType(PlayType.non);
            setGameDetails(dispatch, {
              player: PlayerType.first,
              id: undefined,
              price: 0,
            });
            toast(dispatch, {
              msg:
                "An Error occured could not connect to troisplay game server please check you interner connection and Try Again.",
            }).error();
          })
          .finally(() => {
            setLoading(TwoButtonLoader.no_loading);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const playSingleMatch = async (
    round: number,
    gameInPut: number
  ): Promise<void> => {
    let token = getToken();
    if (playStateLoad) return;
    setPlayStateLoading(true);
    await Axios({
      method: "POST",
      url: `${url}/games/penalty/challange/one-on-one`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        id: details.id,
        gameInPut,
        round,
      },
    })
      .then(
        ({
          data: { winner, price, final, finalWin },
        }: AxiosResponse<{
          winner: GameRec;
          final: boolean;
          price: number;
          finalWin: boolean | string;
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
            setLoading(TwoButtonLoader.no_loading);
            // setPlayType(PlayType.non);
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
            setGameDetails(dispatch, {
              player: PlayerType.first,
              id: undefined,
              price: 0,
            });
            push("/games");
            if (price > 0) {
              notify(dispatch, {
                type: NotiErrorType.success,
                msg: `Congratualations You just won this game and have gained $ ${price}`,
                isOpen: modalType.open,
              });
              return;
            } else {
              notify(dispatch, {
                type: NotiErrorType.error,
                msg: `Sorry your have just lost this game and lost $ ${price}. you can try other games for a better chance.`,
                isOpen: modalType.open,
              });
              return;
            }
          }
        }
      )
      .catch(() => {
        toast(dispatch, {
          msg:
            "An Error occured could not connect to troisplay game server please check you interner connection and Try Again.",
        }).error();
      })
      .finally(() => {
        setPlayStateLoading(false);
      });
  };

  if (getGamePlay(asPath) === Games.penalth_card)
    return (
      <div className={`gameworld theme ${theme}`}>
        {playType === PlayType.non && details.player === PlayerType.second ? (
          <div className="container">
            <h3 className="title">Play format.</h3>
            <div className="content">
              <div className="action">
                <div
                  className="btn_"
                  onClick={() => {
                    setPlayType(PlayType.one_by_one);
                  }}
                >
                  Play
                </div>
                <div
                  className="btn_"
                  onClick={() => {
                    setPlayType(PlayType.all);
                  }}
                >
                  Stimulate Play
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="world spin penalty">
            {details.player === PlayerType.first && (
              <div
                className="close_btn"
                onClick={() => {
                  // if (isEmpty(details.id)) {
                  setPlayType(PlayType.non);
                  setGameDetails(dispatch, {
                    player: PlayerType.first,
                    id: undefined,
                    price: 0,
                  });
                  setLoading(TwoButtonLoader.no_loading);
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
                  push("/games");
                  //   return;
                  // }
                  // exitWin(dispatch, {
                  //   open: modalType.open,
                  //   func: async () => {
                  //     let token = getToken();
                  //     await Axios({
                  //       method: "POST",
                  //       url: `${url}/games/penalty/exit`,
                  //       headers: {
                  //         Authorization: `Bearer ${token}`,
                  //       },
                  //       data: {
                  //         id: details.id,
                  //       },
                  //     })
                  //       .then(() => {
                  //         setLoading(TwoButtonLoader.no_loading);
                  //         setPlayType(PlayType.non);
                  //         setKnownState1(CheckerType.unknown);
                  //         setKnownState2(CheckerType.unknown);
                  //         setKnownState3(CheckerType.unknown);
                  //         setKnownState4(CheckerType.unknown);
                  //         setKnownState5(CheckerType.unknown);
                  //         setRound1({ round: 1, value: PenaltyOption.left });
                  //         setRound2({ round: 2, value: PenaltyOption.left });
                  //         setRound3({ round: 3, value: PenaltyOption.left });
                  //         setRound4({ round: 4, value: PenaltyOption.left });
                  //         setRound5({ round: 5, value: PenaltyOption.left });
                  //         setGameDetails(dispatch, {
                  //           player: PlayerType.first,

                  //           id: undefined,
                  //           price: 0,
                  //         });
                  //       })
                  //       .catch(() => {
                  //         toast(dispatch, {
                  //           msg: "Oops, An error occured.",
                  //         }).error();
                  //       });
                  //   },
                  // });
                }}
              >
                <CloseIcon />
              </div>
            )}

            <h3 className="title">
              {isEmpty(details.id) ? "Taker" : "Goalkeeper"}
            </h3>
            <h3 className="title">
              {details.player === PlayerType.second
                ? "Try to catch the ball by guessing Player one's shot direction"
                : "Set your shot directions"}
            </h3>
            <p className={`txt theme ${theme}`}>
              NOTE: You Pick your moves by clicking/tapping the icons to each
              option, hit play when your okay with your set pattern.
            </p>
            <div className="content">
              <div className="round">
                <span className={`name theme ${theme}`}>1st Penalty Take:</span>
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
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : round1.value === PenaltyOption.right ? (
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(details.id) && playType === PlayType.one_by_one && (
                  <div
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (round1knowState !== CheckerType.unknown) return;
                      playSingleMatch(round1.round, round1.value);
                    }}
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
                      ? "win"
                      : round1knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className={`value ${
                      p2Round1knowState === PenaltyOption.left ? "left" : ""
                    }`}
                    title={
                      p2Round1knowState === PenaltyOption.left
                        ? "Left shot"
                        : p2Round1knowState === PenaltyOption.right
                        ? "Right shot"
                        : ""
                    }
                  >
                    {p2Round1knowState === PenaltyOption.left ? (
                      <ForwardIcon />
                    ) : p2Round1knowState === PenaltyOption.right ? (
                      <ForwardIcon />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>2nd Penalty Take:</span>
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
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : round2.value === PenaltyOption.right ? (
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(details.id) && playType === PlayType.one_by_one && (
                  <div
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (round2knowState !== CheckerType.unknown) return;
                      playSingleMatch(round2.round, round2.value);
                    }}
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
                      ? "win"
                      : round2knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </div>
                )}

                {done && (
                  <span
                    className={`value ${
                      p2Round2knowState === PenaltyOption.left ? "left" : ""
                    }`}
                    title={
                      p2Round2knowState === PenaltyOption.left
                        ? "Left shot"
                        : p2Round2knowState === PenaltyOption.right
                        ? "Right shot"
                        : ""
                    }
                  >
                    {p2Round2knowState === PenaltyOption.left ? (
                      <ForwardIcon />
                    ) : p2Round2knowState === PenaltyOption.right ? (
                      <ForwardIcon />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>3rd Penalty Take:</span>
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
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : round3.value === PenaltyOption.right ? (
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(details.id) && playType === PlayType.one_by_one && (
                  <div
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (round3knowState !== CheckerType.unknown) return;
                      playSingleMatch(round3.round, round3.value);
                    }}
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
                      ? "win"
                      : round3knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className={`value ${
                      p2Round3knowState === PenaltyOption.left ? "left" : ""
                    }`}
                    title={
                      p2Round3knowState === PenaltyOption.left
                        ? "Left shot"
                        : p2Round3knowState === PenaltyOption.right
                        ? "Right shot"
                        : ""
                    }
                  >
                    {p2Round3knowState === PenaltyOption.left ? (
                      <ForwardIcon />
                    ) : p2Round3knowState === PenaltyOption.right ? (
                      <ForwardIcon />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>4th Penalty Take:</span>
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
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : round4.value === PenaltyOption.right ? (
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(details.id) && playType === PlayType.one_by_one && (
                  <div
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (round4knowState !== CheckerType.unknown) return;
                      playSingleMatch(round4.round, round4.value);
                    }}
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
                      ? "win"
                      : round4knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className={`value ${
                      p2Round4knowState === PenaltyOption.left ? "left" : ""
                    }`}
                    title={
                      p2Round4knowState === PenaltyOption.left
                        ? "Left shot"
                        : p2Round4knowState === PenaltyOption.right
                        ? "Right shot"
                        : ""
                    }
                  >
                    {p2Round4knowState === PenaltyOption.left ? (
                      <ForwardIcon />
                    ) : p2Round4knowState === PenaltyOption.right ? (
                      <ForwardIcon />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>5th Penalty Take:</span>
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
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : round5.value === PenaltyOption.right ? (
                    details.player === PlayerType.first ? (
                      <ForwardIcon />
                    ) : (
                      <GoalPostIcon />
                    )
                  ) : (
                    <></>
                  )}
                </span>
                {!isEmpty(details.id) && playType === PlayType.one_by_one && (
                  <div
                    style={{
                      filter: playStateLoad
                        ? "brightness(80%)"
                        : "brightness(100%)",
                      cursor: playStateLoad ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (round5knowState !== CheckerType.unknown) return;
                      playSingleMatch(round5.round, round5.value);
                    }}
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
                      ? "win"
                      : round5knowState === CheckerType.lost
                      ? "lost"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className={`value ${
                      p2Round5knowState === PenaltyOption.left ? "left" : ""
                    }`}
                    title={
                      p2Round5knowState === PenaltyOption.left
                        ? "Left shot"
                        : p2Round5knowState === PenaltyOption.right
                        ? "Right shot"
                        : ""
                    }
                  >
                    {p2Round5knowState === PenaltyOption.left ? (
                      <ForwardIcon />
                    ) : p2Round5knowState === PenaltyOption.right ? (
                      <ForwardIcon />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
            </div>
            {done && (
              <div
                className={`btn_ theme ${theme}`}
                onClick={() => {
                  if (winner === GameRec.win) {
                    notify(dispatch, {
                      type: NotiErrorType.success,
                      msg: `Congratualation your have just won the game and earned $ ${getPrice(
                        Games.penalth_card,
                        details.price,
                        defaults
                      )}. you can withdraw you cash price or use it to play more games.`,
                      isOpen: modalType.open,
                    });
                  } else if (winner === GameRec.draw) {
                    notify(dispatch, {
                      type: NotiErrorType.state,
                      msg: `This game came out as a draw an your stake amount has been refund back to you. You can withdraw you cash price or use it to play more games.`,
                      isOpen: modalType.open,
                    });
                  } else {
                    notify(dispatch, {
                      type: NotiErrorType.error,
                      msg: `Sorry your have just lost this game and lost $ ${getPrice(
                        Games.penalth_card,
                        details.price,
                        defaults
                      )}. you can try other games for a better chance.`,
                      isOpen: modalType.open,
                    });
                  }
                  setDone(false);
                  // setPlayType(PlayType.non);
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
                  setPlayType(PlayType.all);
                  setGameDetails(dispatch, {
                    player: PlayerType.first,

                    id: undefined,
                    price: 0,
                  });
                  push("/games");
                }}
              >
                Finish Play
              </div>
            )}
            {isEmpty(details.id) ? (
              <div className="game_action">
                <div
                  className={`btn_ theme ${theme}`}
                  onClick={() => {
                    handleSubmit(PayType.cash);
                  }}
                >
                  {loading === TwoButtonLoader.first_loading ? (
                    <MoonLoader size="10px" color={`white`} />
                  ) : (
                    `stake ₦ ${details.price}`
                  )}
                </div>
              </div>
            ) : playType === PlayType.all ? (
              <div
                className={`btn_ theme ${theme}`}
                onClick={() => handleSubmit()}
              >
                {isEmpty(details.id) ? (
                  loading === TwoButtonLoader.first_loading ? (
                    <MoonLoader size="10px" color={`white`} />
                  ) : (
                    "Play"
                  )
                ) : loading === TwoButtonLoader.second_loading ? (
                  <MoonLoader size="10px" color={`white`} />
                ) : (
                  "challange"
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    );
  else return <></>;
}
