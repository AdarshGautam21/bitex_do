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
import ReactSpeedometer from "react-d3-speedometer";

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
  DialogContentText,
  Select,
  FormHelperText,
  Slider,
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
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import { AccountBalanceWallet, TrendingUp } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import {
  getOrderDepth,
  getUserOrders,
  getClientOrders,
  placeMarginMarketOrder,
  placeMarginLimitOrder,
  getPendingOrders,
  getClientPendingOrders,
  cancelUserOrder,
} from "../../../actions/orderActions";
import {
  getUserProfile,
  getAgentClients,
  getUserClientWallets,
} from "../../../actions/userActions";
import {
  getUserWallet,
  getMarketLast,
  getActiveMarginAssets,
  transferAmountToMarginWallet,
  transferAmountFromMarginWallet,
  borrowAmountToMarginWallet,
  repayAmountToMarginWallet,
  getUserMarginLevel,
} from "../../../actions/walletActions";
import { logOut } from "../../../actions/authActions";
import {
  getAvailaleMarkets,
  activeMarket,
  getActiveAssets,
} from "../../../actions/walletActions";
import tableIcons from "../../../common/tableIcons";

import isEmpty from "../../../validation/isEmpty";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../../common/SnackbarMessage";
import { clearSnackMessages } from "../../../actions/messageActions";

import themeStyles from "../../../assets/themeStyles";
import apiUrl from "../../../config";
import currencyIcon from "../../../common/CurrencyIcon";
import MaterialTable from "material-table";

import whiteLogoImg from "../../../assets/img/white-logo.webp";

const moment = require("moment");
let CurrencyFormat = require("react-currency-format");

let orderDeals = [];
let newAsks = [];
let newBids = [];
let wsAllow = true;
let newBalanceUpdate = true;

