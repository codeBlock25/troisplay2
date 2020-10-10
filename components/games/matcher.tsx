import Axios, { AxiosResponse } from "axios";
import { memo, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../constant";
import {
  exitWin,
  notify, setGameDetails, toast,
} from "../../store/action";
import Link from "next/link";
import { isEmpty } from "lodash";
import { SyncLoader } from "react-spinners";
import { Games, modalType, PlayerType } from "../../typescript/enum";
import { reducerType } from "../../typescript/interface";
import { getToken } from "../../functions";
import { CloseIcon } from "../../icon";


const GuessMaster = memo(function () {
  const dispatch = useDispatch();
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
    e: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    let token = getToken()
    if (loading || num === 0) return;
    setLoading(true);
    if (isEmpty(details.id)) {
      await Axios({
        method: "POST",
        url: `${url}/games/matcher`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          price_in_cash: details.price,
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
              gameID?: Games;
              played?: boolean;
              date?: Date;
            };
          }>) => {
// won
          })
        .catch((err) => {
          if (err.message === "Request failed with status code 401") {
          // fund  
          }
        // normal error  
        })
        .finally(() => {
          setLoading(false);
          setNum(0);
        });
    } else {
      if (played.includes(num)) {
        setLoading(false);
        return;
      }
      await Axios({
        method: "POST",
        url: `${url}/games/matcher/challange`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          id: details.id,
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
                // played
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
                // !counting
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
         // done
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
          // !played during 3
          }
        )
        .catch((err) => {
          console.log(err);
        // !normal error  
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
const theme = "dark-mode"
  if (details.game === Games.matcher)
    return (
      <div className={`gameworld ${theme}`}>
        <div className="world matcher">
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
                  setLoading(false);
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
                  open: modalType.close,
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
                        setLoading(false);
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
          <h3 className="title">Pick A number</h3>
          <p className={`txt theme ${theme}`}>
            NOTE: You Pick your moves by clicking/tapping the icons to each
            option, hit play when yo have made you choice.
          </p>
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
            <div
              className={`btn_num theme ${theme} ${view6 ? "" : "out"}`}
              onClick={() => {
                setNum(6);
              }}
            >
              6
            </div>
            <div
              className={`btn_num theme ${theme} ${view7 ? "" : "out"}`}
              onClick={() => {
                setNum(7);
              }}
            >
              7
            </div>
          </div>
          <div className={`btn_ theme ${theme}`} onClick={matchPlay}>
            {loading ? <SyncLoader size="10px" color={`white`} /> : "play"}
          </div>
        </div>
      </div>
    );
  else return <></>;
}
);
export default GuessMaster