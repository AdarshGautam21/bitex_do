import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logOut } from "../../actions/authActions";
import {
  getAvailaleMarkets,
  activeMarket,
  getMarketLast,
  getActiveAssets,
} from "../../actions/walletActions";
import { getUserDetails } from "../../actions/userActions";
import isEmpty from "../../validation/isEmpty";
import apiUrl from "../config";

import { withStyles } from "@mui/styles/";
import {
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  // Avatar,
  ListItem,
  Link,
  Box,
} from "@mui/material";
import Avatar from "react-avatar";
import { ExpandMore } from "@mui/icons-material";

const tabGuestLinks = [
  // '/register',
  // '/login',
];

const tabAuthLinks = [
  "/dashboard",
  "/user-wallet",
  "/orders",
  "/user-profile",
  "/user-profile/basic_info",
  "/transactions",
  "/agent-portal",
];

class MainNav extends Component {
  state = {
    anchorCurrencyEl: null,
    anchorEl: null,
    markets: [],
    dispalyMarkets: [],
    marketLast: {},
    wsList: [],
    currentUserFiatWallet: {
      coin: "AED",
      active: true,
    },
  };

  getMarketCoin = (marketName) => {
    let marketCoin = marketName;
    if (marketName === "tbtcAED" || marketName === "BTCAED") {
      marketCoin = "btcusd";
    }
    if (marketName === "tbchAED" || marketName === "BCHAED") {
      marketCoin = "bchusd";
    }
    if (marketName === "tltcAED" || marketName === "LTCAED") {
      marketCoin = "ltcusd";
    }
    if (marketName === "tzecAED" || marketName === "ZEDAED") {
      marketCoin = "zecusd";
    }
    if (marketName === "txlmAED" || marketName === "XLMAED") {
      marketCoin = "xlmusd";
    }
    if (marketName === "tdashAED" || marketName === "DASHAED") {
      marketCoin = "dashusd";
    }
    if (marketName === "XRPAED") {
      marketCoin = "xrpusd";
    }
    if (marketName === "ETHAED") {
      marketCoin = "ethusd";
    }
    return marketCoin;
  };

  componentDidMount = async () => {
    if (this.props.auth.isAuthenticated) {
      await this.props.getUserDetails(this.props.auth.user.id);
      await this.props.getActiveAssets(this.props.auth.user.id);
    }
    await this.props.getAvailaleMarkets();
    await this.props.getMarketLast();
    let marketList = [];
    let marketLast = this.state.marketLast;

    for (let key in this.props.trading.markets) {
      for (let key in this.props.trading.markets) {
        marketLast[this.props.trading.markets[key].name] =
          this.props.wallet.marketLasts[this.props.trading.markets[key].name];
        this.setState({ marketLast: marketLast });
      }
      marketList.push(this.props.trading.markets[key].name);
    }
    this.wsConnect(marketList);
    await this.props.getMarketLast(this.props.trading.markets);
  };

