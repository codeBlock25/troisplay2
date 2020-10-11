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
import Head from "next/head";

export var socket: typeof Socket;

export enum exitReason {
  timeOut,
  wrongRoom,
  room_not_found,
  error,
  insufficient_fund,
}

export enum fromType {
  me,
  server,
  people
}


const createMessageWindow = (msg: string, author: string, from: fromType ): HTMLDivElement => {
  let msgWindow = document.createElement("div");
  msgWindow.classList.add("content");
  msgWindow.innerHTML = `
    <div class=${from === fromType.server? "message":"message me"}>
      <span class="from">${author}</span>
      ${msg}
    </div>`;
  return msgWindow;
};

export default function Index() {
  const { query, push, events,beforePopState }: NextRouter = useRouter();
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
        messageContainer.current.appendChild(createMessageWindow(reason, "Game Police", fromType.people));
        setTimeout(() => {
          push("/games")
        }, 5000);
      });
      socket.on("message", (obj: {msg: string, author: string}) => {
        messageContainer.current.appendChild(createMessageWindow(obj.msg, obj.author, fromType.people));
      });
      socket.on("game_message", (msg: any) => {
        messageContainer.current.appendChild(createMessageWindow(msg, "Room Question", fromType.server));
      });
      socket.on("admin", (msg: string) => {
        console.log(msg);
        messageContainer.current.appendChild(createMessageWindow(msg, "Game Admin", fromType.server));
      });
    }
  }, [query]);
  
  useEffect(() => {
    beforePopState(({ url, as, options }) => {
      alert("Leaving this room will not pause you Room time or Game are you sure you want to leave?.")
      return false
    })
  }, [])
  useEffect(() => {
    load();
  }, [load]);
  return (
    <>
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
    </>
  );
}
 