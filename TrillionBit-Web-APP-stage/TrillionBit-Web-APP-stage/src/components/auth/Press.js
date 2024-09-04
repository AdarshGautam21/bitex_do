import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { withStyles } from "@mui/styles";

import { Container, Grid, Typography } from "@mui/material";

import themeStyles from "../../assets/themeStyles";

import { getChartData, getMarketStatusToday } from "../../actions/orderActions";
import { getAvailaleMarkets, getMarketLast } from "../../actions/walletActions";
import { subscribeToNewsletter } from "../../actions/userActions";

import isEmpty from "../../validation/isEmpty";

import national from "../../assets/img/press/national.webp";
import ameinfo from "../../assets/img/press/ameinfo.webp";
import btcNews from "../../assets/img/press/btc-news.webp";
import arabian from "../../assets/img/press/arabian.webp";
import zawya from "../../assets/img/press/zawya.webp";
import mena from "../../assets/img/press/mena.webp";

import amb from "../../assets/img/press/amb.webp";
import bfsi from "../../assets/img/press/The_Economic_Times_logo.webp";
import bi from "../../assets/img/press/Bi.webp";
import financial from "../../assets/img/press/Financial_IT.webp";
import inc from "../../assets/img/press/inc.webp";
import msn from "../../assets/img/press/msn.webp";
import theweek from "../../assets/img/press/theweek.webp";
import entrepreneur from "../../assets/img/press/entrepreneur.webp";
import FinancialExpress from "../../assets/img/press/FinancialExpress.webp";
import toi from "../../assets/img/press/toi-logo.webp";
import techGraph from "../../assets/img/press/techGraph.webp";

import "../../assets/css/home.css";

export class Press extends Component {
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

  componentDidMount() {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
  }

  componentWillUnmount = () => {
    //   window.fcWidget.destroy();
  };

