import Lottie from "lottie-web";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../icon";
import { toast } from "../store/action";
import { errorType, modalType } from "../typescript/enum";
import { reducerType } from "../typescript/interface";

const ToastContainer = memo( function () {
  const dispatch = useDispatch();
  const [gone, setGone] = useState(false);
  const [pause, setPause] = useState(false);
  const successCon = useRef()
  const errorCon = useRef()
  const failCon = useRef()
  const infoCon = useRef()

  const loadLottie = useCallback(
    () => {
      Lottie.loadAnimation({
        container: successCon.current,
        renderer: "svg",
        autoplay: true,
        loop: true,
        animationData: require("../lottie/success.json")
      })
      Lottie.loadAnimation({
        container: errorCon.current,
        renderer: "svg",
        autoplay: true,
        loop: true,
        animationData: require("../lottie/error.json")
      })
      Lottie.loadAnimation({
        container: infoCon.current,
        renderer: "svg",
        autoplay: true,
        loop: true,
        animationData: require("../lottie/info.json")
      })
      Lottie.loadAnimation({
        container: failCon.current,
        renderer: "svg",
        autoplay: true,
        loop: true,
        animationData: require("../lottie/fail.json")
      })
    },
    [],
  )
  useEffect(() => {
    loadLottie()
}, [loadLottie])
  const { toastData } = useSelector<
    reducerType,
    {
      toastData: {
        isOpen: modalType;
        msg: string;
        error: errorType;
      };
    }
  >((state) => {
    return {
      toastData: state.event.toastNotification,
    };
  });
  useEffect(() => {
    if (toastData.isOpen === modalType.open) {
      setTimeout(() => {
        setGone(true);
        if (pause) {
          return;
        }
        toast(dispatch, { ...toastData }).close();
      }, 6000);
    }
    return () => {};
  }, [toastData]);
  return (
    <div
      className={`toastContainer ${
        toastData.isOpen === modalType.open ? "open" : ""
      }`}
      onMouseEnter={() => {
        setPause(true);
      }}
      onMouseLeave={() => {
        setPause(false);
        if (gone) {
          setTimeout(() => {
            toast(dispatch, { ...toastData }).close();
          }, 1500);
        }
      }}
    >
      <div className="icon">
        <span
          ref={successCon}
          className={`${toastData.error === errorType.success && "on"}`}
        />
        <span
          ref={errorCon}
          className={`${toastData.error === errorType.error && "on"}`}
        />
        <span
          ref={infoCon}
          className={`${toastData.error === errorType.warning && "on"}`}
        />
        <span
          ref={failCon}
          className={`${toastData.error === errorType.fail && "on"}`}
        />
      </div>
      <p className="msg">{toastData.msg}</p>
      <div
        className="close"
        onClick={() => toast(dispatch, { ...toastData }).close()}
      >
        <CloseIcon />
      </div>
    </div>
  );
}
);
export default ToastContainer