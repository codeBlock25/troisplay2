import React from "react";
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
import moment from "moment";
import { useState } from "react";
import { url_media } from "../../constant";
import { useQueryCache } from "react-query";
import { AxiosResponse } from "axios";
import { Games } from "../../typescript/enum";


export default function () {
  const dispatch = useDispatch();
  const [dropdown, setdropdown] = useState(false);
  const [dropdown2, setdropdown2] = useState(false);
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
 
  return (
    <>
      <section
        className="dashboard Settings dark-mode"
      >
        <Head>
          <title>Troisplay :: Settings</title>
        </Head>
      <div className="headerdash theme">
        <h3> - Dashboard</h3>
      </div>
        <div className="setting_body">
          <div className="header dark-mode">
            <div className="field">
              <span
                className="image"
                style={{
                  backgroundImage: `url(${url_media}${record?.data?.player.playerpic})`,
                }}
              >
                <span className="change">change</span>
                <span className="delete">delete</span>
              </span>
              <div className="d">
                <span className="name">{record?.data.player?.full_name ?? ""}</span>
                <span className="info dark-mode">player</span>
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
              <span className="con value dark-mode">{record?.data.player?.userID ?? ""}</span>
            </div>
            <div className="field">
              <span className="con label">Game Name:</span>
              <span className="con value dark-mode">
                {record?.data.player?.playername ?? ""}
              </span>
            </div>
            <div className="field">
              <span className="con label">phone number:</span>
              <span className="con value dark-mode">
                {record?.data.player?.phone_number ?? ""}
              </span>
            </div>
            <div className="field">
              <span className="con label">email:</span>
              <span className="con value dark-mode">{record?.data.player?.email ?? ""}</span>
            </div>
            <div className="field">
              <span className="con label">location:</span>
              <span className="con value dark-mode">{record?.data.player?.location ?? ""}</span>
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
              <span className="con value dark-mode">
                {moment().format("MMMM, Do YYYY")}
              </span>
            </div>
            <div className="field">
              <span className="con label">time:</span>
              <span className="con value dark-mode">
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
                  className="input_box dark-mode"
                  variant="outlined"
                  label="Current Password"
                  type="password"
                  required
                />
                <TextField
                  className="input_box dark-mode"
                  variant="outlined"
                  label="New Password"
                  type="password"
                  required
                />
                <TextField
                  className="input_box dark-mode"
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
                checked={record?.data?.deviceSetup.remember ?? true}
                className="slider_input"
                color="primary"
                name="remember"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className="field">
              <span className="con label">OnLine Status</span>
              <Switch
                checked={record?.data?.deviceSetup?.online_status ?? true}
                className="slider_input"
                color="primary"
                name="remember"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
            <div className="field">
              <span className="con label">Dark Mode</span>
              <Switch
                checked={record?.data?.deviceSetup?.isDarkMode}
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
                checked={record?.data?.deviceSetup?.app_notification ?? true}
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
            <Fab className="btn_ dark-mode">
              <KeyboardBackspace />
            </Fab>
            <span className="name">Settings Panel</span>
          </div>
          <div className="content">
            <Button className="btn_ dark-mode">
              <Link href="/dashboard/settings#personal">
                <a>Personal</a>
              </Link>
            </Button>
            <Button className="btn_ dark-mode">
              <Link href="/dashboard/settings#security">
                <a>General Security</a>
              </Link>
            </Button>
            <Button className="btn_ dark-mode">
              <Link href="/dashboard/settings#apprearance">
                <a>Appreacance</a>
              </Link>
            </Button>
            <Button className="btn_ dark-mode">
              <Link href="/dashboard/settings#account">
                <a>Account Setup</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
