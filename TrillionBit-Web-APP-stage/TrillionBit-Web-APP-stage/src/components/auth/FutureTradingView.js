import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { withStyles } from "@mui/styles";

import { List, ListItem, Typography, Link } from "@mui/material";

import themeStyles from "../../assets/themeStyles";
import "../../assets/css/home.css";

class FutureTradingView extends Component {
  componentDidMount() {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div
          className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}
        ></div>
        <div className="paddingTopbody"> </div>

        <div className="slider">
          <Container>
            <Grid container>
              <Grid item xs={12} sm={6} md={7} className="">
                <div className="subpageTitle">
                  <Typography variant="h5" className="subtext">
                    Futures
                  </Typography>

                  <Typography variant="h1" className="">
                    <strong> Bitcoin Futures </strong> Trading
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>

        <div className="articleBody futures">
          <Container>
            <Grid container>
              <Grid item xs={12} md={8}>
                <div className="infoText">
                  <Typography variant="h3">
                    <strong> Next Level Trading </strong> with Cryptocurrency
                    Futures
                  </Typography>

                  <Typography variant="h6" className="text">
                    Bitcoin and digital assets are volatile investments. Many
                    traders attempt to manage their risk simply by buying an
                    asset when the price drops or selling it when the price goes
                    up. The downside of this tactic is that oftentimes money is
                    left on the table after you leave the market. If the price
                    continues to rise after you sell, for example, you’re
                    missing out on profits you could’ve earned had you left your
                    position open. A key benefit of futures trading is that you
                    can hedge existing spot positions without additional crypto
                    - allowing you to be agile and prepared for any market
                    environment.
                  </Typography>

                  <Typography variant="h6" className="text">
                    Cryptocurrency futures allow you to maximize your returns by
                    utilizing the power of leverage to multiply your profits and
                    apply advanced trading strategies. Use futures to speculate
                    on the direction of the market and minimize risk, all while
                    holding less crypto than on a spot exchange.
                  </Typography>
                </div>

                <div className="infoText">
                  <Typography variant="h3">
                    <strong> What is </strong> futures trading?
                  </Typography>

                  <Typography variant="h6" className="text">
                    Futures, or futures contracts, are an agreement to buy or
                    sell an asset at a later date for a fixed price. They are
                    typically used by traders as a way to hedge other
                    investments or to lock in profits when trading in volatile
                    markets. The prices for Trillionbit's futures are based on
                    aggregated indices that represent the demand for each
                    cryptocurrency from a variety of exchanges, so pricing is
                    always clear and transparent. There are a number of benefits
                    to this type of trading:
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={6}>
                <div className="infoText">
                  <List className="MT-List">
                    <ListItem>
                      <Typography variant="h3">
                        <strong> Hedge </strong> Price Risk
                      </Typography>

                      <Typography variant="h6" className="text">
                        Investors who are holding digital assets can mitigate
                        the risk of a falling price by simultaneously taking a
                        “short” future position on the asset in question. If the
                        price falls, the “short” position will mitigate losses
                        by providing additional revenue.
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography variant="h3">
                        <strong> Stabilize </strong> Price Fluctuations
                      </Typography>

                      <Typography variant="h6" className="text">
                        With speculation comes stability as long term views of
                        the markets play a more significant role. Whether you
                        are a miner with expected Bitcoin flows or a Bitcoin ATM
                        operator with inventory to manage: futures help crypto
                        merchants smoothen their exposure while being able to
                        focus on their core business.
                      </Typography>
                    </ListItem>
                  </List>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="infoText">
                  <List className="MT-List">
                    <ListItem>
                      <Typography variant="h3">
                        <strong> Speculate </strong> on Market Direction
                      </Typography>

                      <Typography variant="h6" className="text">
                        Cryptocurrency futures trading brings with it the
                        opportunity for real speculation to occur - traders can
                        make their opinions felt in the market with futures
                        positions. Think the price of Bitcoin is going to the
                        moon? Get extra long on futures and multiply your
                        returns. Think LTC is going to die? Put your money where
                        your mouth is and get short on Litecoin Futures!
                      </Typography>
                    </ListItem>
                  </List>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={7}>
                <div className="infoText MB-adujust">
                  <Typography variant="h3">
                    <strong> Futures </strong> Contract Details
                  </Typography>

