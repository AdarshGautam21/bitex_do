import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@mui/styles/";
import { Helmet } from "react-helmet";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import KeyboardEventHandler from "react-keyboard-event-handler";

import {
  Button,
  Typography,
  List,
  ListItem,
  Avatar,
  TextField,
  CircularProgress,
  ListItemAvatar,
  ListItemText,
  Modal,
  ListSubheader,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/lab/Autocomplete";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import {
  getOrderDepth,
  getUserOrders,
  getClientOrders,
  placeMarketOrder,
  placeLimitOrder,
  getPendingOrders,
  getClientPendingOrders,
  cancelUserOrder,
  getTradingMaintenance,
} from "../../actions/orderActions";
import {
  getUserProfile,
  getAgentClients,
  getUserClientWallets,
  getIpLocation,
} from "../../actions/userActions";
import {
  getUserWallet,
  getMarketLast,
  getFinalMarketLast,
} from "../../actions/walletActions";
import { logOut } from "../../actions/authActions";
import {
  getAvailaleMarkets,
  activeMarket,
  getActiveAssets,
  getBtxMarketData,
  getBtxAedMarketData,
} from "../../actions/walletActions";
import tableIcons from "../../common/tableIcons";

import isEmpty from "../../validation/isEmpty";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";
import { clearSnackMessages } from "../../actions/messageActions";

import themeStyles from "../../assets/themeStyles";
import apiUrl from "../config";
import currencyIcon from "../../common/CurrencyIcon";
import MaterialTable from "material-table";

import wifiImg from "../../assets/img/loader.webp";
import whiteLogoImg from "../../assets/img/white-logo.webp";
import AuthLink from "./AuthLink";
import GuestLink from "./GuestLink";
import MarketList from "./MarketList";
import OrderBook from "./OrderBook";
import Trade from "./Trade";
import Graph from "./Graph";
import AssetsAllocation from "./AssetsAllocation";
import UserTrade from "./UserTrade";

const moment = require("moment");
let CurrencyFormat = require("react-currency-format");
const publicIp = require("public-ip");

let orderDeals = [];
let newAsks = [];
let newBids = [];

let updateTrade = true;

setInterval(() => {
  if (!updateTrade) {
    updateTrade = true;
  }
}, 1000);

