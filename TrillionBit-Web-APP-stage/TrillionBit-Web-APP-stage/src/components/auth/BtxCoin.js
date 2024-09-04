import "@metamask/legacy-web3";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { makeStyles } from "@mui/styles";

import { withStyles } from "@mui/styles";
import { red } from "@mui/material/colors";

import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  TextField,
  List,
  ListItem,
  Button,
  Box,
  Link,
  CircularProgress,
} from "@mui/material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import blueCard from "../../assets/img/cards-blue.webp";
import bluebankTransfer from "../../assets/img/bank-blue.webp";
import bluenetbanking from "../../assets/img/net-banking.webp";
import bluewallet from "../../assets/img/wallet.webp";
import blueupi from "../../assets/img/upi.webp";
import referImg from "../../assets/img/refer.webp";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import themeStyles from "../../assets/themeStyles";

import btxCoin from "../../assets/img/home/btx-coin.webp";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FilterNoneIcon from "@mui/icons-material/FilterNone";

import { getChartData, getMarketStatusToday } from "../../actions/orderActions";
import {
  getAvailaleMarkets,
  getMarketLast,
  getActiveAssets,
  buyBtxCoin,
  getBtxMarketData,
  getBtxAedMarketData,
  getUsdtInrPrice,
  createDepositRequest,
  updateDepositRequest,
  dasshpePaymentRequest,
  checkPaymentStatus,
  editDepositRequest,
} from "../../actions/walletActions";
import { clearSnackMessages } from "../../actions/messageActions";
import Post from "../../utils/post";
import { subscribeToNewsletter } from "../../actions/userActions";
import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";
import isEmpty from "../../validation/isEmpty";

import DashhPayCode from "../../common/DashhPayCode";
import { inrAccountDetail, aedAccountDetail } from "../../common/AccountDetail";
import SimpleReactValidator from "simple-react-validator";
import InputMask from "react-input-mask";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import coinImg from "../../assets/img/coins/tbtc.webp";
import tEthImg from "../../assets/img/coins/teth.webp";
import usdtImg from "../../assets/img/coins/usdt.webp";
import inrImg from "../../assets/img/coins/inr.webp";
import aedImg from "../../assets/img/coins/aed.webp";
import tBtxImg from "../../assets/img/btx-coin.webp";

import visaCardIcon from "../../assets/img/cards/visa.jpg";
import amexCardIcon from "../../assets/img/cards/amex.jpg";
import dinnerCardIcon from "../../assets/img/cards/dinner.jpg";
import jcbCardIcon from "../../assets/img/cards/jcb.jpg";
import rupayCardIcon from "../../assets/img/cards/rupay.jpg";
import masterCardIcon from "../../assets/img/cards/mastercard.jpg";
import Tooltip from "@mui/material/Tooltip";
import "../../assets/css/home.css";
import { getReferral } from "../../actions/referralActions";
import {
  setLastLoginRedirectedLink,
  sendBtxForEth,
} from "../../actions/authActions";
import Web3 from "web3";

