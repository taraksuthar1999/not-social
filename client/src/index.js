import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Home from "./components/Home";
import store from "./store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ModalProvider } from "./contexts/context";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode> 
      <ModalProvider>
        <App />
      </ModalProvider>
    </React.StrictMode>
  </Provider>
);
reportWebVitals();
