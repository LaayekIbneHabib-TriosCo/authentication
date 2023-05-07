import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import ResetPassword from "./routes/ResetPassword";
import App from "./App";
import "./main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="dashboard" element={<App />} />
        <Route path="*" element={<h1>Route does not exist</h1>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