export class BtxCoin extends Component {
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
    value: "",
    buyTabValue: "BTC",
    PaymentTabValue: "PaymentTab",
    anchorEl: null,
    anchorCurrencyEl: null,
    email: "",
    mobile: "",
    errors: {},
    series: [
      {
        name: "price",
        data: [30, 40, 70, 91, 125],
      },
    ],
    marketGraphs: {},
    marketLast: {},
    currentCurrency: "AED",
    btxBuyDetail: {
      coin: "BTC",
      market: "BTXBTC",
      price: 0.0,
      amount: 0.0,
    },
    selectedWallet: {},
    walletAddress: "",
    buyBtxMessage: "",
    buyBtxConfirmation: true,
    btxBuyModal: false,
    btxBuyConfirmModal: false,
    snackMessages: {},
    leftCoinAmount: 0,
    usdtInr: 0,

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
    depositAmount: "",
    referenceNumber: "",
    userDepositeRequestId: "",
    cardTypeIcon: "",
    feesInPercentage: 4,
    editDepositRequestModal: false,
    ajaxProcess: false,
    feesAmount: 0,
  };

  componentDidMount = async () => {
    this.readUrlData();
    window.scrollTo(0, 0);
    if (!isEmpty(this.props.auth.user?.id))
      await this.props.getReferral(this.props.auth.user.id);
    this.getActiveUserWallets();
    const promises = [
      this.props.getMarketLast(),
      this.props.getBtxMarketData(),
      this.props.getBtxAedMarketData(),
      this.props.getUsdtInrPrice(),
    ];
    await Promise.all(promises);
  };

  redirectToLogin = () => {
    this.props.setLastLoginRedirectedLink(`/btxCoin`);
    this.props.history.push("/login");
  };

  initPayButton = async () => {
    const { btxBuyDetail, errors } = this.state;
    btxBuyDetail.amount = isNaN(btxBuyDetail.amount) ? 0 : btxBuyDetail.amount;
    btxBuyDetail.price = isNaN(btxBuyDetail.price) ? 0 : btxBuyDetail.price;

    if (
      parseFloat(btxBuyDetail.amount) > 0 &&
      parseFloat(btxBuyDetail.price) > 0
    ) {
      if (typeof window.ethereum !== "undefined") {
        this.setState({ ajaxProcess: true });
        // window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        const amountValue = Web3.utils.toWei(btxBuyDetail.price);

        const transactionParameters = {
          to: "0x398CeaCf7Ed95C2A74D70B0F3b62d1A1098aD770", // Required except during contract publications.
          from: account, // must match user's active address.
          value: window.web3.toHex(amountValue), // Only required to send ether to the recipient from the initiating external account.// Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

        try {
          const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
          });

          if (txHash) {
            console.log("Thanks for your interest!", txHash);
            const userData = {
              toAddress: account,
              amount: btxBuyDetail.amount,
            };
            await this.props.sendBtxForEth(userData);
            this.setState({ ajaxProcess: false });
          } else {
            console.log("Your loss!");
            this.setState({ ajaxProcess: false });
            this.setState({
              snackMessages: {
                variant: "error",
                message: "Trasnaction Failed",
              },
              ajaxProcess: false,
            });
          }
        } catch (error) {
          this.setState({
            snackMessages: { variant: "error", message: error.message },
            ajaxProcess: false,
          });
        }
      }
    } else {
      errors["amount"] =
        parseFloat(btxBuyDetail.amount) <= 0 ? "Field is required" : "";
      errors["price"] =
        parseFloat(btxBuyDetail.price) <= 0 ? "Field is required" : "";
      this.setState({ errors });
    }
  };

  readUrlData = () => {
    const query = new URLSearchParams(this.props.location.search);
    const orderId = query.get("status");
    if (orderId) {
      this.openPaymentStatusModel(orderId);
      window.history.replaceState(null, null, "/");
      window.history.pushState(null, null, "/btxCoin");
      window.onpopstate = function (event) {
        window.history.go(1);
      };
    }
  };

  handleBuyCoinChange = (event, newValue) => {
    const btxBuyDetail = this.state.btxBuyDetail;
    btxBuyDetail["coin"] = newValue;
    btxBuyDetail["market"] = btxBuyDetail["coin"]
      ? `BTX${btxBuyDetail["coin"]}`
      : "";
    btxBuyDetail["price"] = 0;
    btxBuyDetail["amount"] = 0;
    this.setState({ buyTabValue: newValue, btxBuyDetail, leftCoinAmount: 0 });
  };

  handleUseCoinChange = (event, newValue) => {
    this.setState({ PaymentTabValue: newValue });
  };

  createData = (usd, price, change, chart, trade) => {
    return { usd, price, change, chart, trade };
  };

  subscribeNewsletter = () => {
    console.log(this.state);
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
    this.setState({ snackMessages: {} });
  };

  handleInputChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
    if (name === "depositAmount") {
      const { errors } = this.state;
      errors["depositAmount"] = "";
      this.setState({ errors });
    }
    if (name === "referenceNumber") {
      const { errors } = this.state;
      errors["referenceNumber"] = "";
      this.setState({ errors });
    }
  };

  getMarketGraph = (market) => {
    if (this.state.marketGraphs[market]) {
      return this.state.marketGraphs[market];
    } else {
      return [
        {
          name: "price",
          data: [30, 40, 70, 91, 125],
        },
      ];
    }
  };

  getMarketData = (marketName) => {
    return Object.entries(this.props.trading.marketLast).find(
      ([key]) => key === marketName
    )[1];
  };

  getActiveUserWallets = () => {
    if (this.props.auth.isAuthenticated && this.props.auth.user.id)
      this.props.getActiveAssets(this.props.auth.user.id);
  };

  getWalletAddress = (coin) => {
    const { userAssets } = this.props.wallet;
    if (userAssets) {
      return userAssets.find((element) => coin === element.coin)?.walletAddress;
    }
  };

  handleChange = (name) => (event) => {
    const { btxBuyDetail, errors } = this.state;
    const onlyNumberInput = /^[+-]?\d*(?:[.,]\d*)?$/;
    btxBuyDetail[name] = onlyNumberInput.test(event.target.value)
      ? event.target.value
      : btxBuyDetail[name];
    errors["amount"] = "";
    errors["price"] = "";
    let calculatePriceAmount = 0;
    switch (btxBuyDetail["coin"]) {
      case "BTC":
      case "ETH":
        const marketInrPrice = this.getMarketData(
          `${btxBuyDetail["coin"]}INR`
        )?.ask;
        calculatePriceAmount =
          name === "amount"
            ? this.marketCalculation(event.target.value, marketInrPrice)
            : this.btxCalculation(event.target.value, marketInrPrice);
        break;
      case "USDT":
        calculatePriceAmount =
          name === "amount"
            ? this.marketCalculation(
                event.target.value,
                parseFloat(this.props.wallet.usdtInrPrice)
              )
            : this.btxCalculation(
                event.target.value,
                parseFloat(this.props.wallet.usdtInrPrice)
              );

        break;
      case "AED":
        calculatePriceAmount =
          name === "amount"
            ? (
                parseFloat(event.target.value) *
                parseFloat(this.props.wallet.bitexAedMarket.last)
              ).toFixed(2)
            : (
                parseFloat(event.target.value) /
                parseFloat(this.props.wallet.bitexAedMarket.last)
              ).toFixed(8);
        break;

      case "INR":
        calculatePriceAmount =
          name === "amount"
            ? (
                parseFloat(event.target.value) *
                parseFloat(this.props.wallet.bitexMarket.last)
              ).toFixed(2)
            : (
                parseFloat(event.target.value) /
                parseFloat(this.props.wallet.bitexMarket.last)
              ).toFixed(8);
        break;
      default:
    }
    calculatePriceAmount = isNaN(calculatePriceAmount)
      ? ""
      : calculatePriceAmount;
    name === "amount"
      ? (btxBuyDetail["price"] = calculatePriceAmount)
      : (btxBuyDetail["amount"] = calculatePriceAmount);
    const leftCoinAmount = this.props.auth.isAuthenticated
      ? this.leftCoinAmountCalculation(btxBuyDetail["price"])
      : 0;
    this.setState({ btxBuyDetail, leftCoinAmount, errors });
  };

  leftCoinAmountCalculation = (price) => {
    const wallet = this.props.wallet.userAssets.find(
      (element) => this.state.btxBuyDetail.coin === element.coin
    );
    if (
      !isEmpty(wallet) &&
      parseFloat(wallet.walletAmount) < parseFloat(price)
    ) {
      return (parseFloat(price) - parseFloat(wallet.walletAmount)).toFixed(8);
    }
    return 0;
  };

  buyBtxConfirmation = (coin) => {
    this.props.history.push("/trading");
    // const { btxBuyDetail, errors} = this.state;
    // btxBuyDetail.amount = isNaN(btxBuyDetail.amount) ? 0 : btxBuyDetail.amount;
    // btxBuyDetail.price = isNaN(btxBuyDetail.price) ? 0 : btxBuyDetail.price;
    // if(parseFloat(btxBuyDetail.amount) > 0 && parseFloat(btxBuyDetail.price) > 0) {
    //     btxBuyDetail['coin'] = coin;
    //     btxBuyDetail['market'] =  btxBuyDetail['coin'] ? `BTX${btxBuyDetail['coin']}` : '';
    //     const walletAddress =  this.getWalletAddress(coin)
    //     const wallet = this.props.wallet.userAssets.find(element => coin === element.coin);
    //     if(!isEmpty(wallet) && parseFloat(wallet.walletAmount) >= parseFloat(btxBuyDetail.price)) {
    //         this.setState({btxBuyConfirmModal: true, buyBtxConfirmation: true, btxBuyModal: false, walletAddress, btxBuyDetail});
    //     } else {
    //         this.setState({btxBuyConfirmModal: true, buyBtxConfirmation: false, btxBuyModal: false, walletAddress, btxBuyDetail});
    //     }
    // } else {
    //     errors['amount'] = (parseFloat(btxBuyDetail.amount) <= 0) ? 'Field is required' : '';
    //     errors['price']  = (parseFloat(btxBuyDetail.price) <= 0 ) ? 'Field is required' : '';
    //     this.setState({errors});
    // }
  };

  buyBtxCoin = async () => {
    const btxBuyDetail = this.state.btxBuyDetail;
    const data = { userId: this.props.auth.user.id, btxBuyDetail };
    const response = await this.props.buyBtxCoin(data);
    if (response?.variant === "success") {
      this.getActiveUserWallets();
      await this.props.getMarketLast();
      btxBuyDetail["coin"] = "BTC";
      btxBuyDetail["market"] = "BTXBTC";
      btxBuyDetail["price"] = 0;
      btxBuyDetail["amount"] = 0;
    }
    this.setState({
      btxBuyConfirmModal: false,
      snackMessages: response,
      btxBuyModal: false,
      btxBuyDetail,
      buyTabValue:
        response?.variant === "error" ? this.state.buyTabValue : "BTC",
    });
  };

  marketCalculation = (price, marketDataInrPrice) => {
    const btxInrPrice =
      parseFloat(price) * parseFloat(this.props.wallet.bitexMarket.last);
    return (parseFloat(btxInrPrice) / parseFloat(marketDataInrPrice)).toFixed(
      8
    );
  };

  btxCalculation = (price, marketDataInrPrice) => {
    const inrPrice = parseFloat(price) * parseFloat(marketDataInrPrice);
    return (
      parseFloat(inrPrice) / parseFloat(this.props.wallet.bitexMarket.last)
    ).toFixed(8);
  };

  checkUserWalletActive = (coin) => {
    const { userAssets } = this.props.wallet;
    return userAssets?.find((element) => coin === element.coin)?.active
      ? true
      : false;
  };

  handleLeftAmountModel = () => {
    if (
      this.state.btxBuyDetail.coin === "INR" ||
      this.state.btxBuyDetail.coin === "AED"
    ) {
      this.state.buyBtxConfirmation
        ? this.setState({ btxBuyConfirmModal: false })
        : this.setState({
            dasshpePaymentModel: true,
            btxBuyConfirmModal: false,
          });
    } else {
      this.state.buyBtxConfirmation
        ? this.setState({ btxBuyConfirmModal: false })
        : this.setState({ btxBuyConfirmModal: false, btxBuyModal: true });
    }
  };

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

  createDepositRequest = async () => {
    const { depositAmount, userDepositeRequestId, btxBuyDetail } = this.state;
    if (userDepositeRequestId === "") {
      const noteNumber = [...Array(10)]
        .map((i) => (~~(Math.random() * 36)).toString(36))
        .join("");
      const depositParams = {
        userId: this.props.auth.user.id,
        type: "Bank Transfer",
        amount: depositAmount,
        coin: btxBuyDetail.coin,
        fees: 0,
        noteNumber: noteNumber,
      };
      this.setState({ noteNumber: noteNumber });
      this.props.createDepositRequest(depositParams).then(async (res) => {
        console.log(res.data);
        if (res) {
          if (res.data.userDepositeRequestId) {
            this.setState({
              userDepositeRequestId: res.data.userDepositeRequestId,
            });
          }
        }
      });
    }
  };

  updateDepositRequest = async () => {
    const {
      referenceNumber,
      userDepositeRequestId,
      depositAmount,
      btxBuyDetail,
    } = this.state;
    if (!isEmpty(referenceNumber) && !isEmpty(userDepositeRequestId)) {
      const depositParams = {
        userId: this.props.auth.user.id,
        fees: 0,
        amount: depositAmount,
        referenceNumber: referenceNumber,
        userDepositeRequestId: userDepositeRequestId,
      };
      this.handleSnackbarClose();
      await this.props.updateDepositRequest(depositParams);
      btxBuyDetail["price"] = 0;
      btxBuyDetail["amount"] = 0;
      this.setState({
        userDepositeRequestId: "",
        depositAmount: "",
        paymentStep: 1,
        dasshpePaymentModel: false,
        btxBuyDetail,
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

      this.setState({
        referenceNumber: "",
        userDepositeRequestId: "",
        editDepositRequestModal: false,
        snackMessages: this.props.snackMessages,
      });
    } else {
      const { errors } = this.state;
      errors["referenceNumber"] = "Reference number field is required.";
      this.setState({ errors });
    }
  };

  selectPaymentOption = (type) => {
    if (this.state.depositAmount) {
      let fees = 0;
      if (this.state.btxBuyDetail.coin === "INR") {
        if (parseFloat(this.state.depositAmount) > 999) {
          this.validator.purgeFields();
          this.validator.hideMessages();
          const { paymentDetails } = this.state;
          paymentDetails["paymentOption"] = type;
          if (type === "BankTransfer") {
            fees = 0;
            this.createDepositRequest();
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
            errors: { depositAmount: "Minimum amount to deposit is 1000 INR" },
          });
        }
      } else {
        if (parseFloat(this.state.depositAmount) >= 200) {
          this.validator.purgeFields();
          this.validator.hideMessages();
          const { paymentDetails } = this.state;
          paymentDetails["paymentOption"] = type;
          if (type === "BankTransfer") {
            this.createDepositRequest();
          }
          this.setState({
            paymentOption: type,
            paymentStep: 2,
            paymentDetails,
            fees: fees,
          });
        } else {
          this.setState({
            errors: { depositAmount: "Minimum amount to deposit is 200 AED" },
          });
        }
      }
    } else {
      this.setState({ errors: { depositAmount: "Enter amount to deposit." } });
    }
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
        coin: "INR",
        paymentOption: paymentDetails.paymentOption,
        paymentDetails: paymentDetails,
        paymentType: paymentType,
        fees: this.state.feesAmount,
        productDescription: "BTXCOIN",
      };
      this.dasshpePaymentRequest(data);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
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

  async dasshpePaymentRequest(data) {
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
  }

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

  depositeMethodRender = () => {
    return (
      <div className="deposite withDetails">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card className="dataListCard">
              <CardContent className="identityBoxInfo">
                <Typography variant="h3" className="title">
                  Select Payment Type
                </Typography>
                <Grid container>
                  <Grid item xs={12} md={12}>
                    <TextField
                      error={this.state.errors.depositAmount ? true : false}
                      className="form-control"
                      variant="filled"
                      margin="dense"
                      label="Amount"
                      value={this.state.depositAmount || ""}
                      placeholder={
                        "Enter amount in " + this.state.btxBuyDetail.coin
                      }
                      onChange={this.handleInputChange("depositAmount")}
                      type="number"
                      fullWidth={true}
                      helperText={this.state.errors.depositAmount}
                    />
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Box
                      className="selectBox"
                      onClick={() => this.selectPaymentOption("BankTransfer")}
                    >
                      <img src={bluebankTransfer} alt="" />
                      <div className="TextInfo tooltip">
                        <Typography variant="body1"> Bank Transfer </Typography>
                        {this.state.btxBuyDetail.coin === "INR" ? (
                          <>
                            <Typography variant="h5">
                              {" "}
                              RTGS/NEFT/IMPS{" "}
                            </Typography>
                            <Typography variant="h5">
                              {" "}
                              Deposit time: Upto 30 minutes{" "}
                            </Typography>
                            <Typography variant="h6" className="fees">
                              {" "}
                              Fee: Free{" "}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="h5">
                              {" "}
                              Deposit time: 24 hour{" "}
                            </Typography>
                            <Typography variant="h6" className="fees">
                              {" "}
                              Fee: Free{" "}
                            </Typography>
                          </>
                        )}
                      </div>
                    </Box>
                  </Grid>
                  {this.state.btxBuyDetail.coin === "INR" && (
                    <React.Fragment>
                      <Grid item xs={12} md={6}>
                        <Box
                          className="selectBox"
                          onClick={() => this.selectPaymentOption("DC")}
                        >
                          <img src={blueCard} alt="" />
                          <div className="TextInfo">
                            <Typography variant="body1"> Cards </Typography>
                            <Typography variant="h5">
                              {" "}
                              Credit/Debit Card
                            </Typography>
                            <Typography variant="h5">
                              {" "}
                              Deposit time: Instant{" "}
                            </Typography>
                            <Typography variant="h6" className="fees">
                              {" "}
                              Fees: Free{" "}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          className="selectBox"
                          onClick={() => this.selectPaymentOption("NB")}
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
                            <Typography variant="h6" className="fees">
                              {" "}
                              Fees: Free{" "}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          className="selectBox"
                          onClick={() => this.selectPaymentOption("WL")}
                        >
                          <img src={bluewallet} alt="" />
                          <div className="TextInfo">
                            <Typography variant="body1"> Wallet </Typography>
                            {/* <Typography variant="h5"> RTGS/NEFT/IMPS </Typography> */}
                            <Typography variant="h5">
                              {" "}
                              Deposit time: Instant{" "}
                            </Typography>
                            <Typography variant="h6" className="fees">
                              {" "}
                              Fees: Free{" "}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          className="selectBox"
                          onClick={() => this.selectPaymentOption("UP")}
                        >
                          <img src={blueupi} alt="" />
                          <div className="TextInfo">
                            <Typography variant="body1"> UPI </Typography>
                            {/* <Typography variant="h5"> RTGS/NEFT/IMPS </Typography> */}
                            <Typography variant="h5">
                              {" "}
                              Deposit time: Instant{" "}
                            </Typography>
                            <Typography variant="h6" className="fees">
                              {" "}
                              Fees: Free{" "}
                            </Typography>
                          </div>
                        </Box>
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  };

  paymentMethodRender = () => {
    switch (this.state.paymentOption) {
      case "CC":
      case "DC":
        return (
          <div className="BankTransferBox">
            <div className="title">
              <Typography variant="h2">Payment Details</Typography>

              <Typography variant="h6">
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

                        InputProps={{ endAdornment: this.state.cardTypeIcon }}
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

              <Typography variant="h6">please choose your bank</Typography>
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
              <Typography variant="h2">Choose your Wallet</Typography>

              <Typography variant="h6">please choose your Wallet</Typography>
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

              <ListItem>
                <Typography variant="h5">Account Name:</Typography>

                <Typography variant="h6">
                  {this.props.wallet.userWallet.coin === "INR"
                    ? inrAccountDetail.accountName
                    : aedAccountDetail.accountName}
                </Typography>

                <CopyToClipboard
                  text={
                    this.props.wallet.userWallet.coin === "INR"
                      ? inrAccountDetail.accountName
                      : aedAccountDetail.accountName
                  }
                  onCopy={() => this.onCopy()}
                >
                  <FilterNoneIcon />
                </CopyToClipboard>
              </ListItem>

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
                    ? inrAccountDetail.IFSCCode
                    : aedAccountDetail.IBAN}
                </Typography>

                <CopyToClipboard
                  text={
                    this.props.wallet.userWallet.coin === "INR"
                      ? inrAccountDetail.IFSCCode
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
                  onClick={() => {
                    this.updateDepositRequest();
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

  render() {
    const classes = dashboardMaterialStyles;
    const snackMsg = isEmpty(this.state.snackMessages)
      ? this.props.snackMessages
      : this.state.snackMessages;
    const { referral } = this.props;
    return (
      <React.Fragment>
        <Helmet>
          <title>TrillionBit (BTC) | Cryptocurrency Exchange</title>
          <meta
            name="keywords"
            content="btc, trillionbit coin, btc token, trillionbit token, ico, ieo, trillionbit ieo, cryptocurrency, blockchain, btc india, btc dubai, coinmarketcap, crypto exchange, trading"
          />
          <meta
            name="description"
            content="BTC also known as TrillionBit Coin is the currency of TrillionBit Exchange. It is a utility token that connects enables faster and cheaper payments, low cost trading and free transaction fees. BTX is based on the Ethereum blockchain ERC-20 standard and also support Tron network."
          />
          <meta property="og:url" content="https://www.bitex.com" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="TrillionBit | Cryptocurrency Exchange"
          />
          <meta
            property="og:description"
            content="BTC also known as TrillionBit Coin is the currency of TrillionBit Exchange. It is a utility token that connects enables faster and cheaper payments, low cost trading and free transaction fees. BTX is based on the Ethereum blockchain ERC-20 standard and also support Tron network."
          />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:title"
            content="TrillionBit | Cryptocurrency Exchange"
          />
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

        <div
          className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}
        ></div>

        <div className="paddingTopLandingbody">
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={!isEmpty(snackMsg?.variant) ? true : false}
            autoHideDuration={3000}
            onClose={() => this.handleSnackbarClose()}
          >
            <SnackbarMessage
              onClose={() => this.handleSnackbarClose()}
              variant={!isEmpty(snackMsg?.variant) ? snackMsg.variant : "info"}
              message={
                !isEmpty(snackMsg?.variant)
                  ? snackMsg.message
                  : "snackbarMessage"
              }
            />
          </Snackbar>

          <div className="introSecBg">
            <Container>
              <Grid container>
                <Grid item md={8} xs={12}>
                  <div className="introSec coinSecPadding">
                    <h2 className="title">BTX</h2>
                    <Typography variant="h5" className="subtext">
                      A coin for the TrillionBit Community. BTX connects the
                      ecosystem and enables transactions through a seamless
                      channel. A utility token built to make payments, exchange
                      crypto at lower fees or invest into the Blockchain
                      Technology. 
                    </Typography>

                    <Typography variant="h6" className="subtext">
                      <span> BTX Pre Sale Price: </span>{" "}
                      <label className="badge">
                        {" "}
                        ₹
                        {this.props.wallet.bitexMarket?.last
                          ? parseFloat(
                              this.props.wallet.bitexMarket.last
                            ).toFixed(2)
                          : "10"}{" "}
                      </label>
                      <label className="badge"> $ 0.129 </label>
                      <label className="badge">
                        {this.props.wallet.bitexAedMarket?.last
                          ? parseFloat(
                              this.props.wallet.bitexAedMarket.last
                            ).toFixed(2)
                          : "0.5"}
                        د.إ
                      </label>
                    </Typography>
                    <Typography variant="h6" className="subtext">
                      Pre Sale Ends at <i> 14th JUNE </i>
                    </Typography>

                    <a className="btnLink" href="#buySectionBg">
                      {" "}
                      BUY BTX{" "}
                    </a>
                  </div>
                </Grid>

                <Grid item md={4} xs={12} className="adjPadding">
                  <img src={referImg} alt="log" />

                  <Typography
                    variant="h3"
                    className="subtext btxNotificationBlink"
                  >
                    <a
                      style={{ color: "#f79218" }}
                      className="orange"
                      href="/user-profile?tab=referral"
                    >
                      Refer friends to earn <i> 5% </i>additional BTX
                    </a>
                  </Typography>
                  {this.props.auth.isAuthenticated &&
                    this.props.referral?.referralDetails.referralCode && (
                      <>
                        <Typography className="referralLink" variant="h5">
                          Your Referral Link:
                          <label className="">
                            {` ${
                              window.location.origin +
                              "/register/" +
                              referral.referralDetails.referralCode
                            }   `}
                            <CopyToClipboard
                              text={
                                window.location.origin +
                                "/register/" +
                                referral.referralDetails.referralCode
                              }
                              onCopy={() => this.onCopy()}
                            >
                              <Tooltip title="Copy">
                                <FilterNoneIcon className="title" />
                              </Tooltip>
                            </CopyToClipboard>
                          </label>
                        </Typography>
                        <Typography className="referralLink" variant="h5">
                          Your Referral Code:
                          <label className="">
                            {` ${this.props.referral?.referralDetails.referralCode}   `}
                            <CopyToClipboard
                              text={
                                this.props.referral?.referralDetails
                                  .referralCode
                              }
                              onCopy={() => this.onCopy()}
                            >
                              <Tooltip title="Copy">
                                <FilterNoneIcon className="title" />
                              </Tooltip>
                            </CopyToClipboard>
                          </label>
                        </Typography>
                      </>
                    )}
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="buySectionBg" id="buySectionBg">
            <Container>
              <Grid container>
                <Grid item xs={12}>
                  <div className="introSec">
                    <h3 className="title">Buy BTX</h3>
                    <Typography variant="h5" className="subtext">
                      Buying BTX is easy. Check the list below to find the place
                      that suits you best!
                    </Typography>

                    <Typography variant="h5" className="subtext">
                      <a
                        style={{ color: "#f79218" }}
                        className="orange"
                        href="/user-profile?tab=referral"
                      >
                        Refer friends to earn 5% additional BTX
                      </a>
                    </Typography>
                    {this.props.auth.isAuthenticated &&
                      this.props.referral?.referralDetails.referralCode && (
                        <>
                          <Typography className="subtext" variant="h5">
                            {`Your Referral Link: ${
                              window.location.origin +
                              "/register/" +
                              referral.referralDetails.referralCode
                            }   `}
                            <CopyToClipboard
                              text={
                                window.location.origin +
                                "/register/" +
                                referral.referralDetails.referralCode
                              }
                              onCopy={() => this.onCopy()}
                            >
                              <Tooltip title="Copy">
                                <FilterNoneIcon className="title" />
                              </Tooltip>
                            </CopyToClipboard>
                          </Typography>
                          <Typography className="subtext" variant="h5">
                            {`Your Referral Code: ${this.props.referral?.referralDetails.referralCode}   `}
                            <CopyToClipboard
                              text={
                                this.props.referral?.referralDetails
                                  .referralCode
                              }
                              onCopy={() => this.onCopy()}
                            >
                              <Tooltip title="Copy">
                                <FilterNoneIcon className="title" />
                              </Tooltip>
                            </CopyToClipboard>
                          </Typography>
                        </>
                      )}
                  </div>
                </Grid>
              </Grid>
            </Container>

            <Container>
              <Grid container className="justifyCenter">
                <Grid item xs={12} md={this.props.auth.isAuthenticated ? 6 : 8}>
                  <Card className="btxCoinTab">
                    <CardHeader
                      title={
                        <Tabs
                          scrollButtons="auto"
                          variant="scrollable"
                          onChange={this.handleBuyCoinChange.bind(this)}
                          value={this.state.buyTabValue}
                          textColor="primary"
                          indicatorColor="primary"
                        >
                          <Tab
                            value="BTC"
                            label="BTC"
                            className={classes.tabRoot}
                          />
                          <Tab
                            value="ETH"
                            label="ETH"
                            className={classes.tabRoot}
                          />
                          <Tab
                            value="USDT"
                            label="USDT"
                            className={classes.tabRoot}
                          />
                          {(this.checkUserWalletActive("AED") ||
                            !this.props.auth.isAuthenticated) && (
                            <Tab
                              value="AED"
                              label="AED"
                              className={classes.tabRoot}
                            />
                          )}
                          {(this.checkUserWalletActive("INR") ||
                            !this.props.auth.isAuthenticated) && (
                            <Tab
                              value="INR"
                              label="INR"
                              className={classes.tabRoot}
                            />
                          )}
                        </Tabs>
                      }
                    />

                    <CardContent>
                      {this.state.buyTabValue === "BTC" ? (
                        <div>
                          <div className="form-group">
                            <TextField
                              error={this.state.errors.amount ? true : false}
                              label="Enter Qty"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.amount === 0
                                  ? ""
                                  : this.state.btxBuyDetail.amount
                              }
                              onChange={this.handleChange("amount")}
                              margin="normal"
                              helperText={this.state.errors.amount}
                            />
                            <div className="coinName">
                              <img src={tBtxImg} alt="log" />
                              <span> BTX </span>
                            </div>
                          </div>

                          <div className="form-group">
                            <TextField
                              error={this.state.errors.price ? true : false}
                              label="You pay"
                              name="price"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.price === 0
                                  ? ""
                                  : this.state.btxBuyDetail.price
                              }
                              onChange={this.handleChange("price")}
                              margin="normal"
                              helperText={this.state.errors.price}
                            />
                            <div className="coinName">
                              <img src={coinImg} alt="log" />
                              <span> BTC </span>
                            </div>
                          </div>

                          <div className="textInfo">
                            {this.props.auth.isAuthenticated &&
                            this.state.leftCoinAmount > 0 ? (
                              <>
                                <Typography variant="h5" className="title">
                                  Deposit Address:
                                </Typography>

                                <Typography variant="h4" className="address">
                                  {this.getWalletAddress("BTC")}
                                </Typography>

                                {this.state.leftCoinAmount > 0 ? (
                                  <Typography variant="h5" className="note">
                                    Note: Please deposit{" "}
                                    {this.state.leftCoinAmount}{" "}
                                    {this.state.btxBuyDetail.coin} to this above
                                    address
                                  </Typography>
                                ) : null}
                              </>
                            ) : null}

                            <div className="coinDeatils">
                              <List>
                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will get:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.amount)
                                      ? "0"
                                      : this.state.btxBuyDetail.amount}{" "}
                                    BTX
                                  </Typography>
                                </ListItem>

                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will Pay:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.price)
                                      ? "0"
                                      : this.state.btxBuyDetail.price}{" "}
                                    {this.state.btxBuyDetail.coin}
                                  </Typography>
                                </ListItem>
                              </List>
                            </div>

                            <Button
                              onClick={() => {
                                this.props.auth.isAuthenticated === true
                                  ? this.buyBtxConfirmation("BTC")
                                  : this.redirectToLogin();
                              }}
                              variant="contained"
                              color="primary"
                              fullWidth={true}
                            >
                              {this.props.auth.isAuthenticated === true
                                ? "BUY NOW"
                                : "LOGIN"}
                            </Button>
                          </div>
                        </div>
                      ) : this.state.buyTabValue === "ETH" ? (
                        <div className="">
                          <div className="form-group">
                            <TextField
                              error={this.state.errors.amount ? true : false}
                              label="Enter Qty"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.amount === 0
                                  ? ""
                                  : this.state.btxBuyDetail.amount
                              }
                              onChange={this.handleChange("amount")}
                              margin="normal"
                              helperText={this.state.errors.amount}
                            />
                            <div className="coinName">
                              <img src={tBtxImg} alt="log" />
                              <span> BTX </span>
                            </div>
                          </div>

                          <div className="form-group">
                            <TextField
                              error={this.state.errors.price ? true : false}
                              label="You pay"
                              name="price"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.price === 0
                                  ? ""
                                  : this.state.btxBuyDetail.price
                              }
                              onChange={this.handleChange("price")}
                              margin="normal"
                              helperText={this.state.errors.price}
                            />
                            <div className="coinName">
                              <img src={tEthImg} alt="log" />
                              <span> ETH </span>
                            </div>
                          </div>

                          <div className="textInfo">
                            {this.props.auth.isAuthenticated &&
                            this.state.leftCoinAmount > 0 ? (
                              <>
                                <Typography variant="h5" className="title">
                                  Deposit Address:
                                </Typography>

                                <Typography variant="h4" className="address">
                                  {this.getWalletAddress("ETH")}
                                </Typography>

                                {this.state.leftCoinAmount > 0 ? (
                                  <Typography variant="h5" className="note">
                                    Note: Please deposit{" "}
                                    {this.state.leftCoinAmount}{" "}
                                    {this.state.btxBuyDetail.coin} to this above
                                    address
                                  </Typography>
                                ) : null}
                              </>
                            ) : null}

                            <div className="coinDeatils">
                              <List>
                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will get:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.amount)
                                      ? "0"
                                      : this.state.btxBuyDetail.amount}{" "}
                                    BTX
                                  </Typography>
                                </ListItem>

                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will Pay:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.price)
                                      ? "0"
                                      : this.state.btxBuyDetail.price}{" "}
                                    {this.state.btxBuyDetail.coin}
                                  </Typography>
                                </ListItem>
                              </List>
                            </div>
                            <Button
                              onClick={() => {
                                this.props.auth.isAuthenticated === true
                                  ? this.buyBtxConfirmation("ETH")
                                  : this.props.history.push("/login");
                              }}
                              variant="contained"
                              color="primary"
                              fullWidth={true}
                            >
                              {this.props.auth.isAuthenticated === true
                                ? "BUY NOW"
                                : "LOGIN"}
                            </Button>

                            <Button
                              onClick={() => {
                                if (!this.state.ajaxProcess) {
                                  this.initPayButton();
                                }
                              }}
                              variant="contained"
                              color="primary"
                              fullWidth={true}
                            >
                              {!this.state.ajaxProcess ? (
                                "Buy using Metamask"
                              ) : (
                                <CircularProgress color="inherit" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : this.state.buyTabValue === "USDT" ? (
                        <div className="">
                          <div className="form-group">
                            <TextField
                              error={this.state.errors.amount ? true : false}
                              label="Enter Qty"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.amount === 0
                                  ? ""
                                  : this.state.btxBuyDetail.amount
                              }
                              onChange={this.handleChange("amount")}
                              margin="normal"
                              helperText={this.state.errors.amount}
                            />
                            <div className="coinName">
                              <img src={tBtxImg} alt="log" />
                              <span> BTX </span>
                            </div>
                          </div>

                          <div className="form-group">
                            <TextField
                              error={this.state.errors.price ? true : false}
                              label="You pay"
                              name="price"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.price === 0
                                  ? ""
                                  : this.state.btxBuyDetail.price
                              }
                              onChange={this.handleChange("price")}
                              margin="normal"
                              helperText={this.state.errors.price}
                            />
                            <div className="coinName">
                              <img src={usdtImg} alt="log" />
                              <span> USDT </span>
                            </div>
                          </div>

                          <div className="textInfo">
                            <div className="coinDeatils">
                              <List>
                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will get:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.amount)
                                      ? "0"
                                      : this.state.btxBuyDetail.amount}{" "}
                                    BTX
                                  </Typography>
                                </ListItem>

                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will Pay:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.price)
                                      ? "0"
                                      : this.state.btxBuyDetail.price}{" "}
                                    {this.state.btxBuyDetail.coin}
                                  </Typography>
                                </ListItem>
                              </List>
                            </div>

                            <Button
                              onClick={() => {
                                this.props.auth.isAuthenticated === true
                                  ? this.buyBtxConfirmation("USDT")
                                  : this.props.history.push("/login");
                              }}
                              variant="contained"
                              color="primary"
                              fullWidth={true}
                            >
                              {this.props.auth.isAuthenticated === true
                                ? "BUY NOW"
                                : "LOGIN"}
                            </Button>
                          </div>
                        </div>
                      ) : this.state.buyTabValue === "AED" ? (
                        <div className="">
                          <div className="form-group">
                            <TextField
                              error={this.state.errors.amount ? true : false}
                              label="Enter Qty"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.amount === 0
                                  ? ""
                                  : this.state.btxBuyDetail.amount
                              }
                              onChange={this.handleChange("amount")}
                              margin="normal"
                              helperText={this.state.errors.amount}
                            />
                            <div className="coinName">
                              <img src={tBtxImg} alt="log" />
                              <span> BTX </span>
                            </div>
                          </div>

                          <div className="form-group">
                            <TextField
                              error={this.state.errors.price ? true : false}
                              label="You Pay"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.price === 0
                                  ? ""
                                  : this.state.btxBuyDetail.price
                              }
                              onChange={this.handleChange("price")}
                              margin="normal"
                              helperText={this.state.errors.price}
                            />
                            <div className="coinName">
                              <img src={aedImg} alt="log" />
                              <span> AED </span>
                            </div>
                          </div>

                          <div className="textInfo">
                            <div className="coinDeatils">
                              <List>
                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will get:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.amount)
                                      ? "0"
                                      : this.state.btxBuyDetail.amount}{" "}
                                    BTX
                                  </Typography>
                                </ListItem>

                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will Pay:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.price)
                                      ? "0"
                                      : this.state.btxBuyDetail.price}{" "}
                                    {this.state.btxBuyDetail.coin}
                                  </Typography>
                                </ListItem>
                              </List>
                            </div>
                            <Button
                              onClick={() => {
                                this.props.auth.isAuthenticated === true
                                  ? this.buyBtxConfirmation("AED")
                                  : this.props.history.push("/login");
                              }}
                              variant="contained"
                              color="primary"
                              fullWidth={true}
                            >
                              {this.props.auth.isAuthenticated === true
                                ? "BUY NOW"
                                : "LOGIN"}
                            </Button>
                          </div>
                        </div>
                      ) : this.state.buyTabValue === "INR" ? (
                        <div className="">
                          <div className="form-group">
                            <TextField
                              error={this.state.errors.amount ? true : false}
                              label="Enter Qty"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.amount === 0
                                  ? ""
                                  : this.state.btxBuyDetail.amount
                              }
                              onChange={this.handleChange("amount")}
                              margin="normal"
                              helperText={this.state.errors.amount}
                            />
                            <div className="coinName">
                              <img src={tBtxImg} alt="log" />
                              <span> BTX </span>
                            </div>
                          </div>

                          <div className="form-group">
                            <TextField
                              error={this.state.errors.price ? true : false}
                              label="You Pay"
                              name="amount"
                              variant="filled"
                              fullWidth={true}
                              value={
                                this.state.btxBuyDetail.price === 0
                                  ? ""
                                  : this.state.btxBuyDetail.price
                              }
                              onChange={this.handleChange("price")}
                              margin="normal"
                              helperText={this.state.errors.price}
                            />
                            <div className="coinName">
                              <img src={inrImg} alt="log" />
                              <span> INR </span>
                            </div>
                          </div>

                          <div className="textInfo">
                            <div className="coinDeatils">
                              <List>
                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will get:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.amount)
                                      ? "0"
                                      : this.state.btxBuyDetail.amount}{" "}
                                    BTX
                                  </Typography>
                                </ListItem>

                                <ListItem>
                                  <Typography variant="h6" className="title">
                                    You will Pay:
                                  </Typography>
                                  <Typography variant="h6" className="price">
                                    {isNaN(this.state.btxBuyDetail.price)
                                      ? "0"
                                      : this.state.btxBuyDetail.price}{" "}
                                    {this.state.btxBuyDetail.coin}
                                  </Typography>
                                </ListItem>
                              </List>
                            </div>
                            <Button
                              onClick={() => {
                                this.props.auth.isAuthenticated === true
                                  ? this.buyBtxConfirmation("INR")
                                  : this.props.history.push("/login");
                              }}
                              variant="contained"
                              color="primary"
                              fullWidth={true}
                            >
                              {this.props.auth.isAuthenticated === true
                                ? "BUY NOW"
                                : "LOGIN"}
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="coinBG">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={8} md={8}>
                  <div className="coinSec">
                    <h2 className="title">
                      BTX will be an exchange based token and native currency of
                      TrillionBit Cryptocurrency Exchange. It is a decentralized
                      digital asset based on Ethereum, with a total limited
                      supply of 1 Bn, issued by TrillionBit Group.
                    </h2>

                    <a
                      target="_blank"
                      className="btnLink"
                      href="/whitepaper-btx.pdf"
                    >
                      {" "}
                      Read the Whitepaper{" "}
                    </a>
                  </div>
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <div className="coinIcon">
                    <img src={btxCoin} alt="bitcoin and crypto exchange" />
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="sectionblueBg useCoinSection">
            <Container>
              <Grid container className="justifyCenter">
                <Grid item xs={12} md={10}>
                  <div className="BTXholders">
                    <Grid container>
                      <Grid item xs={12}>
                        <div className="">
                          <Typography variant="h6" className="subtext">
                            BTX holders shall enjoy corresponding benefits of
                            the whole TrillionBit ecosystem and get sub-token
                            rewards, valuable promotion through sustained
                            repurchase and destruction of tokens. A few listed
                            below:
                          </Typography>

                          <div>
                            <ul>
                              <li> 0% trade fees on BTX trading pairs </li>
                              <li> Bounty Programs </li>
                              <li> Trader competiiton rewards </li>
                              <li> Staking rewards </li>
                              <li> Exchange listing and investment rewards </li>
                            </ul>

                            <ul>
                              <li> Promotion campaigns </li>
                              <li> Pre-sale access to BTX at face value </li>
                              <li> Token burning  </li>
                              <li> Investor returns </li>
                            </ul>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Container>

            <Container>
              <Grid container className="justifyCenter">
                <Grid item xs={12} md={10}>
                  <div className="twoBoxTab">
                    <Grid container>
                      <Grid item xs={12} md={6}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Technical Overview
                          </Typography>

                          <div>
                            <ul>
                              <li> Total Supply: 1,000,000,000 </li>
                              <li> Token type: ERC20 </li>
                              <li> Token Symbol: BTX </li>
                              <li> Token Name: TrillionBit Coin </li>
                              <li> Burnable token </li>
                            </ul>
                          </div>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Credit card payments
                          </Typography>

                          <div>
                            <ul>
                              <li> Total Supply: 1,000,000,000 </li>
                              <li> Token type: ERC20 </li>
                              <li> Token Symbol: BTX </li>
                              <li> Token Name: TrillionBit Coin </li>
                              <li> Burnable token </li>
                            </ul>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="sectionblueBg useCoinSection">
            <Container>
              <Grid container>
                <Grid item xs={12}>
                  <div className="introSec">
                    <h3 className="title">USE BTX</h3>
                  </div>
                </Grid>
              </Grid>
            </Container>

            <Container>
              <Grid container className="justifyCenter">
                <Grid item xs={12} md={10}>
                  <div className="btxCoinTab">
                    <Grid container>
                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Trading
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            BTX can be traded for other cryptocurrencies on
                            various exchanges, depending on the restrictions set
                            by the exchange.
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Credit card payments
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            BTX can be the form of payment for crypto credit
                            cards.
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Payment processing
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            Merchants can offer BTX as a means of payment for
                            customers, offering more flexibility in payment
                            methods.
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Booking travel arrangements
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            BTX can be used to book hotels and flights on select
                            websites.
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Entertainment
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            From paying for virtual gifts to buying lottery
                            tickets, BTX serves several purposes in the
                            entertainment space.
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Investment
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            Several platforms will allow investors to invest in
                            stocks, ETFs, and other assets using BTX.
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <div className="useWrapBox">
                          <Typography variant="h3" className="subtext">
                            Loans and transfers
                          </Typography>

                          <Typography variant="h6" className="subtext">
                            BTX can be used as collateral for loans on certain
                            platforms. Also, there are apps that allow users to
                            split bills and pay friends and family through
                            Trillionbit Coin.
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="coinBG launchDateSection">
            <Container>
              <Grid container>
                <Grid item xs={12}>
                  <div className="introSec">
                    <h3 className="title">Launch Date</h3>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div id="app" className="container">
                    <div className="swiper-container">
                      <div className="swiper-wrapper timeline">
                        <div className="swiper-slide">
                          <div className="timestamp">
                            <span className="date"> Phase 1 </span>
                          </div>
                          <div className="status done">
                            <span>
                              {" "}
                              TrillionBit Exchange Launch <br /> 26 Nov, 2018{" "}
                            </span>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="timestamp">
                            <span className="date"> Phase 2 </span>
                          </div>
                          <div className="status done">
                            <span>
                              BTX Pre-sale Round one <br /> 14th May 2021{" "}
                            </span>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="timestamp">
                            <span className="date"> Phase 3 </span>
                          </div>
                          <div className="status done">
                            <span>
                              {" "}
                              BTX Listing on Exchange <br /> 14th June 2021{" "}
                            </span>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="timestamp">
                            <span className="date"> Phase 4 </span>
                          </div>
                          <div className="status">
                            <span>
                              {" "}
                              BTX Public Sale Round two <br /> 4th Aug 2021{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>

        <Dialog
          maxWidth="lg"
          className="Enable2FAsection"
          open={this.state.btxBuyModal}
          onClose={() => this.setState({ btxBuyModal: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Buy BTX </DialogTitle>
          <DialogContent>
            <div className="deposite">
              <Grid container>
                <Grid item xs={12} md={12}>
                  <Card className="dataListCard">
                    <CardContent>
                      <div className="address">
                        <div className="details">
                          <Typography variant="h5" className="">
                            {this.state.btxBuyDetail.coin} Address
                          </Typography>

                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: 500 }}
                            className=""
                          >
                            {this.state.walletAddress}
                          </Typography>
                        </div>

                        <div className="barcode">
                          <img
                            alt=""
                            src={
                              "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" +
                              this.state.walletAddress
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ btxBuyModal: false })}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => this.setState({ btxBuyModal: false })}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          maxWidth="md"
          className="Enable2FAsection"
          open={this.state.btxBuyConfirmModal}
          onClose={() => this.setState({ btxBuyConfirmModal: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Buy BTX </DialogTitle>
          <DialogContent>
            <div className="deposite">
              <Grid container>
                <Grid item xs={12} md={12}>
                  <Card className="dataListCard">
                    <CardContent>
                      <div className="address">
                        <div className="details">
                          {this.state.buyBtxConfirmation ? (
                            <>
                              <Typography variant="h5" className="">
                                {`Are you sure?
                                                        `}
                              </Typography>
                              <Typography variant="h5" className="">
                                {`
                                                        You are going to buy ${parseFloat(
                                                          this.state
                                                            .btxBuyDetail.amount
                                                        ).toFixed(
                                                          3
                                                        )} BTX with ${
                                  this.state.btxBuyDetail.price
                                } ${this.state.btxBuyDetail.coin}`}
                              </Typography>
                            </>
                          ) : (
                            <>
                              {this.state.btxBuyDetail.coin === "INR" ||
                              this.state.btxBuyDetail.coin === "AED" ? (
                                <Typography variant="h5" className="">
                                  {`You have to deposit ${parseFloat(
                                    this.state.leftCoinAmount
                                  )?.toFixed(2)} ${
                                    this.state.btxBuyDetail.coin
                                  } in order to buy ${parseFloat(
                                    this.state.btxBuyDetail.amount
                                  ).toFixed(3)} BTX.`}
                                </Typography>
                              ) : (
                                <Typography variant="h5" className="">
                                  {`Please transfer more ${
                                    this.state.btxBuyDetail.coin
                                  } in order to buy ${parseFloat(
                                    this.state.btxBuyDetail.amount
                                  ).toFixed(3)} BTX`}
                                </Typography>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.handleLeftAmountModel}
              variant="contained"
              color="secondary"
            >
              {this.state.buyBtxConfirmation ? "Cancel" : "Deposit"}
            </Button>
            {this.state.buyBtxConfirmation ? (
              <Button
                onClick={this.buyBtxCoin}
                variant="contained"
                color="primary"
              >
                Buy
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>

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
              Back
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
              onClick={() => this.setState({ editDepositRequestModal: false })}
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
          className="Enable2FAsection"
          open={this.state.dasshpePaymentModel}
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          fullWidth={true}
          onClose={() => this.setState({ dasshpePaymentModel: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.paymentStep === 2 ? (
              <Link
                onClick={() => {
                  this.setState({ paymentStep: 1 });
                  this.validator.purgeFields();
                }}
                className="backLink"
              >
                <ArrowBackIosIcon />
                Back
              </Link>
            ) : (
              "PAYMENT"
            )}
          </DialogTitle>
          <DialogContent>
            {this.state.paymentStep === 1
              ? this.depositeMethodRender()
              : this.paymentMethodRender()}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => this.setState({ dasshpePaymentModel: false })}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

BtxCoin.propTypes = {
  auth: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  subscribeToNewsletter: PropTypes.func.isRequired,
  getChartData: PropTypes.func.isRequired,
  getMarketStatusToday: PropTypes.func.isRequired,
  getAvailaleMarkets: PropTypes.func.isRequired,
  getMarketLast: PropTypes.func.isRequired,
  sendBtxForEth: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  trading: state.trading,
  wallet: state.wallet,
  snackMessages: state.snackMessages,
  referral: state.referral,
});

const dashboardMaterialStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: red[500],
  },
  card: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default connect(mapStateToProp, {
  subscribeToNewsletter,
  getChartData,
  getMarketStatusToday,
  getAvailaleMarkets,
  getMarketLast,
  getActiveAssets,
  buyBtxCoin,
  clearSnackMessages,
  getUsdtInrPrice,
  sendBtxForEth,
  createDepositRequest,
  updateDepositRequest,
  dasshpePaymentRequest,
  checkPaymentStatus,
  editDepositRequest,
  getReferral,
  getBtxMarketData,
  getBtxAedMarketData,
  setLastLoginRedirectedLink,
})(withStyles(themeStyles)(BtxCoin));
