import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { withStyles } from "@mui/styles";
import Chart from "react-apexcharts";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { Container, Grid } from "@mui/material";
import { List, ListItem, Typography, Chip } from "@mui/material";
import { Carousel as CarosalRes } from "react-responsive-carousel";

import { ChevronRight } from "@mui/icons-material";
import themeStyles from "../../assets/themeStyles";

import { getChartData, getMarketStatusToday } from "../../actions/orderActions";
import {
  getAvailaleMarkets,
  getMarketLast,
  getBtxMarketData,
  getBtxAedMarketData,
  getActiveAssets,
} from "../../actions/walletActions";
import {
  subscribeToNewsletter,
  getIpLocation,
} from "../../actions/userActions";

import currencyIcon from "../../common/CurrencyIcon";
import isEmpty from "../../validation/isEmpty";

import screenimg from "../../assets/img/home/screen.webp";
import tradingImg from "../../assets/img/home/tradingPlatform.webp";

import secureWallet from "../../assets/img/home/secure-wallet.webp";
import zawyaImg from "../../assets/img/home/zawya.webp";
import arabianImg from "../../assets/img/home/arabian.webp";
import menaImg from "../../assets/img/home/mena.webp";
import featureImg from "../../assets/img/home/feature.webp";
import exchangeImg from "../../assets/img/home/exchange.webp";
import webWalletImg from "../../assets/img/home/web-wallet.webp";
import bitApiImg from "../../assets/img/home/bit-api.webp";
import appleImg from "../../assets/img/home/apple.webp";
import googlePlayImg from "../../assets/img/home/google-play.webp";

import amb from "../../assets/img/press/amb.webp";
import bi from "../../assets/img/press/Bi.webp";
import financial from "../../assets/img/press/Financial_IT.webp";
import inc from "../../assets/img/press/inc.webp";
import theweek from "../../assets/img/press/theweek.webp";

import banner01 from "../../assets/img/banner/00.webp";
import banner02 from "../../assets/img/banner/01.webp";
import banner03 from "../../assets/img/banner/02.webp";
import banner04 from "../../assets/img/banner/03.webp";
import banner05 from "../../assets/img/banner/04.webp";

import "../../assets/css/home.css";
import StaticBannerDisplay from "../ui/StaticBannerDisplay";

let CurrencyFormat = require("react-currency-format");
const publicIp = require("public-ip");

export class Landing extends Component {
  state = {
    value: "",
    anchorEl: null,
    anchorCurrencyEl: null,
    email: "",
    mobile: "",
    errors: {},
    series: [
      {
        name: "price",
        data: [10, 10.8, 10.85, 10.89, 10.87],
      },
    ],
    marketGraphs: {},
    marketLast: {},
    currentCurrency: "USDT",
    initDialog: true,
  };

