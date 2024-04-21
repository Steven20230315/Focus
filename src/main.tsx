import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import GlobalStyles from "./GlobalStyles.ts";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <GlobalStyles /> */}

      <App />
    </Provider>
  </React.StrictMode>,
);
