import "../styles/globals.scss";
import "../styles/home.scss";
import "../styles/account.scss";
import "../styles/games.scss";
import "../styles/gameworld.scss";
import "../styles/notification.scss";
import "../styles/apploading.scss";
import "../styles/forgot.scss";
import "../styles/launch.scss";
import "../styles/exit.scss";
import "../styles/history.scss";
import "../styles/get-coin.scss";
import "../styles/toast.scss";
import { Provider as ReduxProvider } from "react-redux";
import { AppProps } from "next/app";
import store from "../store";
import { QueryCache, ReactQueryCacheProvider } from "react-query";

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ReduxProvider store={store}>
        <Component {...pageProps} />
      </ReduxProvider>
    </ReactQueryCacheProvider>
  );
}

export default MyApp;
