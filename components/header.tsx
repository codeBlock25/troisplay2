import Axios, { AxiosResponse } from "axios";
import { memo, useCallback, useEffect } from "react";
import { QueryResult, useQuery } from "react-query";
import { url, url_media } from "../constant";
import {
  DarkIcon,
  FacebookIcon,
  InstagramIcon,
  InternetIcon,
  LightIcon,
  TwitterIcon,
} from "../icon";
import { Games } from "../typescript/enum";
import { getToken } from "../functions";
import { useRouter } from "next/router";
import Link from "next/link";

const HeadFunc = memo(function ({
  setApp_loading,
  setRunText,
}: {
  setRunText: (T: string) => void;
  setApp_loading: (T: boolean) => void;
}) {
  const { push } = useRouter();
  const {
    data: lucky_games,
  }: QueryResult<AxiosResponse<{
    games: {
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: Games;
      members: string[];
      playCount: number;
      price_in_coin: number;
      price_in_value: number;
      _id: string;
    }[];
  }>> = useQuery("lucky-games", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/lucky-geoge`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });
  const {
    data: spins,
  }: QueryResult<AxiosResponse<{
    games: {
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: Games;
      members: string[];
      playCount: number;
      price_in_coin: number;
      price_in_value: number;
      _id: string;
    }[];
  }>> = useQuery("spins", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/spin/check-time`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });
  
  const {
    data: my_games,
  }: QueryResult<AxiosResponse<{
    games: {
      date: Date;
      gameDetail: string;
      gameID: Games;
      gameMemberCount: number;
      gameType: Games;
      members: string[];
      playCount: number;
      price_in_coin: number;
      price_in_value: number;
      _id: string;
    }[];
  }>> = useQuery("my_games", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/mine`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });
  
  const {
    data: record,
    isLoading,
    isError,
    isSuccess,
    isFetchedAfterMount,
    status,
  }: QueryResult<AxiosResponse<{
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
  }>> = useQuery("records", async () => {
    let token = getToken();
    return await Axios({
      method: "GET",
      url: `${url}/player/record`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  });
  const checker = useCallback(() => {
    if (isError) {
      setRunText(
        "Couldn't connect to troisplay game server... Try login again."
      );
      setTimeout(() => {
        push("/login");
      }, 4000);
      return;
    }
    if (isLoading && !isFetchedAfterMount) {
      setRunText("loading game components...");
      setApp_loading(true);
      return;
    }
    if (isSuccess) {
      setApp_loading(false);
    }
  }, [isError, isLoading, isSuccess]);

  useEffect(() => {
    checker();
  }, [checker]);

  const {
    data: defaults,
  }: QueryResult<AxiosResponse<{
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
  }>> = useQuery("defaults", async () => {
    return await Axios({
      method: "GET",
      url: `${url}/default`,
    });
  });

  const { data: history } = useQuery("history", async () => {
    let token = getToken();
    return await Axios.get(`${url}/records`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });

  return (
    <header className="game_header">
      <section className="top">
        <div className="theme_action">
          <span className="dark" title="Dark Theme">
            <DarkIcon />
          </span>
          <span className="light" title="Light Theme">
            <LightIcon />
          </span>
        </div>
        <div className="links">
          <span className="link">Games</span>
          <span className="link">Get Coin</span>
          <span className="link">Game Tutorials</span>
        </div>
        <div className="social">
          <a
            href="https://troisplay2.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="sc"
          >
            <InternetIcon />
          </a>
          <a
            href="https://fb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sc"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sc"
          >
            <InstagramIcon />
          </a>
          <a
            href="http://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sc"
          >
            <TwitterIcon />
          </a>
        </div>
      </section>
      <section className="bottom">
        <span
          className="me_pic"
          title="Account"
          style={{
            backgroundImage: `url(${url_media}${record?.data?.player?.playerpic})`,
          }}
        />
        <Link href="/games">
          <a className="logo" />
        </Link>
        <div className="macTxt">
          <h3>Play - Win - Share.</h3>
        </div>
        <div className="action">
          <Link href="/games/history">
            <a className="btn">history</a>
          </Link>
          <span
            className="btn"
            onClick={async () => {
              await localStorage.removeItem("game_token");
              push("/");
            }}
          >
            log out
          </span>
        </div>
      </section>
    </header>
  );
});

export default HeadFunc;