  componentWillReceiveProps = (nextProps) => {
    if (!isEmpty(nextProps.trading.tradingChartData)) {
      console.log("Loading charts");
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
          <title>Press | TrillionBit</title>
          <meta
            name="description"
            content="TrillionBit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
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

        <div className="paddingTopLandingbody">
          <div className="slider">
            <Container>
              <Grid container>
                <Grid item xs={12} className="oneCenterBox">
                  <div className="slideText">
                    <h1 className="">Press</h1>
                    <Typography variant="body1" className="subtext">
                      News and Announcements about TrillionBit Digital Asset
                      Exchange. <br />
                      Reach us at{" "}
                      <span className="pressEmail"> press@bitex.com </span>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className="pressSection bg-white">
            <Container>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <div className="pressBox">
                    <Typography variant="h6">MAY 21, 2021</Typography>

                    <img src={toi} alt="entrepreneur" />

                    <Typography variant="h3">
                      Don’t panic-sell bitcoin in crash: Crypto startups
                    </Typography>

                    <Typography variant="h5" className="text">
                      MUMBAI: Indian crypto entrepreneurs are urging investors
                      not to panic-sell assets like bitcoin and ether after
                      prices crashed over 30% this week. According to
                      cryptocurrency exchanges, investors should decide if they
                      can sustain with locked funds for 3-4 years, and use only
                      risk capital for what would be more of an allocation for
                      long-term appreciation.
                      <a
                        className="link"
                        href="https://timesofindia.indiatimes.com/business/india-business/dont-panic-sell-bitcoin-in-crash-crypto-startups/articleshow/82811766.cms"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">MAY 17, 2021</Typography>

                    <img src={bi} alt="entrepreneur" />

                    <Typography variant="h3">
                      Crypto exchange Trillionbit new utility token aims to
                      simplify trading in rupee
                    </Typography>

                    <Typography variant="h5" className="text">
                      Crypto exchange platform Trillionbit, on Wednesday,
                      announced its TrillionBit Coin (BTX) in over 50 countries.
                      According to Trillionbit, which is based in the United
                      Arab Emirates (UAE), the total support of BTX will be
                      capped at 1 billion to be issued by Global Cryptocurrency
                      Exchange, and 20% of this will be available for public
                      sale through an Initial Exchange Offering (IEO).
                      <a
                        className="link"
                        href="https://www.businessinsider.in/cryptocurrency/news/crypto-exchange-bitexs-new-utility-token-aims-to-simplify-trading-in-rupee/articleshow/82576228.cms"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">Apr 26, 2021</Typography>

                    <img src={bi} alt="entrepreneur" />

                    <Typography variant="h3">
                      TrillionBit to provide mandatory cryptocurrency investment
                      disclosure report
                    </Typography>

                    <Typography variant="h5" className="text">
                      UAE-based global cryptocurrency Exchange TrillionBit
                      announced that it has commenced providing ‘Investment
                      Declaration Report’ for all its retail and institutional
                      investors, becoming the first Exchange in India to comply
                      with the recent amendments made to the Companies Act 2013
                      by the Ministry of Corporate Affairs.
                      <a
                        className="link"
                        href="https://techgraph.co/crypto-currency/bitex-to-provide-mandatory-cryptocurrency-investment-disclosure-report/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">January 07, 2021</Typography>

                    <img src={FinancialExpress} alt="FinancialExpress" />

                    <Typography variant="h3">
                      Bitcoin boom: The rise of cryptocurrencies and Indian
                      crypto exchanges
                    </Typography>

                    <Typography variant="h5" className="text">
                      As of January 1 2021, Bitcoin was trading as high as Rs
                      23,61,651. In the period between January 2020 to December
                      2020, the crypto currency grew 317.2%, according to
                      YCharts. Bitcoin has proven to be safe, trustworthy and a
                      viable mode of transaction globally. While cryptocurrency
                      mining is a separate business of a large technical scale
                      altogether,trading cryptocurrencies is what is relevant to
                      the masses.
                      <a
                        className="link"
                        href="https://www.financialexpress.com/market/bitcoin-boom-the-rise-of-cryptocurrencies-and-indian-crypto-exchanges/2165774/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">December 25, 2020</Typography>

                    <img src={entrepreneur} alt="entrepreneur" />

                    <Typography variant="h3">
                      Bitcoin Wave This Time Sees Mature Investor Participation
                    </Typography>

                    <Typography variant="h5" className="text">
                      Ashish Nitin Patil made his first bet on bitcoin in late
                      2017 amidst the brouhaha around cryptocurrencies. He
                      jumped in to make a quick buck, like most investors back
                      in the day. But, as he learned more about the value
                      proposition of the digital tokens, Patil stuck around.
                      <a
                        className="link"
                        href="https://www.entrepreneur.com/article/362334"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 25, 2020</Typography>

                    <img src={theweek} alt="national" />

                    <Typography variant="h3">
                      Bitcoin’s dream run expected to continue as price crosses
                      $19,000
                    </Typography>

                    <Typography variant="h5" className="text">
                      Over the last few months, Bitcoin has surged handsomely on
                      the Nifty and has had a healthy run with the price
                      momentarily crossing $19,000 on November 17. This has been
                      due to the increasing investment from institutional
                      investors, investment banks and more importantly payment
                      companies.
                      <a
                        className="link"
                        href="https://www.theweek.in/news/biz-tech/2020/11/25/bitcoins-dream-run-expected-to-continue-as-price-crosses-19000.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 19, 2020</Typography>

                    <img src={msn} alt="national" />

                    <Typography variant="h3">
                      Bitcoin is on a record run, surging past $18,000 — here’s
                      why the cryptocurrency is booming again
                    </Typography>

                    <Typography variant="h5" className="text">
                      Bitcoin, everyone’s favourite cryptocurrency, is not only
                      out of the woods, but is witnessing a bull run. Bitcoin
                      has bounced back from its lowest point in March at $4,900
                      and has already crossed $18,000 – its highest since
                      December 2017. It is inching closer towards the all-time
                      high of $20,000.
                      <a
                        className="link"
                        href="https://www.msn.com/en-in/money/topstories/bitcoin-is-on-a-record-run-surging-past-18-000-here-s-why-the-cryptocurrency-is-booming-again/ar-BB1baabC?li=AAgfW3S"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 19, 2020</Typography>

                    <img src={entrepreneur} alt="entrepreneur" />

                    <Typography variant="h3">
                      Bitcoin Wave This Time Sees Mature Investor Participation
                    </Typography>

                    <Typography variant="h5" className="text">
                      Digital-asset exchanges are pointing to the trend that
                      this time investors are not entering the space in the heat
                      of the market sentiment. Ashish Nitin Patil made his first
                      bet on bitcoin in late 2017 amidst the brouhaha around
                      cryptocurrencies. He jumped in to make a quick buck, like
                      most investors back in the day. But, as he learned more
                      about the value proposition of the digital tokens, Patil
                      stuck around.
                      <a
                        className="link"
                        href="https://www.entrepreneur.com/article/362334"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 19, 2020</Typography>

                    <img src={bi} alt="national" />

                    <Typography variant="h3">
                      "Bitcoin is on a record run, surging past $18,000 — here’s
                      why the cryptocurrency is booming again
                    </Typography>

                    <Typography variant="h5" className="text">
                      Bitcoin, everyone’s favourite cryptocurrency, is not only
                      out of the woods, but is witnessing a bull run. Bitcoin
                      has bounced back from its lowest point in March at $4,900
                      and has already crossed $18,000 – its highest since
                      December 2017. It is inching closer towards the all-time
                      high of $20,000.{" "}
                      <a
                        className="link"
                        href="https://www.businessinsider.in/tech/news/bitcoin-is-on-a-record-run-surging-past-18000-heres-why-the-cryptocurrency-is-booming-again/articleshow/79301688.cms?utm_source=google_newsstand&utm_medium=google_rssfeed&utm_campaign=news_referral"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 10, 2020</Typography>

                    <img src={bfsi} alt="national" />

                    <Typography variant="h3">
                      UAE-based digital exchange TrillionBit forays into India
                      with wallet and trading platform
                    </Typography>

                    <Typography variant="h5" className="text">
                      Trillionbit, a UAE based digital asset exchange, has
                      announced its launch into the Indian market, through its
                      cryptocurrency wallet and trading platform. Launched in
                      2018, Trillionbit launch comes months after the Supreme
                      Court lifted the ban on cryptocurrency trading.
                      <a
                        className="link"
                        href="https://bfsi.economictimes.indiatimes.com/news/fintech/uae-based-digital-exchange-bitex-forays-into-india-with-wallet-and-trading-platform/79146963"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 10, 2020</Typography>

                    <img src={inc} alt="national" />

                    <Typography variant="h3">
                      Cryptocurrency This Week: UAE-Based Crypto Exchange
                      Trillionbit Enters India & More
                    </Typography>

                    <Typography variant="h5" className="text">
                      Trillionbit's entry comes at a time when several domestic
                      and foreign players commenced operations in India after
                      the Supreme Court reversed the ban on cryptocurrency trade
                      in March 2020.
                      <a
                        className="link"
                        href="https://inc42.com/buzz/cryptocurrency-this-week-uae-based-exchange-bitex-enters-india/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 10, 2020</Typography>

                    <img src={financial} alt="national" />

                    <Typography variant="h3">
                      UAE DIGITAL CURRENCY EXCHANGE MAJOR Trillionbit ENTERS
                      INDIA
                    </Typography>

                    <Typography variant="h5" className="text">
                      Trillionbit, the UAE’s most secure digital asset exchange,
                      has made its India foray with the launch of its
                      fully-regulated cryptocurrency wallet and professional
                      trading platform. The company, established in 2018, has
                      its headquarters in Mumbai.
                      <a
                        className="link"
                        href="https://financialit.net/news/cryptocurrencies/uae-digital-currency-exchange-major-bitex-enters-india#:~:text=Bitex%2C%20the%20UAE's%20most%20secure,has%20its%20headquarters%20in%20Mumbai"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 10, 2020</Typography>

                    <img src={amb} alt="national" />

                    <Typography variant="h3">
                      India welcomes UAE’s digital asset exchange Trillionbit
                    </Typography>

                    <Typography variant="h5" className="text">
                      India has noted an uptick in crypto users over the past
                      year. This surge in the crypto users can mainly be
                      attributed to the Supre Court’s decision to quash the
                      Central Bank’s circular that called for a banking ban for
                      crypto transactions in 2018. This judgment has temporarily
                      also impacted user-perspective regarding crypto in the
                      country as more and more people are now joining the crypto
                      bandwagon.
                      <a
                        className="link"
                        href="https://eng.ambcrypto.com/india-welcomes-uaes-digital-asset-exchange-bitex/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">April 14, 2019</Typography>

                    <img src={national} alt="national" />

                    <Typography variant="h3">
                      "Generation Start-up: TrillionBit UAE lets cryptocurrency
                      investors trade in cash" - The National
                    </Typography>

                    <Typography variant="h5" className="text">
                      If entrepreneur Monark Modi could do it all over again, he
                      would have rolled out his cryptocurrency trading platform,
                      TrillionBit UAE, a year earlier than its November 2018
                      launch.{" "}
                      <a
                        className="link"
                        href="https://www.thenationalnews.com/business/money/generation-start-up-bitex-uae-lets-cryptocurrency-investors-trade-in-cash-1.848340"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">January 28, 2019</Typography>

                    <img src={ameinfo} alt="ameinfo" />

                    <Typography variant="h3">
                      "Dubai’s TrillionBit says ‘Now is the time to buy crypto"
                      - AMEInfo
                    </Typography>

                    <Typography variant="h5" className="text">
                      AMEinfo recently conducted a private interview with Monark
                      Modi, Founder, and CEO of TrillionBit UAE. TrillionBit is
                      a Dubai-based online professional cryptocurrency trading
                      platform that provides a beginner’s guide to getting
                      started to those considering an investment in
                      cryptocurrencies.{" "}
                      <a
                        className="link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.ameinfo.com/industry/finance/dubai-bitex-crypto"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 23, 2018</Typography>

                    <img src={btcNews} alt="ameinfo" />

                    <Typography variant="h3">
                      "Cryptocurrency Exchange TrillionBit Launches in the UAE"
                      - Bitcoin
                    </Typography>

                    <Typography variant="h5" className="text">
                      TrillionBit has officially launched as the United Arab
                      Emirates’ (UAE) newest digital asset exchange. The
                      Dubai-based trading platform will initially support
                      bitcoin core, bitcoin cash, ethereum and litecoin.
                      TrillionBit also announced the launch of a cryptocurrency
                      wallet that offers an additional cash deposit service,
                      according to media reports.{" "}
                      <a
                        className="link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://news.bitcoin.com/cryptocurrency-exchange-bitex-launches-in-the-uae/"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 23, 2018</Typography>

                    <img src={arabian} alt="arabian" />

                    <Typography variant="h3">
                      "New crypto wallet, trading platform launches in the UAE"
                      - Arabian Business
                    </Typography>

                    <Typography variant="h5" className="text">
                      New crypto wallet, trading platform launches in the UAE.{" "}
                      <a
                        className="link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.arabianbusiness.com/banking-finance/408588-new-crypto-wallet-trading-platform-launches-in-the-uae"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 23, 2018</Typography>

                    <img src={zawya} alt="zawya" />

                    <Typography variant="h3">
                      "UAE-based blockchain trading platform launches secure
                      cryptocurrency wallet with cash deposit service" - Thomson
                      Reuters Zawya
                    </Typography>

                    <Typography variant="h5" className="text">
                      UAE-based blockchain trading platform launches secure
                      cryptocurrency wallet with cash deposit service.{" "}
                      <a
                        className="link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.zawya.com/mena/en/press-releases/story/UAEbased_blockchain_trading_platform_launches_secure_cryptocurrency_wallet_with_cash_deposit_service-ZAWYA20181122052649/"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
                  </div>

                  <div className="pressBox">
                    <Typography variant="h6">November 21, 2018</Typography>

                    <img src={mena} alt="mena" />

                    <Typography variant="h3">
                      "Cryptocurrency Exchange TrillionBit Launches in the UAE"
                      - MENA Herald
                    </Typography>

                    <Typography variant="h5" className="text">
                      TrillionBit UAE offers customers multiple cryptocurrencies
                      including Bitcoin, Ethereum, Litecoin and Bitcoin Cash at
                      competitive rates for buying, selling and trading.{" "}
                      <a
                        className="link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.menaherald.com/en/money/finance-investment/uae-based-blockchain-trading-platform-launches-secure-cryptocurrency-wallet"
                      >
                        {" "}
                        Read more...{" "}
                      </a>
                    </Typography>
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

Press.propTypes = {
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
})(withStyles(themeStyles)(Press));
