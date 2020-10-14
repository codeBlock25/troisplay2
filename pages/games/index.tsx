import Head from "next/head";
import Link from "next/link";
import { InView } from "react-intersection-observer";
import {useFlutterwave} from "flutterwave-react-v3"
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BackIcon,
  DarkIcon,
  FacebookIcon,
  GameCoin,
  InstagramIcon,
  InternetIcon,
  LightIcon,
  NextIcon,
  TwitterIcon,
} from "../../icon";
import Lottie from "lottie-web";
import moment from "moment";
import { useQuery, useQueryCache } from "react-query";
import Axios, { AxiosResponse } from "axios";
import { config, url, url_media } from "../../constant";
import { QueryResult } from "react-query";
import { Games, PayType, PlayerType, Viewing, ReasonType } from "../../typescript/enum";
import next, { GetStaticProps, GetStaticPropsContext } from "next";
import { getPrice, isPlayable, getToken, PlayLuckyGeogeGame } from "../../functions";
import { SyncLoader } from "react-spinners";
import Notification from "../../components/notification";
import Roshambo from "../../components/games/roshambo";
import { setGameDetails, toast } from "../../store/action";
import { useDispatch } from "react-redux";
import Penalty_card from "../../components/games/penelty_card";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import GameView from "../../components/game_view";
import Exitwindow from "../../components/exitwindow";
import Header from "../../components/header";
import {nextType} from "../../typescript/enum"
import PickerPlayer2 from "../../components/gamepicker_player2";
import GuessMaster from "../../components/games/matcher";
import Gloryspin from "../../components/games/gloryspin";
import Bottompanel from "../../components/bottompanel";
import BackWindow from "../../components/backwindow";
import { Fab } from "@material-ui/core";
import { Close } from "@material-ui/icons";

