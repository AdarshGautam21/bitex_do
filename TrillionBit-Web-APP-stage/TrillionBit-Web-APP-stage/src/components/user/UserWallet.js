import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Skeleton } from "@mui/lab";
import { Helmet } from "react-helmet";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// import { withStyles } from "@mui/styles/";
import { withStyles } from "@mui/styles";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import isEmpty from "../../validation/isEmpty";
import currencyIcon from "../../common/CurrencyIcon";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import blueCard from "../../assets/img/cards-blue.webp";
import bluebankTransfer from "../../assets/img/bank-blue.webp";
import bluenetbanking from "../../assets/img/net-banking.webp";
import bluewallet from "../../assets/img/wallet.webp";
import blueupi from "../../assets/img/upi.webp";

import buybtxCoin from "../../assets/img/banner/banner-055.webp";

import Post from "../../utils/post";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Button,
  TextField,
  CardActions,
  Chip,
  Box,
  IconButton,
  Link,
} from "@mui/material";
import { Typography, List, ListItem } from "@mui/material";
import { Tabs, Tab, Grid } from "@mui/material";
import tableIcons from "../../common/tableIcons";
import MaterialTable from "material-table";
import {
  getActiveAssets,
  createDepositRequest,
  transferDepositAmount,
  createWithdrawRequest,
  updateDepositRequest,
  getDepositRequests,
  getWithdrawalRequests,
  sendCrypto,
  checkXrpAddress,
  getOrderId,
  dasshpePaymentRequest,
  checkPaymentStatus,
  editDepositRequest,
  buyBtxCoin,
  getbankDetails,
} from "../../actions/walletActions";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import {
  getUserWallet,
  generateNewAddress,
  getUserWalletAddresses,
  cancelDeposit,
  cancelWithdraw,
} from "../../actions/walletActions";
import {
  placeMarketOrder,
  getWalletMaintenance,
} from "../../actions/orderActions";
import { getUserProfile, getUserIdentity } from "../../actions/userActions";

import { getUserBitexSavingWallet } from "../../actions/BitexSavingActions";
import { clearSnackMessages } from "../../actions/messageActions";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";
import fileImg from "../../assets/img/file.webp";

import themeStyles from "../../assets/themeStyles";
import styles from "../../assets/styles";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DashhPayCode from "../../common/DashhPayCode";
// import { inrAccountDetail, aedAccountDetail } from '../../common/AccountDetail';
import SimpleReactValidator from "simple-react-validator";
import InputMask from "react-input-mask";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import visaCardIcon from "../../assets/img/cards/visa.jpg";
import amexCardIcon from "../../assets/img/cards/amex.jpg";
import dinnerCardIcon from "../../assets/img/cards/dinner.jpg";
import jcbCardIcon from "../../assets/img/cards/jcb.jpg";
import rupayCardIcon from "../../assets/img/cards/rupay.jpg";
import masterCardIcon from "../../assets/img/cards/mastercard.jpg";

const moment = require("moment");

let transeferDepositRequestStatus = false;

class UserWallet extends Component {
  constructor() {
    super();
    this.validator = new SimpleReactValidator({
      element: (message) => (
        <Typography variant="body1" color="error">
          {message}
        </Typography>
      ),
    });
  }
  state = {
    userWallet: {},
    errors: {},
    messages: {},
    snackMessages: {},
    walletTab: "balance",
    walletOrderTab: "buy",
    reciepientAmount: "",
    finalAmount: "0",
    reciepientAddress: "",
    reciepientNote: "",
    snackbarMessage: "",
    variant: "success",
    ajaxProcess: false,
    walletAssetsTab: "",
    depositAmount: "",
    withdrawAmount: "",
    destinationTag: "",
    currentUserCryptoWallet: {},
    currentUserFiatWallet: {},
    marketApprox: 0.0,
    marketLastBuy: 0.0,
    marketLastSell: 0.0,
    marketSubtotal: 0.0,
    takerFee: 0.0,
    makerFee: 0.0,
    marketAmount: 0.0,
    ws: null,
    noteNumber: [...Array(10)]
      .map((i) => (~~(Math.random() * 36)).toString(36))
      .join(""),
    showDestinationTag: false,
    dTagRequired: true,
    xReciepientAddress: "",
    ajaxWalletProcess: false,
    ajaxwalletLoading: false,
    public_key: "pk_live_Jw4Dvql4jJVG",
    ippopayOpen: false,
    ippopayOrderId: "",
    cardPaymentBox: false,
    bankTransferBox: false,
    startDeposit: false,
    dasshpePaymentModel: false,
    dasshpePaymentData: {},
    dasshpePaymentUrl: "",
    paymentStatusModal: false,
    dasshpePaymentStatus: {},
    paymentStep: 1,
    paymentDetails: {
      nameOnCard: "",
      cardNumber: "",
      cardType: "VI",
      cardExpDt: "",
      cvv: "",
      paymentOption: "DC",
      mopType: "VI",
      upi: "",
      walletType: "101",
      bankType: "1013",
    },
    referenceNumber: "",
    userDepositeRequestId: "",
    cardTypeIcon: "",
    feesInPercentage: 4,
    feesAmount: 0,
    editDepositRequestModal: false,
    trc20: false,
    trx20: true,
  };

  selectOption = (value) => {
    if (value === "individualAccount") {
      this.setState({
        bankTransferBox: false,
        cardPaymentBox: !this.state.cardPaymentBox,
      });
    }

    if (value === "corporateAccount") {
      this.setState({
        cardPaymentBox: false,
        bankTransferBox: !this.state.bankTransferBox,
      });
    }
  };

  calculateDepositeAmountFees = (amount) => {
    let decimalNum = parseFloat((this.state.feesInPercentage / 100).toFixed(2));
    const feesAmount = decimalNum * amount;
    this.setState({
      feesAmount,
    });
    return feesAmount;
  };

  selectPaymentOption = (type) => {
    if (this.state.depositAmount) {
      let fees = 0;
      if (this.props.wallet.userWallet.coin === "INR") {
        if (parseFloat(this.state.depositAmount) > 999) {
          this.validator.purgeFields();
          this.validator.hideMessages();
          const { paymentDetails } = this.state;
          paymentDetails["paymentOption"] = type;
          if (type === "BankTransfer") {
            fees = 0;
            //this.createDepositRequest();
          } else {
            // fees = this.calculateDepositeAmountFees(this.state.depositAmount);
            fees = 0;
          }
          this.setState({
            paymentOption: type,
            paymentStep: 2,
            paymentDetails,
            fees: fees,
          });
        } else {
          this.setState({
            errors: {
              depositAmount: "Minimum amount to deposit is 1000 INR",
            },
          });
        }
      } else {
        if (parseFloat(this.state.depositAmount) >= 200) {
          this.validator.purgeFields();
          this.validator.hideMessages();
          const { paymentDetails } = this.state;
          paymentDetails["paymentOption"] = type;
          if (type === "BankTransfer") {
            // this.createDepositRequest();
          }
          this.setState({
            paymentOption: type,
            paymentStep: 2,
            paymentDetails,
            fees: fees,
          });
        } else {
          this.setState({
            errors: {
              depositAmount: "Minimum amount to deposit is 200 AED",
            },
          });
        }
      }
    } else {
      this.setState({
        errors: { depositAmount: "Enter amount to deposit." },
      });
    }
  };

  componentDidMount = async () => {
    const query = new URLSearchParams(this.props.location.search);
    const orderId = query.get("status");
    if (orderId) {
      this.openPaymentStatusModel(orderId);
      window.history.replaceState(null, null, "/");
      window.history.pushState(null, null, "/user-wallet");
      window.onpopstate = function (event) {
        window.history.go(1);
      };
    }
    require("../../assets/css/fullheight.css");

    // window.fcWidget.destroy();
    this.setState({ ajaxwalletLoading: true });
    const { auth } = this.props;
    this.props.getbankDetails();
    await this.props.getActiveAssets(auth.user.id);
    // await this.props.getDepositRequests(auth.user.id);
    await this.props.getWithdrawalRequests(auth.user.id);
    await this.props.getUserIdentity(auth.user.id);
    await this.props.getUserBitexSavingWallet(auth.user.id);
    await this.props.getWalletMaintenance();
    if (this.props.wallet.userAssets.length > 0) {
      await this.props.getUserWallet(this.props.wallet.userAssets[0]._id);
      await this.props.getUserWalletAddresses(
        auth.user.id,
        this.props.wallet.userAssets[0].coin
      );
      this.wsConnect();
    }

    await this.props.getUserProfile(auth.user.id);
    this.setState({ ajaxwalletLoading: false });
  };

  transferDepositAmount = async (data) => {
    const { depositAmount } = this.state;
    const { userWallet } = this.props.wallet;

    const depositParams = {
      userId: this.props.auth.user.id,
      type: "Ippopay Transfer",
      amount: depositAmount,
      coin: userWallet.coin,
      fees: 0,
      noteNumber: data.transaction_no,
    };

    await this.props.transferDepositAmount(depositParams);
    await this.props.getWithdrawalRequests(this.props.auth.user.id);
    this.setState({ depositAmount: "", ippopayOpen: false });
  };

  async ippopayHandler(e) {
    if (e.data.status === "success") {
      if (!transeferDepositRequestStatus) {
        console.log(e.data);
        transeferDepositRequestStatus = true;
        const { depositAmount } = this.state;
        const { userWallet } = this.props.wallet;

        const depositParams = {
          userId: this.props.auth.user.id,
          type: "Ippopay Transfer",
          amount: depositAmount,
          coin: userWallet.coin,
          fees: 0,
          noteNumber: e.data.transaction_no,
        };

        await this.props.transferDepositAmount(depositParams);
        await this.props.getWithdrawalRequests(this.props.auth.user.id);
        this.setState({ depositAmount: "", ippopayOpen: false });
        transeferDepositRequestStatus = false;
      }
    }
    if (e.data.status === "failure") {
      console.log(e.data);
      this.setState({ depositAmount: "", ippopayOpen: false });
    }
  }

  componentDidUpdate() {
    window.addEventListener("message", this.ippopayHandler.bind(this));
  }

  async ippopayOpen() {
    if (parseFloat(this.state.depositAmount) > 999) {
      this.props
        .getOrderId(
          this.props.auth.user.id,
          this.state.depositAmount,
          this.props.wallet.userWallet.coin
        )
        .then((res) => {
          if (res) {
            this.setState({
              ippopayOrderId: res.data.order_id,
              ippopayOpen: true,
              errors: {},
            });
          }
        });
    } else {
      this.setState({
        errors: {
          depositAmount: `Minimum amount to deposit is 1000 ${this.props.wallet.userWallet.coin}`,
        },
      });
    }
  }

  openPaymentStatusModel = async (orderId) => {
    this.props
      .checkPaymentStatus(this.props.auth.user.id, orderId)
      .then((res) => {
        if (res) {
          this.setState({
            paymentStatusModal: true,
            dasshpePaymentStatus: res.data,
          });
        }
      });
  };

  editDepositRequest = async (id) => {
    this.setState({
      editDepositRequestModal: true,
      userDepositeRequestId: id,
    });
  };

  getBitexSavingWalletBalance = (coin) => {
    const activeBitexSavingWallet =
      this.props.bitexSaving?.activeBitexSavingWallet;
    if (!isEmpty(activeBitexSavingWallet)) {
      return activeBitexSavingWallet.find((element) => coin === element.coin)
        ?.walletAmount;
    }
    return null;
  };

  async dasshpePaymentRequest(data) {
    // if (parseFloat(this.state.depositAmount) > 999) {
    this.props.dasshpePaymentRequest(data).then((res) => {
      if (res) {
        const { url, formData } = res.data;
        // this.setState({ dasshpePaymentUrl: url,  dasshpePaymentData: formData, dasshpePaymentModel: true});
        Post({
          action: url,
          params: formData,
          target: "_self",
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 3000);
      }
    });
    // } else {
    //     this.setState({ errors: {depositAmount: 'Minimum amount to deposit is 1000 INR'} });
    // }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.snackMessages) {
      this.setState({ snackMessages: nextProps.snackMessages });
    }
    if (nextProps.wallet.userAssets.length > 0) {
      if (isEmpty(this.state.walletAssetsTab)) {
        this.setState({
          walletAssetsTab: nextProps.wallet.userAssets[0]._id,
        });
      }
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
      for (let userAsset of nextProps.wallet.userAssets) {
        if (userAsset.coin === nextProps.trading.activeMarket.stock) {
          this.setState({ currentUserCryptoWallet: userAsset });
        }
        if (
          userAsset.coin === nextProps.trading.activeMarket.money &&
          userAsset.active
        ) {
          this.setState({ currentUserFiatWallet: userAsset });
        }
      }
      return true;
      // nextProps.wallet.userAssets.map(userAsset => {
      // });
    }
  }

