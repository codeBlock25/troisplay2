import Head from "next/head";
import Link from "next/link";
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
import { url, url_media } from "../../constant";
import { QueryResult } from "react-query";
import { Games, PayType, PlayerType, Viewing } from "../../typescript/enum";
import next, { GetStaticProps, GetStaticPropsContext } from "next";
import { getPrice, isPlayable, getToken } from "../../functions";
import { MoonLoader } from "react-spinners";
import Notification from "../../components/notification";
import Roshambo from "../../components/games/roshambo";
import { setGameDetails } from "../../store/action";
import { useDispatch } from "react-redux";
import Penalty_card from "../../components/games/penelty_card";
import ToastContainer from "../../components/toast";
import AppLoader from "../../components/app_loader";
import { useRouter } from "next/router";
import GameView from "../../components/game_view";
import Exitwindow from "../../components/exitwindow";
import Header from "../../components/header";
import {nextType} from "../../typescript/enum"


export default function GamesScreen() {
  const dispatch = useDispatch();
  const [viewing, setViewing] = useState<Viewing>(Viewing.current);
  const [dateintime, setDateintime] = useState("");
  const [app_loading, setApp_loading] = useState<boolean>(true);
  const [gameViewOpen, setViewOpen] = useState<boolean>(false);
  const swRef: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const game_play: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [playLoader, setPlayerLoader] = useState<boolean>(false);
  const [game_loading, setgameLoading] = useState<boolean>(false);
  const [runText, setRunText] = useState("loading game components...");
  const { push } = useRouter();
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

  useEffect(() => {
    let timecount = setInterval(() => {
      setDateintime(moment(new Date()).format("hh:mm:ss a"));
    }, 300);
    return () => {
      clearInterval(timecount);
    };
  }, []);
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
      <Notification />
      <ToastContainer />
      <Header setApp_loading={setApp_loading} setRunText={setRunText} />
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
                <MoonLoader size="25px" color="white" />
              ) : (
                "play with $"
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
                <MoonLoader size="25px" color="white" />
              ) : (
                <>
                  play with <GameCoin />
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
              <div className="btn">
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
          <div
            className="game"
            onClick={() => {
              setSpec({
                isOpen: true,
                manual: "",
                price: 0,
                game: Games.lucky_geoge,
              });
            }}
          >
            <div
              className="img"
              style={{ backgroundImage: `url(/images/lucky-geoge.png)` }}
            />
            <div className="details">
              <span className="name">Lucky Geoge</span>
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
                <span className="time">{dateintime}</span>
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
                <span className="time">{dateintime}</span>
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
                <span className="time">{dateintime}</span>
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
                  Current Games
                </span>
                <span
                  className={`btn ${viewing === Viewing.room ? "on" : ""}`}
                  onClick={() => setViewing(Viewing.room)}
                >
                  Rooms
                </span>
                <span
                  className={`btn ${
                    viewing === Viewing.lucky_geoge ? "on" : ""
                  }`}
                  onClick={() => setViewing(Viewing.lucky_geoge)}
                >
                  Lucky Geoge
                </span>
              </div>
            </div>
            <div className="game_content">
              {my_games?.data?.games.map((game) => {
                return (
                  <GameView
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
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
