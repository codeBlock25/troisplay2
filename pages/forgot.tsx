import Head from "next/head";
import { TextField, InputAdornment, Button, Fab } from "@material-ui/core";
import {
  Call,
  Lock,
  LockTwoTone,
  PlayCircleFilledTwoTone,
  QuestionAnswer,
  VpnKey,
} from "@material-ui/icons";
import { FormEvent, useState } from "react";
import Link from "next/link";
import Axios from "axios";
import { url } from "../constant";
import { MoonLoader } from "react-spinners";
import { useRouter } from "next/router";
import { errorclasses, modalType, sectionClasses } from "../typescript/enum";
import { toast } from "../store/action";
import { useDispatch } from "react-redux";
import ToastContainer from "../components/toast";

export default function Forgot() {
  const dispatch = useDispatch()
  const [phone_number, setPhone_number] = useState("");
  const [answer, setanswer] = useState("");
  const [phone_number_error, setPhone_number_error] = useState<errorclasses>(
    errorclasses.okay
  );
  const [loading, setloading] = useState(false);
  const [section, setsection] = useState<sectionClasses>(
    sectionClasses.phone_record
  );
  const { push } = useRouter();
  const [recovery_question, setRecovery_question] = useState("");
  const [betting_key, setBetting_key] = useState("");
  const [confirmBetting_key, setconfirmBetting_key] = useState("");
  const [anserError, setanserError] = useState(false);
  const [updateToken, setToken] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (section === sectionClasses.phone_record) {
      if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(phone_number)) {
        setPhone_number_error(errorclasses.not_valid);
        return;
      }
      setloading(true);
      await Axios({
        method: "POST",
        url: `${url}/player/forgot`,
        data: {
          phone_number,
        },
      })
        .then(({ data: { content } }) => {
          setsection(sectionClasses.question_confirm);
          setRecovery_question(content.recovery_question);
        })
        .catch((err) => {
          if (err.message === "Request failed with status code 403") {
            setPhone_number_error(errorclasses.not_found);
            return;
          }
          if (err.message === "Request failed with status code 401") {
            setPhone_number_error(errorclasses.not_registered);
            return;
          }
          toast(dispatch, {
            msg: "Opp's an error occured",
          }).error();
        })
        .finally(() => {
          setloading(false);
        });
    } else if (section === sectionClasses.question_confirm) {
      if (answer === "") return;
      setloading(true);
      await Axios({
        method: "POST",
        url: `${url}/player/forgot/confirm`,
        data: {
          phone_number,
          answer,
        },
      })
        .then(({ data: { token } }) => {
          setToken(token);
          setsection(sectionClasses.setter_key);
        })
        .catch((err) => {
          if (err.message === "Request failed with status code 403") {
            setanserError(true);
            return;
          }
          toast(dispatch, {
            msg: "Opp's an error occured",
          }).error();
        })
        .finally(() => {
          setloading(false);
        });
    } else {
      if (betting_key !== confirmBetting_key) return;
      setloading(true);
      await Axios({
        method: "POST",
        url: `${url}/player/forgot/update`,
        data: {
          betting_key,
        },
        headers: {
          authorization: `Bearer ${updateToken}`,
        },
      })
        .then(() => {
          toast(dispatch, {
            msg: "Successfull",
          }).success();
          setTimeout(() => {
            push("/login");
          }, 1000);
        })
        .catch((err) => {
          if (err.message === "Request failed with status code 403") {
            setanserError(true);
            return;
          }
          toast(dispatch, {
            msg: "Opp's an error occured",
          }).error();
        })
        .finally(() => {
          setloading(false);
        });
    }
  };
  return (
    <section className="account forgot">
      <ToastContainer />
      <Head>
        <title>Troisplay :: Login</title>
      </Head>
      <header>
        <Link href="/">
          <a className="title">Troisplay</a>
        </Link>
      </header>
      <div className="left">
        <div className="content">
          <h3 className="title">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
            quibusdam.
          </h3>
          <Fab variant="extended" className="btn_">
            learn more <PlayCircleFilledTwoTone />
          </Fab>
        </div>
      </div>
      <div className="right">
        <div className="head">
          <LockTwoTone />
          <div className="main_txt">
            forgot your password no worries, let's help you get a new password
          </div>
          <div className="sub_txt">
            To update your details(betting key) without logining on Troisplay
            requires a few information like your phone number a valid answer to
            your recovery question and a Troisplay platform, web or mobile.
          </div>
        </div>{" "}
        <form className="form" onSubmit={handleSubmit}>
          {section === sectionClasses.phone_record ? (
            <TextField
              className="inputBox"
              variant="outlined"
              label="Phone Number"
              required
              value={phone_number}
              error={phone_number_error !== errorclasses.okay}
              helperText={
                phone_number_error === errorclasses.not_found
                  ? "This number is not registered with any user."
                  : phone_number_error === errorclasses.not_registered
                  ? "This account has not being completely setup,  consider creating a new one if you can't remember your details."
                  : phone_number_error === errorclasses.not_valid
                  ? "Invalid number NOTE: country code must be included."
                  : ""
              }
              onChange={(e) => {
                if (phone_number_error !== errorclasses.okay) {
                  setPhone_number_error(errorclasses.okay);
                }
                setPhone_number(e.target.value);
              }}
              placeholder="country code included"
              InputProps={{
                startAdornment: (
                  <InputAdornment className="icon_" position="start">
                    <Call />
                  </InputAdornment>
                ),
              }}
            />
          ) : section === sectionClasses.question_confirm ? (
            <>
              <p className="txt">{recovery_question}</p>
              <TextField
                className="inputBox"
                variant="outlined"
                label="Answer"
                required
                value={answer}
                onChange={(e) => {
                  setanswer(e.target.value);
                }}
                placeholder="same as was given during setup."
                InputProps={{
                  startAdornment: (
                    <InputAdornment className="icon_" position="start">
                      <QuestionAnswer />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : section === sectionClasses.setter_key ? (
            <>
              <TextField
                className="inputBox"
                variant="outlined"
                label="New betting kay "
                required
                type="password"
                value={betting_key}
                error={betting_key.length !== 6}
                helperText={
                  betting_key.length !== 6
                    ? "Your key should be 6 digits long."
                    : ""
                }
                onChange={(e) => {
                  if (
                    /^[0-9]*$/g.test(e.target.value) &&
                    e.target.value.length < 7
                  ) {
                    setBetting_key(e.target.value);
                  } else {
                    setBetting_key(betting_key.substr(0, 6));
                  }
                }}
                placeholder="SECRET"
                InputProps={{
                  startAdornment: (
                    <InputAdornment className="icon_" position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                className="inputBox"
                variant="outlined"
                label="Phone Number"
                required
                value={confirmBetting_key}
                error={confirmBetting_key !== betting_key}
                onChange={(e) => {
                  setconfirmBetting_key(e.target.value);
                }}
                helperText={
                  confirmBetting_key !== betting_key
                    ? "The keys don't match"
                    : ""
                }
                placeholder="SECRET."
                InputProps={{
                  startAdornment: (
                    <InputAdornment className="icon_" position="start">
                      <LockTwoTone />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <></>
          )}
          <Button type="submit" className="btn">
            {loading ? <MoonLoader color="white" /> : "submit"}
          </Button>
          <p className="link">
            Just remembered your details?
            <Link href="/login">
              <a>login here</a>
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
