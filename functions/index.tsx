import Axios, { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { url } from "../constant";
import { setGameDetails, toast } from "../store/action";
import {
  Games,
  PayType,
  PlayerType,
  errorType,
  nextType,
} from "../typescript/enum";
import { ActionType } from "../typescript/interface";

export function getPrice(
  game: Games,
  cash: number,
  defaults?: {
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
  }
): number {
  switch (game) {
    case Games.roshambo:
      return defaults.commission_roshambo.value_in === "$"
        ? cash + (cash - defaults.commission_roshambo.value)
        : defaults.commission_roshambo.value_in === "c"
        ? cash +
          (cash - defaults.cashRating * defaults.commission_roshambo.value)
        : defaults.commission_roshambo.value_in === "%"
        ? cash + (cash - cash / defaults.commission_roshambo.value)
        : 0;

    case Games.penalth_card:
      return defaults.commission_penalty.value_in === "$"
        ? cash + (cash - defaults.commission_penalty.value)
        : defaults.commission_penalty.value_in === "c"
        ? cash +
          (cash - defaults.cashRating * defaults.commission_penalty.value)
        : defaults.commission_penalty.value_in === "%"
        ? cash + (cash - cash / defaults.commission_penalty.value)
        : 0;
    case Games.matcher:
      return defaults.commission_guess_mater.value_in === "$"
        ? cash + (cash - defaults.commission_guess_mater.value)
        : defaults.commission_guess_mater.value_in === "c"
        ? cash +
          (cash - defaults.cashRating * defaults.commission_guess_mater.value)
        : defaults.commission_guess_mater.value_in === "%"
        ? cash + (cash - cash / defaults.commission_guess_mater.value)
        : 0;
    case Games.custom_game:
      return defaults.commission_custom_game.value_in === "$"
        ? cash + (cash - defaults.commission_custom_game.value)
        : defaults.commission_custom_game.value_in === "c"
        ? cash +
          (cash - defaults.cashRating * defaults.commission_custom_game.value)
        : defaults.commission_custom_game.value_in === "%"
        ? cash + (cash - cash / defaults.commission_custom_game.value)
        : 0;
    default:
      return 0;
  }
}

export async function PlayLuckyGeogeGame(
  payWith: PayType,
  loader: boolean,
  setLoader: (t: boolean) => void,
  gameID: string,
  dispatch: (ActionType)=>void,
  title: string
) {
  let token = getToken();
    if (loader) return;
    setLoader(true);
    await Axios({
      method: "POST",
      url: `${url}/games/lucky-geoge/play`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        id: gameID,
        payWith,
      },
    })
      .then(({ data: { price } }: AxiosResponse<{ price: number; }>) => {
        toast(dispatch, {msg: `You have successfully joined ${title} with $ ${price}`}).success()
      })
      .catch((err) => {
        toast(dispatch, {msg: `An Error occured could not connect to troisplay game server please check you interner connection and Try Again.`}).error()
      })
      .finally(() => {
        setLoader(false);
      });
}

export async function PlayGame(
  payWith: PayType,
  loader: boolean,
  setLoader: (t: boolean) => void,
  gameID: string
) {
  let token = await localStorage.getItem("game_token");
  if (payWith === PayType.cash) {
    if (loader) return;
    setLoader(true);
    await Axios({
      method: "POST",
      url: `${url}/games/play`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        gameID: gameID,
        playWith: PayType.cash,
      },
    })
      .then(({ data: { price } }: AxiosResponse<{ price: number }>) => {})
      .catch((err) => {})
      .finally(() => {
        setLoader(false);
      });
  } else if (payWith === PayType.coin) {
    if (loader) return;
    setLoader(true);
    await Axios({
      method: "POST",
      url: `${url}/games/play`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        gameID: gameID,
        playWith: PayType.coin,
      },
    })
      .then(({ data: { price } }: AxiosResponse<{ price: number }>) => {})
      .catch((err) => {})
      .finally(() => {
        setLoader(true);
      });
  } else {
  }
}

export async function isPlayable(
  loader: boolean,
  setLoader: (t: boolean) => void,
  price: number,
  game: Games,
  dispatch: (t: ActionType) => void,
  spec: {
    isOpen: boolean;
    manual: string;
    price: number;
    game: Games;
    next?: nextType;
  }
): Promise<boolean | errorType.error> {
  let token = await localStorage.getItem("game_token");
  if (loader) return;
  setLoader(true);
  await Axios({
    method: "GET",
    url: `${url}/games/check`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      price,
      gameID: game,
    },
  })
    .then(
      ({
        data: { isExiting, gamer_ },
      }: AxiosResponse<{
        isExiting: boolean;
        gamer_: {
          _id: string;
          gameMemberCount: number;
          members: string[];
          priceType: string;
          price_in_coin: number;
          price_in_value: number;
          gameType: string;
          gameDetail: string;
          gameID: Games;
          played: boolean;
          date: Date;
          playCount: number;
        };
        message: string;
      }>) => {
        if (game === Games.custom_game) {
          return false;
        }
        if (!isExiting) {
          setGameDetails(dispatch, {
            price: spec.price,
            player: PlayerType.first,
            id: undefined,
            game: spec.game,
          });
        } else {
          toast(dispatch, {msg: ""}).close()
          toast(dispatch, {msg: "This game has already been played, try searching for the game as player 2 to continue."}).fail()
        }
      }
    )
    .catch((error) => {
      console.log(error);
      toast(dispatch, {
        msg: `An Error occured could not connect to troisplay game server please check you interner connection and Try Again.`,
      }).error();
      return errorType.error;
        })
    .finally(() => {
      setLoader(false);
    });
}

export async function canSpin() {
  
} 

export function getToken(): string {
  const token = window.localStorage.getItem("game_token");
  return token;
}

export const usePayBill = async ({
  phone_number,
  amount,
  key,
  loading,
  setLoading,
  dispatch,
}:
  {
    dispatch: (t: ActionType) => void,
    phone_number: string,
    amount: number,
    key: string,
    setLoading: Dispatch<SetStateAction<boolean>>,
    loading: boolean;
  }): Promise<void> => {
  if (loading) return
  setLoading(true)
  await Axios.post(
    `${url}/bill/airtime`,
    { phone_number, amount, key },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  ).then(() => {
    console.timeStamp()
    toast(dispatch, {msg: ""}).close()
    toast(dispatch, {msg: `Airtime payment of ₦${amount} to ${phone_number.includes("+")? phone_number: `+${phone_number}`} was successful.`}).fail()
    console.timeEnd()
  }).catch((err) => {
    toast(dispatch, {msg: ""}).close()
    toast(dispatch, {msg: `Airtime payment of ₦${amount} to ${phone_number.includes("+")? phone_number: `+${phone_number}`} was unsuccessful, Please try again later.`}).error()
  }).finally(() => {
    console.timeStamp()
    setLoading(false)
    console.timeEnd()
  })
}