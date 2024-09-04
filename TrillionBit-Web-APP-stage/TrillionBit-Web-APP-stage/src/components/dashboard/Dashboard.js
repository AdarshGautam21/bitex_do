import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Chart from "react-apexcharts";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { makeStyles } from "@mui/styles";
import { red } from "@mui/material/colors";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Chip,
} from "@mui/material";
import { Skeleton } from "@mui/lab";
import {
  ShoppingBasket,
  SecurityTwoTone,
  DevicesOtherTwoTone,
  RecordVoiceOver,
  AccountBalanceWallet,
  SwapHoriz,
} from "@mui/icons-material";
import ArrowRightAltSharp from "@mui/icons-material/ArrowRightAltSharp";
import currencyIcon from "../../common/CurrencyIcon";
import { getUserBitexSavingWallet } from "../../actions/BitexSavingActions";

import banner01 from "../../assets/img/banner/banner-011.webp";
import banner02 from "../../assets/img/banner/banner-06.webp";

import {
  getUserLogs,
  getUserAnnouncements,
  getUserProfile,
  getIpLocation,
} from "../../actions/userActions";
import {
  getUserLastFiveOrders,
  getChartData,
  getMarketStatusToday,
} from "../../actions/orderActions";
import {
  getActiveAssets,
  getActiveMarginAssets,
  clearActiveAssets,
  getMarketLast,
} from "../../actions/walletActions";
import isEmpty from "../../validation/isEmpty";
import fileImg from "../../assets/img/file.webp";
import Countries from "../../common/Countries";

const moment = require("moment");
let CurrencyFormat = require("react-currency-format");
const publicIp = require("public-ip");

