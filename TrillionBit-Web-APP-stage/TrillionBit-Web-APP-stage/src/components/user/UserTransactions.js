import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { withStyles } from "@mui/styles/";
import themeStyles from "../../assets/themeStyles";

import tableIcons from "../../common/tableIcons";

import MaterialTable from "material-table";

import {
  Container,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Typography,
  MenuItem,
  ListItemText,
  Grid,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import { getAllTransactions } from "../../actions/walletActions";

import isEmpty from "../../validation/isEmpty";
import fileImg from "../../assets/img/file.webp";

const moment = require("moment");

const txBlockApi = "https://live.blockcypher.com/btc/tx";
const txXrpApi = "https://bithomp.com/explorer";
const txEthApi = "https://etherscan.io/tx";

class UserTransactions extends Component {
  state = {
    orderType: "",
    transactionType: 0,
    status: "",
    account: "",
    anchorEl: null,
    filterParams: {},
    ajaxProcess: false,
    openFilter: false,
  };

  componentDidMount = async () => {
    // window.fcWidget.destroy();
    this.setState({ ajaxProcess: true });
    await this.props.getAllTransactions(this.props.auth.user.id);
    this.setState({ ajaxProcess: false });
  };

  handleFilterChange = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "orderType") {
      let params = {
        status: this.state.status,
        account: this.state.account,
      };
      if (!isEmpty(event.target.value)) {
        params.orderType = event.target.value;
      }
      this.setState({ filterParams: params });
    }
    if (event.target.name === "account") {
      let params = {
        orderType: this.state.orderType,
        status: this.state.status,
      };
      if (!isEmpty(event.target.value)) {
        params.account = event.target.value;
      }
      this.setState({ filterParams: params });
    }
    if (event.target.name === "status") {
      let params = {
        orderType: this.state.orderType,
        account: this.state.account,
      };
      if (!isEmpty(event.target.value)) {
        params.status = event.target.value;
      }
      this.setState({ filterParams: params });
    }
  };

  formatPrice(value) {
    var value_split = (value + "").split(".");
    var fraction = value_split[1];
    if (fraction === undefined) {
      fraction = "00";
    }
    value = value_split[0].replace(/[^0-9]/g, "");
    let val = (value / 1).toFixed(0).replace(".", ".");
    return (
      val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + fraction
    );
  }

  getTxApi = (type) => {
    let txApi = txBlockApi;
    if (type === "XRP") {
      txApi = txXrpApi;
    }
    if (type === "ETH") {
      txApi = txEthApi;
    }
    return txApi;
  };

  openFilterBox = (event) => {
    this.setState({ openFilter: true });
  };

  closeFilterBox = () => {
    this.setState({ openFilter: false });
  };

  applyFilter = async () => {
    const { orderType, status, account } = this.state;
    console.log(orderType, status);
    if (isEmpty(orderType) && isEmpty(status) && isEmpty(account)) {
      this.setState({ openFilter: false });
    } else {
      this.setState({ ajaxProcess: true, openFilter: false });
      await this.props.getAllTransactions(
        this.props.auth.user.id,
        this.state.filterParams
      );
      this.setState({ ajaxProcess: false });
    }
  };

  clearFilter = async () => {
    await this.setState({
      orderType: "",
      status: "",
      account: "",
      filterParams: {},
    });
    this.setState({ ajaxProcess: true, openFilter: false });
    await this.props.getAllTransactions(
      this.props.auth.user.id,
      this.state.filterParams
    );
    this.setState({ ajaxProcess: false });
  };

  render() {
    const { classes } = this.props;

    let tableWidth = "fullscreen";
    if (window.outerWidth < 426 && window.outerWidth >= 320) {
      tableWidth = "mobile";
    }

    if (window.outerWidth < 769 && window.outerWidth >= 427) {
      tableWidth = "tablate";
    }

    if (window.outerWidth >= 1024) {
      tableWidth = "fullscreen";
    }

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Transactions | TrillionBit</title>
          <meta
            name="description"
            content="TrillionBit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta
            property="og:url"
            content="https://www.trillionbit.com/transactions"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Transactions | TrillionBit" />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Transactions | TrillionBit" />
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
        <div className="paddingTopbody100">
          <Container className="transactions mainbody" fixed={false}>
            <Grid container>
              <Grid item xs={12}>
                <div className="tableResponsive" fixed="false">
                  {this.state.ajaxProcess ? (
                    <div style={{ width: "100%" }}>
                      <LinearProgress variant="query" />
                    </div>
                  ) : undefined}
                  <MaterialTable
                    title="Transactions"
                    options={{
                      actionsColumnIndex: -1,
                      search: false,
                      filtering: true,
                      sorting: true,
                      showFirstLastPageButtons: false,
                      padding: "dense",
                      pageSize: 10,
                    }}
                    localization={{
                      pagination: {
                        labelDisplayedRows: "",
                        previousAriaLabel: "",
                      },
                      body: {
                        emptyDataSourceMessage: (
                          <div className="noDatafoundFull">
                            <img src={fileImg} alt="Remy Sharp" />
                            <Typography variant="h6" component="h2">
                              No Record Found
                            </Typography>
                          </div>
                        ),
                      },
                    }}
                    components={{
                      Actions: (props) => (
                        <div>
                          <IconButton
                            className={classes.margin}
                            size="medium"
                            aria-describedby="filterBox"
                            onClick={this.openFilterBox}
                          >
                            <FilterListIcon fontSize="inherit" />
                          </IconButton>
                          <Dialog
                            onClose={this.closeFilterBox}
                            aria-labelledby="simple-dialog-title"
                            open={this.state.openFilter}
                          >
                            <Card className={classes.root}>
                              <CardContent>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id="order-type-label">
                                    Type
                                  </InputLabel>
                                  <Select
                                    name="orderType"
                                    value={this.state.orderType}
                                    onChange={this.handleFilterChange}
                                  >
                                    <MenuItem value={""}>All</MenuItem>
                                    <MenuItem value={"Deposit"}>
                                      Deposit
                                    </MenuItem>
                                    <MenuItem value={"Withdrawal"}>
                                      Withdrawal
                                    </MenuItem>
                                    <MenuItem value={"Transfer"}>
                                      Transfer
                                    </MenuItem>
                                    <MenuItem value={"Borrow"}>Borrow</MenuItem>
                                    <MenuItem value={"Limit (Buy)"}>
                                      Limit (Buy)
                                    </MenuItem>
                                    <MenuItem value={"Limit (Sell)"}>
                                      Limit (Sell)
                                    </MenuItem>
                                    <MenuItem value={"Market (Buy)"}>
                                      Market (Buy)
                                    </MenuItem>
                                    <MenuItem value={"Market (Sell)"}>
                                      Market (Sell)
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                  <InputLabel id="account-label">
                                    Account
                                  </InputLabel>
                                  <Select
                                    name="account"
                                    value={this.state.account}
                                    onChange={this.handleFilterChange}
                                  >
                                    <MenuItem value={""}>All</MenuItem>
                                    <MenuItem value={"AED"}>AED</MenuItem>
                                    <MenuItem value={"BTC"}>BTC</MenuItem>
                                    <MenuItem value={"BCH"}>BCH</MenuItem>
                                    <MenuItem value={"LTC"}>LTC</MenuItem>
                                    <MenuItem value={"GLC"}>GLC</MenuItem>
                                    <MenuItem value={"XRP"}>XRP</MenuItem>
                                    <MenuItem value={"ETH"}>ETH</MenuItem>
                                    <MenuItem value={"BTX"}>BTX</MenuItem>
                                    <MenuItem value={"BTCAED"}>BTCAED</MenuItem>
                                    <MenuItem value={"BCHAED"}>BCHAED</MenuItem>
                                    <MenuItem value={"LTCAED"}>LTCAED</MenuItem>
                                    <MenuItem value={"GLCAED"}>GLCAED</MenuItem>
                                    <MenuItem value={"XRPAED"}>XRPAED</MenuItem>
                                    <MenuItem value={"ETHAED"}>ETHAED</MenuItem>
                                  </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                  <InputLabel htmlFor="status">
                                    Status
                                  </InputLabel>
                                  <Select
                                    name="status"
                                    value={this.state.status}
                                    onChange={this.handleFilterChange}
                                  >
                                    <MenuItem value={""}>All</MenuItem>
                                    <MenuItem value={"Pending"}>
                                      Pending
                                    </MenuItem>
                                    <MenuItem value={"Approved"}>
                                      Approved
                                    </MenuItem>
                                    <MenuItem value={"Open"}>Open</MenuItem>
                                    <MenuItem value={"Finished"}>
                                      Finished
                                    </MenuItem>
                                    <MenuItem value={"Cancelled"}>
                                      Cancelled
                                    </MenuItem>
                                    <MenuItem value={"Transaction Error"}>
                                      Transaction Error
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </CardContent>
                              <CardActions>
                                <Button
                                  color="primary"
                                  onClick={this.applyFilter}
                                >
                                  Apply
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={this.clearFilter}
                                >
                                  Clear
                                </Button>
                              </CardActions>
                            </Card>
                          </Dialog>
                        </div>
                      ),
                    }}
                    icons={tableIcons}
                    columns={[
                      {
                        title: "Order Type",
                        field: "type",
                        filtering: false,
                        sorting: true,
                      },
                      {
                        title: "Date and Time",
                        field: "date",
                        filtering: false,
                        sorting: true,
                        hidden: tableWidth === "fullscreen" ? false : true,
                        render: (rowData) => (
                          <div>{moment(rowData.date).format("LLL")}</div>
                        ),
                      },
                      {
                        title: "Account",
                        field: "account",
                        filtering: false,
                        sorting: true,
                      },
                      { title: "Value", field: "value", filtering: false },
                      {
                        title: "Rate",
                        field: "rate",
                        filtering: false,
                        sorting: true,
                        hidden: tableWidth === "fullscreen" ? false : true,
                        render: (rowData) => (
                          <div>
                            {rowData.rate === "-"
                              ? "-"
                              : this.formatPrice(rowData.rate)}
                          </div>
                        ),
                      },
                      {
                        title: "Status",
                        field: "status",
                        sorting: true,
                        filtering: false,
                        hidden:
                          tableWidth === "tablate" ||
                          tableWidth === "fullscreen"
                            ? false
                            : true,
                      },
                    ]}
                    data={this.props.wallet.transactions}
                    detailPanel={(rowData) => {
                      let tabDom = (
                        <List
                          component="nav"
                          dense
                          aria-label="main mailbox folders"
                        >
                          {rowData.txid ? (
                            <div>
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Txid:{" "}
                                      <a
                                        href={`${this.getTxApi(
                                          rowData.account
                                        )}/${rowData.txid}/`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                      >
                                        {rowData.txid}
                                      </a>
                                    </div>
                                  }
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Update Time:{" "}
                                      {moment(
                                        rowData.updateDate
                                          ? rowData.updateDate
                                          : rowData.date
                                      ).format("LLL")}
                                    </div>
                                  }
                                />
                              </ListItem>
                            </div>
                          ) : (
                            <div>
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Update Time:{" "}
                                      {moment(
                                        rowData.updateDate
                                          ? rowData.updateDate
                                          : rowData.date
                                      ).format("LLL")}
                                    </div>
                                  }
                                />
                              </ListItem>
                              {rowData.noteNumber ? (
                                <ListItem>
                                  <ListItemText
                                    inset
                                    primary={
                                      <div>
                                        Note / Note Number: {rowData.noteNumber}
                                      </div>
                                    }
                                  />
                                </ListItem>
                              ) : undefined}
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Reference Number:{" "}
                                      {rowData.referenceNumber
                                        ? rowData.referenceNumber
                                        : ""}
                                    </div>
                                  }
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Fee: {rowData.fee ? rowData.fee : ""}
                                    </div>
                                  }
                                />
                              </ListItem>
                            </div>
                          )}
                        </List>
                      );

                      if (tableWidth === "tablate") {
                        tabDom = (
                          <List
                            component="nav"
                            dense
                            aria-label="main mailbox folders"
                          >
                            {rowData.txid ? (
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Txid:{" "}
                                      <a
                                        href={`${this.getTxApi(
                                          rowData.account
                                        )}/${rowData.txid}/`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                      >
                                        {rowData.txid}
                                      </a>
                                    </div>
                                  }
                                />
                              </ListItem>
                            ) : (
                              ""
                            )}
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Date and Time:{" "}
                                    {moment(rowData.date).format("LLL")}
                                  </div>
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={<div>Rate: {rowData.rate}</div>}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Update Time:{" "}
                                    {moment(
                                      rowData.updateDate
                                        ? rowData.updateDate
                                        : rowData.date
                                    ).format("LLL")}
                                  </div>
                                }
                              />
                            </ListItem>
                            {rowData.noteNumber ? (
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Note / Note Number: {rowData.noteNumber}
                                    </div>
                                  }
                                />
                              </ListItem>
                            ) : undefined}
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Reference Number:{" "}
                                    {rowData.referenceNumber
                                      ? rowData.referenceNumber
                                      : ""}
                                  </div>
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Fee: {rowData.fee ? rowData.fee : ""}
                                  </div>
                                }
                              />
                            </ListItem>
                          </List>
                        );
                      }

                      if (tableWidth === "mobile") {
                        tabDom = (
                          <List
                            component="nav"
                            dense
                            aria-label="main mailbox folders"
                          >
                            {rowData.txid ? (
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Txid:{" "}
                                      <a
                                        href={`${this.getTxApi(
                                          rowData.account
                                        )}/${rowData.txid}/`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                      >
                                        {rowData.txid.substr(1, 8)}
                                      </a>
                                    </div>
                                  }
                                />
                              </ListItem>
                            ) : (
                              ""
                            )}
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Date and Time:{" "}
                                    {moment(rowData.date).format("LLL")}
                                  </div>
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={<div>Rate: {rowData.rate}</div>}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={<div>Status: {rowData.status}</div>}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Update Time:{" "}
                                    {moment(
                                      rowData.updateDate
                                        ? rowData.updateDate
                                        : rowData.date
                                    ).format("LLL")}
                                  </div>
                                }
                              />
                            </ListItem>
                            {rowData.noteNumber ? (
                              <ListItem>
                                <ListItemText
                                  inset
                                  primary={
                                    <div>
                                      Note / Note Number: {rowData.noteNumber}
                                    </div>
                                  }
                                />
                              </ListItem>
                            ) : undefined}
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Reference Number:{" "}
                                    {rowData.referenceNumber
                                      ? rowData.referenceNumber
                                      : ""}
                                  </div>
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                inset
                                primary={
                                  <div>
                                    Fee: {rowData.fee ? rowData.fee : ""}
                                  </div>
                                }
                              />
                            </ListItem>
                          </List>
                        );
                      }
                      return tabDom;
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

UserTransactions.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  getAllTransactions: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  wallet: state.wallet,
});

export default connect(mapStateToProp, {
  getAllTransactions,
})(withStyles(themeStyles)(UserTransactions));
