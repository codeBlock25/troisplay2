import React, { memo, MutableRefObject, useCallback, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Fab, Switch, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowDropDown,
  DesktopMac,
  Edit,
  KeyboardBackspace,
  Lock,
  PhoneAndroid,
  Error,
} from "@material-ui/icons";
import { useState, useRef } from "react";
import { url_media } from "../../constant";
import { useQueryCache } from "react-query";
import { AxiosResponse } from "axios";
import { Games } from "../../typescript/enum";
import Header from "../../components/header";
import AppLoader from "../../components/app_loader";
import {InView} from "react-intersection-observer";
import moment from "moment"
import { BackIcon, NextIcon } from "../../icon";
import {useRouter} from "next/router"
import Lottie from "lottie-web";

export default function SettingScreen () {
  const dispatch = useDispatch();
  const [dateintime, setDateintime] = useState("");
  const swRef1: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const [runText, setRunText] = useState("loading game components...");
  const [dropdown, setdropdown] = useState(false);
  const [dropdown2, setdropdown2] = useState(false)
  const { push } = useRouter();
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
      animationData: require("../../lottie/game_play.json"),
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
  const timmer = useCallback(() => {
    let countdownEvt = setInterval(() => {
      let time = moment(
        moment(spin?.data?.spin_details.gameTime?? new Date()).diff(new Date())
      ).format("HH:MM:ss");
      setDateintime(time);
    }, 200);
    return () => {
      clearInterval(countdownEvt);
    };
  }, [spin]);
  useEffect(() => {
    timmer();
  }, [timmer]);

  return (
    <>
      {app_loading && (
        <>
          <AppLoader runText={runText} />
        </>
      )}
      <Header setApp_loading={setApp_loading} setRunText={setRunText} />
      <Head>
        <title>Troisplay :: Settings</title>
      </Head>
      <section
        className={gameViewOpen ? "Settings blur" : "Settings"}
        onClick={() => {
          setViewOpen(false);
        }}
      >
        <div className="first">
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
                  ${" "}
                  {record?.data?.cashwallet?.currentCash.toLocaleString() ?? 0}
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
                <span className="time">Next Spin {dateintime}</span>
                <h3 className="title">Earnings</h3>
                <span className="price">
                  <span ref={coinRef2} className="icon" />{" "}
                  {record?.data?.referal?.inactiveReferal ??
                    0 * defaults?.data?.default?.referRating ??
                    0}
                </span>
                <div className="action">
                  <span className="btn">refer</span>
                  <span className="btn">view referrals</span>
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
        </div>
        <div className="second_">
          <div className="setting_body">
          <div className="header theme">
            <div className="field">
              <span
                className="image"
                style={{
                  backgroundImage: `url(${url_media}${record?.data.player?.playerpic})`,
                }}
              >
                <span className="change">change</span>
                <span className="delete">delete</span>
              </span>
              <div className="d">
                <span className="name">{record?.data.player?.full_name ?? ""}</span>
                <span className="info theme">player</span>
              </div>
            </div>
          </div>

          <div className="block">
            <h3 className="subtitle" id="personal">
              Personal
            </h3>
            <h4>
              <Error className="icon_" />
              Manage Information on our account and game profile for
            </h4>
            <div className="field">
              <span className="con label">User ID:</span>
              <span className="con value theme">{record?.data.player?.userID ?? ""}</span>
            </div>
            <div className="field">
              <span className="con label">Game Name:</span>
              <span className="con value theme">
                {record?.data.player?.playername ?? ""}
              </span>
            </div>
            <div className="field">
              <span className="con label">phone number:</span>
              <span className="con value theme">
                {record?.data.player?.phone_number ?? ""}
              </span>
            </div>
            <div className="field">
              <span className="con label">email:</span>
              <span className="con value theme">{record?.data.player?.email ?? ""}</span>
            </div>
            <div className="field">
              <span className="con label">location:</span>
              <span className="con value theme">{record?.data.player?.location ?? ""}</span>
            </div>
            <h3 className="subtitle" id="security">
              privacy and security
            </h3>
            <h4>
              <Error className="icon_" />
              change your password and monitor your activity logs to ensure your
              account is secured.
            </h4>
            <div className="field">
              <span className="con label">date:</span>
              <span className="con value theme">
                {moment().format("MMMM, Do YYYY")}
              </span>
            </div>
            <div className="field">
              <span className="con label">time:</span>
              <span className="con value theme">
                {moment().format("h:mm a")}
              </span>
            </div>
            <div className={dropdown ? "drop_block open" : "drop_block"}>
              <div className="submenu_title">
                <PhoneAndroid className="icon_" /> Where you're logged in{" "}
                <Fab
                  variant="extended"
                  className="more"
                  onClick={() => {
                    setdropdown(!dropdown);
                  }}
                >
                  more
                  <ArrowDropDown />
                </Fab>
              </div>
              <div className="block_">
                <DesktopMac className="icon_img" />
                <span className="detail">Log</span>
                <span className="timestamp">
                  WebApp · {moment().format("MMMM Do, YYYY at hh:mm a")}
                </span>
              </div>
            </div>

            <div className={dropdown2 ? "drop_block open" : "drop_block"}>
              <div className="submenu_title">
                <Lock className="icon_" /> Change Password
                <Fab
                  variant="extended"
                  className="more"
                  onClick={() => {
                    setdropdown2(!dropdown2);
                  }}
                >
                  edit
                  <Edit />
                </Fab>
              </div>
              <form>
                <TextField
                  className="input_box theme"
                  variant="outlined"
                  label="Current Password"
                  type="password"
                  required
                />
                <TextField
                  className="input_box theme"
                  variant="outlined"
                  label="New Password"
                  type="password"
                  required
                />
                <TextField
                  className="input_box theme"
                  variant="outlined"
                  label="Confirm Password"
                  type="password"
                  required
                />
                <Button className="btn_" type="submit">
                  submit
                </Button>
              </form>
            </div>
            <h3 className="subtitle" id="apprearence">
              Apearence & usage
            </h3>
            <h4>
              <Error className="icon_" />
              change the look and feel of your account, e.g switching to dark
              mode
            </h4>
            <div className="field">
              <span className="con label">Remember Me</span>
              <Switch
                checked={record?.data.deviceSetup?.remember ?? true}
                className="slider_input"
                color="primary"
                name="remember"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className="field">
              <span className="con label">OnLine Status</span>
              <Switch
                checked={record?.data.deviceSetup?.online_status ?? true}
                className="slider_input"
                color="primary"
                name="remember"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className="field">
              <span className="con label">Dark Mode</span>
              <Switch
                checked={record?.data.deviceSetup?.isDarkMode}
                className="slider_input"
                color="primary"
                name="remember"
                onChange={() => {
                }}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className="field">
              <span className="con label">Email Notification</span>
              <Switch
                checked={record?.data.deviceSetup?.email_notification ?? true}
                className="slider_input"
                color="primary"
                name="remember"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className="field">
              <span className="con label">App Notification</span>
              <Switch
                checked={record?.data.deviceSetup?.app_notification ?? true}
                className="slider_input"
                color="primary"
                name="remember"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <h3 className="subtitle" id="account">
              Account set up
            </h3>
            <h4>
              <Error className="icon_" />
              the decsription will configure your game profile to help you
              interact with other games
            </h4>
            <form>
              <TextField
                variant="outlined"
                className="input_box"
                required
                type="tel"
                label="Phone Number"
                placeholder="country code include e.g +01"
              />
              <TextField
                variant="outlined"
                className="input_box"
                required
                type="email"
                label="Email"
                placeholder="abc@xyz.com"
              />
              <TextField
                variant="outlined"
                className="input_box"
                required
                label="Location"
                placeholder="state, country"
              />
              <TextField
                variant="outlined"
                className="input_box"
                required
                label="Gamer Name"
                placeholder="a unique name used to refer to you during games"
              />
              <Button type="submit" className="btn_">
                save
              </Button>
            </form>
          </div>
        </div>
        <div className="setting_panel">
          <div className="head_">
            <Fab className="btn_ theme">
              <KeyboardBackspace />
            </Fab>
            <span className="name">Settings Panel</span>
          </div>
          <div className="content">
            <Button className="btn_ theme">
              <Link href="/games/settings#personal">
                <a>Personal</a>
              </Link>
            </Button>
            <Button className="btn_ theme">
              <Link href="/games/settings#security">
                <a>General Security</a>
              </Link>
            </Button>
            <Button className="btn_ theme">
              <Link href="/games/settings#apprearance">
                <a>Appreacance</a>
              </Link>
            </Button>
            <Button className="btn_ theme">
              <Link href="/games/settings#account">
                <a>Account Setup</a>
              </Link>
            </Button>
          </div>
        </div>
      
      </div>
      </section>
    </>
  );
};
