import React from "react";
import { MoonLoader } from "react-spinners";

export default function AppLoader({ runText }: { runText: string }) {
  return (
    <section className="AppLoader">
      <div className="container">
        <div className="logo" />
        <p className="txt">{runText}</p>
        <div className="loader">
          <MoonLoader size="30px" color="#2196f3" />
        </div>
      </div>
    </section>
  );
}
