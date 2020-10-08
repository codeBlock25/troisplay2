import Axios, { AxiosResponse } from "axios";
import { url } from "../constant";
import { nextType } from "../pages/games";
import { errorType } from "../pages/signup";
import { setGameDetails } from "../store/action";
import { Games, PayType, PlayerType } from "../typescript/enum";
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
        }
      }
    )
    .catch((error) => {
      console.log(error);
      return errorType.error;
    })
    .finally(() => {
      setLoader(false);
    });
}
