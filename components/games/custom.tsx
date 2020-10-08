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
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import {
  notify,
  setCashWalletCoin,
  setGame,
  setGamepickerform,
  setMyGames,
  setSearchSpec,
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
import { IniReducerType } from "../panel";
import { playerR } from "../gamepickerform";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

export enum choice {
  at_stated_timed,
  immediately,
}

export default function Custom_Game(): JSX.Element {
  const dispatch = useDispatch();
  const [{ token }] = useCookies(["token"]);
  const [player2Username, setPlayer2Username] = useState<string>("");
  const [player2Username_error, setPlayer2Username_error] = useState<boolean>(
    false
  );
  const [title, setTitle] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endGameTime, setEndGameTime] = useState<Date>(new Date());
  const [choice_, setChoice] = useState<choice>(choice.at_stated_timed);
  /*
  
  */
  const {
    theme,
    game,
    gameID,
    price,
    coin,
    cash,
    games,
    GameID,
    player,
  } = useSelector<
    {
      initial: initialStateType;
      event: eventReducerType;
    },
    {
      theme: string;
      game: gameType;
      gameID: string;
      price: number;
      coin: number;
      cash: number;
      GameID: gameType;
      games: {
        _id?: string;
        gameMemberCount?: number;
        members?: string[];
        priceType?: string;
        price_in_coin?: number;
        price_in_value?: number;
        gameType?: string;
        gameDetail?: string;
        gameID?: gameType;
        played?: boolean;
        date?: Date;
      }[];
      player: playerR;
    }
  >((state) => {
    return {
      theme: state.initial.theme,
      game: state.event.game,
      gameID: state.event.gameID,
      price: state.event.searchspec.price,
      coin: state.initial.wallet.currentCoin,
      cash: state.initial.cashwallet.currentCash,
      games: state.initial.my_games,
      GameID: state.event.p2games.gameID,
      player: state.event.play_as,
    };
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await Axios({
      method: "POST",
      url: `${url}/games/custom-game`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        player2Username,
        price_in_value: price,
        gameID,
        title,
        description,
        answer,
        endDate,
        endGameTime,
        choice: choice_,
      },
    })
      .then(
        ({
          data: { game },
        }: AxiosResponse<{
          game: {
            _id?: string;
            gameMemberCount?: number;
            members?: string[];
            priceType?: string;
            price_in_coin?: number;
            price_in_value?: number;
            gameType?: string;
            gameDetail?: string;
            gameID?: gameType;
            played?: boolean;
            date?: Date;
          };
        }>) => {
          dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
          dispatch(setGame(gameType.non, ""));
          dispatch(setGamepickerform(modalType.close));
          dispatch(setMyGames([game, ...games]));
          dispatch(setCashWalletCoin(cash - price));
          setDescription("");
          setTitle("");
          setAnswer("");
          setEndGameTime(new Date());
          setEndDate(new Date());
          setPlayer2Username("");
          dispatch(
            notify({
              isOPen: modalType.open,
              msg:
                "Congratulations!!!! You have successfully set you custom game, please wait for Player 2 provide his/her answer.",
              type: NotiErrorType.success,
            })
          );
        }
      )
      .catch((err) => {
        if (err.message === "Request failed with status code 409") {
          setPlayer2Username_error(true);
          return;
        }
        setDescription("");
        setTitle("");
        setAnswer("");
        setEndGameTime(new Date());
        setEndDate(new Date());
        setPlayer2Username("");
        if (err.message === "Request failed with status code 402") {
          dispatch(setSearchSpec({ game: gameType.non, price: 0 }));
          dispatch(setGame(gameType.non, ""));
          dispatch(setGamepickerform(modalType.close));
          if (window.innerWidth < 650) {
            toast.dark("Insufficient Fund", { position: "bottom-right" });
          } else {
            toast.dark("Insufficient Fund");
          }
          return;
        }
        if (window.innerWidth < 650) {
          toast.error(
            "An error occured please recheck your connection and try again",
            { position: "bottom-right" }
          );
        } else {
          toast.error(
            "An error occured please recheck your connection and try again"
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (game === gameType.custom_game)
    return (
      <div
        className={`gameworld theme ${theme}`}
        onClick={(e: any) => {
          if (e.target.classList?.contains("gameworld")) {
            dispatch(setGame(gameType.non, ""));
            setDescription("");
            setTitle("");
            setAnswer("");
            setEndGameTime(new Date());
            setEndDate(new Date());
            setPlayer2Username("");
          }
        }}
      >
        <div className="world spin custom">
          <h3 className="title">Set your game</h3>
          <form onSubmit={handleSubmit}>
            <TextField
              className={`inputBox theme ${theme}`}
              required
              variant="outlined"
              value={player2Username}
              label="Player 2 username"
              placeholder="A troisplay player"
              error={player2Username_error}
              helperText={
                player2Username_error ? "Invalid Player username" : ""
              }
              onChange={(
                e: ChangeEvent<{
                  value: string;
                }>
              ) => {
                if (player2Username_error) {
                  setPlayer2Username_error(false);
                }
                setPlayer2Username(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment className="icon_" position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={`inputBox theme ${theme}`}
              required
              variant="outlined"
              value={title}
              label="Title"
              placeholder="Game Name"
              onChange={(
                e: ChangeEvent<{
                  value: string;
                }>
              ) => {
                setTitle(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment className="icon_" position="start">
                    <Sports />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={`inputBox theme ${theme}`}
              required
              variant="outlined"
              label="Description"
              value={description}
              placeholder="About the game in question."
              onChange={(
                e: ChangeEvent<{
                  value: string;
                }>
              ) => {
                setDescription(e.target.value);
              }}
              rowsMax={6}
              multiline
              InputProps={{
                startAdornment: (
                  <InputAdornment className="icon_" position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={`inputBox theme ${theme}`}
              required
              variant="outlined"
              label="Answer"
              placeholder="Your prediction to this event."
              value={answer}
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
            <FormControl
              variant="outlined"
              className={`inputBox theme ${theme}`}
              required
            >
              <InputLabel>Time to judge</InputLabel>
              <Select
                onChange={(e: ChangeEvent<{ value: unknown }>) => {
                  setChoice(e.target.value as choice);
                }}
                value={choice_}
              >
                <MenuItem value={choice.at_stated_timed}>
                  At stated Date
                </MenuItem>
                <MenuItem value={choice.immediately}>immediately</MenuItem>
              </Select>
            </FormControl>
            {choice_ === choice.at_stated_timed && (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  required
                  inputVariant="outlined"
                  className={`inputBox theme ${theme}`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment className="icon_" position="start">
                        <EventNote />
                      </InputAdornment>
                    ),
                  }}
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="game-end-date"
                  label="Game End Date"
                  value={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />

                <KeyboardTimePicker
                  margin="normal"
                  id="game-end-time"
                  inputVariant="outlined"
                  label="Game End Time"
                  variant="dialog"
                  className={`inputBox theme ${theme}`}
                  value={endGameTime}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment className="icon_" position="start">
                        <Timer />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(date) => {
                    setEndGameTime(date);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                />
              </MuiPickersUtilsProvider>
            )}
            <Button type="submit" className={`btn theme ${theme}`}>
              {loading ? <MoonLoader size="20px" color="white" /> : "set game"}
            </Button>
          </form>
        </div>
      </div>
    );
  else return <></>;
}
