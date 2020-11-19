import Axios, { AxiosResponse } from "axios";
import { memo, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../constant";
import {
  exitWin,
  MyGamesAction,
  notify,
  setGameDetails,
  toast,
} from "../../store/action";
import Link from "next/link";
import { isEmpty } from "lodash";
import { SyncLoader } from "react-spinners";
import {
  Games,
  modalType,
  NotiErrorType,
  PayType,
  PlayerType,
  TwoButtonLoader,
} from "../../typescript/enum";
import { ActionType, reducerType } from "../../typescript/interface";
import { getPrice, getToken } from "../../functions";
import { CloseIcon, GameCoin } from "../../icon";
import { useQueryCache } from "react-query";
import { Dispatch } from "redux";


const GuessMaster = memo(function () {
  const dispatch: Dispatch<ActionType<any>> = useDispatch();
  const [prize, setPrice] = useState<number>(0);
  const [playCount, setPlaycount] = useState<number>(1);
  const [loading, setLoading] = useState<TwoButtonLoader>(
    TwoButtonLoader.no_loading
  );
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
  const { details } = useSelector<
    reducerType,
    {
      details: {
        price: number;
        game: Games;
        id?: string;
        player: PlayerType;
        payWith: PayType
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
  }, [isStarted, details]);

  const matchPlay = async (
    payWith?: PayType
  ): Promise<void> => {
    let token = getToken()
    if (loading !== TwoButtonLoader.no_loading || num === 0) return;
    if (isEmpty(details.id)) {
      if (PayType.cash === payWith) {
        setLoading(TwoButtonLoader.first_loading);
      } else {
        setLoading(TwoButtonLoader.second_loading);
      }
      await Axios({
        method: "POST",
        url: `${url}/games/guess-master`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          price_in_cash: details.price,
          gameInPut: num,
          payWith: payWith,
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
            MyGamesAction.add({   dispatch, payload: game   });;;
            setGameDetails(dispatch, {
              player: PlayerType.first,
              game: Games.non,
              id: undefined,
              price: 0,
            });
            toast(dispatch, {
              msg: `Congratulations!!!! You have successfully played a game, please wait for Player 2's challange.`,
            }).success();
          }
        )
        .catch((err) => {
          if (err.message === "Request failed with status code 401") {
            toast(dispatch, {
              msg: `Insufficient Fund, please fund your ${
                details.payWith === PayType.cash ? "cash wallet" : "coin wallet"
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
          setNum(1);
        });
    } else {
      if (played.includes(num)) {
        setLoading(TwoButtonLoader.no_loading);
        return;
      }
      setLoading(TwoButtonLoader.first_loading);
      await Axios({
        method: "POST",
        url: `${url}/games/matcher/challange`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          id: details.id,
          gameInPut: num,
          payWith: details.payWith,
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
                notify(dispatch, {
                  type: NotiErrorType.error,
                  msg: "Sorry you lost this game.",
                  isOpen: modalType.open,
                });
                setView1(true);
                setView2(true);
                setView3(true);
                setView4(true);
                setView5(true);
                setView6(true);
                setView7(true);
                setNum(1);
                setPlayed([]);
                setGameDetails(dispatch, {
                  player: PlayerType.first,
                  game: Games.non,
                  id: undefined,
                  price: 0,
                });
                return;
              } else {
                // !counting
                setPlayed((prev) => [...prev, num]);
                toast(dispatch, {
                  msg: `Sorry wrong number selected, You have ${
                    3 - playCount
                  } attemp(s) left!`,
                }).fail();
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
            notify(dispatch, {
              isOpen: modalType.open,
              type: NotiErrorType.success,
              msg: `Congratulations!!!! You have won ${price}.`,
            });
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
            setGameDetails(dispatch, {
              player: PlayerType.first,
              game: Games.non,
              id: undefined,
              price: 0,
            });
          }
        )
        .catch((err) => {
          console.log(err);
          toast(dispatch, { msg: "Communication error." }).error();
        })
        .finally(() => {
          setLoading(TwoButtonLoader.no_loading);
        });
    }
  };
  const theme = "dark-mode"
  if (details.game === Games.matcher)
    return (
      <div className={`gameworld ${theme}`}>
        <div className="world matcher">
          {/* <div
            className="close_btn"
            onClick={() => {
              if (isEmpty(details.id)) {
                setGameDetails(dispatch, {
                  player: PlayerType.first,
                  game: Games.non,
                  id: undefined,
                  price: 0,
                });
                setLoading(TwoButtonLoader.no_loading);
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
                return;
              }
              exitWin(dispatch, {
                open: modalType.open,
                func: async () => {
                  let token = getToken();
                  await Axios({
                    method: "POST",
                    url: `${url}/games/roshambo/exit`,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    data: {
                      id: details.id,
                    },
                  })
                    .then(() => {
                      setLoading(TwoButtonLoader.no_loading);
                      setPlaycount(1);
                      setView1(true);
                      setView2(true);
                      setView3(true);
                      setView4(true);
                      setView5(true);
                      setNum(1);
                      setPlayed([]);
                      setGameDetails(dispatch, {
                        player: PlayerType.first,
                        game: Games.non,
                        id: undefined,
                        price: 0,
                      });
                    })
                    .catch(() => {
                      toast(dispatch, {
                        msg: "Oops, An error occured.",
                      }).error();
                    });
                },
              });
            }}
          >
            <CloseIcon />
          </div>
         */}
          <h3 className="title">Pick A number</h3>
          <p className={`txt theme ${theme}`}>
            NOTE: You Pick your moves by clicking/tapping the icons to each
            option, hit play when yo have made you choice.
          </p>
          {details.player === PlayerType.second ||
            (!isEmpty(details.id) && (
              <p className={`sub_txt theme ${theme}`}>
                You have used {playCount - 1} out your 3 trials
              </p>
            ))}
          <div className="num">
            <span>{num}</span>
          </div>
          <div className="picker">
            <div
              className={`btn_num theme ${theme} ${view1 ? "" : "out"}`}
              onClick={() => {
                setNum(1);
              }}
            >
              1
            </div>
            <div
              className={`btn_num theme ${theme} ${view2 ? "" : "out"}`}
              onClick={() => {
                setNum(2);
              }}
            >
              2
            </div>
            <div
              className={`btn_num theme ${theme} ${view3 ? "" : "out"}`}
              onClick={() => {
                setNum(3);
              }}
            >
              3
            </div>
            <div
              className={`btn_num theme ${theme} ${view4 ? "" : "out"}`}
              onClick={() => {
                setNum(4);
              }}
            >
              4
            </div>
            <div
              className={`btn_num theme ${theme} ${view5 ? "" : "out"}`}
              onClick={() => {
                setNum(5);
              }}
            >
              5
            </div>
          </div>
          {!isEmpty(details.id) ? (
            <div className={`btn_ theme ${theme}`} onClick={() => matchPlay()}>
              {loading === TwoButtonLoader.first_loading ? (
                <SyncLoader size="10px" color={`white`} />
              ) : (
                <>{played.length >= 1 ? "Retry"   : "Play"}</>
              )}
            </div>
          ) : (
            <>
              <div
                className={`btn_ theme ${theme}`}
                onClick={() => matchPlay(PayType.cash)}
              >
                {loading === TwoButtonLoader.first_loading ? (
                  <SyncLoader size="10px" color={`white`} />
                ) : (
                  <>stake ₦ {details.price}</>
                )}
              </div>
              <div
                className={`btn_ theme ${theme}`}
                onClick={() => matchPlay(PayType.coin)}
              >
                {loading === TwoButtonLoader.second_loading ? (
                  <SyncLoader size="10px" color={`white`} />
                ) : (
                  <>
                    {" "}
                    stake <GameCoin />{" "}
                    {details.price * (defaults?.data.default.cashRating ?? 0)}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  else return <></>;
}
);
export default GuessMaster