export default function GamesScreen() {
  const dispatch = useDispatch();
  const [viewing, setViewing] = useState<Viewing>(Viewing.current);
  const [dateintime, setDateintime] = useState("");
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [runText, setRunText] = useState("loading game components...");
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const swRef: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [playLoader, setPlayerLoader] = useState<boolean>(false);
  const [game_loading, setgameLoading] = useState<boolean>(false);
  const [p2, setP2] = useState<boolean>(false);
  const [fundTp, setFund] = useState<number>(0)
  const [action, setAction]  = useState<ReasonType>(ReasonType.non)
  const { push, beforePopState } = useRouter();
  const [time, setTime] = useState<string>("00:00");
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

  const [spec, setSpec] = useState<{
    isOpen: boolean;
    manual: string;
    price: number;
    game: Games;
    next?: nextType;
  }>({
    isOpen: false,
    manual: "",
    price: 10,
    game: Games.non,
    next: nextType.player,
  });

  const lucky_games: AxiosResponse<{
    games: {
      battleScore: {
        player1: {
          description: string
          title: string
          winnerCount: number
      }}
      date: Date
      gameDetail: string
      gameID: Games
      gameMemberCount: number
      gameType: string
      isComplete: boolean
      members: string[]
      playCount: number
      played: boolean
      price_in_coin: number
      price_in_value: number
      _id: string;
    }[]
  }> = useQueryCache().getQueryData("lucky-games")
  const rooms: AxiosResponse<{
    rooms: {
      _id: string;
      room_name: string;
      date: Date;
      last_changed: Date;
      entry_price: number;
      key_time: number;
      player_limit: number;
      addedBy: string;
      activeMember: number;
      players: [string];
    }[];
  }> = useQueryCache().getQueryData("rooms")
  const spins: AxiosResponse<{
    spin_details: {
    currentTime: Date,
    gameTime:Date,
    isPlayable: boolean,
    },
  }> = useQueryCache().getQueryData("spins")
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

  const my_games: AxiosResponse<{
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
  }> = useQueryCache().getQueryData("my_games");
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

  
  useEffect(() => {
    beforePopState(({ url, as, options }) => {
      alert("Are you sure you want to leave this page?.")
      return true
    })
  }, [])

  const callFlutter = useFlutterwave({
    ...config,
    amount: fundTp,
    customer: {
      email: record?.data.player.email,
      phonenumber: record?.data.player.phone_number,
      name: record?.data.player.full_name,
    }
  })

  return (
    <>
      <Head>
        <title>Games - Troisplay</title>
      </Head>
      {app_loading && (
        <>
          <AppLoader runText={runText} />
        </>
      )}
      <Penalty_card />
      <Roshambo />
      <Exitwindow />
      <Gloryspin />
      <Notification />
      <GuessMaster />
      <Bottompanel />
      <BackWindow/>
      <PickerPlayer2 
      game={spec.game} 
      isOpen={p2} 
      my={record?.data.player} 
      close={()=>setP2(false)} 
      spec={spec}
      specfunc={setSpec} />
      <ToastContainer />
      <Header setApp_loading={setApp_loading} setRunText={setRunText} />
      <div
        className={`game_picker_view ${action !== ReasonType.non ? "open" : ""}`}
        onClick={(e: any) => {
          if (!e.target?.classList?.contains("game_picker_view")) {
            return;
          }
          setAction(ReasonType.non)
        }}
      >
        {action !== ReasonType.non && (
          <div className="container_price">
            <h3 className="title">Troisplay E wallet form.</h3>
            <p className="txt">
              {
                ((fundTp> (record?.data?.cashwallet.currentCash??0)) && action === ReasonType.withdraw) && `Can't withdraw more than your avalible balance`
              }
            </p>
            <div className="inputBox">
              <label htmlFor="number">Account</label>
              <input
                type="number"
                value={fundTp}
                onChange={(e) => {
                  e.persist();
                  setFund(parseInt(e.target.value, 10));
                }}
                id="funds"
                placeholder="in ($)"
              />
            </div>
            <span
              className="btn"
              onClick={async () => {
                if (action === ReasonType.fund) {
                  callFlutter({
                    callback: (response) => {
                    console.log(response);
                  },
                  onClose: () => {
                    setFund(0);
                    setAction(ReasonType.non);
                  },
                });
                } else {
                  return;
              }
              }}
              >
              {playLoader ? (
                <SyncLoader size="10px" color="white" />
              ) : action === ReasonType.withdraw ?
                  "Withdraw" :
                  action === ReasonType.fund ? "Fund":""
              }
            </span>
          </div>
        )}
      </div>
      <div
        className={`game_picker_view ${spec.isOpen ? "open" : ""}`}
        onClick={(e: any) => {
          if (!e.target?.classList?.contains("game_picker_view")) {
            return;
          }
          setSpec((prev) => {
            return {
              ...prev,
              isOpen: false,
              game: Games.non,
              next: nextType.player,
            };
          });
        }}
      >
        {spec.next === nextType.price ? (
          <div className="container_price">
            <h3 className="title">Game Setup.</h3>
            <p className="txt">
              To stand a chances to earn{" "}
              {getPrice(spec.game, spec.price, defaults?.data?.default) <= 0
                ? "Nothing"
                : `$ ${getPrice(
                    spec.game,
                    spec.price,
                    defaults?.data?.default
                  )}`}{" "}
            </p>
            <div className="inputBox">
              <label htmlFor="number">Price</label>
              <input
                type="number"
                value={spec.price}
                onChange={(e) => {
                  e.persist();
                  setSpec((prev) => {
                    return {
                      ...prev,
                      price: parseInt(e.target.value, 10),
                    };
                  });
                }}
                id="price"
                placeholder="in ($)"
              />
            </div>
            <span
              className="btn"
              onClick={async () => {
                await isPlayable(
                  playLoader,
                  setPlayerLoader,
                  spec.price,
                  spec.game,
                  dispatch,
                  spec
                ).finally(() => {
                  setSpec((prev) => {
                    return {
                      ...prev,
                      isOpen: false,
                      game: Games.non,
                      next: nextType.player,
                    };
                  });
                });
              }}
            >
              {playLoader ? (
                <SyncLoader size="10px" color="white" />
              ) : (
                `stake $${spec.price}`
              )}
            </span>
            <span
              className="btn"
              onClick={async () => {
                await isPlayable(
                  playLoader,
                  setPlayerLoader,
                  spec.price,
                  spec.game,
                  dispatch,
                  spec
                ).finally(() => {
                  setSpec((prev) => {
                    return {
                      ...prev,
                      isOpen: false,
                      game: Games.non,
                      next: nextType.player,
                    };
                  });
                });
              }}
            >
              {playLoader ? (
                <SyncLoader size="10px" color="white" />
              ) : (
                <>
                  stake <GameCoin /> {spec.price * (defaults?.data?.default?.cashRating ?? 1)}
                </>
              )}
            </span>
          </div>
        ) : spec.next === nextType.player ? (
          <div className="container_join">
            <h3 className="title">Join as.</h3>
            <div className="action">
              <div
                className="btn"
                onClick={() => {
                  setSpec((prev) => {
                    return {
                      ...prev,
                      next: nextType.price,
                    };
                  });
                }}
              >
                {spec.game === Games.penalth_card ? "Taker" : "Player 1"}
              </div>
              <div className="btn" onClick={()=>{
                setSpec(prev =>{
                  return {...prev, isOpen: false}})
                setP2(true)}}>
                {spec.game === Games.penalth_card ? "Keeper" : "Player 2"}
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <h3 className="title">Game Manual</h3>
            <p className="txt">{spec.manual}</p>
            <span
              className="btn"
              onClick={() => {
                setSpec((prev) => {
                  return {
                    ...prev,
                    next: nextType.player,
                  };
                });
              }}
            >
              confirm
            </span>
          </div>
        )}
      </div>
      <span
        className="new_game"
        onClick={() => {
          setViewOpen(true);
        }}
      >
        play game <span className="icon" ref={game_play} />
      </span>
      <div className={`games_view ${gameViewOpen && "open"}`}>
        <Fab className="btn_close" onClick={() => {
          setViewOpen(false);
        }}>
          <Close />
        </Fab>
        <div className="container">
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "A player who decides to play rock will beat another player who has chosen scissors (rock crushes scissors), but will lose to one who has played paper (paper covers rock); a play of paper will lose to a play of scissors (scissors cuts paper). If both players choose the same shape, the game is tied and is usually immediately replayed to break the tie.",
                price: 0,
                game: Games.roshambo,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/roshambo.png)` }}
            />
            <div className="details">
              <span className="name">Roshambo</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Just as penalty in the game of soccer, involves the taker and goal keeper. Taker aim is to score (choose opposite direction as the goal keeper) while the goal keeper is the catch the ball (go same direction as the taker).",
                price: 0,
                game: Games.penalth_card,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/penatly-shot.png)` }}
            />
            <div className="details">
              <span className="name">Penalty Card</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Player two has three chances to guess the number player 1 choose from number one to seven.",
                price: 0,
                game: Games.matcher,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/guess-master.png)` }}
            />
            <div className="details">
              <span className="name">Guess Master</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
          <div
            className="game"
            onClick={() => {
              setViewOpen(false);
              setSpec({
                isOpen: true,
                manual:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita in quidem natus, consectetur quia pariatur! Rem dolores maxime adipisci. Tempora earum, officia natus temporibus sit voluptas hic corrupti. Dolor, tempora.",
                price: 0,
                game: Games.custom_game,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/custom.png)` }}
            />
            <div className="details">
              <span className="name">Custom Games</span>
              <span className="info">
                <b>min stake:</b> $10
              </span>
              <span className="info">
                <b>rating:</b> %90
              </span>
            </div>
          </div>
        </div>
      </div>

      <section 
        className={
          gameViewOpen || spec.isOpen ? "games_world_ blur" : "games_world_"
        }
        onClick={() => {
          setViewOpen(false);
        }}
      >
        <div className="first">
          <div className="cover">
            <span
              className="sw_btn"
              onClick={() => {
                swRef.current.scrollTo(swRef.current.scrollLeft - 270, 0);
              }}
            >
              <BackIcon />
            </span>
            <div className="container" ref={swRef}>
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
                  <span className="btn" onClick={()=>setAction(ReasonType.fund) }>fund</span>
                  <span className="btn" onClick={()=>setAction(ReasonType.withdraw)}>withdraw</span>
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
                <span className="time">Next Spin{dateintime}</span>
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
                  <span className="btn" onClick={() => {
                    if (spins?.data?.spin_details.isPlayable) {
                      setGameDetails(dispatch,{player: PlayerType.first, game: Games.glory_spin, price: 0, id: undefined})
                    } else {
                      toast(dispatch, {msg: "Sorry glory spin can only be used once a day."}).fail()
                    }
                  }}>glory spin</span>
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
                <span className="time">Next Spin{dateintime}</span>
                <h3 className="title">Earnings</h3>
                <span className="price">
                  <span ref={coinRef2} className="icon" />{" "}
                  {(record?.data?.referal?.inactiveReferal ??
                    0) * (defaults?.data?.default?.referRating ??
                    0)}
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
                swRef.current.scrollTo(swRef.current.scrollLeft + 270, 0);
              }}
            >
              <NextIcon />
            </span>
          </div>
        </div>
        <div className="second">
          <div className="container">
            <div className="title">
              <h3>My Games</h3>
              <div className="title_tab">
                <span
                  className={`btn ${viewing === Viewing.current ? "on" : ""}`}
                  onClick={() => setViewing(Viewing.current)}
                >
                  Played Games
                </span>
                <span
                  className={`btn ${viewing === Viewing.room ? "on" : ""}`}
                  onClick={() => setViewing(Viewing.room)}
                >
                  Request
                </span>
                <span
                  className={`btn ${
                    viewing === Viewing.lucky_geoge ? "on" : ""
                  }`}
                  onClick={() => setViewing(Viewing.lucky_geoge)}
                >
                  Notification
                </span>
              </div>
            </div>
            <div className="game_content">
              {
                viewing === Viewing.current ?
             ( my_games?.data?.games.map((game) => {
                return (
                  <GameView
                  type="normal"
                    name={
                      game.gameID === Games.roshambo
                        ? "Roshambo"
                        : game.gameID === Games.penalth_card
                        ? "Penelty Card"
                        : game.gameID === Games.matcher
                        ? "Guess Master"
                        : ""
                    }
                    key={game._id}
                    date={game.date}
                    id={game._id}
                    cash={game.price_in_value}
                    coin={game.price_in_coin}
                    game={game.gameID}
                  />
                );
             })) :
                  viewing === Viewing.lucky_geoge ?
                    (lucky_games?.data?.games.map((game) => {
                return (
                  <GameView
                  type="lucky"
                    name={game.battleScore.player1.title
                    }
                    key={game._id}
                    date={game.date}
                    id={game._id}
                    cash={game.price_in_value}
                    v1={game.price_in_value}
                    v2={game.price_in_value * (defaults?.data.default.cashRating ?? 0)}
                    coin={game.battleScore.player1.winnerCount}
                    v3={game.battleScore.player1.winnerCount}
                    game={game.gameID}
                    btn1func={async ()=> await PlayLuckyGeogeGame(PayType.cash, game_loading, setgameLoading, game._id,dispatch, game.battleScore.player1.title )}
                    btn2func={async ()=> await PlayLuckyGeogeGame(PayType.coin, game_loading, setgameLoading, game._id,dispatch, game.battleScore.player1.title )}
                  />
                  );
                    })) :
                    viewing === Viewing.room ? 
                      (rooms?.data?.rooms.map((game) => {
                        return (
                          <GameView
                            type="room"
                            name={game.room_name}
                            key={game._id}
                            date={game.date}
                            id={game._id}
                            cash={game.entry_price}
                            v1={game.entry_price}
                            v2={game.entry_price * (defaults?.data.default.cashRating ?? 0)}
                            coin={game.player_limit}
                            v3={game.activeMember}
                            game={Games.non}
                            btn1func={() => {
                              push(`/games/rooms/${game.room_name}?payWith=${PayType.cash}`);
                            }}
                            btn2func={() => {
                              push(`/games/rooms/${game.room_name}?payWith=${PayType.cash}`)
                            }}
                        />
                );
              })) :""
            }
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
