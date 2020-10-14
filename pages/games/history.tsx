import Head from "next/head";
import { InView } from "react-intersection-observer";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BackIcon,
  NextIcon,
} from "../../icon";
import Lottie from "lottie-web";
import moment from "moment";
import {  useQueryCache } from "react-query";
import  { AxiosResponse } from "axios";
import { Games, Viewing, nextType } from "../../typescript/enum";
import { getPrice, getToken, isPlayable } from "../../functions";
import Notification from "../../components/notification";
import { useDispatch } from "react-redux";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import Header from "../../components/header";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";
import {isArray, find, findIndex} from "lodash"
import { Equalizer, TableChart } from "@material-ui/icons";
import { Box, Button, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@material-ui/core";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts";



enum Active {
  table,
  graph,
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}


const data: {
  name: string;
  wins: number;
  losses: number;
  earnings: number;
}[] = [
  {
    name: moment().subtract(30, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(29, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(28, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(27, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(26, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(25, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(24, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(23, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(22, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(21, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(20, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(19, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(18, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(17, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(16, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(15, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(14, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(13, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(12, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(11, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(10, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(9, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(8, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(7, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(6, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(5, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(4, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(3, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(2, "days").format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(1, "days").format("Do"),
    wins: 15,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().subtract(1, "days").format("Do"),
    wins: 10,
    losses: 0,
    earnings: 0,
  },
  {
    name: moment().format("Do"),
    wins: 0,
    losses: 0,
    earnings: 0,
  },
];

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
  const [dateintime, setDateintime] = useState("");
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const swRef1: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [activeTab, setActiveTap] = useState<Active>(Active.table);
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
      game: Games;
      won: string;
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
  const [row_, setRow_] = useState<
    {
      _id: string;
      mark: string;
      game: string;
      earnings: number;
    }[]
    >([]);
  useEffect(() => {
    let r : {
      sn: number;
      id: string;
      _id: string;
      userID: string;
      date_mark: Date;
      game: Games;
      won: string;
      earnings: number;
    }[] = [];
    let r_: {
      _id: string;
      mark: string;
      game: string;
      earnings: number;
    }[] = [];
    let r_f = [];
    if (isArray(history?.data?.records)) {
      history.data.records.map((record, index) => {
        r.push({ ...record, id: record._id, sn: index });
        let ind = findIndex(r_, { mark: moment(record.date_mark).format("Do")})
        r_.push( ind !== -1 ? {
        ...r_[ind],earnings: r_[ind].earnings + record.earnings
        }:{
          _id: record._id,
          mark: moment(record.date_mark).format("Do"),
          game:
            record.game === Games.roshambo ? "Roshambo"
            : record.game === Games.penalth_card ? "Penalty Card"
            : record.game === Games.lucky_geoge ? "Lucky Geoge"
            : record.game === Games.matcher ? "Guess master"
            : record.game === Games.glory_spin ? "Glory spin":"",
          earnings: record.earnings
        });
      });
      setRow(r);
      setRow_(r_);
      r = [];
      r_ = [];
    }
  }, [history]);
  const theme = "dark-mode"
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
        <div className="second">
          <div className="container">
            <div className="title">
              <h3>Games History</h3>
            </div>
            <div className="action">
              <Button
                className={
                  activeTab === Active.table
                    ? `btn_ active theme ${theme}`
                    : `btn_ theme ${theme}`
                }
                onClick={() => {
                  setActiveTap(Active.table);
                }}
              >
                <TableChart />
                table
              </Button>
              <Button
                className={
                  activeTab === Active.graph
                    ? `btn_ active active theme ${theme}`
                    : `btn_ theme ${theme}`
                }
                onClick={() => {
                  setActiveTap(Active.graph);
                }}
              >
                <Equalizer />
                graph
              </Button>
            </div>
            <TabPanel value={activeTab} index={0}>
              {row.length >= 1 ? (
                <div className="history_content">
                  <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={8}
                    disableMultipleSelection
                    checkboxSelection={false}
                  />
                </div>
              ) : (
              <Typography variant="body2" style={{color: "whitesmoke"}}>No Data too display.</Typography>
                )}
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <div className={`container_map theme ${theme}`}>
              <div className="main_head">
                <h3 className="title_">
                  <strong>Your</strong>Game analysis
                </h3>
                <div className="selector">
                  <Button className="oo active">last 30 day</Button>
                </div>
                <span className="query">today</span>
              </div>
              <ResponsiveContainer
                width="100%"
                height={350}
                minWidth={500}
                minHeight={300}
                maxHeight={450}
              >
                <AreaChart
                  data={row_}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="65%"
                        stopColor="#f9f9f9"
                        stopOpacity={0.8}
                      />
                      <stop offset="95%" stopColor="#f9f9f9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="65%"
                        stopColor="#2196F3"
                        stopOpacity={0.8}
                      />
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mark" />
                  <YAxis dataKey="earnings" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip label="Details" />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="losses"
                    stroke="#2196F3"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#111"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabPanel>
          </div>
        </div>
      </section>
    </>
  );
}
