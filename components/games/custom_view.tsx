import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import {
  Description,
  EventNote,
  People,
  Person,
  QuestionAnswer,
  Sports,
  Timer,
} from "@material-ui/icons";
import {
  ChangeEvent,
  FormEvent,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import {
  notify,
  setCashWalletCoin,
  setCustomeGameView,
  setGame,
  setGamepickerform,
  setMyGames,
  setSearchSpec,
  setWalletCoin,
} from "../../store/action";
import {
  eventReducerType,
  gameType,
  modalType,
  NotiErrorType,
} from "../../store/reducer/event";
import { initialStateType } from "../../store/reducer/initial";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Axios, { AxiosResponse } from "axios";
import { url } from "../../constant";
import { playerR } from "../gamepickerform";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { choice } from "./custom";
import { PayType } from "../gamepicker";

export default function Custom_Game_View(): JSX.Element {
  const dispatch = useDispatch();
  const [{ token }] = useCookies(["token"]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  /*
  
  */
  const { theme, defaults, gamer, cash, coin } = useSelector<
    {
      initial: initialStateType;
      event: eventReducerType;
    },
    {
      theme: string;
      defaults: {
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
      gamer: {
        isOpen: modalType;
        game?: {
          date: Date;
          gameDetail: string;
          gameID: gameType;
          gameMemberCount: number;
          gameType: string;
          members: string[];
          playCount: number;
          price_in_coin: number;
          price_in_value: number;
          _id: string;
          title: string;
          description: string;
          endDate: Date;
          endGameTime: Date;
          choice: choice;
        };
      };
      cash: number;
      coin: number;
    }
  >((state) => {
    return {
      theme: state.initial.theme,
      defaults: state.initial.defaults,
      gamer: state.event.custom_view,
      coin: state.initial.wallet.currentCoin,
      cash: state.initial.cashwallet.currentCash,
    };
  });
  const inputBox: MutableRefObject<HTMLInputElement> = useRef(null);
  const handleSubmit = async ({ payWith }: { payWith: PayType }) => {
    if (loading) return;
    if (answer === "") {
      return;
    }
    setLoading(true);
    await Axios({
      method: "PUT",
      url: `${url}/games/custom-game/challange`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        gameID: gamer?.game?._id ?? "",
        payWith,
        answer,
      },
    })
      .then(() => {
        if (gamer.game.choice === choice.at_stated_timed) {
          dispatch(
            notify({
              isOPen: modalType.open,
              msg:
                "Congratulations!!!! You have successfully joined the game will be able to set the winner on the set close date.",
              type: NotiErrorType.state,
            })
          );
        }
        if (payWith === PayType.cash) {
          dispatch(setCashWalletCoin(cash - gamer?.game?.price_in_value ?? 0));
        }
        if (payWith === PayType.coin) {
          dispatch(setWalletCoin(coin - gamer?.game?.price_in_coin ?? 0));
        }
      })
      .catch(() => {
        toast.error("Error occured");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getPrice = (cash: number): number => {
    switch (gamer?.game?.gameID ?? 0) {
      case gameType.roshambo:
        return defaults.commission_roshambo.value_in === "$"
          ? cash + (cash - defaults.commission_roshambo.value)
          : defaults.commission_roshambo.value_in === "c"
          ? cash +
            (cash - defaults.cashRating * defaults.commission_roshambo.value)
          : defaults.commission_roshambo.value_in === "%"
          ? cash + (cash - cash / defaults.commission_roshambo.value)
          : 0;

      case gameType.penalth_card:
        return defaults.commission_penalty.value_in === "$"
          ? cash + (cash - defaults.commission_penalty.value)
          : defaults.commission_penalty.value_in === "c"
          ? cash +
            (cash - defaults.cashRating * defaults.commission_penalty.value)
          : defaults.commission_penalty.value_in === "%"
          ? cash + (cash - cash / defaults.commission_penalty.value)
          : 0;
      case gameType.matcher:
        return defaults.commission_guess_mater.value_in === "$"
          ? cash + (cash - defaults.commission_guess_mater.value)
          : defaults.commission_guess_mater.value_in === "c"
          ? cash +
            (cash - defaults.cashRating * defaults.commission_guess_mater.value)
          : defaults.commission_guess_mater.value_in === "%"
          ? cash + (cash - cash / defaults.commission_guess_mater.value)
          : 0;
      case gameType.custom_game:
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
  };
  if (gamer.isOpen === modalType.open)
    return (
      <div
        className={`gameworld theme ${theme}`}
        onClick={(e: any) => {
          if (e.target.classList?.contains("gameworld")) {
            setAnswer("");
            dispatch(
              setCustomeGameView({ isOpen: modalType.close, game: null })
            );
          }
        }}
      >
        <div className="world spin custom view_game">
          <h3 className="title">{gamer?.game?.title ?? ""}</h3>
          <p className="txt">{gamer?.game?.description ?? ""}</p>
          <p className="txt">
            Stand a chance to win ${getPrice(gamer?.game?.price_in_value ?? 0)}
          </p>
          <form>
            <TextField
              className={`inputBox theme ${theme}`}
              required
              variant="outlined"
              label="Answer"
              placeholder="Your prediction to this event."
              value={answer}
              ref={inputBox}
              onChange={(
                e: ChangeEvent<{
                  value: string;
                }>
              ) => {
                setAnswer(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment className="icon_" position="start">
                    <QuestionAnswer />
                  </InputAdornment>
                ),
              }}
            />
            <div className="action_">
              <Button
                className={`btn theme ${theme}`}
                onClick={() => handleSubmit({ payWith: PayType.cash })}
              >
                {loading ? (
                  <MoonLoader size="20px" color="white" />
                ) : (
                  "accept & play witn cash"
                )}
              </Button>
              <Button
                className={`btn theme ${theme}`}
                onClick={() => handleSubmit({ payWith: PayType.coin })}
              >
                {loading ? (
                  <MoonLoader size="20px" color="white" />
                ) : (
                  "accept & play with coin"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  else return <></>;
}
