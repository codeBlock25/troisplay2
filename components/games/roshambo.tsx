import Axios, { AxiosResponse } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../constant";
import {
  exitWin,
  MyGamesAction,
  notify,
  setGameDetails,
  toast,
} from "../../store/action";
import {
  CloseIcon,
  GameCoin,
  PaperIcon,
  RockIcon,
  ScissorIcon,
} from "../../icon";
import { isEmpty } from "lodash";
import { MoonLoader } from "react-spinners";
import {
  CheckerType,
  GameRec,
  Games,
  modalType,
  NotiErrorType,
  PayType,
  PlayerType,
  PlayType,
  RoshamboOption,
  TwoButtonLoader,
} from "../../typescript/enum";
import { ActionType, reducerType } from "../../typescript/interface";
import { getGamePlay, getPrice, getToken } from "../../functions";
import { useQueryCache } from "react-query";
import { Dispatch } from "redux";
import { useRouter } from "next/router";

export default function Roshambo() {
  const dispatch: Dispatch<ActionType<any>> = useDispatch();
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
  const [playStateLoad, setPlayStateLoading] = useState<boolean>(false);
  const [playType, setPlayType] = useState<PlayType>(PlayType.all);
  const [playCount, setPlayCount] = useState<number>(0);
  const [winner, setWinner] = useState<GameRec>(GameRec.draw);
  const [done, setDone] = useState<boolean>(false);
  const [p2Round1knowState, _setP2KnownState1] = useState<RoshamboOption>(
    RoshamboOption.rock
  );
  const { push, asPath } = useRouter();
  const [p2Round2knowState, _setP2KnownState2] = useState<RoshamboOption>(
    RoshamboOption.rock
  );
  const [p2Round3knowState, _setP2KnownState3] = useState<RoshamboOption>(
    RoshamboOption.rock
  );
  const [p2Round4knowState, _setP2KnownState4] = useState<RoshamboOption>(
    RoshamboOption.rock
  );
  const [p2Round5knowState, _setP2KnownState5] = useState<RoshamboOption>(
    RoshamboOption.rock
  );
  const [round1, setRound1] = useState<{
    round: number;
    value: RoshamboOption;
  }>({
    round: 1,
    value: RoshamboOption.rock,
  });
  const [round2, setRound2] = useState<{
    round: number;
    value: RoshamboOption;
  }>({
    round: 2,
    value: RoshamboOption.rock,
  });
  const [round3, setRound3] = useState<{
    round: number;
    value: RoshamboOption;
  }>({
    round: 3,
    value: RoshamboOption.rock,
  });
  const [round4, setRound4] = useState<{
    round: number;
    value: RoshamboOption;
  }>({
    round: 4,
    value: RoshamboOption.rock,
  });
  const [round5, setRound5] = useState<{
    round: number;
    value: RoshamboOption;
  }>({
    round: 5,
    value: RoshamboOption.rock,
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
  const defaults: AxiosResponse<{
    default: {
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
  }> = useQueryCache().getQueryData("defaults");
  const theme = "dark-mode";
  const handleSubmit = async (payWith?: PayType) => {
    let token = getToken();
    if (loading !== TwoButtonLoader.no_loading) return;
    if (isEmpty(details.id)) {
      if (payWith === PayType.cash) {
        setLoading(TwoButtonLoader.first_loading);
      } else {
        setLoading(TwoButtonLoader.second_loading);
      }
      await Axios({
        method: "POST",
        url: `${url}/games/roshambo`,
        headers: {
          Authorization: `Bearer ${token}`,
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
          async ({
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
          setKnownState1(CheckerType.unknown);
          setKnownState2(CheckerType.unknown);
          setKnownState3(CheckerType.unknown);
          setKnownState4(CheckerType.unknown);
          setKnownState5(CheckerType.unknown);
          setRound1({ round: 1, value: RoshamboOption.rock });
          setRound2({ round: 2, value: RoshamboOption.rock });
          setRound3({ round: 3, value: RoshamboOption.rock });
          setRound4({ round: 4, value: RoshamboOption.rock });
          setRound5({ round: 5, value: RoshamboOption.rock });
        });
    } else {
      await Axios({
        method: "POST",
        url: `${url}/games/roshambo/play-against`,
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
              round1: RoshamboOption;
              round2: RoshamboOption;
              round3: RoshamboOption;
              round4: RoshamboOption;
              round5: RoshamboOption;
            };
          }>) => {
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
          }
        )
        .catch((err) => {
          toast(dispatch, {
            msg:
              "An Error occured could not connect to troisplay game server please check you interner connection and Try Again.",
          }).error();
        })
        .finally(() => {
          setLoading(TwoButtonLoader.no_loading);
        });
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
      url: `${url}/games/roshambo/challange/one-on-one`,
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
          final: "draw" | "won" | "lost" | "no";
          price: number;
          finalWin: boolean | string;
        }>) => {
          switch (round) {
            case 1:
              setKnownState1(
                winner === GameRec.win
                  ? CheckerType.won
                  : winner === GameRec.lose
                  ? CheckerType.lost
                  : CheckerType.draw
              );
              break;
            case 2:
              setKnownState2(
                winner === GameRec.win
                  ? CheckerType.won
                  : winner === GameRec.lose
                  ? CheckerType.lost
                  : CheckerType.draw
              );
              break;
            case 3:
              setKnownState3(
                winner === GameRec.win
                  ? CheckerType.won
                  : winner === GameRec.lose
                  ? CheckerType.lost
                  : CheckerType.draw
              );
              break;
            case 4:
              setKnownState4(
                winner === GameRec.win
                  ? CheckerType.won
                  : winner === GameRec.lose
                  ? CheckerType.lost
                  : CheckerType.draw
              );
              break;
            case 5:
              setKnownState5(
                winner === GameRec.win
                  ? CheckerType.won
                  : winner === GameRec.lose
                  ? CheckerType.lost
                  : CheckerType.draw
              );
              break;
            default:
              return;
          }
          if (final !== "no") {
            setLoading(TwoButtonLoader.no_loading);
            // setPlayType(PlayType.non);
            setKnownState1(CheckerType.unknown);
            setKnownState2(CheckerType.unknown);
            setKnownState3(CheckerType.unknown);
            setKnownState4(CheckerType.unknown);
            setKnownState5(CheckerType.unknown);
            setRound1({ round: 1, value: RoshamboOption.rock });
            setRound2({ round: 2, value: RoshamboOption.rock });
            setRound3({ round: 3, value: RoshamboOption.rock });
            setRound4({ round: 4, value: RoshamboOption.rock });
            setRound5({ round: 5, value: RoshamboOption.rock });
            if (final === "draw") {
              setGameDetails(dispatch, {
                player: PlayerType.first,
                id: undefined,
                price: 0,
              });
              notify(dispatch, {
                type: NotiErrorType.state,
                msg:
                  "This game was a tough one and ended in a draw, you game funds have been returned as a result of this.",
                isOpen: modalType.open,
              });
            } else if (final === "won") {
              setGameDetails(dispatch, {
                player: PlayerType.first,
                id: undefined,
                price: 0,
              });
              notify(dispatch, {
                type: NotiErrorType.success,
                msg: `Congratualations You just won this game and have gained $ ${price}`,
                isOpen: modalType.open,
              });
            } else {
              setGameDetails(dispatch, {
                player: PlayerType.first,
                id: undefined,
                price: 0,
              });
              notify(dispatch, {
                type: NotiErrorType.error,
                msg: `Sorry your have just lost this game and lost $ ${price}. you can try other games for a better chance.`,
                isOpen: modalType.open,
              });
            }
            push("/games");
            return;
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

  if (getGamePlay(asPath) === Games.roshambo)
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
          <div className="world spin roshambo">
            {details.player === PlayerType.first && (
              <div
                className="close_btn"
                onClick={() => {
                  if (isEmpty(details.id)) {
                    setGameDetails(dispatch, {
                      player: PlayerType.first,
                      id: undefined,
                      price: 0,
                    });
                    push("/games");
                    setPlayType(PlayType.non);
                    setLoading(TwoButtonLoader.no_loading);
                    setKnownState1(CheckerType.unknown);
                    setKnownState2(CheckerType.unknown);
                    setKnownState3(CheckerType.unknown);
                    setKnownState4(CheckerType.unknown);
                    setKnownState5(CheckerType.unknown);
                    setRound1({ round: 1, value: RoshamboOption.rock });
                    setRound2({ round: 2, value: RoshamboOption.rock });
                    setRound3({ round: 3, value: RoshamboOption.rock });
                    setRound4({ round: 4, value: RoshamboOption.rock });
                    setRound5({ round: 5, value: RoshamboOption.rock });
                    return;
                  }
                }}
              >
                <CloseIcon />
              </div>
            )}
            <h3 className="title">Player {isEmpty(details.id) ? "1" : "2"}</h3>
            <h3 className="title">Set your moves</h3>
            <p className={`txt them ${theme}`}>
              NOTE: You Pick your moves by clicking/tapping the icons to each
              option, hit play when your okay with your set pattern.
            </p>
            <div className="content">
              <div className="round">
                <span className={`name theme ${theme}`}>First Move:</span>
                <span
                  className="value"
                  title={
                    round1.value === RoshamboOption.rock
                      ? "Rock"
                      : round1.value === RoshamboOption.paper
                      ? "Paper"
                      : round1.value === RoshamboOption.scissors
                      ? "Scissor"
                      : ""
                  }
                  onClick={() => {
                    if (round1knowState !== CheckerType.unknown) return;
                    setRound1((prev) => {
                      return {
                        round: 1,
                        value:
                          prev.value === RoshamboOption.rock
                            ? RoshamboOption.paper
                            : prev.value === RoshamboOption.paper
                            ? RoshamboOption.scissors
                            : prev.value === RoshamboOption.scissors
                            ? RoshamboOption.rock
                            : RoshamboOption.rock,
                      };
                    });
                  }}
                >
                  {round1.value === RoshamboOption.rock ? (
                    <RockIcon />
                  ) : round1.value === RoshamboOption.paper ? (
                    <PaperIcon />
                  ) : round1.value === RoshamboOption.scissors ? (
                    <ScissorIcon />
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
                        ? "win"
                        : round1knowState === CheckerType.lost
                        ? "lost"
                        : round1knowState === CheckerType.draw
                        ? "draw"
                        : ""
                    }`}
                  >
                    {round1knowState === CheckerType.unknown
                      ? "play"
                      : round1knowState === CheckerType.won
                      ? "win"
                      : round1knowState === CheckerType.lost
                      ? "lost"
                      : round1knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className="value"
                    title={
                      p2Round1knowState === RoshamboOption.rock
                        ? "Rock"
                        : p2Round1knowState === RoshamboOption.paper
                        ? "Paper"
                        : p2Round1knowState === RoshamboOption.scissors
                        ? "Scissor"
                        : ""
                    }
                  >
                    {p2Round1knowState === RoshamboOption.rock ? (
                      <RockIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round1knowState === RoshamboOption.paper ? (
                      <PaperIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round1knowState === RoshamboOption.scissors ? (
                      <ScissorIcon styles={{ fill: "#00ffff" }} />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>Second Move:</span>
                <span
                  className="value"
                  title={
                    round2.value === RoshamboOption.rock
                      ? "Rock"
                      : round2.value === RoshamboOption.paper
                      ? "Paper"
                      : round2.value === RoshamboOption.scissors
                      ? "Scissor"
                      : ""
                  }
                  onClick={() => {
                    if (round2knowState !== CheckerType.unknown) return;
                    setRound2((prev) => {
                      return {
                        round: 2,
                        value:
                          prev.value === RoshamboOption.rock
                            ? RoshamboOption.paper
                            : prev.value === RoshamboOption.paper
                            ? RoshamboOption.scissors
                            : prev.value === RoshamboOption.scissors
                            ? RoshamboOption.rock
                            : RoshamboOption.rock,
                      };
                    });
                  }}
                >
                  {round2.value === RoshamboOption.rock ? (
                    <RockIcon />
                  ) : round2.value === RoshamboOption.paper ? (
                    <PaperIcon />
                  ) : round2.value === RoshamboOption.scissors ? (
                    <ScissorIcon />
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
                        ? "win"
                        : round2knowState === CheckerType.lost
                        ? "lost"
                        : round2knowState === CheckerType.draw
                        ? "draw"
                        : ""
                    }`}
                  >
                    {round2knowState === CheckerType.unknown
                      ? "play"
                      : round2knowState === CheckerType.won
                      ? "win"
                      : round2knowState === CheckerType.lost
                      ? "lost"
                      : round2knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className="value"
                    title={
                      p2Round2knowState === RoshamboOption.rock
                        ? "Rock"
                        : p2Round2knowState === RoshamboOption.paper
                        ? "Paper"
                        : p2Round2knowState === RoshamboOption.scissors
                        ? "Scissor"
                        : ""
                    }
                  >
                    {p2Round2knowState === RoshamboOption.rock ? (
                      <RockIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round2knowState === RoshamboOption.paper ? (
                      <PaperIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round2knowState === RoshamboOption.scissors ? (
                      <ScissorIcon styles={{ fill: "#00ffff" }} />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>Thrid Move:</span>
                <span
                  className="value"
                  title={
                    round3.value === RoshamboOption.rock
                      ? "Rock"
                      : round3.value === RoshamboOption.paper
                      ? "Paper"
                      : round3.value === RoshamboOption.scissors
                      ? "Scissor"
                      : ""
                  }
                  onClick={() => {
                    if (round3knowState !== CheckerType.unknown) return;
                    setRound3((prev) => {
                      return {
                        round: 3,
                        value:
                          prev.value === RoshamboOption.rock
                            ? RoshamboOption.paper
                            : prev.value === RoshamboOption.paper
                            ? RoshamboOption.scissors
                            : prev.value === RoshamboOption.scissors
                            ? RoshamboOption.rock
                            : RoshamboOption.rock,
                      };
                    });
                  }}
                >
                  {round3.value === RoshamboOption.rock ? (
                    <RockIcon />
                  ) : round3.value === RoshamboOption.paper ? (
                    <PaperIcon />
                  ) : round3.value === RoshamboOption.scissors ? (
                    <ScissorIcon />
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
                        ? "win"
                        : round3knowState === CheckerType.lost
                        ? "lost"
                        : round3knowState === CheckerType.draw
                        ? "draw"
                        : ""
                    }`}
                  >
                    {round3knowState === CheckerType.unknown
                      ? "play"
                      : round3knowState === CheckerType.won
                      ? "win"
                      : round3knowState === CheckerType.lost
                      ? "lost"
                      : round3knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className="value"
                    title={
                      p2Round3knowState === RoshamboOption.rock
                        ? "Rock"
                        : p2Round3knowState === RoshamboOption.paper
                        ? "Paper"
                        : p2Round3knowState === RoshamboOption.scissors
                        ? "Scissor"
                        : ""
                    }
                  >
                    {p2Round3knowState === RoshamboOption.rock ? (
                      <RockIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round3knowState === RoshamboOption.paper ? (
                      <PaperIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round3knowState === RoshamboOption.scissors ? (
                      <ScissorIcon styles={{ fill: "#00ffff" }} />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>Fouth Move:</span>
                <span
                  className="value"
                  title={
                    round4.value === RoshamboOption.rock
                      ? "Rock"
                      : round4.value === RoshamboOption.paper
                      ? "Paper"
                      : round4.value === RoshamboOption.scissors
                      ? "Scissor"
                      : ""
                  }
                  onClick={() => {
                    if (round4knowState !== CheckerType.unknown) return;
                    setRound4((prev) => {
                      return {
                        round: 4,
                        value:
                          prev.value === RoshamboOption.rock
                            ? RoshamboOption.paper
                            : prev.value === RoshamboOption.paper
                            ? RoshamboOption.scissors
                            : prev.value === RoshamboOption.scissors
                            ? RoshamboOption.rock
                            : RoshamboOption.rock,
                      };
                    });
                  }}
                >
                  {round4.value === RoshamboOption.rock ? (
                    <RockIcon />
                  ) : round4.value === RoshamboOption.paper ? (
                    <PaperIcon />
                  ) : round4.value === RoshamboOption.scissors ? (
                    <ScissorIcon />
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
                    onClick={async () => {
                      if (round4knowState !== CheckerType.unknown) return;
                      playSingleMatch(round4.round, round4.value);
                    }}
                    className={`btn_check theme ${theme} ${
                      round4knowState === CheckerType.unknown
                        ? "play"
                        : round4knowState === CheckerType.won
                        ? "win"
                        : round4knowState === CheckerType.lost
                        ? "lost"
                        : round4knowState === CheckerType.draw
                        ? "draw"
                        : ""
                    }`}
                  >
                    {round4knowState === CheckerType.unknown
                      ? "play"
                      : round4knowState === CheckerType.won
                      ? "win"
                      : round4knowState === CheckerType.lost
                      ? "lost"
                      : round4knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className="value"
                    title={
                      p2Round4knowState === RoshamboOption.rock
                        ? "Rock"
                        : p2Round4knowState === RoshamboOption.paper
                        ? "Paper"
                        : p2Round4knowState === RoshamboOption.scissors
                        ? "Scissor"
                        : ""
                    }
                  >
                    {p2Round4knowState === RoshamboOption.rock ? (
                      <RockIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round4knowState === RoshamboOption.paper ? (
                      <PaperIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round4knowState === RoshamboOption.scissors ? (
                      <ScissorIcon styles={{ fill: "#00ffff" }} />
                    ) : (
                      <></>
                    )}
                  </span>
                )}
              </div>
              <div className="round">
                <span className={`name theme ${theme}`}>Fifth Move:</span>
                <span
                  className="value"
                  title={
                    round5.value === RoshamboOption.rock
                      ? "Rock"
                      : round5.value === RoshamboOption.paper
                      ? "Paper"
                      : round5.value === RoshamboOption.scissors
                      ? "Scissor"
                      : ""
                  }
                  onClick={() => {
                    if (round5knowState !== CheckerType.unknown) return;
                    setRound5((prev) => {
                      return {
                        round: 5,
                        value:
                          prev.value === RoshamboOption.rock
                            ? RoshamboOption.paper
                            : prev.value === RoshamboOption.paper
                            ? RoshamboOption.scissors
                            : prev.value === RoshamboOption.scissors
                            ? RoshamboOption.rock
                            : RoshamboOption.rock,
                      };
                    });
                  }}
                >
                  {round5.value === RoshamboOption.rock ? (
                    <RockIcon />
                  ) : round5.value === RoshamboOption.paper ? (
                    <PaperIcon />
                  ) : round5.value === RoshamboOption.scissors ? (
                    <ScissorIcon />
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
                        ? "win"
                        : round5knowState === CheckerType.lost
                        ? "lost"
                        : round5knowState === CheckerType.draw
                        ? "draw"
                        : ""
                    }`}
                  >
                    {round5knowState === CheckerType.unknown
                      ? "play"
                      : round5knowState === CheckerType.won
                      ? "win"
                      : round5knowState === CheckerType.lost
                      ? "lost"
                      : round5knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
                )}
                {done && (
                  <span
                    className="value"
                    title={
                      p2Round5knowState === RoshamboOption.rock
                        ? "Rock"
                        : p2Round5knowState === RoshamboOption.paper
                        ? "Paper"
                        : p2Round5knowState === RoshamboOption.scissors
                        ? "Scissor"
                        : ""
                    }
                  >
                    {p2Round5knowState === RoshamboOption.rock ? (
                      <RockIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round5knowState === RoshamboOption.paper ? (
                      <PaperIcon styles={{ fill: "#00ffff" }} />
                    ) : p2Round5knowState === RoshamboOption.scissors ? (
                      <ScissorIcon styles={{ fill: "#00ffff" }} />
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
                        Games.roshambo,
                        details.price,
                        defaults.data.default
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
                        Games.roshambo,
                        details.price,
                        defaults.data.default
                      )}. you can try other games for a better chance.`,
                      isOpen: modalType.open,
                    });
                  }
                  setDone(false);
                  setPlayType(PlayType.all);
                  setKnownState1(CheckerType.unknown);
                  setKnownState2(CheckerType.unknown);
                  setKnownState3(CheckerType.unknown);
                  setKnownState4(CheckerType.unknown);
                  setKnownState5(CheckerType.unknown);
                  setRound1({ round: 1, value: RoshamboOption.rock });
                  setRound2({ round: 2, value: RoshamboOption.rock });
                  setRound3({ round: 3, value: RoshamboOption.rock });
                  setRound4({ round: 4, value: RoshamboOption.rock });
                  setRound5({ round: 5, value: RoshamboOption.rock });
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
            {!isEmpty(details.id) && playType === PlayType.all ? (
              <div
                className={`btn_ theme ${theme}`}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {isEmpty(details.id) ? (
                  loading === TwoButtonLoader.first_loading ? (
                    <MoonLoader size="10px" color={`white`} />
                  ) : (
                    "Play All"
                  )
                ) : loading === TwoButtonLoader.first_loading ? (
                  <MoonLoader size="10px" color={`white`} />
                ) : (
                  "Challange All"
                )}
              </div>
            ) : !isEmpty(details.id) && playType !== PlayType.all ? (
              <></>
            ) : (
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
                    `stake ₦  ${details.price}`
                  )}
                </div>
                {/* <div
                  className={`btn_ theme ${theme}`}
                  onClick={() => {
                    handleSubmit(PayType.coin);
                  }}
                >
                  {loading === TwoButtonLoader.second_loading ? (
                    <MoonLoader size="10px" color={`white`} />
                  ) : (
                    <>
                      stake <GameCoin />{" "}
                      {details.price * (defaults?.data.default.cashRating ?? 0)}
                    </>
                  )}
                </div>
            */}
              </div>
            )}
          </div>
        )}
      </div>
    );
  else return <></>;
}
