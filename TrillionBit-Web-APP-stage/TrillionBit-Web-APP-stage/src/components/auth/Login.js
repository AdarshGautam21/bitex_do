import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import isEmpty from "../../validation/isEmpty";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import LockIcon from "@mui/icons-material/Lock";
import { Typography, Checkbox } from "@mui/material";
import { Link } from "react-router-dom";
import {
  LinearProgress,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  browserName,
  fullBrowserVersion,
  osName,
  osVersion,
  getUA,
  mobileVendor,
  mobileModel,
  deviceType,
} from "react-device-detect";
import { Carousel } from "react-responsive-carousel";
import {
  loginUser,
  verify2faCode,
  logOut,
  clearErrors,
  setVerifiedEmail,
  removeLastLoginRedirectedLink,
} from "../../actions/authActions";
import { getUserProfile } from "../../actions/userActions";
import {
  clearMessages,
  clearSnackMessages,
} from "../../actions/messageActions";
import login01 from "../../assets/img/login-01.webp";
import login02 from "../../assets/img/login-02.webp";
import login03 from "../../assets/img/login-03.webp";

const publicIp = require("public-ip");

export class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {},
      name: "",
      twoFaDialog: false,
      verificationToken: "",
      loading: false,
      forgotPasswordUrl: "/forgot-password",
      signupLink: "/register",
      codeError: false,
      userDevice: {
        browserName: browserName,
        fullBrowserVersion: fullBrowserVersion,
        osName: osName,
        osVersion: osVersion,
        getUA: getUA,
        mobileVendor: mobileVendor,
        mobileModel: mobileModel,
        deviceType: deviceType,
        userIp: "",
      },
    };
  }

  async componentDidMount() {
    // window.fcWidget.destroy();
    require("../../assets/css/fullheight.css");
    this.setState({
      userDevice: {
        browserName: browserName,
        fullBrowserVersion: fullBrowserVersion,
        osName: osName,
        osVersion: osVersion,
        getUA: getUA,
        mobileVendor: mobileVendor,
        mobileModel: mobileModel,
        deviceType: deviceType,
        userIp: await publicIp.v4(),
      },
    });
    this.props.clearMessages();
    this.props.clearSnackMessages();
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      if (!isEmpty(this.props.auth.lastLoginRedirectedLink)) {
        this.props.removeLastLoginRedirectedLink();
        this.props.history.push(this.props.auth.lastLoginRedirectedLink);
      } else {
        this.props.history.push("/dashboard");
      }
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      console.log("nextProps.errors", nextProps.errors);
      if (nextProps.errors.emailNotVerified) {
        this.props.setVerifiedEmail(nextProps.errors.userEmail);
        this.props.history.push("/email-verification");
      }
    }

    if (!isEmpty(nextProps.auth.user)) {
      // this.props.getUserProfile(nextProps.auth.user.id);
    }

    if (!isEmpty(nextProps.auth.user)) {
      if (nextProps.auth.user.twoFactorAuth) {
        this.setState({ twoFaDialog: true });
      }
      if (!nextProps.auth.user.twoFactorAuth) {
        this.props.verify2faCode();
      }
    }
  }

  onChange = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  loginUser() {
    const userInput = {
      email: this.state.email.toLowerCase(),
      password: this.state.password,
      userDevice: this.state.userDevice,
      verificationToken: this.state.verificationToken,
    };

    this.props.loginUser(userInput);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.loginUser();
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleInput = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  componentWillUnmount = () => {
    this.props.clearErrors();
  };

  handleTokenVerification = async () => {
    var twoFactor = require("node-2fa");
    this.setState({ loading: true });
    const { verificationToken } = this.state;
    const { user } = this.props.auth;
    const verifyToken = await twoFactor.verifyToken(
      user.twoFactorSecret,
      verificationToken
    );

    if (!isEmpty(verifyToken)) {
      if (verifyToken.delta >= 0) {
        this.setState({ loading: false, twoFaDialog: false });
        this.props.verify2faCode();
      } else {
        this.setState({ codeError: "Code expired.!" });
        this.setState({ loading: false });
      }
    } else {
      this.setState({ codeError: "Code missmatch.!" });
      this.setState({ loading: false });
    }
  };

  cancelTokenVerification = async () => {
    this.setState({ twoFaDialog: false });
    await this.props.logOut();
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.onSubmit(e);
    }
  };

  render() {
    const { errors, verificationToken, twoFaDialog, loading, codeError } =
      this.state;

    const classes = loginMaterialStyles;

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Login | Trillionbit</title>
          <meta
            name="description"
            content="Trillionbit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta property="og:url" content="https://www.trillionbit.com/login" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Login | Trillionbit" />
          <meta property="og:site_name" content="Trillionbit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta property="twitter:title" content="Login | Trillionbit" />
          <meta property="twitter:site" content="Trillionbit" />
          <meta
            property="twitter:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:image:src"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
        </Helmet>
        <div className="loginBg mainbody paddingTopLandingbody">
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} className="forCenter">
                <div className="rightLogBox">
                  <div className="sliderSection">
                    <Carousel
                      showThumbs={false}
                      showIndicators={false}
                      showStatus={false}
                      showArrows={false}
                      interval={3000}
                      autoPlay={true}
                      infiniteLoop={true}
                      stopOnHover={false}
                    >
                      <div>
                        <img src={login01} alt="log" />
                      </div>
                      <div>
                        <img src={login02} alt="log" />
                      </div>
                      <div>
                        <img src={login03} alt="log" />
                      </div>
                    </Carousel>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <div className="leftLogBox">
                  <div className="title">
                    <Typography variant="h3" component="h2">
                      Login
                    </Typography>

                    <Typography variant="h6" component="h6">
                      Please check that you are visiting the correct URL
                    </Typography>

                    <Typography variant="h5" component="h5">
                      <LockIcon /> <span> https://</span>trillionbit.com
                    </Typography>
                  </div>
                  <form onSubmit={this.onSubmit}>
                    <TextField
                      error={errors.email ? true : false}
                      label="Email"
                      type="email"
                      name="email"
                      variant="filled"
                      className={classes.textField}
                      fullWidth={true}
                      value={this.state.email}
                      onChange={this.handleChange("email")}
                      margin="normal"
                      helperText={errors.email}
                      onKeyDown={this._handleKeyDown}
                    />
                    <TextField
                      error={errors.password ? true : false}
                      variant="filled"
                      label="Password"
                      type="password"
                      name="password"
                      className={classes.textField}
                      fullWidth={true}
                      value={this.state.password}
                      onChange={this.handleChange("password")}
                      margin="normal"
                      helperText={errors.password}
                      onKeyDown={this._handleKeyDown}
                    />
                    {/* <TextField
                                    error={(errors.verificationToken) ? true : false}
                                    margin="normal"
                                    id="twoFaCode"
                                    label="2FA Validation Token"
                                    value={this.state.verificationToken}
                                    onChange={this.handleChange('verificationToken')}
                                    type="number"
                                    fullWidth={true}
                                    helperText={(errors.verificationToken) ? errors.verificationToken : 'Required if 2FA enabled'}
                                  /> */}

                    <div className="inlinebox">
                      <Typography variant="h5" component="h5">
                        <Checkbox
                          value="checkedB"
                          color="primary"
                          inputProps={{
                            "aria-label": "secondary checkbox",
                          }}
                        />
                        Remember me
                      </Typography>

                      <Link
                        to={this.state.forgotPasswordUrl}
                        className={classes.link}
                      >
                        Forgot your password?
                      </Link>
                    </div>

                    <Button
                      onClick={this.onSubmit}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className=""
                    >
                      login
                    </Button>
                  </form>

                  <div className="footLogBox inlinebox">
                    <Typography variant="h6" component="h5">
                      Don’t have an account?
                    </Typography>

                    <Link to={this.state.signupLink} className={classes.link}>
                      Register Here
                    </Link>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
        <Dialog
          className="Enable2FAsection"
          open={twoFaDialog}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Verify 2FA</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the 6-digit code generated by your authenticator app.
            </DialogContentText>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  error={codeError ? true : false}
                  autoFocus
                  variant="filled"
                  className={classes.textField}
                  margin="dense"
                  id="twoFaCode"
                  label="Validation Token"
                  value={verificationToken}
                  onChange={this.handleInput.bind(this)("verificationToken")}
                  type="number"
                  fullWidth={true}
                  helperText={codeError}
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
              onClick={() => this.cancelTokenVerification()}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleTokenVerification.bind(this)}
              variant="contained"
              color="primary"
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const loginMaterialStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  link: {
    margin: theme.spacing(1),
  },
}));

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  clearSnackMessages: PropTypes.func.isRequired,
  verify2faCode: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  loginUser,
  getUserProfile,
  clearMessages,
  clearSnackMessages,
  verify2faCode,
  logOut,
  clearErrors,
  setVerifiedEmail,
  removeLastLoginRedirectedLink,
})(Login);