export class Dashboard extends Component {
  state = {
    value: "",
    walletTabValue: "wallet",
    activityTabValue: "activity",
    exchangeLoader: true,
    currentCurrency: "",
    currentWalletType: "Spot",
    currentUserFiatWallet: {
      coin: "",
    },
    series: [
      {
        name: "price",
        data: [30, 40, 70, 91, 125],
      },
    ],
    wsList: [],
    marketLast: {},
    currentCurrencyName: "",
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
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
      return;
    } else {
      this.wsConnect();

      const currentCurrencyName = Countries.find(
        (item) => item.sortname === this.props.auth.user.country
      )?.name;
      const promises = [
        this.getActiveMarket(),
        this.props.getUserProfile(this.props.auth.user.id),
        this.props.getChartData(),
        this.props.getUserLastFiveOrders(this.props.auth.user.id),
        this.props.getUserLogs(5, this.props.auth.user.id),
        this.props.getUserAnnouncements(),
        this.props.getMarketLast(),
        this.props.getUserBitexSavingWallet(this.props.auth.user.id),
      ];
      await Promise.all(promises);
      let marketLast = this.state.marketLast;
      for (let key in this.props.trading.markets) {
        marketLast[this.props.trading.markets[key].name] =
          this.props.wallet.marketLasts[this.props.trading.markets[key].name];
      }
      let currentUserFiatWallet = this.props.wallet.userAssets.find(
        (userAsset) => userAsset.active && userAsset.fiat
      );
      if (isEmpty(currentUserFiatWallet)) {
        const usdtCoin = this.props.wallet.userAssets.find(
          (usdtItem) => usdtItem.coin === "USDT"
        );
        currentUserFiatWallet = usdtCoin;
      }
      this.setState({
        marketLast: marketLast,
        currentUserFiatWallet: currentUserFiatWallet,
        currentCurrency: !isEmpty(currentUserFiatWallet)
          ? currentUserFiatWallet?.coin
          : "",
        currentCurrencyName: !isEmpty(currentCurrencyName)
          ? currentCurrencyName
          : "-",
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (!isEmpty(nextProps.trading.tradingChartData)) {
      let marketSeries = {};
      for (let key in nextProps.trading.tradingChartData) {
        for (let ckey in nextProps.trading.tradingChartData[key]) {
          if (nextProps.trading.tradingChartData[key][ckey].length > 0) {
            let priceSeries = [];
            let i = 0;
            let tradingChartData = JSON.parse(
              nextProps.trading.tradingChartData[key][ckey]
            );
            for (let mKey in tradingChartData) {
              priceSeries.push(tradingChartData[mKey].price);
              if (i === 48) {
                break;
              }
              i++;
            }
            if (isEmpty(marketSeries[key])) {
              marketSeries[key] = {};
            } else {
              // eslint-disable-next-line no-self-assign
              marketSeries[key] = marketSeries[key];
            }
            marketSeries[key][ckey] = [
              { data: priceSeries.reverse(), name: "price" },
            ];
          } else {
            marketSeries[key][ckey] = [
              {
                name: "price",
                data: [30, 40, 70, 91, 125],
              },
            ];
          }
        }
      }
      this.setState({
        marketGraphs: marketSeries,
        exchangeLoader: false,
      });
    }

    // if (isEmpty(nextProps.wallet.userAssets)) {
    //     this.getActiveMarket();
    // }
  };

  getActiveMarket = async () => {
    await this.props.clearActiveAssets();
    await this.props.getActiveAssets(this.props.auth.user.id);
    await this.props.getActiveMarginAssets(this.props.auth.user.id);
    let marketLast = this.state.marketLast;
    for (let key in this.props.trading.markets) {
      marketLast[this.props.trading.markets[key].name] =
        this.props.wallet.marketLasts[this.props.trading.markets[key].name];
      this.setState({ marketLast: marketLast });
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
  };

  wsConnectOld = (markets) => {
    let ws = new WebSocket("wss://134.209.186.72:8090");

    ws.onopen = async () => {
      let wsList = this.state.wsList;
      wsList.push(ws);
      this.setState({ wsList: wsList });
      var msg = JSON.stringify({
        id: 12121,
        method: "state.subscribe",
        params: markets,
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
  };

  handleWalletChange = (event, newValue) => {
    this.setState({ walletTabValue: newValue });
  };

  handleActivityChange = (event, newValue) => {
    this.setState({ activityTabValue: newValue });
  };

  render() {
    const classes = dashboardMaterialStyles;
    const { user, wallet, trading, bitexSaving } = this.props;
    let currentUserProfileLevel = 12;
    let statusMessages = [];
    // let traderLevel = 1;
    let takerFee = 0.0;
    let makerFee = 0.0;

    if (!isEmpty(user.userProfile)) {
      takerFee = user.userProfile.traderLevelFees.takerFee;
      makerFee = user.userProfile.traderLevelFees.makerFee;
      currentUserProfileLevel = user.userProfile.profileComplete;
      // traderLevel = user.userProfile.traderLevel;
      statusMessages = user.userProfile.statusMessages;
    }

    let currentCurrency = this.state.currentCurrency;

    let chartOptions = {
      chart: {
        type: "line",
        sparkline: {
          enabled: true,
        },
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
      xaxis: {
        // categories: [1991,1992,1996,1998,1999],
        tooltip: {
          enabled: false,
        },
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      colors: ["#FF9800"],
      grid: {
        show: false,
      },
      stroke: {
        show: true,
        curve: "smooth",
        width: 1,
      },
      tooltip: {
        fixed: {
          enabled: false,
        },
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return currentCurrency;
            },
          },
        },
        marker: {
          show: false,
        },
      },
      marketGraphs: {},
    };

    return (
      <React.Fragment>
        <Helmet>
          <title className="next-head">Dashboard | Trillionbit</title>
          <meta
            name="keywords"
            content="bitcoin india, bitcoin india price today, bitcoin in india legal, bitcoin india price live, bitcoin indian rupees, how to buy bitcoin india, bitcoin india latest news, btc price in india today, btc trading in india, btc in india legal, btc india news, how to buy ripple, buy xrp india, crypto exchange, crypto india, crypto dubai, buy bitcoin dubai, buy and sell bitcoin, btc price inr, buy ripple, buy ethereum, bitcoin exchange, bitcoin trading, xrp india, btc mumbai, Trillionbit, Trillionbit india, Trillionbit crypto"
          />
          <meta
            name="description"
            content="Trillionbit - A leading cryptocurrency exchange and multi-signature wallet platform to buy and sell Bitcoin, Ethereum, XRP, Litecoin and Bitcoin Cash."
          />
          <meta
            property="og:url"
            content="https://www.trillionbit.com/dashboard"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Dashboard | Trillionbit" />
          <meta property="og:site_name" content="Trillionbit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Dashboard | Trillionbit" />
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
        <div className="paddingTopbody100">
          <Container className="mainbody" fixed={false}>
            <Grid container>
              <Grid item sm={3} xs={12}>
                <div className="pogressSection">
                  <div className="circularProgress">
                    <CircularProgress
                      className={classes.progress}
                      variant="determinate"
                      value={0}
                    />
                    <Typography variant="h5" className="">
                      <span> P/L </span> {0} %
                    </Typography>
                  </div>
                  <div className="amountBox">
                    <div className="profileSection">
                      <Typography variant="h5" className="">
                        0.00
                      </Typography>

                      <Typography variant="h6" className="">
                        Total Invested
                      </Typography>
                    </div>
                    <div className="profileSection">
                      <Typography variant="h5" className="">
                        0.00
                      </Typography>

                      <Typography variant="h6" className="">
                        Total Return
                      </Typography>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item sm={5} xs={12}>
                <div className="offerBanner dashboard">
                  <div className="item">
                    <a href="/btxCoin">
                      <img src={banner01} alt="bitcoin and crypto exchange" />
                    </a>
                  </div>

                  <div className="item">
                    <a href="/user-wallet">
                      <img src={banner02} alt="bitcoin and crypto exchange" />
                    </a>
                  </div>
                </div>
              </Grid>

              <Grid item sm={4} xs={12} md={4} className="balanceSection">
                <div className="traderSection">
                  <div className="traderBox">
                    <h6 className="MuiTypography-root MuiTypography-h6">
                      {" "}
                      Account{" "}
                    </h6>
                    <h5 className="MuiTypography-root MuiTypography-h5">
                      {" "}
                      {isEmpty(this.state.currentCurrencyName) ? (
                        <CircularProgress size={12} />
                      ) : (
                        this.state.currentCurrencyName
                      )}{" "}
                      <span> Country </span>
                    </h5>
                    <h5 className="MuiTypography-root MuiTypography-h5">
                      {/* {" "}
                      {isEmpty(this.state.currentUserFiatWallet.coin) ? (
                        <CircularProgress size={12} />
                      ) : (
                        `${
                          this.state.currentUserFiatWallet.coin === "EUR"
                            ? "€"
                            : this.state.currentUserFiatWallet.coin === "USDT"
                            ? ""
                            : ""
                        } ${this.state.currentUserFiatWallet.coin}  ${
                          this.state.currentUserFiatWallet.coin === "AED"
                            ? "د.إ"
                            : ""
                        }`
                      )}{" "} */}
                      Rupees
                      <span> Currency </span>
                    </h5>
                  </div>
                  <div className="traderBox">
                    <h6 className="MuiTypography-root MuiTypography-h6">
                      {" "}
                      Trader Level{" "}
                      {`: ${this.props.user.userProfile.traderLevel}`}{" "}
                    </h6>
                    <h5 className="MuiTypography-root MuiTypography-h5">
                      {makerFee}% <span> Maker Fee </span>
                    </h5>
                    <h5 className="MuiTypography-root MuiTypography-h5">
                      {takerFee}% <span> Taker Fee </span>
                    </h5>
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={8}>
                <Card className="dataListCard exchangeBox tabBox">
                  <CardHeader
                    title={
                      <Tabs
                        scrollButtons="auto"
                        variant="scrollable"
                        onChange={this.handleWalletChange.bind(this)}
                        value={this.state.walletTabValue}
                        textColor="primary"
                        indicatorColor="primary"
                      >
                        <Tab
                          value="wallet"
                          label={
                            <div className="tabValue">
                              <div className="Icon">
                                <AccountBalanceWallet />
                              </div>
                              <div className="title">Wallet</div>
                            </div>
                          }
                          className={classes.tabRoot}
                        />
                        <Tab
                          value="exchange"
                          className={classes.tabRoot}
                          label={
                            <div className="tabValue">
                              <div className="Icon">
                                <SwapHoriz />
                              </div>
                              <div className="title">Exchange</div>
                            </div>
                          }
                        />
                      </Tabs>
                    }
                    action={
                      this.state.walletTabValue === "exchange" ? (
                        <div>
                          <Chip
                            label="AED"
                            onClick={() =>
                              this.setState({
                                currentCurrency: "AED",
                              })
                            }
                            style={
                              this.state.currentCurrency === "AED"
                                ? dashboardStyle.activeChip
                                : dashboardStyle.disableChip
                            }
                          />
                          <Chip
                            label="USDT"
                            onClick={() =>
                              this.setState({
                                currentCurrency: "USDT",
                              })
                            }
                            style={
                              this.state.currentCurrency === "USDT"
                                ? dashboardStyle.activeChip
                                : dashboardStyle.disableChip
                            }
                          />
                          <Chip
                            label="EUR"
                            onClick={() =>
                              this.setState({
                                currentCurrency: "EUR",
                              })
                            }
                            style={
                              this.state.currentCurrency === "EUR"
                                ? dashboardStyle.activeChip
                                : dashboardStyle.disableChip
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <Chip
                            label="Spot"
                            onClick={() =>
                              this.setState({
                                currentWalletType: "Spot",
                              })
                            }
                            style={
                              this.state.currentWalletType === "Spot"
                                ? dashboardStyle.activeChip
                                : dashboardStyle.disableChip
                            }
                          />
                          <Chip
                            label="Lend"
                            onClick={() =>
                              this.setState({
                                currentWalletType: "Lend",
                              })
                            }
                            style={
                              this.state.currentWalletType === "Lend"
                                ? dashboardStyle.activeChip
                                : dashboardStyle.disableChip
                            }
                          />
                          {/* {this.props.auth.user
														.marginTrading ? (
														<Chip
															label="Margin"
															onClick={() =>
																this.setState({
																	currentWalletType:
																		"Margin",
																})
															}
															style={
																this.state
																	.currentWalletType ===
																"Margin"
																	? dashboardStyle.activeChip
																	: dashboardStyle.disableChip
															}
														/>
													) : undefined} */}
                        </div>
                      )
                    }
                  />

                  <CardContent>
                    {this.state.walletTabValue === "wallet" ? (
                      <List className={classes.root}>
                        {this.state.currentWalletType === "Spot"
                          ? isEmpty(wallet.userAssets)
                            ? [0, 0, 0, 0].map((val, index) => {
                                return (
                                  <ListItem key={index}>
                                    <Skeleton
                                      variant="circle"
                                      width={40}
                                      height={40}
                                    />
                                    <Skeleton variant="text" />
                                  </ListItem>
                                );
                              })
                            : wallet.userAssets.map((userAsset, index) => {
                                return (
                                  <ListItem key={index}>
                                    <img
                                      src={currencyIcon(userAsset.coin)}
                                      alt={userAsset.coin}
                                    />
                                    <Typography variant="h6" component="h2">
                                      {userAsset.fiat
                                        ? parseFloat(
                                            userAsset.walletAmount
                                          ).toFixed(2)
                                        : parseFloat(
                                            userAsset.walletAmount
                                          ).toFixed(4)}
                                    </Typography>
                                    <Typography
                                      className={classes.pos}
                                      color="textSecondary"
                                    >
                                      {userAsset.coin} balance
                                    </Typography>
                                  </ListItem>
                                );
                              })
                          : this.state.currentWalletType === "Lend"
                          ? bitexSaving.activeBitexSavingWallet.map(
                              (userAsset, index) => {
                                return (
                                  <ListItem key={index}>
                                    <img
                                      src={currencyIcon(userAsset.coin)}
                                      alt={userAsset.coin}
                                    />
                                    <Typography variant="h6" component="h2">
                                      {userAsset.fiat
                                        ? parseFloat(
                                            userAsset.walletAmount
                                          ).toFixed(2)
                                        : parseFloat(
                                            userAsset.walletAmount
                                          ).toFixed(4)}
                                    </Typography>
                                    <Typography
                                      className={classes.pos}
                                      color="textSecondary"
                                    >
                                      {userAsset.coin} balance
                                    </Typography>
                                  </ListItem>
                                );
                              }
                            )
                          : isEmpty(wallet.userMarginAssets)
                          ? [0, 0, 0, 0].map((val, index) => {
                              return (
                                <ListItem key={index}>
                                  <Skeleton
                                    variant="circle"
                                    width={40}
                                    height={40}
                                  />
                                  <Skeleton variant="text" />
                                </ListItem>
                              );
                            })
                          : wallet.userMarginAssets.map(
                              (userMarginAsset, index) => {
                                return (
                                  <ListItem key={index}>
                                    <img
                                      src={currencyIcon(userMarginAsset.coin)}
                                      alt={userMarginAsset.coin}
                                    />
                                    <Typography variant="h6" component="h2">
                                      {userMarginAsset.fiat
                                        ? parseFloat(
                                            userMarginAsset.walletAmount
                                          ).toFixed(2)
                                        : parseFloat(
                                            userMarginAsset.walletAmount
                                          ).toFixed(4)}
                                    </Typography>
                                    <Typography
                                      className={classes.pos}
                                      color="textSecondary"
                                    >
                                      {userMarginAsset.coin} balance
                                    </Typography>
                                  </ListItem>
                                );
                              }
                            )}
                      </List>
                    ) : (
                      <div className="exchangeData">
                        <List className="DataList">
                          {trading.markets.map((userAsset, index) => {
                            if (
                              this.state.currentCurrency === userAsset.money
                            ) {
                              return (
                                <ListItem key={index}>
                                  <div className="">
                                    <img
                                      src={currencyIcon(userAsset.stock)}
                                      alt={userAsset.stock}
                                    />

                                    {userAsset.money === "EUR" ? (
                                      <Typography
                                        variant="body2"
                                        className="coinPrice"
                                      >
                                        {"€ "}
                                        {new Intl.NumberFormat("en-IN").format(
                                          !isEmpty(this.state.marketLast)
                                            ? this.state.marketLast[
                                                userAsset.name
                                              ]
                                              ? userAsset.stock === "USDT"
                                                ? parseFloat(
                                                    this.state.marketLast[
                                                      userAsset.name
                                                    ].last
                                                  ).toFixed(2)
                                                : parseFloat(
                                                    this.state.marketLast[
                                                      userAsset.name
                                                    ].last
                                                  ).toFixed(2)
                                              : 0.0
                                            : 0.0
                                        )}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        className="coinPrice"
                                      >
                                        <CurrencyFormat
                                          value={
                                            !isEmpty(this.state.marketLast)
                                              ? this.state.marketLast[
                                                  userAsset.name
                                                ]
                                                ? userAsset.stock === "USDT"
                                                  ? parseFloat(
                                                      this.state.marketLast[
                                                        userAsset.name
                                                      ].last
                                                    ).toFixed(2)
                                                  : parseFloat(
                                                      this.state.marketLast[
                                                        userAsset.name
                                                      ].last
                                                    ).toFixed(2)
                                                : 0.0
                                              : 0.0
                                          }
                                          displayType={"text"}
                                          thousandSeparator={true}
                                          prefix={`${
                                            userAsset.money === "EUR"
                                              ? "€"
                                              : userAsset.money === "USD"
                                              ? "$"
                                              : ""
                                          } `}
                                          suffix={`${
                                            userAsset.money === "AED"
                                              ? "د.إ"
                                              : userAsset.money === "USDT"
                                              ? " USDT"
                                              : ""
                                          } `}
                                        />
                                      </Typography>
                                    )}

                                    <Typography variant="h6" component="h2">
                                      {" "}
                                      {userAsset.stock}{" "}
                                      <div className="arrow">
                                        <Typography
                                          className={
                                            !isEmpty(this.state.marketLast)
                                              ? this.state.marketLast[
                                                  userAsset.name
                                                ]
                                                ? ((parseFloat(
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
                                                    100 <
                                                  0
                                                  ? "red"
                                                  : "green"
                                                : "green"
                                              : "red"
                                          }
                                        >
                                          <ArrowDownwardIcon />
                                          {!isEmpty(this.state.marketLast)
                                            ? this.state.marketLast[
                                                userAsset.name
                                              ]
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
                                        </Typography>
                                      </div>
                                    </Typography>
                                  </div>

                                  <div className="graph">
                                    <Chart
                                      width={"100%"}
                                      height={"30px"}
                                      options={chartOptions}
                                      series={
                                        !isEmpty(this.state.marketGraphs)
                                          ? this.state.marketGraphs["USDT"][
                                              userAsset.stock
                                            ]
                                            ? this.state.marketGraphs["USDT"][
                                                userAsset.stock
                                              ]
                                            : [
                                                {
                                                  name: "price",
                                                  data: [
                                                    10, 10.8, 10.85, 10.89,
                                                    10.87,
                                                  ],
                                                },
                                              ]
                                          : [
                                              {
                                                name: "price",
                                                data: [
                                                  10, 10.8, 10.85, 10.89, 10.87,
                                                ],
                                              },
                                            ]
                                      }
                                      type="line"
                                    />
                                  </div>
                                </ListItem>
                              );
                            } else {
                              return undefined;
                            }
                          })}
                        </List>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="dataListCard">
                  <CardHeader
                    avatar={<RecordVoiceOver />}
                    title="Announcements"
                  />
                  <CardContent className="userAnnouncement">
                    {!isEmpty(user.userAnnoucements) ? (
                      <List className={classes.root}>
                        {user.userAnnoucements.map(
                          (userAnnouncement, index) => {
                            return (
                              <ListItem alignItems="flex-start" key={index}>
                                <Typography variant="h5" className="title">
                                  {userAnnouncement.announceTitle}
                                </Typography>

                                <Typography variant="h6" className="info">
                                  {userAnnouncement.announceDetails}
                                </Typography>
                              </ListItem>
                            );
                          }
                        )}
                      </List>
                    ) : (
                      <div className="noDatafound">
                        <img src={fileImg} alt="Remy Sharp" />
                        <Typography variant="h6" component="h2">
                          No Record Found
                        </Typography>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={4}>
                <Card className="dataListCard">
                  <CardHeader
                    avatar={<DevicesOtherTwoTone />}
                    title="Activity"
                  />
                  <CardContent>
                    {isEmpty(user.userLogs) ? (
                      <div className="noDatafound">
                        <img src={fileImg} alt="Remy Sharp" />
                        <Typography variant="h6" component="h2">
                          No Record Found
                        </Typography>
                      </div>
                    ) : (
                      <List className={classes.root}>
                        {user.userLogs.map((userLog, index) => {
                          return (
                            <ListItem alignItems="flex-start" key={index}>
                              <ListItemText
                                primary={
                                  userLog.deviceType === "Mobile"
                                    ? userLog.mobileVendor +
                                      " (" +
                                      userLog.mobileModel +
                                      ")"
                                    : userLog.browserName +
                                      " (" +
                                      userLog.osName +
                                      ")"
                                }
                                secondary={
                                  userLog.deviceType === "Mobile"
                                    ? userLog.osName +
                                      " (" +
                                      userLog.osVersion +
                                      ")"
                                    : "V" + userLog.fullBrowserVersion
                                }
                              />
                              <ListItemText
                                className="text-right"
                                primary={userLog.userIp}
                                secondary={moment(userLog.logTime).format(
                                  "LLL"
                                )}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="dataListCard">
                  <CardHeader
                    avatar={<ShoppingBasket />}
                    title="Recent Orders"
                  />
                  <CardContent>
                    {isEmpty(trading.orders) ? (
                      <div className="noDatafound">
                        <img src={fileImg} alt="Remy Sharp" />
                        <Typography variant="h6" component="h2">
                          No Record Found
                        </Typography>
                      </div>
                    ) : (
                      <List className={classes.root}>
                        {trading.orders.map((order, index) => (
                          <ListItem alignItems="flex-start" key={index}>
                            <ListItemText
                              primary={
                                order.side === 1 ? (
                                  <div>
                                    {order.market} :
                                    <strong
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      {" "}
                                      Sell
                                    </strong>
                                  </div>
                                ) : (
                                  <div>
                                    {order.market} :
                                    <strong
                                      style={{
                                        color: "green",
                                      }}
                                    >
                                      {" "}
                                      Buy
                                    </strong>
                                  </div>
                                )
                              }
                              secondary={order.type === 1 ? "Limit" : "Market"}
                            />
                            <ListItemText
                              className="text-right"
                              primary={
                                order.type === 1
                                  ? `${order.amount} @ ${order.price}`
                                  : `${order.dealStock} @ ${(
                                      parseFloat(order.dealMoney) /
                                      parseFloat(order.dealStock)
                                    ).toFixed(2)}`
                                // `${order.dealStock} @ ${(parseFloat(order.dealMoney)/parseFloat(order.dealStock)).toFixed(2)}`
                              }
                              secondary={moment(order.createTime).format("LLL")}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="dataListCard">
                  <CardHeader
                    avatar={<SecurityTwoTone />}
                    title="Increase your account security"
                  />
                  <CardContent>
                    <div className="pogressSection">
                      <div className="circularProgress">
                        <CircularProgress
                          className={classes.progress}
                          variant="determinate"
                          value={currentUserProfileLevel}
                        />
                        <Typography variant="h5" className="">
                          {currentUserProfileLevel}%
                        </Typography>
                      </div>
                      <div className="profileSection">
                        <Typography variant="h5" className="">
                          {currentUserProfileLevel === 100
                            ? "Profile is completed"
                            : "Complete My Profile"}
                        </Typography>
                        {statusMessages.map((statusMessage, index) => (
                          <Typography variant="h6" className="" key={index}>
                            {statusMessage}
                          </Typography>
                        ))}
                      </div>
                    </div>
                    <List className="accountSecurity">
                      <ListItem>
                        <Typography variant="body2" className="">
                          2FA
                        </Typography>
                        {!isEmpty(user.userProfile) ? (
                          user.userProfile.pendingResult.twoFactor === false ? (
                            <Link to="/user-profile" className="">
                              Enable
                            </Link>
                          ) : (
                            <div
                              style={{
                                color: "green",
                              }}
                            >
                              Completed
                            </div>
                          )
                        ) : (
                          <Link to="/user-profile" className="">
                            Enable
                          </Link>
                        )}
                      </ListItem>

                      <ListItem>
                        <Typography variant="body2" className="">
                          Identity Verification
                        </Typography>
                        {!isEmpty(user.userProfile) ? (
                          user.userProfile.pendingResult.identity === false ? (
                            <Link to="/user-profile" className="">
                              Enable
                            </Link>
                          ) : (
                            <div
                              style={{
                                color: "green",
                              }}
                            >
                              Enabled
                            </div>
                          )
                        ) : (
                          <Link to="/user-profile" className="">
                            Start Verification
                          </Link>
                        )}
                      </ListItem>

                      <ListItem>
                        <Typography variant="body2" className="">
                          Bank Info
                        </Typography>
                        {!isEmpty(user.userProfile) ? (
                          user.userProfile.pendingResult.bankInfo === false ? (
                            <Link to="/user-profile/basic_info" className="">
                              Setup
                            </Link>
                          ) : (
                            <div
                              style={{
                                color: "green",
                              }}
                            >
                              Completed
                            </div>
                          )
                        ) : (
                          <Link to="/start-verification" className="">
                            Start Verification
                          </Link>
                        )}
                      </ListItem>

                      <ListItem>
                        <Typography variant="body2" className="">
                          Basic Info
                        </Typography>
                        {!isEmpty(user.userProfile) ? (
                          user.userProfile.pendingResult.basicInfo === false ? (
                            <Link to="/user-profile/basic_info" className="">
                              Setup
                            </Link>
                          ) : (
                            <div
                              style={{
                                color: "green",
                              }}
                            >
                              Completed
                            </div>
                          )
                        ) : (
                          <Link to="/start-verification" className="">
                            Start Verification
                          </Link>
                        )}
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
                {/* <Card className="dataListCard">
                    <CardHeader
                        avatar={<SecurityTwoTone />}
                        title="Authentication"
                    />

                    <CardContent className="padBoxBody authentication">
                        <Typography className="authNote">
                            To increase your account SECURITY, please enable  Two-factor authentication.
                        </Typography>

                        <div>
                            <List className={classes.root}>
                                <ListItem>
                                    <ListItemText primary="2FA"/>
                                    <Link to={"/user-profile"}>
                                        Enable
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Identity Verification"/>
                                    <Link to={"/user-profile"}>
                                        verify
                                    </Link>
                                </ListItem>

                            </List>
                        </div>

                    </CardContent>
                </Card> */}
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

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

const dashboardStyle = {
  activeChip: {
    backgroundColor: "#17294e",
    margin: 5,
    color: "#fff",
    width: 70,
  },
  disableChip: { backgroundColor: "#e0e0e0", margin: 5, width: 70 },
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  getUserLogs: PropTypes.func.isRequired,
  getUserAnnouncements: PropTypes.func.isRequired,
  getActiveAssets: PropTypes.func.isRequired,
  getActiveMarginAssets: PropTypes.func.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  getUserLastFiveOrders: PropTypes.func.isRequired,
  getChartData: PropTypes.func.isRequired,
  getMarketStatusToday: PropTypes.func.isRequired,
  clearActiveAssets: PropTypes.func.isRequired,
  getMarketLast: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  trading: state.trading,
  wallet: state.wallet,
  bitexSaving: state.bitexSaving,
});

export default connect(mapStateToProp, {
  getUserLogs,
  getUserAnnouncements,
  getActiveAssets,
  getActiveMarginAssets,
  getUserProfile,
  getUserLastFiveOrders,
  getChartData,
  getMarketStatusToday,
  clearActiveAssets,
  getMarketLast,
  getUserBitexSavingWallet,
})(Dashboard);
