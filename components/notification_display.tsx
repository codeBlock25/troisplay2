import React, { memo } from "react";
import moment from "moment";

const NotificationDisplay = memo(function ({
  msg,
  date,
}: {
  msg: string;
  date: Date;
}) {
  return (
    <div className="notification_display">
      <div className="bubble" />
      <div className="notification_message">{msg}</div>
      <div className="notification_date">
        {moment(date).format("Do MMMM, YYYY - hh:mm a")}
      </div>
    </div>
  );
});

export default NotificationDisplay;
