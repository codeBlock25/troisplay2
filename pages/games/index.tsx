import Head from "next/head";
import React, {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { GameCoin } from "../../icon";
import moment from "moment";
import { useQueryCache } from "react-query";
import Axios, { AxiosResponse } from "axios";
import { url } from "../../constant";
import {
  Games,
  PlayerType,
  Viewing,
  modalType,
} from "../../typescript/enum";
import { getPrice, getToken } from "../../functions";
import { SyncLoader } from "react-spinners";
import Notification from "../../components/notification";
import Roshambo from "../../components/games/roshambo";
import {
  exitWin,
  setCustomWindow,
  setGameDetails,
  toast,
} from "../../store/action";
import { useDispatch, useSelector } from "react-redux";
import Penalty_card from "../../components/games/penelty_card";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import GameView from "../../components/game_view";
import Exitwindow from "../../components/exitwindow";
import Header from "../../components/header";
import { nextType, choices } from "../../typescript/enum";
import PickerPlayer2 from "../../components/gamepicker_player2";
import GuessMaster from "../../components/games/matcher";
import CustomGame, { choice } from "../../components/games/custom";
import Gloryspin from "../../components/games/gloryspin";
import BackWindow from "../../components/backwindow";
import { Badge, Fab, Typography } from "@material-ui/core";
import { ArrowDownward } from "@material-ui/icons";
import Bottompanel from "../../components/bottompanel";
import DetailScreen from "../../components/DetailScreen";
import CustomWindow from "../../components/customWindow";
import AccountF from "../../components/account_f";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { reducerType } from "../../typescript/interface";
import { isEmpty } from "lodash";

export default function GamesScreen() {
  const dispatch = useDispatch();
  const [viewing, setViewing] = useState<Viewing>(Viewing.current);
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [runText, setRunText] = useState("loading game components...");
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const [p2, setP2] = useState<boolean>(false);
  const { push, beforePopState, asPath, pathname } = useRouter();

  const { my_games, defaults } = useSelector<
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
        battleScore: {
          player1: {
            endDate: Date;
            title: string;
            description: string;
            answer: string;
            endGameTime: Date;
            choice: choices;
            correctAnswer: string
          };
          player2?: {
            answer: string;
            waiting: boolean;
            correctAnswer: string
          };
        };
        _id: string;
      }[];
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
      my_games: state.init.my_games,
      defaults: state.init.gameDefaults,
    };
  });

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
    beforePopState(({ as }) => {
      if (as.includes("#playing")) {
        let userChoice = confirm("Are you sure you want to leave this game?"); 
        window.location.href = as;
        return userChoice;
      }
    });
  }, [pathname, asPath]);
  useEffect(() => {
    switch (asPath) {
      case "/games#play-games":
        {
          setViewOpen(true);
        }
        break;

      default:
        {
          setViewOpen(false);
        }
        break;
    }
  }, [asPath, pathname]);

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
      <PickerPlayer2 game={spec.game} isOpen={p2} close={() => setP2(false)} />
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
              {getPrice(spec.game, spec.price, defaults) <= 0
                ? ""
                : `$ ${getPrice(spec.game, spec.price, defaults)}`}{" "}
            </p>
            <p className="txt">
              or Stake At{" "}
              {defaults.cashRating * spec.price === null ||
              !(defaults.cashRating * spec.price) ? (
                "0"
              ) : (
                <span
                  style={{ marginLeft: 5, display: "flex", marginRight: 5 }}
                >
                  {"  "} <GameCoin /> {`${defaults.cashRating * spec.price}`}
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
                    ? defaults.min_stack_roshambo
                    : spec.game === Games.penalth_card
                    ? defaults.min_stack_penalty
                    : spec.game === Games.matcher
                    ? defaults.min_stack_guess_master
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
                        ? defaults.min_stack_roshambo
                        : spec.game === Games.penalth_card
                        ? defaults.min_stack_penalty
                        : spec.game === Games.matcher
                        ? defaults.min_stack_guess_master
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
              Proceed
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
                if (spec.game === Games.lucky_geoge) {
                  push("/games");
                  setP2(true);
                  return;
                } else if (spec.game === Games.rooms) {
                  setSpec((prev) => {
                    return {
                      ...prev,
                      isOpen: false,
                    };
                  });
                }
                setSpec((prev) => {
                  return {
                    ...prev,
                    next: nextType.player,
                  };
                });
              }}
            >
              {spec.game === Games.rooms ? "back" : "confirm"}
            </span>
          </div>
        )}
      </div>
      <span
        className="new_game"
        onClick={() => {
          push("/games#play-games");
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
            push("/games");
          }}
        >
          <ArrowDownward />
        </Fab>
        <div className="container">
          <div
            className="game"
            onClick={() => {
              push("/games");
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
              push("/games");
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
              push("/games");
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
              push("/games");
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
              push("/games");
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
              push("/games");
              setSpec({
                isOpen: true,
                manual: "Coming soon",
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
          push("/games");
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
                <Badge color="secondary" badgeContent={my_games?.length  ??  0}>
                  <Typography
                    className={`btn ${viewing === Viewing.current ? "on" : ""}`}
                    onClick={() => setViewing(Viewing.current)}
                  >
                    Played Games
                  </Typography>
                </Badge>
                <Badge
                  color="secondary"
                  badgeContent={requests?.data?.requests.length  ?? 0}
                >
                  <Typography
                    className={`btn ${viewing === Viewing.request ? "on" : ""}`}
                    onClick={() => setViewing(Viewing.request)}
                  >
                    Request
                  </Typography>
                </Badge>
                <Badge color="secondary" badgeContent={0}>
                  <Typography
                    className={`btn ${
                      viewing === Viewing.notification ? "on" : ""
                    }`}
                    onClick={() => setViewing(Viewing.notification)}
                  >
                    Notification
                  </Typography>
                </Badge>
              </div>
            </div>
            <div className="game_content">
              {viewing === Viewing.current ? (
                my_games.length === 0 ? (
                  <p className="none">
                    You don't have any active games, hit the play game button to
                    add
                  </p>
                ) : (
                  my_games.map((game) => {
                    if (game.gameID === Games.custom_game) {
                      return (
                        <GameView
                          type="custom"
                          name={`${game?.battleScore?.player1?.title} ${
                            (game.battleScore.player1?.correctAnswer ?? "e") ===
                            (game.battleScore.player2?.correctAnswer ?? "r")
                              ? ""
                              : !isEmpty(game.battleScore.player2)
                              ? "(awaiting judge date)"
                              : moment(
                                  game.battleScore.player1.endDate
                                ).isSameOrAfter(new Date()) &&
                                !isEmpty(game.battleScore.player2)
                              ? "(judge now)"
                              : "(not joined)"
                          }`}
                          key={game._id}
                          date={game.date}
                          date2={game.battleScore.player1.endDate}
                          v1={game.price_in_value * (defaults?.cashRating ?? 1)}
                          v2={game.price_in_value}
                          v3={game.gameMemberCount}
                          id={game._id}
                          btn1func={() => {
                            if (
                              moment(
                                game.battleScore.player1.endDate
                              ).isSameOrAfter(new Date()) &&
                              !isEmpty(game.battleScore.player2)
                            ) {
                              setCustomWindow(dispatch, {
                                isOpen: modalType.open,
                                game: game,
                              });
                            } else {
                              toast(dispatch, {
                                msg:
                                  "You have not met the requirement to continue this game.",
                              }).fail();
                            }
                          }}
                          btn2func={() =>
                            exitWin(dispatch, {
                              open: modalType.open,
                              func: async () =>
                                Axios.post(
                                  `${url}/games/custom/game`,
                                  { id: game._id },
                                  {
                                    headers: {
                                      authorization: `Bearer ${getToken()}`,
                                    },
                                  }
                                ),
                              game: Games.custom_game,
                            })
                          }
                          cash={game.price_in_value}
                          coin={game.price_in_coin}
                          game={game.gameID}
                        />
                      );
                    }
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
                        v1={game.price_in_value * (defaults?.cashRating ?? 1)}
                        v2={game.price_in_value}
                        v3={game.gameMemberCount}
                        id={game._id}
                        btn1func={() => {
                          console.log("working");
                        }}
                        btn2view="exit"
                        btn2func={() => {
                          console.log("test");
                          exitWin(dispatch, {
                            open: modalType.open,
                            game: game.gameID,
                            func: async () => {
                              await Axios.delete(`${url}/games/any/cancel`, {
                                params: { gameID: game._id },
                                headers: {
                                  authorization: `Bearer ${getToken()}`,
                                },
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
                          });
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
                        name={`${request?.battleScore?.player1?.title}`}
                        key={request._id}
                        date={request.date}
                        date2={request.battleScore.player1.endDate}
                        v1={
                          request.price_in_value * (defaults?.cashRating ?? 1)
                        }
                        v2={request.price_in_value}
                        v3={request.gameMemberCount}
                        id={request._id}
                        btn1func={() =>
                          setCustomWindow(dispatch, {
                            isOpen: modalType.open,
                            game: request,
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
