import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  Tab,
  Tabs,
  Chip,
} from "@mui/material";

import isEmpty from "../../validation/isEmpty";
import { getUserProfile } from "../../actions/userActions";
import {
  getTradingLevels,
  getInrTradingLevels,
  getAgentTradingLevels,
  getSubAgentTradingLevels,
  getUsdTradingLevels,
} from "../../actions/tradingActions";

import btcLogo from "../../assets/img/coins/btc.webp";
import bchLogo from "../../assets/img/coins/bch.webp";
import ltcLogo from "../../assets/img/coins/ltc.webp";
import xrpLogo from "../../assets/img/coins/xrp.webp";
import ethLogo from "../../assets/img/coins/eth.webp";
import aedLogo from "../../assets/img/coins/aed.webp";
import inrSymbol from "../../assets/img/coins/inr.webp";
import usdSymbol from "../../assets/img/coins/usd.webp";

import apiUrl from "../config";
import "../../assets/css/home.css";
let CurrencyFormat = require("react-currency-format");

class Fees extends Component {
  componentDidMount() {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
  }

  state = {
    value: "",
    walletTabValue: "wallet",
    activityTabValue: "activity",
    anchorEl: null,
    anchorCurrencyEl: null,

    series: [
      {
        name: "price",
        data: [30, 40, 70, 91, 125],
      },
    ],
    btcWithdrawalFee: 0.0001,
    bchWithdrawalFee: 0.001,
    ltcWithdrawalFee: 0.001,
    xrpWithdrawalFee: 0.1,
    ethWithdrawalFee: 0.003,
    currentCurrency: "AED",
  };

  componentDidMount = async () => {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
    await this.props.getTradingLevels();
    await this.props.getInrTradingLevels();
    // await this.props.getAgentTradingLevels();
    // await this.props.getSubAgentTradingLevels();
    await this.props.getUsdTradingLevels();
    if (this.props.auth.isAuthenticated) {
      await this.props.getUserProfile(this.props.auth.user.id);
    }
    this.getWithdrawalFee();
  };

  handleWalletChange(event, newValue) {
    this.setState({ walletTabValue: newValue });
  }

  handleActivityChange(event, newValue) {
    this.setState({ activityTabValue: newValue });
  }

