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
import { Games, Viewing, nextType } from "../../typescript/enum";
import { getPrice, getToken, isPlayable } from "../../functions";
import Notification from "../../components/notification";
import { useDispatch } from "react-redux";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import Header from "../../components/header";
import { DataGrid, ColDef, RowProps } from "@material-ui/data-grid";
import { isArray } from "lodash";
import {CloseViewIcon,OpenViewIcon} from "../../icon"


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

  const data: { rows: any[]; column: ColDef[] } = {
    rows: [
      {
        id: 0,
        sn: 1,
        name: "Referal",
        canGet: false,
        progress: 40,
        action: true,
      },
      {
        id: 1,
        sn: 2,
        name: "Glory Spin",
        canGet: true,
        progress: 40,
        action: true,
      },
      {
        id: 2,
        sn: 3,
        name: "Give Away",
        canGet: false,
        progress: 0,
        action: true,
      },
      {
        id: 3,
        sn: 4,
        name: "Daily Gain",
        canGet: false,
        progress: 40,
        action: true,
      },
      {
        id: 4,
        sn: 5,
        name: "Play Video",
        canGet: false,
        progress: 0,
        action: true,
      },
    ],
    column: [
      { field: "sn", headerName: "S/N", width: 70, sortable: true },
      {
        field: "name",
        headerName: "Method",
        width: 140,
        description: "The method to get coin",
        sortable: true,
      },
      {
        field: "canGet",
        headerName: "Claimable",
        width: 130,
        description: "status check if the offered price can be collected now.",
        sortable: false,
        renderCell: ({ value }) => {
          let val = (value as unknown) as boolean;
          return (
            <span className={`viewer_status ${val ? "yes" : "no"} `}>
              {!val ? <CloseViewIcon /> : <OpenViewIcon />}{" "}
              {val ? "can" : "can't"}
            </span>
          );
        },
      },
      {
        field: "progress",
        headerName: "Progress",
        width: 130,
        description: "Progress bar to your next coin collection.",
        sortable: false,
      },
      {
        field: "action",
        headerName: "collect",
        width: 130,
      },
    ],
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
        <div className="first">
          <div className="cover">
            <span
              className="sw_btn"
              onClick={() => {
                swRef2.current.scrollTo(swRef2.current.scrollLeft - 270, 0);
              }}
            >
              <BackIcon />
            </span>
            <div className="container" ref={swRef2}>
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
                <span className="time">{dateintime}</span>
                <h3 className="title">Coin</h3>
                <span className="price">
                  <span ref={coinRef} className="icon" />
                  {record?.data?.wallet?.currentCoin.toLocaleString() ?? 0}
                </span>
                <div className="action">
                  <span className="btn">glory spin</span>
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
                <span className="time">{dateintime}</span>
                <h3 className="title">Earnings</h3>
                <span className="price">
                  <span ref={coinRef2} className="icon" />{" "}
                  {record?.data?.referal?.inactiveReferal ??
                    0 * defaults?.data?.default?.referRating ??
                    0}
                </span>
                <div className="action">
                  <span className="btn">view referrals</span>
                </div>
              </InView>
            </div>

            <span
              className="sw_btn"
              onClick={() => {
                swRef2.current.scrollTo(swRef2.current.scrollLeft + 270, 0);
              }}
            >
              <NextIcon />
            </span>
          </div>
        </div>
        <div className="second">
          <div className="container">
            <div className="title">
              <h3>Get Games</h3>
            </div>
            <div className="history_content">
              <DataGrid
                rows={data.rows}
                columns={data.column}
                pageSize={5}
                disableMultipleSelection
                checkboxSelection={false}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