  componentWillReceiveProps = async (nextProps) => {
    const { user } = nextProps.auth;

    if (user) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > user.exp) {
        nextProps.logOut();
      }
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.snackMessages) {
      this.setState({ snackMessages: nextProps.snackMessages });
    }

    for (let x in nextProps.wallet.userAssets) {
      if (nextProps.wallet.userAssets[x].fiat) {
        if (nextProps.wallet.userAssets[x].active) {
          await this.setState({
            currentUserFiatWallet: nextProps.wallet.userAssets[x],
          });
        }
      }
    }

    const availableMarkets = nextProps.trading.markets;
    let displayMarkets = [];
    for (let akey in availableMarkets) {
      displayMarkets[availableMarkets[akey].stock] = isEmpty(
        displayMarkets[availableMarkets[akey].stock]
      )
        ? []
        : displayMarkets[availableMarkets[akey].stock];
      await displayMarkets[availableMarkets[akey].stock].push(
        availableMarkets[akey]
      );
      if (isEmpty(this.props.trading.activeMarket)) {
        if (
          (availableMarkets[akey].stock === "tbtc" ||
            availableMarkets[akey].stock === "BTC") &&
          this.state.currentUserFiatWallet.coin ===
            availableMarkets[akey].money &&
          this.state.currentUserFiatWallet.active
        ) {
          await this.props.activeMarket(availableMarkets[akey]);
        }
      }
      this.setState({ dispalyMarkets: displayMarkets });
    }
  };

  componentWillUnmount = () => {
    this.state.wsList.map((ws) => {
      ws.close();
      return true;
    });
  };

  wsConnect = () => {
    let ws = new WebSocket("wss://trillionbit.quantacloud.net/ws/");
    console.log("connect:", ws);

    ws.onopen = async () => {
      console.log("socket conneced");
      this.setState({ ws: ws });
      var msg = JSON.stringify({
        id: 12121,
        method: "state.subscribe",
        params: [
          "BTCAED",
          "BCHAED",
          "ETHAED",
          "LTCAED",
          "XRPAED",
          "TRXAED",
          "BTXAED",
          "BTCINR",
          "BCHINR",
          "ETHINR",
          "LTCINR",
          "XRPINR",
          "TRXINR",
          "BTXINR",
          "BTCUSDT",
          "BCHUSDT",
          "ETHUSDT",
          "LTCUSDT",
          "XRPUSDT",
          "TRXUSDT",
          "USDTINR",
          "USDTAED",
          "BTCEUR",
          "ETHEUR",
          "XRPEUR",
          "LTCEUR",
          "BCHEUR",
          "TRXEUR",
          "EURUSDT",
          "GBPUSDT",
          "BTCGBP",
          "ETHGBP",
          "XRPGBP",
          "LTCGBP",
        ],
      });
      ws.send(msg);
    };

    ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);

      if (message.method === "state.update") {
        let marketLast = this.state.marketLast;
        if (message.params) {
          marketLast[[message.params[0]]] = message.params[1];
          this.setState({ marketLast: marketLast });
        }
      }
    };
    console.log(this.state.marketLast);
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.setState({ anchorEl: null, anchorCurrencyEl: null });
    this.props.logOut();
  };

  handleMainMenuClick = (event, value) => {
    if (value === "currency") {
      this.setState({ anchorCurrencyEl: event.currentTarget });
    }

    if (value === "profile") {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null, anchorCurrencyEl: null });
  };

  activeMarket = (market) => {
    this.props.activeMarket(market);
    this.handleClose();
  };

  getMarketLast = (marketName) => {
    if (marketName in this.props.trading.marketLast) {
      return parseFloat(this.props.wallet.marketLasts[marketName]).toFixed(2);
    }
  };

  render() {
    const { classes, auth, trading, user } = this.props;
    if (auth.isAuthenticated) {
      const { dispalyMarkets } = this.state;
      const { pathname } = this.props.location;
      let pathName = pathname;

      let activeStock = "BTC";
      let activeMoney = "AED";

      if (!isEmpty(trading.activeMarket)) {
        activeStock = trading.activeMarket.stock;
        activeMoney = trading.activeMarket.money;
      }

      let userBox;
      if (auth.isAuthenticated) {
        userBox = (
          <div className="userbox">
            <Button
              aria-controls="customized-menu2"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              onClick={(e) => this.handleMainMenuClick(e, "profile")}
            >
              {!isEmpty(auth.currentLoginUser?.avatar) ? (
                <Avatar
                  round={true}
                  size="30"
                  // src={`${apiUrl}/api/guest/get_image/${auth.currentLoginUser?.avatar}`}
                  className={classes?.avatar}
                />
              ) : (
                <Avatar
                  round={true}
                  size="30"
                  // src={`${apiUrl}/api/guest/get_image/user_logo.png`}
                  className={classes?.avatar}
                />
              )}
              <Typography component="p" className="">
                {auth.user.firstname} {auth.user.lastname}
                <ExpandMore className="trt" />
              </Typography>
            </Button>
            <Menu
              elevation={0}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              id="customized-menu2"
              className="logoutBtn"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose.bind(this)}
            >
              <MenuItem onClick={this.onLogoutClick.bind(this)}>
                {" "}
                Log out{" "}
              </MenuItem>
            </Menu>
          </div>
        );
      }

      let displayMarketDom = [];
      for (let key in dispalyMarkets) {
        displayMarketDom.push(
          <div className="item" key={key}>
            <div className="title">{key}</div>
            <div className="currnecyListItem">
              {dispalyMarkets[key].map((market) => {
                return (
                  <ListItem key={market._id}>
                    <Link onClick={() => this.activeMarket(market)}>
                      <span>
                        {" "}
                        {market.stock} / {market.money}{" "}
                      </span>{" "}
                      {market.money}{" "}
                      {!isEmpty(this.state.marketLast)
                        ? this.state.marketLast[market.name]
                          ? parseFloat(
                              this.state.marketLast[market.name].last
                            ).toFixed(2)
                          : 0.0
                        : 0.0}
                    </Link>
                  </ListItem>
                );
              })}
            </div>
          </div>
        );
      }

      let mainNav = <Box></Box>;
      var patt = /register/i;
      pathName = pathName.match(patt)
        ? pathName.match(patt)[0] === "register"
          ? "/register"
          : pathName
        : pathName;
      // if(pathName.match(patt)[0] === 'register') {
      //     pathName = '/register';
      // }

      if (tabGuestLinks.includes(pathName) || tabAuthLinks.includes(pathName)) {
        mainNav = (
          <Toolbar className="darktoolbar">
            <div className="currnecyBox">
              <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={(e) => this.handleMainMenuClick(e, "currency")}
              >
                <Typography className="">
                  {activeStock} / {activeMoney}
                  <ExpandMore className="trt" />
                </Typography>
              </Button>

              <Typography component="p" className="currnecy">
                {activeMoney}
              </Typography>

              <Typography component="p" className="cValue">
                {!isEmpty(this.state.marketLast)
                  ? this.state.marketLast["BTCUSDT"]
                    ? parseFloat(this.state.marketLast["BTCUSDT"].last).toFixed(
                        2
                      )
                    : 0.0
                  : 0.0}
              </Typography>
              <Menu
                className="currnecyChange"
                elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                id="customized-menu"
                anchorEl={this.state.anchorCurrencyEl}
                keepMounted
                open={Boolean(this.state.anchorCurrencyEl)}
                onClose={this.handleClose.bind(this)}
              >
                <div className="currnecyList">{displayMarketDom}</div>
              </Menu>
            </div>
            {userBox}
          </Toolbar>
        );
      }

      return mainNav;
    }
    return "";
  }
}

const mainNavstyles = (theme) => ({
  root: {
    boxShadow: "none",
  },
  mainToolBar: {
    minHeight: 35,
  },
  mainToolBarText: {
    fontSize: theme.typography.pxToRem(13),
  },
  tabRoot: {
    minWidth: 0,
  },
});

MainNav.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  logOut: PropTypes.func.isRequired,
  getAvailaleMarkets: PropTypes.func.isRequired,
  activeMarket: PropTypes.func.isRequired,
  getMarketLast: PropTypes.func.isRequired,
  getUserDetails: PropTypes.func.isRequired,
  getActiveAssets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  trading: state.trading,
  wallet: state.wallet,
});

const routerMainNav = withRouter((props) => <MainNav {...props} />);

export default connect(mapStateToProps, {
  logOut,
  getAvailaleMarkets,
  activeMarket,
  getMarketLast,
  getUserDetails,
  getActiveAssets,
})(withStyles(mainNavstyles)(routerMainNav));
