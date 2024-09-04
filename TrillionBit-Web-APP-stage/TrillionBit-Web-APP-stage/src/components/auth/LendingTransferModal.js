import React, { Component } from "react";
import {
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import isEmpty from "../../validation/isEmpty";
const moment = require("moment");

export class LendingTransferModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredAmountErrorModel: false,
    };
  }

  handleRequiredAmountErrorModel = () => {
    this.setState({ requiredAmountErrorModel: true });
  };

  handleTransferCoin = () => {
    const mainWalletAmount = this.props.userMainWallet.walletAmount;
    if (
      parseFloat(mainWalletAmount) <
      parseFloat(this.props.selectTransfer.amount)
    ) {
      this.handleRequiredAmountErrorModel();
    } else {
      this.props.handleTransferCoin();
    }
  };

  render() {
    const { coin, coinImg } = this.props;
    return (
      <React.Fragment>
        <Dialog
          className="transferDialog"
          open={this.props.selectTransfer.modal}
          onClose={this.props.handleCloseTransferDialog}
          aria-labelledby="form-dialog-title"
          disableBackdropClick={true}
          fullWidth={true}
          disableEnforceFocus={true}
        >
          <DialogTitle id="customized-dialog-title">
            <div className="coinBox">
              <img src={coinImg} alt="TrillionBit" />
              <div className="coinName">
                <Typography variant="h6" className="">
                  {coin?.coinData.coin}
                  <span className="shortForm"> {coin?.coinData.name} </span>
                </Typography>
              </div>
            </div>
          </DialogTitle>

          <DialogContent dividers className="body">
            <Typography variant="h5">
              Available Balance:{" "}
              <strong>
                {" "}
                {parseFloat(this.props.userMainWallet?.walletAmount).toFixed(
                  6
                )}{" "}
                {coin?.coinData.coin}{" "}
              </strong>
            </Typography>

            <Typography variant="h6">
              Annual Interest:{" "}
              <strong> {coin?.currentCoinInterestRate}% </strong>
            </Typography>
            <Typography variant="h6">
              Interest Per Lot:{" "}
              <strong> {coin?.currentCoinDayInterestRate}% </strong>
            </Typography>

            <div className="rowOne">
              <ul>
                <li>
                  <TextField
                    label="Enter Quantity"
                    className="form-control"
                    error={
                      this.props.selectTransfer.errors.amount ? true : false
                    }
                    name="amount"
                    variant="filled"
                    fullWidth={true}
                    margin="normal"
                    value={this.props.selectTransfer.amount}
                    onChange={this.props.handleInputChange}
                    helperText={this.props.selectTransfer.errors.amount}
                  />
                </li>
                <li>
                  <label> Lock in (days): </label>
                  <div className="daysBox">
                    {coin?.coinData &&
                      coin.coinData.days.map((day, index) => (
                        <button
                          key={`${coin.coinData.coin}${day.numberOfDays}`}
                          onClick={() =>
                            this.props.changeInterestRate(
                              coin.coinData.coin,
                              day.numberOfDays
                            )
                          }
                          data-bn-type="button"
                          className={this.props.checkActiveSelectButton(
                            coin.coinData.coin,
                            day,
                            index
                          )}
                        >
                          {day.numberOfDays}
                        </button>
                      ))}
                  </div>
                </li>
              </ul>
            </div>

            <div className="maturityBox">
              <Typography variant="h4">Maturity</Typography>

              <Typography variant="h5">
                Redemption Date:{" "}
                <strong>
                  {" "}
                  {!isEmpty(coin?.currentCoinDay)
                    ? moment()
                        .add({ days: parseInt(coin?.currentCoinDay) })
                        .format("DD-MM-YYYY")
                    : null}{" "}
                </strong>
              </Typography>

              <Typography variant="h5">
                Estimated Intrest:{" "}
                <strong>
                  {" "}
                  {this.props.selectTransfer?.coin}{" "}
                  {this.props.selectTransfer?.interestAmount}{" "}
                </strong>
              </Typography>

              <Typography variant="h5">
                Total value:{" "}
                <strong>
                  {" "}
                  {this.props.selectTransfer?.coin}{" "}
                  {this.props.selectTransfer?.totalAmount}{" "}
                </strong>
              </Typography>
            </div>

            <Typography variant="h6" className="note">
              Note: No interest will be gained if amount withdrawn before
              minimum lock in period.
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button autoFocus onClick={this.handleTransferCoin} color="primary">
              Transfer
            </Button>
            <Button
              autoFocus
              onClick={this.props.handleCloseTransferDialog}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {coin?.coinData.coin && (
          <Dialog
            open={this.state.requiredAmountErrorModel}
            onClose={() => {
              this.setState({ requiredAmountErrorModel: false });
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {coin.coinData.coin}
            </DialogTitle>
            <DialogContent>
              <div className="deposite">
                <Grid container>
                  <Grid item xs={12} md={12}>
                    <Card className="dataListCard">
                      <CardContent>
                        {`You do not have enough balance to transfer.`}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.setState({ requiredAmountErrorModel: false });
                }}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}

export default LendingTransferModal;
