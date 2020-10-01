import Head from "next/head";
import { useCallback, useEffect, useRef } from "react";
import Lottie from "lottie-web";
import moment from "moment";
import Link from "next/link";

const choose = require("../lottie/choose.json");
const fund = require("../lottie/fund.json");
const money = require("../lottie/money.json");

export default function Signup() {
  const chooseContainerRef = useRef(null);
  const fundContainerRef = useRef(null);
  const moneyContainerRef = useRef(null);
  const loadAnimations = useCallback(() => {
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
        <title>The Number one stacking platform for joint games.</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <section className="Index over">
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
              <span className="link">commission</span>
            </Link>
            <Link href="/#faq">
              <span className="link">faq</span>
            </Link>
            <Link href="/#signup">
              <span className="link_">join</span>
            </Link>
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
