import { Button } from "@material-ui/core";
import Axios, { AxiosResponse } from "axios";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NAIRA, url } from "../../constant";
import { ColorWheel, GameCoin } from "../../icon";
import { useQueryCache } from "react-query";
import moment from "moment";
import { Games, PlayerType } from "../../typescript/enum";
import { getToken } from "../../functions";
import { setGameDetails, toast } from "../../store/action";
import { reducerType } from "../../typescript/interface";

function randomIntFromInterval(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Gloryspin() {
  const dispatch = useDispatch();
  const [prize, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const records = useQueryCache().getQueryData("records");

  const {
    details: { game, price, id, player },
  } = useSelector<
    reducerType,
    {
      details: {
        price: number;
        game: Games;
        id?: string;
        player: PlayerType;
      };
    }
  >((state) => {
    return {
      details: state.event.game_details,
    };
  });

  const [isStarted, setStarted] = useState<boolean>(false);
  const spinner = useCallback(() => {
    if (game === Games.glory_spin) {
      setStarted(true);
    } else {
      setStarted(false);
    }
    if (isStarted) {
      const interval = setInterval(() => {
        setPrice((prev) => {
          return done ? prev : randomIntFromInterval(1, 5);
        });
      }, 70);
      setTimeout(() => {
        clearInterval(interval);
        setStarted(false);
        setDone(true);
      }, 12000);
    }
  }, [isStarted, game]);
  useEffect(() => {
    spinner();
  }, [spinner]);

  const spinPlay = async (
    e: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    await Axios.post(
      `${url}/games/spin`,
      {
        price_in_coin: prize,
      },
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    )
      .then(({}) => {
        setGameDetails(dispatch, {
          player: 0,
          id: undefined,
          price: 0,
        });
        toast(dispatch, { msg: "Thanks for playing" }).success();
      })
      .catch((err) => {
        console.log(err);
        toast(dispatch, {
          msg: `An Error occured could not connect to troisplay game server please check you interner connection and Try Again.`,
        }).error();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const theme = "dark-mode";

  const spins: AxiosResponse<{
    spin_details: {
      currentTime: Date;
      gameTime: Date;
      isPlayable: boolean;
    };
  }> = useQueryCache().getQueryData("spins");

  if (game === Games.glory_spin)
    return (
      <div className={`gameworld theme ${theme}`}>
        <div className="world spin">
          <div className={!done ? "spinner" : "spinner off"}>
            <ColorWheel />
          </div>
          <span className="prize">
            {Math.ceil(prize)} <NAIRA />{" "}
          </span>
          <Button
            disabled={!done || (!spins?.data?.spin_details.isPlayable ?? true)}
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
