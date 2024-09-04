import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { withStyles } from "@mui/styles";
import { Container, Grid } from "@mui/material";

import {
  List,
  ListItem,
  Typography,
  Tab,
  Tabs,
  Backdrop,
} from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";
import { clearSnackMessages } from "../../actions/messageActions";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";

import themeStyles from "../../assets/themeStyles";

import {
  getBitexSavingPlans,
  getUserBitexSavingWallet,
  transferCoin,
  getTransferHistory,
  transferCoinMainWallet,
  daysChangeDemo,
  validateTransferCoinMainWallet,
  getBitexSavingAmount,
} from "../../actions/BitexSavingActions";

import { getActiveAssets, getMarketLast } from "../../actions/walletActions";

import { setLastLoginRedirectedLink } from "../../actions/authActions";

import isEmpty from "../../validation/isEmpty";

import tbtcImg from "../../assets/img/coins/tbtc.webp";
import tEthImg from "../../assets/img/coins/teth.webp";
import usdtImg from "../../assets/img/coins/usdt.webp";
import ltctImg from "../../assets/img/coins/tltc.webp";
import xrptImg from "../../assets/img/coins/txrp.webp";
import trxtImg from "../../assets/img/coins/trx.webp";
import btxImg from "../../assets/img/coins/btx.webp";

import logintosee from "../../assets/img/logintosee.webp";

import "../../assets/css/home.css";
import LendingTransferModel from "./LendingTransferModal";

const moment = require("moment");

export class Lending extends Component {
  state = {
    tabValue: "wallet",
    value: "",
    anchorEl: null,
    anchorCurrencyEl: null,
    transferDialog: false,
    ajaxProcess: false,
    bitexSavingCoinOperation: [],
    selectTransfer: {
      coin: "BTC",
      amount: "",
      interestAmount: "",
      totalAmount: "",
      modal: false,
      errors: {},
    },

    transferRedeemDetails: {
      modal: false,
      annualizedInterestRate: "",
      bitexSavingUserWalletHistoryId: "",
      coin: "",
      days: "",
      lockDay: "",
      amount: "",
      interestAmount: "",
      totalAmount: "",
    },
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    await this.props.getBitexSavingPlans();
    // const nkks = await this.props.daysChangeDemo();
    await this.props.getBitexSavingAmount();
    // console.log(nkks);
    await this.props.getMarketLast();
    if (this.props.auth.isAuthenticated && this.props.auth?.user.id) {
      this.props.getActiveAssets(this.props.auth.user.id);
      this.props.getUserBitexSavingWallet(this.props.auth.user.id);
      this.props.getTransferHistory(this.props.auth.user.id);
    }
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
    this.setState({ snackMessages: {} });
  };

  noPropagation = (e) => {
    e.stopPropagation();
    this.props.setLastLoginRedirectedLink(`/lending`);
    this.props.history.push("/login");
  };

  redirectToLogin = () => {
    this.props.setLastLoginRedirectedLink(`/lending`);
    this.props.history.push("/login");
  };

  coinAmountCalculation = (amount) => {
    const { selectTransfer, bitexSavingCoinOperation } = this.state;
    const bitexSavingCurrentCoin =
      bitexSavingCoinOperation[this.state.selectTransfer.coin];
    selectTransfer["amount"] = amount;
    selectTransfer["interestAmount"] = (
      (parseFloat(bitexSavingCurrentCoin.currentCoinDayInterestRate) / 100) *
      parseFloat(selectTransfer["amount"])
    ).toFixed(6);
    selectTransfer["totalAmount"] = (
      parseFloat(selectTransfer["amount"]) +
      parseFloat(selectTransfer["interestAmount"])
    ).toFixed(6);

    return selectTransfer;
  };

  getUserSelectedMainWallet = (coin) => {
    const userAssets = this.props.userAssets;
    if (!isEmpty(userAssets)) {
      return userAssets.find((element) => coin === element.coin);
    }
    return null;
  };

  getCoinLastAmountInUsd = (coin) => {
    let lastValue = 0;
    coin = coin === "BTX" ? `BTXUSDT` : `${coin}USD`;
    if (!isEmpty(this.props.marketLasts[coin]?.["last"])) {
      lastValue = this.props.marketLasts[coin]["last"];
    }
    return lastValue;
  };

