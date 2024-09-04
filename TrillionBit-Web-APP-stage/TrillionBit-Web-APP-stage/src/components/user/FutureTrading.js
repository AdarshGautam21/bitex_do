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
  getFutureTikers,
  getAvailaleMarkets,
  activeFutureMarket,
  getActiveAssets,
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

import wifiImg from "../../assets/img/wifi.webp";
import whiteLogoImg from "../../assets/img/white-logo.webp";

const moment = require("moment");
let CurrencyFormat = require("react-currency-format");
const publicIp = require("public-ip");

let orderDeals = [];
let asksPriceSnap = [];
let bidsPriceSnap = [];
let newAsks = [];
let newBids = [];
let wsAllow = true;

class FutureTrading extends Component {
  state = {
    wsConnection: true,
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
  };

  getUserAllOrders = () => {
    const { auth } = this.props;
    let currentMarket = this.props.trading.activeFutureMarket;

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
    wsAllow = true;
    const { auth } = this.props;
    await this.props.getAvailaleMarkets();
    await this.props.getMarketLast();
    await this.props.getFinalMarketLast();
    await this.props.getFutureTikers();

    // if (auth.isAuthenticated) {
    //     await this.props.getActiveAssets(auth.user.id);
    // }

    // for(let ckey in this.props.wallet.userAssets) {
    //     if (this.props.wallet.userAssets[ckey].fiat && this.props.wallet.userAssets[ckey].active) {
    //         await this.setState({currentUserFiatWallet: this.props.wallet.userAssets[ckey]});
    //     }
    // }

    let marketLast = this.state.marketLast;
    let finalMarketLast = this.state.finalMarketLast;
    for (let key in this.props.wallet.futureTickers) {
      marketLast[this.props.wallet.futureTickers[key].name] =
        this.props.wallet.marketLasts[
          this.props.wallet.futureTickers[key].name
        ];
      finalMarketLast[this.props.wallet.futureTickers[key].name] =
        this.props.wallet.finalMarketLasts[
          this.props.wallet.futureTickers[key].name
        ];
      this.setState({
        marketLast: marketLast,
        finalMarketLast: finalMarketLast,
      });
      if (
        this.props.wallet.futureTickers[key].stock ===
        this.props.match.params.cryptoAsset
      ) {
        this.props.activeFutureMarket(this.props.wallet.futureTickers[key]);
      } else {
        if (
          this.props.wallet.futureTickers[key].stock === "tbtc" ||
          this.props.wallet.futureTickers[key].stock === "BTC"
        ) {
          this.props.activeFutureMarket(this.props.wallet.futureTickers[key]);
        }
      }
    }

    this.wsConnect();
    if (auth.isAuthenticated) {
      setInterval(() => {
        if (this.props.auth.user.id) {
          this.props.getPendingOrders(
            this.props.auth.user.id,
            parseInt(this.props.auth.user.id.replace(/\D/g, "")),
            this.props.trading.activeFutureMarket.name
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
    if (!data.asks || !data.bids) {
      let marketLast = this.state.marketLast;
      let currentMarket = this.props.trading.activeFutureMarket;
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
        marketLastBuy: data.asks[0].price.replaceAll(",", ""),
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
        marketLastSell: data.bids[0].price.replaceAll(",", ""),
      });
    }
  };

  wsConnect = async () => {
    const { auth } = this.props;
    console.log("websocket called");
    if (this.state.ws) {
      await this.state.ws.close();
    }
    // let ws = new WebSocket("wss://api.bitex.com:2096");
    let ws = new WebSocket("wss://futures.kraken.com/ws/v1");
    // let ws = new WebSocket("ws://api.bitexuae.net:2096");
    this.setState({ ws: ws });
    let currentMarket = this.props.trading.activeFutureMarket;

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

    ws.onopen = () => {
      this.setState({ wsConnection: true });
      let currentMarket = this.props.trading.activeFutureMarket;
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
        let msg = {
          event: "subscribe",
          feed: "book",
          product_ids: [currentMarket.symbol],
        };
        ws.send(JSON.stringify(msg));

        let tmsg = {
          event: "subscribe",
          feed: "trade",
          product_ids: [currentMarket.symbol],
        };
        ws.send(JSON.stringify(tmsg));
      }

      // ws.send(JSON.stringify(subscribeOrderMsg));
    };

    ws.onmessage = async (evt) => {
      let currentMarket = this.props.trading.activeFutureMarket;
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

      let marketLast = this.state.marketLast;
      if (message.feed === "book_snapshot") {
        console.log(message);
        if (message.asks) {
          if (isEmpty(this.state.orderBookAsks)) {
            for (let ask of message.asks) {
              asksPriceSnap.push(ask.price);
            }
            if (message.asks[0]) {
              marketLast[currentMarket.name]["ask"] = parseFloat(
                message.asks[0].price
              ).toFixed(2);
              this.setState({
                orderBookAsks: message.asks,
                marketLastBuy: message.asks[0].price,
              });
            } else {
              this.setState({
                orderBookAsks: message.asks,
                marketLastBuy: 1,
              });
            }
          }
        }

        if (message.bids) {
          if (isEmpty(this.state.orderBookBids)) {
            for (let bid of message.bids) {
              bidsPriceSnap.push(bid.price);
            }
            if (message.bids[0]) {
              marketLast[currentMarket.name]["bid"] = parseFloat(
                message.bids[0].price
              ).toFixed(2);
              this.setState({
                orderBookBids: message.bids,
                marketLastSell: message.bids[0].price,
              });
            } else {
              this.setState({
                orderBookBids: message.bids,
                marketLastSell: 1,
              });
            }
          }
        }
      }

      if (message.feed === "book") {
        let orderBookAsks = this.state.orderBookAsks;
        if (message.side === "sell") {
          if (asksPriceSnap.includes(message.price)) {
            //
          } else {
            for (let orderBookAsk of orderBookAsks) {
              if (asksPriceSnap.includes(orderBookAsk.price)) {
                //
              } else {
                orderBookAsks.push(message);
                orderBookAsks.sort(function (a, b) {
                  return a.price - b.price;
                });
                orderBookAsks.splice(-1, 1);
              }
            }
            asksPriceSnap.push(message.price);
            asksPriceSnap.sort(function (a, b) {
              return a - b;
            });
            asksPriceSnap.splice(-1, 1);
          }
        }

        let orderBookBids = this.state.orderBookBids;
        if (message.side === "buy") {
          if (bidsPriceSnap.includes(message.price)) {
            //
          } else {
            for (let orderBookBid of orderBookBids) {
              if (bidsPriceSnap.includes(orderBookBid.price)) {
                //
              } else {
                orderBookBids.push(message);
                orderBookBids.sort(function (a, b) {
                  return b.price - a.price;
                });
                orderBookBids.splice(-1, 1);
              }
            }
            bidsPriceSnap.push(message.price);
            bidsPriceSnap.sort(function (a, b) {
              return b - a;
            });
            bidsPriceSnap.splice(-1, 1);
          }
        }
        // this.setState({orderBookAsks: orderBookAsks, orderBookBids: orderBookBids});
      }

      if (message.feed === "trade_snapshot") {
        if (message.trades.length > 0) {
          if (message.trades[0].type) {
            let marketLast = this.state.marketLast;
            marketLast[currentMarket.name]["last"] = parseFloat(
              message.trades[0].price
            ).toFixed(2);
            message.trades.sort(function (a, b) {
              return b.time - a.time;
            });
            this.setState({ orderDeals: message.trades });
          }
        }
      }

      if (message.feed === "trade") {
        let orderDeals = this.state.orderDeals;
        orderDeals.splice(0, 0, message);
        orderDeals.splice(-1, 1);

        if (orderDeals.length > 0) {
          let marketLast = this.state.marketLast;
          marketLast[currentMarket.name]["last"] = parseFloat(
            orderDeals[0].price
          ).toFixed(2);
          this.setState({ orderDeals: orderDeals });
        }
      }
    };

    /**
     * In case of unexpected close event, try to reconnect.
     */
    ws.onclose = function () {
      console.log("connection closed");
      this.setState({ wsConnection: false });
      ws = new WebSocket("wss://api.bitex.com:2096");
      this.setState({ ws: ws });
      if (wsAllow) {
        // setTimeout(() => {
        //     this.wsConnect()
        // }, 2000)
      }
    }.bind(this);
  };

  componentWillUnmount = () => {
    wsAllow = false;
    if (this.state.ws) {
      this.state.ws.close();
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
        if (isEmpty(this.props.trading.activeFutureMarket)) {
          if (
            (availableMarket.stock === "tbtc" ||
              availableMarket.stock === "BTC") &&
            this.state.currentUserFiatWallet.coin === availableMarket.money
          ) {
            this.props.activeFutureMarket(availableMarket);
          }
        }
        return true;
      });
      this.setState({ dispalyMarkets: displayMarkets });
    }
    if (!isEmpty(nextProps.user.userProfile)) {
      this.setState({
        takerFee:
          parseFloat(nextProps.user.userProfile.traderLevelFees.takerFee) / 100,
        makerFee:
          parseFloat(nextProps.user.userProfile.traderLevelFees.makerFee) / 100,
      });
    }
    if (!isEmpty(nextProps.trading.activeFutureMarket)) {
      nextProps.wallet.userAssets.map((userAsset) => {
        if (userAsset.coin === nextProps.trading.activeFutureMarket.stock) {
          this.setState({ currentUserCryptoWallet: userAsset });
        }
        if (userAsset.coin === nextProps.trading.activeFutureMarket.money) {
          this.setState({ currentUserFiatWallet: userAsset });
        }
        return true;
      });
      if (!isEmpty(nextProps.user.userClientWallets)) {
        nextProps.user.userClientWallets.map((userClientWallet) => {
          if (
            userClientWallet.coin === nextProps.trading.activeFutureMarket.stock
          ) {
            this.setState({ currentClientCryptoWallet: userClientWallet });
          }
          if (
            userClientWallet.coin === nextProps.trading.activeFutureMarket.money
          ) {
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
    let orderPut = false;
    // if(this.state.wsConnection) {
    if (orderPut) {
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
          let currentMarket = this.props.trading.activeFutureMarket;
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
          let currentMarket = this.props.trading.activeFutureMarket;
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
    let orderPut = false;
    // if(this.state.wsConnection) {
    if (orderPut) {
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
          let currentMarket = this.props.trading.activeFutureMarket;
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
          let currentMarket = this.props.trading.activeFutureMarket;
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

  activeFutureMarket = async (market) => {
    await this.props.activeFutureMarket(market);
    this.handleClose();

    await this.state.ws.close();
    orderDeals = [];
    await this.setState({ ws: null, orderDeals: [] });
    this.wsConnect();
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
    let currentMarket = this.props.trading.activeFutureMarket;

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
      marketName === "BTCINR"
    ) {
      marketCoin = "btcusd";
    }
    if (
      marketName === "tbchAED" ||
      marketName === "BCHAED" ||
      marketName === "tbchINR" ||
      marketName === "BCHINR"
    ) {
      marketCoin = "bchusd";
    }
    if (
      marketName === "tltcAED" ||
      marketName === "LTCAED" ||
      marketName === "tltcINR" ||
      marketName === "LTCINR"
    ) {
      marketCoin = "ltcusd";
    }
    if (
      marketName === "tzecAED" ||
      marketName === "ZEDAED" ||
      marketName === "tzecINR" ||
      marketName === "ZEDINR"
    ) {
      marketCoin = "zecusd";
    }
    if (
      marketName === "txlmAED" ||
      marketName === "XLMAED" ||
      marketName === "txlmINR" ||
      marketName === "XLMINR"
    ) {
      marketCoin = "xlmusd";
    }
    if (
      marketName === "tdashAED" ||
      marketName === "DASHAED" ||
      marketName === "tdashINR" ||
      marketName === "DASHINR"
    ) {
      marketCoin = "dashusd";
    }
    if (marketName === "XRPAED" || marketName === "XRPINR") {
      marketCoin = "xrpusd";
    }
    if (marketName === "ETHAED" || marketName === "ETHINR") {
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
        let currentMarket = this.props.trading.activeFutureMarket;
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
        let currentMarket = this.props.trading.activeFutureMarket;
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
    const { futureTickers } = this.props.wallet;

    let pathname = location.pathname;
    let activeStock = "BTC";
    let activeMoney = "AED";
    if (!isEmpty(trading.activeFutureMarket)) {
      activeStock = trading.activeFutureMarket.stock;
      activeMoney = trading.activeFutureMarket.money;
    }

    const authLinks = (
      <List component="nav" aria-label="main mailbox folders">
        <ListItem
          className={"listItem" + (pathname === "/dashboard" ? " active" : "")}
        >
          <Link to="/dashboard">Dashboard</Link>
        </ListItem>

        <ListItem
          className={"listItem" + (pathname === "/trading" ? " active" : "")}
        >
          <Link to="/trading">Exchange</Link>
        </ListItem>

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
      </List>
    );

    const guestLinks = (
      <List component="nav" aria-label="main mailbox folders">
        <ListItem
          className={"listItem" + (pathname === "/trading" ? " active" : "")}
        >
          <Link to="/trading">Exchange</Link>
        </ListItem>

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
                <Link to={"#"} onClick={() => this.activeFutureMarket(market)}>
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
                      disabled={this.state.orderProcess}
                      className={
                        this.state.currentTrade === "buy"
                          ? "btn buyMarket"
                          : "btn sellMarket"
                      }
                    >
                      {this.state.orderProcess ? (
                        <CircularProgress size={24} color="secondary" />
                      ) : (
                        "Long"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 10 }}
                      onClick={() => this.createMarketOrder("buy")}
                      disabled={this.state.orderProcess}
                      className={
                        this.state.currentTrade === "buy"
                          ? "btn buyMarket"
                          : "btn sellMarket"
                      }
                    >
                      {this.state.orderProcess ? (
                        <CircularProgress size={24} color="secondary" />
                      ) : (
                        "Long"
                      )}
                    </Button>
                  )
                ) : this.state.clientOrderTab === "limit" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => this.createLimitOrder("sell")}
                    disabled={this.state.orderProcess}
                    className={
                      this.state.currentTrade === "buy"
                        ? "btn buyMarket"
                        : "btn sellMarket"
                    }
                  >
                    {this.state.orderProcess ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      "Short"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => this.createMarketOrder("sell")}
                    disabled={this.state.orderProcess}
                    className={
                      this.state.currentTrade === "buy"
                        ? "btn buyMarket"
                        : "btn sellMarket"
                    }
                  >
                    {this.state.orderProcess ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      "Short"
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
                          onClick={() => this.activeFutureMarket(userAsset)}
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
                    <div className="value"> Value </div>
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
                    <div className="bid">Value</div>
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
                        <div className="value" id="trades_value">
                          {" "}
                          {(parseFloat(bid[1]) * parseFloat(bid[0])).toFixed(
                            2
                          )}{" "}
                        </div>
                        <div
                          className="amount trades_bid_amount"
                          id="trades_amount"
                        >
                          {" "}
                          {bid[1]}{" "}
                        </div>
                        <div className="bid" id="trades_bid">
                          {" "}
                          {parseFloat(bid[0]).toFixed(2)}{" "}
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
                        <div className="ask" id="trades_ask">
                          {" "}
                          {parseFloat(ask[0]).toFixed(2)}{" "}
                        </div>
                        <div
                          className="amount trades_ask_amount"
                          id="trades_amount2"
                        >
                          {" "}
                          {ask[1]}{" "}
                        </div>
                        <div
                          className="value trades_ask_amount"
                          id="trades_value2"
                        >
                          {" "}
                          {(
                            parseFloat(ask[1]) * parseFloat(ask[0]).toFixed(2)
                          ).toFixed(2)}{" "}
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
            <Grid item xs={6} sm={7} md={6} className="balanceGrid">
              <div className="balance_head">
                <Link
                  to={"#"}
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                  variant="contained"
                  color="primary"
                  onClick={(e) => this.handleMainMenuClick(e, "currency")}
                >
                  <Typography component="span" variant="body2" className="">
                    {activeStock} / {activeMoney}
                    <ExpandMore className="trt" />
                  </Typography>
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
                  id="customized-menu"
                  className="balanceMenu"
                  anchorEl={this.state.anchorCurrencyEl}
                  keepMounted
                  open={
                    Boolean(this.state.anchorCurrencyEl)
                      ? Boolean(this.state.anchorCurrencyEl)
                      : false
                  }
                  onClose={this.handleClose.bind(this)}
                >
                  <div className="currnecyList">{displayMarketDom}</div>
                </Menu>

                <Typography component="h5" className="">
                  Last:{" "}
                  <span>
                    {" "}
                    {!isEmpty(this.state.marketLast)
                      ? this.state.marketLast[trading.activeFutureMarket.name]
                        ? parseFloat(
                            this.state.marketLast[
                              trading.activeFutureMarket.name
                            ].last
                          ).toFixed(2)
                        : 0.0
                      : 0.0}{" "}
                    {activeMoney}{" "}
                  </span>
                </Typography>

                {!isEmpty(currentUserCryptoWallet) ? (
                  <Typography component="h5" className="">
                    {currentUserCryptoWallet.displayName}:{" "}
                    <span>
                      {" "}
                      {parseFloat(currentUserCryptoWallet.walletAmount).toFixed(
                        8
                      )}{" "}
                      {currentUserCryptoWallet.coin}{" "}
                    </span>
                  </Typography>
                ) : undefined}

                {!isEmpty(currentUserCryptoWallet) ? (
                  <Typography component="h5" className="">
                    {currentUserFiatWallet.displayName}:{" "}
                    <span>
                      {currentUserFiatWallet.coin === "INR" ? "₹" : ""}{" "}
                      {parseFloat(currentUserFiatWallet.walletAmount).toFixed(
                        2
                      )}{" "}
                      {currentUserFiatWallet.coin === "INR" ? "" : "د.إ"}
                    </span>
                  </Typography>
                ) : undefined}
              </div>
            </Grid>

            <Grid item xs={6} sm={5} md={6} className="tradeMenuLink">
              {auth.isAuthenticated ? (
                <div className="userbox">
                  {auth.user.marginTrading ? (
                    <Link to="/margin-trading"> Margin Trading </Link>
                  ) : undefined}
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
                      <Typography variant="body2" className="">
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
                        Long Order{" "}
                      </MenuItem>
                      <MenuItem
                        onClick={(event) => {
                          this.keyPressEvent("s", event);
                          this.setState({ anchoragentEl: null });
                        }}
                      >
                        {" "}
                        Short Order{" "}
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
                </div>
              ) : undefined}
              {auth.isAuthenticated ? (
                <div className="userbox">
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
                      src={`${apiUrl}/api/guest/get_image/${auth.user.avatar}`}
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
                </div>
              ) : (
                ""
              )}
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={9} sm={12} className="padding0">
              <Grid container>
                <Grid item xs={12} md={4} sm={6} className="hidden-sm">
                  <div className="tradeBox">
                    <div className="headTitle">
                      <Typography component="h6">Trade</Typography>
                    </div>

                    <div className="table">
                      <List className="data">
                        <ListItem className="tableData table-subheading" id="">
                          <div className="amount">Amount</div>
                          <div className="time">Time</div>
                          <div className="price">Price</div>
                        </ListItem>
                      </List>

                      {this.state.wsConnection ? (
                        <List className="data scrollBody leftTradeData">
                          {orderDeals.map((orderDeal, index) => (
                            <ListItem
                              className={
                                orderDeal.type === "sell"
                                  ? "tableData red"
                                  : "tableData"
                              }
                              key={index}
                            >
                              <div className="amount" id="trades_price">
                                {" "}
                                {orderDeal.qty}{" "}
                              </div>
                              <div className="time" id="trades_time">
                                {" "}
                                {moment(new Date(orderDeal.time)).format(
                                  "LT"
                                )}{" "}
                              </div>
                              <div className="price" id="trades_amount">
                                {" "}
                                {parseFloat(orderDeal.price).toFixed(2)}{" "}
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

                <Grid item xs={12} md={8} sm={6} className="hidden-sm">
                  <div className="orderBox">
                    <div className="headTitle">
                      <Typography component="h6">Live Data</Typography>
                    </div>

                    <div className="orderbookData livedata">
                      <div className="table">
                        <List className="data">
                          <ListItem
                            className="tableData table-subheading"
                            id=""
                          >
                            <div className="symbol"> SYMBOL </div>
                            <div className="lastPrice">BID</div>
                            <div className="lastPrice">ASK</div>
                            <div className="high"> 24H HIGH </div>
                            <div className="low">24H LOW </div>
                            <div className="change">24H CHANGE</div>
                            {/* <div className="volume"> 24H VOLUME </div>                                     */}
                          </ListItem>
                        </List>

                        <List className="data scrollBody">
                          {futureTickers.map((userAsset, index) => {
                            return (
                              <ListItem
                                className={
                                  userAsset.stock ===
                                  this.props.trading.activeFutureMarket.stock
                                    ? "tableData active"
                                    : "tableData"
                                }
                                id=""
                                key={index}
                                onClick={() =>
                                  this.activeFutureMarket(userAsset)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <div className="symbol">
                                  {" "}
                                  <img
                                    src={currencyIcon(userAsset.stock)}
                                    alt={userAsset.stock}
                                  />{" "}
                                  {`${userAsset.symbol.toUpperCase()}`}{" "}
                                </div>
                                <div className="change green">
                                  <CurrencyFormat
                                    value={
                                      !isEmpty(this.state.marketLast)
                                        ? this.state.marketLast[userAsset.name]
                                          ? parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].bid
                                            ).toFixed(2)
                                          : 0.0
                                        : 0.0
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={`${
                                      userAsset.money === "INR"
                                        ? "₹"
                                        : userAsset.money === "USD"
                                        ? "$"
                                        : ""
                                    } `}
                                    suffix={`${
                                      userAsset.money === "AED" ? "د.إ" : ""
                                    } `}
                                  />
                                </div>
                                <div className="change red">
                                  <CurrencyFormat
                                    value={
                                      !isEmpty(this.state.marketLast)
                                        ? this.state.marketLast[userAsset.name]
                                          ? parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].ask
                                            ).toFixed(2)
                                          : 0.0
                                        : 0.0
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={`${
                                      userAsset.money === "INR"
                                        ? "₹"
                                        : userAsset.money === "USD"
                                        ? "$"
                                        : ""
                                    } `}
                                    suffix={`${
                                      userAsset.money === "AED" ? "د.إ" : ""
                                    } `}
                                  />
                                </div>
                                <div className="high">
                                  <CurrencyFormat
                                    value={
                                      !isEmpty(this.state.marketLast)
                                        ? this.state.marketLast[userAsset.name]
                                          ? parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].high
                                            ).toFixed(2)
                                          : 0.0
                                        : 0.0
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={`${
                                      userAsset.money === "INR"
                                        ? "₹"
                                        : userAsset.money === "USD"
                                        ? "$"
                                        : ""
                                    } `}
                                    suffix={`${
                                      userAsset.money === "AED" ? "د.إ" : ""
                                    } `}
                                  />
                                </div>
                                <div className="low">
                                  <CurrencyFormat
                                    value={
                                      !isEmpty(this.state.marketLast)
                                        ? this.state.marketLast[userAsset.name]
                                          ? parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].low
                                            ).toFixed(2)
                                          : 0.0
                                        : 0.0
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={`${
                                      userAsset.money === "INR"
                                        ? "₹"
                                        : userAsset.money === "USD"
                                        ? "$"
                                        : ""
                                    } `}
                                    suffix={`${
                                      userAsset.money === "AED" ? "د.إ" : ""
                                    } `}
                                  />
                                </div>
                                <div
                                  className={
                                    !isEmpty(this.state.marketLast)
                                      ? this.state.marketLast[userAsset.name]
                                        ? parseFloat(
                                            this.state.marketLast[
                                              userAsset.name
                                            ].last
                                          ) -
                                            parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].open
                                            ) <
                                          0
                                          ? "change red"
                                          : "change green"
                                        : "change green"
                                      : "change red"
                                  }
                                >
                                  {!isEmpty(this.state.marketLast)
                                    ? this.state.marketLast[userAsset.name]
                                      ? (
                                          ((parseFloat(
                                            this.state.marketLast[
                                              userAsset.name
                                            ].last
                                          ) -
                                            parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].open
                                            )) /
                                            (parseFloat(
                                              this.state.marketLast[
                                                userAsset.name
                                              ].open
                                            ) === 0
                                              ? 1
                                              : parseFloat(
                                                  this.state.marketLast[
                                                    userAsset.name
                                                  ].open
                                                ))) *
                                          100
                                        ).toFixed(2)
                                      : "0.00"
                                    : "-"}{" "}
                                  %
                                </div>
                                {/* <div className="volume">
                                                                {
                                                                    (!isEmpty(this.state.marketLast)) ?
                                                                    (this.state.marketLast[userAsset.name]) ?
                                                                    (parseFloat(this.state.marketLast[userAsset.name].volume)/10).toFixed(2) :
                                                                    0.00 : 0.00
                                                                }{` ${userAsset.stock}`}
                                                            </div>                                    */}
                              </ListItem>
                            );
                          })}
                        </List>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={4} sm={6} className="hidden-sm">
                  <div className="tradeBox orderBook">
                    <div className="headTitle">
                      <Typography component="h6">ORDERBOOK</Typography>
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
                                <div className="amount">Size</div>
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
                                <div className="amount">Size</div>
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
                                      {bid.qty}{" "}
                                    </div>
                                    <div className="bid" id="trades_bid">
                                      {" "}
                                      {bid.price}{" "}
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
                                      {ask.price}{" "}
                                    </div>
                                    <div
                                      className="amount trades_ask_amount"
                                      id="trades_amount2"
                                    >
                                      {" "}
                                      {ask.qty}{" "}
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

                <Grid item xs={12} md={8} sm={12}>
                  <div className="graphBox">
                    <div className="headTitle">
                      <Typography component="h6">Graph</Typography>
                    </div>
                    <div className="graphData">
                      <iframe
                        className="pricechart-iframe"
                        title="priceChart"
                        src={`https://wchart.bitexuae.net/${activeMoney}/${chartCoin}`}
                      ></iframe>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            {auth.isAuthenticated ? (
              <Grid item xs={12} md={3} sm={12} className="col-03">
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
                      Long
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
                      Short
                    </Button>
                  </div>

                  <Card className="">
                    <CardHeader
                      title={
                        <Tabs
                          scrollButtons="auto"
                          variant="scrollable"
                          onChange={this.handlebuyChange.bind(this)}
                          value={this.state.buyTabValue}
                          textColor="primary"
                          indicatorColor="primary"
                        >
                          <Tab
                            value="buy"
                            label="Market"
                            className={
                              this.state.currentTrade === "buy"
                                ? classes.tabRoot + " buyMarket"
                                : classes.tabRoot + " sellMarket"
                            }
                          />
                          <Tab
                            value="sell"
                            label="Limit"
                            className={
                              this.state.currentTrade === "buy"
                                ? classes.tabRoot + " buyMarket"
                                : classes.tabRoot + " sellMarket"
                            }
                          />
                        </Tabs>
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

                          <div className="inline fee">
                            <Typography component="h5">Fee</Typography>

                            <Typography component="h5">
                              {this.state.takerFee * 100} %
                            </Typography>
                          </div>

                          {this.state.currentTrade === "buy" ? (
                            <div className="inline total">
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

                          <div className="inline total">
                            <Typography component="h5">Subtotal:</Typography>

                            <Typography component="h5">
                              {this.state.marketSubtotal} {activeMoney}
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
                                Long
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
                              Short
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
                                  Long
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
                                Short
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
                              parseFloat(order.dealStock) > 0 ||
                              parseFloat(order.dealMoney) > 0
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
                                    {`${order.dealStock} @ ${(
                                      parseFloat(order.dealMoney) /
                                      parseFloat(order.dealStock)
                                    ).toFixed(2)}`}
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
              <Grid item xs={12} md={3} sm={12} className="col-03">
                <div className="tabBox">
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

FutureTrading.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  snackMessages: PropTypes.object.isRequired,
  getOrderDepth: PropTypes.func.isRequired,
  getAvailaleMarkets: PropTypes.func.isRequired,
  activeFutureMarket: PropTypes.func.isRequired,
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

  getFutureTikers: PropTypes.func.isRequired,
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
  activeFutureMarket,
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
  getFutureTikers,
})(withStyles(themeStyles)(FutureTrading));