class TradingView extends Component {
  state = {
    wsConnection: false,
    value: "",
    buyTabValue: "buy",
    openTabValue: "open",
    anchorEl: null,
    anchoragentEl: null,
    anchorCurrencyEl: null,
    currentTrade: "buy",
    mobileMenu: false,
    markets: [],
    dispalyMarkets: [],
    errors: {},
    orderBookAsks: [],
    orderBookBids: [],
    orderDeals: [],
    marketAmount: "",
    limitPrice: "",
    limitAmount: "",
    takerFee: "",
    makerFee: "",
    marketSubtotal: 0.0,
    marketApprox: 0.0,
    marketLastBuy: 0.0,
    marketLastSell: 0.0,
    currentUserCryptoWallet: {},
    currentUserFiatWallet: { coin: "INR" },
    currentClientCryptoWallet: {},
    currentClientFiatWallet: { coin: "INR" },
    snackMessages: {},
    marketLast: {},
    finalMarketLast: {},
    variant: "dark",
    snackbarMessage: "",
    ws: null,
    orderProcess: false,
    options: {
      chart: {
        toolbar: {
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
        },
      },
      plotOptions: {
        candlestick: {
          wick: {
            useFillColor: true,
          },
        },
      },
      grid: {
        show: false,
      },
      stroke: {
        show: true,
        curve: "smooth",
        width: 1,
      },
    },
    series: [
      {
        data: [
          [1538856000000, [6593.34, 6600, 6582.63, 6600]],
          [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
          [1538856000000, [6593.34, 6600, 6582.63, 6600]],
          [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
          [1538856000000, [6593.34, 6600, 6582.63, 6600]],
          [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
          [1538856000000, [6593.34, 6600, 6582.63, 6600]],
          [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
          [1538856000000, [6593.34, 6600, 6582.63, 6600]],
          [1538856900000, [6595.16, 6604.76, 6590.73, 6593.86]],
        ],
      },
    ],
    openOrdersList: false,
    finishedOrdersList: false,
    newOrderDialog: false,
    ajaxProcess: false,
    userClientWallets: [],
    clientOrderTab: "market",
    selectedClient: {},
    clientOrders: [],
    clientOpenOrders: [],
    orderBookModal: false,
    marketTabValue: "INR",
    isChangeMarket: true,
    isDefaltMarketChange: false,
  };

  getUserAllOrders = () => {
    const { auth } = this.props;
    let currentMarket = this.props.trading.activeMarket;

    if (!isEmpty(auth.user)) {
      this.props.getUserOrders(
        auth.user.id,
        currentMarket.name,
        currentMarket.stock,
        currentMarket.money
      );
      this.props.getPendingOrders(
        auth.user.id,
        parseInt(auth.user.id.replace(/\D/g, "")),
        currentMarket.name
      );
      this.props.getUserProfile(auth.user.id);
      this.props.getActiveAssets(auth.user.id);
    }
  };

  componentDidMount = async () => {
    this.checkWebsocket();
    try {
      const publicIpV4 = await publicIp.v4();
      const currentIpLocation = await getIpLocation(publicIpV4);
      const coin =
        currentIpLocation.country.code === "IN"
          ? "INR"
          : currentIpLocation.country.code === "AE"
          ? "AED"
          : "USDT";
      this.setState({
        currentUserFiatWallet: {
          coin: coin,
        },
        marketTabValue: coin,
      });
    } catch (error) {
      console.log("ERRORS:", error);
    }
    let promises = [
      this.props.getAvailaleMarkets(),
      this.props.getMarketLast(),
      this.props.getFinalMarketLast(),
      this.props.getBtxMarketData(),
      this.props.getBtxAedMarketData(),
      this.props.getTradingMaintenance(),
    ];

    const { auth } = this.props;
    if (auth.isAuthenticated) {
      promises.push(this.props.getActiveAssets(auth.user.id));
    }
    await Promise.all(promises);
    const userActiveFiatAsset = this.props.wallet.userAssets.find(
      (item) => item.fiat && item.active
    );
    if (!isEmpty(userActiveFiatAsset)) {
      this.setState({
        currentUserFiatWallet: userActiveFiatAsset,
        marketTabValue: userActiveFiatAsset?.coin
          ? userActiveFiatAsset.coin
          : this.state.marketTabValue,
      });
    } else {
      if (auth.isAuthenticated) {
        this.setState({
          currentUserFiatWallet: { coin: "USDT" },
          marketTabValue: "USDT",
        });
      }
    }
    let marketLast = this.state.marketLast;
    let finalMarketLast = this.state.finalMarketLast;
    for (let key in this.props.trading.markets) {
      marketLast[this.props.trading.markets[key].name] =
        this.props.wallet.marketLasts[this.props.trading.markets[key].name];
      finalMarketLast[this.props.trading.markets[key].name] =
        this.props.wallet.finalMarketLasts[
          this.props.trading.markets[key].name
        ];
      if (
        this.props.trading.markets[key].stock ===
        this.props.match.params.cryptoAsset
      ) {
        this.props.activeMarket(this.props.trading.markets[key]);
      } else {
        if (
          (this.props.trading.markets[key].stock === "tbtc" ||
            this.props.trading.markets[key].stock === "BTC") &&
          this.state.currentUserFiatWallet.coin ===
            this.props.trading.markets[key].money
        ) {
          this.props.activeMarket(this.props.trading.markets[key]);
        }
      }
    }

    this.setState({
      marketLast: marketLast,
      finalMarketLast: finalMarketLast,
    });
    this.wsConnect();
    if (auth.isAuthenticated) {
      setInterval(() => {
        if (this.props.auth.user.id) {
          this.props.getPendingOrders(
            this.props.auth.user.id,
            parseInt(this.props.auth.user.id.replace(/\D/g, "")),
            this.props.trading.activeMarket.name
          );
        }
      }, 5000);
      promises = [this.props.getUserProfile(auth.user.id)];
      if (auth.user.agent) {
        promises.push(this.props.getAgentClients(auth.user.id));
      }
      await Promise.all(promises);
    }
  };
  checkWebsocket = () => {
    setInterval(() => {
      // console.log('check ping');
      if (this.state.ws) {
        // console.log('ws is active');
        if (this.state.ws.readyState === WebSocket.OPEN) {
          // console.log('ws is open');
          var pmsg = JSON.stringify({
            id: 12345,
            method: "server.ping",
            params: [],
          });
          this.state.ws.send(pmsg);
        }
      }
    }, 2000);
  };

  /**
   * Serializes data when it's received.
   */
  serializeData = (data) => {
    // console.log(data);
    if (!data.asks || !data.bids) {
      let marketLast = this.state.marketLast;
      let currentMarket = this.props.trading.activeMarket;
      marketLast[currentMarket.name]["last"] = parseFloat(data.price).toFixed(
        2
      );
      orderDeals.push({
        type: data.type === 0 ? "buy" : "sell",
        amount: (parseFloat(data.amount) * 0.1).toFixed(8),
        time: data.timestamp,
        price: parseFloat(data.price).toFixed(2),
      });
      orderDeals.sort(function (a, b) {
        return parseInt(b.time) - parseInt(a.time);
      });
      this.setState({ orderDeals: orderDeals, marketLast: marketLast });
      this.getUserAllOrders();
    } else {
      this.setState({
        orderBookAsks: data.asks,
        marketLastBuy: data.asks[0].price.replace(",", ""),
      });
      this.setState({
        orderBookBids: data.bids,
        marketLastSell: data.bids[0].price.replace(",", ""),
      });
    }
  };

  getWsEndpoint = (market) => {
    let port = "allusdt";

    if (market.name === "BCHUSD") {
      port = "bchusd";
    }
    if (market.name === "LTCUSD") {
      port = "ltcusd";
    }
    if (market.name === "XRPUSD") {
      port = "xrpusd";
    }
    if (market.name === "ETHUSD") {
      port = "ethusd";
    }
    if (market.name === "TRXUSD") {
      port = "ethusd";
    }

    if (market.name === "BTCUSDT") {
      port = "allusdt";
    }
    if (market.name === "BCHUSDT") {
      port = "allusdt";
    }
    if (market.name === "LTCUSDT") {
      port = "allusdt";
    }
    if (market.name === "XRPUSDT") {
      port = "allusdt";
    }
    if (market.name === "ETHUSDT") {
      port = "allusdt";
    }
    if (market.name === "EURUSDT") {
      port = "allusdt";
    }
    if (market.name === "GBPUSDT") {
      port = "allusdt";
    }
    if (market.name === "TRXINR") {
      port = "allinr";
    }

    if (market.name === "BTCINR") {
      port = "allinr";
    }
    if (market.name === "BCHINR") {
      port = "allinr";
    }
    if (market.name === "LTCINR") {
      port = "allinr";
    }
    if (market.name === "XRPINR") {
      port = "allinr";
    }
    if (market.name === "ETHINR") {
      port = "allinr";
    }
    if (market.name === "TRXINR") {
      port = "allinr";
    }

    if (market.name === "BTCAED") {
      port = "allaed";
    }
    if (market.name === "BCHAED") {
      port = "allaed";
    }
    if (market.name === "LTCAED") {
      port = "allaed";
    }
    if (market.name === "XRPAED") {
      port = "allaed";
    }
    if (market.name === "ETHAED") {
      port = "allaed";
    }
    if (market.name === "TRXAED") {
      port = "allaed";
    }

    if (market.name === "BTCEUR") {
      port = "allaed";
    }

    return port;
  };

  getWsport = (market) => {
    let port = "btcusd";

    if (market.name === "BCHUSD") {
      port = "bchusd";
    }
    if (market.name === "LTCUSD") {
      port = "ltcusd";
    }
    if (market.name === "XRPUSD") {
      port = "xrpusd";
    }
    if (market.name === "ETHUSD") {
      port = "ethusd";
    }

    if (market.name === "BTCUSDT") {
      port = "btcusdt";
    }
    if (market.name === "BCHUSDT") {
      port = "bchusdt";
    }
    if (market.name === "LTCUSDT") {
      port = "ltcusdt";
    }
    if (market.name === "XRPUSDT") {
      port = "xrpusdt";
    }
    if (market.name === "ETHUSDT") {
      port = "ethusdt";
    }

    if (market.name === "BTCINR") {
      port = "btcinr";
    }
    if (market.name === "BCHINR") {
      port = "bchinr";
    }
    if (market.name === "LTCINR") {
      port = "ltcinr";
    }
    if (market.name === "XRPINR") {
      port = "xrpinr";
    }
    if (market.name === "ETHINR") {
      port = "ethinr";
    }

    if (market.name === "BTCAED") {
      port = "btcaed";
    }
    if (market.name === "BCHAED") {
      port = "bchaed";
    }
    if (market.name === "LTCAED") {
      port = "ltcaed";
    }
    if (market.name === "XRPAED") {
      port = "xrpaed";
    }
    if (market.name === "ETHAED") {
      port = "ethaed";
    }
    if (market.name === "BTCEUR") {
      port = "btceur";
    }
    if (market.name === "BCHEUR") {
      port = "bcheur";
    }
    if (market.name === "LTCEUR") {
      port = "ltceur";
    }
    if (market.name === "XRPEUR") {
      port = "xrpeur";
    }
    if (market.name === "ETHEUR") {
      port = "etheur";
    }
    if (market.name === "TRXEUR") {
      port = "trxeur";
    }
    if (market.name === "EURUSDT") {
      port = "eurusdt";
    }
    if (market.name === "GBPUSDT") {
      port = "gbpusdt";
    }
    if (market.name === "BTCGBP") {
      port = "btcgbp";
    }
    if (market.name === "LTCGBP") {
      port = "ltcgbp";
    }
    if (market.name === "XRPGBP") {
      port = "xrpgbp";
    }
    if (market.name === "ETHGBP") {
      port = "ethgbp";
    }

    return port;
  };

  wsConnect = async () => {
    const { auth } = this.props;
    let currentMarket = this.props.trading.activeMarket;
    let currentPort = this.getWsEndpoint(currentMarket);

    if (this.state.ws) {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        await this.state.ws.close();
      }
      if (this.state.ws.readyState === WebSocket.CLOSED) {
        if (currentMarket.name) {
          if (
            currentMarket.name.includes("BTX") ||
            currentMarket.name.includes("BTC") ||
            currentMarket.name.includes("ETH") ||
            currentMarket.name.includes("LTC") ||
            currentMarket.name.includes("XRP") ||
            currentMarket.name.includes("TRX") ||
            currentMarket.name.includes("BCH") ||
            currentMarket.name.includes("USDT")
          ) {
            let ws = new WebSocket(`wss://trillionbit.quantacloud.net/ws/`);
            // let ws = new WebSocket(`ws://13.127.84.72:8090/`);
            this.setState({ ws: ws });
          } else {
            let ws = new WebSocket(
              `wss://trillionbit.quantacloud.net/ws/${currentPort}/`
            );
            this.setState({ ws: ws });
          }
        }
      }
    } else {
      if (currentMarket.name) {
        if (
          currentMarket.name.includes("BTX") ||
          currentMarket.name.includes("BTC") ||
          currentMarket.name.includes("ETH") ||
          currentMarket.name.includes("LTC") ||
          currentMarket.name.includes("XRP") ||
          currentMarket.name.includes("TRX") ||
          currentMarket.name.includes("BCH") ||
          currentMarket.name.includes("USDT")
        ) {
          let ws = new WebSocket(`wss://trillionbit.quantacloud.net/ws/`);
          // let ws = new WebSocket(`ws://13.127.84.72:8090/`);
          this.setState({ ws: ws });
        } else {
          let ws = new WebSocket(
            `wss://trillionbit.quantacloud.net/ws/${currentPort}/`
          );
          this.setState({ ws: ws });
        }
      }
    }

    if (!isEmpty(auth.user)) {
      this.props.getUserOrders(
        auth.user.id,
        currentMarket.name,
        currentMarket.stock,
        currentMarket.money
      );
      this.props.getPendingOrders(
        auth.user.id,
        parseInt(auth.user.id.replace(/\D/g, "")),
        currentMarket.name
      );
    }

    if (this.state.ws) {
      this.state.ws.onopen = () => {
        var amsg = JSON.stringify({
          id: 12121,
          method: "server.auth",
          params: [auth.token, "web"],
        });
        this.state.ws.send(amsg);
        let currentMarket = this.props.trading.activeMarket;
        if (currentMarket.name) {
          if (
            currentMarket.name.includes("BTX") ||
            currentMarket.name.includes("BTC") ||
            currentMarket.name.includes("ETH") ||
            currentMarket.name.includes("LTC") ||
            currentMarket.name.includes("XRP") ||
            currentMarket.name.includes("TRX") ||
            currentMarket.name.includes("BCH") ||
            currentMarket.name.includes("USDT")
          ) {
            var msg = JSON.stringify({
              id: 12121,
              method: "depth.subscribe",
              params: [currentMarket.name, 100, "0"],
            });
            this.state.ws.send(msg);
            var dealMsg = JSON.stringify({
              id: 12121,
              method: "deals.subscribe",
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
            this.state.ws.send(dealMsg);
            var marketLastSubscribe = JSON.stringify({
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
            this.state.ws.send(marketLastSubscribe);
            setTimeout(() => {
              var omsg = JSON.stringify({
                id: 12121,
                method: "order.subscribe",
                params: [currentMarket.name],
              });
              this.state.ws.send(omsg);
            }, 2000);
          } else {
            this.state.ws.send(
              JSON.stringify({
                currentCurrency: currentMarket.name,
                pairs: [
                  "btcusdt@trade",
                  "btcusdt@depth20@1000ms",
                  "ethusdt@trade",
                  "ethusdt@depth20@1000ms",
                  "bchusdt@trade",
                  "bchusdt@depth20@1000ms",
                  "ltcusdt@trade",
                  "ltcusdt@depth20@1000ms",
                  "xrpusdt@trade",
                  "xrpusdt@depth20@1000ms",
                  "trxusdt@trade",
                  "trxusdt@depth20@1000ms",
                ],
              })
            );
          }
        }
      };

      this.state.ws.onmessage = (evt) => {
        let currentMarket = this.props.trading.activeMarket;
        let {
          orderBookAsks,
          orderBookBids,
          marketLastSell,
          marketLastBuy,
          limitPrice,
          marketLast,
          wsConnection,
          orderDeals,
          isChangeMarket,
          isDefaltMarketChange,
        } = this.state;
        if (
          currentMarket.name.includes("BTX") ||
          currentMarket.name.includes("BTC") ||
          currentMarket.name.includes("ETH") ||
          currentMarket.name.includes("LTC") ||
          currentMarket.name.includes("XRP") ||
          currentMarket.name.includes("TRX") ||
          currentMarket.name.includes("BCH") ||
          currentMarket.name.includes("USDT")
        ) {
          const message = JSON.parse(evt.data);

          if (message.method === "state.update") {
            // let marketLast = this.state.marketLast;
            if (message.params) {
              marketLast[[message.params[0]]] = message.params[1];
              // this.setState({ marketLast: marketLast });
            }
          }

          if (message.result) {
            if (message.result.volume) {
              isDefaltMarketChange = false;
              // let marketLast = this.state.marketLast;
              if (marketLast[this.props.trading.activeMarket.name]) {
                marketLast[this.props.trading.activeMarket.name]["last"] =
                  message.result.last;
                marketLast[this.props.trading.activeMarket.name]["high"] =
                  message.result.high;
                marketLast[this.props.trading.activeMarket.name]["low"] =
                  message.result.low;
              } else {
                marketLast[this.props.trading.activeMarket.name] = {};
                marketLast[this.props.trading.activeMarket.name]["last"] =
                  message.result.last;
                marketLast[this.props.trading.activeMarket.name]["high"] =
                  message.result.high;
                marketLast[this.props.trading.activeMarket.name]["low"] =
                  message.result.low;
              }
              // this.setState({
              //     marketLast: marketLast,
              // });
            }
          }
          if (message.result) {
            newAsks = [];
            if (message.result.asks) {
              if (message.result.asks.length > 0) {
                // let marketLast = this.state.marketLast;
                if (marketLast[this.props.trading.activeMarket.name]) {
                  marketLast[this.props.trading.activeMarket.name]["ask"] =
                    message.result.asks[0][0];
                } else {
                  marketLast[this.props.trading.activeMarket.name] = {};
                  marketLast[this.props.trading.activeMarket.name]["ask"] =
                    message.result.asks[0][0];
                }
                limitPrice =
                  this.state.currentTrade === "sell" &&
                  this.state.isChangeMarket === true
                    ? message.result.asks[0][0]
                    : limitPrice;
                // this.setState({
                //     orderBookAsks: message.result.asks,
                //     marketLastBuy: message.result.asks[0][0],
                //     limitPrice: limitPrice,
                //     // marketLast: marketLast,
                //     wsConnection: true,
                // });
                orderBookAsks = message.result.asks;
                marketLastBuy = message.result.asks[0][0];
                wsConnection = true;
              }
            }
          }
          if (message.result) {
            if (message.result.bids) {
              if (message.result.bids.length > 0) {
                // let marketLast = this.state.marketLast;
                if (marketLast[this.props.trading.activeMarket.name]) {
                  marketLast[this.props.trading.activeMarket.name]["bid"] =
                    message.result.bids[0][0];
                } else {
                  marketLast[this.props.trading.activeMarket.name] = {};
                  marketLast[this.props.trading.activeMarket.name]["bid"] =
                    message.result.bids[0][0];
                }
                limitPrice =
                  this.state.currentTrade === "buy" &&
                  this.state.isChangeMarket === true
                    ? message.result.bids[0][0]
                    : limitPrice;
                // this.setState({
                //     orderBookBids: message.result.bids,
                //     marketLastSell: message.result.bids[0][0],
                //     marketLast: marketLast,
                //     limitPrice: limitPrice,
                //     wsConnection: true,
                // });
                orderBookBids = message.result.bids;
                marketLastSell = message.result.bids[0][0];
                wsConnection = true;
              }
            }
          }

          if (message.result) {
            if (message.result.length > 0) {
              if (message.result !== "pong") {
                // let marketLast = this.state.marketLast;
                // let orderDeals = this.state.orderDeals;
                // let marketLast = this.state.marketLast;
                // console.log("marketLast:", marketLast, marketLast[currentMarket.name] );
                marketLast[currentMarket.name]["last"] = parseFloat(
                  message.result[0].price
                ).toFixed(4);
                if (message.result.length > 0) {
                  orderDeals = message.result;
                  orderDeals.splice(20, 100);
                  // this.setState({orderDeals: orderDeals});
                }
              }
            }
          }

          if (message.method === "order.update") {
            this.setState({
              snackMessages: {
                variant: "success",
                message: `Order successfully placed ${message.params[1].deal_stock}@${message.params[1].price}`,
              },
            });
          }

          if (message.method === "depth.update") {
            if (message.method === "depth.update") {
              var msg = JSON.stringify({
                id: 12121,
                method: "depth.query",
                params: [currentMarket.name, 100, "0"],
              });
              this.state.ws.send(msg);
            }
          }
          if (
            message.method === "deals.update" ||
            message.method === "deals.subscribe"
          ) {
            let marketLast = this.state.marketLast;
            if (marketLast[message.params[0]]) {
              marketLast[message.params[0]]["last"] = parseFloat(
                message.params[1][0].price
              ).toFixed(2);
            } else {
              marketLast[message.params[0]] = {};
              marketLast[message.params[0]]["last"] = parseFloat(
                message.params[1][0].price
              ).toFixed(2);
            }
            this.setState({
              marketLast: marketLast,
            });
            var dealMsg = JSON.stringify({
              id: 12121,
              method: "deals.query",
              params: [currentMarket.name, 100, 0],
            });
            this.state.ws.send(dealMsg);
            var klineMsg = JSON.stringify({
              id: 12121,
              method: "state.query",
              params: [currentMarket.name, 86400],
            });
            this.state.ws.send(klineMsg);
          }
        } else {
          const message = JSON.parse(evt.data);
          // let marketLast = this.state.marketLast;
          if (message) {
            // if(message.result.length > 0) {
            if (
              message.e === "trade" &&
              message.s.includes(currentMarket.stock)
            ) {
              if (updateTrade) {
                updateTrade = false;
                // let orderDeals = this.state.orderDeals;
                // let marketLast = this.state.marketLast;
                marketLast[currentMarket.name]["last"] = parseFloat(
                  message.p
                ).toFixed(2);
                orderDeals.unshift(message);
                orderDeals.splice(20, 100);
                // this.setState({orderDeals: orderDeals});
              }
            }
            if (
              message.asks &&
              message.s.includes(currentMarket.stock.toLowerCase())
            ) {
              if (message.asks[0]) {
                limitPrice =
                  this.state.currentTrade === "buy" &&
                  this.state.isChangeMarket === true
                    ? message.asks[0].price.replaceAll(",", "")
                    : limitPrice;
                // this.setState({
                //     orderBookAsks: message.asks.slice(0, 50),
                //     marketLastBuy: message.asks[0].price.replaceAll(',',''),
                //     limitPrice: limitPrice
                // });
                orderBookAsks = message.asks.slice(0, 50);
                marketLastBuy = message.asks[0].price.replaceAll(",", "");
              } else {
                // this.setState({
                //     orderBookAsks: message.asks.slice(0, 50),
                //     marketLastBuy: 1,
                // });
                orderBookAsks = message.asks.slice(0, 50);
                marketLastBuy = 1;
              }
            } else {
              // this.setState({wsConnection: false});
            }

            if (
              message.bids &&
              message.s.includes(currentMarket.stock.toLowerCase())
            ) {
              if (message.bids[0]) {
                limitPrice =
                  this.state.currentTrade === "sell" &&
                  this.state.isChangeMarket === true
                    ? message.bids[0].price.replaceAll(",", "")
                    : limitPrice;
                // this.setState({
                //     orderBookBids: message.bids.slice(0, 50),
                //     marketLastSell: message.bids[0].price.replaceAll(',',''),
                //     wsConnection: true,
                //     limitPrice:limitPrice
                // });
                orderBookBids = message.bids.slice(0, 50);
                marketLastSell = message.bids[0].price.replaceAll(",", "");
                wsConnection = true;
                isChangeMarket = false;
              } else {
                // this.setState({
                //     orderBookBids: message.bids.slice(0, 50),
                //     marketLastSell: 1,
                // });
                orderBookBids = message.bids.slice(0, 50);
                marketLastSell = 1;
              }
            } else {
              // this.setState({wsConnection: false});
            }
          }
        }
        this.setState(
          {
            orderBookAsks,
            orderBookBids,
            marketLastSell,
            marketLastBuy,
            limitPrice,
            marketLast,
            wsConnection,
            orderDeals,
            isChangeMarket,
            // isDefaltMarketChange
          },
          () => {
            this.setState({
              isDefaltMarketChange,
            });
          }
        );
      };

      /**
       * In case of unexpected close event, try to reconnect.
       */
      this.state.ws.onclose = function () {
        this.setState({ wsConnection: false });
        if (this.props.history.location.pathname === "/trading") {
          this.wsConnect();
        }
      }.bind(this);
    }
  };

  componentWillUnmount = () => {
    if (this.state.ws) {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        this.state.ws.close();
      }
    }
  };

  UNSAFE_componentWillReceiveProps = async (nextProps) => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.snackMessages) {
      this.setState({ snackMessages: nextProps.snackMessages });
    }
    const availableMarkets = nextProps.trading.markets;
    if (availableMarkets.length > 0) {
      let displayMarkets = [];
      let coinWiseDisplayMarket = [];
      availableMarkets.map((availableMarket) => {
        displayMarkets[availableMarket.stock] = isEmpty(
          displayMarkets[availableMarket.stock]
        )
          ? []
          : displayMarkets[availableMarket.stock];
        displayMarkets[availableMarket.stock].push(availableMarket);
        if (coinWiseDisplayMarket[availableMarket.money] === undefined)
          coinWiseDisplayMarket[availableMarket.money] = [];
        coinWiseDisplayMarket[availableMarket.money].push(availableMarket);
        if (isEmpty(this.props.trading.activeMarket)) {
          if (
            (availableMarket.stock === "tbtc" ||
              availableMarket.stock === "BTC") &&
            this.state.currentUserFiatWallet.coin === availableMarket.money
          ) {
            this.props.activeMarket(availableMarket);
          }
        }
        return true;
      });
      // this.setState({dispalyMarkets: displayMarkets});
      this.setState({ dispalyMarkets: coinWiseDisplayMarket });
    }
    if (!isEmpty(nextProps.user.userProfile)) {
      this.setState({
        takerFee:
          this.props.trading.activeMarket.stock === "BTX"
            ? 0.0
            : parseFloat(nextProps.user.userProfile.traderLevelFees.takerFee) /
              100,
        makerFee:
          this.props.trading.activeMarket.stock === "BTX"
            ? 0.0
            : parseFloat(nextProps.user.userProfile.traderLevelFees.makerFee) /
              100,
      });
    }
    if (!isEmpty(nextProps.trading.activeMarket)) {
      nextProps.wallet.userAssets.map((userAsset) => {
        if (userAsset.coin === nextProps.trading.activeMarket.stock) {
          this.setState({ currentUserCryptoWallet: userAsset });
        }
        if (userAsset.coin === nextProps.trading.activeMarket.money) {
          this.setState({ currentUserFiatWallet: userAsset });
        } else {
        }
        return true;
      });
      if (!isEmpty(nextProps.user.userClientWallets)) {
        nextProps.user.userClientWallets.map((userClientWallet) => {
          if (userClientWallet.coin === nextProps.trading.activeMarket.stock) {
            this.setState({
              currentClientCryptoWallet: userClientWallet,
            });
          }
          if (userClientWallet.coin === nextProps.trading.activeMarket.money) {
            this.setState({
              currentClientFiatWallet: userClientWallet,
            });
          }
          return true;
        });
      }
    }

    if (!isEmpty(nextProps.user.userClientWallets)) {
      this.setState({
        userClientWallets: nextProps.user.userClientWallets,
      });
    }
  };

  createMarketOrder = async (value) => {
    await this.setState({ orderProcess: true });
    if (this.state.wsConnection) {
      if (isEmpty(this.state.marketAmount)) {
        this.setState({
          snackMessages: {
            variant: "error",
            message: "Enter value to place an order",
          },
          orderProcess: false,
        });

        // } else if(parseFloat(this.state.currentUserFiatWallet.walletAmount) <  this.state.marketSubtotal) {
        //     this.setState({snackMessages: {variant: 'error', message: 'Insuficent Balance'}});
      } else {
        if (this.state.newOrderDialog) {
          let currentMarket = this.props.trading.activeMarket;
          let userParams = {};
          const user = this.state.selectedClient;
          if (value === "buy") {
            if (
              parseFloat(this.state.currentClientFiatWallet.walletAmount) <
              this.state.marketSubtotal
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
              return false;
            } else {
              userParams.userId = user._id;
              userParams.user_id = parseInt(user._id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 2;
              userParams.price = this.state.marketLastBuy;
              userParams.amount = this.state.marketAmount;
              userParams.marketSubtotal = this.state.marketSubtotal;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeMarketOrder(userParams);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
                selectedClient: {},
              });
            }
          }

          if (value === "sell") {
            if (
              parseFloat(this.state.currentClientCryptoWallet.walletAmount) <
              this.state.marketAmount
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
              return false;
            } else {
              userParams.userId = user._id;
              userParams.user_id = parseInt(user._id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 1;
              userParams.price = this.state.marketLastSell;
              userParams.amount = this.state.marketAmount;
              userParams.marketSubtotal = this.state.marketSubtotal;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeMarketOrder(userParams);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
                selectedClient: {},
              });
            }
          }
        } else {
          let currentMarket = this.props.trading.activeMarket;
          let userParams = {};
          const { user } = this.props.auth;
          if (value === "buy") {
            if (
              parseFloat(this.state.currentUserFiatWallet.walletAmount) <
              this.state.marketSubtotal
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
              return false;
            } else {
              userParams.userId = user.id;
              userParams.user_id = parseInt(user.id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 2;
              userParams.price = this.state.marketLastBuy;
              userParams.amount = this.state.marketAmount;
              userParams.marketSubtotal = this.state.marketSubtotal;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeMarketOrder(userParams);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
                selectedClient: {},
              });
            }
          }

          if (value === "sell") {
            if (
              parseFloat(this.state.currentUserCryptoWallet.walletAmount) <
              this.state.marketAmount
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
              return false;
            } else {
              userParams.userId = user.id;
              userParams.user_id = parseInt(user.id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 1;
              userParams.price = this.state.marketLastSell;
              userParams.amount = this.state.marketAmount;
              userParams.marketSubtotal = this.state.marketSubtotal;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeMarketOrder(userParams);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
                selectedClient: {},
              });
            }
          }

          this.props.getUserOrders(
            user.id,
            currentMarket.name,
            currentMarket.stock,
            currentMarket.money
          );
          this.props.getPendingOrders(
            user.id,
            parseInt(user.id.replace(/\D/g, "")),
            currentMarket.name
          );
          this.props.getUserProfile(user.id);
          this.props.getActiveAssets(user.id);
        }
      }
    } else {
      this.setState({
        snackMessages: {
          variant: "error",
          message: "Websocket connection is closed.",
        },
        orderProcess: false,
      });
    }
  };

