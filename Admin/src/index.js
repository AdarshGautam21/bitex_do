import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logout, getLoginUserRole} from './store/auth/actions';
import store from "./store"
// Check for token
if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(getLoginUserRole(decoded?.roles?.[0]?._id));
  const currentTime = Math.floor(Date.now() / 1000);
  if(currentTime > decoded.exp) {
    store.dispatch(logout());
  }
}

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
