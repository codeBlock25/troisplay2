import Head from "next/head";
import React, {
  MutableRefObject,
  useCallback,
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
  notificationHintType,
} from "../../typescript/enum";
import {
  getGame,
  getGameSelect,
  getPrice,
  getToken,
  whoIsThis,
} from "../../functions";
import { SyncLoader } from "react-spinners";
import Notification from "../../components/notification";
import Roshambo from "../../components/games/roshambo";
import {
  exitWin,
  NotificationAction,
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
import {
  Badge,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { ArrowDownward } from "@material-ui/icons";
import Bottompanel from "../../components/bottompanel";
import DetailScreen from "../../components/DetailScreen";
import CustomWindow from "../../components/customWindow";
import AccountF from "../../components/account_f";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { reducerType } from "../../typescript/interface";
import { filter, isEmpty, reverse, sortBy } from "lodash";
import GameView2 from "../../components/game_view2";
import NotificationDisplay from "../../components/notification_display";

export default function GamesScreen() {
  const dispatch = useDispatch();
  const [viewing, setViewing] = useState<Viewing>(Viewing.current);
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [runText, setRunText] = useState("loading game components...");
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const [p2, setP2] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const { push, beforePopState, asPath, pathname } = useRouter();

  const { my_games, defaults, notifications } = useSelector<
    reducerType,
    {
      notifications: {
        notifications: {
          message: string;
          time: Date;
          type: notificationHintType;
          hasNew: boolean;
        }[];
        userID: string;
        date: Date;
      };
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
            correct_answer: string;
            winnerCount?: number;
            winnerPrice?: number;
            endDateTime?: number;
          };
          player2?: {
            answer: string;
            waiting: boolean;
            correct_answer: string;
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
      notifications: state.init.notification,
    };
  });

  const notificationCallback = useCallback(async () => {
    await Axios.put(
      `${url}/notifications/mark-read`,
      {},
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    )
      .then(() => {
        NotificationAction.markRead({
          dispatch,
          notifications: notifications.notifications,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [notificationCount]);

  useEffect(() => {
    if (viewing === Viewing.notification) notificationCallback();
  }, [viewing]);

  useEffect(() => {
    if (!isEmpty(notifications.notifications)) {
      let r = filter(notifications.notifications, {
        hasNew: true,
      });
      setNotificationCount(r.length);
    }
  }, [notifications]);
  const [spec, setSpec] = useState<{
    isOpen: boolean;
    manual: string;
    price: number;
    next?: nextType;
  }>({
    isOpen: false,
    manual: "",
    price: 100,
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
      <PickerPlayer2
        game={getGameSelect(asPath)}
        isOpen={p2}
        close={() => push("/games")}
      />
      <ToastContainer />
      <div
        className={`game_picker_view ${
          getGame(asPath) !== Games.non ? "open" : ""
        }`}
        onClick={(e: any) => {
          if (!e.target?.classList?.contains("game_picker_view")) {
            return;
          }
          setSpec((prev) => {
            push("/games");
            return {
              ...prev,
              game: Games.non,
              next: nextType.player,
            };
          });
        }}
      >
        {spec.next === nextType.price ? (
          <form
            className="container_price"
            onSubmit={(e) => {
              e.preventDefault();
              if (
                spec.price <
                (asPath === "/games#roshambo"
                  ? defaults.min_stack_roshambo
                  : asPath === "/games#penalty-card"
                  ? defaults.min_stack_penalty
                  : asPath === "/games#guess-master"
                  ? defaults.min_stack_guess_master
                  : 0)
              ) {
                toast(dispatch, {
                  msg: `Can't play ${
                    asPath === "/games#roshambo"
                      ? "Roshambo"
                      : asPath === "/games#penalty-card"
                      ? "Penalty Card"
                      : asPath === "/games#guess-master"
                      ? "Guess Master"
                      : ""
                  } game below the minimum price bar. Please stake something higher than ₦ ${
                    asPath === "/games#roshambo"
                      ? defaults.min_stack_roshambo
                      : asPath === "/games#penalty-card"
                      ? defaults.min_stack_penalty
                      : asPath === "/games#guess-master"
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
              });
              setSpec((prev) => {
                return {
                  ...prev,
                  game: Games.non,
                  next: nextType.player,
                };
              });
              push(
                getGame(asPath) === Games.roshambo
                  ? "/games#roshambo-play"
                  : getGame(asPath) === Games.penalth_card
                  ? "/games#penalty-card-play"
                  : getGame(asPath) === Games.matcher
                  ? "/games#guess-master-play"
                  : getGame(asPath) === Games.rooms
                  ? "/games#room-play"
                  : getGame(asPath) === Games.lucky_geoge
                  ? "/games#lucky-draw-play"
                  : "/games"
              );
            }}
          >
            <h3 className="title">Game Setup.</h3>
            <p className="txt">
              To stand a chances to earn{" "}
              {getPrice(getGame(asPath), spec.price, defaults) <= 0
                ? ""
                : `$ ${getPrice(getGame(asPath), spec.price, defaults)}`}{" "}
            </p>
            {asPath === "/games#roshambo" ||
            asPath === "/games#penalty-card" ||
            asPath === "/games#guess-master" ? (
              <FormControl
                required
                className="inputBox select"
                variant="filled"
              >
                <InputLabel>Price</InputLabel>
                <Select
                  value={spec.price}
                  onChange={(e) => {
                    e.persist();
                    setSpec((prev) => {
                      return {
                        ...prev,
                        price: parseInt(e.target.value as string, 10),
                      };
                    });
                  }}
                >
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={300}>300</MenuItem>
                  <MenuItem value={500}>500</MenuItem>
                  <MenuItem value={1000}>1000</MenuItem>
                  <MenuItem value={2000}>2000</MenuItem>
                  <MenuItem value={3000}>3000</MenuItem>
                  <MenuItem value={5000}>5000</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <div className="inputBox norm">
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
                  className="inputBox_"
                  placeholder="in ($)"
                />
              </div>
            )}
            <button type="submit" className="btn">
              Proceed
            </button>
          </form>
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
                {asPath === "/games#penalty-card" ? "Taker" : "Player 1"}
              </div>
              <div
                className="btn"
                onClick={() => {
                  push(
                    getGame(asPath) === Games.roshambo
                      ? "/games#roshambo-select"
                      : getGame(asPath) === Games.penalth_card
                      ? "/games#penalty-card-select"
                      : getGame(asPath) === Games.matcher
                      ? "/games#guess-master-select"
                      : getGame(asPath) === Games.rooms
                      ? "/games#room-select"
                      : getGame(asPath) === Games.lucky_geoge
                      ? "/games#lucky-draw-select"
                      : "/games"
                  );
                  setSpec((prev) => {
                    return { ...prev, isOpen: false };
                  });
                  setP2(true);
                }}
              >
                {asPath === "/games#penalty-card" ? "Keeper" : "Player 2"}
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
                if (getGame(asPath) === Games.lucky_geoge) {
                  push("/games#lucky-draw-select");
                  setP2(true);
                  return;
                } else if (
                  getGame(asPath) === Games.rooms ||
                  getGame(asPath) === Games.custom_game
                ) {
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
              {getGame(asPath) === Games.rooms ||
              getGame(asPath) === Games.custom_game
                ? "back"
                : "confirm"}
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
              push("/games#roshambo");
              setSpec({
                isOpen: true,
                manual:
                  "A player who decides to play rock will beat another player who has chosen scissors (rock crushes scissors), but will lose to one who has played paper (paper covers rock); a play of paper will lose to a play of scissors (scissors cuts paper). If both players choose the same shape, the game is tied and is usually immediately replayed to break the tie.",
                price: 100,
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
              push("/games#penalty-card");
              setSpec({
                isOpen: true,
                manual:
                  "Just as penalty in the game of soccer, involves the taker and goal keeper. Taker aim is to score (choose opposite direction as the goal keeper) while the goal keeper is the catch the ball (go same direction as the taker).",
                price: 100,
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
              push("/games#guess-master");
              setSpec({
                isOpen: true,
                manual:
                  "Player two has three chances to guess the number player 1 choose from number one to seven.",
                price: 100,
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
              push("/games#lucky-draw");
              setSpec({
                isOpen: true,
                manual:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor non, enim accusantium officiis laborum hic asperiores a corporis illum quis.",
                price: 100,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/lucky-geoge.png)` }}
            />
            <div className="details">
              <span className="name">lucky draw</span>
              <span className="info">
                <b>min stake:</b>judge based
              </span>
              <span className="info">
                <b>rating:</b> 100%+
              </span>
            </div>
          </div>
          {/* <div
            className="game"
            onClick={() => {
              push("/games#");
              setSpec({
                isOpen: true,
                manual: "Coming Soon",
                price: 100,
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
                price: 100,
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
         */}
        </div>
      </div>
      <AccountF />
      <section
        className={
          gameViewOpen || getGame(asPath) !== Games.non
            ? "games_world_ blur"
            : "games_world_"
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
                <Badge color="secondary" badgeContent={my_games?.length ?? 0}>
                  <Typography
                    className={`btn ${viewing === Viewing.current ? "on" : ""}`}
                    onClick={() => setViewing(Viewing.current)}
                  >
                    Played Games
                  </Typography>
                </Badge>
                {/* <Badge
                  color="secondary"
                  badgeContent={requests?.data?.requests.length ?? 0}
                >
                  <Typography
                    className={`btn ${viewing === Viewing.request ? "on" : ""}`}
                    onClick={() => setViewing(Viewing.request)}
                  >
                    Request
                  </Typography>
                </Badge> */}
                <Badge color="secondary" badgeContent={notificationCount}>
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
                  <>
                    {my_games.map((game) => {
                      if (game.gameID === Games.custom_game) {
                        return (
                          <GameView
                            type="custom2"
                            name={`${game?.battleScore?.player1?.title} ${
                              (game?.battleScore?.player1?.correct_answer ??
                                "") !==
                              (game?.battleScore?.player2?.correct_answer ?? "")
                                ? "[On hold]"
                                : moment(
                                    game?.battleScore?.player1?.endDate
                                  ).isSameOrBefore(new Date()) &&
                                  !isEmpty(game?.battleScore?.player2)
                                ? "[judge now]"
                                : !isEmpty(game?.battleScore?.player2)
                                ? "[awaiting judge date]"
                                : "[not joined]"
                            }`}
                            key={game._id}
                            date={game.date}
                            date2={game.battleScore?.player1?.endDate}
                            v1={
                              game.price_in_value * (defaults?.cashRating ?? 1)
                            }
                            v2={game.price_in_value}
                            v3={game.gameMemberCount}
                            id={game._id}
                            btn1func={() => {
                              if (
                                moment(
                                  game.battleScore?.player1?.endDate
                                ).isSameOrBefore(new Date()) &&
                                !isEmpty(game.battleScore?.player2)
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
                      if (game.gameID === Games.lucky_geoge)
                        return (
                          <GameView2
                            key={game._id}
                            coin={game.price_in_coin}
                            cash={game.price_in_value}
                            description={game.battleScore?.player1?.description}
                            winnings={
                              game.battleScore?.player1?.winnerPrice ?? 0
                            }
                            playerJoined={game.members.length}
                            playerNeeded={game.gameMemberCount}
                          />
                        );
                      return (
                        <GameView
                          type={game.gameID === Games.rooms ? "room" : "normal"}
                          name={
                            game.gameID === Games.roshambo
                              ? "Roshambo"
                              : game.gameID === Games.penalth_card
                              ? "Penalty Card"
                              : game.gameID === Games.matcher
                              ? "Guess Master"
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
                    })}
                  </>
                )
              ) : viewing === Viewing.notification ? (
                (notifications?.notifications?.length ?? 0) === 0 ? (
                  <p className="none">No notification yet</p>
                ) : (
                  reverse(notifications?.notifications ?? []).map(
                    (
                      notification: {
                        message: string;
                        time: Date;
                        type: notificationHintType;
                        hasNew: boolean;
                      },
                      index: number
                    ) => (
                      <NotificationDisplay
                        key={index}
                        msg={notification.message}
                        date={notification.time}
                        type={notification.type}
                        hasSeen={notification.hasNew}
                        notifications={notifications.notifications}
                      />
                    )
                  )
                )
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
                        date2={request.battleScore?.player1?.endDate}
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
