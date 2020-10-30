import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { FormEvent, useEffect, useState } from "react";
import {
  AccountBalance,
  Dialpad,
  LiveHelp,
  LocationOn,
  Mail,
  Person,
  QuestionAnswer,
} from "@material-ui/icons";
import ImagePicker from "../functions/imagepicker";
import Head from "next/head";
import FormMake from "form-data";
import Axios from "axios";
import { banks, url } from "../constant";
import { ScaleLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getToken } from "../functions";
import { toast } from "../store/action";
import { modalType } from "../typescript/enum";
import AppLoader from "../components/app_loader";
import ToastContainer from "../components/toast";

export default function Launch() {
  const [playername, setPlayername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bank_name, setBank_name] = useState<string>("");
  const [account_number, setAccount_number] = useState<string>("");
  const [recovery_question, setRecovery_question] = useState<string>("");
  const [recovery_answer, setRecovery_answer] = useState<string>("");
  const [policy, setPolicy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [playername_error, setPlayername_error] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [contentLoading, setContentLoading] = useState<boolean>(true);

  useEffect(() => {
    let old = localStorage.getItem("gamer");
    if (old === "old") {
      push("/login");
      return;
    }
    setContentLoading(false);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const token = getToken();
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    let data = new FormMake();
    let input_: HTMLInputElement | null = document.querySelector(
      "input[type='file']"
    );
    data.append("profile-pic", input_?.files ? input_.files[0] : "");
    data.append("playername", playername);
    data.append("email", email);
    data.append("location", location);
    data.append("bank_name", bank_name);
    data.append("account_number", account_number);
    data.append("recovery_question", recovery_question);
    data.append("recovery_answer", recovery_answer);
    await Axios({
      method: "POST",
      url: `${url}/player/new`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data,
    })
      .then(({ data: { player } }) => {
        localStorage.setItem("gamer", "old");
        toast(dispatch, {
          msg:
            "Thanks for completing your profile, fund your account to play your first game. Great things await you!",
        }).success();
        setTimeout(() => {
          window.location.assign("/games");
        }, 4000);
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 400") {
          setPlayername_error(true);
        }
        if (err.message === "Request failed with status code 402") {
          push("/login");
        }
        toast(dispatch, {
          msg: "Opp's an error occured.",
        }).error();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (contentLoading)
    return (
      <>
        <Head>
          <title>Player setup :: Troisplay</title>
        </Head>
        <AppLoader runText="" />
      </>
    );
  return (
    <div className="Setup">
      <ToastContainer />
      <Head>
        <title>Player setup :: Troisplay</title>
      </Head>
      <header>
        <div className="title">Game SetUP.</div>
      </header>
      <div className="first">
        <form className="filling" onSubmit={handleSubmit}>
          <ImagePicker />
          <TextField
            placeholder="@trois will prefix this name."
            label="User name"
            variant="outlined"
            type="text"
            required
            error={playername_error}
            helperText={playername_error ? "This name is already used." : ""}
            value={playername}
            onChange={(e) => {
              if (playername_error) {
                setPlayername_error(false);
              }
              setPlayername(e.target.value);
            }}
            id="playname"
            className="inputBox dark-mode"
            InputProps={{
              startAdornment: (
                <InputAdornment className="icon_" position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="You will be notified through this mail."
            label="Email"
            variant="outlined"
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="inputBox dark-mode"
            InputProps={{
              startAdornment: (
                <InputAdornment className="icon_" position="start">
                  <Mail />
                </InputAdornment>
              ),
            }}
          />
          <FormControl className="inputBox dark-mode" required>
            <InputLabel htmlFor="bank name">Bank Name</InputLabel>
            <Select
              variant="outlined"
              inputProps={{ id: "bank name" }}
              value={bank_name}
              onChange={(e) => {
                setBank_name(e.target.value as string);
              }}
            >
              {banks.map((bank) => {
                return (
                  <MenuItem key={bank.id} value={bank.code}>
                    {bank.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            placeholder="Your funds will be placed with this account."
            label="Account Number"
            variant="outlined"
            type="text"
            id="account_number"
            required
            value={account_number}
            onChange={(e) => {
              if (!/^[0-9]*$/g.test(e.target.value)) return;
              setAccount_number(e.target.value);
            }}
            className="inputBox dark-mode"
            InputProps={{
              startAdornment: (
                <InputAdornment className="icon_" position="start">
                  <Dialpad />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="This will be used to pass security test."
            label="Recovery Question"
            variant="outlined"
            type="text"
            id="recovery_question"
            required
            value={recovery_question}
            onChange={(e) => {
              setRecovery_question(e.target.value);
            }}
            className="inputBox dark-mode"
            InputProps={{
              startAdornment: (
                <InputAdornment className="icon_" position="start">
                  <LiveHelp />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="This will be used to pass security test."
            label="Recovery Answer"
            variant="outlined"
            type="text"
            id="recovery_answer"
            required
            value={recovery_answer}
            onChange={(e) => {
              setRecovery_answer(e.target.value);
            }}
            className="inputBox dark-mode"
            InputProps={{
              startAdornment: (
                <InputAdornment className="icon_" position="start">
                  <QuestionAnswer />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="State, Country."
            label="Location"
            variant="outlined"
            type="text"
            id="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            className="inputBox dark-mode"
            InputProps={{
              startAdornment: (
                <InputAdornment className="icon_" position="start">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            className="policy dark-mode"
            control={
              <Checkbox
                checked={policy}
                required
                onChange={(e) => {
                  setPolicy(e.target.checked);
                }}
                name="policy"
                color="primary"
              />
            }
            label="By filling this you here by confirm the terms & conditions set by Troisplay"
          />
          <Button className="btn_ dark-mode" type="submit">
            {loading ? <ScaleLoader color="white" /> : "save"}
          </Button>
        </form>
      </div>
    </div>
  );
}
