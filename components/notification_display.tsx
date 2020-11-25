import React, { memo } from "react";
import moment from "moment";
import { notificationHintType } from "../typescript/enum";

const NotificationDisplay = memo(function ({
  msg,
  date,
  type,
}: {
  type: notificationHintType;
  msg: string;
  date: Date;
}) {
  return (
    <div className="notification_display">
      <div
        className="bubble"
        style={{
          backgroundColor: `${
            type === notificationHintType.win
              ? "green"
              : type === notificationHintType.lost
              ? "red"
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

// export enum notificationHintType {
//   withdraw, // orange
//   fund, // blue
//   lost, // red
//   win, // green
//   draw, // yellow
// }
