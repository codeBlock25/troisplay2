import React, { SetStateAction, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Fab,
  Button,
} from "@material-ui/core";
import { GameCoin, PriceTagIcon } from "../icon";
import { Close, Search } from "@material-ui/icons";
import Axios, { AxiosResponse } from "axios";
import { url, url_media } from "../constant";
import { BounceLoader, SyncLoader, PulseLoader } from "react-spinners";
import moment from "moment";
import { Games, modalType, nextType, PayType, PlayerType } from "../typescript/enum";
import { getPrice, getToken, PlayLuckyGeogeGame } from "../functions";
import { setGameDetails, toast } from "../store/action";
import { useQueryCache } from "react-query";
import GameView from "./game_view";
import { useRouter } from "next/router";

export default function PickerPlayer2({
  game: game_to_play,
  isOpen,
  my,
  close,
  spec,
  specfunc
}: {
  close: ()=>void
  spec:{
    isOpen: boolean;
    manual: string;
    price: number;
    game: Games;
    next?: nextType;
}
  specfunc:(value:SetStateAction<{
    isOpen: boolean;
    manual: string;
    price: number;
    game: Games;
    next?: nextType;
}>) => void
  game: Games;
  isOpen: boolean;
  my: {
    userID: string;
    full_name: string;
    phone_number: string;
    playerpic: string;
    playername: string;
    email: string;
    location: string;
  };
}) {
  const dispatch = useDispatch();
  const [min, setmin] = useState<number>(0);
  const [max, setmax] = useState<number>(10000);
  const [loading, setLoading] = useState<boolean>(false);
  const [btn_loading, setBtnLoading] = useState<boolean>(false);
  const [loadingL, setLoadingL] = useState<boolean>(false);
  const { push } = useRouter()
  const [open_games, setOpenGame] = useState<
    {
      _id: string;
      gameMemberCount: number;
      members: string[];
      priceType: string;
      price_in_coin: number;
      price_in_value: number;
      Games: string;
      gameDetail: string;
      gameID: Games;
      played: boolean;
      date: Date;
      battleScore: {
        player1: any;
        player2: any;
      };
    }[]
  >([]);
  const lucky_games: AxiosResponse<{
    games: {
      battleScore: {
        player1: {
          description: string
          title: string
          winnerCount: number
      }}
      date: Date
      gameDetail: string
      gameID: Games
      gameMemberCount: number
      gameType: string
      isComplete: boolean
      members: string[]
      playCount: number
      played: boolean
      price_in_coin: number
      price_in_value: number
      _id: string;
    }[]
  }> = useQueryCache().getQueryData("lucky-games")
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
  }> = useQueryCache().getQueryData("rooms")
 
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
      console.log(id)
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
          close()
          setGameDetails(dispatch,{player: PlayerType.second, game, id, price})
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
          setmin(0);
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

  const LoadData = async () => {
    let token = getToken();
    if (loading) return;
    setLoading(true);
    await Axios({
      method: "GET",
      url: `${url}/games/getter`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        min,
        max,
        game: game_to_play,
      },
    })
      .then(
        ({
          data: { games },
        }: AxiosResponse<{
          games: {
            _id: string;
            gameMemberCount: number;
            members: string[];
            priceType: string;
            price_in_coin: number;
            price_in_value: number;
            Games: string;
            gameDetail: string;
            gameID: Games;
            played: boolean;
            date: Date;
            battleScore: {
              player1: any;
              player2: any;
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
    LoadData();
  }, [isOpen]);

  const theme = "dark-mode";
  return (
    <div className={`game_picker2 theme ${isOpen? "open":""} ${theme}`}>
      <div className="container">
        <h3 className="title">Games</h3>
        <div className="list_games" style={{ paddingBottom: "60px" }}>
          {
            game_to_play === Games.lucky_geoge ?
              (lucky_games?.data?.games.map((game) => {
                return (
                  <GameView
                    type="lucky"
                    name={game.battleScore.player1.title
                    }
                    key={game._id}
                    date={game.date}
                    id={game._id}
                    cash={game.price_in_value}
                    v1={game.price_in_value}
                    v2={game.price_in_value * (defaults?.data.default.cashRating ?? 0)}
                    coin={game.battleScore.player1.winnerCount}
                    v3={game.battleScore.player1.winnerCount}
                    game={game.gameID}
                    btn1func={async () => await PlayLuckyGeogeGame(PayType.cash, btn_loading, setBtnLoading, game._id, dispatch, game.battleScore.player1.title)}
                    btn2func={async () => await PlayLuckyGeogeGame(PayType.coin, btn_loading, setBtnLoading, game._id, dispatch, game.battleScore.player1.title)}
                  />
                );
              }))
              :
              game_to_play === Games.rooms ?
                (rooms?.data?.rooms.map((game) => {
                  return (
                    <GameView
                      type="room"
                      name={game.room_name}
                      key={game._id}
                      date={game.date}
                      id={game._id}
                      cash={game.entry_price}
                      v1={game.entry_price}
                      v2={game.entry_price * (defaults?.data.default.cashRating ?? 0)}
                      coin={game.player_limit}
                      v3={game.activeMember}
                      game={Games.non}
                      btn1func={() => {
                        push(`/games/rooms/${game.room_name}?payWith=${PayType.cash}`);
                      }}
                      btn2func={() => {
                        push(`/games/rooms/${game.room_name}?payWith=${PayType.cash}`)
                      }}
                  />
                );
              }))
              :
            open_games.length <= 0 ? (
            <>
              <span className="txt">No avaliable games.</span>
            </>
          ) : (
            open_games.map((game) => {
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
                  btn1view={btn_loading ? <SyncLoader size="10px" color="white" /> : null}
                  btn2view={btn_loading ? <SyncLoader size="10px" color="white" /> : null}
                  btn1func={()=>playOne(PayType.cash, game._id, game.gameID)}
                  btn2func={()=>playOne(PayType.coin, game._id, game.gameID)}
                />
                );
            })
          )}
        </div>
        <div className="action_input">
          <Fab
            className="cls"
            onClick={() => {
              setmin(0);
              setmax(10000);
              close()
            }}
          >
            <Close />
          </Fab>
          <TextField
            variant="outlined"
            required
            placeholder="min price"
            type="number"
            disabled={game_to_play === Games.rooms||game_to_play===Games.lucky_geoge ? true: false}
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
            disabled={game_to_play === Games.rooms||game_to_play===Games.lucky_geoge ? true: false}
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
          <Fab className="srch" onClick={LoadData} disabled={game_to_play === Games.rooms||game_to_play===Games.lucky_geoge ? true:false}>
            <Search />
          </Fab>
        </div>
      </div>
    </div>
  );
}