  // /**
  //  * Serializes data when it's received.
  //  */
  // serializeData = (data) => {
  //     if (data.asks || data.bids) {
  //         this.setState({marketLastSell: data.bids[0][0]});
  //         this.setState({marketLastBuy: data.asks[0][0]});
  //     } else {
  //         this.setState({marketLastSell: 1});
  //         this.setState({marketLastBuy: 1});
  //     }
  // }

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
    let currentMarket = { name: "BTCAED", money: "AED", stock: "BTC" };
    if (
      this.state.currentUserFiatWallet.coin &&
      this.props.wallet.userWallet.coin
    ) {
      currentMarket = {
        name: `${this.props.wallet.userWallet.coin}${this.state.currentUserFiatWallet.coin}`,
        money: `${this.state.currentUserFiatWallet.coin}`,
        stock: `${this.props.wallet.userWallet.coin}`,
      };
    }

    if (this.state.ws) {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        await this.state.ws.close();
      } else {
        let currentPort = this.getWsport(currentMarket);
        let ws = new WebSocket(
          `wss://trillionbit.quantacloud.net/ws/${currentPort}/`
        );
        this.setState({ ws: ws });
      }
    } else {
      let currentPort = this.getWsport(currentMarket);
      let ws = new WebSocket(
        `wss://trillionbit.quantacloud.net/ws/${currentPort}/`
      );
      this.setState({ ws: ws });
    }

    // let ws = new WebSocket("wss://api.bitex.com:2096");

    if (this.state.ws) {
      this.state.ws.onopen = () => {
        if (currentMarket.name) {
          this.state.ws.send(
            JSON.stringify({
              currentMarket: currentMarket,
              currentCurrency: currentMarket.money,
            })
          );
        }
      };

      this.state.ws.onmessage = (evt) => {
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
        //     case 'bts:request_reconnect': {
        //         // this.wsConnect();
        //         break;
        //     }
        //     default:
        //         // this.wsConnect();
        // }
        if (message) {
          if (message.asks) {
            if (message.asks[0]) {
              this.setState({
                marketLastBuy: message.asks[0].price.replaceAll(",", ""),
              });
            } else {
              this.setState({
                marketLastBuy: 0,
              });
            }
          } else {
            // this.setState({wsConnection: false});
          }

          if (message.bids) {
            if (message.bids[0]) {
              this.setState({
                marketLastSell: message.bids[0].price.replaceAll(",", ""),
                wsConnection: true,
              });
            } else {
              this.setState({
                marketLastSell: 0,
              });
            }
          } else {
            // this.setState({wsConnection: false});
          }
        }
      };

      /**
       * In case of unexpected close event, try to reconnect.
       */
      this.state.onclose = function () {
        console.log("Websocket connection closed");
      };
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

  handleChange = async (event, newValue) => {
    this.setState({ ajaxProcess: true });
    this.setState({
      walletTab: newValue,
      noteNumber: [...Array(10)]
        .map((i) => (~~(Math.random() * 36)).toString(36))
        .join(""),
    });
    if (isEmpty(this.props.wallet.userWallet)) {
      if (this.props.wallet.userWallet._id) {
        await this.props.getUserWallet(this.props.wallet.userWallet._id);
        await this.props.getUserWalletAddresses(
          this.props.auth.user.id,
          this.props.wallet.userWallet.coin
        );
      }
    }
    this.setState({
      ajaxProcess: false,
      startDeposit: false,
      cardPaymentBox: false,
      bankTransferBox: false,
    });
  };

  handleWalletOrderTabChange = (event, newValue) => {
    this.setState({
      walletOrderTab: newValue,
      startDeposit: false,
      cardPaymentBox: false,
      bankTransferBox: false,
      marketAmount: "",
      marketSubtotal: 0.0,
      marketApprox: 0.0,
    });
  };

  handleInputChange = (name) => async (event) => {
    this.setState({ [name]: event.target.value });
    if (name === "depositAmount") {
      const { errors } = this.state;
      errors["depositAmount"] = "";
      this.setState({ errors });
    }

    if (name === "reciepientAmount") {
      this.setState({
        finalAmount: event.target.value,
      });
    }
    if (name === "referenceNumber") {
      const { errors } = this.state;
      errors["referenceNumber"] = "";
      this.setState({ errors });
    }
    if (name === "marketAmount") {
      let marketSubtotal = 0.0;
      let marketApprox = 0.0;
      if (event.target.value === "") {
        this.setState({
          marketSubtotal: marketSubtotal,
          marketApprox: marketApprox,
        });
      } else {
        if (this.state.walletOrderTab === "buy") {
          const inrAedBtx =
            this.state.currentUserFiatWallet.coin === "INR" ? 10.0 : 0.5;
          if (this.props.wallet.userWallet.coin === "BTX") {
            marketSubtotal =
              parseFloat(event.target.value) +
              0 * parseFloat(event.target.value);
            marketApprox = (
              parseFloat(event.target.value) / parseFloat(inrAedBtx)
            ).toFixed(8);
          } else {
            marketSubtotal =
              parseFloat(event.target.value) +
              this.state.takerFee * parseFloat(event.target.value);
            marketApprox = (
              parseFloat(event.target.value) /
              parseFloat(this.state.marketLastBuy)
            ).toFixed(8);
          }
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

    if (this.props.wallet.userWallet.coin === "XRP") {
      let checkXrpAddressStatus = !isEmpty(this.state.reciepientAddress)
        ? await checkXrpAddress(this.state.reciepientAddress)
        : await checkXrpAddress(event.target.value);

      if (checkXrpAddressStatus.tagStatus === false) {
        this.setState({
          dTagRequired: checkXrpAddressStatus.tagStatus,
          xReciepientAddress: checkXrpAddressStatus.address,
          destinationTag: checkXrpAddressStatus.destinationTag,
        });
      } else {
        this.setState({
          dTagRequired: checkXrpAddressStatus.tagStatus,
        });
      }
    }
  };

  createMarketOrder = async (value) => {
    if (isEmpty(this.state.marketAmount)) {
      this.setState({
        snackMessages: {
          variant: "error",
          message: "Enter value to place an order",
        },
      });
    } else {
      let userParams = {};
      const { user } = this.props.auth;
      if (value === "buy") {
        if (
          parseFloat(this.state.currentUserFiatWallet.walletAmount) <
          parseFloat(this.state.marketAmount) +
            parseFloat(this.state.marketAmount) *
              parseFloat(this.state.takerFee)
        ) {
          this.setState({
            snackMessages: {
              variant: "error",
              message: "Insuficent Balance",
            },
          });
        } else {
          userParams.userId = user.id;
          userParams.user_id = parseInt(user.id.replace(/\D/g, ""));
          userParams.market = `${this.props.wallet.userWallet.coin}${this.state.currentUserFiatWallet.coin}`;
          userParams.side = 2;
          userParams.amount = this.state.marketAmount;
          userParams.marketSubtotal = this.state.marketSubtotal;
          userParams.price = this.state.marketLastBuy;
          userParams.taker_fee_rate = this.state.takerFee;
          userParams.fiat = this.state.currentUserFiatWallet.coin;
          userParams.crypto = this.props.wallet.userWallet.coin;
          userParams.source = "";
          await this.props.placeMarketOrder(userParams);
          await this.props.getActiveAssets(this.props.auth.user.id);
          await this.props.getUserWallet(this.props.wallet.userWallet._id);
        }
      }

      if (value === "sell") {
        if (
          parseFloat(this.props.wallet.userWallet.walletAmount) <
          this.state.marketAmount
        ) {
          this.setState({
            snackMessages: {
              variant: "error",
              message: "Insuficent Balance",
            },
          });
        } else {
          userParams.userId = user.id;
          userParams.user_id = parseInt(user.id.replace(/\D/g, ""));
          userParams.market = `${this.props.wallet.userWallet.coin}${this.state.currentUserFiatWallet.coin}`;
          userParams.side = 1;
          userParams.amount = this.state.marketAmount;
          userParams.marketSubtotal = this.state.marketSubtotal;
          userParams.price = this.state.marketLastSell;
          userParams.taker_fee_rate = this.state.takerFee;
          userParams.fiat = this.state.currentUserFiatWallet.coin;
          userParams.crypto = this.props.wallet.userWallet.coin;
          userParams.source = "";
          await this.props.placeMarketOrder(userParams);
          await this.props.getActiveAssets(this.props.auth.user.id);
          await this.props.getUserWallet(this.props.wallet.userWallet._id);
        }
      }
    }
  };

  generateNewAddress = async (coin) => {
    this.setState({ ajaxProcess: true });
    const { auth } = this.props;
    await this.props.generateNewAddress(auth.user.id, coin);
    await this.props.getUserWalletAddresses(
      auth.user.id,
      this.props.wallet.userWallet.coin
    );
    await this.props.getUserWallet(this.props.wallet.userWallet._id);
    this.setState({ ajaxProcess: false });
  };

  handleWalletAssetsTabChange = async (newValue) => {
    if (this.state.ws) {
      if (this.state.ws.readyState === WebSocket.OPEN) {
        await this.state.ws.close();
      }
    }
    await this.setState({
      walletTab: "balance",
      ajaxWalletProcess: true,
      startDeposit: false,
      cardPaymentBox: false,
      bankTransferBox: false,
      wsConnection: false,
      marketApprox: 0,
      marketSubtotal: 0,
      marketLastSell: 0,
    });
    await this.props.getUserWallet(newValue);
    await this.props.getUserWalletAddresses(
      this.props.auth.user.id,
      this.props.wallet.userWallet.coin
    );
    await this.setState({
      walletAssetsTab: newValue,
      ajaxWalletProcess: false,
      marketApprox: 0,
      marketAmount: 0,
      marketSubtotal: 0,
      marketLastSell: 0,
      wsConnection: false,
    });
    this.wsConnect();
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  openDepositBox = () => {
    this.setState({ startDeposit: true });
  };

  createDepositRequest = async () => {
    const { depositAmount, userDepositeRequestId, referenceNumber } =
      this.state;
    if (referenceNumber) {
      const { userWallet } = this.props.wallet;
      const depositParams = {
        userId: this.props.auth.user.id,
        type: "Bank Transfer",
        amount: depositAmount,
        coin: userWallet.coin,
        fees: 0,
        referenceNumber: referenceNumber,
        noteNumber: [...Array(10)]
          .map((i) => (~~(Math.random() * 36)).toString(36))
          .join(""),
      };
      this.props.createDepositRequest(depositParams).then(async (res) => {
        if (res) {
          // if(res.data.userDepositeRequestId) {
          //     this.setState({userDepositeRequestId: res.data.userDepositeRequestId});
          // }
          if (res.data) {
            this.setState({
              userDepositeRequestId: "",
              depositAmount: "",
              paymentStep: 1,
            });
          }
        }
      });
      await this.props.getWithdrawalRequests(this.props.auth.user.id);
    } else {
      const { errors } = this.state;
      errors["referenceNumber"] = "Reference number field is required.";
      this.setState({ errors });
    }
  };

  updateDepositRequest = async () => {
    const { referenceNumber, userDepositeRequestId, depositAmount } =
      this.state;
    if (referenceNumber && userDepositeRequestId) {
      const depositParams = {
        userId: this.props.auth.user.id,
        fees: 0,
        amount: depositAmount,
        referenceNumber: referenceNumber,
        userDepositeRequestId: userDepositeRequestId,
      };
      await this.props.updateDepositRequest(depositParams);
      await this.props.getWithdrawalRequests(this.props.auth.user.id);
      this.setState({
        userDepositeRequestId: "",
        depositAmount: "",
        paymentStep: 1,
      });
    } else {
      const { errors } = this.state;
      errors["referenceNumber"] = "Reference number field is required.";
      this.setState({ errors });
    }
  };

  onUpdateDepositeSubmit = async () => {
    const { referenceNumber, userDepositeRequestId } = this.state;
    if (referenceNumber && userDepositeRequestId) {
      const depositParams = {
        referenceNumber: referenceNumber,
        userDepositeRequestId: userDepositeRequestId,
      };
      await this.props.editDepositRequest(depositParams);
      await this.props.getWithdrawalRequests(this.props.auth.user.id);
      this.setState({
        referenceNumber: "",
        userDepositeRequestId: "",
        editDepositRequestModal: false,
      });
    } else {
      const { errors } = this.state;
      errors["referenceNumber"] = "Reference number field is required.";
      this.setState({ errors });
    }
  };

  createWithdrawRequest = async () => {
    const { withdrawAmount } = this.state;
    const { userWallet } = this.props.wallet;

    const depositParams = {
      userId: this.props.auth.user.id,
      userWalletId: userWallet._id,
      type: "Bank Transfer",
      amount: withdrawAmount,
      coin: userWallet.coin,
      fees: 0,
      noteNumber: [...Array(10)]
        .map((i) => (~~(Math.random() * 36)).toString(36))
        .join(""),
    };

    await this.props.createWithdrawRequest(depositParams);
    await this.props.getWithdrawalRequests(this.props.auth.user.id);
    await this.props.getUserWallet(this.props.wallet.userWallet._id);
    this.setState({ withdrawAmount: "", errors: {} });
  };

  withdrawCrypto = async () => {
    this.setState({ ajaxProcess: true });
    const sendUserParams = {
      userId: this.props.wallet.userWallet.userId,
      coin: this.props.wallet.userWallet.coin,
      reciepientAmount: this.state.reciepientAmount,
      reciepientAddress: this.state.dTagRequired
        ? this.state.reciepientAddress
        : this.state.xReciepientAddress,
      reciepientNote: this.state.reciepientNote,
      destinationTag: this.state.destinationTag,
    };

    await this.props.sendCrypto(sendUserParams);
    this.setState({
      ajaxProcess: false,
      reciepientAmount: "",
      reciepientAddress: "",
      reciepientNote: "",
    });
    this.props.getUserWallet(this.state.walletAssetsTab);
  };

  cancelWithdraw = async (transactionId) => {
    await this.props.cancelWithdraw(transactionId);
    await this.props.getWithdrawalRequests(this.props.auth.user.id);
    await this.props.getUserWallet(this.props.wallet.userWallet._id);
  };

  cancelDeposit = async (transactionId) => {
    await this.props.cancelDeposit(transactionId);
    await this.props.getWithdrawalRequests(this.props.auth.user.id);
  };

  toggleDestinationTag = () => {
    this.setState({ showDestinationTag: !this.state.showDestinationTag });
  };

  startValidation = () => {
    this.props.history.push("/user-profile");
  };

  buyBtxCoin = async () => {
    let successFlag = true;
    let message = "";
    if (isEmpty(this.state.marketAmount)) {
      successFlag = false;
      message = "Enter value to place an order";
    }
    if (
      parseFloat(this.state.currentUserFiatWallet.walletAmount) <
      parseFloat(this.state.marketAmount)
    ) {
      successFlag = false;
      message = "Insuficent Balance";
    }
    if (successFlag) {
      const coin =
        this.state.currentUserFiatWallet.coin === "INR" ? "INR" : "AED";
      const btxBuyDetail = {
        coin: coin,
        market: `BTX${coin}`,
        price: parseFloat(this.state.marketSubtotal).toFixed(8).toString(),
        amount: parseFloat(this.state.marketApprox).toFixed(8).toString(),
      };
      const data = { userId: this.props.auth.user.id, btxBuyDetail };
      const response = await this.props.buyBtxCoin(data);
      this.setState({ snackMessages: response });
      await this.props.getActiveAssets(this.props.auth.user.id);
      await this.props.getUserWallet(this.props.wallet.userWallet._id);
    } else {
      this.setState({
        snackMessages: { variant: "error", message: message },
      });
    }
  };

  depositAmountSubmit = () => {
    if (this.state.depositAmount) {
      if (this.props.wallet.userWallet.coin === "INR") {
        // if (parseFloat(this.state.depositAmount) > 999) {
        this.setState({
          paymentStep: 1,
        });
        // } else {
        //     this.setState({ errors: {depositAmount: 'Minimum amount to deposit is 1000 INR'} });
        // }
      } else {
        if (parseFloat(this.state.depositAmount) >= 200) {
          this.setState({
            paymentStep: 1,
          });
        } else {
          this.setState({
            errors: {
              depositAmount: "Minimum amount to deposit is 200 AED",
            },
          });
        }
      }
    } else {
      this.setState({
        errors: { depositAmount: "Enter amount to deposit." },
      });
    }
  };

  paymentMethodRender = () => {
    const { inrAccountDetail, aedAccountDetail } =
      this.props.wallet.bankDetails;
    switch (this.state.paymentOption) {
      case "CC":
      case "DC":
        return (
          <div className="BankTransferBox">
            <div className="title">
              <Typography variant="h2">Payment Details</Typography>

              <Typography variant="h5">
                please enter your card Deatils
              </Typography>
            </div>

            <form noValidate onSubmit={this.onPaymentSubmit}>
              <div>
                <FormControl className="form-control">
                  <TextField
                    label="Name on card"
                    margin="dense"
                    variant="filled"
                    name="nameOnCard"
                    type="text"
                    value={this.state.paymentDetails.nameOnCard}
                    onChange={this.handlePaymentInput.bind(this)("nameOnCard")}
                    // error={(this.validator.check(this.state.paymentDetails.nameOnCard,'required') && this.state.paymentFormSubmit) ? true : false  }
                    // helperText={ this.validator.message('nameOnCard',
                    // this.state.paymentDetails.nameOnCard, 'required')}
                  />
                  <FormHelperText id="filled-weight-helper-text">
                    {this.validator.message(
                      "nameOnCard",
                      this.state.paymentDetails.nameOnCard,
                      "required"
                    )}
                  </FormHelperText>
                  {this.state.errors.nameOnCard && (
                    <FormHelperText id="filled-weight-helper-text">
                      <Typography variant="body1" color="error">
                        {" "}
                        {this.state.errors.nameOnCard}
                      </Typography>
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl className="form-control">
                  <InputMask
                    mask="9999 9999 9999 9999"
                    value={this.state.paymentDetails.cardNumber}
                    // name="cardNumber"
                    onChange={this.handlePaymentInput.bind(this)("cardNumber")}
                  >
                    {() => (
                      <TextField
                        label="Card Number"
                        margin="dense"
                        name="cardNumber"
                        variant="filled"
                        value={this.state.paymentDetails.cardNumber}
                        // onChange={this.handlePaymentInput.bind(this)('cardNumber')}

                        InputProps={{
                          endAdornment: this.state.cardTypeIcon,
                        }}
                        // error={(this.validator.fieldValid('cardNumber')) ? true : false  }
                        // helperText={ this.validator.message('cardNumber',
                        // this.state.paymentDetails.cardNumber, 'required|card_num')}
                      />
                    )}
                  </InputMask>
                  <FormHelperText id="filled-weight-helper-text">
                    {this.validator.message(
                      "cardNumber",
                      this.state.paymentDetails.cardNumber,
                      "required|card_num"
                    )}
                  </FormHelperText>
                </FormControl>

                {/* <FormControl  className="form-control">
                        <Select
                            label="Card type"
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            variant="filled"
                            className="form-control"
                            name='cardType'
                            value={this.state.paymentDetails.cardType}
                            onChange={this.handlePaymentInput.bind(this)('cardType')}
                            // error={! this.validator.fieldValid('cardType') ? true : false  }
                            // helperText={ this.validator.message('cardType', 
                            // this.state.paymentDetails.cardType, 'required')}                                 

                        >
                            {this.paymentCardTypeOptionRender()}
                        </Select>
                        <FormHelperText id="filled-weight-helper-text">{this.validator.message('cardType', 
                                this.state.paymentDetails.cardType, 'required')}
                        </FormHelperText>
                    </FormControl> */}

                <div className="inlineBox">
                  <FormControl className="form-control">
                    <TextField
                      label="MM/YYYY"
                      margin="dense"
                      variant="filled"
                      name="cardExpDt"
                      value={this.state.paymentDetails.cardExpDt}
                      onChange={this.handlePaymentInput.bind(this)("cardExpDt")}
                      // error={(this.validator.fieldValid('cardExpDt')) ? true : false  }
                      // helperText={ this.validator.message('cardExpDt',
                      // this.state.paymentDetails.cardExpDt, 'required|card_exp')}
                    />
                    <FormHelperText id="filled-weight-helper-text">
                      {this.validator.message(
                        "cardExpDt",
                        this.state.paymentDetails.cardExpDt,
                        "required|card_exp"
                      )}
                    </FormHelperText>
                  </FormControl>

                  <FormControl className="form-control">
                    <TextField
                      label="CVV"
                      margin="dense"
                      variant="filled"
                      name="cvv"
                      type="password"
                      value={this.state.paymentDetails.cvv}
                      onChange={this.handlePaymentInput.bind(this)("cvv")}
                      // error={(this.validator.fieldValid('cvv')) ? true : false  }
                      // helperText={ this.validator.message('cvv',
                      // this.state.paymentDetails.cvv, 'required|max:3|min:3|numeric')}
                    />

                    <FormHelperText id="filled-weight-helper-text">
                      {this.validator.message(
                        "cvv",
                        this.state.paymentDetails.cvv,
                        "required|max:3|min:3|numeric"
                      )}
                    </FormHelperText>
                  </FormControl>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className=""
                >
                  Pay{"  "}₹
                  {parseFloat(this.state.depositAmount) +
                    parseFloat(this.state.feesAmount)}
                </Button>
              </div>
            </form>
          </div>
        );
      case "NB":
        return (
          <div className="BankTransferBox">
            <div className="title">
              <Typography variant="h2">Netbanking</Typography>

              <Typography variant="h5">please choose your bank</Typography>
            </div>
            <form noValidate onSubmit={this.onPaymentSubmit}>
              <div>
                <FormControl className="form-control">
                  <Select
                    label="Net-Banking"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    variant="filled"
                    className="form-control"
                    name="bankType"
                    value={this.state.paymentDetails.bankType}
                    onChange={this.handlePaymentInput.bind(this)("bankType")}
                    // error={! this.validator.fieldValid('cardType') ? true : false  }
                    // helperText={ this.validator.message('cardType',
                    // this.state.paymentDetails.cardType, 'required')}
                  >
                    <MenuItem value="">Select Bank</MenuItem>
                    {this.paymentNetBankingOptionRender()}
                  </Select>
                  <FormHelperText id="filled-weight-helper-text">
                    {this.validator.message(
                      "bankType",
                      this.state.paymentDetails.bankType,
                      "required"
                    )}
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className=""
                >
                  Pay{"  "}₹
                  {parseFloat(this.state.depositAmount) +
                    parseFloat(this.state.feesAmount)}
                </Button>
              </div>
            </form>
          </div>
        );

      case "WL":
        return (
          <div className="BankTransferBox">
            <div className="title">
              <Typography variant="h2">Wallet Details</Typography>

              <Typography variant="h5">please choose your Wallet</Typography>
            </div>

            <form noValidate onSubmit={this.onPaymentSubmit}>
              <div>
                <FormControl className="form-control">
                  <Select
                    label="Wallet"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    variant="filled"
                    name="walletType"
                    value={
                      this.state.paymentDetails.walletType
                        ? this.state.paymentDetails.walletType
                        : ""
                    }
                    onChange={this.handlePaymentInput.bind(this)("walletType")}
                    // error={! this.validator.fieldValid('cardType') ? true : false  }
                    // helperText={ this.validator.message('cardType',
                    // this.state.paymentDetails.cardType, 'required')}
                  >
                    <MenuItem value="">Select Wallet</MenuItem>
                    {this.paymentWalletOptionRender()}
                  </Select>
                  <FormHelperText id="filled-weight-helper-text">
                    {this.validator.message(
                      "walletType",
                      this.state.paymentDetails.walletType,
                      "required"
                    )}
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className=""
                >
                  Pay{"  "}₹
                  {parseFloat(this.state.depositAmount) +
                    parseFloat(this.state.feesAmount)}
                </Button>
              </div>
            </form>
          </div>
        );

      case "UP":
        return (
          <div className="BankTransferBox">
            <div className="title">
              <Typography variant="h2">UPI Details</Typography>
            </div>

            <form noValidate onSubmit={this.onPaymentSubmit}>
              <div>
                <FormControl className="form-control">
                  <TextField
                    label="VPA"
                    margin="dense"
                    variant="filled"
                    name="upi"
                    type="text"
                    value={this.state.paymentDetails.upi}
                    onChange={this.handlePaymentInput.bind(this)("upi")}
                    // error={(this.validator.check(this.state.paymentDetails.nameOnCard,'required') && this.state.paymentFormSubmit) ? true : false  }
                    // helperText={ this.validator.message('nameOnCard',
                    // this.state.paymentDetails.nameOnCard, 'required')}
                    className="form-control"
                  />
                  <FormHelperText id="filled-weight-helper-text">
                    <Typography variant="body1" color="error">
                      {" "}
                      {this.state.errors?.upi}
                    </Typography>
                  </FormHelperText>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className=""
                >
                  Pay{"  "}₹
                  {parseFloat(this.state.depositAmount) +
                    parseFloat(this.state.feesAmount)}
                </Button>
              </div>
            </form>
          </div>
        );

      case "BankTransfer":
        return (
          <div className="BankTransferBox">
            {this.props.wallet.userWallet.coin === "INR" ? (
              <div className="title">
                <Typography variant="h2">
                  IMPS / NEFT / RTGS (Instant)
                </Typography>

                <Typography variant="h5">
                  Super fast deposit with no maximum limit.
                </Typography>
              </div>
            ) : (
              <div className="title">
                <Typography variant="h5">Bank Transfer</Typography>
              </div>
            )}
            <List className="">
              <ListItem>
                <Typography variant="h5">Bank Name:</Typography>

                <Typography variant="h6">
                  {this.props.wallet.userWallet.coin === "INR"
                    ? inrAccountDetail.bankName
                    : aedAccountDetail.bankName}
                </Typography>

                <CopyToClipboard
                  text={
                    this.props.wallet.userWallet.coin === "INR"
                      ? inrAccountDetail.bankName
                      : aedAccountDetail.bankName
                  }
                  onCopy={() => this.onCopy()}
                >
                  <FilterNoneIcon />
                </CopyToClipboard>
              </ListItem>

              {/* <ListItem>
                                <Typography variant="h5">
                                   Account Name:
                                </Typography>

                                <Typography variant="h6">
                                    {this.props.wallet.userWallet.coin === 'INR' ? inrAccountDetail.accountName: aedAccountDetail.accountName}
                                </Typography>

                                <CopyToClipboard text={ this.props.wallet.userWallet.coin === 'INR' ? inrAccountDetail.accountName: aedAccountDetail.accountName}
                                     onCopy={() => this.onCopy()}>
                                    <FilterNoneIcon />
                                </CopyToClipboard>
                            </ListItem> */}

              <ListItem>
                <Typography variant="h5">Account Number:</Typography>

                <Typography variant="h6">
                  {this.props.wallet.userWallet.coin === "INR"
                    ? inrAccountDetail.accountNumber
                    : aedAccountDetail.accountNumber}
                </Typography>

                <CopyToClipboard
                  text={
                    this.props.wallet.userWallet.coin === "INR"
                      ? inrAccountDetail.accountNumber
                      : aedAccountDetail.accountNumber
                  }
                  onCopy={() => this.onCopy()}
                >
                  <FilterNoneIcon />
                </CopyToClipboard>
              </ListItem>

              <ListItem>
                <Typography variant="h5">
                  {this.props.wallet.userWallet.coin === "INR"
                    ? "IFSC Code: "
                    : "IBAN: "}
                </Typography>

                <Typography variant="h6">
                  {this.props.wallet.userWallet.coin === "INR"
                    ? inrAccountDetail.ifscCode
                    : aedAccountDetail.IBAN}
                </Typography>

                <CopyToClipboard
                  text={
                    this.props.wallet.userWallet.coin === "INR"
                      ? inrAccountDetail.ifscCode
                      : aedAccountDetail.IBAN
                  }
                  onCopy={() => this.onCopy()}
                >
                  <FilterNoneIcon />
                </CopyToClipboard>
              </ListItem>

              {this.props.wallet.userWallet.coin === "INR" && (
                <ListItem>
                  <Typography variant="h5">Account Type:</Typography>

                  <Typography variant="h6">
                    {inrAccountDetail.accountType}
                  </Typography>

                  <CopyToClipboard
                    text={inrAccountDetail.accountType}
                    onCopy={() => this.onCopy()}
                  >
                    <FilterNoneIcon />
                  </CopyToClipboard>
                </ListItem>
              )}

              {this.props.wallet.userWallet.coin !== "INR" && (
                <ListItem>
                  <Typography variant="h5">SWIFT Code:</Typography>

                  <Typography variant="h6">
                    {aedAccountDetail.swiftCode}
                  </Typography>

                  <CopyToClipboard
                    text={aedAccountDetail.swiftCode}
                    onCopy={() => this.onCopy()}
                  >
                    <FilterNoneIcon />
                  </CopyToClipboard>
                </ListItem>
              )}

              <ListItem>
                <Typography variant="h5">Note Number:</Typography>

                <Typography variant="h6">
                  <strong>{this.state.noteNumber}</strong>
                </Typography>

                <CopyToClipboard
                  text={this.state.noteNumber}
                  onCopy={() => this.onCopy()}
                >
                  <FilterNoneIcon />
                </CopyToClipboard>
              </ListItem>
            </List>

            <form noValidate>
              <div className="verifyBox">
                <Typography variant="h2">Verify the payment</Typography>

                <FormControl className="form-control">
                  <TextField
                    label="Reference ID"
                    margin="dense"
                    variant="filled"
                    onChange={this.handleInputChange("referenceNumber")}
                    name="referenceNumber"
                    className="form-control"
                  />
                  <FormHelperText id="filled-weight-helper-text">
                    <Typography variant="body1" color="error">
                      {" "}
                      {this.state.errors?.referenceNumber}
                    </Typography>
                  </FormHelperText>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  onClick={() => {
                    this.createDepositRequest();
                  }}
                  className={this.props.classes.button}
                >
                  Verify
                </Button>
              </div>
            </form>

            {this.props.wallet.userWallet.coin === "INR" ? (
              <Typography variant="h6" className="note">
                <strong> Note: </strong> Reference ID is the UPI/IMPS
                transaction number which is sent to your register mobile number.
              </Typography>
            ) : (
              <Typography variant="h6" className="note">
                <strong> Note: </strong> Reference ID is the transaction number
                which is sent to your register mobile number.
              </Typography>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  onCopy = () => {
    this.setState({
      copy: true,
      snackMessages: {
        variant: "success",
        message: "Copied to clipboard.",
      },
    });
  };

  handlePaymentInput = (name) => (event) => {
    const { errors } = this.state;
    const paymentDetails = this.state.paymentDetails;

    if (name === "upi") {
      errors["upi"] = "";
      this.setState({ errors });
    }
    if (name === "nameOnCard") {
      errors["nameOnCard"] = "";
      this.setState({ errors });
    }
    let cardNameType = "";
    if (name === "cardNumber") {
      let cardType = DashhPayCode.validatedCardType(event.target.value);
      cardType = DashhPayCode.cardOptionForMopType.find(
        (type) => type.paymentOption === cardType
      );
      cardType = cardType?.code ? cardType?.code : "OT";
      paymentDetails["cardType"] = cardType;
      switch (cardType) {
        case "VI":
          cardNameType = visaCardIcon;
          break;
        case "AX":
          cardNameType = amexCardIcon;
          break;
        case "DI":
          cardNameType = dinnerCardIcon;
          break;
        case "JC":
          cardNameType = jcbCardIcon;
          break;
        case "MC":
          cardNameType = masterCardIcon;
          break;
        case "MS":
          cardNameType = masterCardIcon;
          break;
        case "DN":
          cardNameType = dinnerCardIcon;
          break;
        case "RU":
          cardNameType = rupayCardIcon;
          break;
        default:
      }
    }
    paymentDetails[name] = event.target.value;
    cardNameType = cardNameType ? (
      <img className="cards" src={cardNameType} alt={"card type"} />
    ) : (
      ""
    );
    this.setState({ paymentDetails, cardTypeIcon: cardNameType });
  };

  onPaymentSubmit = (e) => {
    e.preventDefault();
    let { errors } = this.state;
    errors["upi"] = "";
    errors["nameOnCard"] = "";
    if (this.state.paymentDetails.paymentOption === "UP") {
      const result = /^\w+@\w+$/.test(this.state.paymentDetails.upi);
      if (!result) errors["upi"] = "please enter valid VPA.";
    }
    if (
      this.state.paymentDetails.paymentOption === "DC" ||
      this.state.paymentDetails.paymentOption === "CC"
    ) {
      if (this.state.paymentDetails.nameOnCard) {
        const name = this.state.paymentDetails.nameOnCard.trim().toLowerCase();
        const authName =
          this.props.auth.user.firstname.trim().toLowerCase() +
          " " +
          this.props.auth.user.lastname.trim().toLowerCase();
        // const firstname = name[0] ? name[0].toLowerCase() : '';
        // const lastname = name[1] ? name[1].toLowerCase() : '';
        if (!(name === authName)) {
          errors["nameOnCard"] = "please enter valid Card Name.";
        }
      }
    }
    this.setState({ errors });
    if (this.validator.allValid() && !errors.upi && errors.nameOnCard === "") {
      let paymentDetails = this.state.paymentDetails;
      let paymentType = "";
      switch (paymentDetails.paymentOption) {
        case "CC":
        case "DC":
          paymentDetails["mopType"] = paymentDetails.cardType;
          paymentDetails["cardExpDt"] = paymentDetails.cardExpDt
            .replace("/", "")
            .trim();
          paymentDetails["cardNumber"] = paymentDetails.cardNumber
            .replace(/\s/g, "")
            .trim();
          paymentType = "Credit/Debit Card";
          break;

        case "UP":
          paymentDetails["mopType"] = "504";
          paymentType = "UPI";

          break;

        case "NB":
          paymentDetails["mopType"] = paymentDetails.bankType;
          if (DashhPayCode.netBankingOptionForMopType) {
            let bankname = DashhPayCode.netBankingOptionForMopType.find(
              (optionType) => optionType.code === paymentDetails.bankType
            );
            if (bankname?.paymentOption) {
              paymentType = "Net banking - " + bankname?.paymentOption;
            }
          }
          break;

        case "WL":
          paymentDetails["mopType"] = paymentDetails.walletType;
          if (DashhPayCode.walletOptionForMopType) {
            let walletName = DashhPayCode.walletOptionForMopType.find(
              (optionType) => optionType.code === paymentDetails.walletType
            );
            if (walletName?.paymentOption) {
              paymentType = "Wallet - " + walletName?.paymentOption;
            }
          }
          break;

        default:
      }
      const data = {
        user: this.props.auth.user,
        amount: this.state.depositAmount,
        coin: this.props.wallet.userWallet.coin,
        paymentOption: paymentDetails.paymentOption,
        paymentDetails: paymentDetails,
        paymentType: paymentType,
        fees: this.state.feesAmount,
      };
      this.dasshpePaymentRequest(data);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  paymentCardTypeOptionRender = () => {
    if (DashhPayCode.cardOptionForMopType) {
      return DashhPayCode.cardOptionForMopType.map((optionType) => (
        <MenuItem key={optionType.code} value={optionType.code}>
          {optionType.paymentOption}
        </MenuItem>
      ));
    }
  };

  paymentNetBankingOptionRender = () => {
    if (DashhPayCode.netBankingOptionForMopType) {
      return DashhPayCode.netBankingOptionForMopType.map((optionType) => (
        <MenuItem key={optionType.code} value={optionType.code}>
          {optionType.paymentOption}
        </MenuItem>
      ));
    }
  };

  paymentWalletOptionRender = () => {
    if (DashhPayCode.walletOptionForMopType) {
      return DashhPayCode.walletOptionForMopType.map((optionType) => (
        <MenuItem key={optionType.code} value={optionType.code}>
          {optionType.paymentOption}
        </MenuItem>
      ));
    }
  };

  couldWalletDepositMaintenanceMode = (coin) => {
    return this.props.maintenance.wallet?.[coin]
      ? this.props.maintenance.wallet[coin].deposit
        ? this.props.maintenance.wallet[coin].deposit
        : false
      : false;
  };

  couldWalletWithdrawalMaintenanceMode = (coin) => {
    return this.props.maintenance.wallet?.[coin]
      ? this.props.maintenance.wallet[coin].withdrawal
        ? this.props.maintenance.wallet[coin].withdrawal
        : false
      : false;
  };

  render() {
    const {
      walletTab,
      reciepientAddress,
      reciepientAmount,
      finalAmount,
      errors,
      reciepientNote,
      snackMessages,
      snackbarMessage,
      variant,
      ajaxProcess,
      depositAmount,
      withdrawAmount,
      destinationTag,
      walletOrderTab,
      currentUserFiatWallet,
      marketAmount,
      paymentStep,
    } = this.state;
    const { userWallet, walletDetails } = this.props.wallet;
    const { classes, wallet, user } = this.props;

    let tabProcessContent = (
      <Grid container>
        <Grid item xs={12} md={3} />
        <Grid item xs={12} md={6}>
          <Card className="dataListCard">
            <CardContent className="walletGrid">
              <div className=" walletBalance">
                <Skeleton variant="circle" width={80} height={80} />

                <div className="text">
                  <Typography variant="body1">
                    <Skeleton variant="text" />
                  </Typography>

                  <Typography variant="h4">
                    <Skeleton variant="text" />
                  </Typography>

                  <Typography variant="h6">Wallet Balance</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );

    let tabContent;

    if (walletTab === "balance") {
      tabContent = (
        <div className="bodyInformation">
          <Grid container>
            {userWallet?.fiat ? <Grid item xs={12} md={1} /> : ""}
            <Grid item xs={12} md={userWallet?.fiat ? 10 : 6}>
              <Card className="dataListCard">
                <CardContent className="walletGrid">
                  <div
                    className={
                      userWallet?.fiat
                        ? " walletBalance twoBox"
                        : " walletBalance"
                    }
                  >
                    <img
                      src={currencyIcon(userWallet.coin)}
                      alt="icon"
                      width="80"
                    />

                    <div className="text">
                      <Typography variant="body1">
                        {userWallet.coin} Wallet
                      </Typography>

                      <Typography variant="h4">
                        {userWallet?.fiat
                          ? parseFloat(
                              parseFloat(userWallet.walletAmount) -
                                parseFloat(userWallet.bonusWalletAmount)
                            ).toFixed(2)
                          : parseFloat(userWallet.walletAmount).toFixed(8)}{" "}
                        {userWallet.coin}
                      </Typography>

                      <Typography variant="h6">Wallet Balance</Typography>
                    </div>

                    <div className="text">
                      {this.getBitexSavingWalletBalance(userWallet.coin) && (
                        <>
                          <Typography variant="body1">Lend Wallet</Typography>

                          <Typography variant="h4">
                            {parseFloat(
                              this.getBitexSavingWalletBalance(userWallet.coin)
                            ).toFixed(6)}{" "}
                            {userWallet.coin}
                          </Typography>

                          <Typography variant="h6">
                            Lend Wallet Balance
                          </Typography>
                        </>
                      )}
                      {(userWallet.coin === "INR" ||
                        userWallet.coin === "AED") && (
                        <>
                          <Typography variant="body1">Bonus Wallet</Typography>

                          <Typography variant="h4">
                            {userWallet?.fiat
                              ? parseFloat(
                                  userWallet.bonusWalletAmount
                                ).toFixed(2)
                              : parseFloat(
                                  userWallet.bonusWalletAmount
                                ).toFixed(8)}{" "}
                            {userWallet.coin}
                          </Typography>

                          <Typography variant="h6">
                            Bonus Wallet Balance
                          </Typography>
                        </>
                      )}
                    </div>
                  </div>
                  {userWallet?.active ? (
                    <div>
                      <Typography variant="body2">
                        Deposit Fee: {walletDetails.depositFee}{" "}
                        {userWallet.coin}
                      </Typography>
                      <Typography variant="body2">
                        Withdrawal Fee:{" "}
                        {userWallet.coin === "USDT"
                          ? "TRC20: 1 USDT, ERC20: 10"
                          : walletDetails.withdrawalFee}{" "}
                        {userWallet.coin}
                      </Typography>
                      <br />
                    </div>
                  ) : undefined}
                  {!userWallet?.active ? (
                    <div color="textSecondary">
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                      >
                        <Grid item>
                          <WarningRoundedIcon
                            style={{
                              color: "#ff8400",
                              fontSize: 70,
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">
                            This currency is not available in your region
                            currently.
                          </Typography>
                          <Typography variant="body2">
                            Deposit and Withdrawal for this currency has been
                            disabled for your account.
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>
                  ) : undefined}

                  {userWallet?.fiat ? (
                    userWallet?.active ? (
                      <div>
                        <Typography variant="body2">
                          Deposit Time: Up to 2 hours
                        </Typography>
                        <Typography variant="body2">
                          Withdrawal Time: 2 to 24 hours
                        </Typography>
                      </div>
                    ) : undefined
                  ) : (
                    <Typography variant="body2">
                      Note: Please use the above provided address to deposit
                      crypto to your account. Any other address shall be
                      considered invalid and crypto will not be deposited in
                      your account.
                    </Typography>
                  )}
                  {userWallet?.fiat ? (
                    <Grid item>
                      <Typography variant="body2">
                        {walletDetails.description}
                      </Typography>
                    </Grid>
                  ) : undefined}
                </CardContent>
              </Card>
            </Grid>
            {userWallet?.fiat || userWallet.coin === "BTX" ? (
              ""
            ) : !this.state.ajaxwalletLoading ? (
              <Grid item xs={12} md={userWallet?.fiat ? 10 : 6}>
                {userWallet.coin === "BTX" ? (
                  <Card className="dataListCard tabBox btxCard">
                    <a href="/btxCoin">
                      <img src={buybtxCoin} alt="bitcoin and crypto exchange" />
                    </a>
                    <CardHeader />
                  </Card>
                ) : (
                  <Card className="dataListCard tabBox">
                    <CardHeader
                      title={
                        <Tabs
                          scrollButtons="auto"
                          variant="scrollable"
                          value={walletOrderTab}
                          onChange={this.handleWalletOrderTabChange}
                          textColor="primary"
                          indicatorColor="primary"
                        >
                          <Tab
                            value="buy"
                            label="Buy"
                            className={classes.tabRoot}
                          />
                          {userWallet.coin === "BTX" ? null : (
                            <Tab
                              value="sell"
                              label="Sell"
                              className={classes.tabRoot}
                            />
                          )}
                        </Tabs>
                      }
                    />
                    <CardContent className="walletGrid">
                      <div className="title">
                        <Typography variant="h5" className="">
                          Instant Order
                        </Typography>
                      </div>

                      {walletOrderTab === "buy" ? (
                        <div>
                          <div className="WithdrawBox">
                            <Typography variant="body1" className="">
                              {`Available: ${currentUserFiatWallet.walletAmount} ${currentUserFiatWallet.coin}`}
                            </Typography>

                            <TextField
                              error={errors.marketAmount ? true : false}
                              margin="dense"
                              variant="filled"
                              id="marketAmount"
                              label={`Amount in ${currentUserFiatWallet.coin}`}
                              value={marketAmount}
                              placeholder={
                                "Enter amount in " + currentUserFiatWallet.coin
                              }
                              onChange={this.handleInputChange("marketAmount")}
                              type="number"
                              fullWidth={true}
                              disabled={!this.state.wsConnection}
                              helperText={errors.marketAmount}
                              className="form-control"
                            />
                          </div>
                          <div className="inline total">
                            <Typography component="h5">
                              Fee:{" "}
                              {userWallet.coin === "BTX"
                                ? "0.00"
                                : this.state.takerFee * 100}{" "}
                              %
                            </Typography>
                            <Typography component="h5">
                              Approx: {this.state.marketApprox}{" "}
                              {`${userWallet.coin}`}
                            </Typography>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="WithdrawBox">
                            <Typography variant="body1" className="">
                              {`Available: ${userWallet.walletAmount} ${userWallet.coin}`}
                            </Typography>

                            <TextField
                              error={errors.marketAmount ? true : false}
                              margin="dense"
                              variant="filled"
                              id="marketAmount"
                              label={`Amount in ${userWallet.coin}`}
                              value={marketAmount}
                              placeholder={"Enter amount in " + userWallet.coin}
                              onChange={this.handleInputChange("marketAmount")}
                              type="number"
                              disabled={!this.state.wsConnection}
                              fullWidth={true}
                              helperText={errors.marketAmount}
                              className="form-control"
                            />
                          </div>
                          <div className="inline total">
                            <Typography component="h5">
                              Fee: {this.state.takerFee * 100} %
                            </Typography>
                            <Typography component="h5">
                              Subtotal: {this.state.marketSubtotal}{" "}
                              {currentUserFiatWallet.coin}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardActions className="walletOrderBtn">
                      <div className="btn">
                        {walletOrderTab === "buy" ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              userWallet.coin === "BTX"
                                ? this.buyBtxCoin()
                                : this.createMarketOrder("buy")
                            }
                            className={classes.button}
                            disabled={!this.state.wsConnection}
                          >
                            Buy
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.createMarketOrder("sell")}
                            className={classes.button}
                            disabled={
                              userWallet.coin === "BTX"
                                ? true
                                : !this.state.wsConnection
                            }
                          >
                            Sell
                          </Button>
                        )}
                      </div>
                    </CardActions>
                  </Card>
                )}
              </Grid>
            ) : undefined}
          </Grid>
        </div>
      );
    }

    if (walletTab === "deposite") {
      if (userWallet?.fiat) {
        if (!user.userIdentity.submitted || !user.userIdentity.approve) {
          tabContent = (
            <div className="bodyInformation">
              <Grid container spacing={2}>
                <Grid item md={3} />
                <Grid item xs={12} md={6}>
                  <Card className="dataListCard">
                    <CardHeader title="Identity Documents" />
                    <CardContent className="identityBoxInfo">
                      {this.props.user.userIdentity.approve ? (
                        <Typography variant="h3" className="title">
                          Congratulations! You are successfully verified.
                        </Typography>
                      ) : (
                        <Typography variant="h3" className="title">
                          Continue setting up your account.
                        </Typography>
                      )}

                      {this.props.user.userIdentity.approve ? (
                        <Typography variant="h5" className="subTitle">
                          You are ready to trade now!
                        </Typography>
                      ) : (
                        <Typography variant="h5" className="subTitle">
                          You are almost ready to trade!
                        </Typography>
                      )}

                      {this.props.user.userIdentity.approve ? (
                        <IconButton aria-label="settings">
                          <VerifiedUserIcon
                            style={{
                              fontSize: 50,
                              color: "#1D8341",
                            }}
                          />
                        </IconButton>
                      ) : (
                        <IconButton aria-label="settings">
                          <VerifiedUserIcon style={{ fontSize: 50 }} />
                        </IconButton>
                      )}

                      {this.props.user.userIdentity.approve ? (
                        <Typography variant="h5" className="subTitle">
                          Go to trade page to start trading.
                        </Typography>
                      ) : (
                        <Typography variant="h5" className="subTitle">
                          It only takes a few minutes to get verified.
                        </Typography>
                      )}

                      {!this.props.user.userIdentity.submitted ? (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={this.startValidation.bind(this)}
                        >
                          verify account
                        </Button>
                      ) : this.props.user.userIdentity.approve ? (
                        <Chip label="Account Verified" color="primary" />
                      ) : (
                        <Chip label="Verification Pending" color="secondary" />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          );
        } else {
          user.userProfile.pendingResult.bankInfo === false
            ? (tabContent = (
                <div className="bodyInformation">
                  <Grid container spacing={2}>
                    <Grid item md={3} />
                    <Grid item xs={12} md={6}>
                      <Card className="dataListCard">
                        <CardHeader title="Bank Details" />
                        <CardContent className="identityBoxInfo">
                          <Typography variant="h3" className="title">
                            Add Bank Account first
                          </Typography>

                          <Typography variant="h5" className="subTitle">
                            You are almost ready to withdraw
                          </Typography>

                          <IconButton aria-label="settings">
                            <AccountBalanceIcon
                              style={{
                                fontSize: 50,
                              }}
                            />
                          </IconButton>

                          <Typography variant="h5" className="subTitle">
                            It only takes a few minutes to get setup.
                          </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() =>
                              this.props.history.push(
                                "/user-profile/basic_info"
                              )
                            }
                          >
                            Setup Bank Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </div>
              ))
            : (tabContent = (
                <div className="deposite withDetails">
                  {paymentStep === 0 ? (
                    <React.Fragment>
                      <Grid container spacing={2}>
                        <Grid item md={3} />
                        <Grid item xs={12} md={6}>
                          <Card className="dataListCard">
                            <CardHeader title={"Deposit " + userWallet.coin} />
                            <CardContent className="identityBoxInfo">
                              <Typography variant="h6" className="depoFrom">
                                Deposit From:
                              </Typography>

                              <TextField
                                error={errors.depositAmount ? true : false}
                                className="form-control"
                                variant="filled"
                                margin="dense"
                                id="depositAmount"
                                label="Amount"
                                value={depositAmount}
                                placeholder={
                                  "Enter amount in " + userWallet.coin
                                }
                                onChange={this.handleInputChange(
                                  "depositAmount"
                                )}
                                type="number"
                                fullWidth={true}
                                helperText={errors.depositAmount}
                              />
                              <div className="btn floatRight">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={(e) => this.depositAmountSubmit(e)}
                                  className={classes.button}
                                >
                                  Next
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  ) : paymentStep === 1 ? (
                    <Grid container spacing={2}>
                      <Grid item md={3} />
                      <Grid item xs={12} md={6}>
                        <Card className="dataListCard">
                          <CardContent className="identityBoxInfo">
                            {/* <Link onClick={() => {
                                                                this.setState({paymentStep: 0});
                                                                this.validator.purgeFields()
                                                                }} 
                                                                className="backLink"> 
                                                                <ArrowBackIosIcon/> 
                                                                Back
                                                            </Link> */}
                            <Typography variant="h3" className="title">
                              Select Payment Type
                            </Typography>
                            <Grid container>
                              <Grid item xs={12} md={12}>
                                <TextField
                                  error={errors.depositAmount ? true : false}
                                  className="form-control"
                                  variant="filled"
                                  margin="dense"
                                  id="depositAmount"
                                  label="Amount"
                                  value={depositAmount}
                                  placeholder={
                                    "Enter amount in " + userWallet.coin
                                  }
                                  onChange={this.handleInputChange(
                                    "depositAmount"
                                  )}
                                  type="number"
                                  fullWidth={true}
                                  helperText={errors.depositAmount}
                                  disabled={
                                    this.couldWalletDepositMaintenanceMode(
                                      userWallet.coin
                                    ) ?? false
                                  }
                                />
                                {this.couldWalletDepositMaintenanceMode(
                                  userWallet.coin
                                ) && (
                                  <FormHelperText id="filled-weight-helper-text">
                                    <Typography
                                      variant="body1"
                                      className="unavailableText"
                                      color="error"
                                    >
                                      {`${userWallet.coin} deposit is currently disabled due to maintenance.`}
                                    </Typography>
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <Box
                                  aria-disabled={
                                    !this.couldWalletDepositMaintenanceMode(
                                      userWallet.coin
                                    ) ?? false
                                  }
                                  className="selectBox"
                                  onClick={() =>
                                    this.selectPaymentOption("BankTransfer")
                                  }
                                >
                                  <img src={bluebankTransfer} alt="" />
                                  <div className="TextInfo tooltip">
                                    <Typography variant="body1">
                                      {" "}
                                      Bank Transfer{" "}
                                    </Typography>
                                    {this.props.wallet.userWallet.coin ===
                                    "INR" ? (
                                      <>
                                        <Typography variant="h5">
                                          {" "}
                                          RTGS/NEFT/IMPS{" "}
                                        </Typography>
                                        <Typography variant="h5">
                                          {" "}
                                          Deposit time: Upto 30 minutes{" "}
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          className="fees"
                                        >
                                          {" "}
                                          Fees: Free{" "}
                                        </Typography>
                                      </>
                                    ) : (
                                      <>
                                        <Typography variant="h5">
                                          {" "}
                                          Deposit time: 24 hour{" "}
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          className="fees"
                                        >
                                          {" "}
                                          Fee: 0.00%{" "}
                                        </Typography>
                                      </>
                                    )}
                                  </div>
                                </Box>
                              </Grid>
                              {userWallet.coin === "INR" && (
                                <React.Fragment>
                                  <Grid item xs={12} md={6}>
                                    <Box
                                      aria-disabled={
                                        this.couldWalletDepositMaintenanceMode(
                                          userWallet.coin
                                        ) ?? false
                                      }
                                      className="selectBox"
                                      onClick={() =>
                                        this.selectPaymentOption("DC")
                                      }
                                    >
                                      <img src={blueCard} alt="" />
                                      <div className="TextInfo">
                                        <Typography variant="body1">
                                          {" "}
                                          Cards{" "}
                                        </Typography>
                                        <Typography variant="h5">
                                          {" "}
                                          Credit/Debit Card
                                        </Typography>
                                        <Typography variant="h5">
                                          {" "}
                                          Deposit time: Instant{" "}
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          className="fees"
                                        >
                                          {" "}
                                          Fees: Free{" "}
                                        </Typography>
                                      </div>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Box
                                      aria-disabled={
                                        this.couldWalletDepositMaintenanceMode(
                                          userWallet.coin
                                        ) ?? false
                                      }
                                      className="selectBox"
                                      onClick={() =>
                                        this.selectPaymentOption("NB")
                                      }
                                    >
                                      <img src={bluenetbanking} alt="" />
                                      <div className="TextInfo">
                                        <Typography variant="body1">
                                          {" "}
                                          Netbanking{" "}
                                        </Typography>
                                        {/* <Typography variant="h5"> RTGS/NEFT/IMPS </Typography> */}
                                        <Typography variant="h5">
                                          {" "}
                                          Deposit time: Instant{" "}
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          className="fees"
                                        >
                                          {" "}
                                          Fees: Free{" "}
                                        </Typography>
                                      </div>
                                    </Box>
                                  </Grid>

                                  <Grid
                                    aria-disabled={
                                      this.couldWalletDepositMaintenanceMode(
                                        userWallet.coin
                                      ) ?? false
                                    }
                                    item
                                    xs={12}
                                    md={6}
                                  >
                                    <Box
                                      className="selectBox"
                                      onClick={() =>
                                        this.selectPaymentOption("WL")
                                      }
                                    >
                                      <img src={bluewallet} alt="" />
                                      <div className="TextInfo">
                                        <Typography variant="body1">
                                          {" "}
                                          Wallet{" "}
                                        </Typography>
                                        <Typography variant="h5">
                                          {" "}
                                          Deposit time: Instant{" "}
                                        </Typography>
                                        {/* <Typography variant="h5"> RTGS/NEFT/IMPS </Typography> */}
                                        {/* <Typography variant="h5"> Deposit time: Upto 30 minutes </Typography> */}
                                        <Typography
                                          variant="h6"
                                          className="fees"
                                        >
                                          {" "}
                                          Fees: Free
                                        </Typography>
                                      </div>
                                    </Box>
                                  </Grid>
                                  <Grid
                                    aria-disabled={
                                      this.couldWalletDepositMaintenanceMode(
                                        userWallet.coin
                                      ) ?? false
                                    }
                                    item
                                    xs={12}
                                    md={6}
                                  >
                                    <Box
                                      className="selectBox"
                                      onClick={() =>
                                        this.selectPaymentOption("UP")
                                      }
                                    >
                                      <img src={blueupi} alt="" />
                                      <div className="TextInfo">
                                        <Typography variant="body1">
                                          {" "}
                                          UPI{" "}
                                        </Typography>
                                        {/* <Typography variant="h5"> RTGS/NEFT/IMPS </Typography> */}
                                        <Typography variant="h5">
                                          {" "}
                                          Deposit time: Instant{" "}
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          className="fees"
                                        >
                                          {" "}
                                          Fees: Free{" "}
                                        </Typography>
                                      </div>
                                    </Box>
                                  </Grid>
                                </React.Fragment>
                              )}
                            </Grid>
                            {userWallet.coin === "INR" ||
                            userWallet.coin === "AED" ? (
                              <Typography
                                variant="body1"
                                className="unavailableText"
                                color="error"
                              >
                                {`${userWallet.coin} bank transfer deposit is currently disabled due to maintenance.`}
                              </Typography>
                            ) : null}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <React.Fragment>
                      <Grid container spacing={2}>
                        <Grid item md={3} />
                        <Grid item xs={12} md={6}>
                          <Card className="dataListCard">
                            <Link
                              onClick={() => {
                                this.setState({
                                  paymentStep: 1,
                                });
                                this.validator.purgeFields();
                              }}
                              className="backLink"
                            >
                              <ArrowBackIosIcon />
                              Back
                            </Link>
                            <CardContent className="identityBoxInfo">
                              {this.paymentMethodRender()}
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )}
                </div>
              ));
        }
      } else {
        tabContent = (
          <div className="deposite">
            <Grid container>
              <Grid item xs={12} md={6}>
                <Card className="dataListCard">
                  <CardContent>
                    <div className="title">
                      <Typography variant="h3" className="">
                        Deposit
                      </Typography>
                      {userWallet.coin === "XRP" ||
                      userWallet.coin === "ETH" ||
                      userWallet.coin === "BTX" ||
                      userWallet.coin === "TRX" ||
                      userWallet.coin === "USDT" ? (
                        userWallet.coin === "BTX" ||
                        userWallet.coin === "USDT" ? (
                          <div>
                            <Button
                              color="primary"
                              size="small"
                              variant={!this.state.trx20 ? "outlined" : ""}
                              onClick={() =>
                                this.setState({
                                  trx20: false,
                                  erc20: true,
                                })
                              }
                            >
                              ERC20
                            </Button>
                            <Button
                              color="primary"
                              size="small"
                              variant={this.state.trx20 ? "outlined" : ""}
                              onClick={() =>
                                this.setState({
                                  trx20: true,
                                  erc20: false,
                                })
                              }
                            >
                              TRC20
                            </Button>
                          </div>
                        ) : undefined
                      ) : (
                        <Button
                          color="primary"
                          size="small"
                          onClick={() =>
                            this.generateNewAddress(userWallet.coin)
                          }
                          disabled={ajaxProcess}
                        >
                          Generate new address
                        </Button>
                      )}
                      {userWallet.walletXAddress ? (
                        <Button
                          color="primary"
                          size="small"
                          onClick={() => this.toggleDestinationTag()}
                        >
                          {this.state.showDestinationTag
                            ? "View Default Address"
                            : "View Classic Address"}
                        </Button>
                      ) : undefined}
                    </div>
                    <div className="address">
                      <div className="details">
                        <Typography variant="h5" className="">
                          {userWallet.coin} Address
                        </Typography>
                        {this.state.ajaxWalletProcess ? (
                          <Skeleton variant="text" />
                        ) : this.state.showDestinationTag ? (
                          <view>
                            <Typography
                              variant="subtitle1"
                              style={{
                                fontWeight: 500,
                              }}
                              className=""
                            >
                              {userWallet.walletAddress}
                            </Typography>
                            <Typography variant="h5" className="">
                              Destination Tag
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              style={{
                                fontWeight: 500,
                              }}
                              className=""
                            >
                              {userWallet.destinationTag}
                            </Typography>
                          </view>
                        ) : (
                          <Typography
                            variant="subtitle1"
                            style={{
                              fontWeight: 500,
                            }}
                            className=""
                          >
                            {userWallet.walletXAddress
                              ? userWallet.walletXAddress
                              : this.state.trx20
                              ? userWallet.walletTrxAddress
                              : userWallet.walletAddress}
                          </Typography>
                        )}
                      </div>
                      <div className="barcode">
                        {this.state.ajaxWalletProcess ? (
                          <Skeleton variant="rect" width={210} height={210} />
                        ) : this.state.showDestinationTag ? (
                          <img
                            alt=""
                            src={
                              "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" +
                              userWallet.walletTrxAddress
                            }
                          />
                        ) : (
                          <img
                            alt=""
                            src={
                              "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" +
                              (userWallet.walletXAddress
                                ? userWallet.walletXAddress
                                : this.state.trx20
                                ? userWallet.walletTrxAddress
                                : userWallet.walletAddress)
                            }
                          />
                        )}
                      </div>
                      {this.couldWalletDepositMaintenanceMode(
                        userWallet.coin
                      ) && (
                        <Typography
                          variant="body1"
                          className="unavailableText"
                          color="error"
                        >
                          {`${userWallet.coin} deposit is currently disabled due to maintenance.`}
                        </Typography>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className="dataListCard addressList">
                  <CardHeader
                    title={
                      <List className={classes.root}>
                        <ListItem className="titleName">
                          <Typography variant="h5" className="">
                            Addresses
                          </Typography>

                          <Typography
                            component="span"
                            variant="body2"
                            className=""
                          >
                            Date
                          </Typography>
                        </ListItem>
                      </List>
                    }
                  />
                  <CardContent>
                    <List className={classes.root}>
                      {userWallet.bitgo ? (
                        this.state.ajaxWalletProcess ? (
                          <Skeleton variant="text" />
                        ) : !isEmpty(wallet.userWalletAddresses) ? (
                          wallet.userWalletAddresses.map((row) => (
                            <ListItem key={row.walletAddress}>
                              <Typography variant="h5" className="">
                                {row.walletAddress}
                              </Typography>
                              <Typography variant="body1" className="">
                                {row.date}
                              </Typography>
                            </ListItem>
                          ))
                        ) : (
                          <div className="noDatafound">
                            <img src={fileImg} alt="Remy Sharp" />
                            <Typography variant="h6" component="h2">
                              No Record Found
                            </Typography>
                          </div>
                        )
                      ) : (
                        <div className="noDatafound">
                          <img src={fileImg} alt="Remy Sharp" />
                          <Typography variant="h6" component="h2">
                            No Record Found
                          </Typography>
                        </div>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      }
    }

    if (walletTab === "withdraw") {
      if (userWallet?.fiat) {
        if (!user.userIdentity.submitted) {
          tabContent = (
            <div className="bodyInformation">
              <Grid container spacing={2}>
                <Grid item md={3} />
                <Grid item xs={12} md={6}>
                  <Card className="dataListCard">
                    <CardHeader title="Identity Documents" />
                    <CardContent className="identityBoxInfo">
                      <Typography variant="h3" className="title">
                        Continue setting up your account.
                      </Typography>

                      <Typography variant="h5" className="subTitle">
                        You are almost ready to trade!
                      </Typography>

                      <IconButton aria-label="settings">
                        <VerifiedUserIcon style={{ fontSize: 50 }} />
                      </IconButton>

                      <Typography variant="h5" className="subTitle">
                        It only takes a few minutes to get verified.
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.startValidation.bind(this)}
                      >
                        verify account
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          );
        } else {
          if (!user.userIdentity.approve) {
            tabContent = (
              <div className="bodyInformation">
                <Grid container spacing={2}>
                  <Grid item md={3} />
                  <Grid item xs={12} md={6}>
                    <Card className="dataListCard">
                      <CardHeader title="Identity Documents" />
                      <CardContent className="identityBoxInfo">
                        <Typography variant="h3" className="title">
                          Continue setting up your account.
                        </Typography>

                        <Typography variant="h5" className="subTitle">
                          You are almost ready to trade!
                        </Typography>

                        <IconButton aria-label="settings">
                          <VerifiedUserIcon style={{ fontSize: 50 }} />
                        </IconButton>

                        <Typography variant="h5" className="subTitle">
                          It only takes a few minutes to get verified.
                        </Typography>

                        <Chip label="Verification Pending" color="secondary" />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            );
          } else {
            tabContent = !isEmpty(user.userProfile)
              ? user.userProfile.pendingResult.bankInfo === false
                ? (tabContent = (
                    <div className="bodyInformation">
                      <Grid container spacing={2}>
                        <Grid item md={3} />
                        <Grid item xs={12} md={6}>
                          <Card className="dataListCard">
                            <CardHeader title="Bank Details" />
                            <CardContent className="identityBoxInfo">
                              <Typography variant="h3" className="title">
                                Add Bank Account first
                              </Typography>

                              <Typography variant="h5" className="subTitle">
                                You are almost ready to withdraw
                              </Typography>

                              <IconButton aria-label="settings">
                                <AccountBalanceIcon
                                  style={{
                                    fontSize: 50,
                                  }}
                                />
                              </IconButton>

                              <Typography variant="h5" className="subTitle">
                                It only takes a few minutes to get setup.
                              </Typography>

                              <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() =>
                                  this.props.history.push(
                                    "/user-profile/basic_info"
                                  )
                                }
                              >
                                Setup Bank Details
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </div>
                  ))
                : (tabContent = (
                    <div className="Withdraw">
                      <Grid container>
                        <Grid item md={3}></Grid>
                        <Grid item xs={12} md={6}>
                          <Card className="dataListCard">
                            <CardContent>
                              <div className="title">
                                <Typography variant="h3" className="">
                                  Withdraw
                                </Typography>
                              </div>
                              <div className="WithdrawBox">
                                <Typography variant="body1" className="">
                                  Available amount to withdraw :
                                </Typography>
                                <Typography variant="h4" className="">
                                  {parseFloat(
                                    parseFloat(userWallet.walletAmount) -
                                      parseFloat(userWallet.bonusWalletAmount)
                                  ).toFixed(3)}{" "}
                                  {userWallet.coin}
                                </Typography>

                                <Typography variant="body1" className="">
                                  Withdrawal Time: 2 to 24 hours
                                </Typography>

                                <TextField
                                  error={errors.withdrawAmount ? true : false}
                                  margin="dense"
                                  variant="filled"
                                  id="withdrawAmount"
                                  label="Amount"
                                  value={withdrawAmount}
                                  placeholder={
                                    "Enter amount in " + userWallet.coin
                                  }
                                  onChange={this.handleInputChange(
                                    "withdrawAmount"
                                  )}
                                  type="number"
                                  fullWidth={false}
                                  helperText={errors.withdrawAmount}
                                  className="form-control"
                                />
                              </div>
                            </CardContent>
                            <CardActions>
                              <div className="btn">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={this.createWithdrawRequest}
                                  className={classes.button}
                                  disabled={
                                    this.couldWalletWithdrawalMaintenanceMode(
                                      userWallet.coin
                                    ) ?? false
                                  }
                                >
                                  Withdraw
                                </Button>
                                {this.couldWalletWithdrawalMaintenanceMode(
                                  userWallet.coin
                                ) && (
                                  <FormHelperText id="filled-weight-helper-text">
                                    <Typography
                                      className="unavailableText"
                                      variant="body1"
                                      color="error"
                                    >
                                      {`${userWallet.coin} withdrawal is currently disabled due to maintenance.`}
                                    </Typography>
                                  </FormHelperText>
                                )}
                              </div>
                            </CardActions>
                          </Card>
                        </Grid>
                      </Grid>
                    </div>
                  ))
              : (tabContent = (
                  <div className="bodyInformation">
                    <Grid container spacing={2}>
                      <Grid item md={3} />
                      <Grid item xs={12} md={6}>
                        <Card className="dataListCard">
                          <CardHeader title="Bank Details" />
                          <CardContent className="identityBoxInfo">
                            <Typography variant="h3" className="title">
                              Add Bank Account first
                            </Typography>

                            <Typography variant="h5" className="subTitle">
                              You are almost ready to withdraw
                            </Typography>

                            <IconButton aria-label="settings">
                              <AccountBalanceIcon
                                style={{
                                  fontSize: 50,
                                }}
                              />
                            </IconButton>

                            <Typography variant="h5" className="subTitle">
                              It only takes a few minutes to get setup.
                            </Typography>

                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={() =>
                                this.props.history.push("/user-profile")
                              }
                            >
                              Setup Bank Deatils
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                ));
          }
        }
      } else {
        tabContent = (
          <div className="Withdraw">
            <Grid container>
              <Grid item md={3}></Grid>
              <Grid item xs={12} md={6}>
                <Card className="dataListCard">
                  <CardContent>
                    <div className="title">
                      <Typography variant="h3" className="">
                        Withdraw
                      </Typography>
                    </div>
                    <div className="WithdrawBox">
                      <Typography variant="body1" className="">
                        Available amount to withdraw :
                      </Typography>
                      <Typography variant="h4" className="">
                        {parseFloat(userWallet.walletAmount).toFixed(8)}{" "}
                        {userWallet.coin}
                      </Typography>
                      {userWallet.coin === "USDT" ? (
                        <div>
                          <Typography variant="body1" className="">
                            Withdrawal Network:
                          </Typography>
                          <Button
                            color="primary"
                            size="small"
                            variant={this.state.trx20 ? "outlined" : ""}
                            onClick={() =>
                              this.setState({
                                trx20: true,
                                erc20: false,
                              })
                            }
                          >
                            TRC20
                          </Button>
                          <Button
                            color="primary"
                            size="small"
                            variant={!this.state.trx20 ? "outlined" : ""}
                            onClick={() =>
                              this.setState({
                                trx20: false,
                                erc20: true,
                              })
                            }
                          >
                            ERC20
                          </Button>
                        </div>
                      ) : undefined}

                      <TextField
                        error={errors.reciepientAddress ? true : false}
                        margin="dense"
                        variant="filled"
                        id="reciepientAddress"
                        label={`Recipient's ${userWallet.coin} Address`}
                        value={reciepientAddress}
                        onChange={this.handleInputChange("reciepientAddress")}
                        type="text"
                        fullWidth={true}
                        helperText={errors.reciepientAddress}
                        className="form-control"
                      />

                      <TextField
                        error={errors.reciepientAmount ? true : false}
                        margin="dense"
                        variant="filled"
                        id="reciepientAmount"
                        label="Amount"
                        value={reciepientAmount}
                        onChange={this.handleInputChange("reciepientAmount")}
                        type="number"
                        fullWidth={true}
                        helperText={errors.reciepientAmount}
                        className="form-control"
                      />

                      {userWallet.coin === "XRP" ? (
                        this.state.dTagRequired ? (
                          <TextField
                            error={errors.destinationTag ? true : false}
                            margin="dense"
                            variant="filled"
                            id="destinationTag"
                            label="Destination Tag (Optional)"
                            value={destinationTag}
                            onChange={this.handleInputChange("destinationTag")}
                            type="text"
                            fullWidth={true}
                            helperText={errors.destinationTag}
                            className="form-control"
                          />
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}

                      <TextField
                        error={errors.reciepientNote ? true : false}
                        margin="dense"
                        id="reciepientNote"
                        variant="filled"
                        label="Note (Optional)"
                        value={reciepientNote}
                        onChange={this.handleInputChange("reciepientNote")}
                        type="text"
                        fullWidth={true}
                        helperText={errors.reciepientNote}
                        className="form-control"
                      />

                      <Typography variant="body1" className="">
                        You will Pay:
                      </Typography>

                      {userWallet.coin === "USDT" ? (
                        <Typography
                          variant="h4"
                          className=""
                          value={finalAmount} // this is initialized in this.state inside the constructor
                        >
                          {this.state.erc20
                            ? parseFloat(finalAmount) > 0
                              ? parseFloat(parseFloat(finalAmount) + 10.0)
                              : "0"
                            : parseFloat(finalAmount) > 0
                            ? parseFloat(finalAmount) +
                              parseFloat(walletDetails.withdrawalFee)
                            : "0"}{" "}
                          {userWallet.coin}
                        </Typography>
                      ) : (
                        <Typography
                          variant="h4"
                          className=""
                          value={finalAmount} // this is initialized in this.state inside the constructor
                        >
                          {parseFloat(finalAmount) > 0
                            ? parseFloat(finalAmount) +
                              parseFloat(walletDetails.withdrawalFee)
                            : "0"}{" "}
                          {userWallet.coin}
                        </Typography>
                      )}

                      <div className="btn">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.withdrawCrypto}
                          disabled={
                            this.couldWalletWithdrawalMaintenanceMode(
                              userWallet.coin
                            )
                              ? true
                              : ajaxProcess
                              ? true
                              : false
                          }
                          className={classes.button}
                        >
                          Send
                        </Button>
                        {this.couldWalletWithdrawalMaintenanceMode(
                          userWallet.coin
                        ) && (
                          <FormHelperText id="filled-weight-helper-text">
                            <Typography
                              className="unavailableText"
                              variant="body1"
                              color="error"
                            >
                              {`${userWallet.coin} withdrawal is currently disabled due to maintenance.`}
                            </Typography>
                          </FormHelperText>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      }
    }

    if (walletTab === "transactions") {
      tabContent = (
        <div className="transaction">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} md={12}>
              <MaterialTable
                title="Withdrawal / Deposit"
                options={{
                  actionsColumnIndex: -1,
                  search: false,
                }}
                icons={tableIcons}
                columns={[
                  { title: "Type", field: "type" },
                  { title: "Amount", field: "value" },
                  {
                    title: "Note Number",
                    field: "noteNumber",
                    render: (rowData) =>
                      rowData.noteNumber ? rowData.noteNumber : "-",
                  },
                  {
                    title: "Created At",
                    field: "date",
                    render: (rowData) =>
                      rowData.date ? (
                        <div>{moment(rowData.date).format("lll")}</div>
                      ) : (
                        rowData.date
                      ),
                  },
                  {
                    title: "Reference ID",
                    field: "referenceNumber",
                    render: (rowData) =>
                      rowData.referenceNumber ? (
                        rowData.referenceNumber
                      ) : rowData.status === "Pending" &&
                        rowData.type === "Deposit" ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => {
                            this.editDepositRequest(rowData._id);
                          }}
                          className={classes.button}
                        >
                          Edit
                        </Button>
                      ) : (
                        "-"
                      ),
                  },
                  // {
                  //     title: 'fees',
                  //     field: 'fee',
                  //     render: rowData => (
                  //         (rowData.fee) ?
                  //             rowData.fee
                  //         :
                  //         '-'
                  //     )
                  // },
                  {
                    title: "Status",
                    field: "status",
                    render: (rowData) =>
                      rowData.status === "Pending" &&
                      rowData.type === "Deposit" ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => {
                            rowData.type === "Withdrawal"
                              ? this.cancelWithdraw(rowData._id)
                              : this.cancelDeposit(rowData._id);
                          }}
                          className={classes.button}
                        >
                          Cancel
                        </Button>
                      ) : (
                        rowData.status
                      ),
                  },
                ]}
                data={wallet.userWithdrawalRequests}
              />
            </Grid>

            {/* <Grid item xs={12} md={12}>
                                    <MaterialTable
                                        title="Deposit"
                                        options={{
                                            actionsColumnIndex: -1
                                        }}
                                        icons={tableIcons}
                                        columns={[
                                            { title: 'Type', field: 'type' },
                                            { title: 'Amount', field: 'value' },
                                            { title: 'Fees', field: 'fee' },
                                            {
                                                title: 'Status',
                                                field: 'status',
                                                render: rowData => (
                                                    (rowData.status === 'Pending') ?
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => this.cancelDeposit(rowData._id)}
                                                        className={classes.button}
                                                    >
                                                        Cancel
                                                    </Button> :
                                                    rowData.status
                                                )
                                            },
                                            { title: 'Note Number', field: 'noteNumber' },
                                            { title: 'Created At', field: 'date' },
                                        ]}
                                        data={wallet.userDepositRequests}
                                    />
                                </Grid> */}
          </Grid>
        </div>
      );
    }

    let walletAssetTab = (
      <div className="rightBar wallet">
        <Tabs
          scrollButtons="auto"
          variant="scrollable"
          value={walletTab}
          onChange={this.handleChange}
          textColor="primary"
          indicatorColor="primary"
          // className="settingSubMenu"
          className={"settingSubMenu"}
        >
          <Tab value="balance" label="Balance" />
          {userWallet?.active ? <Tab value="deposite" label="Deposit" /> : ""}
          {userWallet?.active ? <Tab value="withdraw" label="Withdraw" /> : ""}
          {userWallet?.fiat && userWallet?.active ? (
            <Tab value="transactions" label="Transactions" />
          ) : (
            ""
          )}
        </Tabs>
        <Container style={styles.mainContainer} fixed={false}>
          {this.state.ajaxwalletLoading ? tabProcessContent : tabContent}
        </Container>
      </div>
    );

    return (
      <React.Fragment>
        <Helmet>
          <title className="next-head">Wallet | Trillionbit</title>
          <meta
            name="description"
            content="Bitex is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, bitex, Trillionbit india, Trillionbit crypto, Trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta property="og:url" content="https://www.bitex.com/user-wallet" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Wallet | Trillionbit" />
          <meta property="og:site_name" content="Trillionbit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Wallet | Trillionbit" />
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
        <Backdrop
          className={classes.backdrop}
          open={ajaxProcess ? true : false}
        >
          <CircularProgress color="inherit" />
          <Typography
            variant="body1"
            gutterBottom
            className={classes.backdropLoader}
          >
            Processing... Please! Do not press Back or Refresh button
          </Typography>
        </Backdrop>
        <div className="paddingTopbody100">
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
              variant={
                !isEmpty(snackMessages) ? snackMessages.variant : variant
              }
              message={
                !isEmpty(snackMessages)
                  ? snackMessages.message
                  : snackbarMessage
              }
            />
          </Snackbar>
          <div className="mainbody walletpageBody" fixed="false">
            <div className="sideBar">
              <div className="coinList">
                <List className="list">
                  {wallet.userAssets.map((asset, index) => {
                    if (this.state.ajaxwalletLoading) {
                      return (
                        <ListItem className="currencySidebar" key={index}>
                          <Skeleton variant="circle" width={30} height={30} />
                          <Skeleton variant="text" />
                        </ListItem>
                      );
                    } else {
                      return (
                        <ListItem
                          className={
                            userWallet.coin === asset.coin
                              ? "active currencySidebar"
                              : "currencySidebar"
                          }
                          key={index}
                          onClick={() =>
                            this.handleWalletAssetsTabChange(asset._id)
                          }
                        >
                          <img
                            src={currencyIcon(asset.coin)}
                            alt={asset.coin}
                            width="30"
                          />
                          <Typography variant="h6" component="h2">
                            {asset.coin === userWallet.coin
                              ? userWallet.coin
                              : parseFloat(asset.walletAmount).toFixed(4)}
                          </Typography>
                          <Typography
                            className={classes.pos}
                            color="textSecondary"
                          >
                            {asset.coin} Balance
                          </Typography>
                        </ListItem>
                      );
                    }
                  })}
                </List>
              </div>
            </div>
            {/* <Grid container > */}
            {/* <Grid item xs={12} md={12} className="paddingB0">
                                <div className="coinList">
                                    <List className="list">
                                        {wallet.userAssets.map((asset, index) => {
                                            return (
                                                <ListItem
                                                    className={(userWallet.coin === asset.coin) ? "active": ""}
                                                    key={index}
                                                    onClick={() => this.handleWalletAssetsTabChange(asset._id)}
                                                >
                                                    <img src={currencyIcon(asset.coin)} alt={asset.coin} width="50" />
                                                    <Typography variant="h6" component="h2">
                                                        {asset.walletAmount}
                                                    </Typography>
                                                    <Typography className={classes.pos} color="textSecondary">
                                                        {asset.coin} Balance
                                                    </Typography>
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                </div>
                            </Grid> */}
            {/* <div className="rightBar wallet"> */}
            {walletAssetTab}
            {/* </div> */}
            {/* </Grid> */}
          </div>
        </div>
        <Dialog
          open={this.state.paymentStatusModal}
          onClose={() => this.setState({ paymentStatusModal: false })}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth="md"
          transitionDuration={0}
          style={{ minHeight: 676 }}
          className="OrderDialog"
          disableBackdropClick={true}
        >
          <DialogTitle
            id="form-dialog-title"
            className={
              this.state.dasshpePaymentStatus?.data?.paymentStatus ===
              "Captured"
                ? "orderTitle buy"
                : "orderTitle danger"
            }
          >
            Payment Status
          </DialogTitle>

          <DialogContent>
            <Grid container>
              <Grid item sm={12} xs={12}>
                <div className="container-success">
                  {this.state.dasshpePaymentStatus?.variant === "success" ? (
                    <div className="box">
                      <img
                        src={
                          this.state.dasshpePaymentStatus?.data
                            ?.paymentStatus === "Captured"
                            ? "https://mcusercontent.com/e3875b3dfc4f73cd67e7817b6/images/1d610de8-2f00-4573-933d-9615e0bddaf1.webp"
                            : "https://mcusercontent.com/e3875b3dfc4f73cd67e7817b6/images/3ebe8e95-be5c-46e7-beb6-98862ffaaf93.webp"
                        }
                        alt="payment-status"
                      />
                      {this.state.dasshpePaymentStatus?.data?.paymentStatus ===
                        "Captured" && (
                        <h4 className="green"> Payment successful</h4>
                      )}
                      {this.state.dasshpePaymentStatus?.data?.paymentStatus ===
                        "Failed" && (
                        <h4 className="red">
                          {" "}
                          {this.state.dasshpePaymentStatus?.data?.responseMsg}
                        </h4>
                      )}
                      {this.state.dasshpePaymentStatus?.data?.paymentStatus ===
                        "Cancelled" && (
                        <h4 className="red">
                          {this.state.dasshpePaymentStatus?.data?.responseMsg}
                        </h4>
                      )}
                      <p>
                        {" "}
                        Status:{" "}
                        <span>
                          {" "}
                          {
                            this.state.dasshpePaymentStatus?.data?.paymentStatus
                          }{" "}
                        </span>{" "}
                      </p>
                      <p>
                        {" "}
                        Transaction ID:{" "}
                        <span>
                          {" "}
                          {
                            this.state.dasshpePaymentStatus?.data?.transactionId
                          }{" "}
                        </span>
                      </p>
                      {this.state.dasshpePaymentStatus?.data?.paymentType && (
                        <p>
                          {" "}
                          Payment Type:{" "}
                          <span>
                            {" "}
                            {
                              this.state.dasshpePaymentStatus?.data?.paymentType
                            }{" "}
                          </span>
                        </p>
                      )}
                      <p>
                        {" "}
                        Amount:{" "}
                        <span>
                          {" "}
                          {this.state.dasshpePaymentStatus?.data?.coin}{" "}
                          {this.state.dasshpePaymentStatus?.data?.amount}{" "}
                        </span>{" "}
                      </p>
                    </div>
                  ) : (
                    <Typography
                      variant="body1"
                      gutterBottom
                      className={classes.backdropLoader}
                    >
                      {this.state.dasshpePaymentStatus?.message}
                    </Typography>
                  )}
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="btn"
              onClick={() => this.setState({ paymentStatusModal: false })}
              color="primary"
            >
              Back to wallet
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.editDepositRequestModal}
          onClose={() => this.setState({ editDepositRequestModal: false })}
          aria-labelledby="form-dialog-title"
          disableBackdropClick={true}
          className="updateReferenceID"
        >
          <DialogTitle id="form-dialog-title">Update Reference ID</DialogTitle>
          <DialogContent>
            <div>
              <FormControl className="form-control">
                <TextField
                  label="Reference ID"
                  margin="dense"
                  variant="filled"
                  fullWidth={true}
                  onChange={this.handleInputChange("referenceNumber")}
                  name="referenceNumber"
                  className="form-control"
                />
                <FormHelperText id="filled-weight-helper-text">
                  <Typography variant="body1" color="error">
                    {" "}
                    {this.state.errors?.referenceNumber}
                  </Typography>
                </FormHelperText>
              </FormControl>
            </div>
            <Typography variant="h5" className="note">
              <strong> Note: </strong> Reference ID is the transaction number
              which is sent to your register mobile number.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  editDepositRequestModal: false,
                })
              }
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.onUpdateDepositeSubmit}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.dasshpePaymentModel}
          onClose={() => this.setState({ dasshpePaymentModel: false })}
          aria-labelledby="payment-dialog-title"
          fullWidth={true}
          maxWidth="md"
          transitionDuration={0}
          className="OrderDialog"
          disableBackdropClick={true}
        >
          <DialogTitle id="payment-dialog-title" className={"orderTitle buy"}>
            PAYMENT
          </DialogTitle>

          <DialogContent>
            <Grid container>
              {this.state.dasshpePaymentModel && (
                <iframe
                  title="payment-frame"
                  height="100%"
                  width="100%"
                  target="_parent"
                  referrerpolicy=""
                  allow="payment"
                  name="payment-iframe"
                  allowpaymentrequest="true"
                  sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-presentation"
                />
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="btn"
              onClick={() => this.setState({ dasshpePaymentModel: false })}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

UserWallet.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  getUserWallet: PropTypes.func.isRequired,
  generateNewAddress: PropTypes.func.isRequired,
  snackMessages: PropTypes.object.isRequired,
  clearSnackMessages: PropTypes.func.isRequired,
  getUserWalletAddresses: PropTypes.func.isRequired,
  getActiveAssets: PropTypes.func.isRequired,
  createDepositRequest: PropTypes.func.isRequired,
  createWithdrawRequest: PropTypes.func.isRequired,
  updateDepositRequest: PropTypes.func.isRequired,
  getDepositRequests: PropTypes.func.isRequired,
  getWithdrawalRequests: PropTypes.func.isRequired,
  sendCrypto: PropTypes.func.isRequired,
  cancelDeposit: PropTypes.func.isRequired,
  cancelWithdraw: PropTypes.func.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  placeMarketOrder: PropTypes.func.isRequired,
  getUserIdentity: PropTypes.func.isRequired,
  getOrderId: PropTypes.func.isRequired,
  transferDepositAmount: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  trading: state.trading,
  maintenance: state.trading.maintenance,
  wallet: state.wallet,
  errors: state.errors,
  snackMessages: state.snackMessages,
  bitexSaving: state.bitexSaving,
});

export default connect(mapStateToProp, {
  getUserWallet,
  generateNewAddress,
  clearSnackMessages,
  getUserWalletAddresses,
  getActiveAssets,
  createDepositRequest,
  createWithdrawRequest,
  updateDepositRequest,
  getDepositRequests,
  getWithdrawalRequests,
  sendCrypto,
  cancelDeposit,
  cancelWithdraw,
  getUserProfile,
  placeMarketOrder,
  getUserIdentity,
  getOrderId,
  transferDepositAmount,
  dasshpePaymentRequest,
  checkPaymentStatus,
  editDepositRequest,
  buyBtxCoin,
  getUserBitexSavingWallet,
  getWalletMaintenance,
  getbankDetails,
})(withStyles(themeStyles)(UserWallet));
