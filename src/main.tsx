import React from "react";
import ReactDOM from "react-dom/client";
import {version as antdVersion} from "antd/package.json";
import App from "./App";
import "./style.css";

console.debug("Ant Design version:", antdVersion);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
