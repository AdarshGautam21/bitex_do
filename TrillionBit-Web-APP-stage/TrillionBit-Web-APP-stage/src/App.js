import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";
import { Provider } from "react-redux";

import ReactGA from "react-ga";

import store from "./store";

import Navbar from "./components/layout/Navbar";
import MainNav from "./components/layout/MainNav";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, getCurrentUser } from "./actions/authActions";

import PrivateRoute from "./common/PrivateRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import EmailVerification from "./components/auth/EmailVerification";
import DocumentVerification from "./components/user/DocumentVerification";
import Fees from "./components/auth/Fees";
import Press from "./components/auth/Press";
import BtxCoin from "./components/auth/BtxCoin";
import Referral from "./components/auth/Referral";
import TermsOfService from "./components/auth/TermsOfService";
import TrustAndSecurity from "./components/auth/TrustAndSecurity";
import About from "./components/auth/About";

import Dashboard from "./components/dashboard/Dashboard";
import UserProfile from "./components/user/UserProfile";
import UserWallet from "./components/user/UserWallet";
import UserOrder from "./components/user/UserOrder";
import UserTransactions from "./components/user/UserTransactions";
import UserReferral from "./components/user/UserReferral";
import AgentPortal from "./components/user/AgentPortal";

import TradingView from "./components/user/TradingView";
import FutureTrading from "./components/user/FutureTrading";
// import MarginTrading from './components/user/marginTrading/MarginTrading';
// import NewMarginTrading from './components/user/marginTrading/NewMarginTrading';

import MarginTradingView from "./components/auth/MarginTradingView";
import FutureTradingView from "./components/auth/FutureTradingView";

import UserClientVerification from "./components/auth/UserClientVerification";

import TrdgView from "./components/trading/TradingView";

import Donate from "./components/auth/donate";

import lending from "./components/auth/lending";

import exchange from "./components/auth/exchange";

import wallet from "./components/auth/wallet";

import developer from "./components/auth/developer";

// import NoMatch from './common/NoMatch';

import { AppBar, createTheme } from "@mui/material";

import { Container, Grid } from "@mui/material";
import { Typography, Toolbar } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { ThemeProvider } from "@mui/styles";
import "./assets/css/style.css";
import "./assets/css/updated.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import whiteLogo from "./assets/img/white-logo.webp";
import TradeScreen from "./components/buysell/TradeScreen";

ReactGA.initialize("UA-163797272-1");
ReactGA.pageview(window.location.pathname + window.location.search);

function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) staticContext.status = code;
        return children;
      }}
    />
  );
}

function NoMatch() {
  return (
    <Status code={404}>
      <React.Fragment>
        <Toolbar className="homeLighttoolbar">
          <Link className="logoBox" to="/">
            <img src={whiteLogo} alt="TrillionBit" />
          </Link>
        </Toolbar>
        <div>
          <div className="slider" style={{ height: "100vh" }}>
            <Container>
              <Grid container>
                <Grid item md={3}></Grid>
                <Grid item xs={12} sm={6} md={6} className="oneCenterBox">
                  <div className="pageNotFound">
                    <Typography variant="h1" className="">
                      PAGE NOT FOUND
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      Sorry we couldn't find what you are looking for.
                    </Typography>

                    <Link to="/" className="orange">
                      Back to Bitex
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </React.Fragment>
    </Status>
  );
}

function MainatanaceMode() {
  return (
    <Status code={404}>
      <React.Fragment>
        <Toolbar className="homeLighttoolbar">
          <Link className="logoBox" to="/">
            <img src={whiteLogo} alt="TrillionBit" />
          </Link>
        </Toolbar>
        <div>
          <div className="slider" style={{ height: "100vh" }}>
            <Container>
              <Grid container>
                <Grid item md={3}></Grid>
                <Grid item xs={12} sm={6} md={6} className="oneCenterBox">
                  <div className="pageNotFound">
                    <Settings style={{ fontSize: 100, color: "#fff" }} />
                    <Typography variant="h1" className="">
                      System Maintenance
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      TrillionBit is undergoing scheduled maintenance.
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      We will be up and running shortly.
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      Thank you for your co-operation!
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </React.Fragment>
    </Status>
  );
}

