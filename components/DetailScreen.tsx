import { AxiosResponse } from 'axios';
import Lottie from 'lottie-web';
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useQueryCache } from 'react-query';
import { BackIcon, NextIcon } from '../icon';
import { InView } from "react-intersection-observer"
import moment from "moment"
import { Games, PlayerType } from "../typescript/enum";
import { useRouter } from 'next/router';
import { setGameDetails, toast } from "../store/action";
import { useDispatch } from 'react-redux';

export default function DetailScreen() {
    const dispatch = useDispatch()
    const swRef1: MutableRefObject<HTMLDivElement | null> = useRef();
    const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
    const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
    const [dateintime, setDateintime] = useState("");
    const {push} = useRouter()
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
    
      const Share = async () => {
        if (navigator.share) {
          await navigator
            .share({
              title: "Troisplay",
              text:
                "Check out the best playform to have fun and get paid",
              url: `https://troisplay2.vercel.app/signup/${record?.data.referal?.refer_code}`,
            })
            .then(() => console.log("Share was successful."))
            .catch((error) => console.log("Sharing failed", error));
        } else {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(
              `Check out the best playform to have fun and get paid at: https://troisplay.vercel.app/signup/${record?.data.referal?.refer_code}`
              );
              toast(dispatch, {msg: "Your Link has been copied, paste anywhere and share to gain more coins."}).success()
          }
        }
    }
      const lottieLoader = useCallback(() => {
        Lottie.loadAnimation({
        container: coinRef.current,
        autoplay: true,
        loop: true,
        renderer: "canvas",
        animationData: require("../lottie/coin.json"),
        });
        Lottie.loadAnimation({
        container: coinRef2.current,
        autoplay: true,
        loop: true,
        renderer: "canvas",
        animationData: require("../lottie/coin.json"),
        });
    }, []);
  useEffect(() => {
    lottieLoader();
  }, [lottieLoader]);
  const spin: AxiosResponse<{
    spin_details: {
      currentTime: Date,
      gameTime: Date,
      isPlayable: boolean,
    },}> = useQueryCache().getQueryData("spins")
  useEffect(() => {
    let countdownEvt = setInterval(() => {
    if (spin) {
        let time = moment(
          moment(spin?.data?.spin_details.gameTime?? new Date()).diff(new Date())
          ).format("HH:MM:ss");
          setDateintime(spin.data.spin_details.isPlayable ? "00:00:00":time);
        }
        }, 200);
        return () => {
          clearInterval(countdownEvt);
    };
  }, [spin]);
    return (
      <div className="cover">
        <span
          className="sw_btn"
          onClick={() => {
            swRef1.current.scrollTo(swRef1.current.scrollLeft - 270, 0);
          }}
        >
          <BackIcon />
        </span>
        <div className="container" ref={swRef1}>
          <InView
            as="div"
            onChange={(inview, evt) => {
              if (inview) {
                evt.target.classList.add("inview");
              } else {
                evt.target.classList.remove("inview");
              }
            }}
            className="sw"
          >
            <span className="time">Next Spin {dateintime}</span>
            <h3 className="title">Cash</h3>
            <span className="price">
              $ {record?.data?.cashwallet?.currentCash.toLocaleString() ?? 0}
            </span>
            <div className="action">
              <span className="btn">fund</span>
              <span className="btn">withdraw</span>
            </div>
          </InView>
          <InView
            as="div"
            onChange={(inview, evt) => {
              if (inview) {
                evt.target.classList.add("inview");
              } else {
                evt.target.classList.remove("inview");
              }
            }}
            className="sw"
          >
            <span className="time">Next Spin {dateintime}</span>
            <h3 className="title">Coin</h3>
            <span className="price">
              <span ref={coinRef} className="icon" />
              {record?.data?.wallet?.currentCoin.toLocaleString() ?? 0}
            </span>
            <div className="action">
              <span
                className="btn"
                onClick={() => {
                  push("/games/get-coin");
                }}
              >
                get more
              </span>
              <span
                className="btn"
                onClick={() => {
                  if (!spin.data.spin_details.isPlayable) {
                    toast(dispatch, {
                      msg:
                        "Sorry you can't spin right now, glory spin can only be used once a day.",
                    }).fail();
                    return;
                  }
                  setGameDetails(dispatch, {
                    player: PlayerType.first,
                    game: Games.glory_spin,
                    id: "",
                    price: 0,
                  });
                }}
              >
                glory spin
              </span>
            </div>
          </InView>
          <InView
            as="div"
            onChange={(inview, evt) => {
              if (inview) {
                evt.target.classList.add("inview");
              } else {
                evt.target.classList.remove("inview");
              }
            }}
            className="sw"
          >
            <span className="time">Next Spin {dateintime}</span>
            <h3 className="title">Earnings</h3>
            <span className="price">
              <span ref={coinRef2} className="icon" />{" "}
              {record?.data?.referal?.inactiveReferal ??
                0 * defaults?.data?.default?.referRating ??
                0}
            </span>
            <div className="action">
              <span className="btn" onClick={Share}>
                refer
              </span>
              <span
                className="btn"
                onClick={() => {
                  push("/games/referal");
                }}
              >
                view referrals
              </span>
            </div>
          </InView>
        </div>
        <span
          className="sw_btn"
          onClick={() => {
            swRef1.current.scrollTo(swRef1.current.scrollLeft + 270, 0);
          }}
        >
          <NextIcon />
        </span>
      </div>
    );
}
