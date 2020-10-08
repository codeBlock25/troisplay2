import { Button } from "@material-ui/core";
import Axios from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { url } from "../../constant";
import { setGame, setWalletCoin } from "../../store/action";
import { eventReducerType, gameType } from "../../store/reducer/event";
import { ColorWheel, GameCoin } from "../icons";
import { IniReducerType } from "../panel";
import { useCookies } from "react-cookie";
import { queryCache } from "react-query";
import moment from "moment";

export default function Gloryspin() {
  const dispatch: Function = useDispatch();
  const cookie: any = useCookies(["token"]);
  const [prize, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const { setQueryData } = queryCache;
  const {
    theme,
    game,
    gameID,
    coin,
  }: {
    theme: string;
    game: gameType;
    gameID: string;
    coin: number;
  } = useSelector<
    {
      initial: IniReducerType;
      event: eventReducerType;
    },
    { theme: string; game: gameType; gameID: string; coin: number }
  >((state): {
    theme: string;
    game: gameType;
    gameID: string;
    coin: number;
  } => {
    return {
      theme: state.initial.theme,
      game: state.event.game,
      gameID: state.event.gameID,
      coin: state.initial.wallet.currentCoin,
    };
  });
  const [isStarted, setStarted] = useState<boolean>(true);
  useEffect(() => {
    if (isStarted) {
      const interval = setInterval(() => {
        setPrice(Math.ceil(Math.random() * 100));
      }, 70);
      setTimeout(() => {
        clearInterval(interval);
        setStarted(false);
        setDone(true);
      }, 12000);
    }
    return () => {
      setStarted(false);
    };
  }, [isStarted, game]);

  const spinPlay = async (
    e: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // let Cookie = document.cookie;
    await Axios.post(
      `${url}/games/spin`,
      {
        price_in_coin: prize,
      },
      {
        headers: {
          authorization: `Bearer ${cookie[0].token}`,
        },
      }
    )
      .then(({}) => {
        dispatch(setWalletCoin(coin + prize));
        toast.success("Thanks for playing.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("!Error in communication.");
      })
      .finally(() => {
        setLoading(false);
        dispatch(setGame(gameType.non, ""));
      });
  };
  if (game === gameType.glory_spin)
    return (
      <div className={`gameworld theme ${theme}`}>
        <div className="world spin">
          <div className="spinner">
            <ColorWheel />
          </div>
          <span className="prize">
            {Math.ceil(prize)} <GameCoin />{" "}
          </span>
          <Button
            disabled={!done}
            className={`btn_ theme ${theme}`}
            onClick={spinPlay}
          >
            {done ? "claim" : "loading"}
          </Button>
        </div>
      </div>
    );
  else return <></>;
}
