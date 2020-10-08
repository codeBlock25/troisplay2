import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../icon";
import { toast } from "../store/action";
import { errorType, modalType } from "../typescript/enum";
import { reducerType } from "../typescript/interface";

export default function ToastContainer() {
  const dispatch = useDispatch();
  const [gone, setGone] = useState(false);
  const [pause, setPause] = useState(false);
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
        <span />
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
