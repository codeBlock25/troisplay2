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
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";
import { isArray, find, findIndex } from "lodash";
import { Equalizer, TableChart } from "@material-ui/icons";
import {
  Box,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import DetailScreen from "../../components/DetailScreen";
import { spawn } from "child_process";

enum Active {
  table,
  graph,
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const theme = "dark-mode";
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ width: "100%", minWidth: "100%" }}
    >
      {value === index && (
        <Box className={`main theme ${theme}`} p={2}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function HistoryScreen() {
  const dispatch = useDispatch();
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const [activeTab, setActiveTap] = useState<Active>(Active.graph);
  const [runText, setRunText] = useState("loading game components...");
  const { push } = useRouter();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();

  const lottieLoader = useCallback(() => {
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
      winnings: number;
      draws: number;
      losses: number;
      earnings: number;
    }[];
    cashwallet: {
      userID: string;
      currentCash: number;
      pendingCash: number;
    };
  }> = useQueryCache().getQueryData("records");

  const columns: ColDef[] = [
    { field: "sn", headerName: "S/N", width: 70, sortable: true },
    {
      field: "date_mark",
      headerName: "Date",
      width: 220,
      type: "date",
      description: "The date the game was concluded",
      sortable: true,
      valueFormatter: ({ value }) => {
        return moment((value as unknown) as string).format(
          "Do MM, YYYY - hh:mm a"
        );
      },
    },
    {
      field: "game",
      headerName: "Game",
      width: 130,
      description: "The game you played",
      sortable: false,
      type: "number",
      valueFormatter: ({ value }) => {
        return ((value as unknown) as Games) === Games.roshambo
          ? "Roshambo"
          : ((value as unknown) as Games) === Games.penalth_card
          ? "Penalty Card"
          : ((value as unknown) as Games) === Games.matcher
          ? "Guess Master"
          : ((value as unknown) as Games) === Games.lucky_geoge
          ? "Lucky Judge"
          : ((value as unknown) as Games) === Games.custom_game
          ? "Custom"
          : "";
      },
    },
    {
      field: "won",
      headerName: "Game Result",
      width: 130,
      description: "The result of the game",
      sortable: false,
      valueFormatter: ({ value }) => {
        return value === "no" ? "Lost" : value === "yes" ? "Won" : value;
      },
    },
    {
      field: "earnings",
      headerName: "Stake",
      width: 130,
      description: "The amount that was gained or lost",
      sortable: true,
      valueFormatter: ({ value }) => {
        return `$ ${value}`;
      },
    },
  ];

  const history: AxiosResponse<{
    records: {
      _id: string;
      userID: string;
      date_mark: Date;
      winnings: number;
      draws: number;
      losses: number;
      earnings: number;
    }[];
  }> = useQueryCache().getQueryData("history");
  const [row, setRow] = useState<
    {
      sn: number;
      id: string;
      _id: string;
      userID: string;
      date_mark: Date;
      game: Games;
      won: string;
      earnings: number;
    }[]
  >([]);
  const [winnings, setWinnings] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [draws, setDraws] = useState<number>(0);
  const [playedGame, setPlayedGames] = useState<number>(0);
  const [row_, setRow_] = useState<
    {
      name: string;
      winnings: number;
      draws: number;
      losses: number;
      earnings: number;
    }[]
  >([]);
  useEffect(() => {
    let winnings = 0,
      losses = 0,
      playedGame = 0,
      draws = 0;
    if (isArray(history?.data?.records)) {
      history.data.records.map((record, index) => {
        winnings += record.winnings;
        playedGame += record.winnings;
        playedGame += record.losses;
        losses += record.losses;
        draws += record.draws;
      });
      setWinnings(winnings);
      setLosses(losses);
      setDraws(draws);
      setPlayedGames(playedGame);
      winnings = 0;
      losses = 0;
      draws = 0;
    }
  }, [history]);

  const theme = "dark-mode";
  return (
    <>
      <Head>
        <title>Games History - Troisplay</title>
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
        className={gameViewOpen ? "history blur" : "history"}
        onClick={() => {
          setViewOpen(false);
        }}
      >
        <div className="second">
          <div className="container">
            <TabPanel value={activeTab} index={1}>
              <div
                className={`container_map theme ${theme}`}
                style={{ width: "100%", minWidth: "100%" }}
              >
                <div className="main_head">
                  <h3 className="title_">
                    <strong>Your</strong>Game History
                  </h3>
                  <div className="selector">
                    <Button className="oo active">last 30 day</Button>
                  </div>
                  <span className="query">today</span>
                </div>
                <div className="container_history win">
                  <div className="content">
                    <h3 className="title winnings">Played games</h3>
                    <h3 className="count">{playedGame ?? 0}</h3>
                  </div>
                </div>
                <div className="container_history win">
                  <div className="content">
                    <h3 className="title winnings">Won</h3>
                    <h3 className="count">{winnings ?? 0}</h3>
                  </div>
                </div>
                <div className="container_history loss">
                  <div className="content">
                    <h3 className="title loss">Loss</h3>
                    <h3 className="count">{losses ?? 0}</h3>
                  </div>
                </div>
                <div className="container_history draw">
                  <div className="content">
                    <h3 className="title draw">Draw</h3>
                    <h3 className="count">{draws ?? 0}</h3>
                  </div>
                </div>
              </div>
            </TabPanel>
          </div>
        </div>
      </section>
    </>
  );
}