  createLimitOrder = async (value) => {
    await this.setState({ orderProcess: true });
    if (this.state.wsConnection) {
      if (isEmpty(this.state.limitPrice)) {
        this.setState({
          snackMessages: {
            variant: "error",
            message: "Enter value to place an order",
          },
          orderProcess: false,
        });
      } else {
        if (this.state.newOrderDialog) {
          let currentMarket = this.props.trading.activeMarket;
          let userParams = {};
          const user = this.state.selectedClient;
          if (value === "buy") {
            if (
              parseFloat(this.state.currentClientFiatWallet.walletAmount) <
              parseFloat(this.state.limitPrice) *
                parseFloat(this.state.limitAmount)
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
            } else {
              userParams.userId = user._id;
              userParams.user_id = parseInt(user._id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 2;
              userParams.amount = this.state.limitAmount;
              userParams.price = this.state.limitPrice;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.maker_fee_rate = this.state.makerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeLimitOrder(userParams);
              this.props.getUserOrders(
                user.id,
                currentMarket.name,
                currentMarket.stock,
                currentMarket.money
              );
              this.props.getPendingOrders(
                user.id,
                parseInt(user.id.replace(/\D/g, "")),
                currentMarket.name
              );
              this.props.getUserProfile(user.id);
              this.props.getActiveAssets(user.id);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
              });
            }
          }

          if (value === "sell") {
            if (
              parseFloat(this.state.currentClientCryptoWallet.walletAmount) <
              parseFloat(this.state.limitAmount)
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
            } else {
              userParams.userId = user._id;
              userParams.user_id = parseInt(user._id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 1;
              userParams.amount = this.state.limitAmount;
              userParams.price = this.state.limitPrice;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.maker_fee_rate = this.state.makerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeLimitOrder(userParams);
              this.props.getUserOrders(
                user.id,
                currentMarket.name,
                currentMarket.stock,
                currentMarket.money
              );
              this.props.getPendingOrders(
                user.id,
                parseInt(user.id.replace(/\D/g, "")),
                currentMarket.name
              );
              this.props.getUserProfile(user.id);
              this.props.getActiveAssets(user.id);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
              });
            }
          }
        } else {
          let currentMarket = this.props.trading.activeMarket;
          let userParams = {};
          const { user } = this.props.auth;
          if (value === "buy") {
            if (
              parseFloat(this.state.currentUserFiatWallet.walletAmount) <
              parseFloat(this.state.limitPrice) *
                parseFloat(this.state.limitAmount)
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
            } else {
              userParams.userId = user.id;
              userParams.user_id = parseInt(user.id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 2;
              userParams.amount = this.state.limitAmount;
              userParams.price = this.state.limitPrice;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.maker_fee_rate = this.state.makerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeLimitOrder(userParams);
              this.props.getUserOrders(
                user.id,
                currentMarket.name,
                currentMarket.stock,
                currentMarket.money
              );
              this.props.getPendingOrders(
                user.id,
                parseInt(user.id.replace(/\D/g, "")),
                currentMarket.name
              );
              this.props.getUserProfile(user.id);
              this.props.getActiveAssets(user.id);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
              });
            }
          }

          if (value === "sell") {
            if (
              parseFloat(this.state.currentUserCryptoWallet.walletAmount) <
              parseFloat(this.state.limitAmount)
            ) {
              this.setState({
                snackMessages: {
                  variant: "error",
                  message: "Insuficent Balance",
                },
                orderProcess: false,
              });
            } else {
              userParams.userId = user.id;
              userParams.user_id = parseInt(user.id.replace(/\D/g, ""));
              userParams.market = currentMarket.name;
              userParams.side = 1;
              userParams.amount = this.state.limitAmount;
              userParams.price = this.state.limitPrice;
              userParams.taker_fee_rate = this.state.takerFee;
              userParams.maker_fee_rate = this.state.makerFee;
              userParams.fiat = currentMarket.money;
              userParams.crypto = currentMarket.stock;
              userParams.source = "";
              await this.props.placeLimitOrder(userParams);
              this.props.getUserOrders(
                user.id,
                currentMarket.name,
                currentMarket.stock,
                currentMarket.money
              );
              this.props.getPendingOrders(
                user.id,
                parseInt(user.id.replace(/\D/g, "")),
                currentMarket.name
              );
              this.props.getUserProfile(user.id);
              this.props.getActiveAssets(user.id);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
              });
            }
          }
        }
      }
    } else {
      this.setState({
        snackMessages: {
          variant: "error",
          message: "Websocket connection is closed.",
        },
        orderProcess: false,
      });
    }
  };

  handleInputChange = (name) => (event) => {
    let isChangeMarket = this.state.isChangeMarket;
    if (name === "limitPrice") isChangeMarket = false;

    this.setState({ [name]: event.target.value, isChangeMarket });
    if (name === "marketAmount") {
      let marketSubtotal = 0.0;
      let marketApprox = 0.0;
      if (event.target.value === "") {
        this.setState({
          marketSubtotal: marketSubtotal,
          marketApprox: marketApprox,
        });
      } else {
        if (this.state.currentTrade === "buy") {
          marketSubtotal =
            parseFloat(event.target.value) +
            this.state.takerFee * parseFloat(event.target.value);
          marketApprox = (
            parseFloat(event.target.value) /
            parseFloat(this.state.marketLastBuy)
          ).toFixed(8);
          this.setState({
            marketSubtotal: marketSubtotal,
            marketApprox: marketApprox,
          });
        } else {
          marketSubtotal =
            parseFloat(event.target.value) *
              parseFloat(this.state.marketLastSell) -
            this.state.takerFee *
              (parseFloat(event.target.value) *
                parseFloat(this.state.marketLastSell));
          marketApprox = marketSubtotal.toFixed(2);
          this.setState({ marketSubtotal: marketApprox });
        }
      }
    }
  };

  handlebuyChange = (event, newValue) => {
    this.setState({ buyTabValue: newValue });
  };

  handleBuyCoinChange = (event, newValue) => {
    this.setState({ marketTabValue: newValue });
  };

  handleopenChange = (event, newValue) => {
    event.stopPropagation();
    this.setState({ openTabValue: newValue });
  };

  handleMainMenuClick = async (event, value) => {
    if (value === "currency") {
      this.setState({ anchorCurrencyEl: event.currentTarget });
    }

    if (value === "profile") {
      this.setState({ anchorEl: event.currentTarget });
    }

    if (value === "agent") {
      this.setState({ anchoragentEl: event.currentTarget });
    }
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.setState({
      anchorEl: null,
      anchorCurrencyEl: null,
      anchoragentEl: null,
    });
    this.props.logOut();
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      anchorCurrencyEl: null,
      anchoragentEl: null,
    });
  };

  activeMarket = async (market) => {
    let currentMarket = this.props.trading.activeMarket;
    await this.props.activeMarket(market);
    let newMarket = this.props.trading.activeMarket;
    // this.handleClose();
    if (this.state.ws.readyState === WebSocket.OPEN) {
      // console.log('reconnect');
      var umsg = JSON.stringify({
        id: 12121,
        method: "depth.unsubscribe",
        params: [currentMarket.name, 100, "0"],
      });
      this.state.ws.send(umsg);
      var udealMsg = JSON.stringify({
        id: 12121,
        method: "deals.unsubscribe",
        params: [currentMarket.name],
      });
      this.state.ws.send(udealMsg);

      var msg = JSON.stringify({
        id: 12121,
        method: "depth.subscribe",
        params: [newMarket.name, 100, "0"],
      });
      this.state.ws.send(msg);
      // var dealMsg = JSON.stringify({id: 12121, method: "deals.subscribe", params: [newMarket.name]});
      var dealMsg = JSON.stringify({
        id: 12121,
        method: "deals.subscribe",
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
          "EURUSDT",
          "GBPUSDT",
        ],
      });
      this.state.ws.send(dealMsg);
    }
    orderDeals = [];
    this.setState(
      {
        wsConnection: false,
        orderDeals: [],
        orderBookAsks: [],
        orderBookBids: [],
        marketLastSell: 1,
        marketLastBuy: 1,
        marketSubtotal: 0.0,
        marketApprox: 0.0,
        marketAmount: "",
        limitPrice: "",
        limitAmount: "",
        isChangeMarket: true,
        isDefaltMarketChange: true,
      },
      () => {
        if (this.state.ws.readyState === WebSocket.CLOSED) {
          this.wsConnect();
        }
      }
    );

    // if (currentMarket.money !== newMarket.money) {
    // }

    // if (newMarket.stock === 'BTX') {
    //     if (this.state.ws.readyState === WebSocket.CLOSED) {
    //         this.wsConnect();
    //     }
    // } else {
    //     if (currentMarket.money !== newMarket.money || currentMarket.stock === 'BTX') {
    //         if (this.state.ws.readyState === WebSocket.CLOSED) {
    //             this.wsConnect();
    //         }
    //     }
    // }
  };

  changeBuySell = (value) => {
    const { marketLastSell, marketLastBuy } = this.state;
    this.setState({
      currentTrade: value,
      marketAmount: "",
      limitPrice: value === "sell" ? marketLastSell : marketLastBuy,
      marketApprox: 0,
      marketSubtotal: 0,
    });
  };

  toggleMobileMenu = () => {
    this.setState({ mobileMenu: !this.state.mobileMenu });
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  cancelUserOrder = async (orderId) => {
    const { user } = this.props.auth;
    let currentMarket = this.props.trading.activeMarket;

    await this.props.cancelUserOrder(
      parseInt(user.id.replace(/\D/g, "")),
      user.id,
      currentMarket.name,
      orderId,
      currentMarket.stock,
      currentMarket.money,
      this.state.makerFee
    );
    await this.props.getUserOrders(
      user.id,
      currentMarket.name,
      currentMarket.stock,
      currentMarket.money
    );
    await this.props.getPendingOrders(
      user.id,
      parseInt(user.id.replace(/\D/g, "")),
      currentMarket.name
    );
    await this.props.getUserProfile(user.id);
    await this.props.getActiveAssets(user.id);
  };

  getMarketLast = (marketName) => {
    if (marketName in this.props.trading.marketLast) {
      return parseFloat(this.props.trading.marketLast[marketName]).toFixed(2);
    }
  };

  getMarketCoin = (marketName) => {
    let marketCoin = marketName;
    if (
      marketName === "tbtcAED" ||
      marketName === "BTCAED" ||
      marketName === "tbtcINR" ||
      marketName === "BTCINR" ||
      marketName === "BTCUSDT"
    ) {
      marketCoin = "btcusd";
    }
    if (
      marketName === "tbchAED" ||
      marketName === "BCHAED" ||
      marketName === "tbchINR" ||
      marketName === "BCHINR" ||
      marketName === "BCHUSDT"
    ) {
      marketCoin = "bchusd";
    }
    if (
      marketName === "tltcAED" ||
      marketName === "LTCAED" ||
      marketName === "tltcINR" ||
      marketName === "LTCINR" ||
      marketName === "LTCUSDT"
    ) {
      marketCoin = "ltcusd";
    }
    if (
      marketName === "tzecAED" ||
      marketName === "ZEDAED" ||
      marketName === "tzecINR" ||
      marketName === "ZEDINR" ||
      marketName === "ZEDUSDT"
    ) {
      marketCoin = "zecusd";
    }
    if (
      marketName === "txlmAED" ||
      marketName === "XLMAED" ||
      marketName === "txlmINR" ||
      marketName === "XLMINR" ||
      marketName === "XLMUSDT"
    ) {
      marketCoin = "xlmusd";
    }
    if (
      marketName === "tdashAED" ||
      marketName === "DASHAED" ||
      marketName === "tdashINR" ||
      marketName === "DASHINR" ||
      marketName === "DASHUSDT"
    ) {
      marketCoin = "dashusd";
    }
    if (
      marketName === "XRPAED" ||
      marketName === "XRPINR" ||
      marketName === "XRPUSDT"
    ) {
      marketCoin = "xrpusd";
    }
    if (
      marketName === "ETHAED" ||
      marketName === "ETHINR" ||
      marketName === "ETHUSDT"
    ) {
      marketCoin = "ethusd";
    }
    return marketCoin;
  };

  keyPressEvent = async (key, e) => {
    if (this.props.auth.user.agent) {
      this.setState({ userClientWallets: [] });
      e.preventDefault();
      if (key === "n") {
        this.setState({ newOrderDialog: false });
      }
      if (key === "o") {
        this.setState({ openOrdersList: true, clientOpenOrders: [] });
      }
      if (key === "c") {
        this.setState({ newOrderDialog: false });
      }
      if (key === "a") {
        this.setState({ finishedOrdersList: true, clientOrders: [] });
      }
      if (key === "b") {
        this.setState({
          newOrderDialog: true,
          currentTrade: "buy",
        });
      }
      if (key === "s") {
        this.setState({
          newOrderDialog: true,
          currentTrade: "sell",
        });
      }
    }
  };

  makeAnchoragentElNull = () => {
    this.setState({ anchoragentEl: null });
  };

  handleClientOrderTabChange = (event, newValue) => {
    this.setState({ clientOrderTab: newValue });
  };

  loadClientDetails = async (client) => {
    if (client) {
      this.setState({ ajaxProcess: true, selectedClient: client });
      await this.props.getUserClientWallets(client._id);
      if (this.state.openOrdersList) {
        let currentMarket = this.props.trading.activeMarket;
        await this.props.getClientPendingOrders(
          this.state.selectedClient._id,
          parseInt(this.state.selectedClient._id.replace(/\D/g, "")),
          currentMarket.name
        );
        this.setState({
          clientOpenOrders: this.props.trading.pendingClientOrders,
        });
        // console.log(this.props.trading);
      }
      if (this.state.finishedOrdersList) {
        let currentMarket = this.props.trading.activeMarket;
        await this.props.getClientOrders(
          this.state.selectedClient._id,
          currentMarket.name,
          currentMarket.stock,
          currentMarket.money
        );
        this.setState({
          clientOrders: this.props.trading.clientOrders,
        });
        // console.log(this.props.trading);
      }
      this.setState({ ajaxProcess: false });
    }
  };

  myKeyEvent = (event) => {
    if (this.props.auth.isAuthenticated) {
      this.setState({ userClientWallets: [] });
      var x = event.keyCode;
      if (x === 65) {
        // 27 is the ESC key
        this.setState({ finishedOrdersList: true, clientOrders: [] });
      }
      if (x === 79) {
        // 27 is the ESC key
        this.setState({ openOrdersList: true, clientOpenOrders: [] });
      }
      if (x === 66) {
        // 27 is the ESC key
        this.setState({
          newOrderDialog: true,
          currentTrade: "buy",
        });
      }
      if (x === 83) {
        // 27 is the ESC key
        this.setState({
          newOrderDialog: true,
          currentTrade: "sell",
        });
      }
    }
  };

  convertUserDefaultFiatToCrypto = (marketName, availableBalance) => {
    marketName = `${marketName}${this.state.currentUserFiatWallet.coin}`;
    if (
      this.state.currentUserFiatWallet.coin &&
      !isEmpty(this.state.marketLast[marketName])
    ) {
      const cryptoFiatPrice = !isEmpty(this.state.marketLast)
        ? parseFloat(this.state.marketLast[marketName].last).toFixed(2)
        : 0.0;
      return (availableBalance * cryptoFiatPrice).toFixed(4);
    }
    return 0.0;
  };

  getCurrentTradeBidValue = () => {
    this.setState({
      limitPrice: this.state.marketLastBuy,
    });
  };

  getCurrentTradeAskValue = () => {
    this.setState({
      limitPrice: this.state.marketLastSell,
    });
  };

  render() {
    const { classes, trading, auth, location } = this.props;
    const {
      dispalyMarkets,
      mobileMenu,
      orderBookBids,
      orderBookAsks,
      orderDeals,
      errors,
      marketAmount,
      currentUserFiatWallet,
      currentUserCryptoWallet,
      snackMessages,
      variant,
      snackbarMessage,
      limitPrice,
      limitAmount,
    } = this.state;

    const { agentClients } = this.props.user;

    // console.log('taker maker', this.state.takerFee, this.state.makerFee)

    let pathname = location.pathname;
    let activeStock = "BTC";
    let activeMoney = "AED";
    if (!isEmpty(trading.activeMarket)) {
      activeStock = trading.activeMarket.stock;
      activeMoney = trading.activeMarket.money;
    }

    let displayMarketDom = [];
    // for(let key in dispalyMarkets) {
    //     displayMarketDom.push(<div className="item" key={key}>
    //     <div className="title">
    //         {key}
    //     </div>
    //     <div className="currnecyListItem">
    //         {
    //             dispalyMarkets[key].map(market =>
    //             <ListItem key={market._id}>
    //                 <Link to={'#'} onClick={() => this.activeMarket(market)}>
    //                     <span> {market.stock} / {market.money} </span> {market.money} {
    //                             (!isEmpty(this.state.marketLast)) ?
    //                             (this.state.marketLast[market.name]) ?
    //                             (parseFloat(this.state.marketLast[market.name].ask)).toFixed(2) :
    //                             0.00 : 0.00
    //                         }
    //                 </Link>
    //             </ListItem>)
    //         }
    //     </div>
    // </div>);
    // }
    let chartCoin = activeStock;
    if (activeStock === "tbtc") {
      chartCoin = "BTC";
    }
    if (activeStock === "tbch") {
      chartCoin = "BCH";
    }
    if (activeStock === "tltc") {
      chartCoin = "LTC";
    }
    if (activeStock === "tzec") {
      chartCoin = "ZEC";
    }
    if (activeStock === "txlm") {
      chartCoin = "XLM";
    }
    if (activeStock === "tdash") {
      chartCoin = "DASH";
    }

    const defaultProps = {
      options: agentClients,
      getOptionLabel: (option) => `${option.firstname} ${option.lastname}`,
    };

    return (
      <React.Fragment>
        {auth.isAuthenticated ? (
          <KeyboardEventHandler
            isExclusive={true}
            handleKeys={["o", "x", "n", "a", "b", "s"]}
            onKeyEvent={(key, e) => this.keyPressEvent(key, e)}
          />
        ) : undefined}
        <Helmet id="tradePage">
          <title className="next-head">Trade | Trillionbit</title>
          <meta
            name="description"
            content="Trillionbit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, bitex, Trillionbit india, Trillionbit crypto, Trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta property="og:url" content="https://www.bitex.com/trading" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Trade | Trillionbit" />
          <meta property="og:site_name" content="Trillionbit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Trade | Trillionbit" />
          <meta property="twitter:site" content="Trillionbit" />
          <meta
            property="twitter:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:image:src"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
        </Helmet>
        <Dialog
          open={this.state.openOrdersList}
          onClose={() =>
            this.setState({
              openOrdersList: !this.state.openOrdersList,
            })
          }
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth="md"
          transitionDuration={0}
          style={{ minHeight: 676 }}
        >
          <DialogTitle id="form-dialog-title">Open Orders</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item sm={6}>
                <Autocomplete
                  {...defaultProps}
                  id="selectClient"
                  onChange={(event, newValue) => {
                    this.loadClientDetails(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Client"
                      margin="normal"
                    />
                  )}
                />
                <Typography>Open orders</Typography>
              </Grid>
              <Grid item sm={12}>
                <MaterialTable
                  className="dataListCard"
                  title="Open Orders"
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                    pageSizeOptions: [],
                  }}
                  localization={{
                    pagination: {
                      labelDisplayedRows: "",
                      previousAriaLabel: "",
                    },
                  }}
                  icons={tableIcons}
                  columns={[
                    {
                      title: "Market",
                      field: "market",
                      render: (rowData) => {
                        return `${rowData.side === 1 ? "Sell" : "Buy"} - ${
                          rowData.type === 1 ? "Limit" : "Market"
                        } (${rowData.market})`;
                      },
                    },
                    { title: "Amount", field: "amount" },
                    { title: "Price", field: "price" },
                    {
                      title: "Date",
                      field: "updateDate",
                      render: (rowData) => {
                        return moment(rowData.updateDate).format("LLL");
                      },
                    },
                    {
                      title: "Cancel",
                      render: (rowData) => (
                        <IconButton size="small">
                          <tableIcons.Close />
                        </IconButton>
                      ),
                    },
                  ]}
                  data={this.state.clientOpenOrders}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  openOrdersList: !this.state.openOrdersList,
                })
              }
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.finishedOrdersList}
          onClose={() =>
            this.setState({
              finishedOrdersList: !this.state.finishedOrdersList,
            })
          }
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth="md"
          style={{ minHeight: 676 }}
        >
          <DialogTitle id="form-dialog-title">All Orders</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Autocomplete
                  {...defaultProps}
                  id="selectClient"
                  onChange={(event, newValue) => {
                    this.loadClientDetails(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Client"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12}>
                <MaterialTable
                  className="dataListCard"
                  title="Orders"
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                    pageSizeOptions: [],
                  }}
                  localization={{
                    pagination: {
                      labelDisplayedRows: "",
                      previousAriaLabel: "",
                    },
                  }}
                  onRowClick={(event, rowData) => {
                    console.log(rowData);
                  }}
                  onSelectionChange={(event, rowData) => {
                    console.log(rowData);
                  }}
                  icons={tableIcons}
                  columns={[
                    {
                      title: "Market",
                      field: "market",
                      render: (rowData) => {
                        return `${rowData.side === 1 ? "Sell" : "Buy"} - ${
                          rowData.type === 1 ? "Limit" : "Market"
                        } (${rowData.market})`;
                      },
                    },
                    { title: "Amount", field: "amount" },
                    { title: "Price", field: "price" },
                    { title: "Status", field: "status" },
                    {
                      title: "Date",
                      field: "updateDate",
                      type: "datetime",
                      render: (rowData) => {
                        return moment(rowData.updateDate).format("LLL");
                      },
                    },
                    {
                      title: "Action",
                      render: (rowData) => {
                        if (rowData.status === "Open") {
                          return (
                            <IconButton size="small">
                              <tableIcons.Close />
                            </IconButton>
                          );
                        } else {
                          return undefined;
                        }
                      },
                    },
                  ]}
                  data={this.state.clientOrders}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  finishedOrdersList: !this.state.finishedOrdersList,
                })
              }
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.newOrderDialog}
          onClose={() =>
            this.setState({
              newOrderDialog: !this.state.newOrderDialog,
            })
          }
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth="md"
          transitionDuration={0}
          style={{ minHeight: 676 }}
          className="OrderDialog"
        >
          <DialogTitle
            id="form-dialog-title"
            className={
              this.state.currentTrade === "buy"
                ? "orderTitle buy"
                : "orderTitle sell"
            }
          >
            New {this.state.currentTrade === "buy" ? "Buy" : "Sell"} Order
          </DialogTitle>

          <DialogContent>
            <Grid container>
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  {...defaultProps}
                  id="selectClient"
                  openonfocus="true"
                  onChange={(event, newValue) => {
                    this.loadClientDetails(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Client"
                      margin="normal"
                    />
                  )}
                />
                <FormControl component="fieldset" style={{ marginTop: 10 }}>
                  <FormLabel component="legend">Order Type</FormLabel>
                  <RadioGroup
                    aria-label="clientOrderTab"
                    name="clientOrderTab"
                    value={this.state.clientOrderTab}
                    onChange={(event) =>
                      this.setState({
                        clientOrderTab: event.target.value,
                      })
                    }
                    row
                  >
                    <FormControlLabel
                      value="market"
                      control={<Radio />}
                      label="Market"
                    />
                    <FormControlLabel
                      value="limit"
                      control={<Radio />}
                      label="Limit"
                    />
                  </RadioGroup>
                </FormControl>

                {this.state.clientOrderTab === "market" ? (
                  <TextField
                    error={errors.marketAmount ? true : false}
                    value={marketAmount}
                    onChange={this.handleInputChange("marketAmount")}
                    type="number"
                    fullWidth={true}
                    placeholder={
                      `I want to ${this.state.currentTrade} (in ` +
                      (this.state.currentTrade === "buy"
                        ? `${activeMoney})`
                        : `${activeStock})`)
                    }
                    // className={classes.input}
                    style={{ paddingTop: 10 }}
                    inputProps={{
                      "aria-label": "market-amount",
                    }}
                  />
                ) : undefined}

                {this.state.clientOrderTab === "limit" ? (
                  <div>
                    <TextField
                      error={errors.limitAmount ? true : false}
                      value={limitAmount}
                      onChange={this.handleInputChange("limitAmount")}
                      type="number"
                      fullWidth={true}
                      placeholder={`I want to ${this.state.currentTrade} (in ${activeStock})`}
                      // className={classes.input}
                      style={{ paddingTop: 10 }}
                      inputProps={{
                        "aria-label": "description",
                      }}
                    />

                    <TextField
                      error={errors.limitPrice ? true : false}
                      value={limitPrice}
                      onChange={this.handleInputChange("limitPrice")}
                      type="number"
                      fullWidth={true}
                      placeholder={`I want to ${this.state.currentTrade} (in ${activeMoney})`}
                      // className={classes.input}
                      style={{ paddingTop: 10 }}
                      inputProps={{
                        "aria-label": "description",
                      }}
                    />
                  </div>
                ) : undefined}

                {this.state.clientOrderTab === "market" ? (
                  <div>
                    <div
                      style={{
                        paddingTop: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography component="h5">Fee</Typography>

                      <Typography component="h5">
                        {this.state.takerFee * 100} %
                      </Typography>
                    </div>

                    {this.state.currentTrade === "buy" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography component="h5">Approx:</Typography>

                        <Typography component="h5">
                          {this.state.marketApprox}{" "}
                          {this.state.currentTrade === "buy"
                            ? `${activeStock}`
                            : `${activeMoney}`}
                        </Typography>
                      </div>
                    ) : (
                      ""
                    )}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography component="h5">Subtotal:</Typography>

                      <Typography component="h5">
                        {this.state.marketSubtotal} {activeMoney}
                      </Typography>
                    </div>
                  </div>
                ) : undefined}

                {this.state.currentTrade === "buy" ? (
                  this.state.clientOrderTab === "limit" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 10 }}
                      onClick={() => this.createLimitOrder("buy")}
                      disabled={
                        this.state.orderProcess || !this.state.wsConnection
                      }
                      className={
                        this.state.currentTrade === "buy"
                          ? "btn buyMarket"
                          : "btn sellMarket"
                      }
                    >
                      {this.state.orderProcess || !this.state.wsConnection ? (
                        <CircularProgress size={24} color="secondary" />
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 10 }}
                      onClick={() => this.createMarketOrder("buy")}
                      disabled={
                        this.state.orderProcess || !this.state.wsConnection
                      }
                      className={
                        this.state.currentTrade === "buy"
                          ? "btn buyMarket"
                          : "btn sellMarket"
                      }
                    >
                      {this.state.orderProcess || !this.state.wsConnection ? (
                        <CircularProgress size={24} color="secondary" />
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  )
                ) : this.state.clientOrderTab === "limit" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => this.createLimitOrder("sell")}
                    disabled={
                      this.state.orderProcess || !this.state.wsConnection
                    }
                    className={
                      this.state.currentTrade === "buy"
                        ? "btn buyMarket"
                        : "btn sellMarket"
                    }
                  >
                    {this.state.orderProcess || !this.state.wsConnection ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      "Sell"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => this.createMarketOrder("sell")}
                    disabled={
                      this.state.orderProcess || !this.state.wsConnection
                    }
                    className={
                      this.state.currentTrade === "buy"
                        ? "btn buyMarket"
                        : "btn sellMarket"
                    }
                  >
                    {this.state.orderProcess || !this.state.wsConnection ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      "Sell"
                    )}
                  </Button>
                )}
              </Grid>
              <Grid item sm={6} xs={12} style={{ textAlign: "center" }}>
                <List className={classes.root}>
                  <ListSubheader>{`Current Market`}</ListSubheader>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <img
                          src={currencyIcon(activeStock)}
                          width="40"
                          alt="Im"
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${activeStock}/${activeMoney}`}
                      secondary={
                        <CurrencyFormat
                          value={
                            !isEmpty(this.state.marketLast)
                              ? this.state.marketLast[
                                  `${activeStock}${activeMoney}`
                                ]
                                ? parseFloat(
                                    this.state.marketLast[
                                      `${activeStock}${activeMoney}`
                                    ].last
                                  ).toFixed(2)
                                : 0.0
                              : 0.0
                          }
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={`${
                            activeMoney === "INR" ? "₹" : activeMoney
                          } `}
                        />
                      }
                    />
                    <Typography>{`${parseFloat(
                      currentUserFiatWallet.walletAmount
                    ).toFixed(2)} ${currentUserFiatWallet.coin} | ${parseFloat(
                      currentUserCryptoWallet.walletAmount
                    ).toFixed(2)} ${currentUserCryptoWallet.coin}`}</Typography>
                  </ListItem>
                  <ListSubheader>{`Available Markets`}</ListSubheader>
                  {trading.markets.map((userAsset, index) => {
                    if (
                      this.state.currentClientFiatWallet.coin ===
                      userAsset.money
                    ) {
                      return (
                        <ListItem
                          key={index}
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => this.activeMarket(userAsset)}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <img
                                src={currencyIcon(userAsset.stock)}
                                width="40"
                                alt="Im"
                              />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={userAsset.displayName}
                            secondary={`${userAsset.stock}/${userAsset.money}`}
                          />
                          <CurrencyFormat
                            value={
                              !isEmpty(this.state.marketLast)
                                ? this.state.marketLast[userAsset.name]
                                  ? parseFloat(
                                      this.state.marketLast[userAsset.name].last
                                    ).toFixed(2)
                                  : 0.0
                                : 0.0
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={`${
                              userAsset.money === "INR" ? "₹" : userAsset.money
                            } `}
                          />
                        </ListItem>
                      );
                    } else {
                      return undefined;
                    }
                  })}
                </List>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  newOrderDialog: !this.state.newOrderDialog,
                })
              }
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={!isEmpty(snackMessages) ? true : false}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
        >
          <SnackbarMessage
            onClose={this.handleSnackbarClose}
            variant={!isEmpty(snackMessages) ? snackMessages.variant : variant}
            message={
              !isEmpty(snackMessages) ? snackMessages.message : snackbarMessage
            }
          />
        </Snackbar>

        <Modal
          open={this.state.orderBookModal}
          onClose={() => this.setState({ orderBookModal: false })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className="tradeBody tradeModal"
        >
          <div className="tradeBox orderBox">
            <div className="headTitle">
              <Typography component="h6">Orderbook</Typography>
              <CloseIcon
                onClick={() => this.setState({ orderBookModal: false })}
              />
            </div>
            <div className="tableFixHead">
              <div className="tableHead">
                <List className="data">
                  <ListItem className="tableData table-subheading" id="">
                    <div className="amount">Amount</div>
                    <div className="bid">Bid</div>
                  </ListItem>
                </List>
              </div>
              <div className="tableHead">
                <List className="data">
                  <ListItem className="tableData table-subheading" id="">
                    <div className="value"> Ask </div>
                    <div className="amount">Amount</div>
                  </ListItem>
                </List>
              </div>
            </div>
            {this.state.wsConnection ? (
              <div className="orderbookData">
                <div className="table">
                  <List className="data">
                    {orderBookBids.map((bid, index) => (
                      <ListItem
                        key={index}
                        className={
                          newBids.includes(bid)
                            ? bid.new
                              ? "tableData bid-list newBid"
                              : "tableData bid-list"
                            : bid.new
                            ? "tableData newBid"
                            : "tableData"
                        }
                        id=""
                      >
                        {/* <div className="value" id="trades_value"> {(parseFloat(bid.amount) * parseFloat(bid.price))} </div> */}
                        {/* <div className="value" id="trades_value"> </div> */}
                        {/* <div className="amount trades_bid_amount" id="trades_amount"> {bid[1]} </div> */}
                        <div
                          className="amount trades_bid_amount"
                          id="trades_amount"
                        >
                          {" "}
                          {this.state.currentClientCryptoWallet.coin === "BTX"
                            ? bid[1]
                            : bid.amount}{" "}
                        </div>

                        {/* <div className="bid" id="trades_bid"> {parseFloat(bid[0]).toFixed(2)} </div> */}
                        <div className="bid" id="trades_bid">
                          {" "}
                          {this.state.currentClientCryptoWallet.coin === "BTX"
                            ? bid[0]
                            : bid.price}{" "}
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>

                <div className="table">
                  <List className="data">
                    {orderBookAsks.map((ask, index) => (
                      <ListItem
                        key={index}
                        className={
                          newAsks.includes(ask[0])
                            ? ask.new
                              ? "tableData ask-list newAsk"
                              : "tableData ask-list"
                            : ask.new
                            ? "tableData newAsk"
                            : "tableData"
                        }
                        id=""
                      >
                        {/* <div className="ask" id="trades_ask"> {parseFloat(ask[0]).toFixed(2)} </div> */}
                        {/* <div className="value" id="trades_value"> {(parseFloat(ask.amount) * (parseFloat(ask.price))).toFixed(2)} </div> */}
                        {/* <div className="amount trades_ask_amount" id="trades_amount2"> {ask[1]} </div> */}
                        <div className="ask" id="trades_ask">
                          {" "}
                          {ask.price}{" "}
                        </div>
                        {/* <div className="value trades_ask_amount" id="trades_value2"> {(parseFloat(ask[1]) * (parseFloat(ask[0]).toFixed(2))).toFixed(2)} </div> */}
                        <div
                          className="amount trades_ask_amount"
                          id="trades_amount2"
                        >
                          {" "}
                          {ask.amount}{" "}
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </div>
            ) : (
              <div className="orderbookData">
                <div className="connectingbox">
                  <img src={wifiImg} alt="logo" />
                  <Typography variant="body2" className="">
                    Connecting...
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </Modal>

        <div className=""> </div>
        <Container
          maxWidth="lg"
          className="mainbody tradeBody bgBlack"
          fixed={false}
          style={dashboardStyle.mainContainer}
          onKeyDown={this.myKeyEvent}
        >
          <Grid container className="tradeBar">
            <Grid item xs={12} sm={3} className="tradelogo">
              <Link className="logoBox" to="/">
                <img src={whiteLogoImg} alt="logo" />
              </Link>

              <div className="mobileMenu">
                <Link
                  to={"#"}
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                  variant="contained"
                  color="primary"
                  onClick={() => this.toggleMobileMenu()}
                >
                  <Typography variant="body1" className="">
                    <MenuIcon className="trt" />
                  </Typography>
                </Link>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={9}
              className={mobileMenu ? "tradelinks active" : "tradelinks"}
            >
              {auth.isAuthenticated ? (
                <AuthLink
                  auth={this.props.auth}
                  pathname={pathname}
                  anchoragentEl={this.state.anchoragentEl}
                  anchorEl={this.state.anchorEl}
                  avatar={this.props.auth.currentLoginUser?.avatar}
                  apiUrl={apiUrl}
                  classes={classes}
                  handleMainMenuClick={this.handleMainMenuClick}
                  handleClose={this.handleClose}
                  keyPressEvent={this.keyPressEvent}
                  makeAnchoragentElNull={this.makeAnchoragentElNull}
                  onLogoutClick={this.onLogoutClick}
                />
              ) : (
                <GuestLink pathname={pathname} />
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={2} sm={12} className="leftCol">
              <MarketList
                marketTabValue={this.state.marketTabValue}
                handleBuyCoinChange={this.handleBuyCoinChange}
                marketList={dispalyMarkets}
                changeActiveMarket={this.activeMarket}
                marketLast={this.state.marketLast}
                isDefaltMarketChange={this.state.isDefaltMarketChange}
                activeMarket={trading.activeMarket}
              />

              <AssetsAllocation
                userWallet={this.props.wallet?.userAssets}
                isAuthenticated={auth.isAuthenticated}
                currentUserFiatWallet={this.state.currentUserFiatWallet}
                activeMarket={trading.activeMarket}
                isDefaltMarketChange={this.state.isDefaltMarketChange}
                convertUserDefaultFiatToCrypto={
                  this.convertUserDefaultFiatToCrypto
                }
              />
            </Grid>

            <Grid item xs={12} md={7} sm={12} className="padding0 centerCol">
              <Grid container>
                <Graph
                  activeMoney={activeMoney}
                  chartCoin={chartCoin}
                  currentUserCryptoWallet={currentUserCryptoWallet}
                  currentUserFiatWallet={currentUserFiatWallet}
                  trading={trading}
                  marketLast={this.state.marketLast}
                />

                <Grid container>
                  <OrderBook
                    orderBookBids={orderBookBids}
                    orderBookAsks={orderBookAsks}
                    wsConnection={this.state.wsConnection}
                    openOrderBookModal={() =>
                      this.setState({
                        orderBookModal: true,
                      })
                    }
                  />

                  <Trade
                    orderDeals={orderDeals}
                    activeMarket={trading.activeMarket}
                  />
                </Grid>
              </Grid>
            </Grid>

            {auth.isAuthenticated ? (
              <UserTrade
                state={{ ...this.state }}
                classes={classes}
                activeStock={activeStock}
                activeMoney={activeMoney}
                marketAmount={marketAmount}
                limitAmount={limitAmount}
                limitPrice={limitPrice}
                errors={errors}
                trading={trading}
                currentUserFiatWallet={currentUserFiatWallet}
                currentUserCryptoWallet={currentUserCryptoWallet}
                changeBuySell={this.changeBuySell}
                handlebuyChange={this.handlebuyChange}
                handleInputChange={this.handleInputChange}
                createMarketOrder={this.createMarketOrder}
                createLimitOrder={this.createLimitOrder}
                handleopenChange={this.handleopenChange}
                cancelUserOrder={this.cancelUserOrder}
                getCurrentTradeBidValue={this.getCurrentTradeBidValue}
                getCurrentTradeAskValue={this.getCurrentTradeAskValue}
                maintenance={trading.maintenance.trading?.includes(
                  `${activeStock}${activeMoney}`
                )}
              />
            ) : (
              <Grid item xs={12} md={3} sm={12} className="rightCol">
                <div className="tabBox fullHeight">
                  <div className="headTitle">
                    <Typography component="h6">START TRADING</Typography>
                  </div>

                  <div className="tradingLogin">
                    <Link to="/login">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Log in
                      </Button>
                    </Link>

                    <Link to="/register">
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                      >
                        Register
                      </Button>
                    </Link>

                    <Typography component="h2">
                      Welcome to Trillionbit
                    </Typography>

                    <Typography component="h5">
                      A leading crypto exchange.
                    </Typography>

                    <Typography component="h5">
                      We provide premium access to cryptocurrency trading for
                      both individuals and institutional clients through:
                    </Typography>

                    <List className="aboutList">
                      <ListItem>Volume-based fee structure</ListItem>
                      <ListItem>High performance matching engine</ListItem>
                      <ListItem>Websocket and HTTP API connectivity</ListItem>
                      <ListItem>
                        24/7 service and dedicated premium support
                      </ListItem>
                      <ListItem>Industry-leading security practices</ListItem>
                    </List>
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

const dashboardStyle = {
  mainContainer: {
    maxWidth: "100%",
  },
  roundedButton: {
    margin: 2,
  },
};

TradingView.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  snackMessages: PropTypes.object.isRequired,
  getOrderDepth: PropTypes.func.isRequired,
  getAvailaleMarkets: PropTypes.func.isRequired,
  activeMarket: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  getUserOrders: PropTypes.func.isRequired,
  placeMarketOrder: PropTypes.func.isRequired,
  placeLimitOrder: PropTypes.func.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  getUserWallet: PropTypes.func.isRequired,
  getActiveAssets: PropTypes.func.isRequired,
  clearSnackMessages: PropTypes.func.isRequired,
  getPendingOrders: PropTypes.func.isRequired,
  cancelUserOrder: PropTypes.func.isRequired,
  getMarketLast: PropTypes.func.isRequired,
  getAgentClients: PropTypes.func.isRequired,
  getUserClientWallets: PropTypes.func.isRequired,
  getClientOrders: PropTypes.func.isRequired,
  getClientPendingOrders: PropTypes.func.isRequired,
  getFinalMarketLast: PropTypes.func.isRequired,
  getBtxMarketData: PropTypes.func.isRequired,
  getBtxAedMarketData: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  wallet: state.wallet,
  trading: state.trading,
  errors: state.errors,
  snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
  getOrderDepth,
  getAvailaleMarkets,
  activeMarket,
  logOut,
  getUserOrders,
  placeMarketOrder,
  placeLimitOrder,
  getUserProfile,
  getUserWallet,
  getActiveAssets,
  clearSnackMessages,
  getPendingOrders,
  cancelUserOrder,
  getMarketLast,
  getAgentClients,
  getUserClientWallets,
  getClientOrders,
  getClientPendingOrders,
  getFinalMarketLast,
  getBtxMarketData,
  getBtxAedMarketData,
  getTradingMaintenance,
})(withStyles(themeStyles)(TradingView));
