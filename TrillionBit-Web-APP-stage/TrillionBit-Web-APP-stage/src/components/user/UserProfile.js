import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import {
  getSumsubVerificationToken,
  completeSumsubVerification,
} from "../../actions/userActions";

import { withStyles } from "@mui/styles/";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  IconButton,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Fade,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  CircularProgress,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityTab from "../auth/SecurityTab";

import {
  Avatar,
  List,
  ListItem,
  Chip,
  InputAdornment,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

import tableIcons from "../../common/tableIcons";

import MaterialTable from "material-table";

import UserBasicInfo from "./UserBasicInfo";
import {
  getUserProfile,
  updateUser2FA,
  getUserDocuments,
  getUserIdentity,
  getUserResidence,
  getUserPersonalInfo,
  updateProfilePicture,
  getUserDetails,
  getUserLogs,
  updateUserPassword,
  sendMobileVerificationCode,
  verifyPhone,
  editMobileNumber,
  getVerificationToken,
  startVerification,
  updateUserIdentityTag,
} from "../../actions/userActions";
import isEmpty from "../../validation/isEmpty";

import { clearSnackMessages } from "../../actions/messageActions";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";

import UserReferral from "./UserReferral";
import UserApi from "./UserApi";

import themeStyles from "../../assets/themeStyles";

import apiUrl from "../config";
import styles from "../../assets/styles";
import SimpleReactValidator from "simple-react-validator";
import SumsubWebSdk from "@sumsub/websdk-react";

var twoFactor = require("node-2fa");
// var tfa = require('2fa');
var Onfido = require("onfido-sdk-ui");
const moment = require("moment");

class UserProfile extends Component {
  state = {
    authEnabled: false,
    twoFactorDialog: false,
    twoFactorProcessDialog: false,
    loading: false,
    twoFaSecret: {},
    verificationToken: "",
    twoFaDialog: false,
    userDocuments: false,
    tabValue: "account_info",
    errors: {},
    messages: {},
    snackMessages: {},
    variant: "success",
    snackbarMessage: "",
    tfaKey: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    tfaOpts: {
      // the number of counters to check before what we're given
      // default: 0
      beforeDrift: 2,
      // and the number to check after
      // default: 0
      afterDrift: 2,
      // if before and after drift aren't specified,
      // before + after drift are set to drift / 2
      // default: 0
      drift: 4,
      // the step for the TOTP counter in seconds
      // default: 30
      step: 30,
    },
    totp: "",
    verifyPhone: false,
    verificationCode: "",
    tokenVerifyErrorMsg: "",
    editMobileNumberModal: false,
    mobileNumber: "",
    countryCode: "+00",
    startDocVr: false,
    processPaymentBox: false,
    isProfileImageValid: true,
  };

  validator = new SimpleReactValidator({
    element: (message) => (
      <div style={{ color: "red" }} className={"error"}>
        {message}
      </div>
    ),
    validators: {
      password: {
        // name the rule
        message:
          "Password must contain at least eight character long one letter, number and allowed special character !@#$%^&?*.",
        rule: (val, params, validator) => {
          return validator.helpers.testRegex(
            val,
            /^(?=.*[0-9])(?=.*[!@#$%^&?*])[a-zA-Z0-9!@#$%^&?*]{8,50}$/i
          );
        },
        messageReplace: (message, params) =>
          message.replace(":values", this.helpers.toSentence(params)), // optional
        required: true, // optional
      },
    },
  });

  componentDidMount = async () => {
    this.handleLoadPageSelectedTab();
    // window.fcWidget.destroy();
    const { auth } = this.props;
    await this.props.getUserProfile(auth.user.id);
    await this.props.getUserIdentity(auth.user.id);
    await this.props.getUserDetails(auth.user.id);
    await this.props.getUserLogs(100, auth.user.id);
    if (!isEmpty(this.props.match.params.tabName)) {
      this.setState({ tabValue: this.props.match.params.tabName });
    }
    if (auth.user.phone) {
      let countryCode = auth.user.phone.split(" ");
      if (countryCode) this.setState({ countryCode: countryCode[0] });
    }
    this.setState({ authEnabled: this.props.user.userProfile.twoFactorAuth });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.snackMessages) {
      this.setState({ snackMessages: nextProps.snackMessages });
    }
  }

  handleLoadPageSelectedTab = () => {
    const query = new URLSearchParams(this.props.location.search);
    const tabValue = query.get("tab");
    if (tabValue) {
      this.setState({ tabValue });
    }
  };

  handleDisable = async () => {
    this.setState({ loading: true });
    const { auth } = this.props;
    await this.props.updateUser2FA({
      email: auth.user.email,
      twoFactorAuth: "false",
    });
    await this.props.getUserProfile(this.props.auth.user.id);
    this.setState({
      loading: false,
      twoFactorDialog: false,
      authEnabled: false,
    });
  };

  handleClose() {
    this.setState({
      twoFactorDialog: false,
      twoFactorProcessDialog: false,
      twoFaDialog: false,
    });
  }

  handleInput = (name) => (event) => {
    if (name === "verificationToken")
      this.setState({ tokenVerifyErrorMsg: "" });

    this.setState({ [name]: event.target.value });
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  handleTwoFaChange = (name) => async (event) => {
    if (event.target.checked) {
      this.setState({ twoFactorProcessDialog: true });
      const { user } = this.props.auth;
      // let twoFactor = {};
      // tfa.generateKey(32, ((err, key) => {
      //     this.setState({ twoFaSecret: twoFactor });
      //     tfa.generateGoogleQR('Bitexuae', user.email, key, ((err, qr) => {
      //         // data URL png image for google authenticator
      //         twoFactor.qr = qr;
      //         twoFactor.secret = key;
      //         this.setState({ twoFaSecret: twoFactor });
      //     }).bind(this));
      // }).bind(this));
      var newSecret = twoFactor.generateSecret({
        name: "TrillionBit",
        account: user.email,
      });

      this.setState({ twoFaSecret: newSecret });
      this.setState({ [name]: event.target.checked });
    } else {
      this.setState({ twoFaDialog: true });
    }
    if (name === "authEnabled") {
      this.setState({ authEnabled: event.target.checked ? false : true });
    }
  };

  checkFeatureFlagForVerification = async () => {
    if (process.env.REACT_APP_VERIFICATION_FLAG === "ONFIDO_VERIFICATION") {
      return this.startDocVerificationOnfido();
    } else {
      return this.startValidationSumSub();
    }
  };
  startValidationSumSub = async () => {
    try {
      const accessToken = await this.props.getSumsubVerificationToken(
        this.props.auth.user.id
      );

      // Define the configuration for the WebSDK
      const config = {
        lang: "en", // language of WebSDK texts and comments (ISO 639-1 format)
        email: this.props.auth.user.email, // applicant email
        phone: this.props.auth.user.phone, // applicant phone
        theme: "light", // theme: light or dark
      };

      // Define the options for the WebSDK
      const options = {
        addViewportTag: false,
        adaptIframeHeight: true,
      };

      // Define the handlers for messages and errors
      const messageHandler = (type, payload) => {
        console.log("Message received:", type, payload);
      };

      const errorHandler = (error) => {
        console.error("Error occurred:", error);
      };

      // Launch the WebSDK
      SumsubWebSdk.init(accessToken, this.handleTokenExpiration)
        .withConf(config)
        .withOptions(options)
        .on("idCheck.onStepCompleted", messageHandler)
        .on("idCheck.onError", errorHandler)
        .build()
        .launch("#sumsub-websdk-container");
    } catch (error) {
      console.error("Error initializing Sumsub WebSDK:", error);
    }
  };

  // Handler for token expiration
  handleTokenExpiration = async () => {
    try {
      const newToken = await this.props.getSumsubVerificationToken(
        this.props.auth.user.id
      );
      return newToken;
    } catch (error) {
      console.error("Error fetching new access token:", error);
    }
  };

  startDocVerificationOnfido = async () => {
    // if (this.props.auth.user.country === 'IN') {
    this.setState({ startDocVr: true, processPaymentBox: true });
    const onfidoToken = await getVerificationToken(this.props.auth.user.id);

    const currentProps = this.props;

    this.setState({ startDocVr: false, processPaymentBox: false });
    await this.props.updateUserIdentityTag(this.props.user.userIdentity);

    let onfido = Onfido.init({
      steps: [
        {
          type: "welcome",
          options: {
            title: "Verify Your Identity",
            descriptions: [
              "For a limitless experience, we will need to",
              "verify your identity.",
              "It will take a few minutes to get verified",
            ],
          },
        },
        {
          type: "document",
          options: {
            // "country": "IND",
            // "documentTypes": {
            //     "passport": false,
            //     "national_identity_card": true,
            //     "driving_licence": false,
            // },
            showCountrySelection: true,
          },
        },
        "face",
        "complete",
      ],
      smsNumberCountryCode: "IN",
      useModal: true,
      isModalOpen: true,
      // the JWT token that you generated earlier on
      token: onfidoToken.token,
      // ID of the element you want to mount the component on
      // containerId: 'onfido-mount',
      // ALTERNATIVE: if your integration requires it, you can pass in the container element instead
      // (Note that if `containerEl` is provided, then `containerId` will be ignored)
      // containerEl: <div id="root" />,
      onModalRequestClose: function () {
        // Update options with the state of the modal
        onfido.setOptions({ isModalOpen: false });
        window.location.reload();
      },
      onComplete: function (data) {
        console.log("everything is complete", data, currentProps);
        onfido.setOptions({ isModalOpen: false });
        startVerification(currentProps.auth.user.id, data.face.id);
      },
    });
    // } else {
    //     this.startValidation();
    // }
  };

  async handleTabChange(event, value) {
    const { user } = this.props;
    this.setState({ tabValue: value });
    if (value === "identity") {
      await this.props.getUserDocuments(user.userIdentity._id);
      await this.props.getUserResidence(user.userIdentity._id);
    }
  }

  handleTokenVerification = async () => {
    this.setState({ loading: true });
    const { twoFaSecret, verificationToken } = this.state;
    // var counter = Math.floor(Date.now() / 1000 / tfaOpts.step);
    // var code = tfa.generateCode(twoFaSecret.secret, counter);
    // var validHOTP = tfa.verifyHOTP(twoFaSecret.secret, verificationToken, counter, tfaOpts);
    // const validTOTP = tfa.verifyTOTP(twoFaSecret.secret, verificationToken, tfaOpts);
    const verifyToken = twoFactor.verifyToken(
      twoFaSecret.secret,
      verificationToken
    );

    // const verifyCode = twoFactor.verifyToken(twoFaSecret.secret, verificationToken);
    // console.log(validTOTP, validHOTP, verificationToken, code, twoFaSecret);
    this.setState({ loading: false });

    if (verifyToken) {
      if (verifyToken.delta >= 0) {
        const { auth } = this.props;
        await this.props.updateUser2FA({
          email: auth.user.email,
          twoFactorSecret: twoFaSecret.secret,
          twoFactorAuth: "true",
        });
        await this.props.getUserProfile(this.props.auth.user.id);
        this.setState({
          loading: false,
          twoFactorProcessDialog: false,
          authEnabled: true,
          tokenVerifyErrorMsg: "",
          verificationToken: "",
        });
      } else {
        // alert('Code expired.!'); this.setState({ tokenVerifyErrorMsg: '' });
        this.setState({
          loading: false,
          tokenVerifyErrorMsg: "Code expired.!",
        });
      }
    } else {
      // alert('Code missmatch.!');
      this.setState({
        loading: false,
        tokenVerifyErrorMsg: "Code missmatch.!",
      });
    }
  };

  disableTokenVerification = async () => {
    this.setState({ loading: true });
    const { verificationToken } = this.state;
    const { userProfile } = this.props.user;

    const verifyToken = await twoFactor.verifyToken(
      userProfile.twoFactorSecret,
      verificationToken
    );

    if (!isEmpty(verifyToken)) {
      if (verifyToken.delta >= 0) {
        this.setState({
          loading: false,
          twoFaDialog: false,
          twoFactorDialog: true,
          tokenVerifyErrorMsg: "",
          verificationToken: "",
        });
      } else {
        // alert('Code expired.!'); this.setState({ tokenVerifyErrorMsg: '' });
        this.setState({
          loading: false,
          tokenVerifyErrorMsg: "Code expired.!",
        });
      }
    } else {
      // alert('Code missmatch.!');
      this.setState({
        loading: false,
        tokenVerifyErrorMsg: "Code missmatch.!",
      });
    }
  };

  startValidation = () => {
    this.props.history.push("/start-verification");
  };

  arrayBufferToBase64 = (buffer) => {
    let base64Flag = "data:image/jpeg;base64,";
    let binary = "";
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return base64Flag + window.btoa(binary);
  };

  getMimetype = (signature) => {
    let type;
    switch (signature) {
      case "89504E47":
        type = "image/png";
        break;
      case "47494638":
        type = "image/gif";
        break;
      case "FFD8FFE0":
      case "FFD8FFE1":
      case "FFD8FFE2":
      case "FFD8FFE3":
      case "FFD8FFE8":
        type = "image/jpeg";
        break;
      default:
        type = "unknown"; // Or you can use the blob.type as fallback
        break;
    }
    return type;
  };

  selectedProfilePicture = async (e) => {
    this.setState({ isProfileImageValid: true });
    const fileReader = new FileReader();
    fileReader.onloadend = async (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result);
        let bytes = [];
        uint.forEach((byte) => {
          bytes.push(byte.toString(16));
        });
        const hex = bytes.join("").toUpperCase();
        if (this.getMimetype(hex) === "unknown") {
          this.setState({ isProfileImageValid: false });
        } else {
          await this.props.updateProfilePicture(this.props.auth.user.id, {
            file: e.target.files[0],
          });
          await this.props.getUserDetails(this.props.auth.user.id);
        }
      }
    };
    const file = e.target.files[0];
    const blob = file.slice(0, 4);
    fileReader.readAsArrayBuffer(blob);
  };

  selectProfilePic = (e) => {
    e.preventDefault();
    document.getElementById("profilePicture").click();
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  openEditMobileNumberModal = () => {
    this.setState({ editMobileNumberModal: true });
  };

  editMobileNumber = async () => {
    const { user } = this.props.auth;
    const res = await this.props.editMobileNumber(
      user.id,
      this.state.mobileNumber,
      this.state.countryCode
    );
    if (this.props.auth.updateMobileNumber) {
      this.setState({ editMobileNumberModal: false });
      this.props.getUserProfile(this.props.auth.user.id);
      this.props.getUserDetails(this.props.auth.user.id);
    }
  };

  changePassword = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      const { user } = this.props.auth;
      const passParams = {
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
        confirmPassword: this.state.confirmPassword,
      };
      await this.props.updateUserPassword(user.id, passParams);
      this.setState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (this.props.snackMessages.variant === "success") {
        this.setState({ errors: {} });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  verifyPhone = async () => {
    const { auth } = this.props;
    await this.props.verifyPhone(auth.user.id, this.state.verificationCode);
    await this.props.getUserProfile(auth.user.id);
    if (this.props.user.userProfile.phoneVerified) {
      this.setState({ verifyPhone: false });
    }
  };

  render() {
    const {
      authEnabled,
      twoFactorDialog,
      loading,
      twoFactorProcessDialog,
      verificationToken,
      twoFaSecret,
      twoFaDialog,
      tabValue,
      snackMessages,
      variant,
      snackbarMessage,
      errors,
      oldPassword,
      newPassword,
      confirmPassword,
    } = this.state;

    const { auth, user, classes } = this.props;

    let tabContent = (
      <div className="bodyInformation">
        <Typography component="h2" className="bodyTitle">
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card className="dataListCard">
              <CardHeader title="Profile Image" />
              <CardContent alignitems="center" className="profileImgaeBox">
                <Avatar
                  src={`${apiUrl}/api/guest/get_image/${auth.currentLoginUser?.avatar}`}
                  className={classes.avatar}
                />
                <Typography variant="h2" className="userName">
                  {auth.user.firstname + " " + auth.user.lastname}
                </Typography>

                <Typography variant="h5" className="cityName">
                  {"Trader Level: " +
                    (user.userProfile ? user.userProfile.traderLevel : 1)}
                </Typography>

                <Typography variant="h5" className="timeDate">
                  4:32 PM (GMT-4)
                </Typography>

                <div className="changePic">
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                  />
                  <label htmlFor="contained-button-file">
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={this.selectedProfilePicture}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      className={classes.button}
                      onClick={this.selectProfilePic}
                    >
                      Change Picture
                    </Button>
                  </label>
                  {this.state.isProfileImageValid === false && (
                    <Typography color="error" variant="h2" className="">
                      Please select valid Image.
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card className="dataListCard">
              <CardHeader title="Profile Details" />
              <CardContent className="profileListItem">
                <List className={classes.root}>
                  <ListItem>
                    <Typography variant="h5" className="">
                      Email Address: {auth.user.email}
                    </Typography>

                    <Typography
                      variant="h6"
                      className={
                        user.userProfile.emailVerified ? "verified" : ""
                      }
                    >
                      {"Status: " +
                        (user.userProfile.emailVerified
                          ? "Verified"
                          : "Not Verified")}
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography variant="h5" className="">
                      Phone Number: {auth.user.phone}
                    </Typography>

                    {user.userProfile.phoneVerified ? (
                      <Typography variant="h6" className={"verified"}>
                        Status: Verified
                      </Typography>
                    ) : (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          this.props.sendMobileVerificationCode(
                            this.props.auth.user.id
                          );
                          this.setState({ verifyPhone: true });
                        }}
                      >
                        Click to verify
                      </Link>
                    )}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={this.openEditMobileNumberModal}
                    >
                      Edit Phone Number
                    </Link>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );

    if (tabValue === "basic_info") {
      tabContent = <UserBasicInfo />;
    }

    if (tabValue === "security") {
      tabContent = (
        <SecurityTab
          auth={auth}
          user={user}
          getSumsubVerificationToken={this.props.getSumsubVerificationToken}
          changePassword={this.changePassword}
          handleChange={this.handleChange}
          handleTwoFaChange={this.handleTwoFaChange}
          validator={this.validator}
          errors={errors}
          oldPassword={oldPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
        />
      );
    }

    if (tabValue === "identity") {
      if (!user.userIdentity.submitted) {
        tabContent = (
          <div className="bodyInformation">
            <Typography component="h2" className="bodyTitle">
              Identity Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={3} />
              <Grid item xs={12} md={6}>
                <Card className="dataListCard">
                  <CardHeader title="Identity Documents" />
                  {this.state.startDocVr ? undefined : (
                    <CardContent className="identityBoxInfo">
                      <Typography variant="h3" className="title">
                        Continue setting up your account.
                      </Typography>

                      <Typography variant="h5" className="subTitle">
                        You are almost ready to trade!
                      </Typography>

                      {this.props.user.userIdentity.approve ? (
                        <Chip label="Account Verified" color="primary" />
                      ) : this.props.user.userIdentity.submitted ? (
                        <Chip label="Verification Pending" color="secondary" />
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={this.startValidation.bind(this)}
                        >
                          verify account
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      } else {
        tabContent = (
          <div className="bodyInformation">
            <Typography component="h2" className="bodyTitle">
              Identity Information{" "}
              {user.userIdentity.approve ? (
                <Chip
                  label="Verified"
                  color="primary"
                  deleteIcon={<DoneIcon />}
                />
              ) : (
                <Chip label="Pending" color="secondary" />
              )}
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={3} />
              <Grid item xs={12} md={6}>
                <Card className="dataListCard">
                  <CardHeader title="Account Verification" />
                  <CardContent className="identityBoxInfo">
                    {this.props.user.userIdentity.approve ? (
                      <Typography variant="h3" className="title">
                        Congratulations! You are successfully verified.
                      </Typography>
                    ) : (
                      <Typography variant="h3" className="title">
                        Continue setting up your account.
                      </Typography>
                    )}

                    {this.props.user.userIdentity.approve ? (
                      <Typography variant="h5" className="subTitle">
                        You are ready to trade now!
                      </Typography>
                    ) : (
                      <Typography variant="h5" className="subTitle">
                        You are almost ready to trade!
                      </Typography>
                    )}

                    {this.props.user.userIdentity.approve ? (
                      <IconButton aria-label="settings">
                        <VerifiedUserIcon
                          style={{ fontSize: 50, color: "#1D8341" }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton aria-label="settings">
                        <VerifiedUserIcon style={{ fontSize: 50 }} />
                      </IconButton>
                    )}

                    {this.props.user.userIdentity.approve ? (
                      <Typography variant="h5" className="subTitle">
                        Go to trade page to start trading.
                      </Typography>
                    ) : (
                      <Typography variant="h5" className="subTitle">
                        It only takes a few minutes to get verified.
                      </Typography>
                    )}

                    {this.props.user.userIdentity.approve ? (
                      <Chip label="Account Verified" color="primary" />
                    ) : (
                      <Chip label="Verification Pending" color="secondary" />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
        );
      }
    }

    if (tabValue === "referral") {
      tabContent = <UserReferral />;
    }

    if (tabValue === "user_api") {
      tabContent = <UserApi {...this.props} />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Settings | TrillionBit</title>
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
        <div className="paddingTopbody100">
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
              variant={
                !isEmpty(snackMessages) ? snackMessages.variant : variant
              }
              message={
                !isEmpty(snackMessages)
                  ? snackMessages.message
                  : snackbarMessage
              }
            />
          </Snackbar>
          <Dialog
            className="Enable2FAsection"
            open={this.state.verifyPhone}
            onClose={() => this.setState({ verifyPhone: false })}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the verification code sent to your phone
              </DialogContentText>
              <TextField
                variant="filled"
                className={classes.textField}
                autoFocus
                margin="dense"
                error={errors.verificationCode ? true : false}
                label="Verification Code"
                type="number"
                name="verificationCode"
                fullWidth={true}
                value={this.state.verificationCode}
                onChange={this.handleChange("verificationCode")}
                helperText={errors.verificationCode}
              />
              <button
                className="subResendCode"
                onClick={() =>
                  this.props.sendMobileVerificationCode(this.props.auth.user.id)
                }
                variant="contained"
                color="primary"
              >
                Resend Code
              </button>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ verifyPhone: false })}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={this.verifyPhone}
                variant="contained"
                color="primary"
              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            className="Enable2FAsection"
            open={twoFaDialog}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
          >
            <DialogTitle id="form-dialog-title">
              Disable Two-Factor Authentication
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the 6-digit code generated by your authenticator app.
              </DialogContentText>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <TextField
                    variant="filled"
                    className={classes.textField}
                    autoFocus
                    margin="dense"
                    id="twoFaCode"
                    label="Validation Token"
                    value={verificationToken}
                    onChange={this.handleInput.bind(this)("verificationToken")}
                    type="number"
                    fullWidth
                    error={this.state.tokenVerifyErrorMsg ? true : false}
                    helperText={this.state.tokenVerifyErrorMsg}
                  />
                  <Typography variant="h6" className="subtitle">
                    If you have lost your device or can't use your app, please
                    contact{" "}
                    <a href="mailto:support@bitex.com"> support@bitex.com </a>
                  </Typography>
                </Grid>
              </Grid>
              <Fade
                in={loading}
                style={{
                  transitionDelay: loading ? "100ms" : "0ms",
                }}
                unmountOnExit
              >
                <LinearProgress />
              </Fade>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose.bind(this)}
                variant="contained"
                color="secondary"
              >
                Close
              </Button>
              <Button
                onClick={this.disableTokenVerification.bind(this)}
                variant="contained"
                color="primary"
              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            className="Enable2FAsection"
            open={twoFactorProcessDialog}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            // fullScreen={true}
          >
            <DialogTitle id="form-dialog-title">
              Enable Two-Factor Authentication Setup{" "}
            </DialogTitle>
            <DialogContent>
              <Typography variant="h5" className="title">
                1. Scan this barcode with your application
              </Typography>

              <Typography variant="h6" className="subtitle">
                Scan the image with the two-factor authenticator app on your
                phone.
              </Typography>

              <div className="text-center barcodeImg">
                <img
                  src={twoFaSecret.qr}
                  style={{ maxWidth: 180, maxHeight: 180 }}
                  alt="Two Factor Auth"
                />
              </div>

              <Typography variant="h5" className="title">
                2. Enter the six-digit code from the application
              </Typography>

              <Typography variant="h6" className="subtitle">
                After scanning the QR code image, the app will display a
                six-digit code that you can enter below.
              </Typography>

              <TextField
                variant="filled"
                className={classes.textField}
                autoFocus
                margin="dense"
                id="twoFaCode"
                label="Validation Token"
                value={verificationToken}
                onChange={this.handleInput.bind(this)("verificationToken")}
                type="number"
                fullWidth
                error={this.state.tokenVerifyErrorMsg ? true : false}
                helperText={this.state.tokenVerifyErrorMsg}
              />

              <Fade
                in={loading}
                style={{
                  transitionDelay: loading ? "100ms" : "0ms",
                }}
                unmountOnExit
              >
                <LinearProgress />
              </Fade>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose.bind(this)}
                variant="contained"
                color="secondary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleTokenVerification.bind(this)}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            className="Enable2FAsection"
            open={twoFactorDialog}
            // onClose={this.handleClose.bind(this)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Disable 2FA"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to disable Two-Factor Authentication ?
              </DialogContentText>
              <Fade
                in={loading}
                style={{
                  transitionDelay: loading ? "100ms" : "0ms",
                }}
                unmountOnExit
              >
                <LinearProgress />
              </Fade>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose.bind(this)}
                variant="contained"
                color="secondary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleDisable.bind(this)}
                variant="contained"
                color="primary"
                autoFocus
                disabled={loading}
              >
                Disable
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            className="Enable2FAsection"
            open={this.state.editMobileNumberModal}
            onClose={() => this.setState({ editMobileNumberModal: false })}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Edit Mobile Number</DialogTitle>
            <DialogContent>
              <TextField
                variant="filled"
                className={classes.textField}
                autoFocus
                margin="dense"
                error={errors.mobileNumber ? true : false}
                label="Mobile Number"
                type="number"
                name="mobileNumber"
                fullWidth={true}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {this.state.countryCode}
                    </InputAdornment>
                  ),
                }}
                value={this.state.mobileNumber}
                onChange={this.handleChange("mobileNumber")}
                helperText={errors.mobileNumber}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ editMobileNumberModal: false })}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={this.editMobileNumber}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </DialogActions>
          </Dialog>

          <Tabs
            className="settingSubMenu"
            scrollButtons="auto"
            variant="scrollable"
            onChange={this.handleTabChange.bind(this)}
            value={tabValue}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="account_info" label="Account Info" />
            <Tab value="basic_info" label="Basic Info" />
            <Tab value="security" label="Security" />
            {/* <Tab value="identity" label="Identity" /> */}
            <Tab value="referral" label="Referral" />
            {/* <Tab value="user_api" label="API" /> */}
          </Tabs>
          <Container
            className="mainbody settingpage"
            style={styles.mainContainer}
            fixed={false}
          >
            <Grid container>
              <Grid item xs={12} md={12}>
                <Container className="padding0">{tabContent}</Container>
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

UserProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  snackMessages: PropTypes.object.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  updateUser2FA: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
  getUserIdentity: PropTypes.func.isRequired,
  getUserResidence: PropTypes.func.isRequired,
  getUserPersonalInfo: PropTypes.func.isRequired,
  updateProfilePicture: PropTypes.func.isRequired,
  getUserDetails: PropTypes.func.isRequired,
  clearSnackMessages: PropTypes.func.isRequired,
  getUserLogs: PropTypes.func.isRequired,
  updateUserPassword: PropTypes.func.isRequired,
  sendMobileVerificationCode: PropTypes.func.isRequired,
  verifyPhone: PropTypes.func.isRequired,
  // startVerificationCheck: PropTypes.func.isRequired,
  updateUserIdentityTag: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  errors: state.errors,
  snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
  getUserProfile,
  updateUser2FA,
  getUserDocuments,
  getUserIdentity,
  getUserResidence,
  getUserPersonalInfo,
  updateProfilePicture,
  getUserDetails,
  clearSnackMessages,
  getUserLogs,
  updateUserPassword,
  sendMobileVerificationCode,
  verifyPhone,
  editMobileNumber,
  updateUserIdentityTag,
  getSumsubVerificationToken, // New action
  completeSumsubVerification, // New action
})(withStyles(themeStyles)(UserProfile));
