import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BackIcon, BillIcon, MAincon, MDicon, NextIcon } from "../../icon";
import { InView } from "react-intersection-observer";
import { BillPayment, errorType, Games } from "../../typescript/enum";
import { AxiosResponse } from "axios";
import { useQueryCache } from "react-query";
import moment from "moment";
import Lottie from "lottie-web";
import { Button, Fab } from "@material-ui/core";
import { CreditCard } from "@material-ui/icons";
import Airtime from "./components/airtime";
import Data from "./components/data";
import Transfer from "./components/transfer";
import { useRouter } from "next/router";
import { faCoins, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Bottompanel() {
  const swRef: MutableRefObject<HTMLDivElement | null> = useRef();
  const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
  const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const gameRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [dateintime, setDateintime] = useState("");
  const [open, setOpen] = useState<BillPayment>(BillPayment.airtime);
  const [isOpen, setIsopen] = useState(false);
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
      container: gameRef2.current,
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
  const spin: AxiosResponse<{
    spin_details: {
      currentTime: Date;
      gameTime: Date;
      isPlayable: boolean;
    };
  }> = useQueryCache().getQueryData("spins");
  useEffect(() => {
    let countdownEvt = setInterval(() => {
      if (spin) {
        let time = moment(
          moment(spin?.data?.spin_details.gameTime ?? new Date()).diff(
            new Date()
          )
        ).format("HH:MM:ss");
        setDateintime(spin.data.spin_details.isPlayable ? "00:00:00" : time);
      }
    }, 200);
    return () => {
      clearInterval(countdownEvt);
    };
  }, [spin]);
  const record: AxiosResponse<{
    user: {
      full_name: string;
      phone_number: string;
    };
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
    <div className={isOpen ? "bottompanel open" : "bottompanel"}>
      <Data open={open} />
      <Transfer open={open} />
      <Airtime open={open} />
      <Fab
        className="btn_star"
        onClick={() => {
          setIsopen(true);
          setOpen(BillPayment.non);
        }}
      >
        VTU
      </Fab>
      <Button
        className="back_btn"
        onClick={() => {
          setIsopen(false);
        }}
      >
        back
      </Button>
      <h3 className="title">Ganel Panel</h3>
      <div className="container_">
        <div className="cover">
          {/* <span
            className="sw_btn"
            onClick={() => {
              swRef.current.scrollTo(swRef.current.scrollLeft - 270, 0);
            }}
          >
            <BackIcon />
          </span> */}
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
                $ {record?.data?.cashwallet?.currentCash.toLocaleString() ?? 0}
              </span>
            </InView>
            {/* <InView
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
                <span className="icon">
                  <FontAwesomeIcon icon={faCoins} />
                </span>{" "}
                {(record?.data?.referal?.inactiveReferal ?? 0) *
                  (defaults?.data?.default?.referRating ?? 0)}
              </span>
            </InView>
          */}
          </div>

          {/* <span
            className="sw_btn"
            onClick={() => {
              swRef.current.scrollTo(swRef.current.scrollLeft + 270, 0);
            }}
          >
            <NextIcon />
          </span> */}
        </div>
        <div className="action">
          <Button
            className="btn"
            onClick={() => {
              setOpen((prev) =>
                prev === BillPayment.airtime
                  ? BillPayment.non
                  : BillPayment.airtime
              );
            }}
          >
            <span className="at">
              <MAincon />
              <span>Airtime</span>
            </span>
          </Button>
          <Button
            className="btn"
            onClick={() => {
              setOpen((prev) =>
                prev === BillPayment.data ? BillPayment.non : BillPayment.data
              );
            }}
          >
            <span className="at">
              <MDicon />
              <span>Data</span>
            </span>
          </Button>
          <Button
            className="btn"
            onClick={() => {
              setOpen((prev) =>
                prev === BillPayment.bill ? BillPayment.non : BillPayment.bill
              );
            }}
          >
            <span className="at">
              <BillIcon />
              <span>Pay Bill</span>
            </span>
          </Button>
          <Button
            className="btn"
            onClick={() => {
              setOpen((prev) =>
                prev === BillPayment.transfer
                  ? BillPayment.non
                  : BillPayment.transfer
              );
            }}
          >
            <span className="at">
              <CreditCard />
              <span>Transfer</span>
            </span>
          </Button>
          <Button
            className="btn"
            onClick={() => {
              setIsopen(false);
              setOpen(BillPayment.non);
              push("/games");
            }}
          >
            <span className="at">
              <span>
                <FontAwesomeIcon icon={faGamepad} />{" "}
              </span>
              <span>Games</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