class MarginTrading extends Component {
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
    currentUserMarginCryptoWallet: {},
    currentUserFiatWallet: { coin: "AED" },
    currentUserMarginFiatWallet: { coin: "AED" },
    currentClientCryptoWallet: {},
    currentClientFiatWallet: { coin: "INR" },
    snackMessages: {},
    marketLast: {},
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
    transerDialog: false,
    borrowDialog: false,
    selectedWallet: {},
    selectedMarginWallet: {},
    transferAmount: "",
    userPassword: "",
    selectedLeverage: 1,
    borrowAmount: 0,
    repayAmount: 0,
    borrowTab: "borrow",
    selectedWalletId: "",
    selectedMarginWalletId: "",
    toMarginWallet: true,
  };

  getUserAllOrders = () => {
    const { auth } = this.props;
    let currentMarket = this.props.trading.activeMarket;

    if (!isEmpty(auth.user) && newBalanceUpdate) {
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
      // this.props.getUserProfile(auth.user.id);
      this.props.getActiveAssets(auth.user.id);
      this.props.getActiveMarginAssets(auth.user.id);
    }
    newBalanceUpdate = false;
    setTimeout(() => {
      newBalanceUpdate = true;
    }, 3000);
  };

  componentDidMount = async () => {
    // window.fcWidget.destroy();
    wsAllow = true;
    const { auth } = this.props;
    if (!auth.user.marginTrading) {
      this.props.history.push("/");
    }
    await this.props.getAvailaleMarkets();
    await this.props.getMarketLast();

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

    for (let ckey in this.props.wallet.userMarginAssets) {
      if (
        this.props.wallet.userMarginAssets[ckey].fiat &&
        this.props.wallet.userMarginAssets[ckey].active
      ) {
        await this.setState({
          currentUserMarginFiatWallet: this.props.wallet.userMarginAssets[ckey],
        });
      }
    }

    let marketLast = this.state.marketLast;
    for (let key in this.props.trading.markets) {
      marketLast[this.props.trading.markets[key].name] =
        this.props.wallet.marketLasts[this.props.trading.markets[key].name];
      this.setState({ marketLast: marketLast });
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
            this.props.trading.markets[key].money &&
          this.state.currentUserFiatWallet.active
        ) {
          this.props.activeMarket(this.props.trading.markets[key]);
        }
      }
    }
    this.wsConnect();
    if (auth.isAuthenticated) {
      if (isEmpty(this.props.user.userProfile)) {
        await this.props.getUserProfile(auth.user.id);
      }
      if (isEmpty(this.props.wallet.userAssets)) {
        await this.props.getActiveAssets(auth.user.id);
      }
      if (isEmpty(this.props.wallet.userMarginAssets)) {
        await this.props.getActiveMarginAssets(auth.user.id);
      }

      if (auth.user.agent) {
        if (isEmpty(this.props.user.agentClients)) {
          await this.props.getAgentClients(auth.user.id);
        }
      }
      this.props.getUserMarginLevel(auth.user.id);
    }
  };

  /**
   * Serializes data when it's received.
   */
  serializeData = (data) => {
    if (!data.asks || !data.bids) {
      let marketLast = this.state.marketLast;
      let currentMarket = this.props.trading.activeMarket;
      marketLast[currentMarket.name]["last"] = parseFloat(data.price).toFixed(
        2
      );
      this.setState({ marketLast: marketLast });
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

  wsConnect = async () => {
    const { auth } = this.props;
    console.log("websocket called");
    if (this.state.ws) {
      await this.state.ws.close();
    }
    // let ws = new WebSocket("wss://api.bitexuae.com:2096");
    let ws = new WebSocket("ws://139.162.234.246:8020");
    // let ws = new WebSocket("ws://api.bitexuae.net:2096");
    this.setState({ ws: ws });
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
    }

    ws.onopen = () => {
      this.setState({ wsConnection: true });
      let currentMarket = this.props.trading.activeMarket;
      // let wsList = this.state.wsList;
      // wsList.push(ws);
      // this.setState({wsList: wsList});
      var msg = JSON.stringify({
        id: 12121,
        method: "depth.subscribe",
        params: [currentMarket.name, 100, "0"],
      });
      ws.send(msg);
      var dealMsg = JSON.stringify({
        id: 12121,
        method: "deals.subscribe",
        params: [currentMarket.name],
      });
      ws.send(dealMsg);
      // var stateMsg = JSON.stringify({id: 12121, method: "state.subscribe", params: markets});
      // ws.send(stateMsg);
      var qmsg = JSON.stringify({
        id: 12121,
        method: "depth.query",
        params: [currentMarket.name, 100, "0"],
      });
      ws.send(qmsg);
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

      // ws.send(JSON.stringify({currentMarket: currentMarket, currentCurrency: currentMarket.money}));

      // ws.send(JSON.stringify(subscribeOrderMsg));
    };

    ws.onmessage = (evt) => {
      let currentMarket = this.props.trading.activeMarket;
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

      if (message.method === "depth.update") {
        var msg = JSON.stringify({
          id: 12121,
          method: "depth.query",
          params: [currentMarket.name, 100, "0"],
        });
        ws.send(msg);
        if (message.params[1].asks) {
          newAsks = [];
          for (let akey in message.params[1].asks) {
            newAsks.push(message.params[1].asks[akey][0]);
          }
          if (message.params[1].asks.length >= 100) {
            newAsks = [];
          }
        }
        if (message.params[1].bids) {
          newBids = [];
          for (let bkey in message.params[1].bids) {
            newBids.push(message.params[1].bids[bkey][0]);
          }
          if (message.params[1].bids.length >= 100) {
            newBids = [];
          }
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
        ws.send(dealMsg);
      }

      // // if(message.method === 'state.update') {
      // //     let marketLast = this.state.marketLast;
      // //     if(message.params) {
      // //         marketLast[[message.params[0]]] = message.params[1];
      // //         this.setState({marketLast: marketLast});
      // //     }
      // // }

      // // // console.log(message);

      if (message.result) {
        if (message.result.length > 0) {
          if (message.result[0].type) {
            this.setState({ orderDeals: message.result });
          }
        }

        if (message.result.asks) {
          if (message.result.asks[0]) {
            // var resBuy = this.state.orderBookAsks.filter( function(n) { return !this.has(n); }, new Set(message.result.asks) );
            // console.log(resBuy);
            this.setState({
              orderBookAsks: message.result.asks,
              marketLastBuy: message.result.asks[0][0],
            });
          } else {
            this.setState({
              orderBookAsks: message.result.asks,
              marketLastBuy: 1,
            });
          }
        }

        if (message.result.bids) {
          if (message.result.bids[0]) {
            this.setState({
              orderBookBids: message.result.bids,
              marketLastSell: message.result.bids[0][0],
            });
          } else {
            this.setState({
              orderBookBids: message.result.bids,
              marketLastSell: 1,
            });
          }
        }
      }
    };

    /**
     * In case of unexpected close event, try to reconnect.
     */
    ws.onclose = function () {
      this.setState({ wsConnection: false });
      if (wsAllow) {
        setTimeout(() => {
          this.wsConnect();
        }, 2000);
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
    if (!isEmpty(nextProps.snackMessages)) {
      this.setState({
        snackMessages: nextProps.snackMessages,
        transerDialog: false,
        borrowDialog: false,
      });
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
            this.state.currentUserMarginFiatWallet.coin ===
              availableMarket.money
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
          parseFloat(nextProps.user.userProfile.traderLevelFees.takerFee) / 100,
        makerFee:
          parseFloat(nextProps.user.userProfile.traderLevelFees.makerFee) / 100,
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
      nextProps.wallet.userMarginAssets.map((userAsset) => {
        if (userAsset.coin === nextProps.trading.activeMarket.stock) {
          this.setState({ currentUserMarginCryptoWallet: userAsset });
        }
        if (userAsset.coin === nextProps.trading.activeMarket.money) {
          this.setState({ currentUserMarginFiatWallet: userAsset });
        }
        return true;
      });
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
              parseFloat(this.state.currentUserMarginFiatWallet.walletAmount) <
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
              await this.props.placeMarginMarketOrder(userParams);
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
              await this.props.placeMarginMarketOrder(userParams);
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
              parseFloat(this.state.currentUserMarginFiatWallet.walletAmount) <
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
              await this.props.placeMarginMarketOrder(userParams);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
                selectedClient: {},
              });
            }
          }

          if (value === "sell") {
            if (
              parseFloat(
                this.state.currentUserMarginCryptoWallet.walletAmount
              ) < this.state.marketAmount
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
              await this.props.placeMarginMarketOrder(userParams);
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
          this.props.getActiveMarginAssets(user.id);
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
              parseFloat(this.state.currentUserMarginFiatWallet.walletAmount) <
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
              await this.props.placeMarginLimitOrder(userParams);
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
              await this.props.placeMarginLimitOrder(userParams);
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
              parseFloat(this.state.currentUserMarginFiatWallet.walletAmount) <
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
              await this.props.placeMarginLimitOrder(userParams);
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
              this.props.getActiveMarginAssets(user.id);
              await this.setState({
                orderProcess: false,
                newOrderDialog: false,
              });
            }
          }

          if (value === "sell") {
            if (
              parseFloat(
                this.state.currentUserMarginCryptoWallet.walletAmount
              ) < parseFloat(this.state.limitAmount)
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
              await this.props.placeMarginLimitOrder(userParams);
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
              this.props.getActiveMarginAssets(user.id);
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

  handleSelectedWalletChange = (event) => {
    this.setState({ selectedWalletId: event.target.value });
    for (let ckey in this.props.wallet.userAssets) {
      if (this.props.wallet.userAssets[ckey]._id === event.target.value) {
        this.setState({ selectedWallet: this.props.wallet.userAssets[ckey] });
        for (let mkey in this.props.wallet.userMarginAssets) {
          if (
            this.props.wallet.userMarginAssets[mkey].coin ===
            this.props.wallet.userAssets[ckey].coin
          ) {
            this.setState({
              selectedMarginWallet: this.props.wallet.userMarginAssets[mkey],
              selectedMarginWalletId:
                this.props.wallet.userMarginAssets[mkey]._id,
            });
          }
        }
      }
    }
  };

  handleSelectedMarginWalletChange = (event) => {
    this.setState({ selectedMarginWalletId: event.target.value });
    for (let mkey in this.props.wallet.userMarginAssets) {
      if (this.props.wallet.userMarginAssets[mkey]._id === event.target.value) {
        this.setState({
          selectedMarginWallet: this.props.wallet.userMarginAssets[mkey],
        });
        for (let ckey in this.props.wallet.userAssets) {
          if (
            this.props.wallet.userMarginAssets[mkey].coin ===
            this.props.wallet.userAssets[ckey].coin
          ) {
            this.setState({
              selectedWallet: this.props.wallet.userAssets[mkey],
              selectedWalletId: this.props.wallet.userAssets[mkey]._id,
            });
          }
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
    await this.props.activeMarket(market);
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

  transferAmount = async () => {
    const transferParams = {
      userId: this.props.auth.user.id,
      userWalletId: this.state.selectedWallet._id
        ? this.state.selectedWallet._id
        : "",
      userMarginWalletId: this.state.selectedMarginWallet._id
        ? this.state.selectedMarginWallet._id
        : "",
      transferAmount: this.state.transferAmount,
      // userPassword: this.state.userPassword,
    };
    if (this.state.toMarginWallet) {
      await this.props.transferAmountToMarginWallet(transferParams);
    } else {
      await this.props.transferAmountFromMarginWallet(transferParams);
    }
    await this.props.getActiveAssets(this.props.auth.user.id);
    await this.props.getActiveMarginAssets(this.props.auth.user.id);
    this.setState({
      userWalletId: "",
      userMarginWalletId: "",
      transferAmount: "",
      // userPassword: '',
      selectedWallet: {},
      selectedMarginWallet: {},
      selectedWalletId: "",
      selectedMarginWalletId: "",
    });
  };

  borrowAmount = async () => {
    const borrowParams = {
      userId: this.props.auth.user.id,
      borrowAmount: `${this.state.borrowAmount}`,
      userMarginWalletId: this.state.selectedMarginWallet._id
        ? this.state.selectedMarginWallet._id
        : "",
    };
    await this.props.borrowAmountToMarginWallet(borrowParams);
    await this.props.getActiveAssets(this.props.auth.user.id);
    await this.props.getActiveMarginAssets(this.props.auth.user.id);
    this.setState({
      borrowAmount: "",
      selectedMarginWallet: {},
      selectedMarginWalletId: "",
    });
    await this.props.getUserMarginLevel(this.props.auth.user.id);
  };

  repayBorrowAmount = async () => {
    const repayParams = {
      userId: this.props.auth.user.id,
      repayAmount: `${this.state.repayAmount}`,
      userMarginWalletId: this.state.selectedMarginWallet._id
        ? this.state.selectedMarginWallet._id
        : "",
    };
    await this.props.repayAmountToMarginWallet(repayParams);
    await this.props.getActiveAssets(this.props.auth.user.id);
    await this.props.getActiveMarginAssets(this.props.auth.user.id);
    this.setState({
      repayAmount: "",
      selectedMarginWallet: {},
      selectedMarginWalletId: "",
    });
    await this.props.getUserMarginLevel(this.props.auth.user.id);
  };

  calculateMaxBorrowAmount = (event, value) => {
    this.setState({
      selectedLeverage: value,
      borrowAmount: this.state.selectedMarginWallet.borrowAmount
        ? ((parseFloat(this.state.selectedMarginWallet.availableBorrowAmount) *
            2 -
            parseFloat(this.state.selectedMarginWallet.borrowAmount)) /
            2) *
          parseFloat(value)
        : parseFloat(this.state.selectedMarginWallet.availableBorrowAmount) *
          parseFloat(value),
    });
  };

  render() {
    const { classes, trading, auth, location, wallet } = this.props;
    const {
      dispalyMarkets,
      mobileMenu,
      orderBookBids,
      orderBookAsks,
      orderDeals,
      errors,
      marketAmount,
      currentUserMarginFiatWallet,
      currentUserMarginCryptoWallet,
      snackMessages,
      variant,
      snackbarMessage,
      limitPrice,
      limitAmount,
      userClientWallets,
    } = this.state;

    const { agentClients } = this.props.user;

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

    let tabLinks = authLinks;

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
            name="keywords"
            content="bitcoin india, bitcoin india price today, bitcoin in india legal, bitcoin india price live, bitcoin indian rupees, how to buy bitcoin india, bitcoin india latest news, btc price in india today, btc trading in india, btc in india legal, btc india news, how to buy ripple, buy xrp india, crypto exchange, crypto india, crypto dubai, buy bitcoin dubai, buy and sell bitcoin, btc price inr, buy ripple, buy ethereum, bitcoin exchange, bitcoin trading, xrp india, btc mumbai, trillionbit, trillionbit india, trillionbit crypto"
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
          open={this.state.borrowDialog}
          onClose={() => this.setState({ borrowDialog: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableBackdropClick
          fullWidth={true}
          // maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">
            <Tabs
              className="settingSubMenu"
              scrollButtons="auto"
              variant="scrollable"
              onChange={(event, newValue) =>
                this.setState({ borrowTab: newValue })
              }
              value={this.state.borrowTab}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="borrow" label="Borrow" />
              <Tab value="repay" label="Repay" />
            </Tabs>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.selectedMarginWallet.borrowAmount &&
              parseFloat(this.state.selectedMarginWallet.borrowAmount) >=
                (parseFloat(this.state.selectedMarginWallet.walletAmount) * 2 -
                  parseFloat(this.state.selectedMarginWallet.borrowAmount)) /
                  2
                ? "Maximum borrow limit reached"
                : "Borrow amount to margin wallet."}
            </DialogContentText>

            <Grid
              spacing={3}
              container
              direction="row"
              justify="space-around"
              alignItems="flex-start"
            >
              <Grid item md={12}>
                {this.state.selectedMarginWallet.walletAmount
                  ? `Current Available Margin Balance: ${this.state.selectedMarginWallet.walletAmount} ${this.state.selectedMarginWallet.coin}`
                  : ""}
              </Grid>
              <Grid item md={12}>
                <FormControl
                  className={classes.formControl}
                  style={{ width: "100%" }}
                  error={errors.userMarginWalletId ? true : false}
                >
                  <Select
                    labelId="select-wallet"
                    id="select-wallet"
                    value={this.state.selectedMarginWalletId}
                    onChange={this.handleSelectedMarginWalletChange}
                  >
                    <MenuItem value="" disabled>
                      Select Wallet
                    </MenuItem>
                    {this.props.wallet.userMarginAssets.map(
                      (userAsset, index) => {
                        return (
                          <MenuItem value={userAsset._id} key={index}>
                            <div className="SelectWallet">
                              <img
                                src={currencyIcon(userAsset.coin)}
                                alt={userAsset.coin}
                                width="15"
                              />{" "}
                              {userAsset.fiat
                                ? parseFloat(userAsset.walletAmount).toFixed(2)
                                : parseFloat(userAsset.walletAmount).toFixed(
                                    2
                                  )}{" "}
                              {userAsset.coin}
                            </div>
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                  <FormHelperText>
                    {errors.userMarginWalletId ? errors.userMarginWalletId : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <Typography variant="subtitle2">
                  Wallet Balance: {this.state.selectedMarginWallet.walletAmount}{" "}
                  {this.state.selectedMarginWallet.coin}
                </Typography>
                <Typography variant="subtitle2">
                  Amount Borrowed:{" "}
                  {this.state.selectedMarginWallet.borrowAmount
                    ? parseFloat(this.state.selectedMarginWallet.borrowAmount)
                    : 0}{" "}
                  {this.state.selectedMarginWallet.coin}
                </Typography>
                {this.state.borrowTab === "repay" ? (
                  <Typography variant="subtitle2">
                    Total Repay Amount:{" "}
                    {!isEmpty(this.state.selectedMarginWallet)
                      ? parseFloat(
                          this.state.selectedMarginWallet.borrowAmount
                        ) +
                        parseFloat(
                          this.state.selectedMarginWallet.totalBorrowIntrests
                        )
                      : 0}{" "}
                    {this.state.selectedMarginWallet.coin}
                  </Typography>
                ) : (
                  <Typography variant="subtitle2">
                    Available Borrow Amount:{" "}
                    {this.state.selectedMarginWallet.borrowAmount
                      ? parseFloat(
                          this.state.selectedMarginWallet.availableBorrowAmount
                        ) *
                          2 -
                        parseFloat(this.state.selectedMarginWallet.borrowAmount)
                      : !isEmpty(this.state.selectedMarginWallet)
                      ? parseFloat(
                          this.state.selectedMarginWallet.availableBorrowAmount
                        ) * 2
                      : 0}{" "}
                    {this.state.selectedMarginWallet.coin}
                  </Typography>
                )}
              </Grid>
              {this.state.borrowTab === "repay" ? (
                <Grid item md={12}>
                  <TextField
                    error={errors.repayAmount ? true : false}
                    value={this.state.repayAmount}
                    onChange={this.handleInputChange("repayAmount")}
                    type="number"
                    fullWidth={true}
                    placeholder={"Enter amount to repay"}
                    style={{ paddingTop: 10 }}
                    inputProps={{
                      "aria-label": "market-amount",
                    }}
                    helperText={errors.repayAmount ? errors.repayAmount : ""}
                  />
                </Grid>
              ) : this.state.selectedMarginWallet.borrowAmount &&
                0 >=
                  parseFloat(
                    this.state.selectedMarginWallet.availableBorrowAmount
                  ) *
                    2 -
                    parseFloat(this.state.selectedMarginWallet.borrowAmount) &&
                this.state.borrowTab === "borrow" ? undefined : (
                <Grid item md={12}>
                  <TextField
                    error={errors.borrowAmount ? true : false}
                    value={this.state.borrowAmount}
                    onChange={this.handleInputChange("borrowAmount")}
                    type="number"
                    fullWidth={true}
                    placeholder={"Enter amount to transfer"}
                    // className={classes.input}
                    style={{ paddingTop: 10 }}
                    inputProps={{
                      "aria-label": "market-amount",
                    }}
                    helperText={errors.borrowAmount ? errors.borrowAmount : ""}
                  />
                </Grid>
              )}
              {this.state.borrowTab === "borrow" ? (
                this.state.selectedMarginWallet.borrowAmount &&
                0 >=
                  parseFloat(
                    this.state.selectedMarginWallet.availableBorrowAmount
                  ) *
                    2 -
                    parseFloat(this.state.selectedMarginWallet.borrowAmount) &&
                this.state.borrowTab === "borrow" ? undefined : (
                  <Grid item md={6}>
                    <Typography variant="subtitle2">
                      Leverage: {this.state.selectedLeverage}X
                    </Typography>
                    <Slider
                      defaultValue={0.1}
                      onChange={(event, value) =>
                        this.calculateMaxBorrowAmount(event, value)
                      }
                      valueLabelFormat={(value) => `${value}X`}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={0.1}
                      marks
                      min={1}
                      max={2}
                    />
                  </Grid>
                )
              ) : undefined}
            </Grid>
          </DialogContent>
          <DialogActions>
            {this.state.borrowTab === "borrow" ? (
              <Button
                onClick={() => this.borrowAmount()}
                color="primary"
                disabled={
                  this.state.selectedMarginWallet.borrowAmount &&
                  0 >=
                    parseFloat(
                      this.state.selectedMarginWallet.availableBorrowAmount
                    ) *
                      2 -
                      parseFloat(this.state.selectedMarginWallet.borrowAmount)
                    ? true
                    : false
                }
              >
                Borrow
              </Button>
            ) : (
              <Button onClick={() => this.repayBorrowAmount()} color="primary">
                Repay
              </Button>
            )}
            <Button
              onClick={() => this.setState({ borrowDialog: false })}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.transerDialog}
          onClose={() => this.setState({ transerDialog: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableBackdropClick
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">{"Transfer"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid
                spacing={1}
                container
                direction="row"
                justify="space-around"
                alignItems="flex-start"
              >
                <Grid item md={3} />
                <Grid
                  item
                  md={2}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  {this.state.toMarginWallet ? (
                    <AccountBalanceWallet />
                  ) : (
                    <TrendingUp />
                  )}{" "}
                  {this.state.toMarginWallet
                    ? " Spot Wallet"
                    : " Margin Wallet"}
                </Grid>
                <Grid
                  item
                  md={1}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  To
                </Grid>
                <Grid
                  item
                  md={2}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  {this.state.toMarginWallet ? (
                    <TrendingUp />
                  ) : (
                    <AccountBalanceWallet />
                  )}{" "}
                  {this.state.toMarginWallet
                    ? " Margin Wallet"
                    : " Spot Wallet"}
                </Grid>
                <Grid item md={3} />
              </Grid>
            </DialogContentText>
            <Grid
              spacing={3}
              container
              direction="row"
              justify="space-around"
              alignItems="flex-start"
            >
              <Grid item md={5}>
                {this.state.toMarginWallet ? (
                  <FormControl
                    className={classes.formControl}
                    style={{ width: "100%" }}
                    error={errors.userWalletId ? true : false}
                  >
                    <Select
                      labelId="select-wallet"
                      id="select-wallet"
                      value={this.state.selectedWalletId}
                      onChange={this.handleSelectedWalletChange}
                    >
                      <MenuItem value="" disabled>
                        Select Spot Wallet
                      </MenuItem>
                      {this.props.wallet.userAssets.map((userAsset, index) => {
                        return (
                          <MenuItem value={userAsset._id} key={index}>
                            <div className="SelectWallet">
                              <img
                                src={currencyIcon(userAsset.coin)}
                                alt={userAsset.coin}
                                width="15"
                              />{" "}
                              {userAsset.fiat
                                ? parseFloat(userAsset.walletAmount).toFixed(2)
                                : parseFloat(userAsset.walletAmount).toFixed(
                                    2
                                  )}{" "}
                              {userAsset.coin}
                            </div>
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {errors.userWalletId ? errors.userWalletId : ""}
                    </FormHelperText>
                    {!isEmpty(this.state.selectedMarginWallet) &&
                    !isEmpty(this.state.selectedWallet) ? (
                      <FormHelperText>
                        Total Available Balance:{" "}
                        {this.state.toMarginWallet
                          ? `${this.state.selectedWallet.walletAmount} ${this.state.selectedWallet.coin}`
                          : `${this.state.selectedMarginWallet.walletAmount} ${this.state.selectedMarginWallet.coin}`}
                      </FormHelperText>
                    ) : undefined}
                  </FormControl>
                ) : (
                  <FormControl
                    className={classes.formControl}
                    style={{ width: "100%" }}
                    error={errors.userMarginWalletId ? true : false}
                  >
                    <Select
                      labelId="select-wallet"
                      id="select-wallet"
                      value={this.state.selectedMarginWalletId}
                      onChange={this.handleSelectedMarginWalletChange}
                    >
                      <MenuItem value="" disabled>
                        Select Margin Wallet
                      </MenuItem>
                      {this.props.wallet.userMarginAssets.map(
                        (userAsset, index) => {
                          return (
                            <MenuItem value={userAsset._id} key={index}>
                              <div className="SelectWallet">
                                <img
                                  src={currencyIcon(userAsset.coin)}
                                  alt={userAsset.coin}
                                  width="15"
                                />{" "}
                                {userAsset.fiat
                                  ? parseFloat(userAsset.walletAmount).toFixed(
                                      2
                                    )
                                  : parseFloat(userAsset.walletAmount).toFixed(
                                      2
                                    )}{" "}
                                {userAsset.coin}
                              </div>
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                    <FormHelperText>
                      {errors.userMarginWalletId
                        ? errors.userMarginWalletId
                        : ""}
                    </FormHelperText>
                    {!isEmpty(this.state.selectedMarginWallet) &&
                    !isEmpty(this.state.selectedWallet) ? (
                      <FormHelperText>
                        Total Available Balance:{" "}
                        {this.state.toMarginWallet
                          ? `${this.state.selectedWallet.walletAmount} ${this.state.selectedWallet.coin}`
                          : `${this.state.selectedMarginWallet.walletAmount} ${this.state.selectedMarginWallet.coin}`}
                      </FormHelperText>
                    ) : undefined}
                  </FormControl>
                )}
              </Grid>
              <Grid
                item
                md={2}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="medium"
                  onClick={() =>
                    this.setState({
                      toMarginWallet: !this.state.toMarginWallet,
                    })
                  }
                >
                  <SwapHorizontalCircleOutlinedIcon style={{ fontSize: 30 }} />
                </IconButton>
              </Grid>
              <Grid item md={5}>
                <TextField
                  error={errors.transferAmount ? true : false}
                  value={this.state.transferAmount}
                  onChange={this.handleInputChange("transferAmount")}
                  type="number"
                  fullWidth={true}
                  placeholder={"Enter amount to transfer"}
                  // className={classes.input}
                  style={{ paddingTop: 10 }}
                  inputProps={{
                    "aria-label": "market-amount",
                  }}
                  helperText={
                    errors.transferAmount ? errors.transferAmount : ""
                  }
                />
                {!isEmpty(this.state.selectedMarginWallet) &&
                !isEmpty(this.state.selectedWallet) ? (
                  <FormHelperText>
                    Total Available Balance:{" "}
                    {this.state.toMarginWallet
                      ? `${this.state.selectedMarginWallet.walletAmount} ${this.state.selectedMarginWallet.coin}`
                      : `${this.state.selectedWallet.walletAmount} ${this.state.selectedWallet.coin}`}
                  </FormHelperText>
                ) : undefined}
              </Grid>
              {/* <Grid item md={5}>        
                                <TextField
                                    error={(errors.userPassword) ? true : false}
                                    value={this.state.userPassword}
                                    onChange={this.handleInputChange('userPassword')}
                                    type="password"
                                    fullWidth={true}
                                    placeholder={'Enter password'}
                                    // className={classes.input}
                                    style={{paddingTop: 10}}
                                    inputProps={{
                                        'aria-label': 'market-amount',
                                    }}
                                    helperText={errors.userPassword ? errors.userPassword : ''}
                                />
                            </Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.transferAmount()} color="primary">
              Transfer
            </Button>
            <Button
              onClick={() => this.setState({ transerDialog: false })}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
                <Typography>All orders</Typography>
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
            <Grid container spacing={3}>
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
                        "Buy"
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
                      "Sell"
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
                      "Sell"
                    )}
                  </Button>
                )}
              </Grid>
              <Grid item sm={6} xs={12} style={{ textAlign: "center" }}>
                <Typography>Wallet Balances</Typography>
                <List className={classes.root}>
                  {userClientWallets.length > 0 ? (
                    !this.state.ajaxProcess ? (
                      userClientWallets.map((userClientWallet, index) => {
                        return (
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar>
                                <img
                                  src={currencyIcon(userClientWallet.coin)}
                                  width="40"
                                  alt="Im"
                                />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={userClientWallet.walletAmount}
                              secondary={`${userClientWallet.displayName} (${userClientWallet.coin})`}
                            />
                          </ListItem>
                        );
                      })
                    ) : (
                      <CircularProgress />
                    )
                  ) : (
                    <Typography>No wallets found</Typography>
                  )}
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
                        {(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(
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
                        {bid[0]}{" "}
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
                        {ask[0]}{" "}
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
                        {(parseFloat(ask[1]) * parseFloat(ask[0])).toFixed(
                          2
                        )}{" "}
                      </div>
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
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
                      ? this.state.marketLast[trading.activeMarket.name]
                        ? parseFloat(
                            this.state.marketLast[trading.activeMarket.name].ask
                          ).toFixed(2)
                        : 0.0
                      : 0.0}{" "}
                    {activeMoney}{" "}
                  </span>
                </Typography>

                {!isEmpty(currentUserMarginCryptoWallet) ? (
                  <Typography component="h5" className="">
                    {this.state.currentUserMarginCryptoWallet.displayName}:{" "}
                    <span>
                      {this.state.currentUserMarginCryptoWallet.walletAmount}{" "}
                      {this.state.currentUserMarginCryptoWallet.coin}
                    </span>
                  </Typography>
                ) : undefined}

                {!isEmpty(currentUserMarginCryptoWallet) ? (
                  <Typography component="h5" className="">
                    {this.state.currentUserMarginFiatWallet.displayName}:{" "}
                    <span>
                      {this.state.currentUserMarginFiatWallet.coin === "INR"
                        ? "₹"
                        : ""}{" "}
                      {this.state.currentUserMarginFiatWallet.walletAmount}{" "}
                      {this.state.currentUserMarginFiatWallet.coin === "INR"
                        ? ""
                        : "د.إ"}
                    </span>
                  </Typography>
                ) : undefined}
              </div>
            </Grid>

            <Grid item xs={6} sm={5} md={6} className="tradeMenuLink">
              {auth.isAuthenticated ? (
                <div className="userbox">
                  {auth.user.marginTrading ? (
                    <Link to="/trading"> Exchange Trading </Link>
                  ) : undefined}
                  <Link
                    to="#"
                    aria-controls="customized-menu3"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={(e) => this.setState({ transerDialog: true })}
                  >
                    <Typography variant="body2" className="">
                      Transfer
                    </Typography>
                  </Link>
                  <Link
                    to="#"
                    aria-controls="customized-menu3"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={(e) => this.setState({ borrowDialog: true })}
                  >
                    <Typography variant="body2" className="">
                      Borrow
                    </Typography>
                  </Link>
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
                              {orderDeal.amount}{" "}
                            </div>
                            <div className="time" id="trades_time">
                              {" "}
                              {moment(parseInt(orderDeal.time) * 1000).format(
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
                            <div className="lastPrice">ASK</div>
                            <div className="lastPrice">BID</div>
                            <div className="high"> 24H HIGH </div>
                            <div className="low">24H LOW </div>
                            <div className="change">24H CHANGE</div>
                            {/* <div className="volume"> 24H VOLUME </div>                                     */}
                          </ListItem>
                        </List>

                        <List className="data scrollBody">
                          {trading.markets.map((userAsset, index) => {
                            if (
                              this.state.currentUserMarginFiatWallet.coin ===
                              userAsset.money
                            ) {
                              return (
                                <ListItem
                                  className={
                                    userAsset.stock ===
                                    this.props.trading.activeMarket.stock
                                      ? "tableData active"
                                      : "tableData"
                                  }
                                  id=""
                                  key={index}
                                  onClick={() => this.activeMarket(userAsset)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="symbol">
                                    {" "}
                                    <img
                                      src={currencyIcon(userAsset.stock)}
                                      alt={userAsset.stock}
                                    />{" "}
                                    {userAsset.name}{" "}
                                  </div>
                                  <div className="change red">
                                    <CurrencyFormat
                                      value={
                                        !isEmpty(this.state.marketLast)
                                          ? this.state.marketLast[
                                              userAsset.name
                                            ]
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
                                  <div className="change green">
                                    <CurrencyFormat
                                      value={
                                        !isEmpty(this.state.marketLast)
                                          ? this.state.marketLast[
                                              userAsset.name
                                            ]
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
                                  <div className="high">
                                    <CurrencyFormat
                                      value={
                                        !isEmpty(this.state.marketLast)
                                          ? this.state.marketLast[
                                              userAsset.name
                                            ]
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
                                          ? this.state.marketLast[
                                              userAsset.name
                                            ]
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
                            } else {
                              return undefined;
                            }
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
                                  {/* <div className="value" id="trades_value"> {(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(2)} </div> */}
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
                                    newAsks.includes(ask)
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
                                  {/* <div className="value trades_ask_amount" id="trades_value2"> {(parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(2)} </div> */}
                                </ListItem>
                              ))}
                            </List>
                          </div>
                        </div>
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
                        src={`https://wchart.bitexuae.net/${chartCoin}`}
                      ></iframe>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>

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
                                ? `Available: ${currentUserMarginFiatWallet.walletAmount} ${currentUserMarginFiatWallet.coin}`
                                : `Available: ${currentUserMarginCryptoWallet.walletAmount} ${currentUserMarginCryptoWallet.coin}`}
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
                                  ? `Available: ${currentUserMarginFiatWallet.walletAmount} ${currentUserMarginFiatWallet.coin}`
                                  : `Available: ${currentUserMarginCryptoWallet.walletAmount} ${currentUserMarginCryptoWallet.coin}`}
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
                                <CircularProgress size={24} color="secondary" />
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
              <div className="riskGraph">
                <div className="icon">
                  <div
                    style={{
                      width: "130px",
                      height: "65px",
                    }}
                  >
                    <ReactSpeedometer
                      fluidWidth={true}
                      ringWidth={4}
                      minValue={1}
                      maxValue={1.6}
                      segments={10}
                      value={
                        wallet.userMarginLevel.marginLevel
                          ? wallet.userMarginLevel.marginLevel > 1.5
                            ? 1.6
                            : wallet.userMarginLevel.marginLevel
                          : 0
                      }
                      needleColor="#fff"
                      startColor="red"
                      endColor="green"
                      labelFontSize={"10px"}
                      valueTextFontSize={"10px"}
                      needleHeightRatio={0.6}
                      outerCircleStyle={{
                        display: "none",
                      }}
                      labelStyle={{
                        display: "none",
                      }}
                      maxSegmentLabels={0}
                      // currentValuePlaceholderStyle={{display: 'none'}}
                    />
                  </div>
                </div>
                <div className="textInfo">
                  <List>
                    <ListItem>
                      <Typography component="h6">
                        Margin Level: {wallet.userMarginLevel.marginLevel}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography component="h6">
                        Total Balance:{" "}
                        {wallet.userMarginLevel.totalCurrentAssetValue} BTC
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography component="h6">
                        Total Debt: {wallet.userMarginLevel.totalDebtAssetValue}{" "}
                        BTC
                      </Typography>
                    </ListItem>
                  </List>
                </div>
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
                      <List className="openallList margintradingOpenALLBox">
                        {trading.pendingOrders.map((order, index) => (
                          <ListItem
                            className={order.side === 1 ? "redBorder" : ""}
                            key={index}
                          >
                            <Typography component="h3">
                              <span> {order.market} - </span>{" "}
                              {order.type === 1
                                ? `${order.amount} @ ${order.price}`
                                : `${order.dealStock} @ ${order.price}`}
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
                      <List className="openallList margintradingOpenALLBox">
                        {trading.orders.map((order, index) => (
                          <ListItem
                            className={order.side === 1 ? "redBorder" : ""}
                            key={index}
                          >
                            <Typography component="h3">
                              <span> {order.market} </span>
                              {order.type === 1
                                ? `${order.amount} @ ${order.price}`
                                : `${order.dealStock} @ ${order.price}`}
                            </Typography>

                            <Typography component="h4">
                              {order.side === 1 ? "Sell" : "Buy"} -{" "}
                              {order.type === 1 ? "Limit" : "Market"}
                            </Typography>

                            <Typography component="h5">
                              {moment(order.createTime).format("LLLL")}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Grid>
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

MarginTrading.propTypes = {
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
  placeMarginMarketOrder: PropTypes.func.isRequired,
  placeMarginLimitOrder: PropTypes.func.isRequired,
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
  getActiveMarginAssets: PropTypes.func.isRequired,
  transferAmountToMarginWallet: PropTypes.func.isRequired,
  borrowAmountToMarginWallet: PropTypes.func.isRequired,
  repayAmountToMarginWallet: PropTypes.func.isRequired,
  transferAmountFromMarginWallet: PropTypes.func.isRequired,
  getUserMarginLevel: PropTypes.func.isRequired,
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
  placeMarginMarketOrder,
  placeMarginLimitOrder,
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
  getActiveMarginAssets,
  transferAmountToMarginWallet,
  borrowAmountToMarginWallet,
  repayAmountToMarginWallet,
  transferAmountFromMarginWallet,
  getUserMarginLevel,
})(withStyles(themeStyles)(MarginTrading));
