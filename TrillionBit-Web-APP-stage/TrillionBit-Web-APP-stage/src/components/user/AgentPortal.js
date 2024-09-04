import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { withStyles } from "@mui/styles";

import Dropzone from "react-dropzone";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  MenuItem,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  CardActions,
  LinearProgress,
  ListItemText,
  Chip,
  Link,
  DialogContentText,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Visibility } from "@mui/icons-material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import MaterialTable from "material-table";
import tableIcons from "../../common/tableIcons";
import apiUrl from "../config";
import CloseIcon from "@mui/icons-material/Close";
import currencyIcon from "../../common/CurrencyIcon";

import { Help } from "@mui/icons-material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import Countries from "../../common/Countries";

import passportLogo from "../../assets/img/passport.webp";
import uploadIcon from "../../assets/img/uploadIcon.webp";

import {
  addNewClient,
  getAgentClients,
  getUserClientIdentity,
  getUserClientPersonalInfo,
  getUserClientBankInfo,
  saveUserClientBankInfo,
  createUserIdentity,
  saveDocument,
  finishIdentityForm,
  saveResidenceDoc,
  getUserClientProfile,
  resendClientVerification,
  getUserClientWallets,
  toggleSubAgent,
} from "../../actions/userActions";
import {
  getAllClientTransactions,
  transferToClientWallet,
  getActiveAssets,
} from "../../actions/walletActions";

import { HighlightOffOutlined } from "@mui/icons-material";
import themeStyles from "../../assets/themeStyles";
import isEmpty from "../../validation/isEmpty";

import { clearSnackMessages, clearErrors } from "../../actions/messageActions";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";

import AgentCommission from "./agent/AgentCommission";
import fileImg from "../../assets/img/file.webp";

const txBlockApi = "https://live.blockcypher.com/btc/tx";
const txXrpApi = "https://xrpscan.com/tx";
const txEthApi = "https://etherscan.io/tx";

const moment = require("moment");
const CurrencyFormat = require("react-currency-format");

class AgentPortal extends Component {
  state = {
    tabValue: "client_management",
    addNewUserBox: false,
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
    dateOfBirth: "",
    errors: {},
    messages: {},
    snackMessages: {},
    country: "",
    phone: "",
    countryCode: "+00",
    snackbarMessage: "",
    variant: "info",
    ajaxProcess: false,
    clientDetails: false,
    selectedUser: {},
    tabNewUserValue: "user_details",
    userClientBankEdit: false,

    postalCode: "",
    city: "",
    bankAddress: "",
    beneficiaryName: "",
    bankName: "",
    bankAccount: "",
    bankSwift: "",
    bankIban: "",
    bankCurrency: "AED",
    bankCity: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",

    orderType: "",
    transactionType: 0,
    status: "",
    account: "",
    anchorEl: null,
    filterParams: {},
    openFilter: false,

    userCurrentDocument: {
      message: "Drag & Drop files or Click here to upload",
      frontIdMessage: "Drag & Drop files or Click here to upload",
      backIdMessage: "Drag & Drop files or Click here to upload",
    },
    dropzonClass: "dropzon-input",
    dropzonClassFront: "dropzon-input",
    dropzonClassBack: "dropzon-input",

    address: "",
    zipcode: "",

    idCardBox: false,
    idResidenceBox: false,
    passVerification: false,

    transferAmount: "",
    agentPassword: "",
    activeTransferWallet: {},
    currentUserFiatWallet: {},
  };

  componentDidMount = async () => {
    const { user, isAuthenticated } = this.props.auth;
    if (user.agent || user.subAgent) {
      await this.props.getAgentClients(user.id);
    } else {
      window.location.replace("/dashboard");
    }

    if (isAuthenticated) {
      await this.props.getActiveAssets(user.id);
    }

    for (let ckey in this.props.wallet.userAssets) {
      if (
        this.props.wallet.userAssets[ckey].fiat &&
        this.props.wallet.userAssets[ckey].active
      ) {
        await this.setState({
          currentUserFiatWallet: this.props.wallet.userAssets[ckey],
        });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (!isEmpty(nextProps.snackMessages)) {
      this.setState({
        snackMessages: nextProps.snackMessages,
        addNewUserBox: false,
      });
    } else {
      this.setState({ snackMessages: nextProps.snackMessages });
    }

    if (!isEmpty(nextProps.user.userClientIdentity)) {
      this.setState({
        countryCode: nextProps.user.userClientIdentity.userNationality,
      });
    }
  }

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
    if (isEmpty(orderType) && isEmpty(status) && isEmpty(account)) {
      this.setState({ openFilter: false });
    } else {
      this.setState({ ajaxProcess: true, openFilter: false });
      await this.props.getAllClientTransactions(
        this.state.selectedUser._id,
        this.state.filterParams
      );
      this.setState({ ajaxProcess: false });
    }
  };

  clearFilter = async () => {
    this.setState({
      orderType: "",
      status: "",
      account: "",
    });
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  handleTabChange(event, value) {
    this.setState({ tabValue: value });
  }

  async handleNewUserTabChange(event, value) {
    this.setState({ tabNewUserValue: value });

    if (value === "transactions") {
      this.setState({ ajaxProcess: true });
      await this.props.getAllClientTransactions(this.state.selectedUser._id);
      this.setState({ ajaxProcess: false });
    }

    if (value === "balance_transfer") {
      this.setState({ ajaxProcess: true });
      await this.props.getUserClientWallets(this.state.selectedUser._id);
      this.setState({ ajaxProcess: false });
    }
  }

  addNewUserBox() {
    this.setState({ addNewUserBox: true });
  }

  handleCountryChange = (name) => (event) => {
    if (name === "country") {
      this.props.createUserIdentity({
        userId: this.state.selectedUser._id,
        userNationality: event.target.value.sortname,
      });
      this.setState({ countryCode: "+" + event.target.value.phoneCode });
    }
    this.setState({ [name]: event.target.value });
  };

  handleChange = (name) => (event) => {
    if (name === "country") {
      this.setState({ countryCode: "+" + event.target.value.phoneCode });
    }
    this.setState({ [name]: event.target.value });
  };

  userSelected = async (rowData) => {
    this.setState({
      selectedUser: rowData,
      clientDetails: true,
      tabNewUserValue: "user_details",
    });
    await this.props.getUserClientProfile(rowData._id);
    await this.props.getUserClientIdentity(rowData._id);
    await this.props.getUserClientBankInfo(rowData._id);
    await this.props.getUserClientPersonalInfo(this.props.auth.user.id);

    this.setState({
      bankAddress: this.props.user.userClientBankInfo.bankAddress,
      bankName: this.props.user.userClientBankInfo.bankName,
      bankAccount: this.props.user.userClientBankInfo.bankAccount,
      bankSwift: this.props.user.userClientBankInfo.bankSwift,
      bankIban: this.props.user.userClientBankInfo.bankIban,
      bankCurrency: this.props.user.userClientBankInfo.bankCurrency,
      bankCity: this.props.user.userClientBankInfo.bankCity,
      beneficiaryName: this.props.user.userClientBankInfo.beneficiaryName,
      streetAddress: this.props.user.userClientPersonalInfo.streetAddress,
      postalCode: this.props.user.userClientPersonalInfo.postalCode,
      city: this.props.user.userClientPersonalInfo.city,
      country: this.props.user.userClientPersonalInfo.country,
    });
  };

  toggleSubAgent = async (userId) => {
    this.setState({ ajaxProcess: true });
    await this.props.toggleSubAgent(userId);
    await this.props.getAgentClients(this.props.auth.user.id);
    this.setState({ ajaxProcess: false });
  };

  addClient = async () => {
    this.setState({ ajaxProcess: true });
    const newUser = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      dateOfBirth: this.state.dateOfBirth,
      password: this.state.password,
      password2: this.state.password2,
      phone: this.state.phone,
      countryCode: this.state.countryCode,
      country: this.state.country.sortname,
    };
    await this.props.addNewClient(this.props.auth.user.id, newUser);
    await this.props.getAgentClients(this.props.auth.user.id);
    this.setState({ ajaxProcess: false });
  };

  saveClientBankInfo = async () => {
    this.setState({
      userClientBankEdit: !this.state.userClientBankEdit,
    });

    const userBankInfoData = {
      userId: this.state.selectedUser._id,
      bankAddress: this.state.bankAddress,
      bankName: this.state.bankName,
      bankAccount: this.state.bankAccount,
      bankSwift: this.state.bankSwift,
      bankIban: this.state.bankIban,
      bankCurrency: this.state.bankCurrency,
      bankCity: this.state.bankCity,
      beneficiaryName: this.state.beneficiaryName,
    };

    await this.props.saveUserClientBankInfo(userBankInfoData);
    await this.props.getUserClientBankInfo(this.state.selectedUser._id);
  };

  changePassword = async () => {
    const passParams = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      confirmPassword: this.state.confirmPassword,
    };
    await this.props.updateUserPassword(
      this.state.selectedUser._id,
      passParams
    );
    this.setState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    if (this.props.snackMessages.variant === "success") {
      this.setState({ errors: {} });
    }
  };

