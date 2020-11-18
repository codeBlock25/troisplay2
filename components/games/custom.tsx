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
  Person,
  QuestionAnswer,
  Sports,
  Timer,
} from "@material-ui/icons";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { MyGamesAction, setGameDetails, toast } from "../../store/action";
import moment from "moment";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Axios, { AxiosResponse } from "axios";
import { url } from "../../constant";
import { ActionType, reducerType } from "../../typescript/interface";
import { getToken } from "../../functions";
import { Games, PlayerType } from "../../typescript/enum";
import { CloseIcon } from "../../icon";
import { isEmpty } from "lodash";
import { Dispatch } from "redux";

export enum choice {
  at_stated_timed,
  immediately,
}

export default function CustomGame(): JSX.Element {
  const dispatch: Dispatch<ActionType<any>> = useDispatch();
  const [player2Username, setPlayer2Username] = useState<string>("");
  const [player2Username_error, setPlayer2Username_error] = useState<boolean>(
    false
  );
  const [title, setTitle] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date>(
    new Date(moment().add("day", 1).format("DD-MMMM-YYYY"))
  );
  const [maxDate, setmaxDate] = useState<Date>(
    new Date(moment().add("day", 1).format("DD-MMMM-YYYY"))
  );
  const [endGameTime, setEndGameTime] = useState<Date>(new Date());
  const [choice_, setChoice] = useState<choice>(choice.at_stated_timed);
  /*
  
  */
  const { details } = useSelector<
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
  const theme = "dark-mode";
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let token = getToken();
    await Axios({
      method: "POST",
      url: `${url}/games/custom-game`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        player2Username,
        price_in_value: details.price,
        gameID: details.id,
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
            gameID?: Games;
            played?: boolean;
            date?: Date;
          };
        }>) => {
          MyGamesAction.add({dispatch, payload: game})
          setGameDetails(dispatch, {player: PlayerType.first, price: 0, id: "", game: Games.non})
          setDescription("");
          setTitle("");
          setAnswer("");
          setEndGameTime(new Date());
          setEndDate(new Date());
          setPlayer2Username("");
          toast(dispatch, {msg: "Congratulations!!!! You have successfully set you custom game, please wait for Player 2 provide his/her answer."}).success()
        }
      )
      .catch((err) => {
        if (err.message === "Request failed with status code 409") {
          setPlayer2Username_error(true);
          return;
        }
        if (err.message === "Request failed with status code 402") {
         toast(dispatch, { msg: "insufficient fund." }).fail();
         return;
        }
        toast(dispatch, {
          msg: "An error occured please recheck your connection and try again",
        }).error();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (details.game === Games.custom_game)
    return (
      <div
        className={`gameworld theme ${theme}`}
        onClick={(e: any) => {
          if (e.target.classList?.contains("gameworld")) {
            setGameDetails(dispatch, {
              player: PlayerType.first,
              game: Games.non,
              id: "",
              price: 0,
            });
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
          <div
            className="close_btn"
            onClick={() => {
              if (isEmpty(details.id)) {
                setGameDetails(dispatch, {
                  player: PlayerType.first,
                  game: Games.non,
                  id: undefined,
                  price: 0,
                });
                setLoading(false);
                setDescription("");
                setTitle("");
                setAnswer("");
                setEndGameTime(new Date());
                setEndDate(new Date());
                setPlayer2Username("");
                setPlayer2Username_error(false);
                return;
              }
            }}
          >
            <CloseIcon />
          </div>
          <h3 className="title">Set your game</h3>
          <form onSubmit={handleSubmit}>
            <TextField
              className={`inputBox theme ${theme}`}
              variant="outlined"
              value={player2Username}
              label="Player 2 username"
              placeholder="A troisplay player (Leave blank to make public)"
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
                label="Max Join Date"
                value={maxDate}
                onChange={(date) => {
                  setmaxDate(date);
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              {choice_ === choice.at_stated_timed && (
                <>
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
                      if (moment(date).isBefore(new Date())) {
                        toast(dispatch, {
                          msg: `The Games end date can't before the current day being ${moment().format(
                            "Do MMMM, yyyy"
                          )}. Please choose a further date to continue`,
                        }).fail();
                        return;
                      }
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
                      if (moment(date).isBefore(new Date())) {
                        toast(dispatch, {
                          msg: `The Games end date can't before the current day being ${moment().format(
                            "Do MMMM, yyyy"
                          )}. Please choose a further date to continue`,
                        }).fail();
                        return;
                      }
                      setEndGameTime(date);
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </>
              )}
            </MuiPickersUtilsProvider>
            <Button type="submit" className={`btn theme ${theme}`}>
              {loading ? <MoonLoader size="20px" color="white" /> : "set game"}
            </Button>
          </form>
        </div>
      </div>
    );
  else return <></>;
}
