import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ipcRenderer } from "electron";

import store from "./store";
import * as PreloaderActions from "./store/preloader/actions";
import * as MainActions from "./store/main/actions";
import axios from "./services/axios";
import Preloader from "./components/Preloader/Preloader";

import AuthService from "./services/AuthService";
import { authProtectedRoutes } from "./routes/";
import ElectronModal from "./ElectronModal";

const preloader = (
  <Provider store={store}>
    <Preloader />
  </Provider>
);

store.dispatch(PreloaderActions.showPreloader("APP_LOADING"));
ipcRenderer.send("onSysInfo");
ReactDOM.render(preloader, document.getElementById("root"));

const pathname = document.location.pathname.split("/").splice(1);

if (pathname[0] === "modal") {
  if (pathname[1]) {
    ipcRenderer.on("onSysInfo", (event, args) => {
      const route = authProtectedRoutes.find(
        (x) => x.path === document.location.pathname
      );

      if (route) {
        store.dispatch(MainActions.setSystemInfo(args));

        const activeHost = ipcRenderer.sendSync("onActiveHost", {});
        axios.defaults.baseURL = activeHost ? activeHost.host : null;

        if (axios.defaults.baseURL === null) {
          AuthService.removeAuthHash();
        }

        store.dispatch(MainActions.setHostInfo(activeHost));

        ReactDOM.render(
          <>
            <Provider store={store}>
              <ElectronModal route={route}/>
            </Provider>
          </>,
          document.getElementById("root")
        );
        serviceWorker.unregister();
      }
      serviceWorker.unregister();

      store.dispatch(PreloaderActions.hidePreloader("APP_LOADING"));
    });
  }
} else {
  const app = (
    <Provider store={store}>
      <Preloader />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  ipcRenderer.on("onSysInfo", (event, args) => {
    store.dispatch(MainActions.setSystemInfo(args));

    const activeHost = ipcRenderer.sendSync("onActiveHost", {});
    axios.defaults.baseURL = activeHost ? activeHost.host : null;

    if (axios.defaults.baseURL === null) {
      AuthService.removeAuthHash();
    }

    store.dispatch(MainActions.setHostInfo(activeHost));

    ReactDOM.render(app, document.getElementById("root"));
    serviceWorker.unregister();

    store.dispatch(PreloaderActions.hidePreloader("APP_LOADING"));
  });

  ipcRenderer.on("onHostsChange", (event, args) => {
    const activeHost = ipcRenderer.sendSync("onActiveHost", {});
    axios.defaults.baseURL = activeHost ? activeHost.host : null;
    ipcRenderer.send("reloadWindow", {});
  });
}