  handleMainMenuClick = (event, value) => {
    if (value === "currency") {
      this.setState({ anchorCurrencyEl: event.currentTarget });
    }

    if (value === "profile") {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null, anchorCurrencyEl: null });
  };

  getWithdrawalFee = async () => {
    let coins = ["BTC", "BCH", "LTC", "XRP", "ETH"];
    for (let coin of coins) {
      await axios
        .get(`${apiUrl}/api/guest/assets/withdraw_fee/${coin}`)
        .then((res) => {
          if (coin === "BTC") {
            this.setState({
              btcWithdrawalFee: res.data === 0 ? 0.0001 : res.data,
            });
          }
          if (coin === "BCH") {
            this.setState({
              bchWithdrawalFee: res.data === 0 ? 0.001 : res.data,
            });
          }
          if (coin === "LTC") {
            this.setState({
              ltcWithdrawalFee: res.data === 0 ? 0.001 : res.data,
            });
          }
          if (coin === "XRP") {
            this.setState({
              xrpWithdrawalFee: res.data === 0 ? 0.1 : res.data,
            });
          }
          if (coin === "ETH") {
            this.setState({
              ethWithdrawalFee: res.data === 0 ? 0.003 : res.data,
            });
          }
        });
    }
  };

  tradingLevel = (tradingData) => {
    let tradingLevelData = [];
    if (tradingData?.aedTrading)
      switch (this.state.currentCurrency) {
        case "AED":
          tradingLevelData = tradingData.aedTrading
            ? tradingData.aedTrading
            : [];
          break;

        case "USD":
          tradingLevelData = tradingData.usdTrading
            ? tradingData.usdTrading
            : [];
          break;

        case "INR":
          tradingLevelData = tradingData.inrTrading
            ? tradingData.inrTrading
            : [];

          break;

        default:
          tradingLevelData = tradingData.aedTrading
            ? tradingData.aedTrading
            : [];
      }
    if (tradingLevelData && Object.keys(tradingLevelData).length > 0)
      return tradingLevelData.map((item) => (
        <ListItem key={item.name} className="body">
          <div className="td">Level {item.name}</div>
          <div className="td">
            {this.state.currentCurrency === "INR" ? (
              <Typography variant="body2" className="">
                {new Intl.NumberFormat("en-IN").format(item.fromAmount) === "∞"
                  ? ""
                  : "₹ "}
                {new Intl.NumberFormat("en-IN").format(item.fromAmount)}
              </Typography>
            ) : new Intl.NumberFormat("en-IN").format(item.fromAmount) ===
              "∞" ? (
              <Typography variant="body2" className="">
                ∞
              </Typography>
            ) : (
              <Typography variant="body2" className="">
                <CurrencyFormat
                  value={
                    !isEmpty(item.fromAmount)
                      ? parseFloat(item.fromAmount).toFixed(2)
                      : 0.0
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={`${
                    this.state.currentCurrency === "INR"
                      ? "₹ "
                      : this.state.currentCurrency === "USD"
                      ? "$"
                      : ""
                  } `}
                  suffix={`${
                    this.state.currentCurrency === "AED" ? " د.إ" : ""
                  } `}
                />
              </Typography>
            )}
          </div>
          <div className="td">
            {this.state.currentCurrency === "INR" ? (
              <Typography variant="body2" className="">
                {new Intl.NumberFormat("en-IN").format(item.toAmount) === "∞"
                  ? ""
                  : "₹ "}
                {new Intl.NumberFormat("en-IN").format(item.toAmount)}
              </Typography>
            ) : new Intl.NumberFormat("en-IN").format(item.toAmount) === "∞" ? (
              <Typography variant="body2" className="">
                ∞
              </Typography>
            ) : (
              <Typography variant="body2" className="">
                <CurrencyFormat
                  value={
                    !isEmpty(item.toAmount)
                      ? parseFloat(item.toAmount).toFixed(2)
                      : 0.0
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={`${
                    this.state.currentCurrency === "INR"
                      ? "₹ "
                      : this.state.currentCurrency === "USD"
                      ? "$"
                      : ""
                  } `}
                  suffix={`${
                    this.state.currentCurrency === "AED" ? " د.إ" : ""
                  } `}
                />
              </Typography>
            )}
          </div>
          <div className="td">{item.maker_fee}</div>
          <div className="td">{item.taker_fee}</div>
        </ListItem>
      ));
    return null;
  };

  render() {
    const { user, tradingLevel } = this.props;
    const tradingLevelData = this.tradingLevel(tradingLevel);
    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Fees | TrillionBit </title>
          <meta
            name="keywords"
            content="bitcoin india, bitcoin india price today, bitcoin in india legal, bitcoin india price live, bitcoin indian rupees, how to buy bitcoin india, bitcoin india latest news, btc price in india today, btc trading in india, btc in india legal, btc india news, how to buy ripple, buy xrp india, crypto exchange, crypto india, crypto dubai, buy bitcoin dubai, buy and sell bitcoin, btc price inr, buy ripple, buy ethereum, bitcoin exchange, bitcoin trading, xrp india, btc mumbai, trillionbit, trillionbit india, trillionbit crypto"
          />
          <meta property="og:url" content="https://www.trillionbit.com/fees" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Fees | TrillionBit" />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Fees | TrillionBit" />
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
        <div
          className={
            this.props.auth.isAuthenticated
              ? "paddingTopbody"
              : "paddingTopbody2"
          }
        >
          {" "}
        </div>
        <Container
          maxWidth="lg"
          className="mainbody bg-white"
          fixed={false}
          style={feesStyle.mainContainer}
        >
          <Grid container>
            <Grid item xs={12} md={1} />
            <Grid item xs={12} md={10}>
              <Typography variant="h4" className="feeTitle">
                Fee Schedule
              </Typography>

              <Card className="feesCard">
                <CardHeader
                  title={
                    <Tabs
                      scrollButtons="auto"
                      variant="scrollable"
                      onChange={this.handleWalletChange.bind(this)}
                      value={this.state.walletTabValue}
                      textColor="primary"
                      indicatorColor="primary"
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <Tab
                        value="wallet"
                        label={
                          <div className="tabValue">
                            <div className="title">Trading Fees</div>
                          </div>
                        }
                      />

                      <Tab
                        value="exchange"
                        label={
                          <div className="tabValue">
                            <div className="title">
                              Deposit & Withdrawal Fees
                            </div>
                          </div>
                        }
                      />
                    </Tabs>
                  }
                />

                <CardContent>
                  {this.state.walletTabValue === "wallet" ? (
                    <div className="tradingTab">
                      <Typography variant="h4" className="title">
                        Trading Fees
                      </Typography>

                      <Typography variant="h6" className="text">
                        At 00:00 AM (UTC) every day, your trading volume over
                        the past 30-day period is evaluated. Your Tier level and
                        corresponding maker/taker fees are updated at the same
                        time.
                      </Typography>

                      <hr />

                      <Grid container className="tradingboxRow">
                        {/* <Grid item xs={12} md={5} className="col">
                                                        <Typography variant="h6" className=""> 
                                                            Your past 30-day trading volume (in BTC)::
                                                        </Typography>

                                                        <div  className="content">
                                                            <Typography variant="h5" className=""> 
                                                                ? BTC
                                                            </Typography>

                                                            <Typography variant="h5" className="FL-right"> 
                                                                50.00 BTC
                                                            </Typography>
                    
                                                        </div>

                                                        <div className="content progress-bar">
                                                            
                                                        </div>

                                                        <div className="content vipRow">
                                                            <Typography variant="h5" className=""> 
                                                                VIP 0
                                                            </Typography>

                                                            <Typography variant="h5" className="FL-right"> 
                                                                VIP 1
                                                            </Typography>
                    
                                                        </div>                                
                                                    </Grid> 

                                                    <Grid item xs={12} md={2}  className="col flex">
                                                            <Typography variant="h3" className=""> 
                                                                &
                                                            </Typography>
                                                    </Grid> */}

                        {/* <Grid item xs={12} md={5}  className="col">
                                                        <Typography variant="h6" className=""> 
                                                            Your past 30-day trading volume (in BTC)::
                                                        </Typography>

                                                        <div  className="content">
                                                            <Typography variant="h5" className=""> 
                                                                ? BTC
                                                            </Typography>

                                                            <Typography variant="h5" className="FL-right"> 
                                                                50.00 BTC
                                                            </Typography>
                    
                                                        </div>

                                                        <div className="content progress-bar">
                                                            
                                                        </div>

                                                        <div className="content vipRow">
                                                            <Typography variant="h5" className=""> 
                                                                VIP 0
                                                            </Typography>

                                                            <Typography variant="h5" className="FL-right"> 
                                                                VIP 1
                                                            </Typography>
                    
                                                        </div>                                
                                                    </Grid>   */}

                        <Grid container className="">
                          <Grid item md={6} xs={12}>
                            <Typography variant="h4" className="title">
                              Your Trading Fee Level:{" "}
                              {/* {!isEmpty(user.userProfile) ? user.userProfile.traderLevel : 1} */}
                              {this.props.auth.isAuthenticated ? (
                                !isEmpty(user.userProfile) ? (
                                  user.userProfile.traderLevel
                                ) : (
                                  1
                                )
                              ) : (
                                <Link to="/login"> Please Log in </Link>
                              )}
                            </Typography>
                          </Grid>

                          <Grid item md={6} xs={12} className="makerLink">
                            <div className="text-right">
                              <Typography variant="h6" className="">
                                <Link to="#" class="tooltip">
                                  {" "}
                                  What does “Maker/Taker” mean?
                                  <span class="tooltiptext">
                                    Makers “create or make a market” for other
                                    traders and bring liquidity to an exchange.
                                    Takers remove liquidity by “taking”
                                    available orders that are filled immediately
                                  </span>
                                </Link>
                                {/* <Link to="/referral-info">  Refer Friends to Earn </Link>   */}
                              </Typography>
                            </div>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              style={{ textAlign: "right" }}
                            >
                              <Chip
                                label="AED"
                                onClick={() =>
                                  this.setState({ currentCurrency: "AED" })
                                }
                                style={
                                  this.state.currentCurrency === "AED"
                                    ? landingStyle.activeChip
                                    : landingStyle.disableChip
                                }
                                // color={this.state.currentCurrency === 'AED' ? 'primary' : ''}
                                // style={{margin: 5}}
                              />
                              <Chip
                                label="USD"
                                onClick={() =>
                                  this.setState({ currentCurrency: "USD" })
                                }
                                style={
                                  this.state.currentCurrency === "USD"
                                    ? landingStyle.activeChip
                                    : landingStyle.disableChip
                                }
                              />
                              <Chip
                                label="INR"
                                onClick={() =>
                                  this.setState({ currentCurrency: "INR" })
                                }
                                style={
                                  this.state.currentCurrency === "INR"
                                    ? landingStyle.activeChip
                                    : landingStyle.disableChip
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <div className="tableResponsiveMaker">
                          <List className="maker-taker-table">
                            <ListItem className="head">
                              <div className="td">Level</div>
                              <div className="td">Trade Volume Min</div>
                              <div className="td">Trade Volume Max</div>
                              <div className="td">Maker Fee (%)</div>
                              <div className="td">Taker Fee (%)</div>
                            </ListItem>
                            {tradingLevelData}
                          </List>
                        </div>
                      </Grid>
                    </div>
                  ) : (
                    <div className="exchangeData">
                      <div className="tradingTab">
                        <Typography variant="h4" className="title">
                          Deposit & Withdrawal Fees
                        </Typography>

                        <div className="tableResponsiveMaker">
                          <List className="Deposit-Withdrawal-table">
                            <ListItem className="head">
                              <div className="td">Symbol</div>
                              <div className="td">Name</div>
                              <div className="td">Minimum Withdrawal</div>
                              <div className="td">Deposit fee</div>
                              <div className="td">Withdrawal Fee</div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={btcLogo} alt="c1" />
                                BTC
                              </div>
                              <div className="td">Bitcoin</div>
                              <div className="td">0.001</div>
                              <div className="td">Free</div>
                              <div className="td">
                                {this.state.btcWithdrawalFee}
                              </div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={ltcLogo} alt="c1" />
                                LTC
                              </div>
                              <div className="td">Litecoin</div>
                              <div className="td">0.002</div>
                              <div className="td">Free</div>
                              <div className="td">
                                {this.state.ltcWithdrawalFee}
                              </div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={ethLogo} alt="c1" />
                                ETH
                              </div>
                              <div className="td">Ethereum</div>
                              <div className="td">0.01</div>
                              <div className="td">Free</div>
                              <div className="td">
                                {this.state.ethWithdrawalFee}
                              </div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={bchLogo} alt="c1" />
                                BCH
                              </div>
                              <div className="td">Bitcoin Cash</div>
                              <div className="td">0.002</div>
                              <div className="td">Free</div>
                              <div className="td">
                                {this.state.bchWithdrawalFee}
                              </div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={xrpLogo} alt="c1" />
                                XRP
                              </div>
                              <div className="td">XRP</div>
                              <div className="td">0.5</div>
                              <div className="td">Free</div>
                              <div className="td">
                                {this.state.xrpWithdrawalFee}
                              </div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={aedLogo} alt="c1" />
                                AED
                              </div>
                              <div className="td">UAE Dirham</div>
                              <div className="td">200</div>
                              <div className="td">Free</div>
                              <div className="td">Free</div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={inrSymbol} alt="c1" />
                                INR
                              </div>
                              <div className="td">Indian rupee</div>
                              <div className="td">1000</div>
                              <div className="td">Free</div>
                              <div className="td">Free</div>
                            </ListItem>

                            <ListItem className="body">
                              <div className="td">
                                <img src={usdSymbol} alt="c1" />
                                USD
                              </div>
                              <div className="td">US Dollar</div>
                              <div className="td">100</div>
                              <div className="td">Free</div>
                              <div className="td">Free</div>
                            </ListItem>
                          </List>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

const feesStyle = {
  mainContainer: {},
  roundedButton: {
    margin: 2,
  },
};

const landingStyle = {
  activeChip: {
    backgroundColor: "#17294e",
    margin: 5,
    color: "#fff",
    width: 70,
  },
  disableChip: { backgroundColor: "#e0e0e0", margin: 5, width: 70 },
};

Fees.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getUserProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  tradingLevel: state.tradingLevel,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  getUserProfile,
  getTradingLevels,
  getInrTradingLevels,
  getUsdTradingLevels,
  getAgentTradingLevels,
  getSubAgentTradingLevels,
})(Fees);
