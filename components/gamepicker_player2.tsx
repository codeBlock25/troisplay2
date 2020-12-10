import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  InputAdornment,
  Fab,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  NativeSelect,
} from "@material-ui/core";
import { PriceTagIcon } from "../icon";
import { Close, Search } from "@material-ui/icons";
import Axios, { AxiosResponse } from "axios";
import { url } from "../constant";
import { SyncLoader } from "react-spinners";
import {
  choices,
  Games,
  modalType,
  PayType,
  PlayerType,
} from "../typescript/enum";
import {
  getGame,
  getGameSelect,
  getToken,
  PlayLuckyGeogeGame,
} from "../functions";
import {
  exitWin,
  setCustomWindow,
  setGameDetails,
  toast,
} from "../store/action";
import { useQueryCache } from "react-query";
import GameView from "./game_view";
import { useRouter } from "next/router";
import GameView2 from "./game_view2";

export default function PickerPlayer2({
  game: game_to_play,
  isOpen,
  close,
}: {
  close: () => void;
  game: Games;
  isOpen: boolean;
}) {
  const dispatch = useDispatch();
  const [min, setmin] = useState<number>(0);
  const [max, setmax] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const [btn_loading, setBtnLoading] = useState<boolean>(false);
  const [loadingL, setLoadingL] = useState<boolean>(false);
  const { push, asPath } = useRouter();
  const [popState, setPopState] = useState<{
    msg: string;
    func?: () => void | boolean | Promise<void> | Promise<boolean>;
    game: Games;
    lucky?: {
      battleScore: {
        player1: {
          description: string;
          title: string;
          winnerCount: number;
        };
      };
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: string;
      isComplete: boolean;
      members: string[];
      playCount: number;
      played: boolean;
      price_in_coin: number;
      price_in_value: number;
      _id: string;
    };
    custom?: {
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
    room?: {
      _id: string;
      room_name: string;
      date: Date;
      last_changed: Date;
      entry_price: number;
      key_time: number;
      player_limit: number;
      addedBy: string;
      activeMember: number;
      players: [string];
    };
  }>({ game: Games.non, msg: "", func: null, lucky: null, room: null });
  const [open_games, setOpenGame] = useState<
    {
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
    }[]
  >([]);
  const [luckyDrawGame, setLuckyDrawGames] = useState<
    {
      battleScore: {
        player1: {
          description: string;
          title: string;
          winnerCount: number;
          winnerPrice: number;
          endDateTime: Date;
        };
      };
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: string;
      isComplete: boolean;
      members: string[];
      playCount: number;
      played: boolean;
      price_in_coin: number;
      price_in_value: number;
      _id: string;
    }[]
  >([]);
  const rooms: AxiosResponse<{
    rooms: {
      _id: string;
      room_name: string;
      date: Date;
      last_changed: Date;
      entry_price: number;
      key_time: number;
      player_limit: number;
      addedBy: string;
      activeMember: number;
      players: [string];
    }[];
  }> = useQueryCache().getQueryData("rooms");

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

  const playOne = async (playWith: PayType, id: string, game: Games) => {
    let token = getToken();
    if (btn_loading) return;
    setBtnLoading(true);
    await Axios({
      method: "POST",
      url: `${url}/games/play`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        gameID: id,
        playWith,
      },
    })
      .then(({ data: { price } }: AxiosResponse<{ price: number }>) => {
        close();
        setOpenGame([]);
        push(
          getGameSelect(asPath) === Games.roshambo
            ? "/games#roshambo-play"
            : getGameSelect(asPath) === Games.penalth_card
            ? "/games#penalty-card-play"
            : getGameSelect(asPath) === Games.matcher
            ? "/games#guess-master-play"
            : getGameSelect(asPath) === Games.rooms
            ? "/games#room-play"
            : getGameSelect(asPath) === Games.lucky_geoge
            ? "/games#lucky-draw-play"
            : "/games"
        );
        setGameDetails(dispatch, {
          player: PlayerType.second,
          id,
          price,
          payType: playWith,
        });
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 401") {
          toast(dispatch, {
            msg: `Insufficient Fund, please fund your cash wallet to continue the game.`,
          }).fail();
          return;
        }
        toast(dispatch, {
          msg: `An Error occured could not connect to troisplay game server please check you interner connection and Try Again.`,
        }).error();
      })
      .finally(() => {
        setmin(100);
        setmax(10000);
        setBtnLoading(false);
      });
  };

  const playLuckyGeoge = async (payWith: PayType, id: string) => {
    let token = getToken();
    if (loading) return;
    setLoadingL(true);
    await Axios({
      method: "POST",
      url: `${url}/games/lucky-geoge/play`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        payWith,
        id,
      },
    })
      .then(({ data: { price } }: AxiosResponse<{ price: number }>) => {
        toast(dispatch, {
          msg: `You have successfully joined the game.`,
        }).success();
      })
      .catch(() => {
        toast(dispatch, {
          msg: `An Error occured could not connect to troisplay game server please check you interner connection and Try Again.`,
        }).error();
        setLoadingL(false);
      })
      .finally(() => {
        setLoadingL(false);
      });
  };

  const LoadData = async ({ amount }: { amount: number }) => {
    let token = getToken();
    if (loading) return;
    setLoading(true);
    setmax(amount);
    await Axios({
      method: "GET",
      url: `${url}/games/getter`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        min,
        max: amount,
        game: getGameSelect(asPath),
      },
    })
      .then(
        ({
          data: { games },
        }: AxiosResponse<{
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
          }[];
        }>) => {
          setOpenGame(games);
        }
      )
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    LoadData({ amount: 100 });
  }, [isOpen]);
  const [loadingLuckyDrawGames, setLoadingLuckyDrawGames] = useState<boolean>(
    false
  );
  const luckyDrawGettter = useCallback(async () => {
    if (loadingLuckyDrawGames) return;
    if (getGameSelect(asPath) === Games.lucky_geoge) {
      setLoadingLuckyDrawGames(true);
      await Axios.get(`${url}/games/lucky-geoge`, {
        headers: { authorization: `Bearer ${getToken()}` },
      })
        .then(({ data }) => {
          setLuckyDrawGames(data.games);
        })
        .catch(() => {
          toast(dispatch, {
            msg:
              "Network error, if this continues reload the page or login again.",
          }).error();
        })
        .finally(() => {
          setLoadingLuckyDrawGames(false);
        });
    }
  }, [luckyDrawGame, asPath]);

  useEffect(() => {
    luckyDrawGettter();
  }, [luckyDrawGettter, asPath]);
  const theme = "dark-mode";
  return (
    <div
      className={`game_picker2 theme ${
        getGameSelect(asPath) !== Games.non ? "open" : ""
      } ${theme}`}
    >
      <div
        className={
          popState.game === Games.lucky_geoge ||
          popState.game === Games.rooms ||
          popState.game === Games.custom_game
            ? "container_pop open"
            : "container_pop"
        }
        onClick={(e: any) => {
          try {
            if (e?.target?.classList.contains("container_pop")) {
              setPopState((prev) => {
                return { ...prev, game: Games.non, func: null };
              });
            }
          } catch (error) {
            console.error(error, [e.target]);
          }
        }}
      >
        <div className="content">
          <h3 className="title">
            {popState.game === Games.lucky_geoge
              ? popState.lucky?.battleScore.player1.title ?? ""
              : popState.game === Games.custom_game
              ? popState.custom.battleScore.player1.title ?? ""
              : popState.room?.room_name ?? ""}
          </h3>
          <div className="txt">
            {popState.game === Games.lucky_geoge
              ? popState.lucky?.battleScore.player1.description ?? ""
              : popState.game === Games.custom_game
              ? popState.custom?.battleScore.player1.description ?? ""
              : ""}
          </div>
          {popState.lucky && (
            <div className="txt_">
              {" "}
              <span>Members</span>{" "}
              {popState.game === Games.lucky_geoge
                ? popState.lucky?.members.length ?? ""
                : ""}
            </div>
          )}
          <p className="txt_sub">
            NOTE: By clicking play you accept the game policy.
          </p>
          <Button
            className="btn"
            onClick={() => {
              popState.func();
            }}
          >
            play
          </Button>
        </div>
      </div>
      <div className="container">
        <h3 className="title">Games</h3>
        <div className="list_games" style={{ paddingBottom: "60px" }}>
          {loading ? (
            <>
              <span className="txt">Loading please wait...</span>
            </>
          ) : getGameSelect(asPath) === Games.lucky_geoge ? (
            luckyDrawGame.length <= 0 ? (
              <>
                <span className="txt">No avaliable games.</span>
              </>
            ) : (
              luckyDrawGame.map((game) => {
                return (
                  <GameView2
                    type="picker"
                    title={game.battleScore.player1.title}
                    coin={game.price_in_coin}
                    cash={game.price_in_value}
                    description={game.battleScore.player1.description}
                    winnings={game.battleScore.player1.winnerPrice}
                    playerJoined={game.members.length}
                    playerNeeded={game.gameMemberCount}
                    key={game._id}
                    btn1func={() => {
                      setPopState((prev) => {
                        return {
                          ...prev,
                          game: Games.lucky_geoge,
                          lucky: game,
                          func: async () =>
                            await PlayLuckyGeogeGame(
                              PayType.cash,
                              btn_loading,
                              setBtnLoading,
                              game._id,
                              dispatch,
                              game.battleScore.player1.title,
                              push
                            ).finally(() => {
                              setPopState((prev) => {
                                return { ...prev, func: null, game: Games.non };
                              });
                              close();
                              setGameDetails(dispatch, {
                                player: PlayerType.first,
                                id: undefined,
                                price: 0,
                              });
                            }),
                        };
                      });
                    }}
                    btn2func={() => {
                      setPopState((prev) => {
                        return {
                          ...prev,
                          game: Games.lucky_geoge,
                          lucky: game,
                          func: async () =>
                            await PlayLuckyGeogeGame(
                              PayType.coin,
                              btn_loading,
                              setBtnLoading,
                              game._id,
                              dispatch,
                              game.battleScore.player1.title,
                              push
                            ).finally(() => {
                              setPopState((prev) => {
                                return { ...prev, func: null, game: Games.non };
                              });
                              close();
                              setGameDetails(dispatch, {
                                player: PlayerType.first,
                                id: undefined,
                                price: 0,
                              });
                            }),
                        };
                      });
                    }}
                  />
                );
              })
            )
          ) : game_to_play === Games.rooms ? (
            rooms?.data?.rooms.map((game) => {
              return (
                <GameView
                  type="room"
                  name={game.room_name}
                  key={game._id}
                  date={game.date}
                  id={game._id}
                  cash={game.entry_price}
                  v1={game.entry_price}
                  v2={
                    game.entry_price * (defaults?.data.default.cashRating ?? 0)
                  }
                  coin={game.player_limit}
                  v3={game.activeMember}
                  game={Games.non}
                  btn1func={() => {
                    setPopState((prev) => {
                      return {
                        ...prev,
                        game: Games.rooms,
                        room: game,
                        func: () =>
                          push(
                            `/games/rooms/${game.room_name}?payWith=${PayType.cash}`
                          ),
                      };
                    });
                  }}
                  btn2func={() =>
                    setPopState((prev) => {
                      return {
                        ...prev,
                        game: Games.rooms,
                        room: game,
                        func: () =>
                          push(
                            `/games/rooms/${game.room_name}?payWith=${PayType.cash}`
                          ),
                      };
                    })
                  }
                />
              );
            })
          ) : open_games.length <= 0 ? (
            <>
              <span className="txt">No avaliable games.</span>
            </>
          ) : (
            open_games.map((game) => {
              let loading = false;
              if (game.gameID === Games.custom_game)
                return (
                  <GameView
                    type="custom"
                    name={game?.battleScore?.player1?.title}
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
                      setPopState((prev) => {
                        return {
                          ...prev,
                          custom: game,
                          msg: game.battleScore?.player1?.description ?? "hi",
                          game: Games.custom_game,
                          func: async () => {
                            setCustomWindow(dispatch, {
                              isOpen: modalType.open,
                              game,
                            });
                            setOpenGame([]);
                            close();
                          },
                        };
                      });
                    }}
                    btn2func={() =>
                      exitWin(dispatch, {
                        open: modalType.open,
                        func: async () => {
                          setOpenGame([]);
                          return Axios.post(
                            `${url}/games/custom/game`,
                            { id: game._id },
                            {
                              headers: {
                                authorization: `Bearer ${getToken()}`,
                              },
                            }
                          );
                        },
                        game: Games.custom_game,
                      })
                    }
                    cash={game.price_in_value}
                    coin={game.price_in_coin}
                    game={game.gameID}
                  />
                );
              return (
                <GameView
                  type="game_view"
                  name={
                    game.gameID === Games.roshambo
                      ? "Roshambo"
                      : game.gameID === Games.penalth_card
                      ? "Penelty Card"
                      : game.gameID === Games.matcher
                      ? "Guess Master"
                      : ""
                  }
                  key={game._id}
                  date={game.date}
                  id={game._id}
                  cash={game.price_in_value}
                  coin={game.price_in_coin}
                  game={game.gameID}
                  btn1view={
                    loading ? <SyncLoader size="10px" color="white" /> : null
                  }
                  btn2view={
                    loading ? <SyncLoader size="10px" color="white" /> : null
                  }
                  btn1func={() => {
                    loading = true;
                    playOne(PayType.cash, game._id, game.gameID).finally(
                      () => (loading = false)
                    );
                  }}
                  btn2func={() => {
                    loading = true;
                    playOne(PayType.coin, game._id, game.gameID).finally(
                      () => (loading = false)
                    );
                  }}
                />
              );
            })
          )}
        </div>
        <div className="action_input">
          {getGameSelect(asPath) === Games.roshambo ||
          getGameSelect(asPath) === Games.penalth_card ||
          getGameSelect(asPath) === Games.matcher ? (
            <>
              <FormControl
                required
                className="inputBox select"
                variant="filled"
              >
                <InputLabel>Price</InputLabel>
                <Select
                  fullWidth
                  value={max}
                  onChange={(evt) => {
                    if (!parseInt(evt.target.value as string, 10) || loading)
                      return;
                    LoadData({
                      amount: parseInt(evt.target.value as string, 10),
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
              <Fab
                className="cls"
                onClick={() => {
                  setmin(100);
                  setmax(10000);
                  close();
                }}
              >
                <Close />
              </Fab>
            </>
          ) : getGameSelect(asPath) === Games.lucky_geoge ? (
            <>
              <div style={{ width: `calc(95% - 50px)` }} />
              <Fab
                className="cls"
                onClick={() => {
                  setmin(100);
                  setmax(100);
                  close();
                }}
              >
                <Close />
              </Fab>
            </>
          ) : (
            <>
              <Fab
                className="cls"
                onClick={() => {
                  setmin(100);
                  setmax(100);
                  close();
                }}
              >
                <Close />
              </Fab>
              <TextField
                variant="outlined"
                required
                placeholder="min price"
                type="number"
                disabled={game_to_play === Games.rooms ? true : false}
                value={min}
                onChange={(evt) => {
                  if (!parseInt(evt.target.value, 10) || min >= max + 5) return;
                  setmin(parseInt(evt.target.value, 10));
                }}
                className={`inputBox theme ${theme}`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="icon">
                      <PriceTagIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                required
                placeholder="min price"
                className={`inputBox theme ${theme}`}
                value={max}
                disabled={game_to_play === Games.rooms ? true : false}
                type="number"
                onChange={(evt) => {
                  if (!parseInt(evt.target.value, 10) || max <= min - 5) return;
                  setmax(parseInt(evt.target.value, 10));
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="icon">
                      <PriceTagIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Fab
                className="srch"
                onClick={() => LoadData({ amount: max })}
                disabled={game_to_play === Games.rooms ? true : false}
              >
                <Search />
              </Fab>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