  getMarketCoin = (marketName) => {
    let marketCoin = marketName;
    if (marketName === "tbtcAED") {
      marketCoin = "btcusd";
    }
    if (marketName === "tbchAED") {
      marketCoin = "bchusd";
    }
    if (marketName === "tltcAED") {
      marketCoin = "ltcusd";
    }
    if (marketName === "tzecAED") {
      marketCoin = "zecusd";
    }
    if (marketName === "txlmAED") {
      marketCoin = "xlmusd";
    }
    if (marketName === "tdashAED") {
      marketCoin = "dashusd";
    }
    if (marketName === "BTCAED") {
      marketCoin = "btcusd";
    }
    if (marketName === "BCHAED") {
      marketCoin = "bchusd";
    }
    if (marketName === "LTCAED") {
      marketCoin = "ltcusd";
    }
    if (marketName === "ZEDAED") {
      marketCoin = "zecusd";
    }
    if (marketName === "XLMAED") {
      marketCoin = "xlmusd";
    }
    if (marketName === "tdashAED") {
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
    this.wsConnect();
    window.scrollTo(0, 0);
    const currentIpLocation = await getIpLocation(await publicIp.v4());
    let currentCurrency =
      currentIpLocation.country.code === "IN"
        ? "EUR"
        : currentIpLocation.country.code === "AE"
        ? "AED"
        : "USDT";
    if (this.props.auth.user?.id) {
      await this.props.getActiveAssets(this.props.auth.user.id);
      const userActiveFiatAsset = this.props.wallet.userAssets.find(
        (item) => item.fiat && item.active
      );
      if (!isEmpty(userActiveFiatAsset)) {
        currentCurrency = userActiveFiatAsset?.coin;
      } else {
        if (this.props.auth.isAuthenticated) currentCurrency = "USDT";
      }
    }
    await this.props.getAvailaleMarkets();
    await this.props.getMarketLast();
    await this.props.getBtxMarketData();
    await this.props.getBtxAedMarketData();
    let marketLast = this.state.marketLast;
    for (let key in this.props.trading.markets) {
      marketLast[this.props.trading.markets[key].name] =
        this.props.wallet.marketLasts[this.props.trading.markets[key].name];
    }
    this.setState({
      marketLast: marketLast,
      currentCurrency: currentCurrency,
    });
    await this.props.getChartData();
  };

  componentWillUnmount = () => {
    //   window.fcWidget.destroy();
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
                data: [10, 10.8, 10.85, 10.89, 10.87],
              },
            ];
          }
        }
      }
      this.setState({
        marketGraphs: marketSeries,
        exchangeLoader: false,
      });
      console.log(this.state);
    }
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

  createData = (usd, price, change, chart, trade) => {
    return { usd, price, change, chart, trade };
  };

  subscribeNewsletter = () => {};

  handleInputChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  getMarketGraph = (market) => {
    console.log(this.state.marketGraphs[market]);
    if (this.state.marketGraphs[market]) {
      return this.state.marketGraphs[market];
    } else {
      return [
        {
          name: "price",
          data: [10, 10.8, 10.85, 10.89, 10.87],
        },
      ];
    }
  };

  getMarketLast = (marketName) => {
    if (marketName in this.props.trading.marketLast) {
      return parseFloat(this.props.trading.marketLast[marketName]).toFixed(2);
    }
  };

  render() {
    const { trading } = this.props;
    const { currentCurrency } = this.state;

    const responsived = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };

    const chartOptions = {
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
            formatter: function () {
              return currentCurrency;
            },
          },
        },
        marker: {
          show: false,
        },
      },
    };

    return (
      <React.Fragment>
        <Helmet>
          <title>
            Trillionbit - Buy and Sell Bitcoin and Ethereum | Crypto Exchange
          </title>
          <meta
            name="description"
            content="Trillionbit is a leading cryptocurrency exchange in India and UAE offering a secure, real time Bitcoin, Ethereum, XRP, Litecoin and Bitcoin Cash trading platform to Buy and Sell Cryptocurrency with Multi-signature Wallet. Open a free account and start trading."
          />
          <meta
            name="keywords"
            content="Blockchain crypto exchange, bitcoin exchange, cryptocurrency exchange, bitcoin trading, bitcoin wallet, ethereum wallet, BTC price, ETH price, Trillionbit, BTC to AED, BTC price AED, Bitcoin Dubai price, Bitcoin UAE price, BTC to INR, BTC INR price, Bitcoin India, buy cryptocurrency, buy bitcoin India, buy crypto uae, buy ethereum, best crypto exchange, Btc price inr, send btc, send crypto, Middle East, cryptocrypto payment, Trillionbit, Bitoasis, Wazirx, Coindcx"
          />
          <meta property="og:url" content="https://www.trillionbit.com" />
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
            content="https://trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:title"
            content="Trillionbit | Cryptocurrency Exchange"
          />
          <meta property="twitter:site" content="Trillionbit" />
          <meta
            property="twitter:image"
            content="https://trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:image:src"
            content="https://trillionbit.com/static/media/logo.d54102a2.webp"
          />
        </Helmet>

        <div
          className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}
        ></div>

        <div className="paddingTopLandingbody">
          {/* 
        <Dialog
            open={this.state.initDialog}
            keepMounted
            onClose={() => this.setState({initDialog: false})}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            className="launchSlidePopup"
        >            
            <a href="javascript:void(0)" onClick={() => this.setState({initDialog: false})} className="closeDialog"> <HighlightOffIcon/> </a>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">  
                    <div className="sliderSection">
                        <CarosalRes
                            showThumbs={false}
                            showIndicators={false}
                            showStatus={false}
                            showArrows={false}
                            interval={3000}
                            autoPlay={true}
                            infiniteLoop={true}
                            stopOnHover={false}
                        >
                            
                            <div className="slide">
                                <div className="SlideBox one">
                                    <div className="inBoxText">
                                        <Typography variant="h5" className="">
                                            Launching
                                        </Typography>
                                        <Typography variant="h3" className="">                                            
                                            BTX Coin
                                        </Typography>

                                        <Typography variant="h4" className="">
                                            Pre-Sale Round 1
                                        </Typography>        

                                        <div className="priceBox">
                                            <Typography variant="h4" className="">
                                                Token Price:
                                            </Typography> 
                                            <List className="price">
                                                <ListItem className="item">
                                                    <Typography variant="h4" className="">
                                                    {(this.props.wallet.trillionbitMarket?.last) ? `₹${parseFloat(this.props.wallet.trillionbitMarket.last).toFixed(2)}`: <CircularProgress size={15} />}
                                                    </Typography>                                                      
                                                </ListItem>

                                                <ListItem className="item">
                                                    <Typography variant="h4" className="">
                                                        $ 0.129 
                                                    </Typography>  
                                                </ListItem>

                                                <ListItem className="item">
                                                    <Typography variant="h4" className="">
                                                    {(this.props.wallet.trillionbitAedMarket?.last) ? `${parseFloat(this.props.wallet.trillionbitAedMarket.last).toFixed(2)}د.إ`: <CircularProgress size={17} />}   
                                                    </Typography>  
                                                </ListItem>
                                            </List>                                            
                                        </div> 
                                        <a href="/btxCoin" className="link"> Read More </a>                               
                                    </div>
                                    <div className="inBoxImg">
                                        <img src={btxCoin} alt="btx coin"/>   
                                    </div>                                    
                                </div>
                            </div>

                            <div className="slide">
                                <div className="SlideBox two">                                        
                                    <div className="inBoxText">
                                        <Typography variant="h3" className="">
                                            Let’s Breathe Together 
                                        </Typography>
                                        <a href="https://donate.trillionbit.com" className="link"> Donate Now </a>
                                    </div>                                       
                                </div>
                            </div>                                
                        </CarosalRes>
                    </div>
                </DialogContentText>
            </DialogContent>
        </Dialog> 
    */}

          <div className="slider">
            <Container>
              <Grid container>
                <Grid item sm={3}></Grid>
                <Grid item xs={12} sm={6} className="oneCenterBox">
                  <div className="slideText">
                    <Typography variant="h1" className="">
                      Buy and Sell Cryptocurrency Globally
                      {/* <span> Exchange </span> */}
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      Trillionbit is leading Cryptocurrency Wallet and Trading
                      platform. Buy and Sell digital assets like Bitcoin,
                      Ethereum, Ripple, Litecoin, Bitcoin Cash and more.
                    </Typography>

                    <Link to="/register" className="orange">
                      Sign Up Today
                    </Link>
                  </div>
                </Grid>
                {/* <Grid item xs={12} sm={6} md={6} lg={7}>
                        <div className="slideImg">
                            <img src={slider01} alt="bitcoin and crypto exchange" height="500" width="auto" />  
                        </div>
                    </Grid> */}
              </Grid>
              <Grid item sm={3}></Grid>
            </Container>
          </div>

          {/* <div className="bglightgray">
            <Container>
              <Grid container>
                <Grid item xs={12} className="offerbannerSec">
                  <Carousel responsive={responsived}>
                    <div className="item">
                      <a href="/btxCoin">
                        <img
                          src={banner01}
                          alt="bitcoin and crypto exchange"
                          width="400"
                          height="auto"
                        />
                      </a>
                    </div>
                    <div className="item">
                      <a href="/btxCoin">
                        <img
                          src={banner02}
                          alt="bitcoin and crypto exchange"
                          width="400"
                          height="auto"
                        />
                      </a>
                    </div>
                    <div className="item">
                      <a href="https://academy.trillionbit.com">
                        <img
                          src={banner03}
                          alt="bitcoin and crypto exchange"
                          width="400"
                          height="auto"
                        />
                      </a>
                    </div>
                    <div className="item">
                      <a href="/login">
                        <img
                          src={banner04}
                          alt="bitcoin and crypto exchange"
                          width="400"
                          height="auto"
                        />
                      </a>
                    </div>

                    <div className="item">
                      <a href="/trading">
                        <img
                          src={banner05}
                          alt="bitcoin and crypto exchange"
                          width="400"
                          height="auto"
                        />
                      </a>
                    </div>
                  </Carousel>
                </Grid>
              </Grid>
            </Container>
          </div> */}
          <StaticBannerDisplay />
          <div className="bglightgray">
            <Container>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <div className="announcement">
                    <a href="https://academy.trillionbit.com/">
                      <span>
                        {" "}
                        Visit Trillionbit Academy to learn more about Blockchain
                        and Cryptocurrencies!{" "}
                      </span>
                      <ChevronRight />
                    </a>
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={12} style={{ textAlign: "right" }}>
                  <Chip
                    label="USDT"
                    onClick={() =>
                      this.setState({
                        currentCurrency: "USDT",
                      })
                    }
                    style={
                      this.state.currentCurrency === "USDT"
                        ? landingStyle.activeChip
                        : landingStyle.disableChip
                    }
                  />

                  {/* <Chip
                            label="USD"
                            onClick={() => this.setState({currentCurrency: 'USD'})}
                            style={this.state.currentCurrency === 'USD' ? landingStyle.activeChip : landingStyle.disableChip}
                        /> */}
                  <Chip
                    label="EUR"
                    onClick={() =>
                      this.setState({
                        currentCurrency: "EUR",
                      })
                    }
                    style={
                      this.state.currentCurrency === "EUR"
                        ? landingStyle.activeChip
                        : landingStyle.disableChip
                    }
                  />

                  <Chip
                    label="GBP"
                    onClick={() =>
                      this.setState({
                        currentCurrency: "GBP",
                      })
                    }
                    style={
                      this.state.currentCurrency === "GBP"
                        ? landingStyle.activeChip
                        : landingStyle.disableChip
                    }
                    // color={this.state.currentCurrency === 'AED' ? 'primary' : ''}
                    // style={{margin: 5}}
                  />

                  <Chip
                    label="AED"
                    onClick={() =>
                      this.setState({
                        currentCurrency: "AED",
                      })
                    }
                    style={
                      this.state.currentCurrency === "AED"
                        ? landingStyle.activeChip
                        : landingStyle.disableChip
                    }
                    // color={this.state.currentCurrency === 'AED' ? 'primary' : ''}
                    // style={{margin: 5}}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <div className="tableResponsive tableSpace">
                    <div className="table">
                      <List className="dataTable">
                        <ListItem className="headRow">
                          <div className="td">
                            <Typography variant="body2" className="">
                              MARKET
                            </Typography>
                          </div>
                          <div className="td">
                            <Typography variant="body2" className="">
                              PRICE
                            </Typography>
                          </div>
                          <div className="td">
                            <Typography variant="body2" className="">
                              CHANGE (24H)
                            </Typography>
                          </div>
                          <div className="td">
                            <Typography variant="body2" className="">
                              CHART (24H)
                            </Typography>
                          </div>
                          <div className="td">
                            <Typography variant="body2" className="">
                              TRADE
                            </Typography>
                          </div>
                        </ListItem>

                        {trading.markets.map((userAsset, index) => {
                          if (this.state.currentCurrency === userAsset.money) {
                            return (
                              <ListItem className="bodyRow" key={index}>
                                <div className="td">
                                  <img
                                    src={currencyIcon(userAsset.stock)}
                                    alt="trillionbit"
                                    width="32"
                                    height="auto"
                                  />
                                  <div className="coinName">
                                    <Typography variant="body2" className="">
                                      {userAsset.stock}
                                      <span className="shortForm">
                                        {userAsset.displayName}
                                      </span>
                                    </Typography>
                                  </div>
                                </div>

                                <div className="td">
                                  {userAsset.money === "EUR" ? (
                                    <Typography variant="body2" className="">
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
                                  ) : userAsset.money === "GBP" ? (
                                    <Typography variant="body2" className="">
                                      {"£ "}
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
                                    <Typography variant="body2" className="">
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
                                </div>

                                <div
                                  className={
                                    !isEmpty(this.state.marketLast)
                                      ? this.state.marketLast[userAsset.name]
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
                                          ? "td red"
                                          : "td green"
                                        : "td green"
                                      : "td red"
                                  }
                                >
                                  <Typography variant="body2" className="">
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
                                  </Typography>
                                </div>

                                <div className="td">
                                  <Typography
                                    component="div"
                                    variant="body2"
                                    className=""
                                  >
                                    <Chart
                                      width={100}
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
                                  </Typography>
                                </div>

                                <div className="td">
                                  <Typography variant="body2" className="">
                                    <Link to={"/trading"} className="buyNow">
                                      Trade
                                    </Link>
                                  </Typography>
                                </div>
                              </ListItem>
                            );
                          } else {
                            return undefined;
                          }
                        })}
                      </List>
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid container className="CryptocurrencyWrapText">
                <Grid item md={12}>
                  <div className="wrapInfo">
                    <h1> Buy & Sell Cryptocurrency and Bitcoin </h1>
                    <p>
                      {" "}
                      Trillionbit is an innovative cryptocurrency exchange with
                      advanced financial services. We rely on blockchain
                      technology to provide everything you need for wise trading
                      and investment. Trillionbit uses blockchain to construct
                      the cutting edge monetary environment. We endeavor to
                      dispense with monetary boundaries, advance the worldwide
                      economy, and improve the world. We never stop to enhance
                      and improve our client experience to make digital assets
                      exchanging and contributing accessible to everybody.
                      Security is our main priority. Trillionbit gives a
                      protected, dependable, and stable environment for crypto
                      exchanging via web and mobile applications. We receive
                      worldwide worker load adjusting, dispersed bunches,
                      different advancements for your assurance. Our items and
                      administrations are constantly custom-made to your
                      requirements and recommendations.{" "}
                    </p>
                  </div>
                </Grid>
              </Grid>

              {/* <Grid container   className="fourBoxSection">
                    <Grid item xs={12} sm={6} md={3}>
                        <div className="wrapBox">

                            <Typography variant="h5" className="number">
                                01
                            </Typography>

                            <div className="imgBox">
                                <img src={box01} alt="Im" width="70" height="auto" />
                            </div>


                            <Typography variant="h3" className="title">
                                Create An Account
                            </Typography>

                            <Typography variant="body2" className="subText">
                                Fill in the required details and submit identity documents to get your Trillionbit account verified.
                            </Typography>
                            <Link to="#" className="">
                                Read More
                            </Link>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <div className="wrapBox">

                            <Typography variant="h5" className="number">
                                02
                            </Typography>

                            <div className="imgBox">
                                <img src={box02} alt="Im" width="70" height="auto" />
                            </div>


                            <Typography variant="h3" className="title">
                                Make Your First Deposit
                            </Typography>

                            <Typography variant="body2" className="subText">
                                With multiple payment options like Bank Transfer and Cash Service, make your first fiat deposit.
                            </Typography>
                            <Link to="#" className="">
                                Get a Wallet
                            </Link>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <div className="wrapBox">

                            <Typography variant="h5" className="number">
                                03
                            </Typography>

                            <div className="imgBox">
                                <img src={box03} alt="Im" width="70" height="auto"/>
                            </div>


                            <Typography variant="h3" className="title">
                                Start Trading
                            </Typography>

                            <Typography variant="body2" className="subText">
                                Use the professional trading platform with ultra-fast matching engine to secure your trades.
                            </Typography>
                            <Link to="#" className="">
                                Lern to Use
                            </Link>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <div className="wrapBox">

                            <Typography variant="h5" className="number">
                                04
                            </Typography>

                            <div className="imgBox">
                                <img src={box04} alt="Im" width="70" height="auto" />
                            </div>


                            <Typography variant="h3" className="title">
                                Withdraw
                            </Typography>

                            <Typography variant="body2" className="subText">
                                Withdraw fiat to your Bank account or withdraw your purchased cryptocurrencies to a 3rd party wallet.
                            </Typography>
                            <Link to="#" className="">
                                Lern to Use
                            </Link>
                        </div>
                    </Grid>
                </Grid> */}
            </Container>
          </div>

          {/* <div className="investorSection">
            <Container>
                <Grid container>
                    <Grid item xs={12} sm={4} md={4}>
                        <div className="coinIcon">
                            <img src={btxCoin} alt="bitcoin and crypto exchange" width="310" height="auto"/>
                        </div>
                    </Grid>                  

                    <Grid item xs={12} sm={8} md={8}>
                        <div className="investorText IntroducText">
                            <Typography variant="h2">
                                Introducing  <strong>  BTX Coin </strong> <br/>
                            </Typography>

                            <Typography variant="h6" className="text">
                                Just like Bitcoin and other cryptocurrencies today, BTX is a token created by Trillionbit. There will be a maximum of 1 Billion BTX coins ever created.
                            </Typography>

                            <Typography variant="h6" className="text">
                            BTX, a utility token backed by Trillionbit, forms the backbone of Trillionbit ecosystem. We launched BTX tokens to involve our community in helping us build out Trillionbit, and reward them accordingly for contributing to our success. This helps us stay true to the ethos of cryptocurrency and blockchain - to share the rewards of Trillionbit's success with our early adopters and supporters.
                            </Typography>

                            <a target="_blank" href="/whitepaper-btx.pdf"> Read the Whitepaper </a>

                            <a href="/btxCoin" className="orange"> Buy BTX </a>

                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div> */}

          <div className="cryptocurrency">
            <Container>
              <Grid container>
                <Grid item xs={12} md={12}>
                  <div className="wrapTitle">
                    <Typography variant="h2">
                      Start Your Cryptocurrency Journey Today
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      className="text"
                    >
                      We have variety of features that make it an ideal place to
                      buy and sell cryptocurrencies worldwide. Bitcoin Exchange
                      with best prices and multiple cryptocurrencies.
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <Grid container className="adjustpadding">
                <Grid item xs={12} md={6}>
                  <div className="WrapImg">
                    <img
                      src={secureWallet}
                      alt="bitcoin exchange"
                      width="600"
                      height="auto"
                    />
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="subSections">
                    <Typography variant="h3">
                      <strong> Multi-signature </strong> wallet
                    </Typography>

                    <div className="experience">
                      <Typography variant="h6">
                        Securely store all your digital assets in our web wallet
                        that uses multiple keys to make your wallet safe
                      </Typography>
                    </div>

                    <Typography variant="h6">
                      Your Trillionbit wallet is secured using 3 keys. First key
                      is stored with us, second key with our wallet partner and
                      third is the recovery key. A transaction goes through only
                      if it is signed by 2 of the 3 keys.
                    </Typography>

                    <Typography variant="h6">
                      The Trillionbit wallet allows you to send digital assets
                      to third-party wallets and you can also receive from other
                      wallets. You need the wallet address to send while you
                      need to provide your wallet address to receive.
                    </Typography>

                    <Typography variant="h6">
                      Multiple cryptocurrencies supports: Bitcoin, Ethereum,
                      Litecoin, XRP, Bitcoin Cash, Dash, Stellar XLM, Bitcoin
                      SV, Zcash etc.
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <Grid container className="adjustpadding flexRevers">
                <Grid item xs={12} md={6}>
                  <div className="subSections">
                    <Typography variant="h3">
                      <strong> Professional </strong> Trading Platform
                    </Typography>

                    <Typography variant="h6">
                      The Trillionbit trading platform isn’t only about order
                      placement. It provides advanced charts and financial
                      indicators for the professionals.
                    </Typography>

                    <Typography variant="h6">
                      Allows users to place Spot and Limit Orders on all
                      available trading pairs. Users can also customize charts
                      to meet their trading needs while using the pre-existing
                      10+ indicators.
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <div className="WrapImg">
                    <img
                      src={tradingImg}
                      alt="bitcoin exchange"
                      width="600"
                      height="auto"
                    />
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="investorSection">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={6} md={3} className="oneCenterBox">
                  <div className="inBox">
                    <img src={exchangeImg} alt="Im" width="95" height="auto" />
                    <Typography variant="h3">The Exchange</Typography>
                    <Typography variant="h6">
                      The most advanced trading platform.
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <div className="inBox marginBottom80">
                    <img src={webWalletImg} alt="Im" width="95" height="auto" />
                    <Typography variant="h3">Web Wallet</Typography>
                    <Typography variant="h6">
                      Secure your digital assets with us.
                    </Typography>
                  </div>

                  <div className="inBox">
                    <img src={bitApiImg} alt="Im" width="95" height="auto" />
                    <Typography variant="h3">Developer API</Typography>
                    <Typography variant="h6">
                      Giving you more power & freedom.
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <div className="investorText">
                    <Typography variant="h2">
                      <strong> Products for traders & </strong> <br />
                      Investors like you
                    </Typography>

                    <Typography variant="h6" className="text">
                      Trillionbit is a fully regulated and compliant financial
                      exchange. It follows a strict Anti-money laundering (AML)
                      and Know your customer (KYC) policy. In order to secure
                      your funds and give no way to frauds on our platform, we
                      request our customers to follow these policies and be a
                      part of the Trillionbit family.
                    </Typography>

                    <Typography variant="h6" className="text">
                      The Exchange platform is developed using the latest
                      technologies and we have followed the best development
                      practices to reduce the risk of fraud. We use numerous
                      measures like 2fa, email verification, IP blocking, mobile
                      verification and also manually verify unusual account
                      activity and transactions in order to provide a secure
                      experience. All the identity documents submitted to us
                      also remain securely stored in a remote database with
                      highest standards of encryption in order to maintain user
                      privacy.
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="applicationSec">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={2}></Grid>
                <Grid item xs={12} sm={8}>
                  <div className="subSections text-center">
                    <Typography variant="h3">
                      <strong> Cross Platform Trading </strong>
                    </Typography>

                    <Typography variant="h6">
                      Use our mobile application to trade on the go. A full
                      featured platform with advanced charting tools provides a
                      hassle-free trading experience from you mobile.
                    </Typography>

                    {/* <a href="https://apps.apple.com/ae/app/trillionbit-uae/id1492803003" rel="noopener noreferrer" target="_blank" variant="body2" color="secondary" className="">
                                <img src={appleImg} alt="Im" width="20" height="auto"/>
                                Apple Store
                            </a>

                            <a href="https://play.google.com/store/apps/details?id=com.trillionbituae" rel="noopener noreferrer" target="_blank" variant="body2" color="secondary" className="">
                                <img src={googlePlayImg} alt="Im" width="20" height="auto"/>
                                Google Play
                            </a> */}
                  </div>
                </Grid>

                <Grid item xs={12} sm={2}></Grid>
              </Grid>

              <Grid container className="fourBoxSection">
                <Grid item xs={12} sm={5} md={5}>
                  <div className="wrapBox">
                    <Typography variant="h3" className="title">
                      Create An Account
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Fill in the required details and submit identity documents
                      to get your Trillionbit account verified.
                    </Typography>
                    {/* <Link to="#" className="">
                                Read More
                            </Link> */}
                  </div>

                  <div className="wrapBox">
                    <Typography variant="h3" className="title">
                      Make Your First Deposit
                    </Typography>

                    <Typography variant="body2" className="subText">
                      With multiple payment options like Bank Transfer and Cash
                      Service, make your first fiat deposit.
                    </Typography>
                    {/* <Link to="#" className="">
                                Get a Wallet
                            </Link> */}
                  </div>

                  <div className="wrapBox">
                    <Typography variant="h3" className="title">
                      Start Trading
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Use the professional trading platform with ultra-fast
                      matching engine to secure your trades.
                    </Typography>
                    {/* <Link to="#" className="">
                                Lern to Use
                            </Link> */}
                  </div>

                  <div className="wrapBox">
                    <Typography variant="h3" className="title">
                      Withdraw
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Withdraw fiat to your Bank account or withdraw your
                      purchased cryptocurrencies to a 3rd party wallet.
                    </Typography>
                    {/* <Link to="#" className="">
                                Lern to Use
                            </Link> */}
                  </div>
                </Grid>

                <Grid item xs={12} sm={5} md={7} className="oneCenterBox">
                  <div className="screenimg">
                    <img src={screenimg} alt="screen" width="" height="auto" />
                  </div>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} sm={2}></Grid>
                <Grid item xs={12} sm={8}>
                  <div className="subSections text-center">
                    <a
                      href="https://apps.apple.com/ae/app/trillionbit-uae/id1492803003"
                      rel="noopener noreferrer"
                      target="_blank"
                      variant="body2"
                      color="secondary"
                      className=""
                    >
                      <img src={appleImg} alt="Im" width="20" height="auto" />
                      <div className="text">
                        <span className="small"> Download on the </span>
                        <span className="big"> Apple Store </span>
                      </div>
                    </a>

                    <a
                      href="https://play.google.com/store/apps/details?id=com.trillionbituae"
                      rel="noopener noreferrer"
                      target="_blank"
                      variant="body2"
                      color="secondary"
                      className=""
                    >
                      <img
                        src={googlePlayImg}
                        alt="Im"
                        width="20"
                        height="auto"
                      />

                      <div className="text">
                        <span className="small"> GET IT ON </span>
                        <span className="big"> Google Play </span>
                      </div>
                    </a>
                  </div>
                </Grid>

                <Grid item xs={12} sm={2}></Grid>
              </Grid>
            </Container>
          </div>

          <div className="featuredSection">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={7} md={6}>
                  <div className="sliderSection">
                    <CarosalRes
                      showThumbs={false}
                      showIndicators={false}
                      showStatus={false}
                      showArrows={false}
                      interval={3000}
                      autoPlay={true}
                      infiniteLoop={true}
                      stopOnHover={false}
                    >
                      <div>
                        <img src={bi} alt="Im" width="203" height="auto" />
                        <Typography variant="h6">
                          “Bitcoin is on a record run, surging past $18,000 —
                          here’s why the cryptocurrency is booming again”
                        </Typography>
                        <Link to="#"> Business Insider </Link>
                      </div>

                      <div>
                        <img src={inc} alt="Im" width="203" height="auto" />
                        <Typography variant="h6">
                          “Cryptocurrency This Week: UAE-Based Crypto Exchange
                          Trillionbit Enters India & More”
                        </Typography>
                        <Link to="#"> Inc 42 </Link>
                      </div>

                      <div>
                        <img
                          src={financial}
                          alt="Im"
                          width="203"
                          height="auto"
                        />
                        <Typography variant="h6">
                          “UAE DIGITAL CURRENCY EXCHANGE MAJOR Trillionbit
                          ENTERS INDIA”
                        </Typography>
                        <Link to="#"> Financial IT </Link>
                      </div>

                      <div>
                        <img src={amb} alt="Im" width="203" height="auto" />
                        <Typography variant="h6">
                          “India welcomes UAE’s digital asset exchange
                          Trillionbit”
                        </Typography>
                        <Link to="#"> AMB CRYPTO </Link>
                      </div>

                      <div>
                        <img src={theweek} alt="Im" width="203" height="auto" />
                        <Typography variant="h6">
                          “Bitcoin’s dream run expected to continue as price
                          crosses $19,000”
                        </Typography>
                        <Link to="#"> THE WEEK </Link>
                      </div>

                      <div>
                        <img
                          src={zawyaImg}
                          alt="Im"
                          width="203"
                          height="auto"
                        />
                        <Typography variant="h6">
                          “UAE-based blockchain trading platform launches secure
                          cryptocurrency wallet with cash deposit service”
                        </Typography>
                        <Link to="#"> Thomson Reuters Zawya </Link>
                      </div>
                      <div>
                        <img
                          src={arabianImg}
                          alt="Im"
                          width="203"
                          height="auto"
                        />
                        <Typography variant="h6">
                          “New crypto wallet, trading platform launches in the
                          UAE and India”
                        </Typography>
                        <Link to="#"> Arabian Business </Link>
                      </div>
                      <div>
                        <img src={menaImg} alt="Im" width="203" height="auto" />
                        <Typography variant="h6">
                          “Cryptocurrency Exchange Trillionbit Launches in the
                          UAE and India”
                        </Typography>
                        <Link to="#"> Mena Herald </Link>
                      </div>
                    </CarosalRes>
                  </div>
                </Grid>

                <Grid item xs={12} sm={5} md={6}>
                  <div className="featuredText">
                    <img src={featureImg} alt="Im" width="86" height="auto" />

                    <Typography variant="h2">As featured on...</Typography>

                    <Typography variant="h6" className="text">
                      We have been acknowledged by some of the biggest and
                      highly regarded news platforms on the internet.
                    </Typography>

                    <div className="homelogos">
                      {/* <ListItem> 
                                <ListItemText> 

                                </ListItemText>
                            </ListItem> */}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const landingStyle = {
  activeChip: {
    backgroundColor: "#17294e",
    margin: 5,
    color: "#fff",
    width: 70,
  },
  disableChip: { backgroundColor: "#e0e0e0", margin: 5, width: 70 },
};

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  subscribeToNewsletter: PropTypes.func.isRequired,
  getChartData: PropTypes.func.isRequired,
  getMarketStatusToday: PropTypes.func.isRequired,
  getAvailaleMarkets: PropTypes.func.isRequired,
  getMarketLast: PropTypes.func.isRequired,
  getBtxMarketData: PropTypes.func.isRequired,
  getBtxAedMarketData: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  trading: state.trading,
  wallet: state.wallet,
});

export default connect(mapStateToProp, {
  subscribeToNewsletter,
  getChartData,
  getMarketStatusToday,
  getAvailaleMarkets,
  getMarketLast,
  getBtxMarketData,
  getBtxAedMarketData,
  getActiveAssets,
})(withStyles(themeStyles)(Landing));
