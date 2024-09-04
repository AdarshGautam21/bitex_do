import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { withStyles, styled } from "@mui/styles";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  CardActions,
  TextField,
} from "@mui/material";

import themeStyles from "../../assets/themeStyles";
import "../../assets/css/home.css";

class TradeTest extends Component {
  componentDidMount() {
    // window.fcWidget.destroy();
    // window.scrollTo(0, 0);
  }
  state = {
    walletOrderTab: "buy",
  };

  render() {
    const { walletOrderTab } = this.state;

    function handleWalletOrderTabChange(event, newValue) {
        
      console.log(newValue, "newValue");
      this.setState({
        walletOrderTab: newValue,
      });
    }

    return (
      <React.Fragment>
        <div
          className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}
        ></div>
        <div className="paddingTopbody"> </div>
        <div className="bg-map">
          <Grid container>
            <Grid item xs={12} md={6}>
              <div className="wrapTitle text-center ">
                <Typography variant="h1">
                  <strong>
                    A whole world of crypto, in one simple account
                  </strong>
                </Typography>
                <Typography variant="body2" component="span" className="text">
                  Now it’s easy to do more with crypto. Buy with your card, sell
                  in a snap, or see all your wallets in one place — it’s all
                  there in your MoonPay account.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} className="bg-black">
              <Card  variant="outlined" className="bg-black">
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
                        // className={classes.tabRoot}
                      />
                      <Tab
                        value="sell"
                        label="Sell"
                        //   className={classes.tabRoot}
                      />
                        <Tab
                        value="swap"
                        label="Swap"
                        //   className={classes.tabRoot}
                      />
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
                          "test"
                        </Typography>

                        <TextField
                          //   error={errors.marketAmount ? true : false}
                          margin="dense"
                          variant="filled"
                          id="marketAmount"
                          label={`Amount in`}
                          value={"marketAmount"}
                          placeholder={"Enter amount in "}
                          //   onChange={this.handleInputChange("marketAmount")}
                          type="number"
                          fullWidth={true}
                          //   disabled={!this.state.wsConnection}
                          //   helperText={errors.marketAmount}
                          className="form-control"
                        />
                      </div>
                      <div className="inline total">
                        <Typography component="h5">Fee: %</Typography>
                        <Typography component="h5">
                          {/* Approx: {this.state.marketApprox}{" "} */}
                          {/* {`${userWallet.coin}`} */}
                        </Typography>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="WithdrawBox">
                        <Typography variant="body1" className="">
                          Mark1
                        </Typography>

                        <TextField
                          //   error={errors.marketAmount ? true : false}
                          margin="dense"
                          variant="filled"
                          id="marketAmount"
                          label={`Amount in`}
                          value={"marketAmount"}
                          placeholder={"Enter amount in "}
                          //   onChange={this.handleInputChange("marketAmount")}
                          type="number"
                          //   disabled={!this.state.wsConnection}
                          fullWidth={true}
                          //   helperText={errors.marketAmount}
                          className="form-control"
                        />
                      </div>
                      <div className="inline total">
                        <Typography component="h5">
                          {/* Fee: {this.state.takerFee * 100} % */}
                        </Typography>
                        <Typography component="h5">
                          {/* Subtotal: {this.state.marketSubtotal}{" "} */}
                          {/* {currentUserFiatWallet.coin} */}
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
                        // className={classes.button}
                        // disabled={!this.state.wsConnection}
                      >
                        Buy
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        // onClick={() => this.createMarketOrder("sell")}
                      >
                        Sell
                      </Button>
                    )}
                  </div>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

TradeTest.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProp, {})(withStyles(themeStyles)(TradeTest));