                  <Typography variant="h6" className="text">
                    We offer Ethereum, Litecoin, Bitcoin Cash, Ripple and
                    Bitcoin futures on Trillionbit. See the chart below for
                    details on each currency pair.
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <td> Currency pairs </td>
                        <td> BTCINR </td>
                        <td> ETHINR </td>
                        <td> LTCINR </td>
                        <td> BCHINR </td>
                        <td> XRPINR </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> Leverage </td>
                        <td> Up to 10x </td>
                        <td> Up to 10x </td>
                        <td> Up to 10x </td>
                        <td> Up to 10x </td>
                        <td> Up to 10x </td>
                      </tr>

                      <tr>
                        <td> Timeframe </td>
                        <td> Quarterly </td>
                        <td> Quarterly </td>
                        <td> Quarterly </td>
                        <td> Quarterly </td>
                        <td> Quarterly </td>
                      </tr>

                      <tr>
                        <td> Contract size </td>
                        <td> ₹ 1,00,000 </td>
                        <td> ₹ 1,00,000 </td>
                        <td> ₹ 1,00,000 </td>
                        <td> ₹ 1,00,000 </td>
                        <td> ₹ 1,00,000 </td>
                      </tr>

                      <tr>
                        <td> Collateral </td>
                        <td> BTC </td>
                        <td> ETH </td>
                        <td> LTC </td>
                        <td> BCH </td>
                        <td> XRP </td>
                      </tr>

                      <tr>
                        <td> Fees </td>
                        <td colSpan="6" className="fixedTD">
                          {" "}
                          0.1% taker / -0.1% maker{" "}
                        </td>
                      </tr>

                      <tr>
                        <td> Settlement </td>
                        <td colSpan="6" className="fixedTD">
                          {" "}
                          Profit from trading is instantly settled and
                          available. <br />
                          Contracts mature at expiration date and the open
                          interest <br />
                          is cash-settled in the collateral asset.{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={7}>
                <div className="infoText MB-adujust">
                  <Typography variant="h3">
                    <strong> Leverage up to </strong> 10x with crypto futures
                  </Typography>

                  <Typography variant="h6" className="text">
                    Futures are extremely capital efficient, meaning that less
                    money is required to open positions than if you were spot
                    trading (1x) or margin trading (3-10x). This means if you
                    have 10 Bitcoin and are scared of price decline, you have to
                    trust 100% of your money to spot exchange to sell, or 20% of
                    your money on margin exchange. With 10x futures, you trust
                    as low as 10% of your money on exchange.
                  </Typography>

                  <Typography variant="h6" className="text">
                    Using collateral as low as 10% of the notional amount,
                    crypto futures allow you to take positions with up to 10x
                    leverage -- giving you flexibility to position yourself in
                    the market while maintaining low exchange risk.
                  </Typography>

                  <Typography variant="h6" className="text">
                    To see if you qualify to trade Bitcoin and other crypto
                    futures on Trillionbit, visit our{" "}
                    <a href="https://blog.bitex.com">blog</a> post for details.
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>

        <div className="startSignupSection">
          <Container>
            <Grid container>
              <Grid item xs={12}>
                <div className="text-center">
                  <Typography variant="h4">
                    <strong> Sign up. </strong> Get started!
                  </Typography>

                  <Typography variant="h6" className="text">
                    Dive into the platform and work <br />
                    leveraged trades into your crypto trading strategy!
                  </Typography>

                  <Link
                    href="register"
                    color="primary"
                    className={classes.button}
                  >
                    Sign up
                  </Link>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>

        <div className="whatsNextSection bglightgray">
          <Container>
            <Grid container>
              <Grid item xs={12}>
                <div className="title">
                  <Typography variant="h4">
                    <strong> Keep sailing the high seas of success! </strong>{" "}
                    What’s next?
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={6} md={3}>
                <Link>
                  <div className="box">
                    <Typography variant="h4">
                      I'd like to see current prices for all listed assets on
                      Trillionbit.
                    </Typography>
                  </div>
                </Link>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Link>
                  <div className="box">
                    <Typography variant="h4">
                      I'm curious how much it will cost me to buy and sell
                      cryptocurrency.
                    </Typography>
                  </div>
                </Link>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Link>
                  <div className="box">
                    <Typography variant="h4">
                      Show me how to fund my account so I can start trading on
                      Trillionbit.
                    </Typography>
                  </div>
                </Link>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Link>
                  <div className="box">
                    <Typography variant="h4">
                      Tell me more about margin trading on Trillionbit.
                    </Typography>
                  </div>
                </Link>
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

FutureTradingView.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProp,
  {}
)(withStyles(themeStyles)(FutureTradingView));
