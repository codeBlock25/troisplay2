import React, {
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../store/action";
import { CloseIcon, CupIcon, RefereeIcon, RefereeWarnIcon } from "../icon";
import { reducerType } from "../typescript/interface";
import { modalType, NotiErrorType } from "../typescript/enum";

const Notification = memo(function () {
  const audio1: MutableRefObject<HTMLAudioElement> = useRef(null);
  const audio2: MutableRefObject<HTMLAudioElement> = useRef(null);
  const dispatch = useDispatch();
  const { notification, theme } = useSelector<
    reducerType,
    {
      notification: { isOpen: modalType; type: NotiErrorType; msg: string };
      theme: string;
    }
  >((state) => {
    return {
      notification: state.event.notification,
      theme: "dark-mode",
    };
  });
  useEffect(() => {
    try {
      if (notification.type === NotiErrorType.success) {
        audio2.current.play();
      } else if (notification.type !== NotiErrorType.ok) {
        audio1.current.play();
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }, [notification]);
  const load = useCallback(() => {
    audio1.current.addEventListener("error", (error) => {
      console.log(error);
    });
    audio2.current.addEventListener("error", (error) => {
      console.log(error);
    });
    return () => {
      audio1.current.removeEventListener("error", () => {
        console.log("removed");
      });
      audio2.current.removeEventListener("error", () => {
        console.log("removed");
      });
    };
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <div
      className={`Notifiaction ${
        notification.isOpen !== modalType.close && "open"
      } ${theme} ${
        notification.type === NotiErrorType.success
          ? "success"
          : notification.type === NotiErrorType.state
          ? "state"
          : notification.type === NotiErrorType.error
          ? "error"
          : notification.type === NotiErrorType.warning
          ? "warning"
          : ""
      }`}
    >
      <div className="container">
        <audio
          controls
          className="audio"
          preload="auto"
          autoPlay
          muted
          ref={audio1}
        >
          <source src="/audio/noti.mp3" />
        </audio>
        <audio
          controls
          className="audio"
          preload="auto"
          autoPlay
          muted
          ref={audio2}
        >
          <source src="/audio/win.mp3" />
        </audio>
        <span className="icon">
          {notification.type === NotiErrorType.success ? (
            <CupIcon />
          ) : notification.type === NotiErrorType.state ? (
            <RefereeIcon />
          ) : notification.type === NotiErrorType.error ? (
            <RefereeWarnIcon />
          ) : notification.type === NotiErrorType.warning ? (
            <RefereeWarnIcon />
          ) : (
            <></>
          )}
        </span>
        <p className="txt">{notification.msg}</p>
        <div
          className="close_btn"
          onClick={() => {
            notify(dispatch, {
              ...notification,
              isOpen: modalType.close,
              type: NotiErrorType.non,
            });
          }}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  );
});

export default Notification;