  selectedFile = (selectedFiles, docType) => {
    if (isEmpty(selectedFiles)) {
      let errorObj = {};
      let userCurrentObj = this.state.userCurrentDocument;
      if (docType === "idCardFront") {
        userCurrentObj.frontIdMessage =
          "Invalid file format please upload jpeg, png or pdf only.";
        errorObj = {
          dropzonClassFront: "dropzon-input error",
          userCurrentDocument: userCurrentObj,
          idCardBox: false,
        };
      }
      if (docType === "idCardBack") {
        userCurrentObj.backIdMessage =
          "Invalid file format please upload jpeg, png or pdf only.";
        errorObj = {
          dropzonClassBack: "dropzon-input error",
          userCurrentDocument: userCurrentObj,
          idCardBox: false,
        };
      }
      if (docType === "proof_of_recidence") {
        userCurrentObj.message =
          "Invalid file format please upload jpeg, png or pdf only.";
        errorObj = {
          dropzonClass: "dropzon-input error",
          userCurrentDocument: userCurrentObj,
          idResidenceBox: false,
        };
      }
      this.setState(errorObj);
    } else {
      const { user } = this.props;
      let droppedFile = {};
      let userCurrentObj = this.state.userCurrentDocument;

      selectedFiles.map((file) => {
        droppedFile = file;
        return true;
      });

      let stateObj = {};

      if (docType === "idCardFront") {
        userCurrentObj.frontFile = droppedFile;
        userCurrentObj.file = droppedFile;
        userCurrentObj.docType = "idCardFront";
        userCurrentObj.docName = "Id Card";
        userCurrentObj.userIdentityId = user.userClientIdentity._id;
        stateObj = {
          dropzonClassFront: "dropzon-input",
          userCurrentDocument: userCurrentObj,
          idCardBox: true,
        };
        this.props.saveDocument(userCurrentObj);
      }
      if (docType === "idCardBack") {
        userCurrentObj.backFile = droppedFile;
        userCurrentObj.file = droppedFile;
        userCurrentObj.docType = "idCardBack";
        userCurrentObj.docName = "Id Card";
        userCurrentObj.userIdentityId = user.userClientIdentity._id;
        stateObj = {
          dropzonClassBack: "dropzon-input",
          userCurrentDocument: userCurrentObj,
          idCardBox: true,
        };
        this.props.saveDocument(userCurrentObj);
      }

      if (docType === "proof_of_recidence") {
        userCurrentObj.userIdentityId = user.userClientIdentity._id;
        userCurrentObj.address = this.state.address;
        userCurrentObj.city = this.state.city;
        userCurrentObj.zipcode = this.state.zipcode;
        userCurrentObj.country = this.state.countryCode;
        userCurrentObj.residenceFile = droppedFile;
        userCurrentObj.file = droppedFile;
        this.setState({
          userCurrentDocument: userCurrentObj,
          dropzonClass: "dropzon-input",
          idResidenceBox: true,
        });

        this.props.saveResidenceDoc(userCurrentObj);
      }

      this.setState(stateObj);
    }
  };

  resendVerificationEmail = async (client) => {
    const { user } = this.props.auth;
    await this.props.resendClientVerification(user.id, { clietId: client._id });
  };

  saveKycInformation = async () => {
    await this.props.finishIdentityForm(this.state.selectedUser._id);
    await this.props.getUserClientIdentity(this.state.selectedUser._id);
  };

  transferBalance = (userWallet) => {
    this.setState({
      passVerification: !this.state.passVerification,
      activeTransferWallet: userWallet,
    });
  };

