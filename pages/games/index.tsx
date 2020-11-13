import Head from "next/head";
import { InView } from "react-intersection-observer";
import {useFlutterwave} from "flutterwave-react-v3"
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BackIcon,
  GameCoin,
  NextIcon,
} from "../../icon";
import Lottie from "lottie-web";
import moment from "moment";
import { useQueryCache } from "react-query";
import Axios, { AxiosResponse } from "axios";
import { config, url } from "../../constant";
import { Games, PlayerType, Viewing, ReasonType, modalType } from "../../typescript/enum";
import { getPrice, getToken, isPlayable } from "../../functions";
import { SyncLoader } from "react-spinners";
import Notification from "../../components/notification";
import Roshambo from "../../components/games/roshambo";
import { backWin, exitWin, setCustomWindow, setGameDetails, toast } from "../../store/action";
import { useDispatch, useSelector } from "react-redux";
import Penalty_card from "../../components/games/penelty_card";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import GameView from "../../components/game_view";
import Exitwindow from "../../components/exitwindow";
import Header from "../../components/header";
import {nextType, choices} from "../../typescript/enum"
import PickerPlayer2 from "../../components/gamepicker_player2";
import GuessMaster from "../../components/games/matcher";
import CustomGame, { choice } from "../../components/games/custom";
import Gloryspin from "../../components/games/gloryspin";
import BackWindow from "../../components/backwindow";
import { Fab } from "@material-ui/core";
import { ArrowDownward, Close } from "@material-ui/icons";
import Bottompanel from "../../components/bottompanel";
import { reducerType } from "../../typescript/interface";
import DetailScreen from "../../components/DetailScreen";
import CustomWindow from "../../components/customWindow";
import AccountF from "../../components/account_f";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GamesScreen() {
  const dispatch = useDispatch();

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
  const [viewing, setViewing] = useState<Viewing>(Viewing.current);
  const [dateintime, setDateintime] = useState("");
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [runText, setRunText] = useState("loading game components...");
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const swRef: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [playLoader, setPlayerLoader] = useState<boolean>(false);
  const [game_loading, setgameLoading] = useState<boolean>(false);
  const [p2, setP2] = useState<boolean>(false);
  const { push, beforePopState } = useRouter();
  const [time, setTime] = useState<string>("00:00");
  const spin: AxiosResponse<{
    spin_details: {
      currentTime: Date;
      gameTime: Date;
      isPlayable: boolean;
    };
  }> = useQueryCache().getQueryData("spins");

  useEffect(() => {
    let countdownEvt = setInterval(() => {
      if (spin) {
        let time = moment(
          moment(spin?.data?.spin_details.gameTime ?? new Date()).diff(
            new Date()
          )
        ).format("HH:MM:ss");
        setDateintime(spin.data.spin_details.isPlayable ? "00:00:00" : time);
      }
    }, 200);
    return () => {
      clearInterval(countdownEvt);
    };
  }, [spin]);

  const [spec, setSpec] = useState<{
    isOpen: boolean;
    manual: string;
    price: number;
    game: Games;
    next?: nextType;
  }>({
    isOpen: false,
    manual: "",
    price: 10,
    game: Games.non,
    next: nextType.player,
  });

  const my_games: AxiosResponse<{
    games: {
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: Games;
      members: string[];
      playCount: number;
      price_in_coin: number;
      price_in_value: number;
      battleScore?: {
        player1?: {
          endDate: Date;
          title: string;
          description: string;
          answer: string;
          endGameTime: Date;
          choice: choice;
        };
      };
      _id: string;
    }[];
  }> = useQueryCache().getQueryData("my_games");

  const requests: AxiosResponse<{
    requests: {
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
      };
    }[];
  }> = useQueryCache().getQueryData("requests");

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
  const record: AxiosResponse<{
    user: {
      full_name: string;
      phone_number: string;
    };
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
  }> = useQueryCache().getQueryData("records");

  useEffect(() => {
    beforePopState(({ url, as, options }) => {
      window.location.href = as;
      return confirm("Are you sure you want to leave this game?");
    });
  }, []);
  // const { asPath, pathname } = useRouter();
  // useEffect(() => {
  //   switch (asPath) {
  //     case "/games#play-games": {
  //         setViewOpen(true);
  //     }
  //       break;
    
  //     default: {
  //       setViewOpen(false);
  //     }
  //       break;
  //   }
  // }, [asPath, pathname])
  
  return (
    <>
      <Head>
        <title>Games - Troisplay</title>
      </Head>
      {app_loading && (
        <>
          <AppLoader runText={runText} />
        </>
      )}
      <Penalty_card />
      <Roshambo />
      <Exitwindow />
      <Gloryspin />
      <CustomGame />
      <Notification />
      <GuessMaster />
      <Bottompanel />
      <BackWindow />
      <CustomWindow />
      <Header setApp_loading={setApp_loading} setRunText={setRunText} />
      <PickerPlayer2
        game={spec.game}
        isOpen={p2}
        my={record?.data.player}
        close={() => setP2(false)}
        spec={spec}
        specfunc={setSpec}
      />
      <ToastContainer />
      <div
        className={`game_picker_view ${spec.isOpen ? "open" : ""}`}
        onClick={(e: any) => {
          if (!e.target?.classList?.contains("game_picker_view")) {
            return;
          }
          setSpec((prev) => {
            return {
              ...prev,
              isOpen: false,
              game: Games.non,
              next: nextType.player,
            };
          });
        }}
      >
        {spec.next === nextType.price ? (
          <div className="container_price">
            <h3 className="title">Game Setup.</h3>
            <p className="txt">
              To stand a chances to earn{" "}
              {getPrice(spec.game, spec.price, defaults?.data?.default) <= 0
                ? ""
                : `$ ${getPrice(
                    spec.game,
                    spec.price,
                    defaults?.data?.default
                  )}`}{" "}
            </p>
            <p className="txt">
              or Stake At{" "}
              {defaults?.data?.default.cashRating * spec.price === null ||
              !(defaults?.data?.default.cashRating * spec.price) ? (
                "0"
              ) : (
                <span
                  style={{ marginLeft: 5, display: "flex", marginRight: 5 }}
                >
                  {"  "} <GameCoin />{" "}
                  {`${defaults?.data?.default.cashRating * spec.price}`}
                </span>
              )}
            </p>
            <div className="inputBox">
              <label htmlFor="number">Price</label>
              <input
                type="number"
                value={spec.price}
                onChange={(e) => {
                  e.persist();
                  setSpec((prev) => {
                    return {
                      ...prev,
                      price: parseInt(e.target.value, 10),
                    };
                  });
                }}
                id="price"
                placeholder="in ($)"
              />
            </div>
            <span
              className="btn"
              onClick={() => {
                if (
                  spec.price <
                  (spec.game === Games.roshambo
                    ? defaults.data.default.min_stack_roshambo
                    : spec.game === Games.penalth_card
                    ? defaults.data.default.min_stack_penalty
                    : spec.game === Games.matcher
                    ? defaults.data.default.min_stack_guess_master
                    : 0)
                ) {
                  toast(dispatch, {
                    msg: `Can't play ${
                      spec.game === Games.roshambo
                        ? "Roshambo"
                        : spec.game === Games.penalth_card
                        ? "Penalty Card"
                        : spec.game === Games.matcher
                        ? "Guess Master"
                        : ""
                    } game below the minimum price bar. Please stake something higher than ₦ ${
                      spec.game === Games.roshambo
                        ? defaults.data.default.min_stack_roshambo
                        : spec.game === Games.penalth_card
                        ? defaults.data.default.min_stack_penalty
                        : spec.game === Games.matcher
                        ? defaults.data.default.min_stack_guess_master
                        : 0
                    } to continue`,
                  }).error();
                  return;
                }
                toast(dispatch, { msg: "" }).close();
                setGameDetails(dispatch, {
                  price: spec.price,
                  player: PlayerType.first,
                  id: undefined,
                  game: spec.game,
                });
                setSpec((prev) => {
                  return {
                    ...prev,
                    isOpen: false,
                    game: Games.non,
                    next: nextType.player,
                  };
                });
              }}
            >
              {playLoader ? (
                <SyncLoader size="10px" color="white" />
              ) : (
                "Proceed"
              )}
            </span>
          </div>
        ) : spec.next === nextType.player ? (
          <div className="container_join">
            <h3 className="title">Join as.</h3>
            <div className="action">
              <div
                className="btn"
                onClick={() => {
                  setSpec((prev) => {
                    return {
                      ...prev,
                      next: nextType.price,
                    };
                  });
                }}
              >
                {spec.game === Games.penalth_card ? "Taker" : "Player 1"}
              </div>
              <div
                className="btn"
                onClick={() => {
                  setSpec((prev) => {
                    return { ...prev, isOpen: false };
                  });
                  setP2(true);
                }}
              >
                {spec.game === Games.penalth_card ? "Keeper" : "Player 2"}
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <h3 className="title">Game Manual</h3>
            <p className="txt">{spec.manual}</p>
            <span
              className="btn"
              onClick={() => {
                if (
                  spec.game === Games.lucky_geoge ||
                  spec.game === Games.rooms
                ) {
                  setViewOpen(false);
                  setP2(true);
                  return;
                }
                setSpec((prev) => {
                  return {
                    ...prev,
                    next: nextType.player,
                  };
                });
              }}
            >
              confirm
            </span>
          </div>
        )}
      </div>
      <span
        className="new_game"
        onClick={() => {
          // push("/games#play-games")
          setViewOpen(true);
        }}
      >
        play game{" "}
        <span className="icon">
          <FontAwesomeIcon icon={faGamepad} />
        </span>
      </span>
      <div className={`games_view ${gameViewOpen && "open"}`}>
        <Fab
          className="btn_close"
          onClick={() => {
            setViewOpen(false);
          }}
        >
          <ArrowDownward />
        </Fab>
        <div className="container">
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "A player who decides to play rock will beat another player who has chosen scissors (rock crushes scissors), but will lose to one who has played paper (paper covers rock); a play of paper will lose to a play of scissors (scissors cuts paper). If both players choose the same shape, the game is tied and is usually immediately replayed to break the tie.",
                price: 0,
                game: Games.roshambo,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/roshambo.png)` }}
            />
            <div className="details">
              <span className="name">Roshambo</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Just as penalty in the game of soccer, involves the taker and goal keeper. Taker aim is to score (choose opposite direction as the goal keeper) while the goal keeper is the catch the ball (go same direction as the taker).",
                price: 0,
                game: Games.penalth_card,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/penatly-shot.png)` }}
            />
            <div className="details">
              <span className="name">Penalty Card</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Player two has three chances to guess the number player 1 choose from number one to seven.",
                price: 0,
                game: Games.matcher,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/guess-master.png)` }}
            />
            <div className="details">
              <span className="name">Guess Master</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor non, enim accusantium officiis laborum hic asperiores a corporis illum quis.",
                price: 0,
                game: Games.lucky_geoge,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/lucky-geoge.png)` }}
            />
            <div className="details">
              <span className="name">lucky judge</span>
              <span className="info">
                <b>min stake:</b>judge based
              </span>
              <span className="info">
                <b>rating:</b> 100%+s
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita in quidem natus, consectetur quia pariatur! Rem dolores maxime adipisci. Tempora earum, officia natus temporibus sit voluptas hic corrupti. Dolor, tempora.",
                price: 0,
                game: Games.custom_game,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/custom.png)` }}
            />
            <div className="details">
              <span className="name">Custom Games</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor non, enim accusantium officiis laborum hic asperiores a corporis illum quis.",
                price: 0,
                game: Games.rooms,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/rooms.png)` }}
            />
            <div className="details">
              <span className="name">Rooms</span>
              <span className="info">
                <b>min stake:</b> room based
              </span>
              <span className="info">
                <b>rating:</b> 90%+
              </span>
            </div>
          </div>
        </div>
      </div>
      <AccountF />
      <section
        className={
          gameViewOpen || spec.isOpen ? "games_world_ blur" : "games_world_"
        }
        onClick={() => {
          setViewOpen(false);
        }}
      >
        <div className="first">
          <DetailScreen />
        </div>
        <div className="second">
          <div className="container">
            <div className="title">
              <h3>My Games</h3>
              <div className="title_tab">
                <span
                  className={`btn ${viewing === Viewing.current ? "on" : ""}`}
                  onClick={() => setViewing(Viewing.current)}
                >
                  Played Games
                </span>
                <span
                  className={`btn ${viewing === Viewing.request ? "on" : ""}`}
                  onClick={() => setViewing(Viewing.request)}
                >
                  Request
                </span>
                <span
                  className={`btn ${
                    viewing === Viewing.notification ? "on" : ""
                  }`}
                  onClick={() => setViewing(Viewing.notification)}
                >
                  Notification
                </span>
              </div>
            </div>
            <div className="game_content">
              {viewing === Viewing.current ? (
                my_games?.data?.games.length === 0 ? (
                  <p className="none">
                    You don't have any active games, hit the play game button to
                    add
                  </p>
                ) : (
                  my_games?.data?.games.map((game) => {
                    return (
                      <GameView
                        type={game.gameID === Games.rooms ? "room" : "normal"}
                        name={
                          game.gameID === Games.roshambo
                            ? "Roshambo"
                            : game.gameID === Games.penalth_card
                            ? "Penelty Card"
                            : game.gameID === Games.matcher
                            ? "Guess Master"
                            : game.gameID === Games.lucky_geoge
                            ? "lucky judge"
                            : game.gameID === Games.rooms
                            ? `${game.gameDetail} room` ?? ""
                            : ""
                        }
                        key={game._id}
                        date={game.date}
                        v1={
                          game.price_in_value *
                          (defaults?.data.default?.cashRating ?? 1)
                        }
                        v2={game.price_in_value}
                        v3={game.gameMemberCount}
                        id={game._id}
                        btn1func={() => {
                          console.log("working");
                        }}
                        btn2view="exit"
                        btn2func={() => {
                          console.log("test");;
                          exitWin(dispatch, {
                            open: modalType.open,
                            game: game.gameID,
                            func: async () => {
                              await Axios.delete(`${url}/games/any/cancel`, {
                                params: { gameID: game._id },
                                headers: {authorization: `Bearer ${getToken()}`}
                              })
                                .then(() => {
                                  toast(dispatch, {
                                    msg:
                                      "This game has been delete and your cash has been forwarded to your account, you play more game to earn more.",
                                  }).success();
                                  setTimeout(() => {
                                    window.location.reload();
                                  }, 4000);
                                })
                                .catch(() => {
                                  toast(dispatch, {
                                    msg:
                                      "An Error Occured, Please check your internet connect and reload this page.",
                                  }).error();
                                });
                            },
                          });;
                        }}
                        cash={game.price_in_value}
                        coin={game.price_in_coin}
                        game={game.gameID}
                      />
                    );
                  })
                )
              ) : viewing === Viewing.notification ? (
                <p className="none">No nofications yet</p>
              ) : viewing === Viewing.request ? (
                requests.data.requests.length === 0 ? (
                  <p className="none">No requests yet</p>
                ) : (
                  requests.data.requests.map((request) => {
                    return (
                      <GameView
                        type="custom"
                        name={request?.battleScore?.player1?.title}
                        key={request._id}
                        date={request.date}
                        v1={
                          request.price_in_value *
                          (defaults?.data.default?.cashRating ?? 1)
                        }
                        v2={request.price_in_value}
                        v3={request.gameMemberCount}
                        id={request._id}
                        btn1func={() =>
                          setCustomWindow(dispatch, {
                            isOpen: modalType.open,
                            request,
                          })
                        }
                        btn2func={() =>
                          exitWin(dispatch, {
                            open: modalType.open,
                            func: async () =>
                              Axios.post(
                                `${url}/games/custom/game`,
                                { id: request._id },
                                {
                                  headers: {
                                    authorization: `Bearer ${getToken()}`,
                                  },
                                }
                              ),
                            game: Games.custom_game,
                          })
                        }
                        cash={request.price_in_value}
                        coin={request.price_in_coin}
                        game={request.gameID}
                      />
                    );
                  })
                )
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
