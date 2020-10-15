import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { BackIcon, BillIcon, MAincon, MDicon, NextIcon } from '../../icon';
import {InView} from "react-intersection-observer"
import { errorType, Games } from '../../typescript/enum';
import { AxiosResponse } from 'axios';
import { useQueryCache } from 'react-query';
import moment from "moment"
import Lottie from 'lottie-web';
import { Button, Fab, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { CreditCard, Home, Settings, Star } from '@material-ui/icons';
import { toNumber } from 'lodash';
import { NAIRA } from '../../constant';
import { usePayBill } from '../../functions';
import { useDispatch } from 'react-redux';

export enum BillPayment {
  non,
  airtime, data,
  bill,
  transfer,
}


export default function Bottompanel() {
  const dispatch = useDispatch()
    const swRef: MutableRefObject<HTMLDivElement | null> = useRef();
    const coinRef: MutableRefObject<HTMLSpanElement | null> = useRef();
    const coinRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
    const gameRef2: MutableRefObject<HTMLSpanElement | null> = useRef();
  const [dateintime, setDateintime] = useState("");
    const [phone_number, setPhone_number] = useState<string>()
    const [username, setUsernamer] = useState<string>("")
    const [phone_number_error, setPhone_number_error] = useState<errorType>(
      errorType.non
  );
  const [loading, setLoading] = useState<boolean>(false)
  const [key, setKey] = useState<string>("")
  const [open, setOpen] = useState<BillPayment>(BillPayment.airtime)
  const [amount, setAmount] = useState<number>()
  const [key_error, setKey_error] = useState<errorType>(errorType.non);
    const [isOpen, setIsopen] = useState(false)
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
    }, [])
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
    
    return (
      <div className={isOpen ? "bottompanel open" : "bottompanel"}>
         <form className={open === BillPayment.transfer? "form open": "form"} onSubmit={(e) => {
          e.preventDefault()
          usePayBill({phone_number,amount, key,loading, setLoading, dispatch})
        }} data-title="Transfer Form">
          <TextField
            variant="filled"
            label="username"
            className="inputBox"
            type="tel"
            required
            value={username}
            placeholder="eg troisgamer (must have a troisplay account)."
            onChange={({ target: { value } }) => {
              setUsernamer(value);
            }}
            error={phone_number_error === errorType.warning || phone_number_error === errorType.error}
            helperText={phone_number_error === errorType.warning? "No account found with this number.": phone_number_error === errorType.error?"Invalid phone number.":""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{"  "}</InputAdornment>
            )
          }} 
          />
          <TextField
            variant="filled"
            label="Amount"
            className="inputBox amount"
            type="number"
            required
            value={amount}
            placeholder="00.00"
            onChange={({ target: { value } }) => {
              setAmount(parseFloat(value));
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{fontFamily: "mon_bold"}}>
                  $
                </InputAdornment>
              )
            }}
            />
          <TextField
            variant="filled"
            label="Betting Key"
            className="inputBox"
            required
            type="password"
            value={key}
            placeholder="Your 6 digit betting key"
            onChange={({ target: { value } }) => {
              if (key_error !== errorType.non) {
                setKey_error(errorType.non);
              }
              setKey(value);
            }}
            error={key_error === errorType.error || key.length !== 6}
            helperText={key_error === errorType.error? "Incorrect betting key." :key.length !== 6 ? "Betting key should 6 digits long." : ""}
          />
          <Button type="submit" className="btn">Buy</Button>
        </form>
         <form className={open === BillPayment.data? "form open": "form"} onSubmit={(e) => {
          e.preventDefault()
          usePayBill({phone_number,amount, key,loading, setLoading, dispatch})
        }} data-title="Data Form">
          <TextField
            variant="filled"
            label="Phone Number"
            className="inputBox"
            type="tel"
            required
            value={phone_number}
            placeholder="Country code include."
            onChange={({ target: { value } }) => {
              if (phone_number_error !== errorType.non) {
                setPhone_number_error(errorType.non);
              }
              setPhone_number(value);
            }}
            error={phone_number_error === errorType.warning || phone_number_error === errorType.error}
            helperText={phone_number_error === errorType.warning? "No account found with this number.": phone_number_error === errorType.error?"Invalid phone number.":""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" >{"  "}</InputAdornment>
            )
          }} 
          />
          <TextField
            variant="filled"
            label="Amount"
            className="inputBox amount"
            type="number"
            required
            value={amount}
            placeholder="00.00"
            onChange={({ target: { value } }) => {
              setAmount(parseFloat(value));
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{fontFamily: "mon_bold"}}>
                  MB
                </InputAdornment>
              )
            }}
            />
          <TextField
            variant="filled"
            label="Betting Key"
            className="inputBox"
            required
            type="password"
            value={key}
            placeholder="Your 6 digit betting key"
            onChange={({ target: { value } }) => {
              if (key_error !== errorType.non) {
                setKey_error(errorType.non);
              }
              setKey(value);
            }}
            error={key_error === errorType.error || key.length !== 6}
            helperText={key_error === errorType.error? "Incorrect betting key." :key.length !== 6 ? "Betting key should 6 digits long." : ""}
          />
          <Button type="submit" className="btn">Buy</Button>
        </form>
         <form data-title="Airtime form" className={open === BillPayment.airtime ? "form open" : "form"} onSubmit={(e) => {
          e.preventDefault()
          usePayBill({phone_number,amount, key,loading, setLoading, dispatch})
        }}>
          <TextField
            variant="filled"
            label="Phone Number"
            className="inputBox"
            type="tel"
            required
            value={phone_number}
            placeholder="Country code include."
            onChange={({ target: { value } }) => {
              if (phone_number_error !== errorType.non) {
                setPhone_number_error(errorType.non);
              }
              setPhone_number(value);
            }}
            error={phone_number_error === errorType.warning || phone_number_error === errorType.error}
            helperText={phone_number_error === errorType.warning? "No account found with this number.": phone_number_error === errorType.error?"Invalid phone number.":""}
            />
          <TextField
            variant="filled"
            label="Amount"
            className="inputBox amount"
            type="number"
            required
            value={amount}
            placeholder="00.00"
            onChange={({ target: { value } }) => {
              setAmount(parseFloat(value));
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NAIRA/>
                </InputAdornment>
              )
            }}
            />
          <TextField
            variant="filled"
            label="Betting Key"
            className="inputBox"
            required
            type="password"
            value={key}
            placeholder="Your 6 digit betting key"
            onChange={({ target: { value } }) => {
              if (key_error !== errorType.non) {
                setKey_error(errorType.non);
              }
              setKey(value);
            }}
            error={key_error === errorType.error || key.length !== 6}
            helperText={key_error === errorType.error? "Incorrect betting key." :key.length !== 6 ? "Betting key should 6 digits long." : ""}
          />
          <Button type="submit" className="btn">Buy</Button>
        </form>
        <Fab className="btn_star" onClick={() => { setIsopen(true); setOpen(BillPayment.non)}}>VTU</Fab>
            <Button className="back_btn" onClick={() => {
                setIsopen(false)
            }}>back</Button>
            <h3 className="title">Ganel Panel</h3>
            <div className="container_">
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
                  {(record?.data?.referal?.inactiveReferal ?? 0) * (defaults?.data?.default?.referRating ??
                    0)}
                </span>
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
            <div className="action">
            <Button className="btn" onClick={() => {
                  setOpen(BillPayment.airtime)
                    }}>
                        <span className="at">
                            <MAincon/>
                            <span>Airtime</span>
                        </span>
                    </Button>
                    <Button className="btn"  onClick={() => {
                      setOpen(BillPayment.data)
                    }}>
                        <span className="at">
                            <MDicon/>
                            <span>Data</span>
                        </span>
                    </Button>
                    <Button className="btn"  onClick={() => {
                        setOpen(BillPayment.bill)
                    }}>
                        <span className="at">
                            <BillIcon />
                            <span>Pay Bill</span>
                        </span>
                    </Button>
                    <Button className="btn"  onClick={() => {
                      setOpen(BillPayment.transfer)
                    }}>
                        <span className="at">
                            <CreditCard />
                            <span>Transfer</span>
                        </span>
                    </Button>
                    <Button className="btn">
                        <span className="at">
                            <span ref={gameRef2} />
                            <span>Games</span>
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