  transferToClientBalance = async () => {
    let transferParams = {
      userId: this.props.auth.user.id,
      walletId: this.state.activeTransferWallet._id,
      coin: this.state.activeTransferWallet.coin,
      transferAmount: this.state.transferAmount,
      agentPassword: this.state.agentPassword,
    };
    await this.props.transferToClientWallet(transferParams);
    await this.props.getUserClientWallets(this.state.selectedUser._id);
    await this.props.getActiveAssets(this.props.auth.user.id);
    this.setState({
      passVerification: !this.state.passVerification,
    });
  };

  render() {
    const {
      tabValue,
      addNewUserBox,
      errors,
      countryCode,
      snackMessages,
      snackbarMessage,
      variant,
      clientDetails,
      selectedUser,
      tabNewUserValue,
      userClientBankEdit,
      address,
      city,
      zipcode,
      idCardBox,
      idResidenceBox,
    } = this.state;
    const {
      agentClients,
      userClientBankInfo,
      userClientIdentity,
      userClientProfile,
      userClientWallets,
    } = this.props.user;
    const { clientTransactions } = this.props.wallet;

    let countries = [];

    countries.push(
      <MenuItem key={0} value="">
        <em>None</em>
      </MenuItem>
    );

    Countries.map((countryData) =>
      countries.push(
        <MenuItem key={countryData.id} value={countryData}>
          {countryData.name}
        </MenuItem>
      )
    );

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

    let nextButton = true;

    if (
      !isEmpty(countryCode) &&
      !isEmpty(address) &&
      !isEmpty(city) &&
      !isEmpty(zipcode) &&
      idResidenceBox &&
      idCardBox
    ) {
      nextButton = false;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Agent | TrillionBit</title>
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
            content="https://www.trillionbit.com/user-profile"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Settings | TrillionBit" />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Settings | TrillionBit" />
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
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={!isEmpty(snackMessages) ? true : false}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
        >
          <SnackbarMessage
            onClose={this.handleSnackbarClose}
            variant={!isEmpty(snackMessages) ? snackMessages.variant : variant}
            message={
              !isEmpty(snackMessages) ? snackMessages.message : snackbarMessage
            }
          />
        </Snackbar>
        <div className="paddingTopbody">
          <Tabs
            className="settingSubMenu"
            scrollButtons="auto"
            variant="scrollable"
            onChange={this.handleTabChange.bind(this)}
            value={tabValue}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="client_management" label="Client Management" />
            {/* <Tab value="agent_commissions" label="Commissions" /> */}
            {/* <Tab value="reports" label="Reports" /> */}
          </Tabs>
          <Container className="mainbody" fixed={false}>
            <Dialog
              open={this.state.passVerification}
              onClose={() =>
                this.setState({
                  passVerification: !this.state.passVerification,
                })
              }
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Transfer Balance to{" "}
                {!isEmpty(this.state.activeTransferWallet)
                  ? this.state.activeTransferWallet.displayName
                  : ""}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {!isEmpty(this.state.activeTransferWallet)
                    ? this.state.activeTransferWallet.active
                      ? "Enter amount and your password to transfer balance."
                      : "Currenty is not supported with this wallet"
                    : undefined}
                </DialogContentText>
                {this.state.currentUserFiatWallet.active &&
                this.state.activeTransferWallet.active ? (
                  <DialogContentText>
                    Current Balance:{" "}
                    {`${parseFloat(
                      this.state.currentUserFiatWallet.walletAmount
                    ).toFixed(2)} ${this.state.currentUserFiatWallet.coin}`}
                  </DialogContentText>
                ) : undefined}
                {!isEmpty(this.state.activeTransferWallet) ? (
                  this.state.activeTransferWallet.active ? (
                    <div>
                      <TextField
                        error={errors.transferAmount ? true : false}
                        label="Amount"
                        type="number"
                        name="transferAmount"
                        fullWidth
                        value={this.state.transferAmount}
                        onChange={this.handleChange("transferAmount")}
                        margin="normal"
                        helperText={errors.transferAmount}
                      />
                      <TextField
                        error={errors.agentPassword ? true : false}
                        label="Password"
                        type="password"
                        name="agentPassword"
                        fullWidth
                        value={this.state.agentPassword}
                        onChange={this.handleChange("agentPassword")}
                        margin="normal"
                        helperText={errors.agentPassword}
                      />
                    </div>
                  ) : undefined
                ) : undefined}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() =>
                    this.setState({
                      passVerification: !this.state.passVerification,
                    })
                  }
                  color="primary"
                >
                  Cancel
                </Button>
                {!isEmpty(this.state.activeTransferWallet) ? (
                  this.state.activeTransferWallet.active ? (
                    <Button
                      onClick={() => this.transferToClientBalance()}
                      color="primary"
                    >
                      Transfer
                    </Button>
                  ) : undefined
                ) : undefined}
              </DialogActions>
            </Dialog>
            <Dialog
              open={clientDetails}
              onClose={() => this.setState({ clientDetails: false })}
              aria-labelledby="form-dialog-title"
              fullScreen
            >
              <AppBar style={{ backgroundColor: "#3f51b5" }}>
                <Toolbar className="homeLighttoolbar">
                  <div className="agentTitle">
                    <Typography variant="h6" className={classes.title}>
                      {selectedUser.firstname} {selectedUser.lastname}
                    </Typography>
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={() => this.setState({ clientDetails: false })}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </Toolbar>
              </AppBar>
              <DialogTitle id="form-dialog-title">
                {selectedUser.firstname} {selectedUser.lastname}
              </DialogTitle>
              <DialogContent className="agentDataBody">
                <Tabs
                  className="settingSubMenu"
                  scrollButtons="auto"
                  variant="scrollable"
                  onChange={this.handleNewUserTabChange.bind(this)}
                  value={tabNewUserValue}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab value="user_details" label="User Details" />
                  <Tab value="transactions" label="Transactions" />
                  <Tab value="balance_transfer" label="Balance Transfer" />
                  <Tab value="commissions" label="Commissions" />
                  {/* <Tab value="orders" label="Orders" /> */}
                  <Tab value="kyc" label="KYC" />
                </Tabs>
                {tabNewUserValue === "user_details" ? (
                  <div className="agentClientsDetails">
                    <div className="detailsbox">
                      <div className="titleHead">
                        <Typography variant="h6" gutterBottom>
                          Personal Info
                        </Typography>
                      </div>

                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item md={3}>
                          <Typography variant="h4" gutterBottom>
                            Name:
                          </Typography>
                          <Typography variant="h5" gutterBottom>
                            {selectedUser.firstname} {selectedUser.lastname}
                          </Typography>
                        </Grid>
                        <Grid item md={3}>
                          <Typography variant="h4" gutterBottom>
                            Email:
                          </Typography>
                          <Typography variant="h5" gutterBottom>
                            {selectedUser.email}
                          </Typography>
                        </Grid>
                        <Grid item md={3}>
                          <Typography variant="h4" gutterBottom>
                            Phone:
                          </Typography>
                          <Typography variant="h5" gutterBottom>
                            {selectedUser.phone}
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>

                    <div className="detailsbox">
                      <div className="titleHead">
                        <Typography variant="h6" gutterBottom>
                          Bank Info
                        </Typography>
                        <Button
                          color="primary"
                          onClick={() =>
                            userClientBankEdit
                              ? this.saveClientBankInfo()
                              : this.setState({
                                  userClientBankEdit:
                                    !this.state.userClientBankEdit,
                                })
                          }
                        >
                          {userClientBankEdit ? "Update" : "Edit"}
                        </Button>
                      </div>

                      <TableContainer component={Paper}>
                        <Table
                          className={classes.table}
                          aria-label="custom pagination table"
                        >
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank Beneficiary Name:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={
                                      errors.beneficiaryName ? true : false
                                    }
                                    label="Beneficiary Name"
                                    type="text"
                                    name="beneficiaryName"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.beneficiaryName}
                                    onChange={this.handleChange(
                                      "beneficiaryName"
                                    )}
                                    helperText={errors.beneficiaryName}
                                  />
                                ) : (
                                  userClientBankInfo.beneficiaryName
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank Name:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankName ? true : false}
                                    label="Bank Name"
                                    type="text"
                                    name="bankName"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.bankName}
                                    onChange={this.handleChange("bankName")}
                                    helperText={errors.bankName}
                                  />
                                ) : (
                                  userClientBankInfo.bankName
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank Address:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankAddress ? true : false}
                                    label="Bank Address"
                                    type="text"
                                    name="bankAddress"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.bankAddress}
                                    onChange={this.handleChange("bankAddress")}
                                    helperText={errors.bankAddress}
                                  />
                                ) : (
                                  userClientBankInfo.bankAddress
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank Account:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankAccount ? true : false}
                                    label="Bank Account"
                                    type="number"
                                    name="bankAccount"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.bankAccount}
                                    onChange={this.handleChange("bankAccount")}
                                    helperText={errors.bankAccount}
                                  />
                                ) : (
                                  userClientBankInfo.bankAccount
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank City:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankCity ? true : false}
                                    label="Bank City"
                                    type="text"
                                    name="bankCity"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.bankCity}
                                    onChange={this.handleChange("bankCity")}
                                    helperText={errors.bankCity}
                                  />
                                ) : (
                                  userClientBankInfo.bankCity
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank Currency:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankCurrency ? true : false}
                                    label="Bank Currency"
                                    type="text"
                                    name="bankCurrency"
                                    className="form-control"
                                    fullWidth={true}
                                    value={
                                      selectedUser.country === "IN"
                                        ? "INR"
                                        : selectedUser.country === "AE"
                                        ? "AED"
                                        : "USD"
                                    }
                                    onChange={this.handleChange("bankCurrency")}
                                    margin="normal"
                                    disabled={true}
                                    helperText={errors.bankCurrency}
                                  />
                                ) : selectedUser.country === "IN" ? (
                                  "INR"
                                ) : selectedUser.country === "AE" ? (
                                  "AED"
                                ) : (
                                  "USD"
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank{" "}
                                {this.state.country === "IN" ? "IFSC" : "IBAN"}:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankIban ? true : false}
                                    label={
                                      this.state.country === "IN"
                                        ? "IFSC"
                                        : "IBAN"
                                    }
                                    type="text"
                                    name="bankIban"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.bankIban}
                                    onChange={this.handleChange("bankIban")}
                                    helperText={errors.bankIban}
                                  />
                                ) : (
                                  userClientBankInfo.bankIban
                                )}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell component="th" scope="row">
                                Bank SWIFT:
                              </TableCell>
                              <TableCell align="right">
                                {userClientBankEdit ? (
                                  <TextField
                                    variant="filled"
                                    error={errors.bankSwift ? true : false}
                                    label="Bank SWIFT"
                                    type="text"
                                    name="bankSwift"
                                    className="form-control"
                                    fullWidth={true}
                                    value={this.state.bankSwift}
                                    onChange={this.handleChange("bankSwift")}
                                    helperText={errors.bankSwift}
                                  />
                                ) : (
                                  userClientBankInfo.bankSwift
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>

                    <div className="detailsbox">
                      <div className="titleHead">
                        <Typography variant="h6" gutterBottom>
                          {" "}
                          Reset Password{" "}
                        </Typography>
                      </div>

                      <Card className="dataListCard">
                        <CardContent className="padBoxBody authentication">
                          <TextField
                            variant="filled"
                            error={errors.oldPassword ? true : false}
                            label="Old Password"
                            type="password"
                            name="oldPassword"
                            className="form-control"
                            fullWidth={true}
                            value={this.state.oldPassword}
                            onChange={this.handleChange("oldPassword")}
                            margin="normal"
                            helperText={errors.oldPassword}
                          />
                          <TextField
                            variant="filled"
                            error={errors.newPassword ? true : false}
                            label="New Password"
                            type="password"
                            name="newPassword"
                            className="form-control"
                            fullWidth={true}
                            value={this.state.newPassword}
                            onChange={this.handleChange("newPassword")}
                            margin="normal"
                            helperText={errors.newPassword}
                          />
                          <TextField
                            variant="filled"
                            error={errors.confirmPassword ? true : false}
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            fullWidth={true}
                            value={this.state.confirmPassword}
                            onChange={this.handleChange("confirmPassword")}
                            margin="normal"
                            helperText={errors.confirmPassword}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.changePassword}
                          >
                            Change
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : undefined}

                {tabNewUserValue === "transactions" ? (
                  <div className="agentClientsDetails">
                    <Grid item>
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
                                      <FormControl
                                        className={classes.formControl}
                                      >
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
                                      <FormControl
                                        className={classes.formControl}
                                      >
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
                                          <MenuItem value={"BTCAED"}>
                                            BTCAED
                                          </MenuItem>
                                          <MenuItem value={"BCHAED"}>
                                            BCHAED
                                          </MenuItem>
                                          <MenuItem value={"LTCAED"}>
                                            LTCAED
                                          </MenuItem>
                                          <MenuItem value={"GLCAED"}>
                                            GLCAED
                                          </MenuItem>
                                          <MenuItem value={"XRPAED"}>
                                            XRPAED
                                          </MenuItem>
                                          <MenuItem value={"ETHAED"}>
                                            ETHAED
                                          </MenuItem>
                                        </Select>
                                      </FormControl>

                                      <FormControl
                                        className={classes.formControl}
                                      >
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
                                          <MenuItem value={"Open"}>
                                            Open
                                          </MenuItem>
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
                              hidden:
                                tableWidth === "fullscreen" ? false : true,
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
                            {
                              title: "Value",
                              field: "value",
                              filtering: false,
                            },
                            {
                              title: "Rate",
                              field: "rate",
                              filtering: false,
                              sorting: true,
                              hidden:
                                tableWidth === "fullscreen" ? false : true,
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
                          data={clientTransactions}
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
                                      primary={
                                        <div>Rate: {rowData.rate} AED</div>
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
                                      primary={
                                        <div>Rate: {rowData.rate} AED</div>
                                      }
                                    />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      inset
                                      primary={
                                        <div>Status: {rowData.status}</div>
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
                                </List>
                              );
                            }
                            return tabDom;
                          }}
                        />
                      </div>
                    </Grid>
                  </div>
                ) : undefined}

                {tabNewUserValue === "balance_transfer" ? (
                  <div className="agentClientsDetails">
                    <Grid item>
                      <div className="tableResponsive">
                        <div className="table">
                          <List className="dataTable">
                            <ListItem className="headRow">
                              <div className="td">
                                <Typography variant="body2" className="">
                                  WALLET
                                </Typography>
                              </div>
                              <div className="td">
                                <Typography variant="body2" className="">
                                  BALANCE
                                </Typography>
                              </div>
                              <div className="td">
                                <Typography variant="body2" className="">
                                  ADDRESS
                                </Typography>
                              </div>
                              <div className="td">
                                <Typography variant="body2" className="">
                                  DATE
                                </Typography>
                              </div>
                              <div className="td">
                                <Typography variant="body2" className="">
                                  TRANSFER
                                </Typography>
                              </div>
                            </ListItem>

                            {userClientWallets.map(
                              (userClientWallet, index) => {
                                return (
                                  <ListItem className="bodyRow" key={index}>
                                    <div className="td">
                                      <img
                                        src={currencyIcon(
                                          userClientWallet.coin
                                        )}
                                        alt="Im"
                                      />
                                      <div className="coinName">
                                        <Typography
                                          variant="body2"
                                          className=""
                                        >
                                          {userClientWallet.coin}
                                          <span className="shortForm">
                                            {userClientWallet.displayName}
                                          </span>
                                        </Typography>
                                      </div>
                                    </div>

                                    <div className="td">
                                      <Typography variant="body2" className="">
                                        <CurrencyFormat
                                          value={userClientWallet.walletAmount}
                                          displayType={"text"}
                                          thousandSeparator={true}
                                          prefix={`${userClientWallet.coin} `}
                                        />
                                      </Typography>
                                    </div>

                                    <div className="td">
                                      <Typography variant="body2" className="">
                                        {userClientWallet.destinationTag
                                          ? `${userClientWallet.xAddress} (${userClientWallet.walletAddress} : ${userClientWallet.destinationTag})`
                                          : userClientWallet.walletAddress}
                                      </Typography>
                                    </div>

                                    <div className="td">
                                      <Typography
                                        component="div"
                                        variant="body2"
                                        className=""
                                      >
                                        {moment(
                                          userClientWallet.createdAt
                                        ).format("LLL")}
                                      </Typography>
                                    </div>

                                    <div className="td">
                                      {userClientWallet.fiat &&
                                      userClientWallet.active ? (
                                        <Typography
                                          variant="body2"
                                          className=""
                                        >
                                          <Link
                                            to={`/`}
                                            onClick={() =>
                                              this.transferBalance(
                                                userClientWallet
                                              )
                                            }
                                            className="buyNow"
                                          >
                                            Deposit
                                          </Link>
                                        </Typography>
                                      ) : undefined}
                                    </div>
                                  </ListItem>
                                );
                              }
                            )}
                          </List>
                        </div>
                      </div>
                    </Grid>
                  </div>
                ) : undefined}

                {tabNewUserValue === "commissions" ? (
                  <div className="agentClientsDetails">
                    <Grid item>
                      <AgentCommission clientInfo={this.state.selectedUser} />
                    </Grid>
                  </div>
                ) : undefined}

                {tabNewUserValue === "orders" ? (
                  <div className="agentClientsDetails">
                    <Grid item>
                      <Typography>Orders</Typography>
                    </Grid>
                  </div>
                ) : undefined}

                {tabNewUserValue === "kyc" ? (
                  userClientProfile.emailVerified ? (
                    <div className="agentClientsDetails">
                      {!userClientIdentity.submitted ? (
                        <Grid container>
                          <Grid item md={6}>
                            <Card className="dataListCard minHeight">
                              <CardContent className="identityBoxInfo text-center">
                                <Typography variant="h6" className="title">
                                  Select Nationality
                                </Typography>

                                <Typography
                                  variant="subtitle2"
                                  className="subTitle"
                                >
                                  Choose the country that issued your ID.
                                </Typography>

                                <div className="imgBox passport">
                                  <img
                                    src={passportLogo}
                                    width="100"
                                    alt="passport"
                                  />
                                </div>

                                <div>
                                  <FormControl
                                    style={agentPortalStyle.kycFormControl}
                                    error={errors.userNationality}
                                  >
                                    <Select
                                      autoWidth={true}
                                      value={this.state.country}
                                      inputProps={{
                                        name: "country",
                                      }}
                                      onChange={this.handleCountryChange(
                                        "country"
                                      )}
                                    >
                                      {countries}
                                    </Select>
                                    <FormHelperText>
                                      {errors.userNationality}
                                    </FormHelperText>
                                  </FormControl>
                                </div>

                                {/* <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    disabled={(isEmpty(countryCode) ? true : false)}
                                                                    onClick={() => this.nextSteps('customerType')}
                                                                >
                                                                    Continue
                                                                </Button> */}
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item md={6}>
                            <Card className="dataListCard minHeight">
                              <CardContent className="identityBoxInfo text-center">
                                <div
                                  className={
                                    isEmpty(
                                      this.state.userCurrentDocument.frontFile
                                    )
                                      ? "sideBox"
                                      : "sideBox"
                                  }
                                >
                                  <Typography variant="h6" className="subTitle">
                                    ID front side{" "}
                                    <Help onClick={this.openHelp} />
                                  </Typography>
                                  <div>
                                    <Dropzone
                                      onDrop={(selectedFile) =>
                                        this.selectedFile(
                                          selectedFile,
                                          "idCardFront"
                                        )
                                      }
                                      accept="image/png, image/jpeg, application/pdf"
                                    >
                                      {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}>
                                          {isEmpty(
                                            this.state.userCurrentDocument
                                              .frontFile
                                          ) ? (
                                            <div
                                              className={
                                                this.state.dropzonClassFront
                                              }
                                            >
                                              <div className="imgBox">
                                                <img
                                                  src={uploadIcon}
                                                  alt="logo here"
                                                />
                                              </div>
                                              <input {...getInputProps()} />
                                              {
                                                this.state.userCurrentDocument
                                                  .frontIdMessage
                                              }
                                            </div>
                                          ) : (
                                            <div
                                              className={
                                                this.state.dropzonClassFront
                                              }
                                            >
                                              <div className="imgBox">
                                                <img
                                                  className="idImage"
                                                  src={URL.createObjectURL(
                                                    this.state
                                                      .userCurrentDocument
                                                      .frontFile
                                                  )}
                                                  alt={
                                                    this.state
                                                      .userCurrentDocument
                                                      .frontFile.path
                                                  }
                                                />
                                              </div>
                                              <input {...getInputProps()} />
                                              {
                                                this.state.userCurrentDocument
                                                  .frontFile.path
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Dropzone>
                                  </div>
                                </div>

                                <div
                                  className={
                                    isEmpty(
                                      this.state.userCurrentDocument.backFile
                                    )
                                      ? "sideBox"
                                      : "sideBox"
                                  }
                                >
                                  <Typography variant="h6" className="subTitle">
                                    ID back side{" "}
                                    <Help onClick={this.openHelp} />
                                  </Typography>
                                  <div>
                                    <Dropzone
                                      onDrop={(selectedFile) =>
                                        this.selectedFile(
                                          selectedFile,
                                          "idCardBack"
                                        )
                                      }
                                      accept="image/png, image/jpeg, application/pdf"
                                    >
                                      {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}>
                                          {isEmpty(
                                            this.state.userCurrentDocument
                                              .backFile
                                          ) ? (
                                            <div
                                              className={
                                                this.state.dropzonClassBack
                                              }
                                            >
                                              <div className="imgBox">
                                                <img
                                                  src={uploadIcon}
                                                  alt="logo here"
                                                />
                                              </div>
                                              <input {...getInputProps()} />
                                              {
                                                this.state.userCurrentDocument
                                                  .backIdMessage
                                              }
                                            </div>
                                          ) : (
                                            <div
                                              className={
                                                this.state.dropzonClassBack
                                              }
                                            >
                                              <div className="imgBox">
                                                <img
                                                  className="idImage"
                                                  src={URL.createObjectURL(
                                                    this.state
                                                      .userCurrentDocument
                                                      .backFile
                                                  )}
                                                  alt={
                                                    this.state
                                                      .userCurrentDocument
                                                      .backFile.path
                                                  }
                                                />
                                              </div>
                                              <input {...getInputProps()} />
                                              {
                                                this.state.userCurrentDocument
                                                  .backFile.path
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Dropzone>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item md={6}>
                            <Card className="dataListCard minHeight">
                              <CardContent className="identityBoxInfo text-center">
                                <Typography variant="h6" className="title">
                                  Upload proof of residency
                                </Typography>

                                <Typography
                                  variant="subtitle2"
                                  className="subTitle"
                                >
                                  This document shows that you're living at the
                                  provided address. please make sure:
                                </Typography>

                                <div className="uploadBox">
                                  <div
                                    className={
                                      isEmpty(
                                        this.state.userCurrentDocument.file
                                      )
                                        ? "sideBox"
                                        : "sideBox"
                                    }
                                  >
                                    <div>
                                      <Dropzone
                                        onDrop={(selectedFile) =>
                                          this.selectedFile(
                                            selectedFile,
                                            "proof_of_recidence"
                                          )
                                        }
                                        accept="image/png, image/jpeg, application/pdf"
                                      >
                                        {({ getRootProps, getInputProps }) => (
                                          <div {...getRootProps()}>
                                            {isEmpty(
                                              this.state.userCurrentDocument
                                                .residenceFile
                                            ) ? (
                                              <div
                                                className={
                                                  this.state.dropzonClass
                                                }
                                              >
                                                <div className="imgBox">
                                                  <img
                                                    src={uploadIcon}
                                                    alt="logo here"
                                                  />
                                                </div>
                                                <input {...getInputProps()} />
                                                {
                                                  this.state.userCurrentDocument
                                                    .message
                                                }
                                              </div>
                                            ) : (
                                              <div
                                                className={
                                                  this.state.dropzonClass
                                                }
                                              >
                                                <div className="imgBox">
                                                  <img
                                                    className="idImage"
                                                    src={URL.createObjectURL(
                                                      this.state
                                                        .userCurrentDocument
                                                        .residenceFile
                                                    )}
                                                    alt={
                                                      this.state
                                                        .userCurrentDocument
                                                        .residenceFile.path
                                                    }
                                                  />
                                                </div>
                                                {
                                                  this.state.userCurrentDocument
                                                    .residenceFile.path
                                                }
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </Dropzone>
                                    </div>
                                  </div>
                                </div>

                                {/* <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    disabled={
                                                                        (!isEmpty(this.state.userCurrentDocument.file)) ? false : true
                                                                    }
                                                                    onClick={this.uploadUseDocuments}
                                                                >
                                                                    Continue
                                                                </Button> */}
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item md={6}>
                            <Card className="dataListCard minHeight">
                              <CardContent className="identityBoxInfo text-center">
                                <Typography variant="h6" className="title">
                                  Residence Information
                                </Typography>

                                <Typography
                                  variant="subtitle2"
                                  className="subTitle"
                                >
                                  We'll need a information about your residency
                                </Typography>

                                <Grid container>
                                  <Grid item md={12} xs={12}>
                                    <TextField
                                      label="Add your home address"
                                      className="form-control"
                                      type="text"
                                      fullWidth={true}
                                      value={this.state.address}
                                      onChange={this.handleChange("address")}
                                      margin="normal"
                                    />
                                  </Grid>

                                  <Grid item md={12} xs={12}>
                                    <TextField
                                      className=" form-control"
                                      label="City"
                                      type="text"
                                      fullWidth={true}
                                      value={this.state.city}
                                      onChange={this.handleChange("city")}
                                      margin="normal"
                                    />
                                  </Grid>

                                  <Grid item md={12} xs={12}>
                                    <TextField
                                      className=" form-control"
                                      label="Zipcode"
                                      type="number"
                                      fullWidth={true}
                                      value={this.state.zipcode}
                                      onChange={this.handleChange("zipcode")}
                                      margin="normal"
                                    />
                                  </Grid>

                                  <Grid item md={12} xs={12}>
                                    <FormControl
                                      fullWidth={true}
                                      error={errors.country}
                                      className="form-control text-left"
                                    >
                                      <InputLabel htmlFor="country-helper">
                                        Select country
                                      </InputLabel>
                                      <Select
                                        autoWidth={true}
                                        value={this.state.country}
                                        inputProps={{
                                          name: "country",
                                        }}
                                        onChange={this.handleChange("country")}
                                      >
                                        {countries}
                                      </Select>
                                      <FormHelperText>
                                        {errors.country}
                                      </FormHelperText>
                                    </FormControl>
                                  </Grid>
                                </Grid>

                                {/* <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    className={classes.button}
                                                                    disabled={nextButton}
                                                                    onClick={() => this.nextSteps('selectID')}
                                                                >
                                                                    Continue
                                                                </Button> */}
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item md={12}>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              disabled={nextButton}
                              onClick={this.saveKycInformation}
                            >
                              Get verified
                            </Button>
                          </Grid>
                        </Grid>
                      ) : userClientIdentity.approve ? (
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item md={3} className="oneCenterBox">
                            <div className="pageNotFoundClient">
                              <Typography variant="h5" className="subtext">
                                <VerifiedUserIcon
                                  style={{ fontSize: 50, color: "#1D8341" }}
                                />
                              </Typography>

                              <Typography variant="h5" className="title">
                                Account Verified!
                              </Typography>

                              <Typography variant="h6" className="">
                                You are ready to trade now!
                              </Typography>

                              <div style={{ paddingTop: 20 }}>
                                <Chip
                                  label="Account Verified"
                                  color="primary"
                                />
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item md={3} className="oneCenterBox">
                            <div className="pageNotFoundClient">
                              <Typography variant="h5" className="subtext">
                                <VerifiedUserIcon style={{ fontSize: 50 }} />
                              </Typography>

                              <Typography variant="h5" className="title">
                                Document Submitted!
                              </Typography>

                              <Typography variant="h6" className="">
                                Verification pending..!
                              </Typography>

                              <div style={{ paddingTop: 20 }}>
                                <Chip
                                  label="Verification Pending"
                                  color="secondary"
                                />
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      )}
                    </div>
                  ) : (
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item md={3} className="oneCenterBox">
                        <div className="pageNotFoundClient">
                          <Typography variant="h5" className="subtext">
                            <HighlightOffOutlined
                              style={{ fontSize: 50, color: "#E04349" }}
                            />
                          </Typography>

                          <Typography variant="h6" className="">
                            Client email is not verified!
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  )
                ) : undefined}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ clientDetails: false })}
                  color="primary"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={addNewUserBox}
              onClose={() => this.setState({ addNewUserBox: true })}
              aria-labelledby="form-dialog-title"
              fullWidth={true}
            >
              <DialogTitle id="form-dialog-title">Add a new client</DialogTitle>
              <DialogContent>
                <Grid container spacing={0}>
                  <Grid item className="signupFormField1" md={6} xs={12}>
                    <TextField
                      error={errors.firstname ? true : false}
                      label="First Name"
                      type="text"
                      name="firstname"
                      className={classes.textField}
                      fullWidth={true}
                      value={this.state.firstname}
                      onChange={this.handleChange("firstname")}
                      margin="normal"
                      helperText={errors.firstname}
                    />
                  </Grid>
                  <Grid item md={6} xs={12} className="signupFormField2">
                    <TextField
                      error={errors.lastname ? true : false}
                      label="Last Name"
                      type="text"
                      name="lastname"
                      className={classes.textField}
                      fullWidth={true}
                      value={this.state.lastname}
                      onChange={this.handleChange("lastname")}
                      margin="normal"
                      helperText={errors.lastname}
                    />
                  </Grid>
                </Grid>

                <TextField
                  error={errors.email ? true : false}
                  label="Email"
                  type="email"
                  name="email"
                  className={classes.textField}
                  fullWidth={true}
                  value={this.state.email}
                  onChange={this.handleChange("email")}
                  margin="normal"
                  helperText={errors.email ? errors.email : ""}
                />

                <TextField
                  error={errors.dateOfBirth ? true : false}
                  label="Date Of Birth"
                  type="date"
                  name="dateOfBirth"
                  className={classes.textField}
                  value={this.state.dateOfBirth}
                  onChange={this.handleChange("dateOfBirth")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth={true}
                  margin="normal"
                  helperText={errors.dateOfBirth}
                />
                <TextField
                  error={errors.password ? true : false}
                  label="Password"
                  type="password"
                  name="password"
                  className={classes.textField}
                  fullWidth={true}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  margin="normal"
                  helperText={errors.password}
                />
                <TextField
                  error={errors.password2 ? true : false}
                  label="Confirm Password"
                  type="password"
                  name="password2"
                  className={classes.textField}
                  fullWidth={true}
                  value={this.state.password2}
                  onChange={this.handleChange("password2")}
                  margin="normal"
                  helperText={errors.password2}
                />
                <FormControl
                  style={agentPortalStyle.formControl}
                  error={errors.country ? true : false}
                >
                  <InputLabel htmlFor="country-helper">Country</InputLabel>
                  <Select
                    autoWidth={true}
                    value={this.state.country}
                    inputProps={{
                      name: "country",
                    }}
                    onChange={this.handleChange("country")}
                  >
                    {countries}
                  </Select>
                  <FormHelperText>
                    {errors.country
                      ? errors.country
                      : this.state.country
                      ? this.state.country.sortname === "IN"
                        ? `Your default currency is INR`
                        : "Your default currency is AED"
                      : ""}
                  </FormHelperText>
                </FormControl>
                <TextField
                  error={errors.phone ? true : false}
                  label="Phone"
                  type="number"
                  name="phone"
                  className={classes.textField}
                  fullWidth={true}
                  value={this.state.phone}
                  onChange={this.handleChange("phone")}
                  margin="normal"
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {countryCode}
                      </InputAdornment>
                    ),
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ addNewUserBox: false })}
                  color="primary"
                >
                  Cancel
                </Button>
                {this.state.ajaxProcess ? (
                  <CircularProgress size={20} />
                ) : (
                  <Button onClick={this.addClient} color="primary">
                    Add
                  </Button>
                )}
              </DialogActions>
            </Dialog>
            {tabValue === "client_management" ? (
              <Container className="mainbody" fixed={false}>
                <Grid container>
                  <Grid item xs={12} md={12}>
                    <div className="tableResponsive" fixed="false">
                      <MaterialTable
                        title="Clients"
                        options={{
                          actionsColumnIndex: -1,
                          search: false,
                          sorting: true,
                          showFirstLastPageButtons: false,
                          padding: "dense",
                          pageSize: 10,
                        }}
                        // components={{
                        //     Actions: () => (
                        //         <div>
                        //             <IconButton
                        //                 size="medium"
                        //                 aria-describedby='filterBox'
                        //                 onClick={this.addNewUserBox.bind(this)}
                        //             >
                        //                 <AddIcon fontSize="inherit" />
                        //             </IconButton>
                        //         </div>
                        //     )
                        // }}
                        icons={tableIcons}
                        data={agentClients}
                        // onRowClick={this.userSelected.bind(this)}
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
                        columns={[
                          {
                            title: "Avatar",
                            field: "avatar",
                            render: (rowData) => {
                              return (
                                <img
                                  alt=""
                                  style={{
                                    height: 35,
                                    width: 35,
                                    borderRadius: "50%",
                                  }}
                                  src={`${apiUrl}/api/guest/get_image/${rowData.avatar}`}
                                />
                              );
                            },
                          },
                          {
                            title: "Name",
                            field: "name",
                            render: (rowData) =>
                              `${rowData.firstname} ${rowData.lastname}`,
                          },
                          { title: "Email", field: "email" },
                          { title: "Phone", field: "phone" },
                          {
                            title: "Active",
                            field: "active",
                            render: (rowData) => {
                              if (rowData.active) {
                                return "Activated";
                              } else {
                                return (
                                  <Button
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                      this.resendVerificationEmail(rowData)
                                    }
                                  >
                                    Resend Email
                                  </Button>
                                );
                              }
                            },
                          },
                          {
                            title: "Sub Agent",
                            field: "subAgent",
                            hidden: this.props.auth.user.agent ? false : true,
                            render: (rowData) => (
                              <Switch
                                checked={rowData.subAgent}
                                onChange={() =>
                                  this.toggleSubAgent(rowData._id)
                                }
                                color="primary"
                                name="subAgent"
                                inputProps={{
                                  "aria-label": "primary checkbox",
                                }}
                              />
                            ),
                          },
                          { title: "Created Date", field: "createdAt" },
                        ]}
                        actions={[
                          {
                            icon: () => <tableIcons.Add />,
                            tooltip: "Add User",
                            isFreeAction: true,
                            onClick: () => this.addNewUserBox(),
                          },
                          {
                            icon: () => <Visibility />,
                            tooltip: "View User",
                            onClick: (event, rowData) =>
                              rowData.active
                                ? this.userSelected(rowData)
                                : alert("User not active"),
                          },
                        ]}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Container>
            ) : undefined}
            {tabValue === "reports" ? <div>Reports</div> : undefined}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const agentPortalStyle = {
  mainContainer: {
    width: "100%",
    flex: 1,
    maxWidth: "100%",
    padding: 0,
    paddingTop: 20,
  },
  formControl: {
    marginTop: 16,
    marginBottom: 8,
    width: "100%",
    textAlign: "left",
  },
  kycFormControl: {
    marginTop: 16,
    marginBottom: 8,
    width: "50%",
    textAlign: "left",
  },
  dropzonInputStyle: {
    border: "1px solid #ccc",
    borderStyle: "dashed",
    borderRadius: 5,
    cursor: "pointer",
    textAlign: "center",
  },
  mainStepRoot: {
    height: "100%",
    textAlign: "center",
  },
  dropzonStyle: {
    border: "1px solid #ccc",
    borderStyle: "dashed",
    borderRadius: 5,
    cursor: "pointer",
    textAlign: "center",
    padding: "5%",
    marginBottom: 20,
  },
};

AgentPortal.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  snackMessages: PropTypes.object.isRequired,
  clearSnackMessages: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  addNewClient: PropTypes.func.isRequired,
  getAgentClients: PropTypes.func.isRequired,
  getUserClientIdentity: PropTypes.func.isRequired,
  getUserClientPersonalInfo: PropTypes.func.isRequired,
  getUserClientBankInfo: PropTypes.func.isRequired,
  saveUserClientBankInfo: PropTypes.func.isRequired,
  getAllClientTransactions: PropTypes.func.isRequired,
  createUserIdentity: PropTypes.func.isRequired,
  saveDocument: PropTypes.func.isRequired,
  finishIdentityForm: PropTypes.func.isRequired,
  saveResidenceDoc: PropTypes.func.isRequired,
  getUserClientProfile: PropTypes.func.isRequired,
  resendClientVerification: PropTypes.func.isRequired,
  getUserClientWallets: PropTypes.func.isRequired,
  transferToClientWallet: PropTypes.func.isRequired,
  toggleSubAgent: PropTypes.func.isRequired,
  getActiveAssets: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  wallet: state.wallet,
  errors: state.errors,
  snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
  addNewClient,
  clearSnackMessages,
  clearErrors,
  getAgentClients,
  getUserClientIdentity,
  getUserClientPersonalInfo,
  getUserClientBankInfo,
  saveUserClientBankInfo,
  getAllClientTransactions,
  createUserIdentity,
  saveDocument,
  finishIdentityForm,
  saveResidenceDoc,
  getUserClientProfile,
  resendClientVerification,
  getUserClientWallets,
  transferToClientWallet,
  toggleSubAgent,
  getActiveAssets,
})(withStyles(themeStyles)(AgentPortal));