// Check for token
if (localStorage.jwtToken) {
  // set auth & token in header
  try {
    setAuthToken(localStorage.jwtToken);
    // Decode token and get user info
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(getCurrentUser(decoded));
    // set current user & Authenticated
    store.dispatch(setCurrentUser(decoded, localStorage.jwtToken));
    // Check for expire token
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > decoded.exp) {
      // logout user
      store.dispatch(setCurrentUser({}, ""));
      // window.location.href = '/login';
    }
  } catch (err) {
    console.log(err);
    localStorage.removeItem("jwtToken");
    store.dispatch(setCurrentUser());
    // window.location.href = '/login';
  }
}

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          {process.env.REACT_APP_MAINTAANANCE_MODE === "true" ? undefined : (
            <AppBar position="fixed">
              <MainNav />
              <Navbar />
            </AppBar>
          )}
          {process.env.REACT_APP_MAINTAANANCE_MODE === "true" ? (
            <Switch>
              <Route component={MainatanaceMode} />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/trading" component={TrdgView} />
              {/* <Route exact path="/newTradingView" component={NewTradingView} /> */}
              {/* <Route exact path="/new-trading-view" component={TrdgView} /> */}
              {/* <Route exact path="/new-marging-trading-view" component={NewMarginTrading} /> */}

              <Route
                exact
                path="/trading/:cryptoAsset"
                component={TradingView}
              />
              <Route exact path="/future-trading" component={FutureTrading} />
              <Route
                exact
                path="/future-trading/:cryptoAsset"
                component={FutureTrading}
              />
              <Route exact path="/register" component={Register} />
              <Route exact path="/register/:referralId" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route
                exact
                path="/email-verification"
                component={EmailVerification}
              />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route
                exact
                path="/reset-password/:emailToken"
                component={ResetPassword}
              />
              <Route exact path="/fees" component={Fees} />
              <Route exact path="/referral-info" component={Referral} />
              <Route
                exact
                path="/terms-of-service"
                component={TermsOfService}
              />
              <Route
                exact
                path="/trust-and-security"
                component={TrustAndSecurity}
              />
              <Route exact path="/about" component={About} />

              <Route exact path="/buy-sell-swap" component={TradeScreen} />
              
              <Route
                exact
                path="/margintrading"
                component={MarginTradingView}
              />
              <Route
                exact
                path="/futuretrading"
                component={FutureTradingView}
              />
              <Route
                exact
                path="/client_activation/:emailCode/:decodedEmail"
                component={UserClientVerification}
              />
              {/* <PrivateRoute exact path="/" component={Landing} /> */}
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/user-profile"
                component={UserProfile}
              />
              <PrivateRoute
                exact
                path="/user-profile/:tabName"
                component={UserProfile}
              />
              <PrivateRoute
                exact
                path="/start-verification"
                component={DocumentVerification}
              />
              <PrivateRoute exact path="/user-wallet" component={UserWallet} />
              <PrivateRoute exact path="/orders" component={UserOrder} />
              <PrivateRoute
                exact
                path="/transactions"
                component={UserTransactions}
              />
              <PrivateRoute exact path="/referral" component={UserReferral} />
              <PrivateRoute
                exact
                path="/agent-portal"
                component={AgentPortal}
              />
              {/* <PrivateRoute exact path="/margin-trading" component={MarginTrading} /> */}
              {/* <PrivateRoute exact path="/margin-trading" component={NewMarginTrading} /> */}

              <Route exact path="/exchange" component={exchange} />
              <Route exact path="/wallet" component={wallet} />
              <Route exact path="/developer" component={developer} />

              <Route exact path="/press" component={Press} />
              <Route exact path="/btxCoin" component={BtxCoin} />
              <Route exact path="/donate" component={Donate} />

              <Route exact path="/lending" component={lending} />

              <Route exact path="/about.html">
                <Redirect to="/about" />
              </Route>
              <Route exact path="/fees.html">
                <Redirect to="/fees" />
              </Route>
              <Route exact path="/exchange-web.html">
                <Redirect to="/trading" />
              </Route>
              <Route exact path="/terms-of-service.html">
                <Redirect to="/terms-of-service" />
              </Route>
              <Route component={NoMatch} />
            </Switch>
          )}
          <Footer />
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
