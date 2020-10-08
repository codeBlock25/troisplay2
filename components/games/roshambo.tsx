import Axios, { AxiosResponse } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../constant";
import { notify, setGameDetails } from "../../store/action";
import {
  CloseIcon,
  GameCoin,
  PaperIcon,
  RockIcon,
  ScissorIcon,
} from "../../icon";
import { defaults, isEmpty } from "lodash";
import { MoonLoader } from "react-spinners";
import {
  CheckerType,
  GameRec,
  Games,
  PayType,
  PlayerType,
  PlayType,
  RoshamboOption,
} from "../../typescript/enum";
import { ActionType, reducerType } from "../../typescript/interface";
import { getToken } from "../../pages/games";

export default function Roshambo() {
  const dispatch: (t: ActionType) => void = useDispatch();
  const [isDemoPlay, setDemoState] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
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
  const [playType, setPlayType] = useState<PlayType>(PlayType.non);
  const [playCount, setPlayCount] = useState<number>(0);

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

  const theme = "dark-mode";
  const handleSubmit = async (payWith?: PayType) => {
    let token = getToken();
    if (loading) return;
    setLoading(true);
    if (isEmpty(details.id)) {
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
          }>) => {}
        )
        .catch((err) => {
          if (err.message === "Request failed with status code 401") {
            // ins fund
            return;
          }
          // normal error
        })
        .finally(() => {
          setLoading(false);
          setDemoState(true);
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
        url: `${url}/games/roshambo/challange`,
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
            data: { winner, price },
          }: AxiosResponse<{ winner: boolean; price: number }>) => {
            // played
          }
        )
        .catch((err) => {
          // erro
        })
        .finally(() => {
          setLoading(false);
          setRound1({ round: 1, value: RoshamboOption.rock });
          setRound2({ round: 2, value: RoshamboOption.rock });
          setRound3({ round: 3, value: RoshamboOption.rock });
          setRound4({ round: 4, value: RoshamboOption.rock });
          setRound5({ round: 5, value: RoshamboOption.rock });
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
          final: boolean;
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
          if (final) {
            setLoading(false);
            setDemoState(true);
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
            if (finalWin === "draw") {
              //   dispatch(
              //     notify({
              //       isOPen: modalType.open,
              //       msg: `This game was a tough one and ended in a draw, you game funds have been returned as a result of this.`,
              //       type: NotiErrorType.state,
              //     })
              //   );
              // } else if (finalWin) {
              //   dispatch(
              //     notify({
              //       isOPen: modalType.open,
              //       msg: `Congratualations You just won this game and have gained $${price}`,
              //       type: NotiErrorType.success,
              //     })
              //   );
              // } else {
              //   dispatch(
              //     notify({
              //       isOPen: modalType.open,
              //       msg: `OOh sorry, You just lost this game and have lost $${price}`,
              //       type: NotiErrorType.error,
              //     })
              //   );
              // }
            }
            setPlayCount((prev) => {
              return prev + 1;
            });
          }
        }
      )
      .catch(console.error)
      .finally(() => {
        setPlayStateLoading(false);
      });
  };

  if (details.game === Games.roshambo)
    return (
      <div className={`gameworld theme ${theme}`}>
        {playType === PlayType.non && details.player === PlayerType.second ? (
          <div className="container">
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
            <div
              className="close_btn"
              onClick={() => {
                if (isEmpty(details.id)) {
                  setGameDetails(dispatch, {
                    player: PlayerType.first,
                    game: Games.non,
                    id: undefined,
                    price: 0,
                  });
                }
                // dispatch(
                //   setExit({
                //     open: modalType.open,
                //     func: async () => {
                //       await Axios({
                //         method: "POST",
                //         url: `${url}/games/roshambo/exit`,
                //         headers: {
                //           Authorization: `Bearer ${token}`,
                //         },
                //         data: {
                //           id: gameID,
                //         },
                //       })
                //         .then(() => {
                //           dispatch(setGame(gameType.non, ""));
                //           setLoading(false);
                //           setDemoState(true);
                //           setKnownState1(CheckerType.unknown);
                //           setKnownState2(CheckerType.unknown);
                //           setKnownState3(CheckerType.unknown);
                //           setKnownState4(CheckerType.unknown);
                //           setKnownState5(CheckerType.unknown);
                //           setRound1({ round: 1, value: RoshamboOption.rock });
                //           setRound2({ round: 2, value: RoshamboOption.rock });
                //           setRound3({ round: 3, value: RoshamboOption.rock });
                //           setRound4({ round: 4, value: RoshamboOption.rock });
                //           setRound5({ round: 5, value: RoshamboOption.rock });
                //           dispatch(
                //             setSearchSpec({ game: gameType.non, price: 0 })
                //           );
                //           dispatch(setGamepickerform(modalType.close));
                //         })
                //         .catch(() => {
                //           toast.error("Network Error!.");
                //         });
                //     },
                //   })
                // );
              }}
            >
              <CloseIcon />
            </div>
            <h3 className="title">Player {isEmpty(details.id) ? "1" : "2"}</h3>
            <h3 className="title">Set your moves</h3>
            <p className={`txt theme ${theme}`}>
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
                    onClick={() => playSingleMatch(round1.round, round1.value)}
                    className={`btn_check theme ${theme} ${
                      round1knowState === CheckerType.unknown
                        ? "play"
                        : round1knowState === CheckerType.won
                        ? "won"
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
                      ? "won"
                      : round1knowState === CheckerType.lost
                      ? "lost"
                      : round1knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
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
                    onClick={() => playSingleMatch(round2.round, round2.value)}
                    className={`btn_check theme ${theme} ${
                      round2knowState === CheckerType.unknown
                        ? "play"
                        : round2knowState === CheckerType.won
                        ? "won"
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
                      ? "won"
                      : round2knowState === CheckerType.lost
                      ? "lost"
                      : round2knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
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
                    onClick={() => playSingleMatch(round3.round, round3.value)}
                    className={`btn_check theme ${theme} ${
                      round3knowState === CheckerType.unknown
                        ? "play"
                        : round3knowState === CheckerType.won
                        ? "won"
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
                      ? "won"
                      : round3knowState === CheckerType.lost
                      ? "lost"
                      : round3knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
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
                      playSingleMatch(round4.round, round4.value);
                    }}
                    className={`btn_check theme ${theme} ${
                      round4knowState === CheckerType.unknown
                        ? "play"
                        : round4knowState === CheckerType.won
                        ? "won"
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
                      ? "won"
                      : round4knowState === CheckerType.lost
                      ? "lost"
                      : round4knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
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
                    onClick={() => playSingleMatch(round5.round, round5.value)}
                    className={`btn_check theme ${theme} ${
                      round5knowState === CheckerType.unknown
                        ? "play"
                        : round5knowState === CheckerType.won
                        ? "won"
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
                      ? "won"
                      : round5knowState === CheckerType.lost
                      ? "lost"
                      : round5knowState === CheckerType.draw
                      ? "draw"
                      : ""}
                  </div>
                )}
              </div>
            </div>
            {!isEmpty(details.id) && playType === PlayType.all ? (
              <div
                className={`btn_ theme ${theme}`}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {isEmpty(details.id) ? (
                  loading ? (
                    <MoonLoader size="20px" color={`white`} />
                  ) : (
                    "Play All"
                  )
                ) : loading ? (
                  <MoonLoader size="20px" color={`white`} />
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
                  {loading ? (
                    <MoonLoader size="20px" color={`white`} />
                  ) : (
                    "Play with $"
                  )}
                </div>
                <div
                  className={`btn_ theme ${theme}`}
                  onClick={() => {
                    handleSubmit(PayType.coin);
                  }}
                >
                  {loading ? (
                    <MoonLoader size="20px" color={`white`} />
                  ) : (
                    <>
                      play with <GameCoin />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  else return <></>;
}