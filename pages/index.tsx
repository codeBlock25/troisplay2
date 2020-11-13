import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";
import moment from "moment";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "../icon";
import Axios from "axios";
import { useRouter } from "next/router";
import { PUBLIC_KEY, SECRET_KEY, url } from "../constant";
import { SyncLoader } from "react-spinners";
import ToastContainer from "../components/toast";
import { errorType, modalType } from "../typescript/enum";
import { toast } from "../store/action";
import { useDispatch } from "react-redux";
import { Button, Fab } from "@material-ui/core";
import { Facebook, Instagram, Twitter, WhatsApp } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
 
export default function Index() {
  const dispatch = useDispatch();
  const [nav_bar, setNarBar] = useState<boolean>(false);
  const [loginOpen, setLoginState] = useState<boolean>(false);
  const [signupOpen, setSignUpState] = useState<boolean>(false);
  const [phone_number, setPhone_number] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [phone_number_error, setPhone_number_error] = useState<errorType>(
    errorType.non
  );
  const [phone_number2, setPhone_number2] = useState("");
  const [phone_number_error2, setPhone_number_error2] = useState<errorType>(
    errorType.non
  );
  const [key2, setKey2] = useState<string>("");
  const [key_error, setKey_error] = useState<errorType>(errorType.non);
  const [key_error2, setKey_error2] = useState<errorType>(errorType.non);
  const { push, pathname, asPath } = useRouter();
  const route = useRouter();
  const [refer_code, setRefer_code] = useState<string>("");
  const [full_name, setFull_name] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);

  const handleSubmitSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!(/^[0-9]*$/g.test(key2) && key2.length < 7)) return;
    if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(phone_number2)) {
      setPhone_number_error2(errorType.error);
      return;
    }
    setloading(true);
    await Axios({
      method: "POST",
      url: `${url}/account`,
      data: {
        full_name,
        phone_number: phone_number2,
        key: key2,
        refer_code,
      },
    })
      .then(() => {
        push("/#login");
        setFull_name("");
        setPhone_number2("");
        setKey2("");
        setRefer_code("");
        toast(dispatch, {
          msg:
            "Congratulations! Your registration was successful, please login to complete your profile.",
        }).success();
      })
      .catch((err) => {
        setSignUpState(false);
        if (err.message === "Request failed with status code 400") {
          setPhone_number_error2(errorType.used);
          return;
        }
        toast(dispatch, {
          msg:
            "Sorry, we could not communicate with the troisplay server please check you internet connection.",
        }).error();
      })
      .finally(() => {
        setloading(false);
      });
  };

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(/^[0-9]*$/g.test(key) && key.length < 7)) return;
    if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(phone_number)) {
      setPhone_number_error(errorType.warning);
      return;
    }
    if (loading) return;
    setloading(true);
    await Axios({
      method: "POST",
      url: `${url}/account/login`,
      data: {
        phone_number,
        key,
      },
    })
      .then(({ data: { token, isPlayer } }) => {
        localStorage.setItem("game_token", token);
        localStorage.setItem("gamer", isPlayer ? "old" : "new");
        toast(dispatch, { msg: "Login successful." }).success();
        setTimeout(() => {
          push(isPlayer ? "/games" : "/launch");
        }, 4000);
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 402") {
          setPhone_number_error(errorType.warning);
          return;
        }
        if (err.message === "Request failed with status code 401") {
          setKey_error(errorType.error);
          return;
        }
        setLoginState(true);
        toast(dispatch, {
          msg:
            "Sorry, we could not communicate with the troisplay server please check you internet connection.",
        }).error();
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    if (asPath === "/#signup") {
      setLoginState(false);
      setSignUpState(true)
    } else if (asPath === "/#login") {
      setLoginState(true);
      setSignUpState(false)
    }
    else {
      setLoginState(false);
      setSignUpState(false)
    };
  }, [asPath, pathname]);
  return (
    <>
      <Head>
        <title>
          {loginOpen
            ? "Login - Troisplay"
            : signupOpen
            ? "Signup - Troisplay"
            : "The Number one stacking platform for joint games."}
        </title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <ToastContainer />

      <div
        className={nav_bar ? "window open" : "window"}
        onClick={() => {
          setNarBar(false);
        }}
      >
        <Link href="/#games">
          <span className="link">Play</span>
        </Link>
        <Link href="/#games">
          <span className="link">Games</span>
        </Link>
        <Link href="/#how-it-works">
          <a className="link">How it works</a>
        </Link>
        <Link href="/#commission">
          <a className="link">Download</a>
        </Link>
        <Link href="/#faq">
          <a className="link">contact us</a>
        </Link>
        <span
          className="link_"
          onClick={() => {
            push("/#signup");
          }}
        >
          join
        </span>
      </div>
      <div
        className="right_min"
        onClick={() => {
          setNarBar((prev) => !prev);
        }}
      >
        <MenuIcon />
      </div>
      <section className={loginOpen ? "Account open" : "Account"}>
        <form onSubmit={handleSubmitLogin}>
          <button
            type="button"
            className="close_icon"
            onClick={() => !loading && push("/")}
          >
            <CloseIcon />
          </button>
          <h3 className="title">Welcome Back to Troisplay.</h3>
          <label htmlFor="tel">Phone Number *</label>
          <input
            type="tel"
            id="tel"
            required
            value={phone_number}
            placeholder="e.g 2349088866789"
            onChange={({ target: { value } }) => {
              if (phone_number_error !== errorType.non) {
                setPhone_number_error(errorType.non);
              }
              setPhone_number(value);
            }}
          />
          {phone_number_error === errorType.warning && (
            <p className="error">No account found with this number.</p>
          )}
          {phone_number_error === errorType.error && (
            <p className="error">Invalid phone number.</p>
          )}
          <label htmlFor="password">Betting Key *</label>
          <input
            type="password"
            id="password"
            required
            maxLength={6}
            value={key}
            placeholder="SECRET"
            onChange={({ target: { value } }) => {
              if (key_error !== errorType.non) {
                setKey_error(errorType.non);
              }
              setKey(value);
            }}
          />

          {key_error === errorType.error && (
            <p className="error">Incorrect betting key.</p>
          )}
          {!/^[0-9]*$/g.test(key) ? (
            <p className="error">Betting must be a number.</p>
          ) : (
            key.length !== 6 && (
              <p className="error">Betting key should 6 digits long.</p>
            )
          )}
          <button type="submit" className="submit_btn">
            {loading ? <SyncLoader size="10px" color="white" /> : "login"}
          </button>
          <p className="link">
            forget password
            <Link href="/forgot">
              <a>click here</a>
            </Link>
          </p>
          <p className="link">
            Don't have an account?
            <Link href="#signup">
              <a>click here</a>
            </Link>
          </p>
        </form>
      </section>
      <section className={signupOpen ? "Account open" : "Account"}>
        <form onSubmit={handleSubmitSignup}>
          <button
            type="button"
            className="close_icon"
            onClick={() => !loading && push("/")}
          >
            <CloseIcon />
          </button>
          <h3 className="title">Welcome to Troisplay.</h3>
          <label htmlFor="referal">Referal Code (optional)</label>
          <input
            type="text"
            id="referal"
            value={refer_code}
            placeholder="code"
            onChange={({ target: { value } }) => {
              setRefer_code(value);
            }}
          />
          <label htmlFor="full_name">Full Name *</label>
          <input
            type="text"
            id="full_name"
            required
            value={full_name}
            placeholder="John deo"
            onChange={({ target: { value } }) => {
              setFull_name(value);
            }}
          />
          <label htmlFor="tel2">Phone Number *</label>
          <input
            type="tel"
            id="tel2"
            required
            value={phone_number2}
            placeholder="e.g 2349088866789"
            onChange={({ target: { value } }) => {
              if (phone_number_error2 !== errorType.non) {
                setPhone_number_error2(errorType.non);
              }
              setPhone_number2(value);
            }}
          />
          {phone_number_error2 === errorType.warning && (
            <p className="error">No account found with this number.</p>
          )}
          {phone_number_error2 === errorType.error && (
            <p className="error">Invalid phone number.</p>
          )}
          {phone_number_error2 === errorType.used && (
            <p className="error">This phone number is already used.</p>
          )}
          <label htmlFor="password2">Betting Key *</label>
          <input
            type="password"
            id="password2"
            required
            maxLength={6}
            value={key2}
            placeholder="SECRET"
            onChange={({ target: { value } }) => {
              if (key_error2 !== errorType.non) {
                setKey_error2(errorType.non);
              }
              setKey2(value);
            }}
          />

          {!/^[0-9]*$/g.test(key2) ? (
            <p className="error">Betting must be a number.</p>
          ) : (
            key2.length !== 6 && (
              <p className="error">Betting key should 6 digits long.</p>
            )
          )}
          {key_error2 === errorType.error && (
            <p className="error">Invalid phone number.</p>
          )}
          <button type="submit" className="submit_btn">
            {loading ? (
              <SyncLoader size="10px" color="white" />
            ) : (
              "create Account"
            )}
          </button>
          <p className="link">
            already have an account?
            <Link href="#login">
              <a>click here</a>
            </Link>
          </p>
        </form>
      </section>
      <section
        className={loginOpen || signupOpen || nav_bar ? "Index over" : "Index"}
      >
        <header>
          <div className="left">
            <Link href="/">
              <span className="logo" role="img" />
            </Link>
          </div>
          <div className="min_op">
            <Button className="btn_op" onClick={() => push("/#login")}>
              Login
            </Button>
            <Fab className="btn_sp">
              <Instagram />
            </Fab>
            <Fab className="btn_sp">
              <Facebook />
            </Fab>
            <Fab className="btn_sp">
              <Twitter />
            </Fab>
            <Fab className="btn_sp">
              <WhatsApp />
            </Fab>
          </div>
          <div className="right">
            <Link href="/#games">
              <span className="link">Play</span>
            </Link>
            <Link href="/#games">
              <span className="link">Games</span>
            </Link>
            <Link href="/#how-it-works">
              <a className="link">How it works</a>
            </Link>
            <Link href="/#commission">
              <a className="link">Download</a>
            </Link>
            <Link href="/#faq">
              <a className="link">contact us</a>
            </Link>
            <span
              className="link_"
              onClick={() => {
                setSignUpState(true);
              }}
            >
              join
            </span>
          </div>
        </header>
        <section className="first">
          <div className="container">
            <h3 className="title">Welcome to Troisplay</h3>
            <p className="txt">
              Here is a platform that brings together our love for money and
              passion for competition all in one place.
            </p>
            <button className="join_btn" onClick={() => push("/#signup")}>
              Join
            </button>
          </div>
        </section>
        <section className="second" id="games">
          <h3 className="title">Troisplay Games.</h3>
          <div className="container">
            <div className="game_view">
              <span
                className="pic"
                role="img"
                style={{ backgroundImage: "url(/images/roshambo.png)" }}
              />
              <span className="name">Roshambo (Rock, Paper, Scrissors)</span>
              <p className="txt">
                A game of Rock-Paper-Scrissors played between to parties to
                stand a chance to win the stake amount in cash of the game.
              </p>
            </div>
            <div className="game_view">
              <span
                className="pic"
                role="img"
                style={{ backgroundImage: "url(/images/penatly-shot.png)" }}
              />
              <span className="name">Penalty Shot</span>
              <p className="txt">
                A game between two parties where one is the Penalty taker and
                the other the goal keeper, the goal keeper try to stop the
                penalty taker from soccering, both stande a chance to win their
                stake amount in cash
              </p>
            </div>
            <div className="game_view">
              <span
                className="pic"
                role="img"
                style={{ backgroundImage: "url(/images/guess-master.png)" }}
              />
              <span className="name">Guess master</span>
              <p className="txt">
                A game of the mind where party two tries to guess the number
                party has set standing a chance to win their stake amount in
                cash.
              </p>
            </div>
            <div className="game_view">
              <span
                className="pic"
                role="img"
                style={{ backgroundImage: "url(/images/lucky-geoge.png)" }}
              />
              <span className="name">Luckyjudge</span>
              <p className="txt">
                This is a game set by the Game Master for players to win prices
                after entering the game which is drawn at random.
              </p>
            </div>
            <div className="game_view">
              <span
                className="pic"
                role="img"
                style={{ backgroundImage: "url(/images/custom.png)" }}
              />
              <span className="name">Room Games</span>
              <p className="txt">
                This is a game for players to answer question after joining a
                room to win cash prices ranging from $10 - $1000 pending on the
                question and the room.
              </p>
            </div>
            <span
              className="correct"
              style={{ width: "20px", minWidth: "20px" }}
            />
          </div>
        </section>
        <section className="fouth" id="how-it-works">
          <h3 className="title">How it Works.</h3>
          <h4 className="title_sub">Make more cash in just 4 steps.</h4>
          <div className="container">
            <div className="step">
              <span className="count">step 1</span>
              <div className="lottie_view"></div>
              <h3 className="title_">Choose Game</h3>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aperiam, minima?
              </p>
            </div>
            <div className="step">
              <span className="count">step 2</span>
              <div className="lottie_view"></div>
              <h3 className="title_">Fund Wallet</h3>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aperiam, minima?
              </p>
            </div>
            <div className="step">
              <span className="count">step 3</span>
              <div className="lottie_view"></div>
              <h3 className="title_">Play Game</h3>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aperiam, minima?
              </p>
            </div>
            <div className="step">
              <span className="count">step 4</span>
              <div className="lottie_view"></div>
              <h3 className="title_">Collect Cash</h3>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aperiam, minima?
              </p>
            </div>
          </div>
        </section>
        <section className="five">
          <div className="container">
            <h3 className="title">Ready to start making cool fun cash?</h3>
            <Button className="btn">
              <div className="view">
                <FontAwesomeIcon icon={faApple} />
                <div className="txt">
                  Dowload on <span>Apple Store</span>
                </div>
              </div>
            </Button>
            <Button className="btn">
              <div className="view">
                <FontAwesomeIcon icon={faGooglePlay} />
                <div className="txt">
                  Dowload on <span>Google Play</span>
                </div>
              </div>
            </Button>
          </div>
        </section>
        <footer>
          <p className="footer">
            Term & condition apply &copy; Troisplay {moment().format("YYYY")}
          </p>
        </footer>
      </section>
    </>
  );
}