  handleInputChange = (event) => {
    if (event.target.name === "amount") {
      const onlyNumberInput = /^[+-]?\d*(?:[.,]\d*)?$/;
      const val = onlyNumberInput.test(event.target.value)
        ? event.target.value
        : this.state.selectTransfer.amount;
      const selectTransfer = this.coinAmountCalculation(isNaN(val) ? 0 : val);
      selectTransfer.errors[event.target.name] = "";
      this.setState({ selectTransfer });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  handleChange = (event, newValue) => {
    if (this.props.auth.isAuthenticated && this.props.auth?.user.id) {
      this.props.getTransferHistory(this.props.auth.user.id);
      this.props.getActiveAssets(this.props.auth.user.id);
    }
    this.setState({ tabValue: newValue });
  };

  handleCloseTransferDialog = () => {
    const { selectTransfer } = this.state;
    selectTransfer["modal"] = false;
    selectTransfer["amount"] = "";
    selectTransfer["interestAmount"] = "";
    selectTransfer["totalAmount"] = "";
    this.setState({ selectTransfer });
  };

  coinCurrentDayInterest = (interestRate, numberOfDays) => {
    return (
      (parseFloat(interestRate) / 365) *
      parseFloat(numberOfDays)
    ).toFixed(2);
  };

  getCoinInterestRate = (coin, numberOfDays) => {
    const coinData = this.props.bitexSaving.bitexSavingPlans.find(
      (plan) => plan.coin === coin
    );
    if (!isEmpty(coinData)) {
      const day = coinData.days.find(
        (day) => day.numberOfDays === numberOfDays
      );
      return day.interestRate;
    }
    return "-";
  };

  changeInterestRate = (coin, numberOfDays) => {
    const bitexSavingCoinOperation = this.state.bitexSavingCoinOperation;
    if (isEmpty(bitexSavingCoinOperation[coin])) {
      const coinData = this.props.bitexSaving.bitexSavingPlans.find(
        (plan) => plan.coin === coin
      );
      bitexSavingCoinOperation[coin] = {
        coinData: coinData,
        currentCoinInterestRate: "",
        currentCoinDay: numberOfDays,
        currentCoinDayInterestRate: "",
      };
    }
    const dayData = bitexSavingCoinOperation[coin]["coinData"].days.find(
      (day) => day.numberOfDays === numberOfDays
    );
    bitexSavingCoinOperation[coin]["currentCoinInterestRate"] =
      dayData.interestRate;
    bitexSavingCoinOperation[coin]["currentCoinDay"] = dayData.numberOfDays;
    bitexSavingCoinOperation[coin]["currentCoinDayInterestRate"] =
      this.coinCurrentDayInterest(dayData.interestRate, dayData.numberOfDays);
    if (!isEmpty(this.state.selectTransfer.amount)) {
      const selectTransfer = this.coinAmountCalculation(
        this.state.selectTransfer.amount
      );
      this.setState({ selectTransfer });
    }
    this.setState({
      bitexSavingCoinOperation,
    });
  };

  checkBitexSavingCoinOperation = (coin) => {
    const { bitexSavingCoinOperation, selectTransfer } = this.state;
    if (!isEmpty(bitexSavingCoinOperation[coin]?.["currentCoinDay"])) {
      this.changeInterestRate(
        coin,
        bitexSavingCoinOperation[coin]["currentCoinDay"]
      );
    } else {
      const coinData = this.props.bitexSaving.bitexSavingPlans.find(
        (plan) => plan.coin === coin
      );
      this.changeInterestRate(
        coin,
        coinData.days[coinData.days.length - 1]["numberOfDays"]
      );
    }
    selectTransfer["coin"] = coin;
    selectTransfer["modal"] = true;

    this.setState({ selectTransfer });
  };

  coinImageSelector = (coin) => {
    switch (coin) {
      case "BTC":
        return tbtcImg;
      case "ETH":
        return tEthImg;
      case "USDT":
        return usdtImg;
      case "LTC":
        return ltctImg;
      case "XRP":
        return xrptImg;
      case "TRX":
        return trxtImg;
      case "BTX":
        return btxImg;
      default:
        return btxImg;
    }
  };

  handleTransferCoin = async () => {
    const { selectTransfer, bitexSavingCoinOperation } = this.state;
    selectTransfer.errors["amount"] = isEmpty(this.state.selectTransfer.amount)
      ? "Field is required"
      : "";

    if (!isEmpty(selectTransfer.errors["amount"])) {
      this.setState({ selectTransfer });
    } else {
      selectTransfer["modal"] = false;
      this.setState({ ajaxProcess: true, selectTransfer });
      let redemptionDay =
        bitexSavingCoinOperation[this.state.selectTransfer.coin][
          "currentCoinDay"
        ];
      let redemptionDate = moment()
        .add({ days: redemptionDay })
        .format("DD-MM-YYYY");
      let usdPrice = this.getCoinLastAmountInUsd(
        this.state.selectTransfer.coin
      );
      usdPrice =
        parseFloat(usdPrice) * parseFloat(this.state.selectTransfer.amount);
      const data = {
        coin: this.state.selectTransfer.coin,
        userId: this.props.auth.user.id,
        annualizedInterestRate:
          bitexSavingCoinOperation[this.state.selectTransfer.coin][
            "currentCoinInterestRate"
          ],
        durationDay: redemptionDay,
        redemptionDate: redemptionDate,
        interestAmount: this.state.selectTransfer.interestAmount,
        totalAmount: this.state.selectTransfer.totalAmount,
        amount: this.state.selectTransfer.amount,
        usdPrice: usdPrice,
      };
      const response = await this.props.transferCoin(data);
      if (response?.variant === "success") {
        this.props.getTransferHistory(this.props.auth.user.id);
        this.props.getActiveAssets(this.props.auth.user.id);
        this.props.getBitexSavingAmount();
        selectTransfer["coin"] = "BTC";
        selectTransfer["amount"] = "";
        selectTransfer["interestAmount"] = "";
        selectTransfer["totalAmount"] = "";
        selectTransfer["modal"] = false;
        selectTransfer["errors"] = {};
        this.setState({
          snackMessages: response,
          selectTransfer,
          ajaxProcess: false,
        });
      } else {
        selectTransfer["modal"] = false;
        this.setState({
          snackMessages: response,
          selectTransfer,
          ajaxProcess: false,
        });
      }
    }
  };

  handleTransferRedeemDetailModel = async () => {
    const { transferRedeemDetails } = this.state;
    transferRedeemDetails["modal"] = !transferRedeemDetails.modal;
    this.setState({ transferRedeemDetails });
  };

  validateTransferCoinMainWallet = async (bitexSavingUserWalletHistoryId) => {
    const data = {
      bitexSavingUserWalletHistoryId: bitexSavingUserWalletHistoryId,
      userId: this.props.auth.user.id,
    };
    const response = await this.props.validateTransferCoinMainWallet(data);
    if (response?.variant === "success") {
      let { transferRedeemDetails } = this.state;
      transferRedeemDetails = { ...transferRedeemDetails, ...response.data };
      transferRedeemDetails["modal"] = true;
      this.setState({ transferRedeemDetails, ajaxProcess: false });
    } else {
      this.setState({
        snackMessages: response,
        ajaxProcess: false,
      });
    }
  };

  handleTransferCoinMainWallet = async () => {
    let { transferRedeemDetails } = this.state;
    transferRedeemDetails["modal"] = false;
    this.setState({ ajaxProcess: true, transferRedeemDetails });
    const bitexSavingUserWalletHistoryId =
      this.state.transferRedeemDetails.bitexSavingUserWalletHistoryId;
    if (isEmpty(bitexSavingUserWalletHistoryId)) {
      // this.setState({selectTransfer});
    } else {
      const data = {
        bitexSavingUserWalletHistoryId: bitexSavingUserWalletHistoryId,
        userId: this.props.auth.user.id,
      };

      const response = await this.props.transferCoinMainWallet(data);
      if (response?.variant === "success") {
        let { transferRedeemDetails } = this.state;
        transferRedeemDetails["modal"] = false;
        this.props.getTransferHistory(this.props.auth.user.id);
        this.setState({
          snackMessages: response,
          transferRedeemDetails,
          ajaxProcess: false,
        });
      } else {
        this.setState({
          snackMessages: response,
          ajaxProcess: false,
        });
      }
    }
  };

  diffrenceInTwoDate = (createdAt) => {
    const now = moment();
    const date = moment(createdAt);
    return now.diff(date, "days");
  };

  checkActiveSelectButton = (coin, day, index, totalLength = null) => {
    return this.state.bitexSavingCoinOperation[coin]?.currentCoinDay &&
      this.state.bitexSavingCoinOperation[coin].currentCoinDay ===
        day.numberOfDays
      ? "btn active"
      : index === totalLength - 1 &&
        this.state.bitexSavingCoinOperation[coin]?.currentCoinDay === undefined
      ? "btn active"
      : "btn";
  };

  renderBitexSavingCoins = () => {
    return this.props.bitexSaving.bitexSavingPlans.map((data) => (
      <ListItem key={data.coin} className="bodyRow">
        <div className="td">
          <img src={this.coinImageSelector(data.coin)} alt="TrillionBit" />
          <div className="coinName">
            <Typography variant="body2" className="">
              {data.coin}
              <span className="shortForm"> {data.name} </span>
            </Typography>
          </div>
        </div>

        <div className="td green">
          <Typography variant="body2" className="">
            {!isEmpty(this.state.bitexSavingCoinOperation[data.coin])
              ? this.state.bitexSavingCoinOperation[data.coin][
                  "currentCoinInterestRate"
                ]
              : data.days[data.days.length - 1]?.interestRate}
          </Typography>
        </div>

        <div className="td">
          <div className="daysBox">
            {data.days.map((day, index) => (
              <button
                key={`${data.coin}${day.numberOfDays}`}
                onClick={() =>
                  this.changeInterestRate(data.coin, day.numberOfDays)
                }
                data-bn-type="button"
                className={this.checkActiveSelectButton(
                  data.coin,
                  day,
                  index,
                  data.days.length
                )}
              >
                {day.numberOfDays}
              </button>
            ))}
          </div>
        </div>

        <div className="td">
          <Typography component="div" variant="body2" className="">
            {!isEmpty(
              this.state.bitexSavingCoinOperation[data.coin]?.[
                "currentCoinDayInterestRate"
              ]
            )
              ? this.state.bitexSavingCoinOperation[data.coin][
                  "currentCoinDayInterestRate"
                ]
              : this.coinCurrentDayInterest(
                  data.days[data.days.length - 1]?.interestRate,
                  data.days[data.days.length - 1]?.numberOfDays
                )}
            {` ${data.coin}`}
          </Typography>
        </div>

        <div className="td">
          <Link
            to={"#"}
            onClick={() => {
              this.props.auth.isAuthenticated
                ? this.checkBitexSavingCoinOperation(data.coin)
                : this.redirectToLogin();
            }}
            className="buyNow"
          >
            {this.props.auth.isAuthenticated ? "Transfer" : "Login"}
          </Link>
        </div>
      </ListItem>
    ));
  };

  render() {
    const snackMsg = isEmpty(this.state.snackMessages)
      ? this.props.snackMessages
      : this.state.snackMessages;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <title>
            Trillionbit - Buy and Sell Bitcoin and Crypto | Ethereum Trading
          </title>
          <meta
            name="description"
            content="Trillionbit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta property="og:url" content="https://www.bitex.com" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Trillionbit | Cryptocurrency Exchange"
          />
          <meta
            property="og:description"
            content="A leading cryptocurrency exchange and multi-signature wallet platform to buy and sell Bitcoin, Ethereum, XRP, Litecoin and Bitcoin Cash."
          />
          <meta property="og:site_name" content="Trillionbit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:title"
            content="TrillionBit | Cryptocurrency Exchange"
          />
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
          open={this.state.ajaxProcess ? true : false}
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

          <div className="slider">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={6} md={6} lg={5} className="">
                  <div className="slideText">
                    <Typography variant="h1" className="">
                      Trillionbit Savings
                    </Typography>
                    <Typography variant="body1" className="subtext">
                      The simple way to Lend & Earn.
                    </Typography>

                    <Typography variant="h5" className="subtext marginT25">
                      Total Amount Lent:{" "}
                      <b>
                        $
                        {!isEmpty(
                          this.props.bitexSaving.bitexLendAmount
                            ?.totalLendAmount
                        )
                          ? parseFloat(
                              this.props.bitexSaving.bitexLendAmount
                                .totalLendAmount
                            ).toFixed(3)
                          : "785600.00"}
                      </b>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="bgblueSaving">
            <Container>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <Tabs
                    scrollButtons="auto"
                    variant="scrollable"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.tabValue}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab value="wallet" label="Lending" />
                    <Tab value="exchange" label="history" />
                  </Tabs>
                </Grid>
              </Grid>
            </Container>
          </div>
          <div className="bg-white">
            <Container>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <div className="savingTabBox">
                    <div>
                      {this.state.tabValue === "wallet" ? (
                        <Container>
                          <Grid container>
                            <Grid item xs={12} md={12}>
                              <div className="tableTitle">
                                <Typography variant="h3" className="">
                                  Locked Savings{" "}
                                  <span>
                                    {" "}
                                    Flexible deposits, higher profits{" "}
                                  </span>
                                </Typography>
                              </div>
                              <div className="tableResponsive savingsTable">
                                <div className="table">
                                  <List className="dataTable">
                                    <ListItem className="headRow">
                                      <div className="td">
                                        <Typography
                                          variant="body2"
                                          className=""
                                        >
                                          Coin
                                        </Typography>
                                      </div>
                                      <div className="td">
                                        <Typography
                                          variant="body2"
                                          className=""
                                        >
                                          Annualized Interest Rate
                                        </Typography>
                                      </div>
                                      <div className="td">
                                        <Typography
                                          variant="body2"
                                          className=""
                                        >
                                          Duration (days)
                                        </Typography>
                                      </div>
                                      <div className="td">
                                        <Typography
                                          variant="body2"
                                          className=""
                                        >
                                          Interest Per Lot
                                        </Typography>
                                      </div>
                                      <div className="td">
                                        <Typography
                                          variant="body2"
                                          className=""
                                        ></Typography>
                                      </div>
                                    </ListItem>
                                    {this.renderBitexSavingCoins()}
                                  </List>
                                </div>
                              </div>
                            </Grid>
                          </Grid>

                          <Grid container>
                            <Grid item xs={12} md={12}>
                              <div className="tableTitle">
                                <Typography variant="h3" className="">
                                  FAQ
                                </Typography>
                              </div>
                              <div className="faqAccordion">
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Typography className="">
                                      {" "}
                                      1. What are Locked Savings?{" "}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      Committed to holding your crypto? Now you
                                      can earn interest at the same time!
                                      Subscribe your crypto to locked savings
                                      periods for higher interest earnings.
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                  >
                                    <Typography className="">
                                      {" "}
                                      2. What happens to my funds on the day I
                                      subscribe to a Locked Savings product?{" "}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      On the day of subscription, Trillionbit
                                      Savings will deduct the funds for
                                      subscription from your exchange wallet.
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                  >
                                    <Typography className="">
                                      {" "}
                                      3. What happens to my funds on the value
                                      date of a Locked Savings product?{" "}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      On the value date, Trillionbit Savings
                                      will distribute the Locked Savings product
                                      to your savings wallet, and your saving
                                      product will start to accrue interest.
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                  >
                                    <Typography className="">
                                      {" "}
                                      4. What happens to my funds on the
                                      redemption date of a Locked Savings
                                      product?{" "}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography>
                                      On the redemption date, you will see both
                                      the initial tokens committed to the
                                      subscription and the interest accrued in
                                      your Trillionbit account ‘balances’. This
                                      process will be automatic.
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                              </div>
                            </Grid>
                          </Grid>
                        </Container>
                      ) : (
                        <div className="exchangeData">
                          {!this.props.auth.isAuthenticated && (
                            <div className="pleaseLogin">
                              <div className="loginBox">
                                <img src={logintosee} alt="bitexlogin" />

                                <Typography variant="h3" className="">
                                  Please login to see details
                                </Typography>

                                <Link
                                  to="/login"
                                  onClick={this.noPropagation}
                                  className="firstLogin"
                                >
                                  Login
                                </Link>
                              </div>
                            </div>
                          )}
                          <div className="afterLogin">
                            <Container>
                              <Grid container>
                                <Grid item xs={12} md={12}>
                                  {/* <div>
                                            <List className="valueData">
                                                <ListItem className="amountList">
                                                    <Typography variant="h6" className="">
                                                        Estimated Value  
                                                    </Typography>
                                                    <Typography variant="h2" className="">
                                                        0.01470100 <span> BTC  <span className="gray">  $99.87 </span>  </span>
                                                    </Typography>
                                                </ListItem>

                                                <ListItem className="amountList">
                                                    <Typography variant="h6" className="">
                                                        Estimated Value  
                                                    </Typography>
                                                    <Typography variant="h2" className="">
                                                        0.01470100 <span> BTC  <span className="gray">  $99.87 </span>  </span>
                                                    </Typography>
                                                </ListItem>

                                                <ListItem className="amountList">
                                                    <Typography variant="h6" className="">
                                                        Estimated Value  
                                                    </Typography>
                                                    <Typography variant="h2" className="">
                                                        0.01470100 <span> BTC  <span className="gray">  $99.87 </span>  </span>
                                                    </Typography>
                                                </ListItem>

                                               
                                            </List>
                                            </div> */}

                                  {this.props.auth.isAuthenticated && (
                                    <div className="tableResponsive">
                                      <div className="table fixedDeposits">
                                        <List className="dataTable">
                                          <ListItem className="headRow">
                                            {/* <div className="td">
                                                                <Typography variant="body2" className="">
                                                                    Fixed Deposits
                                                                </Typography>
                                                            </div> */}
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Coin
                                              </Typography>
                                            </div>
                                            {/* <div className="td">
                                                                <Typography variant="body2" className="">
                                                                    Holding (Lot)
                                                                </Typography>
                                                            </div> */}
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Amount
                                              </Typography>
                                            </div>
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Lock Duration (days)
                                              </Typography>
                                            </div>
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Duration (days)
                                              </Typography>
                                            </div>
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Annualized Interest Rate
                                              </Typography>
                                            </div>

                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Value Date
                                              </Typography>
                                            </div>
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Redemption Date
                                              </Typography>
                                            </div>
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Interest
                                              </Typography>
                                            </div>
                                            <div className="td">
                                              <Typography
                                                variant="body2"
                                                className=""
                                              >
                                                Operation
                                              </Typography>
                                            </div>
                                          </ListItem>

                                          {this.props.bitexSaving
                                            ?.bitexTransferHistory &&
                                            this.props.bitexSaving.bitexTransferHistory.map(
                                              (data) => (
                                                <ListItem
                                                  key={data._id}
                                                  className="bodyRow"
                                                >
                                                  <div className="td green">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {data.coin}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {data.amount}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {data.lockDay}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {this.diffrenceInTwoDate(
                                                        data.createdAt
                                                      )}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {this.getCoinInterestRate(
                                                        data.coin,
                                                        data.lockDay
                                                      )}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {moment(
                                                        data.createdAt
                                                      ).format("DD-MM-YYYY")}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {moment(
                                                        data.redemptionDate
                                                      ).format("DD-MM-YYYY")}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    <Typography
                                                      variant="body2"
                                                      className=""
                                                    >
                                                      {data.interestAmount}
                                                    </Typography>
                                                  </div>

                                                  <div className="td">
                                                    {data.status ===
                                                    "transfer" ? (
                                                      <Link
                                                        onClick={() =>
                                                          this.validateTransferCoinMainWallet(
                                                            data._id
                                                          )
                                                        }
                                                        to={"#"}
                                                        className="buyNow"
                                                      >
                                                        {data.status ===
                                                        "transfer"
                                                          ? "Transfer"
                                                          : "Finished"}
                                                      </Link>
                                                    ) : (
                                                      <Typography
                                                        variant="body2"
                                                        className=""
                                                      >
                                                        {"Finished"}
                                                      </Typography>
                                                    )}
                                                  </div>
                                                </ListItem>
                                              )
                                            )}

                                          {isEmpty(
                                            this.props.bitexSaving
                                              ?.bitexTransferHistory
                                          ) && (
                                            <ListItem>
                                              <div className="">
                                                <Typography
                                                  variant="body2"
                                                  className=""
                                                >
                                                  {"No history found."}
                                                </Typography>
                                              </div>
                                            </ListItem>
                                          )}
                                        </List>
                                      </div>
                                    </div>
                                  )}
                                </Grid>
                              </Grid>
                            </Container>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Container>

            <LendingTransferModel
              selectTransfer={this.state.selectTransfer}
              coin={
                this.state.bitexSavingCoinOperation[
                  this.state.selectTransfer.coin
                ]
              }
              coinImg={this.coinImageSelector(this.state.selectTransfer.coin)}
              handleCloseTransferDialog={this.handleCloseTransferDialog}
              changeInterestRate={this.changeInterestRate}
              checkActiveSelectButton={this.checkActiveSelectButton}
              handleInputChange={this.handleInputChange}
              userMainWallet={this.getUserSelectedMainWallet(
                this.state.selectTransfer.coin
              )}
              handleTransferCoin={this.handleTransferCoin}
            />
            {this.state.transferRedeemDetails.modal && (
              <Dialog
                className="transferDialog"
                open={this.state.transferRedeemDetails.modal}
                onClose={this.handleTransferRedeemDetailModel}
                aria-labelledby="form-dialog-title"
                disableBackdropClick={true}
                fullWidth={true}
                disableEnforceFocus={true}
              >
                <DialogTitle id="customized-dialog-title">
                  <div className="coinBox">
                    <img
                      src={this.coinImageSelector(
                        this.state.transferRedeemDetails.coin
                      )}
                      alt="TrillionBit"
                    />
                    <div className="coinName">
                      <Typography variant="h6" className="">
                        {"Transfer Details"}
                      </Typography>
                    </div>
                  </div>
                </DialogTitle>

                <DialogContent dividers className="body">
                  <div className="coinName">
                    <Typography variant="h5">
                      Amount:{" "}
                      <strong>
                        {" "}
                        {this.state.transferRedeemDetails.amount}{" "}
                        {this.state.transferRedeemDetails.coin}{" "}
                      </strong>
                    </Typography>
                  </div>
                  <div className="coinName">
                    <Typography variant="h5">
                      Annualized Interest Rate:{" "}
                      <strong>
                        {" "}
                        {
                          this.state.transferRedeemDetails
                            .annualizedInterestRate
                        }{" "}
                        %
                      </strong>
                    </Typography>
                  </div>
                  <div className="coinName">
                    <Typography variant="h5">
                      Lock Days:{" "}
                      <strong>
                        {" "}
                        {this.state.transferRedeemDetails.lockDay} Days
                      </strong>
                    </Typography>
                  </div>
                  <div className="coinName">
                    <Typography variant="h5">
                      Total Days:{" "}
                      <strong>
                        {" "}
                        {this.state.transferRedeemDetails.days} Days
                      </strong>
                    </Typography>
                  </div>
                  <div className="coinName">
                    <Typography variant="h5">
                      Interest Amount:{" "}
                      <strong>
                        {" "}
                        {this.state.transferRedeemDetails.interestAmount}{" "}
                        {this.state.transferRedeemDetails.coin}
                      </strong>
                    </Typography>
                  </div>
                  <div className="coinName">
                    <Typography variant="h5">
                      Total Amount:{" "}
                      <strong>
                        {" "}
                        {this.state.transferRedeemDetails.totalAmount}{" "}
                        {this.state.transferRedeemDetails.coin}
                      </strong>
                    </Typography>
                  </div>
                </DialogContent>

                <DialogActions>
                  <Button
                    autoFocus
                    onClick={this.handleTransferCoinMainWallet}
                    color="primary"
                  >
                    Transfer
                  </Button>
                  <Button
                    autoFocus
                    onClick={this.handleTransferRedeemDetailModel}
                    color="primary"
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Lending.propTypes = {
  auth: PropTypes.object.isRequired,
  userAssets: PropTypes.array.isRequired,
  bitexSaving: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  bitexSaving: state.bitexSaving,
  userAssets: state.wallet.userAssets,
  marketLasts: state.wallet.marketLasts,
  snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
  getBitexSavingPlans,
  getUserBitexSavingWallet,
  getActiveAssets,
  transferCoin,
  clearSnackMessages,
  getTransferHistory,
  transferCoinMainWallet,
  daysChangeDemo,
  validateTransferCoinMainWallet,
  getMarketLast,
  getBitexSavingAmount,
  setLastLoginRedirectedLink,
})(withStyles(themeStyles)(Lending));
