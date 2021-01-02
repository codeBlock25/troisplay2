import React, { memo } from "react";
import moment from "moment";
import { notificationHintType } from "../typescript/enum";
import { NewIcon } from "../icon";
import Axios from "axios";
import { url } from "../constant";
import { getToken } from "../functions";
import { NotificationAction } from "../store/action";
import { useDispatch } from "react-redux";

const NotificationDisplay = memo(function ({
  msg,
  date,
  type,
  hasSeen,
  notifications,
}: {
  type: notificationHintType;
  msg: string;
  date: Date;
  hasSeen: boolean;
  notifications: {
    message: string;
    time: Date;
    type: notificationHintType;
    hasNew: boolean;
  }[];
}) {
  const dispatch = useDispatch();
  return (
    <div className="notification_display">
      <div
        className="bubble"
        style={{
          backgroundColor: `${
            type === notificationHintType.win
              ? "green"
              : type === notificationHintType.lost
              ? "blue"
              : type === notificationHintType.draw
              ? "yellow"
              : type === notificationHintType.withdraw
              ? "orange"
              : "blue"
          }`,
        }}
      />
      <div className="notification_message">{msg}</div>
      <div className="notification_date">
        {moment(date).format("Do MMMM, YYYY - hh:mm a")}
      </div>
    </div>
  );
});

export default NotificationDisplay;
