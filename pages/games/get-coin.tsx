import Head from "next/head";
import { InView } from "react-intersection-observer";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BackIcon, NextIcon } from "../../icon";
import Lottie from "lottie-web";
import moment from "moment";
import { useQueryCache } from "react-query";
import { AxiosResponse } from "axios";
import { Games, Viewing, nextType, PlayerType } from "../../typescript/enum";
import { getPrice, getToken, isPlayable } from "../../functions";
import Notification from "../../components/notification";
import { useDispatch } from "react-redux";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import Header from "../../components/header";
import { DataGrid, ColDef, RowProps } from "@material-ui/data-grid";
import { isArray } from "lodash";
import { CloseViewIcon, OpenViewIcon } from "../../icon";
import { Button } from "@material-ui/core";
import Picker from "../../components/picker";
import { setGameDetails, toast } from "../../store/action";

export default function GetterScreen() {
  const dispatch = useDispatch();
  const [dateintime, setDateintime] = useState("");
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const swRef2: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [runText, setRunText] = useState("loading game components...");
  const { push } = useRouter();

  const lottieLoader = useCallback(() => {
    Lottie.loadAnimation({
      container: coinRef.current,
      autoplay: true,
      loop: true,
      renderer: "canvas",
      animationData: require("../../lottie/coin.json"),
    });
    Lottie.loadAnimation({
      container: coinRef2.current,
      autoplay: true,
      loop: true,
      renderer: "canvas",
      animationData: require("../../lottie/coin.json"),
    });
    Lottie.loadAnimation({
      container: game_play.current,
      autoplay: true,
      loop: true,
      renderer: "canvas",
      animationData: require("../../lottie/game.json"),
    });
  }, []);
  useEffect(() => {
    lottieLoader();
  }, [lottieLoader]);

  useEffect(() => {
    let timecount = setInterval(() => {
      setDateintime(moment(new Date()).format("hh:mm:ss a"));
    }, 300);
    return () => {
      clearInterval(timecount);
    };
  }, []);
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

  const spin: AxiosResponse<{
    spin_details: {
      currentTime: Date;
      gameTime: Date;
      isPlayable: boolean;
    };
  }> = useQueryCache().getQueryData("spins");
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
  const referuser = async () => {
    if (navigator.share) {
      await navigator
        .share({
          title: "Troisplay",
          text: "Check out the best playform to have fun and get paid.",
          url: `https://troisplay.vercel.app/signup/${
            record?.data?.referal?.refer_code ?? ""
          }`,
        })
        .then(() => console.log("share succesful"))
        .catch((error) => console.log("Sharing failed", error));
    } else {
      if (navigator.clipboard) {
        await navigator.clipboard
          .writeText(
            `Check out the best playform to have fun and get paid at: https://troisplay.vercel.app/signup/${
              record?.data?.referal?.refer_code ?? ""
            }`
          )
          .finally(() => {
            toast(dispatch, {
              msg: "Link Copied, share your link to gain referals.",
            }).success();
          });
      }
    }
  };
  return (
    <>
      <Head>
        <title>Get Coins - Troisplay</title>
      </Head>
      {app_loading && (
        <>
          <AppLoader runText={runText} />
        </>
      )}
      <Notification />
      <ToastContainer />
      <Header setApp_loading={setApp_loading} setRunText={setRunText} />
      <span
        className="new_game"
        onClick={() => {
          push("/games");
        }}
      >
        games <span className="icon" ref={game_play} />
      </span>
      <section
        className={gameViewOpen ? "Get_coin blur" : "Get_coin"}
        onClick={() => {
          setViewOpen(false);
        }}
      >
        <div className="second">
          <div className="container">
            <div className="title">
              <h3>Get Games</h3>
            </div>
            <div className="history_content">
              <Picker
                title="Refer"
                subText="Share to friends and get you commission after their first game."
                earn={defaults?.data?.default.referRating}
                btnText="Refer"
                btnFunc={referuser}
                image="/images/pic5.jpg"
              />
              <Picker
                title="Glory Spin"
                subText="Claim daily coins with glory spin of up to 100 coins per day."
                earn={"0 - 100"}
                btnText="Spin"
                btnFunc={() => {
                  if (!spin.data.spin_details.isPlayable) {
                    toast(dispatch, {
                      msg:
                        "Sorry you can't spin right now, glory spin can only be used once a day.",
                    }).fail();
                    return;
                  }
                  setGameDetails(dispatch, {
                    player: PlayerType.first,
                    id: "",
                    price: 0,
                  });
                }}
                image="/images/pic6.jpg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
