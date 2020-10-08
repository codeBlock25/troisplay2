import { Button, Fab } from "@material-ui/core";
import Axios, { AxiosResponse } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { url } from "../../constant";
import {
  notify,
  setCashWalletCoin,
  setExit,
  setGame,
  setGamepickerform,
  setMyGames,
  setP2game,
  setSearchSpec,
  setWalletCoin,
} from "../../store/action";
import {
  eventReducerType,
  gameType,
  modalType,
  NotiErrorType,
} from "../../store/reducer/event";
import { ColorWheel } from "../icons";
import { IniReducerType } from "../panel";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { isEmpty } from "lodash";
import { Close } from "@material-ui/icons";
import { MoonLoader } from "react-spinners";

export default function Matcher() {
  const dispatch: Function = useDispatch();
  const [{ token }] = useCookies(["token"]);
  const [prize, setPrice] = useState<number>(0);
  const [playCount, setPlaycount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [num, setNum] = useState<number>(1);
  const [view1, setView1] = useState<boolean>(true);
  const [view2, setView2] = useState<boolean>(true);
  const [view3, setView3] = useState<boolean>(true);
  const [view4, setView4] = useState<boolean>(true);
  const [view5, setView5] = useState<boolean>(true);
  const [view6, setView6] = useState<boolean>(true);
  const [view7, setView7] = useState<boolean>(true);
  const [played, setPlayed] = useState<number[]>([]);
  const {
    theme,
    game,
    gameID,
    price,
    coin,
    cash,
    games,
  }: {
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
  } = useSelector<
    {
      initial: IniReducerType;
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
    }
  >((state): {
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
  } => {
    return {
      theme: state.initial.theme,
      game: state.event.game,
      gameID: state.event.gameID,
      price: state.event.searchspec.price,
      coin: state.initial.wallet.currentCoin,
      cash: state.initial.cashwallet.currentCash,
      games: state.initial.my_games,
    };
  });
  const [isStarted, setStarted] = useState<boolean>(true);
  useEffect(() => {
    if (isStarted) {
      const interval = setInterval(() => {
        setPrice(Math.ceil(Math.random() * 100));
      }, 150);
      setTimeout(() => {
        clearInterval(interval);
        setStarted(false);
        setDone(true);
      }, 12000);
    }
  }, [isStarted, game]);

  const matchPlay = async (
    e: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    if (loading || num === 0) return;
    setLoading(true);
    if (isEmpty(gameID)) {
      await Axios({
        method: "POST",
        url: `${url}/games/matcher`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          price_in_cash: price,
          gameInPut: num,
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
            dispatch(setGamepickerform(modalType.close));
            dispatch(setMyGames([game, ...games]));
            dispatch(setCashWalletCoin(cash - price));
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
          setNum(0);
        });
    } else {
      if (played.includes(num)) {
        setLoading(false);
        toast.dark(`Can't repeat failed guesses`);
        return;
      }
      await Axios({
        method: "POST",
        url: `${url}/games/matcher/challange`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          id: gameID,
          gameInPut: num,
        },
      })
        .then(
          ({
            data: { winner, price },
          }: AxiosResponse<{
            winner: boolean;
            price: number;
            final: boolean;
          }>) => {
            setPlaycount((prev) => prev + 1);
            if (!winner) {
              if (playCount === 3) {
                dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
                dispatch(setGame(gameType.non, ""));
                dispatch(setGamepickerform(modalType.close));
                dispatch(setWalletCoin(coin + price));
                dispatch(
                  setP2game({
                    isOpen: modalType.close,
                    games: [],
                    game: gameType.non,
                  })
                );
                setPlaycount(1);
                dispatch(
                  notify({
                    isOPen: modalType.open,
                    msg: winner
                      ? `Congratualations You just won this game and have gained $${price}`
                      : "Sorry you lost.",
                    type: winner ? NotiErrorType.success : NotiErrorType.error,
                  })
                );
                setView1(true);
                setView2(true);
                setView3(true);
                setView4(true);
                setView5(true);
                setView6(true);
                setView7(true);
                setNum(1);
                setPlayed([]);
                return;
              } else {
                toast.dark(`You have ${3 - playCount} attempts left`);
                setPlayed((prev) => [...prev, num]);
                switch (num) {
                  case 1:
                    setView1(false);
                    break;
                  case 2:
                    setView2(false);
                    break;
                  case 3:
                    setView3(false);
                    break;
                  case 4:
                    setView4(false);
                    break;
                  case 5:
                    setView5(false);
                    break;
                  case 6:
                    setView6(false);
                    break;
                  case 7:
                    setView7(false);
                    break;
                  default:
                    break;
                }
              }
              return;
            }
            dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
            dispatch(setGame(gameType.non, ""));
            dispatch(setGamepickerform(modalType.close));
            dispatch(setWalletCoin(coin + price));
            dispatch(
              setP2game({
                isOpen: modalType.close,
                games: [],
                game: gameType.non,
              })
            );
            setPlaycount(1);
            setView1(true);
            setView2(true);
            setView3(true);
            setView4(true);
            setView5(true);
            setView6(true);
            setView7(true);
            setNum(1);
            setPlayed([]);
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
        });
    }
  };

  if (game === gameType.matcher)
    return (
      <div className={`gameworld theme ${theme}`}>
        <div className="world matcher">
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
                        url: `${url}/games/roshambo/exit`,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        data: {
                          id: gameID,
                        },
                      })
                        .then(() => {
                          dispatch(
                            setSearchSpec({ game: gameType.non, price: 0 })
                          );
                          dispatch(setGame(gameType.non, ""));
                          dispatch(setGamepickerform(modalType.close));
                          dispatch(setWalletCoin(coin + price));
                          dispatch(
                            setP2game({
                              isOpen: modalType.close,
                              games: [],
                              game: gameType.non,
                            })
                          );
                          setPlaycount(1);
                          setView1(true);
                          setView2(true);
                          setView3(true);
                          setView4(true);
                          setView5(true);
                          setView6(true);
                          setView7(true);
                          setNum(1);
                          dispatch(setGame(gameType.non, ""));
                          setLoading(false);
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
          <h3 className="title">Pick A number</h3>
          <p className={`txt theme ${theme}`}>
            NOTE: You Pick your moves by clicking/tapping the icons to each
            option, hit play when yo have made you choice.
          </p>
          <div className="num">
            <span>{num}</span>
          </div>
          <div className="picker">
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view1 ? "" : "out"}`}
              onClick={() => {
                setNum(1);
              }}
            >
              1
            </Fab>
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view2 ? "" : "out"}`}
              onClick={() => {
                setNum(2);
              }}
            >
              2
            </Fab>
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view3 ? "" : "out"}`}
              onClick={() => {
                setNum(3);
              }}
            >
              3
            </Fab>
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view4 ? "" : "out"}`}
              onClick={() => {
                setNum(4);
              }}
            >
              4
            </Fab>
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view5 ? "" : "out"}`}
              onClick={() => {
                setNum(5);
              }}
            >
              5
            </Fab>
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view6 ? "" : "out"}`}
              onClick={() => {
                setNum(6);
              }}
            >
              6
            </Fab>
            <Fab
              variant="round"
              className={`btn_num theme ${theme} ${view7 ? "" : "out"}`}
              onClick={() => {
                setNum(7);
              }}
            >
              7
            </Fab>
          </div>
          <Button className={`btn_ theme ${theme}`} onClick={matchPlay}>
            {loading ? <MoonLoader size="20px" color={`white`} /> : "play"}
          </Button>
        </div>
      </div>
    );
  else return <></>;
}
