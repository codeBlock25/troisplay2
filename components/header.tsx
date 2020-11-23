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
import { useDispatch } from "react-redux";
import { initReduceGameState } from "../store/action";

const HeadFunc = memo(function ({
  setApp_loading,
  setRunText,
}: {
  setRunText: (T: string) => void;
  setApp_loading: (T: boolean) => void;
}) {
  const { push } = useRouter();
  const { data: lucky_games } = useQuery("lucky-games", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/lucky-geoge`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });
  const { data: spins } = useQuery("spins", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/spin/check-time`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });

  const { data: history } = useQuery("history", async () => {
    let token = getToken();
    return await Axios.get(`${url}/records`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });
  const { data: requests } = useQuery("requests", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/requests`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });

  const { data: rooms } = useQuery(
    "rooms",
    async () => await Axios.get(`${url}/rooms`)
  );
  const { data: my_games } = useQuery("my_games", async () => {
    let token = getToken();
    return await Axios.get(`${url}/games/mine`, {
      headers: { authorization: `Bearer ${token}` },
    });
  });
  const { data: notifications } = useQuery(
    "notifications",
    async () => await Axios.get(`${url}/notifications/all`, {headers: {authorization: `Bearer ${getToken()}`}})
  );

  const {
    data: record,
    isLoading,
    isError,
    isSuccess,
    isFetchedAfterMount,
    status,
  } = useQuery("records", async () => {
    let token = getToken();
    return await Axios({
      method: "GET",
      url: `${url}/player/record`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  });

  const { data: defaults } = useQuery("defaults", async () => {
    return await Axios({
      method: "GET",
      url: `${url}/default`,
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
    if (
      isSuccess &&
      lucky_games &&
      rooms &&
      my_games &&
      record &&
      spins &&
      defaults
    ) {
      setApp_loading(false);
    }
  }, [
    isError,
    isLoading,
    isSuccess,
    lucky_games,
    rooms,
    my_games,
    record,
    spins,
    defaults,
  ]);

  useEffect(() => {
    checker();
  }, [checker]);

const dispatch = useDispatch();
useEffect(() => {
  if (lucky_games && rooms && my_games && record && spins && defaults) {
    initReduceGameState.init({
      dispatch,
      payload: {
        luckyGames: lucky_games.data.games ?? [],
        roomGames: rooms.data.rooms ?? [],
        my_games: my_games.data.games ?? [],
        gameDefaults: defaults.data.default,
        playerRecord: record.data,
        spin_details: spins.data.spin_details,
        notifications: notifications.data.notifications,
      },
    });
  }
}, [defaults, record, spins, lucky_games, rooms, my_games]);

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
        <Link href="/games/settings">
          <a
            className="me_pic"
            title="Account"
            style={{
              backgroundImage: `url(${url_media}${record?.data?.player?.playerpic})`,
            }}
          />
        </Link>
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
