import { Fab } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { NextRouter, useRouter } from "next/router";
import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import openSocket from "socket.io-client";
import { socket_url } from "../../../constant";
import socketIO, { Socket } from "socket.io-client";
import { isEmpty, parseInt } from "lodash";
import { getToken } from "../../../functions";

export var socket: typeof Socket;

export enum exitReason {
  timeOut,
  wrongRoom,
  room_not_found,
  error,
  insufficient_fund,
}

const createMessageWindow = (msg: string): HTMLDivElement => {
  let msgWindow = document.createElement("div");
  msgWindow.classList.add("content");
  msgWindow.innerHTML = `
    <div class="message">
      <span class="from">Game Admin</span>
      ${msg}
    </div>`;
  return msgWindow;
};

export default function Index() {
  const { query, push, events }: NextRouter = useRouter();
  const messageContainer: MutableRefObject<
    HTMLDivElement | undefined
  > = useRef();
  const theme = "dark-mode"

  const load = useCallback(() => {
    socket = socketIO(socket_url);
    if (!isEmpty(query)) {
      socket.emit("joinRoom", {
        token: getToken(),
        room: query.room,
        payWith: parseInt(
          typeof query.payWith === "string" ? query.payWith : "0"
        ),
      });
      socket.on("out", ({ exit, reason }) => {
        // push("/dashboard/games")
        console.log(reason, "k");
      });
      socket.on("message", (msg: string) => {
        console.log(msg, "lll");
      });
      socket.on("game_message", (game_msg: any) => {
        console.log(game_msg, "lll");
      });
      socket.on("admin", (msg: string) => {
        console.log(msg);
        messageContainer.current.appendChild(createMessageWindow(msg));
      });
    }
  }, [query]);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <section className={`Game_Room_World ${theme}`}>
      <section className={`world ${theme}`}>
        <div className="head">
          <div className="title">{query.room} room</div>
        </div>
        <div className="message_center" ref={messageContainer} />
        <div className="action">
          <input type="text" placeholder="Enter text." className="inputBox" />
          <Fab className="send_btn">
            <Send />
          </Fab>
        </div>
      </section>
      <section className="game-panel">
        <div className="head">
          <h3 className="title">Game Panel</h3>
        </div>
        <div className="details">
          <div className="spec">
            <span>Room Name:</span> {query.room}
          </div>
          <div className="spec">
            <span>Players:</span>
          </div>
          <div className="spec">
            <span>Rejoin fee:</span>
          </div>
          <div className="spec">
            <span>Rejoin max time:</span>
          </div>
          <div className="spec">
            <span>Play right expiry date:</span>
          </div>
        </div>
      </section>
    </section>
  );
}
 