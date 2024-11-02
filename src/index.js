import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";

import App from "./App";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <Router>
      <UserProvider>
      <App />
      </UserProvider>
   </Router>,
  );


// ReactDOM.render(
//  <Router>
//     <App />
//  </Router>,
//  document.getElementById('root')
// );
