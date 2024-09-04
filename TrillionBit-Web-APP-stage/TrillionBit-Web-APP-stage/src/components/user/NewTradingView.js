import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@mui/styles/";
import { Helmet } from "react-helmet";

import { ExpandMore } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import KeyboardEventHandler from "react-keyboard-event-handler";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  List,
  ListItem,
  Tab,
  Tabs,
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

import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";

import {
  getOrderDepth,
  getUserOrders,
  getClientOrders,
  placeMarketOrder,
  placeLimitOrder,
  getPendingOrders,
  getClientPendingOrders,
  cancelUserOrder,
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
import apiUrl from "../../config";
import currencyIcon from "../../common/CurrencyIcon";
import MaterialTable from "material-table";

import wifiImg from "../../assets/img/loader.webp";
import whiteLogoImg from "../../assets/img/white-logo.webp";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { createChart } from "lightweight-charts";

import btcCoin from "../../assets/img/coins/btc.webp";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// const chart = createChart(document.body, { width: 400, height: 300 });
// const lineSeries = chart.addLineSeries();
// lineSeries.setData([
//     { time: '2019-04-11', value: 80.01 },
//     { time: '2019-04-12', value: 96.63 },
//     { time: '2019-04-13', value: 76.64 },
//     { time: '2019-04-14', value: 81.89 },
//     { time: '2019-04-15', value: 74.43 },
//     { time: '2019-04-16', value: 80.01 },
//     { time: '2019-04-17', value: 96.63 },
//     { time: '2019-04-18', value: 76.64 },
//     { time: '2019-04-19', value: 81.89 },
//     { time: '2019-04-20', value: 74.43 },
// ]);

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

class NewTradingView extends Component {
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
    currentUserFiatWallet: { coin: "USD" },
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
  };

  handleBuyCoinChange = (event, newValue) => {
    this.setState({ marketTabValue: newValue });
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
    const currentIpLocation = await getIpLocation(await publicIp.v4());
    this.setState({
      currentUserFiatWallet: {
        coin:
          currentIpLocation.country.code === "IN"
            ? "INR"
            : currentIpLocation.country.code === "AE"
            ? "AED"
            : "USD",
      },
    });
    // window.fcWidget.destroy();
    const { auth } = this.props;
    await this.props.getAvailaleMarkets();
    await this.props.getMarketLast();
    await this.props.getFinalMarketLast();
    await this.props.getBtxMarketData();
    await this.props.getBtxAedMarketData();

    if (auth.isAuthenticated) {
      await this.props.getActiveAssets(auth.user.id);
    }

    for (let ckey in this.props.wallet.userAssets) {
      if (
        this.props.wallet.userAssets[ckey].fiat &&
        this.props.wallet.userAssets[ckey].active
      ) {
        await this.setState({
          currentUserFiatWallet: this.props.wallet.userAssets[ckey],
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
      this.setState({
        marketLast: marketLast,
        finalMarketLast: finalMarketLast,
      });
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

    if (!isEmpty(this.props.wallet.bitexMarket)) {
      let marketLast = this.state.marketLast;
      marketLast["BTXINR"] = {};
      marketLast["BTXINR"]["last"] = this.props.wallet.bitexMarket.last;
      marketLast["BTXINR"]["open"] = this.props.wallet.bitexMarket.open;
      marketLast["BTXINR"]["ask"] = this.props.wallet.bitexMarket.high;
      marketLast["BTXINR"]["bid"] = this.props.wallet.bitexMarket.open;
      marketLast["BTXINR"]["high"] = this.props.wallet.bitexMarket.high;
      marketLast["BTXINR"]["low"] = this.props.wallet.bitexMarket.low;
      marketLast["BTXINR"]["close"] = this.props.wallet.bitexMarket.close;

      marketLast["BTXAED"] = {};
      marketLast["BTXAED"]["last"] = this.props.wallet.bitexAedMarket.last;
      marketLast["BTXAED"]["open"] = this.props.wallet.bitexAedMarket.open;
      marketLast["BTXAED"]["ask"] = this.props.wallet.bitexAedMarket.high;
      marketLast["BTXAED"]["bid"] = this.props.wallet.bitexAedMarket.open;
      marketLast["BTXAED"]["high"] = this.props.wallet.bitexAedMarket.high;
      marketLast["BTXAED"]["low"] = this.props.wallet.bitexAedMarket.low;
      marketLast["BTXAED"]["close"] = this.props.wallet.bitexAedMarket.close;
      this.setState({ marketLast: marketLast });
    }

    // setInterval(() => {
    //     if (this.props.history.location.pathname === '/trading') {
    //         if (this.state.ws){
    //             if (this.state.ws.readyState === WebSocket.OPEN) {
    //                 //
    //             } else {
    //                 this.wsConnect();
    //             }
    //         } else {
    //             this.wsConnect();
    //         }
    //     }
    // }, 2000);
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
      await this.props.getUserProfile(auth.user.id);
      await this.props.getActiveAssets(auth.user.id);

      if (auth.user.agent) {
        await this.props.getAgentClients(auth.user.id);
      }
    }
  };

  /**
   * Serializes data when it's received.
   */
  serializeData = (data) => {
    console.log(data);
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
      this.setState({ orderDeals: orderDeals });
      this.getUserAllOrders();
    } else {
      // let asksList = [];
      // let bidList = [];
      // for (let i = 0; i < data.asks.length; i++) {
      //     let aksValue = [];
      //     aksValue.push((parseFloat(data.asks[i][0])).toFixed(2));
      //     aksValue.push((parseFloat(data.asks[i][1]) * 0.10).toFixed(8));
      //     asksList.push(aksValue);
      // }
      // let askListReverse = asksList;
      // this.setState({orderBookAsks: askListReverse, marketLastBuy: (parseFloat(askListReverse[0][0])).toFixed(2)});
      this.setState({
        orderBookAsks: data.asks,
        marketLastBuy: data.asks[0].price.replace(",", ""),
      });
      // for (let i = 0; i < data.bids.length; i++) {
      //     let bidValue = [];
      //     bidValue.push((parseFloat(data.bids[i][0])).toFixed(2));
      //     bidValue.push((parseFloat(data.bids[i][1]) * 0.10).toFixed(8));
      //     bidList.push(bidValue);
      // }
      // let bidListReverse = bidList;
      // this.setState({orderBookBids: bidListReverse, marketLastSell: (parseFloat(bidListReverse[0][0])).toFixed(2)});
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

    return port;
  };

  wsConnect = async () => {
    const { auth } = this.props;
    // let ws = new WebSocket("wss://api.bitex.com:2096");
    // let ws = new WebSocket("wss://api.bitexuae.net/wss/");
    // let ws = new WebSocket("ws://139.162.234.246:8020");
    // let ws = new WebSocket("ws://api.bitexuae.net:2096");
    let currentMarket = this.props.trading.activeMarket;
    let currentPort = this.getWsEndpoint(currentMarket);

    if (this.state.ws) {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        await this.state.ws.close();
      }
      if (this.state.ws.readyState === WebSocket.CLOSED) {
        if (currentMarket.name) {
          if (currentMarket.name.includes("BTX")) {
            let ws = new WebSocket(`wss://trillionbit.quantacloud.net/ws/btx/`);
            this.setState({ ws: ws });
          } else {
            let ws = new WebSocket(
              `wss://trillionbit.quantacloud.net/ws/${currentPort}/`
            );
            this.setState({ ws: ws });
          }
        }
        // let ws = new WebSocket(`ws://localhost:7080/`);
      }
    } else {
      if (currentMarket.name) {
        if (currentMarket.name.includes("BTX")) {
          let ws = new WebSocket(`wss://trillionbit.quantacloud.net/ws/btx/`);
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
        let currentMarket = this.props.trading.activeMarket;
        // let wsList = this.state.wsList;
        // wsList.push(ws);
        // this.setState({wsList: wsList});
        // var msg = JSON.stringify({id: 12121, method: "depth.subscribe", params: [currentMarket.name, 100, "0"]});
        // ws.send(msg);
        // var dealMsg = JSON.stringify({id: 12121, method: "deals.subscribe", params: [currentMarket.name]});
        // ws.send(dealMsg);
        // // var stateMsg = JSON.stringify({id: 12121, method: "state.subscribe", params: markets});
        // // ws.send(stateMsg);
        // var qmsg = JSON.stringify({id: 12121, method: "depth.query", params: [currentMarket.name, 100, "0"]});
        // ws.send(qmsg);
        // let subscribeMsg = {
        //     "event": "bts:subscribe",
        //     "data": {
        //         "channel": `order_book_${this.getMarketCoin(currentMarket.name)}`
        //     }
        // };
        // var subscribeOrderMsg = {
        //     "event": "bts:subscribe",
        //     "data": {
        //         "channel": `live_trades_${this.getMarketCoin(currentMarket.name)}`
        //     }
        // };

        if (currentMarket.name) {
          if (currentMarket.name.includes("BTX")) {
            var msg = JSON.stringify({
              id: 12121,
              method: "depth.subscribe",
              params: [currentMarket.name, 100, "0"],
            });
            this.state.ws.send(msg);
            var dealMsg = JSON.stringify({
              id: 12121,
              method: "deals.subscribe",
              params: [currentMarket.name],
            });
            this.state.ws.send(dealMsg);
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

        // ws.send(JSON.stringify(subscribeOrderMsg));
      };

      this.state.ws.onmessage = (evt) => {
        let currentMarket = this.props.trading.activeMarket;

        if (currentMarket.name.includes("BTX")) {
          const message = JSON.parse(evt.data);
          if (message.result) {
            // for(let akey in message.result.asks) {
            //     newAsks.push(message.result.asks[akey][0]);
            // }
            // if (message.result.asks) {
            //     if (message.result.asks.length >= 100) {
            //         newAsks = [];
            //     }
            // }

            if (message.result.volume) {
              let marketLast = this.state.marketLast;
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
              this.setState({
                marketLast: marketLast,
              });
            }
          }
          if (message.result) {
            newAsks = [];
            // for(let akey in message.result.asks) {
            //     newAsks.push(message.result.asks[akey][0]);
            // }
            // if (message.result.asks) {
            //     if (message.result.asks.length >= 100) {
            //         newAsks = [];
            //     }
            // }

            if (message.result.asks) {
              if (message.result.asks.length > 0) {
                let marketLast = this.state.marketLast;
                if (marketLast[this.props.trading.activeMarket.name]) {
                  marketLast[this.props.trading.activeMarket.name]["ask"] =
                    message.result.asks[0][0];
                } else {
                  marketLast[this.props.trading.activeMarket.name] = {};
                  marketLast[this.props.trading.activeMarket.name]["ask"] =
                    message.result.asks[0][0];
                }
                this.setState({
                  orderBookAsks: message.result.asks,
                  marketLastBuy: message.result.asks[0][0],
                  marketLast: marketLast,
                  wsConnection: true,
                });
              }
            }
          }
          if (message.result) {
            // newBids = [];
            // for(let bkey in message.result.bids) {
            //     newBids.push(message.result.bids[bkey][0]);
            // }
            // if (message.result.bids) {
            //     if (message.result.bids.length >= 100) {
            //         newBids = [];
            //     }
            // }

            if (message.result.bids) {
              if (message.result.bids.length > 0) {
                let marketLast = this.state.marketLast;
                if (marketLast[this.props.trading.activeMarket.name]) {
                  marketLast[this.props.trading.activeMarket.name]["bid"] =
                    message.result.bids[0][0];
                } else {
                  marketLast[this.props.trading.activeMarket.name] = {};
                  marketLast[this.props.trading.activeMarket.name]["bid"] =
                    message.result.bids[0][0];
                }
                this.setState({
                  orderBookBids: message.result.bids,
                  marketLastSell: message.result.bids[0][0],
                  marketLast: marketLast,
                  wsConnection: true,
                });
              }
            }
          }

          if (message.result) {
            if (message.result.length > 0) {
              let marketLast = this.state.marketLast;
              let orderDeals = this.state.orderDeals;
              // let marketLast = this.state.marketLast;
              marketLast[currentMarket.name]["last"] = parseFloat(
                message.result[0].price
              ).toFixed(4);
              if (message.result.length > 0) {
                orderDeals = message.result;
                orderDeals.splice(20, 100);
                this.setState({ orderDeals: orderDeals });
              }
            }
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
          /**
           * This switch statement handles message logic. It processes data in case of data event
           * and it reconnects if the server requires.
           */
          // switch (message.event) {
          //     case 'data': {
          //         this.serializeData(message.data);
          //         break;
          //     }
          //     case 'trade': {
          //         this.serializeData(message.data);
          //         break;
          //     }
          //     case 'bts:request_reconnect': {
          //         // this.wsConnect();
          //         break;
          //     }
          //     default:
          //         // this.wsConnect();
          // }

          // if(message.method === 'depth.update') {
          //     var msg = JSON.stringify({id: 12121, method: "depth.query", params: [currentMarket.name, 100, "0"]});
          //     ws.send(msg);
          //     // if (message.params[1].asks) {
          //     //     newAsks = [];
          //     //     for(let akey in message.params[1].asks) {
          //     //         newAsks.push(message.params[1].asks[akey][0]);
          //     //     }
          //     //     if (message.params[1].asks.length >= 100) {
          //     //         newAsks = [];
          //     //     }
          //     // }
          //     // if (message.params[1].bids) {
          //     //     newBids = [];
          //     //     for(let bkey in message.params[1].bids) {
          //     //         newBids.push(message.params[1].bids[bkey][0]);
          //     //     }
          //     //     if (message.params[1].bids.length >= 100) {
          //     //         newBids = [];
          //     //     }
          //     // }
          // }

          // if(message.method === 'deals.update' || message.method === 'deals.subscribe') {
          //     var dealMsg = JSON.stringify({id: 12121, method: "deals.query", params: [currentMarket.name, 100, 0]});
          //     ws.send(dealMsg);
          // }

          // if(message.method === 'state.update') {
          //     let marketLast = this.state.marketLast;
          //     if(message.params) {
          //         marketLast[[message.params[0]]] = message.params[1];
          //         this.setState({marketLast: marketLast});
          //     }
          // }

          // console.log(message.s);
          let marketLast = this.state.marketLast;
          if (message) {
            // if(message.result.length > 0) {
            if (
              message.e === "trade" &&
              message.s.includes(currentMarket.stock)
            ) {
              if (updateTrade) {
                updateTrade = false;
                let orderDeals = this.state.orderDeals;
                // let marketLast = this.state.marketLast;
                marketLast[currentMarket.name]["last"] = parseFloat(
                  message.p
                ).toFixed(2);
                orderDeals.unshift(message);
                orderDeals.splice(20, 100);
                this.setState({ orderDeals: orderDeals });
              }
              // var m1 = new Date(message.T);
              // var m2 = new Date();
              // var diff = (m2 - m1)/1000;

              // if (diff < 500) {
              //     let marketLast = this.state.marketLast;
              //     marketLast[currentMarket.name]['last'] = (parseFloat(message.p)).toFixed(2);
              //     this.setState({orderDeals: message, wsConnection: true});
              // } else {
              //     this.setState({orderDeals: message, wsConnection: true});
              // }
            }
            // } else {
            //     // this.setState({wsConnection: false});
            // }

            // console.log(message.s, currentMarket.name, message.bids[0].price);
            if (
              message.asks &&
              message.s.includes(currentMarket.stock.toLowerCase())
            ) {
              if (message.asks[0]) {
                // marketLast[currentMarket.name]['ask'] = (parseFloat(message.asks[0].price.replaceAll(',',''))).toFixed(2);
                // var resBuy = this.state.orderBookAsks.filter( function(n) { return !this.has(n); }, new Set(message.result.asks) );
                // console.log(resBuy);
                this.setState({
                  orderBookAsks: message.asks.slice(0, 50),
                  marketLastBuy: message.asks[0].price.replaceAll(",", ""),
                });
                // if(message.result.asks.length < 10 && message.result.asks.length > 0) {
                //     var percDiff = ((parseFloat(this.state.finalMarketLast[currentMarket.name].ask) - parseFloat(message.result.asks[0][0]))/parseFloat(this.state.finalMarketLast[currentMarket.name].ask)) * 100
                //     if (percDiff > 0.5 || percDiff < -0.5) {
                //         this.setState({
                //             orderBookAsks: message.result.asks.slice(0, 50),
                //             marketLastBuy: message.result.asks[0].price.replace(',',''),
                //         });
                //     } else {
                //         this.setState({
                //             orderBookAsks: message.result.asks.slice(0, 50),
                //             marketLastBuy: message.result.asks[0].price.replace(',',''),
                //         });
                //     }
                // } else {
                //     this.setState({
                //         orderBookAsks: message.result.asks.slice(0, 50),
                //         marketLastBuy: message.result.asks[0].price.replace(',',''),
                //     });
                // }
              } else {
                this.setState({
                  orderBookAsks: message.asks.slice(0, 50),
                  marketLastBuy: 1,
                });
                // if(message.result.asks.length < 10 && message.result.asks.length > 0) {
                //     var percADiff = ((parseFloat(this.state.finalMarketLast[currentMarket.name].ask) - parseFloat(message.result.asks[0][0]))/parseFloat(this.state.finalMarketLast[currentMarket.name].ask)) * 100
                //     console.log(percADiff);
                //     if (percADiff > 0.5 || percADiff < -0.5) {
                //         this.setState({
                //             orderBookAsks: message.result.asks.slice(0, 50),
                //             marketLastBuy: 1,
                //             wsConnection: true
                //         });
                //     } else {
                //         this.setState({
                //             orderBookAsks: message.result.asks.slice(0, 50),
                //             marketLastBuy: 1,
                //             wsConnection: false
                //         });
                //     }
                // } else {
                //     this.setState({
                //         orderBookAsks: message.result.asks.slice(0, 50),
                //         marketLastBuy: 1,
                //         wsConnection: true
                //     });
                // }
              }
            } else {
              // this.setState({wsConnection: false});
            }

            if (
              message.bids &&
              message.s.includes(currentMarket.stock.toLowerCase())
            ) {
              if (message.bids[0]) {
                // marketLast[currentMarket.name]['bid'] = (parseFloat(message.bids[0].price.replaceAll(',',''))).toFixed(2);
                this.setState({
                  orderBookBids: message.bids.slice(0, 50),
                  marketLastSell: message.bids[0].price.replaceAll(",", ""),
                  wsConnection: true,
                });
                // if(message.result.bids.length < 10 && message.result.bids.length > 0) {
                //     var percBDiff = ((parseFloat(this.state.finalMarketLast[currentMarket.name].bid) - parseFloat(message.result.bids[0][0]))/parseFloat(this.state.finalMarketLast[currentMarket.name].bid)) * 100
                //     if (percBDiff > 0.5 || percBDiff < -0.5) {
                //         this.setState({
                //             orderBookBids: message.result.bids.slice(0, 50),
                //             marketLastSell: message.result.bids[0].price.replace(',',''),
                //             wsConnection: true
                //         });
                //     } else {
                //         this.setState({
                //             orderBookBids: message.result.bids.slice(0, 50),
                //             marketLastSell: message.result.bids[0].price.replace(',',''),
                //             wsConnection: false
                //         });
                //     }
                // } else {
                //     this.setState({
                //         orderBookBids: message.result.bids.slice(0, 50),
                //         marketLastSell: message.result.bids[0].price.replace(',',''),
                //         wsConnection: true
                //     });
                // }
              } else {
                this.setState({
                  orderBookBids: message.bids.slice(0, 50),
                  marketLastSell: 1,
                });
                // if(message.result.asks.length < 10 && message.result.bids.length > 0) {
                //     var percBiDiff = ((parseFloat(this.state.finalMarketLast[currentMarket.name].bid) - parseFloat(message.result.bids[0][0]))/parseFloat(this.state.finalMarketLast[currentMarket.name].bid)) * 100
                //     if (percBiDiff > 0.5 || percBiDiff < -0.5) {
                //         this.setState({
                //             orderBookBids: message.result.bids.slice(0, 50),
                //             marketLastSell: 1,
                //             wsConnection: true
                //         });
                //     } else {
                //         this.setState({
                //             orderBookBids: message.result.bids.slice(0, 50),
                //             marketLastSell: 1,
                //             wsConnection: false
                //         });
                //     }
                // } else {
                //     this.setState({
                //         orderBookBids: message.result.bids.slice(0, 50),
                //         marketLastSell: 1,
                //         wsConnection: true
                //     });
                // }
              }
            } else {
              // this.setState({wsConnection: false});
            }
          }
        }
      };

      /**
       * In case of unexpected close event, try to reconnect.
       */
      this.state.ws.onclose = function () {
        console.log("connection closed");
        this.setState({ wsConnection: false });
        if (this.props.history.location.pathname === "/trading") {
          this.wsConnect();
        }
      }.bind(this);
    }
  };

  componentWillUnmount = () => {
    console.log("component unmount");
    if (this.state.ws) {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        this.state.ws.close();
      }
    }
  };

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.snackMessages) {
      this.setState({ snackMessages: nextProps.snackMessages });
    }
    const availableMarkets = nextProps.trading.markets;
    if (availableMarkets.length > 0) {
      let displayMarkets = [];
      availableMarkets.map((availableMarket) => {
        displayMarkets[availableMarket.stock] = isEmpty(
          displayMarkets[availableMarket.stock]
        )
          ? []
          : displayMarkets[availableMarket.stock];
        displayMarkets[availableMarket.stock].push(availableMarket);
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
      this.setState({ dispalyMarkets: displayMarkets });
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
        }
        return true;
      });
      if (!isEmpty(nextProps.user.userClientWallets)) {
        nextProps.user.userClientWallets.map((userClientWallet) => {
          if (userClientWallet.coin === nextProps.trading.activeMarket.stock) {
            this.setState({ currentClientCryptoWallet: userClientWallet });
          }
          if (userClientWallet.coin === nextProps.trading.activeMarket.money) {
            this.setState({ currentClientFiatWallet: userClientWallet });
          }
          return true;
        });
      }
    }

    if (!isEmpty(nextProps.user.userClientWallets)) {
      this.setState({ userClientWallets: nextProps.user.userClientWallets });
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

          // this.props.getUserOrders(user.id, currentMarket.name, currentMarket.stock, currentMarket.money);
          // this.props.getPendingOrders(user.id, parseInt(user.id.replace(/\D/g,'')), currentMarket.name);
          // this.props.getUserProfile(user.id);
          // this.props.getActiveAssets(user.id);
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
    this.setState({ [name]: event.target.value });
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

  handlebuyChange(event, newValue) {
    this.setState({ buyTabValue: newValue });
  }

  handleopenChange(event, newValue) {
    event.stopPropagation();
    this.setState({ openTabValue: newValue });
  }

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
    console.log(currentMarket, newMarket);
    this.handleClose();

    if (newMarket.stock === "BTX") {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        await this.state.ws.close();
      }
    } else {
      if (
        currentMarket.money !== newMarket.money ||
        currentMarket.stock === "BTX"
      ) {
        if (this.state.ws.readyState === WebSocket.OPEN) {
          await this.state.ws.close();
        }
      }
    }

    orderDeals = [];
    await this.setState({
      // ws: null,
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
    });

    if (newMarket.stock === "BTX") {
      if (this.state.ws.readyState === WebSocket.CLOSED) {
        this.wsConnect();
      }
    } else {
      if (
        currentMarket.money !== newMarket.money ||
        currentMarket.stock === "BTX"
      ) {
        if (this.state.ws.readyState === WebSocket.CLOSED) {
          this.wsConnect();
        }
      }
    }
  };

  changeBuySell = (value) => {
    this.setState({
      currentTrade: value,
      marketAmount: "",
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
        console.log(this.props.trading);
      }
      if (this.state.finishedOrdersList) {
        let currentMarket = this.props.trading.activeMarket;
        await this.props.getClientOrders(
          this.state.selectedClient._id,
          currentMarket.name,
          currentMarket.stock,
          currentMarket.money
        );
        this.setState({ clientOrders: this.props.trading.clientOrders });
        console.log(this.props.trading);
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

    const authLinks = (
      <List component="nav" aria-label="main mailbox folders">
        <ListItem
          className={"listItem" + (pathname === "/dashboard" ? " active" : "")}
        >
          <Link to="/dashboard">Dashboard</Link>
        </ListItem>

        {/* <ListItem className={"listItem" + ((pathname === '/future-trading') ? ' active' : '')}>
                                <Link to="/future-trading">
                                    Future
                                </Link>
                            </ListItem> */}

        <ListItem
          className={
            "listItem" + (pathname === "/user-wallet" ? " active" : "")
          }
        >
          <Link to="/user-wallet">Wallet</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname === "//user-profile" ? " active" : "")
          }
        >
          <Link to="/user-profile">Settings</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname === "//margin-trading" ? " active" : "")
          }
        >
          {auth.user.marginTrading ? (
            <Link to="/margin-trading"> Margin Trading </Link>
          ) : undefined}
        </ListItem>

        <ListItem
          className={
            "listItem agent" + (pathname === "//user-profile" ? " active" : "")
          }
        >
          {this.props.auth.user.agent ? (
            <Link
              aria-controls="customized-menu3"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              to="#"
              onClick={(e) => this.handleMainMenuClick(e, "agent")}
            >
              {/* <Avatar alt="Remy Sharp" src={require("../assets/img/1.jpg")} className={classes.avatar} /> */}
              <Typography variant="h6" className="">
                Agent
                <ExpandMore className="trt" />
              </Typography>
            </Link>
          ) : undefined}
          {this.props.auth.user.agent ? (
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
              id="customized-menu3"
              className="agentBtn"
              anchorEl={this.state.anchoragentEl}
              keepMounted
              open={Boolean(this.state.anchoragentEl)}
              onClose={this.handleClose.bind(this)}
            >
              <MenuItem
                onClick={(event) => {
                  this.keyPressEvent("b", event);
                  this.setState({ anchoragentEl: null });
                }}
              >
                {" "}
                Buy Order{" "}
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  this.keyPressEvent("s", event);
                  this.setState({ anchoragentEl: null });
                }}
              >
                {" "}
                Sell Order{" "}
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  this.keyPressEvent("a", event);
                  this.setState({ anchoragentEl: null });
                }}
              >
                {" "}
                All Orders{" "}
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  this.keyPressEvent("o", event);
                  this.setState({ anchoragentEl: null });
                }}
              >
                {" "}
                Open Orders{" "}
              </MenuItem>
            </Menu>
          ) : undefined}
        </ListItem>

        <ListItem
          className={
            "listItem avatar" + (pathname === "//user-profile" ? " active" : "")
          }
        >
          {auth.isAuthenticated ? (
            <>
              <Link
                to={"#"}
                aria-controls="customized-menu2"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={(e) => this.handleMainMenuClick(e, "profile")}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={`${apiUrl}/api/guest/get_image/${auth.currentLoginUser?.avatar}`}
                  className={classes.avatar}
                />
                <ExpandMore className="trt" />
              </Link>
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
                className="logoutBtn tradeBTN"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={
                  Boolean(this.state.anchorEl)
                    ? Boolean(this.state.anchorEl)
                    : false
                }
                onClose={this.handleClose.bind(this)}
              >
                <MenuItem onClick={this.onLogoutClick.bind(this)}>
                  {" "}
                  Log out{" "}
                </MenuItem>
              </Menu>
            </>
          ) : (
            ""
          )}
        </ListItem>
      </List>
    );

    const guestLinks = (
      <List component="nav" aria-label="main mailbox folders">
        {/* <ListItem className={"listItem" + ((pathname === '/future-trading') ? ' active' : '')}>
                                    <Link to="/future-trading">
                                        Future
                                    </Link>
                                </ListItem> */}

        <ListItem
          className={"listItem" + (pathname === "/register" ? " active" : "")}
        >
          <Link to="/register">Signup</Link>
        </ListItem>

        <ListItem
          className={"listItem" + (pathname === "/login" ? " active" : "")}
        >
          <Link to="/login">Login</Link>
        </ListItem>
      </List>
    );

    let displayMarketDom = [];
    for (let key in dispalyMarkets) {
      displayMarketDom.push(
        <div className="item" key={key}>
          <div className="title">{key}</div>
          <div className="currnecyListItem">
            {dispalyMarkets[key].map((market) => (
              <ListItem key={market._id}>
                <Link to={"#"} onClick={() => this.activeMarket(market)}>
                  <span>
                    {" "}
                    {market.stock} / {market.money}{" "}
                  </span>{" "}
                  {market.money}{" "}
                  {!isEmpty(this.state.marketLast)
                    ? this.state.marketLast[market.name]
                      ? parseFloat(
                          this.state.marketLast[market.name].ask
                        ).toFixed(2)
                      : 0.0
                    : 0.0}
                </Link>
              </ListItem>
            ))}
          </div>
        </div>
      );
    }

    let tabLinks = auth.isAuthenticated ? authLinks : guestLinks;

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
          <title className="next-head">Trade | TrillionBit</title>
          <meta
            name="description"
            content="TrillionBit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta
            property="og:url"
            content="https://www.trillionbit.com/trading"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Trade | TrillionBit" />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Trade | TrillionBit" />
          <meta property="twitter:site" content="TrillionBit" />
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
            this.setState({ openOrdersList: !this.state.openOrdersList })
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
                this.setState({ openOrdersList: !this.state.openOrdersList })
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
            this.setState({ newOrderDialog: !this.state.newOrderDialog })
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
                      this.setState({ clientOrderTab: event.target.value })
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
                          style={{ cursor: "pointer" }}
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
                this.setState({ newOrderDialog: !this.state.newOrderDialog })
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
            <Grid item xs={12} sm={6} className="tradelogo">
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
              sm={6}
              className={mobileMenu ? "tradelinks active" : "tradelinks"}
            >
              {tabLinks}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={2} sm={12}>
              <div className="marketList">
                <Tabs
                  onChange={this.handleBuyCoinChange.bind(this)}
                  value={this.state.marketTabValue}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    value="INR"
                    label="INR"
                    // className={classes.tabRoot}
                  />
                  <Tab
                    value="AED"
                    label="AED"
                    // className={classes.tabRoot}
                  />
                  <Tab
                    value="USDT"
                    label="USDT"
                    // className={classes.tabRoot}
                  />
                </Tabs>

                <div>
                  {this.state.marketTabValue === "INR" ? (
                    <div>
                      <List className="">
                        <ListItem className="firstList">
                          <div className="coinList">
                            <div className="info">
                              <Typography component="h5">Pair</Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">Change</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,27,1.47</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,27,194</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,027,194</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>
                      </List>
                    </div>
                  ) : this.state.marketTabValue === "AED" ? (
                    <div>
                      <List className="">
                        <ListItem className="firstList">
                          <div className="coinList">
                            <div className="info">
                              <Typography component="h5">Pair</Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">Change</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,27,1.47</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,27,194</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,027,194</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>
                      </List>
                    </div>
                  ) : this.state.marketTabValue === "USDT" ? (
                    <div>
                      <List className="">
                        <ListItem className="firstList">
                          <div className="coinList">
                            <div className="info">
                              <Typography component="h5">Pair</Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">Change</Typography>
                          </div>
                        </ListItem>
                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,27,1.47</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,27,194</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">₹ 3,027,194</Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="red">
                                <ArrowDownwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>

                        <ListItem>
                          <div className="coinList">
                            <div className="img">
                              <img src={btcCoin} alt="bitcoin" />
                            </div>

                            <div className="info">
                              <Typography component="h5">
                                BTC <span> / INR </span>
                              </Typography>

                              <Typography component="h6" className="green">
                                <ArrowUpwardIcon />
                                23.33%
                              </Typography>
                            </div>
                          </div>

                          <div className="coinprice">
                            <Typography component="h6">
                              ₹ 3,027,194.47
                            </Typography>
                          </div>
                        </ListItem>
                      </List>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="tradeBox">
                <div className="headTitle">
                  <Typography variant="h6" className="">
                    Asset Allocation
                  </Typography>
                </div>
                <div className="allocationCoins">
                  <List className="">
                    <ListItem className="item">
                      <div className="progressBar">
                        <div className="data">
                          <div className="coinName">
                            <Typography component="h3">BTC</Typography>

                            <Typography component="h5">Bitcoin</Typography>
                          </div>
                          <div className="value">
                            <Typography component="h3">222.55555</Typography>
                            <Typography component="h5">
                              ₹ 654652.54688
                            </Typography>
                          </div>
                        </div>
                        <LinearProgress variant="determinate" value={25} />
                      </div>
                    </ListItem>

                    <ListItem className="item">
                      <div className="progressBar">
                        <div className="data">
                          <div className="coinName">
                            <Typography component="h3">BTC</Typography>

                            <Typography component="h5">Bitcoin</Typography>
                          </div>
                          <div className="value">
                            <Typography component="h3">222.55555</Typography>
                            <Typography component="h5">
                              ₹ 654652.54688
                            </Typography>
                          </div>
                        </div>
                        <LinearProgress variant="determinate" value={50} />
                      </div>
                    </ListItem>
                    <ListItem className="item">
                      <div className="progressBar">
                        <div className="data">
                          <div className="coinName">
                            <Typography component="h3">BTC</Typography>

                            <Typography component="h5">Bitcoin</Typography>
                          </div>
                          <div className="value">
                            <Typography component="h3">222.55555</Typography>
                            <Typography component="h5">
                              ₹ 654652.54688
                            </Typography>
                          </div>
                        </div>
                        <LinearProgress variant="determinate" value={75} />
                      </div>
                    </ListItem>

                    <ListItem className="item">
                      <div className="progressBar">
                        <div className="data">
                          <div className="coinName">
                            <Typography component="h3">BTC</Typography>

                            <Typography component="h5">Bitcoin</Typography>
                          </div>
                          <div className="value">
                            <Typography component="h3">222.55555</Typography>
                            <Typography component="h5">
                              ₹ 654652.54688
                            </Typography>
                          </div>
                        </div>
                        <LinearProgress variant="determinate" value={10} />
                      </div>
                    </ListItem>
                  </List>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} md={7} sm={12} className="padding0">
              <Grid container>
                <Grid item xs={12} md={12} sm={12}>
                  <div className="graphBox">
                    <div className="headTitle">
                      <Typography component="h3">
                        BTC <span> / INR </span>
                      </Typography>
                      <div className="balance_head">
                        <Typography component="h5" className="">
                          VOLUME HIGH:{" "}
                          <span>
                            {" "}
                            {!isEmpty(this.state.marketLast)
                              ? this.state.marketLast[trading.activeMarket.name]
                                ? parseFloat(
                                    this.state.marketLast[
                                      trading.activeMarket.name
                                    ].ask
                                  ).toFixed(2)
                                : 0.0
                              : 0.0}{" "}
                            {activeMoney}{" "}
                          </span>
                        </Typography>

                        <Typography component="h5" className="">
                          VOLUME LOW:{" "}
                          <span>
                            {" "}
                            {!isEmpty(this.state.marketLast)
                              ? this.state.marketLast[trading.activeMarket.name]
                                ? parseFloat(
                                    this.state.marketLast[
                                      trading.activeMarket.name
                                    ].ask
                                  ).toFixed(2)
                                : 0.0
                              : 0.0}{" "}
                            {activeMoney}{" "}
                          </span>
                        </Typography>
                      </div>
                    </div>
                    <div className="graphData">
                      {/* <TradingViewWidget
                                        symbol="BITFINEX:BTCINR"
                                        allow_symbol_change={true}
                                        hide_legend={true}
                                        interval={5}
                                        details={false}
                                        theme={Themes.DARK}
                                        locale="ae"
                                        autosize
                                    /> */}
                      {/* <AdvancedChart symbol="BITFINEX:BTCINR" autosize={true} widgetPropsAny={{"newProp": true}} /> */}
                      <iframe
                        className="pricechart-iframe"
                        title="priceChart"
                        src={`https://wchart.bitexuae.net/${activeMoney}/${chartCoin}`}
                      ></iframe>
                    </div>
                  </div>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={7} sm={12} className="hidden-md">
                    <div className="tradeBox orderBook">
                      <div className="headTitle">
                        <Typography component="h6">OrderBook</Typography>
                      </div>

                      <div className="table">
                        <List className="data">
                          <div className="tableFixHead">
                            <div className="tableHead">
                              <List className="data">
                                <ListItem
                                  className="tableData table-subheading"
                                  id=""
                                >
                                  <div className="amount">Amount</div>
                                  <div className="bid">Bid</div>
                                </ListItem>
                              </List>
                            </div>
                            <div className="tableHead">
                              <List className="data">
                                <ListItem
                                  className="tableData table-subheading"
                                  id=""
                                >
                                  <div className="value"> Ask </div>
                                  <div className="amount">Amount</div>
                                </ListItem>
                              </List>
                            </div>
                          </div>
                        </List>

                        <List className="data scrollBody leftorderBook">
                          {this.state.wsConnection ? (
                            <div className="orderbookData">
                              <div className="table">
                                <List className="data">
                                  {orderBookBids.map((bid, index) => (
                                    <ListItem
                                      key={index}
                                      className={
                                        orderBookBids.includes(bid)
                                          ? bid.new
                                            ? "tableData bid-list newBid"
                                            : "tableData bid-list"
                                          : bid.new
                                          ? "tableData newBid"
                                          : "tableData"
                                      }
                                      id=""
                                    >
                                      {/* <div className="value" id="trades_value"> {(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(2)} </div> */}
                                      <div
                                        className="amount trades_bid_amount"
                                        id="trades_amount"
                                      >
                                        {" "}
                                        {bid.amount ? bid.amount : bid[1]}{" "}
                                      </div>
                                      <div className="bid" id="trades_bid">
                                        {" "}
                                        {bid.price ? bid.price : bid[0]}{" "}
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
                                        orderBookAsks.includes(ask)
                                          ? ask.new
                                            ? "tableData ask-list newAsk"
                                            : "tableData ask-list"
                                          : ask.new
                                          ? "tableData newAsk"
                                          : "tableData"
                                      }
                                      id=""
                                    >
                                      <div className="ask" id="trades_ask">
                                        {" "}
                                        {ask.price ? ask.price : ask[0]}{" "}
                                      </div>
                                      <div
                                        className="amount trades_ask_amount"
                                        id="trades_amount2"
                                      >
                                        {" "}
                                        {ask.price ? ask.price : ask[1]}{" "}
                                      </div>
                                      {/* <div className="value trades_ask_amount" id="trades_value2"> {(parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(2)} </div> */}
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
                        </List>

                        <div className="footTable">
                          <Link to="#">
                            {" "}
                            <span
                              className={
                                this.state.wsConnection
                                  ? "status green"
                                  : "status red"
                              }
                            >
                              {" "}
                            </span>{" "}
                            Real Time{" "}
                          </Link>
                          <Link
                            to="#"
                            onClick={() =>
                              this.setState({ orderBookModal: true })
                            }
                          >
                            {" "}
                            FULL BOOK{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={5} sm={6} className="hidden-sm">
                    <div className="tradeBox">
                      <div className="headTitle">
                        <Typography component="h6">Trade</Typography>
                      </div>

                      <div className="table">
                        <List className="data">
                          <ListItem
                            className="tableData table-subheading"
                            id=""
                          >
                            <div className="amount">Amount</div>
                            <div className="time">Time</div>
                            <div className="price">Price</div>
                          </ListItem>
                        </List>

                        {orderDeals.length > 0 ? (
                          <List className="data scrollBody leftTradeData">
                            {orderDeals.map((orderDeal, index) => (
                              <ListItem
                                className={
                                  orderDeal.m || orderDeal.type === "sell"
                                    ? "tableData red"
                                    : "tableData"
                                }
                                key={index}
                              >
                                <div className="amount" id="trades_price">
                                  {" "}
                                  {orderDeal.q
                                    ? orderDeal.q
                                    : orderDeal.amount}{" "}
                                </div>
                                <div className="time" id="trades_time">
                                  {" "}
                                  {moment(
                                    parseInt(
                                      orderDeal.T
                                        ? orderDeal.T
                                        : orderDeal.time * 1000
                                    )
                                  ).format("LT")}{" "}
                                </div>
                                <div className="price" id="trades_amount">
                                  {" "}
                                  {trading.activeMarket.stock === "BTX"
                                    ? parseFloat(
                                        orderDeal.p
                                          ? orderDeal.p
                                          : orderDeal.price
                                      ).toFixed(4)
                                    : parseFloat(
                                        orderDeal.p
                                          ? orderDeal.p
                                          : orderDeal.price
                                      ).toFixed(2)}{" "}
                                </div>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <List className="data scrollBody leftTradeData">
                            <div className="connectingbox">
                              <img src={wifiImg} alt="logo" />
                              <Typography variant="body2" className="">
                                Connecting...
                              </Typography>
                            </div>
                          </List>
                        )}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {auth.isAuthenticated ? (
              <Grid item xs={12} md={3} sm={12} className="col-03 rightCol">
                <div className="buySellBox tabBox">
                  <div className="headTitle">
                    <Typography component="h6">Trade</Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      className={
                        this.state.currentTrade === "buy"
                          ? "trade-buy-button active"
                          : "trade-buy-button"
                      }
                      onClick={() => this.changeBuySell("buy")}
                    >
                      Buy
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={
                        this.state.currentTrade === "sell"
                          ? "trade-sell-button active"
                          : "trade-sell-button"
                      }
                      onClick={() => this.changeBuySell("sell")}
                    >
                      Sell
                    </Button>
                  </div>

                  <Card className="">
                    <CardHeader
                      title={
                        <RadioGroup
                          aria-label="gender"
                          name="gender1"
                          onChange={this.handlebuyChange.bind(this)}
                          value={this.state.buyTabValue}
                        >
                          <FormControlLabel
                            value="buy"
                            control={<Radio />}
                            label="Market"
                          />
                          <FormControlLabel
                            value="sell"
                            control={<Radio />}
                            label="Limit"
                          />
                        </RadioGroup>
                      }
                    />

                    <CardContent>
                      {this.state.buyTabValue === "buy" ? (
                        <div className="subData">
                          <Grid container>
                            <Grid
                              item
                              md={6}
                              sm={6}
                              xs={6}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <div className="currentMarket">
                                <img
                                  src={currencyIcon(activeStock)}
                                  width="20"
                                  alt={activeStock}
                                />
                                <span>
                                  {activeStock} / {activeMoney}
                                </span>
                              </div>
                            </Grid>
                            <Grid
                              item
                              md={6}
                              sm={6}
                              xs={6}
                              style={{ textAlign: "right" }}
                            >
                              <Typography component="h2">
                                {this.state.currentTrade === "buy"
                                  ? `Available: ${parseFloat(
                                      currentUserFiatWallet.walletAmount
                                    ).toFixed(2)} ${currentUserFiatWallet.coin}`
                                  : `Available: ${parseFloat(
                                      currentUserCryptoWallet.walletAmount
                                    ).toFixed(8)} ${
                                      currentUserCryptoWallet.coin
                                    }`}
                              </Typography>
                            </Grid>
                          </Grid>

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
                            className={classes.input}
                            inputProps={{
                              "aria-label": "description",
                            }}
                          />

                          <TextField
                            type="number"
                            fullWidth={true}
                            placeholder="Amount"
                            className={classes.input}
                            xinputProps={{
                              "aria-label": "description",
                            }}
                          />

                          <TextField
                            type="number"
                            fullWidth={true}
                            placeholder="Total"
                            className={classes.input}
                            xinputProps={{
                              "aria-label": "description",
                            }}
                          />

                          <div className="inline fee">
                            <Typography component="h5"></Typography>

                            <Typography component="h5">
                              Fee: {this.state.takerFee * 100} %
                            </Typography>
                          </div>

                          {this.state.currentTrade === "buy" ? (
                            this.state.orderProcess ? (
                              <Button
                                variant="contained"
                                color="primary"
                                className={
                                  this.state.currentTrade === "buy"
                                    ? "btn buyMarket"
                                    : "btn sellMarket"
                                }
                              >
                                <CircularProgress size={24} color="secondary" />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.createMarketOrder("buy")}
                                disabled={this.state.orderProcess}
                                className={
                                  this.state.currentTrade === "buy"
                                    ? "btn buyMarket"
                                    : "btn sellMarket"
                                }
                              >
                                Buy
                              </Button>
                            )
                          ) : this.state.orderProcess ? (
                            <Button
                              variant="contained"
                              color="primary"
                              className={
                                this.state.currentTrade === "buy"
                                  ? "btn buyMarket"
                                  : "btn sellMarket"
                              }
                            >
                              <CircularProgress size={24} />
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => this.createMarketOrder("sell")}
                              disabled={this.state.orderProcess}
                              className={
                                this.state.currentTrade === "buy"
                                  ? "btn buyMarket"
                                  : "btn sellMarket"
                              }
                            >
                              Sell
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="limitData">
                          <div className="subData">
                            <Grid container>
                              <Grid
                                item
                                md={6}
                                sm={6}
                                xs={6}
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                              >
                                <div className="currentMarket">
                                  <img
                                    src={currencyIcon(activeStock)}
                                    width="20"
                                    alt={activeStock}
                                  />
                                  <span>
                                    {activeStock} / {activeMoney}
                                  </span>
                                </div>
                              </Grid>
                              <Grid
                                item
                                md={6}
                                sm={6}
                                xs={6}
                                style={{ textAlign: "right" }}
                              >
                                <Typography component="h2">
                                  {this.state.currentTrade === "buy"
                                    ? `Available: ${parseFloat(
                                        currentUserFiatWallet.walletAmount
                                      ).toFixed(2)} ${
                                        currentUserFiatWallet.coin
                                      }`
                                    : `Available: ${parseFloat(
                                        currentUserCryptoWallet.walletAmount
                                      ).toFixed(8)} ${
                                        currentUserCryptoWallet.coin
                                      }`}
                                </Typography>
                              </Grid>
                            </Grid>

                            <TextField
                              error={errors.limitAmount ? true : false}
                              value={limitAmount}
                              onChange={this.handleInputChange("limitAmount")}
                              type="number"
                              fullWidth={true}
                              placeholder={`I want to ${this.state.currentTrade} (in ${activeStock})`}
                              className={classes.input}
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
                              className={classes.input}
                              inputProps={{
                                "aria-label": "description",
                              }}
                            />

                            <div className="space15"> </div>

                            {this.state.currentTrade === "buy" ? (
                              this.state.orderProcess ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className={
                                    this.state.currentTrade === "buy"
                                      ? "btn buyMarket"
                                      : "btn sellMarket"
                                  }
                                >
                                  <CircularProgress
                                    size={24}
                                    color="secondary"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => this.createLimitOrder("buy")}
                                  disabled={this.state.orderProcess}
                                  className={
                                    this.state.currentTrade === "buy"
                                      ? "btn buyMarket"
                                      : "btn sellMarket"
                                  }
                                >
                                  Buy
                                </Button>
                              )
                            ) : this.state.orderProcess ? (
                              <Button
                                variant="contained"
                                color="primary"
                                className={
                                  this.state.currentTrade === "buy"
                                    ? "btn buyMarket"
                                    : "btn sellMarket"
                                }
                              >
                                <CircularProgress size={24} />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.createLimitOrder("sell")}
                                disabled={this.state.orderProcess}
                                className={
                                  this.state.currentTrade === "buy"
                                    ? "btn buyMarket"
                                    : "btn sellMarket"
                                }
                              >
                                Sell
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="openAllBox tabBox">
                  <Card className="">
                    <CardHeader
                      title={
                        <Tabs
                          scrollButtons="auto"
                          variant="scrollable"
                          onChange={this.handleopenChange.bind(this)}
                          value={this.state.openTabValue}
                          textColor="primary"
                          indicatorColor="primary"
                        >
                          <Tab
                            value="open"
                            className={classes.tabRoot}
                            label="OPEN"
                          />
                          <Tab
                            value="all"
                            className={classes.tabRoot}
                            label="ALL"
                          />
                        </Tabs>
                      }
                    />
                    <CardContent>
                      {this.state.openTabValue === "open" ? (
                        <List className="openallList tradingOpenALLBox">
                          {trading.pendingOrders.map((order, index) => (
                            <ListItem
                              className={order.side === 1 ? "redBorder" : ""}
                              key={index}
                            >
                              <Typography component="h3">
                                <span> {order.market} - </span>{" "}
                                {order.type === 1
                                  ? `${order.amount} @ ${order.price}`
                                  : `${order.dealStock} @ ${order.dealMoney}`}
                              </Typography>

                              <Typography component="h4">
                                {order.side === 1 ? "Sell" : "Buy"} -{" "}
                                {order.type === 1 ? "Limit" : "Market"}
                              </Typography>

                              <Typography component="h5">
                                {moment(order.createTime).format("LLLL")}
                              </Typography>

                              <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={() => this.cancelUserOrder(order._id)}
                              >
                                Cancel
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <List className="openallList tradingOpenALLBox">
                          {trading.orders.map((order, index) => {
                            if (
                              parseFloat(order.amount) > 0 ||
                              parseFloat(order.price) > 0
                            ) {
                              return (
                                <ListItem
                                  className={
                                    order.side === 1 ? "redBorder" : ""
                                  }
                                  key={index}
                                >
                                  <Typography component="h3">
                                    <span> {order.market} </span>
                                    {`${
                                      order.type === 1 || order.side === 1
                                        ? order.amount
                                        : parseFloat(order.amount) /
                                            parseFloat(order.price) >
                                          0.0001
                                        ? (order.market.includes("BTX")
                                            ? parseFloat(order.dealStock)
                                            : parseFloat(order.amount) /
                                              parseFloat(order.price)
                                          ).toFixed(4)
                                        : (order.market.includes("BTX")
                                            ? parseFloat(order.dealStock)
                                            : parseFloat(order.amount) /
                                              parseFloat(order.price)
                                          ).toFixed(8)
                                    } @ ${parseFloat(order.dealMoney).toFixed(
                                      2
                                    )}`}
                                  </Typography>

                                  <Typography component="h4">
                                    {order.side === 1 ? "Sell" : "Buy"} -{" "}
                                    {order.type === 1 ? "Limit" : "Market"}
                                  </Typography>

                                  <Typography component="h5">
                                    {moment(order.createTime).format("LLLL")}
                                  </Typography>
                                </ListItem>
                              );
                            } else {
                              return undefined;
                            }
                          })}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            ) : (
              <Grid item xs={12} md={3} sm={12} className="col-03 rightBar">
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

                    <Typography component="h2">Welcome to Bitex</Typography>

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

NewTradingView.propTypes = {
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
})(withStyles(themeStyles)(NewTradingView));
