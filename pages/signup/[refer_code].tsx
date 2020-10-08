import Head from "next/head";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Lottie from "lottie-web";
import moment from "moment";
import Link from "next/link";
import { CloseIcon } from "../../icon";
import Axios from "axios";
import { useRouter } from "next/router";
import { url } from "../../constant";
import { MoonLoader } from "react-spinners";
import { errorType, modalType } from "../../typescript/enum";
import { useDispatch } from "react-redux";
import { toast } from "../../store/action";

const choose = require("../../lottie/choose.json");
const fund = require("../../lottie/fund.json");
const money = require("../../lottie/money.json");

export default function Signup() {
  const dispatch = useDispatch();
  const chooseContainerRef = useRef(null);
  const fundContainerRef = useRef(null);
  const moneyContainerRef = useRef(null);
  const [signupOpen, setSignUpState] = useState<boolean>(true);
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
  const { push, query } = useRouter();
  const [refer_code, setRefer_code] = useState<string>("");
  const [full_name, setFull_name] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [error_open, setErrorOpen] = useState<boolean>(false);

  const handleSubmitSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!(/^[0-9]*$/g.test(key2) && key2.length !== 6)) return;
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
        setSignUpState(false);
        setFull_name("");
        setPhone_number2("");
        setKey2("");
        setRefer_code("");
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 400") {
          setPhone_number_error2(errorType.used);
          return;
        }
        setSignUpState(false);
        toast(dispatch, {
          isOpen: modalType.open,
          msg:
            "Sorry, we could not communicate with the troisplay server please check you internet connection.",
        }).error();
      })
      .finally(() => {
        setloading(false);
      });
  };
  const loadAnimations = useCallback(() => {
    setRefer_code(typeof query.refer_code === "string" ? query.refer_code : "");
    Lottie.loadAnimation({
      container: chooseContainerRef.current,
      renderer: "canvas",
      autoplay: true,
      loop: true,
      animationData: choose,
    });
    Lottie.loadAnimation({
      container: moneyContainerRef.current,
      renderer: "canvas",
      autoplay: true,
      loop: true,
      animationData: money,
    });
    Lottie.loadAnimation({
      container: fundContainerRef.current,
      renderer: "canvas",
      autoplay: true,
      loop: true,
      animationData: fund,
    });
  }, []);
  useEffect(() => {
    loadAnimations();
  }, [loadAnimations]);
  return (
    <>
      <Head>
        <title>Signup - Troisplay</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <section className={"Account open"}>
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
          <label htmlFor="tel">Phone Number *</label>
          <input
            type="tel"
            id="tel"
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
          <label htmlFor="password">Betting Key *</label>
          <input
            type="password"
            id="password"
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
          {key2.length !== 6 && (
            <p className="error">Betting key should 6 digits long.</p>
          )}
          {key_error2 === errorType.error && (
            <p className="error">Invalid phone number.</p>
          )}
          <button type="submit" className="submit_btn">
            {loading ? (
              <MoonLoader size="20px" color="white" />
            ) : (
              "create Account"
            )}
          </button>
          <p className="link">
            already have an account?
            <Link href="#signup">
              <a
                onClick={() => {
                  push("/login");
                }}
              >
                click here
              </a>
            </Link>
          </p>
        </form>
      </section>
      <section className={signupOpen ? "Index over" : "Index"}>
        <header>
          <div className="left">
            <span className="logo" role="img" />
            <Link href="/">
              <span className="link">Troisplay</span>
            </Link>
          </div>
          <div className="right">
            <Link href="/#games">
              <span className="link">Games</span>
            </Link>
            <Link href="/#how-it-works">
              <a className="link">How it works</a>
            </Link>
            <Link href="/#commission">
              <a className="link">commission</a>
            </Link>
            <Link href="/#faq">
              <a className="link">faq</a>
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
            <h3 className="title">Welcome to Troisplay Play</h3>
            <p className="txt">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. In
              aliquam veritatis accusamus nemo fugit facilis sed. Saepe tenetur
              explicabo rerum.
            </p>
            <button className="join_btn">Join</button>
          </div>
        </section>
        <section className="second" id="games">
          <h3 className="title">Troisplay Games.</h3>
          <div className="container">
            <div className="game_view">
              <span className="pic" role="img" />
              <span className="name">Roshambo (Rock Paper Scrissors)</span>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                vero!
              </p>
            </div>
            <div className="game_view">
              <span className="pic" role="img" />
              <span className="name">Roshambo (Rock Paper Scrissors)</span>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                vero!
              </p>
            </div>
            <div className="game_view">
              <span className="pic" role="img" />
              <span className="name">Roshambo (Rock Paper Scrissors)</span>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                vero!
              </p>
            </div>
            <div className="game_view">
              <span className="pic" role="img" />
              <span className="name">Roshambo (Rock Paper Scrissors)</span>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                vero!
              </p>
            </div>
            <div className="game_view">
              <span className="pic" role="img" />
              <span className="name">Roshambo (Rock Paper Scrissors)</span>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                vero!
              </p>
            </div>
            <div className="game_view">
              <span className="pic" role="img" />
              <span className="name">Roshambo (Rock Paper Scrissors)</span>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste,
                vero!
              </p>
            </div>
            <span
              className="correct"
              style={{ width: "20px", minWidth: "20px" }}
            />
          </div>
        </section>
        <section className="third" id="commission">
          <h3 className="title">Commission</h3>
          <h4 className="title_sub">
            Earn as much in real cash playing on Troisplay
          </h4>
          <div className="table">
            <div className="thead">
              <div className="tr">price</div>
              <div className="tr">Cash</div>
              <div className="tr">Roshambo</div>
              <div className="tr">Guess Matcher</div>
              <div className="tr">Penelty Shot</div>
              <div className="tr">Rooms</div>
              <div className="tr">Custom Game</div>
              <div className="tr">Lucky Geoge</div>
            </div>
            <div className="tbody">
              <div className="td">
                <div className="tr">10$</div>
                <div className="tr">19$</div>
                <div className="tr">16$</div>
                <div className="tr">17$</div>
                <div className="tr">15$+</div>
                <div className="tr">18$</div>
                <div className="tr">8$+</div>
                <div className="tr">8$+</div>
              </div>
              <div className="td">
                <div className="tr">20$</div>
                <div className="tr">29$</div>
                <div className="tr">26$</div>
                <div className="tr">27$</div>
                <div className="tr">25$+</div>
                <div className="tr">28$</div>
                <div className="tr">18$+</div>
                <div className="tr">18$+</div>
              </div>
              <div className="td">
                <div className="tr">30$</div>
                <div className="tr">39$</div>
                <div className="tr">36$</div>
                <div className="tr">37$</div>
                <div className="tr">35$+</div>
                <div className="tr">38$</div>
                <div className="tr">28$+</div>
                <div className="tr">28$+</div>
              </div>
              <div className="td">
                <div className="tr">50$</div>
                <div className="tr">59$</div>
                <div className="tr">56$</div>
                <div className="tr">57$</div>
                <div className="tr">55$+</div>
                <div className="tr">58$</div>
                <div className="tr">48$+</div>
                <div className="tr">48$+</div>
              </div>
              <div className="td">
                <div className="tr">100$</div>
                <div className="tr">190$</div>
                <div className="tr">160$</div>
                <div className="tr">170$</div>
                <div className="tr">150$+</div>
                <div className="tr">180$</div>
                <div className="tr">80$+</div>
                <div className="tr">80$+</div>
              </div>
              <div className="td">
                <div className="tr">200$</div>
                <div className="tr">390$</div>
                <div className="tr">360$</div>
                <div className="tr">370$</div>
                <div className="tr">350$+</div>
                <div className="tr">380$</div>
                <div className="tr">180$+</div>
                <div className="tr">180$+</div>
              </div>
            </div>
          </div>
          <button className="join_btn">start earning now</button>
        </section>
        <section className="fouth" id="how-it-works">
          <h3 className="title">How it Works.</h3>
          <h4 className="title_sub">Make more cash in just 4 steps.</h4>
          <div className="container">
            <div className="step">
              <span className="count">step 1</span>
              <div className="lottie_view" ref={chooseContainerRef}></div>
              <h3 className="title_">Choose Game</h3>
              <p className="txt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aperiam, minima?
              </p>
            </div>
            <div className="step">
              <span className="count">step 2</span>
              <div className="lottie_view" ref={moneyContainerRef}></div>
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
              <div className="lottie_view" ref={fundContainerRef}></div>
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
            <button className="join_btn">start game</button>
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
