
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { Button, IconButton, Snackbar } from "@material-ui/core";
import { MutableRefObject, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { Close } from "@material-ui/icons";
import { AxiosResponse } from "axios";
import { useQueryCache } from "react-query";
import { Games } from "../../typescript/enum";
import Header from "../../components/header";
import ToastContainer from "../../components/toast";
import { useRouter } from "next/router";
import AppLoader from "../../components/app_loader";
import Lottie from "lottie-web";
import DetailScreen from "../../components/DetailScreen";
import { GameCoin } from "../../icon";
import AccountF from "../../components/account_f";

export default function () {
  const [snack_open, setSnack_open] = useState<boolean>(false);
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [runText, setRunText] = useState("loading game components...");
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const {push}= useRouter()
  const lottieLoader = useCallback(()=> {
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
    user: {
      full_name: string;
      phone_number: string;
    }
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
        .then(() => console.log("Share was successful."))
        .catch((error) => console.log("Sharing failed", error));
    } else {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `Check out the best playform to have fun and get paid at: https://troisplay.vercel.app/signup/${
            record?.data?.referal?.refer_code ?? ""
          }`
        );
      }
      setSnack_open(true);
    }
  };
  return (
    <>
      <Head>
        <title>Troisplay:: Referals</title>
      </Head>
      {app_loading && (
        <>
          <AppLoader runText={runText} />
        </>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        className="notification"
        open={snack_open}
        autoHideDuration={6000}
        onClose={(_event: SyntheticEvent | MouseEvent, reason?: string) => {
          if (reason === "clickaway") return;
          setSnack_open(false);
        }}
        message="Sharable link Copied! :)"
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={(
                _event: SyntheticEvent | MouseEvent,
                reason?: string
              ) => {
                if (reason === "clickaway") return;
                setSnack_open(false);
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </>
        }
      />
      <span
        className="new_game"
        onClick={() => {
          push("/games");
        }}
      >
        games <span className="icon" ref={game_play} />
      </span>
      <ToastContainer />
      <Header setApp_loading={setApp_loading} setRunText={setRunText} />
      <AccountF />
      <section className="games_world_ Referal">
        <div className="first">
          <DetailScreen />
        </div>
        <div className="container_first theme">
          <span className="title">Referal Earnings</span>
          <span className="title">
            Your Referal code <b>{record?.data?.referal?.refer_code}</b>
          </span>
          <div className="content">
            <span className="icon" />
            <span className="count">
              {((record?.data?.referal?.activeReferal ?? 0) +
                (record?.data?.referal?.inactiveReferal ?? 0)) *
                defaults?.data?.default?.referRating ?? 0}{" "}
              <GameCoin />
            </span>
          </div>
          <div className="content_">
            <div className="item">
              <span className="name">Total Earning</span>
              <span className="value">
                {((record?.data?.referal?.activeReferal ?? 0) +
                  (record?.data?.referal?.inactiveReferal ?? 0)) *
                  defaults?.data?.default?.referRating ?? 0}
              </span>
            </div>
            <div className="item">
              <span className="name">Current Earning</span>
              <span className="value">
                {(record?.data?.referal?.activeReferal ?? 0) *
                  defaults?.data?.default?.referRating ?? 0}
              </span>
            </div>
            <div className="item">
              <span className="name">Used Earning</span>
              <span className="value">
                {(record?.data?.referal?.inactiveReferal ?? 0) *
                  defaults?.data?.default?.referRating ?? 0}
              </span>
            </div>
            <div className="item">
              <Button className="btn_" onClick={referuser}>
                <span className="icon" /> refer
              </Button>
            </div>
          </div>
        </div>
        <div className="container_first theme">
          <span className="title">Referal Record</span>
          <span className="title">
            Your Referal code <b>{record?.data?.referal?.refer_code}</b>
          </span>
          <div className="content">
            <span className="icon" />
            <span className="count">
              {(record?.data?.referal?.activeReferal ?? 0) +
                (record?.data?.referal?.inactiveReferal ?? 0)}
            </span>
          </div>
          <div className="content_">
            <div className="item">
              <span className="name">Total refered</span>
              <span className="value">
                {(record?.data?.referal?.activeReferal ?? 0) +
                  (record?.data?.referal?.inactiveReferal ?? 0)}
              </span>
            </div>
            <div className="item">
              <span className="name">Current Refered account</span>
              <span className="value">
                {record?.data?.referal?.activeReferal ?? 0}
              </span>
            </div>
            <div className="item">
              <span className="name">inactive refered account</span>
              <span className="value">
                {record?.data?.referal?.inactiveReferal ?? 0}
              </span>
            </div>
            <div className="item">
              <Button className="btn_" onClick={referuser}>
                <span className="icon" /> refer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
