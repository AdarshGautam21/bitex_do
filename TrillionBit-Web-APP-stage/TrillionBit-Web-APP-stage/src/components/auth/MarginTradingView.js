import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { withStyles } from "@mui/styles";

import { List, ListItem, Typography, Link } from "@mui/material";

import themeStyles from "../../assets/themeStyles";
import "../../assets/css/home.css";

import btcImg from "../../assets/img/coins/btc.webp";
import bchImg from "../../assets/img/coins/bch.webp";
import ltcImg from "../../assets/img/coins/ltc.webp";
import xrpImg from "../../assets/img/coins/xrp.webp";
import ethImg from "../../assets/img/coins/eth.webp";

class MarginTradingView extends Component {
  componentDidMount = async () => {
    window.scrollTo(0, 0);
  };

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
              <Grid item xs={12} sm={12} md={7} className="">
                <div className="subpageTitle">
                  <Typography variant="h5" className="subtext">
                    Margin Trading
                  </Typography>

                  <Typography variant="h1" className="">
                    <strong> Margin Trading Cryptocurrency: </strong>{" "}
                    Supercharge Your Trades Up To 5x
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>

        <div className="articleBody">
          <Container>
            <Grid container>
              <Grid item xs={12} md={8}>
                <div className="infoText">
                  <Typography variant="h3">
                    <strong> Maximize </strong> your potential gains
                  </Typography>

                  <Typography variant="h6" className="text">
                    Trading cryptocurrency is generally simple, but what if
                    you’re looking for options that are a bit more advanced?
                    That’s where margin trading comes in.
                  </Typography>

                  <Typography variant="h6" className="text">
                    Margin trading lets you amplify your gains from market
                    swings, allowing you to execute more complex, active trading
                    strategies. With the power of Trillionbit advanced trading
                    engine, you can use leverage to go long or short on a
                    variety of cryptocurrencies by up to 5x -- you’ll have five
                    times the earning potential compared to a regular spot
                    trade.
                  </Typography>

                  <Link href="">Spot trading vs margin trading</Link>
                </div>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={8}>
                <div className="infoText">
                  <Typography variant="h2">
                    <strong> The TrillionBit Trade Engine </strong>
                    lets you magnify your trades.
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
                        <strong> Leverage </strong> up to 5x
                      </Typography>

                      <Typography variant="h6" className="text">
                        Quickly and easily leverage TrillionBit funds to go long
                        or short on a currency pair by up to 5x.
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography variant="h3">
                        <strong> Pro </strong> trading interface
                      </Typography>

                      <Typography variant="h6" className="text">
                        Manage your positions easily with our intuitive trading
                        platform and advanced order options.
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography variant="h3">
                        <strong> Advanced </strong> API access
                      </Typography>

                      <Typography variant="h6" className="text">
                        Manage your positions easily with our intuitive trading
                        platform and advanced order options.
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
                        <strong> Low Rollover </strong> fees
                      </Typography>

                      <Typography variant="h6" className="text">
                        Never pay more than 0.02% (per 4 hours) in rollover
                        fees.
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography variant="h3">
                        <strong> High margin </strong> limits
                      </Typography>

                      <Typography variant="h6" className="text">
                        Eligible clients can access up to $500,000.
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
                    <strong> So what exactly </strong> is margin trading?
                  </Typography>

                  <Typography variant="h6" className="text">
                    Margin Trading allows you to open a position that is larger
                    than the balance of your account. Essentially, TrillionBit
                    allows traders to access an amount of funds to increase the
                    size of their order, which in turn boosts the gain from a
                    profitable trade.
                  </Typography>

                  <Typography variant="h6" className="text">
                    For example, if you place a margin trade with a leverage of
                    "2.0", only half of the size of this position is used as
                    initial margin, and with "5.0" only a fifth is needed. This
                    allows you to open larger positions than your account would
                    normally allow.
                  </Typography>

                  <div className="links">
                    <Link href="">Related terms and concepts</Link>

                    <Link href="">How it works</Link>
                  </div>
                </div>

                <div className="infoText MB-adujust">
                  <Typography variant="h3">
                    <strong> Complex trades, </strong> simple interface
                  </Typography>

                  <Typography variant="h6" className="text">
                    Large investors have traditionally used margin trading to
                    express unique ideas about the market, but most investors
                    frequently lack access to these tools. With Trillionbit,
                    margin trading is accessible to everyone. Apply anywhere
                    from 2x to 5x leverage to an order with just one click,
                    whether you’re placing a
                    <Link> market or limit order. </Link>
                  </Typography>

                  <Typography variant="h5">
                    Margin trading is currently available on TrillionBit with:
                  </Typography>

                  <div className="cryptocurrenciesList">
                    <List className="list">
                      <ListItem>
                        <Link>
                          <img src={btcImg} alt="btc" />
                          <Typography variant="h3">
                            <strong> Bitcoin </strong> <span> BTC </span>
                          </Typography>
                        </Link>
                      </ListItem>

                      <ListItem>
                        <Link>
                          <img src={bchImg} alt="btc" />
                          <Typography variant="h3">
                            <strong> Bitcoin Cash </strong> <span> BCH </span>
                          </Typography>
                        </Link>
                      </ListItem>

                      <ListItem>
                        <Link>
                          <img src={ltcImg} alt="btc" />
                          <Typography variant="h3">
                            <strong> Litecoin </strong> <span> LTC </span>
                          </Typography>
                        </Link>
                      </ListItem>

                      <ListItem>
                        <Link>
                          <img src={xrpImg} alt="btc" />
                          <Typography variant="h3">
                            <strong> XRP </strong> <span> XRP </span>
                          </Typography>
                        </Link>
                      </ListItem>

                      <ListItem>
                        <Link>
                          <img src={ethImg} alt="btc" />
                          <Typography variant="h3">
                            <strong> Ethereum </strong> <span> ETH </span>
                          </Typography>
                        </Link>
                      </ListItem>
                    </List>
                  </div>
                </div>

                <div className="infoText MB-adujust">
                  <Typography variant="h3">
                    <strong> Lowest fees </strong> for leveraging crypto
                  </Typography>

                  <Typography variant="h6" className="text">
                    Another benefit of margin trading cryptocurrencies with
                    TrillionBit is that we offer extremely competitive fees.
                    Depending on the currency pair you’re looking to leverage,
                    we’ll only charge up to 0.02% to open a position and up to
                    0.02% (per 4 hours) in rollover fees to keep it open. This
                    value, when combined with our deep liquidity across all of
                    our markets, means that you’ll be able to maximize your
                    earnings and get your money quickly.
                  </Typography>

                  <Link href="">Full breakdown of margin trading fees</Link>
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
                    href="/register"
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

MarginTradingView.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProp,
  {}
)(withStyles(themeStyles)(MarginTradingView));
