import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { withStyles } from "@mui/styles";

import { Container, Grid } from "@mui/material";
import { Typography } from "@mui/material";

import themeStyles from "../../assets/themeStyles";

import { getChartData, getMarketStatusToday } from "../../actions/orderActions";
import { getAvailaleMarkets, getMarketLast } from "../../actions/walletActions";
import {
  subscribeToNewsletter,
  getIpLocation,
} from "../../actions/userActions";

import isEmpty from "../../validation/isEmpty";

import btxCoin from "../../assets/img/home/btx-coin.webp";

import btcCoin from "../../assets/img/coins/btc.webp";
import ethCoin from "../../assets/img/coins/eth.webp";
import ltcCoin from "../../assets/img/coins/ltc.webp";
import xrpCoin from "../../assets/img/coins/xrp.webp";

import "../../assets/css/home.css";

const publicIp = require("public-ip");

export class Donate extends Component {
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
        data: [30, 40, 70, 91, 125],
      },
    ],
    marketGraphs: {},
    marketLast: {},
    currentCurrency: "AED",
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
    window.scrollTo(0, 0);
    const currentIpLocation = await getIpLocation(await publicIp.v4());

    this.setState({
      currentCurrency:
        currentIpLocation.country.code === "IN"
          ? "INR"
          : currentIpLocation.country.code === "AE"
          ? "AED"
          : "USD",
    });
    await this.props.getAvailaleMarkets();
    await this.props.getMarketLast();
    let marketList = [];
    let marketLast = this.state.marketLast;
    for (let key in this.props.trading.markets) {
      marketList.push(this.props.trading.markets[key].name);
      marketLast[this.props.trading.markets[key].name] =
        this.props.wallet.marketLasts[this.props.trading.markets[key].name];
      this.setState({ marketLast: marketLast });
    }
    // this.wsConnect(marketList);
    await this.props.getChartData();

    // window.fcWidget.init({
    //     token: "fdca95b8-17a8-449e-a5bc-7f683753a2ba",
    //     host: "https://wchat.freshchat.com",
    // });
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
                data: [30, 40, 70, 91, 125],
              },
            ];
          }
        }
      }
      this.setState({ marketGraphs: marketSeries, exchangeLoader: false });
    }
  };

  wsConnect = (markets) => {
    let ws = new WebSocket("wss://134.209.186.72:8090");

    ws.onopen = async () => {
      this.setState({ ws: ws });
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

  createData = (usd, price, change, chart, trade) => {
    return { usd, price, change, chart, trade };
  };

  subscribeNewsletter = () => {
    console.log(this.state);
  };

  handleInputChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
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

  getMarketLast = (marketName) => {
    if (marketName in this.props.trading.marketLast) {
      return parseFloat(this.props.trading.marketLast[marketName]).toFixed(2);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Helmet>
          {/* <title>TrillionBit - Buy and Sell Bitcoin and Crypto | Ethereum Trading</title> */}
          {/* <meta name="keywords" content="bitcoin india, bitcoin india price today, bitcoin in india legal, bitcoin india price live, bitcoin indian rupees, how to buy bitcoin india, bitcoin india latest news, btc price in india today, btc trading in india, btc in india legal, btc india news, how to buy ripple, buy xrp india, crypto exchange, crypto india, crypto dubai, buy bitcoin dubai, buy and sell bitcoin, btc price inr, buy ripple, buy ethereum, bitcoin exchange, bitcoin trading, xrp india, btc mumbai, trillionbit, trillionbit india, trillionbit crypto" />
            <meta name="description" content="A leading cryptocurrency exchange and multi-signature wallet platform to buy and sell Bitcoin, Ethereum, XRP, Litecoin and Bitcoin Cash." /> */}
          <meta property="og:url" content="https://www.bitex.com" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="TrillionBit | Cryptocurrency Exchange"
          />
          <meta
            property="og:description"
            content="A leading cryptocurrency exchange and multi-signature wallet platform to buy and sell Bitcoin, Ethereum, XRP, Litecoin and Bitcoin Cash."
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

        <div className="paddingTopLandingbody donatepage">
          <div className="slider">
            <Container>
              <Grid container>
                <Grid item xs={12} md={8}>
                  <div className="slideText">
                    <Typography variant="h1" className="">
                      CRYPTO COVID RELIEF FUND
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      India is shaken by the second wave of Corona Virus, and
                      today, she needs you more than ever. Only our humane
                      contributions can beat this pandemic and in this fight, we
                      are all together. This is why, in partnership with major
                      registered NGOs in India, India’s Crypto Community is
                      coming together in opening a Covid Relief Fund. India
                      needs us, and your donations are the best possible way you
                      can support these benevolent organizations while
                      maintaining the protocols.
                    </Typography>

                    <Link to="/register" className="orange">
                      Donate Now
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="cryptoDonationSection">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={4} md={4}>
                  <div className="coinIcon">
                    <img src={btxCoin} alt="bitcoin and crypto exchange" />
                  </div>
                </Grid>

                <Grid item xs={12} sm={8} md={8}>
                  <div className="investorText">
                    <Typography variant="h2">
                      Help India with your <strong> Crypto Donations </strong>{" "}
                      <br />
                    </Typography>

                    <Typography variant="h6" className="text">
                      Here’s a chance for you to help Indians affected by
                      COVID-19. You can now donate your cryptocurrencies (a coin
                      of your choice from the list) and we will match your
                      contribution up to 1BTC.
                    </Typography>

                    <Typography variant="h6" className="text">
                      Here’s a chance for you to help Indians affected by
                      COVID-19. You can now donate your cryptocurrencies (a coin
                      of your choice from the list) and we will match your
                      contribution up to 1BTC.
                    </Typography>

                    <Typography variant="h6" className="text">
                      Here’s a chance for you to help Indians affected by
                      COVID-19. You can now donate your cryptocurrencies (a coin
                      of your choice from the list) and we will match your
                      contribution up to 1BTC.
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="investorSection">
            <Container>
              <Grid container className="DonateTitle">
                <Grid item xs={12}>
                  <Typography variant="h2">
                    You can Donate in <strong> INR </strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                  <div className="investorText">
                    <Typography variant="h2">
                      <strong>
                        {" "}
                        Donate Dry Ration to help families struggling{" "}
                      </strong>
                      With Hunger in Covid.
                    </Typography>

                    <Typography variant="h6" className="text">
                      As the second wave of COVID is rapidly spreading all over
                      India, it is putting vulnerable communities in grave
                      danger. Rapid response teams have been rigorously
                      responding to all these crises, reaching out to the
                      affected families and doing their utmost best.
                    </Typography>

                    <Typography variant="h6" className="text">
                      Amidst all this, it only takes ₹500 to provide one such
                      family with a week’s worth of essentials like Rice, daal,
                      salt, sugar and oil.
                    </Typography>

                    <a
                      href="/donate"
                      rel="noopener noreferrer"
                      target="_blank"
                      variant="body2"
                      color="secondary"
                      className=""
                    >
                      Donate INR
                    </a>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <div className="investorText">
                    <Typography variant="h2">
                      <strong>
                        {" "}
                        Join Hands with UDAY Foundation to provide{" "}
                      </strong>
                      Care Kits and Fight Corona Virus
                    </Typography>

                    <Typography variant="h6" className="text">
                      Throughout the last decade, Uday Foundation has been at
                      the forefront in providing urgent relief materials and aid
                      to the needy during natural calamities, crises, extreme
                      weather conditions etc. Uday Foundation is again standing
                      strong during this global healthcare crisis posed due to
                      Coronavirus.
                    </Typography>

                    <Typography variant="h6" className="text">
                      ​Help us to fight the coronavirus outbreak in India by
                      helping acutely vulnerable people – the homeless.
                    </Typography>

                    <a
                      href="/donate"
                      rel="noopener noreferrer"
                      target="_blank"
                      variant="body2"
                      color="secondary"
                      className=""
                    >
                      Donate INR
                    </a>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="bglightgray covidCoin">
            <Container>
              <Grid container className="DonateTitle">
                <Grid item xs={12}>
                  <Typography variant="h2">
                    You can Donate in <strong> Crypto </strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container className="fourBoxSection">
                <Grid item xs={12} sm={6} md={3}>
                  <div className="wrapBox">
                    <div className="imgBox">
                      <img src={btcCoin} alt="Im" />
                    </div>

                    <Typography variant="h3" className="title">
                      Donate Bitcoin(BTC)
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Donate via Bitcoin. Please transfer your funds by tapping
                      on DONATE NOW.
                    </Typography>
                    <Link to="#" className="">
                      Donate Now
                    </Link>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <div className="wrapBox">
                    <div className="imgBox">
                      <img src={ethCoin} alt="Im" />
                    </div>

                    <Typography variant="h3" className="title">
                      Donate Ethereum (ETH)
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Donate via Ethereum. Please transfer your funds by tapping
                      on DONATE NOW.
                    </Typography>
                    <Link to="#" className="">
                      Donate Now
                    </Link>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <div className="wrapBox">
                    <div className="imgBox">
                      <img src={ltcCoin} alt="Im" />
                    </div>

                    <Typography variant="h3" className="title">
                      Donate Litecoin (LTC)
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Donate via Litecoin. Please transfer your funds by tapping
                      on DONATE NOW.
                    </Typography>
                    <Link to="#" className="">
                      Donate Now
                    </Link>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <div className="wrapBox">
                    <div className="imgBox">
                      <img src={xrpCoin} alt="Im" />
                    </div>

                    <Typography variant="h3" className="title">
                      Donate Ripple (XRP)
                    </Typography>

                    <Typography variant="body2" className="subText">
                      Donate via XRP. Please transfer your funds by tapping on
                      DONATE NOW.
                    </Typography>
                    <Link to="#" className="">
                      Donate Now
                    </Link>
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

Donate.propTypes = {
  auth: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  trading: PropTypes.object.isRequired,
  subscribeToNewsletter: PropTypes.func.isRequired,
  getChartData: PropTypes.func.isRequired,
  getMarketStatusToday: PropTypes.func.isRequired,
  getAvailaleMarkets: PropTypes.func.isRequired,
  getMarketLast: PropTypes.func.isRequired,
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
})(withStyles(themeStyles)(Donate));
