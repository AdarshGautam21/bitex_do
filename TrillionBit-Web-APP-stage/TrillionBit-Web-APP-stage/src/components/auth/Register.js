import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { clearMessages, clearErrors } from "../../actions/messageActions";
import { Carousel } from "react-responsive-carousel";
import { Helmet } from "react-helmet";

import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import {
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  InputAdornment,
  Typography,
} from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import Countries from "../../common/Countries";
import "../../assets/css/home.css";

import login01 from "../../assets/img/login-01.webp";
import login02 from "../../assets/img/login-02.webp";
import login03 from "../../assets/img/login-03.webp";
import isEmpty from "../../validation/isEmpty";
const moment = require("moment");

export class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      messages: {},
      country: "",
      phone: "",
      dateOfBirth: "",
      countryCode: "+00",
      referralCode: "",
      loginLink: "/login",
      disableReferralCode: false,
    };
    this.validator = new SimpleReactValidator({
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

        disable_future_date: {
          // name the rule
          message: "Please select valid date of birth.",
          rule: (val, params, validator) => {
            const now = moment();
            const selectDate = moment(val);
            const pastDate = moment().subtract(100, "years");
            return selectDate <= now && selectDate >= pastDate;
          },
          messageReplace: (message, params) =>
            message.replace(":values", this.helpers.toSentence(params)), // optional
          required: true, // optional
        },
      },
    });
  }

  componentDidMount() {
    const referralCode = !isEmpty(this.props.match.params.referralId)
      ? this.props.match.params.referralId
      : "";
    if (referralCode) {
      this.setState({ referralCode, disableReferralCode: true });
    }

    require("../../assets/css/fullheight.css");
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.messages) {
      this.setState({ messages: nextProps.messages });
    }
  }

  handleChange = (name) => (event) => {
    if (name === "country") {
      this.setState({ countryCode: "+" + event.target.value.phoneCode });
    }
    if (name === "phone") {
      const onlyNumberInput = /^[0//-9]*$/;
      this.setState({
        [name]: onlyNumberInput.test(event.target.value)
          ? event.target.value
          : this.state.phone,
      });
    } else {
      this.setState({ [name]: event.target.value });
    }
  };

  componentWillUnmount = () => {
    this.props.clearErrors();
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      const referralCode = this.state.referralCode;
      const newUser = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email.toLowerCase(),
        password: this.state.password,
        password2: this.state.password2,
        phone: this.state.phone,
        dateOfBirth: this.state.dateOfBirth,
        countryCode: this.state.countryCode,
        country: this.state.country.sortname,
        referralCode: referralCode,
      };
      this.props.registerUser(newUser, this.props.history);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  redirectPage = async (redirectUri) => {
    await this.setState({ messages: {} });
    await this.props.clearMessages();
    await this.props.clearErrors();
    this.props.history.push(redirectUri);
  };

  render() {
    const { errors, countryCode, messages } = this.state;
    const classes = signupMaterialStyles;

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

    let registrationForm = (
      <div className="leftLogBox">
        <div className="title">
          <Typography variant="h3" component="h2">
            Sign Up
          </Typography>

          <Typography variant="h6" component="h6">
            Signup to create your Account
          </Typography>
        </div>

        <form noValidate onSubmit={this.onSubmit}>
          <Grid container spacing={0}>
            <Grid item className="signupFormField1" md={6} xs={12}>
              <TextField
                error={errors.firstname ? true : false}
                label="First Name *"
                type="text"
                name="firstname"
                variant="filled"
                className={classes.textField}
                fullWidth={true}
                value={this.state.firstname}
                onChange={this.handleChange("firstname")}
                margin="normal"
                onBlur={this.validator.hideMessageFor("firstname")}
                helperText={
                  errors?.firstname
                    ? errors.firstname
                    : this.validator.message(
                        "firstname",
                        this.state.firstname,
                        "required|alpha_space"
                      )
                }
              />
            </Grid>
            <Grid item md={6} xs={12} className="signupFormField2">
              <TextField
                error={errors.lastname ? true : false}
                label="Last Name *"
                variant="filled"
                type="text"
                name="lastname"
                className={classes.textField}
                fullWidth={true}
                value={this.state.lastname}
                onChange={this.handleChange("lastname")}
                onBlur={this.validator.hideMessageFor("lastname")}
                margin="normal"
                helperText={
                  errors?.lastname
                    ? errors.lastname
                    : this.validator.message(
                        "lastname",
                        this.state.lastname,
                        "required|alpha_space"
                      )
                }
              />
            </Grid>
          </Grid>

          <TextField
            error={errors.email ? true : false}
            label="Email *"
            type="email"
            name="email"
            variant="filled"
            className={classes.textField}
            fullWidth={true}
            value={this.state.email}
            onBlur={this.validator.hideMessageFor("email")}
            onChange={this.handleChange("email")}
            margin="normal"
            helperText={
              errors?.email
                ? errors.email
                : this.validator.message(
                    "email",
                    this.state.email,
                    "required|email"
                  )
            }
          />

          <TextField
            error={errors.password ? true : false}
            label="Password *"
            type="password"
            name="password"
            variant="filled"
            className={classes.textField}
            fullWidth={true}
            value={this.state.password}
            onChange={this.handleChange("password")}
            margin="normal"
            onBlur={this.validator.hideMessageFor("password")}
            helperText={
              errors?.password
                ? errors.password
                : this.validator.message(
                    "password",
                    this.state.password,
                    "required|password"
                  )
            }
          />

          <TextField
            error={errors.password2 ? true : false}
            label="Confirm Password *"
            type="password"
            name="password2"
            variant="filled"
            className={classes.textField}
            fullWidth={true}
            value={this.state.password2}
            onChange={this.handleChange("password2")}
            margin="normal"
            onBlur={this.validator.hideMessageFor("password2")}
            helperText={
              errors?.password2
                ? errors.password2
                : this.validator.message(
                    "confirm password",
                    this.state.password2,
                    `required|in:${this.state.password}`,
                    { messages: { in: "Passwords need to match!" } }
                  )
            }
          />
          <TextField
            error={errors.dateOfBirth ? true : false}
            label="Date Of Birth * "
            type="date"
            name="dateOfBirth"
            variant="filled"
            className={classes.textField}
            value={this.state.dateOfBirth}
            onChange={this.handleChange("dateOfBirth")}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth={true}
            margin="normal"
            helperText={
              errors?.dateOfBirth
                ? errors.dateOfBirth
                : this.validator.message(
                    "dateOfBirth",
                    this.state.dateOfBirth,
                    `required|disable_future_date`
                  )
            }
          />
          <FormControl
            style={signupStyle.formControl}
            error={errors.country ? true : false}
            variant="filled"
          >
            <InputLabel htmlFor="country-helper">Country *</InputLabel>
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
                : this.state.country.sortname === "IN"
                ? `Your default currency is INR`
                : this.state.country.sortname === "AE"
                ? "Your default currency is AED"
                : "Your default currency is USDT"}
            </FormHelperText>
            <FormHelperText>
              {errors?.country
                ? errors.country
                : this.validator.message(
                    "country",
                    this.state.country.sortname,
                    "required"
                  )}
            </FormHelperText>
          </FormControl>
          <TextField
            error={errors.phone ? true : false}
            label="Phone *"
            type="number"
            name="phone"
            variant="filled"
            className={classes.textField}
            fullWidth={true}
            value={this.state.phone}
            onChange={this.handleChange("phone")}
            margin="normal"
            onBlur={this.validator.hideMessageFor("phone")}
            helperText={
              errors?.phone
                ? errors.phone
                : this.validator.message(
                    "phone",
                    this.state.phone,
                    "required|Numeric"
                  )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{countryCode}</InputAdornment>
              ),
            }}
          />

          <TextField
            error={errors.referralCode ? true : false}
            label="Referral Code"
            name="referralCode"
            variant="filled"
            className={classes.textField}
            fullWidth={true}
            value={this.state.referralCode}
            onChange={this.handleChange("referralCode")}
            disabled={this.state.disableReferralCode}
            margin="normal"
            helperText={errors.referralCode}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className=""
          >
            Register
          </Button>
        </form>
      </div>
    );

    if (messages.message) {
      registrationForm = (
        <div className="leftLogBox">
          <div className="title">
            <Typography variant="h3" component="h2">
              Sign Up
            </Typography>

            <Typography variant="h6" component="h6">
              Signup for create your Account
            </Typography>
          </div>

          <Grid
            container
            spacing={0}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item className="signupFormField" md={12} xs={12}>
              <Typography variant="h6" component="h6">
                {messages.title}
              </Typography>

              <Typography variant="subtitle2" component="h6">
                {messages.message}
              </Typography>
              <Button
                className=""
                variant="contained"
                type="reset"
                color="primary"
                onClick={() => this.redirectPage(this.state.loginLink)}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </div>
      );
      // registrationForm = <Card style={{borderRadius: 0}}>
      //                         <CardHeader
      //                             title={messages.title}
      //                         />

      //                         <CardContent>
      //                             <p>{messages.message}</p>
      //                         </CardContent>

      //                         <CardActions>
      //                             <Button
      //                                 className=""
      //                                 variant="contained"
      //                                 type="reset"
      //                                 color="primary"
      //                                 onClick={() => this.redirectPage(this.state.loginLink)}
      //                             >
      //                                 Login
      //                             </Button>
      //                         </CardActions>
      //                     </Card>
    }

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Create an account | Trillionbit</title>
          <meta
            name="description"
            content="Trillionbit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
          />
          <meta
            name="keywords"
            content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
          />
          <meta
            property="og:url"
            content="https://www.trillionbit.com/register"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Create an account | Trillionbit" />
          <meta property="og:site_name" content="Trillionbit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:title"
            content="Create an account | Trillionbit"
          />
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
        <div
          className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}
        ></div>
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
                        <img src={login01} alt="img" />
                      </div>
                      <div>
                        <img src={login02} alt="img" />
                      </div>
                      <div>
                        <img src={login03} alt="img" />
                      </div>
                    </Carousel>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                {registrationForm}
              </Grid>
            </Grid>
          </Container>
        </div>
        {/* <Container fixed={false} style={signupStyle.mainContainer}>
          <Grid container
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
                {registrationForm}
            </Grid>
          </Grid>
        </Container> */}
      </React.Fragment>
    );
  }
}

const signupMaterialStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  link: {
    margin: theme.spacing(1),
  },
}));

const signupStyle = {
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
  },
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  clearMessages: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  messages: state.messages,
});

export default connect(mapStateToProps, {
  registerUser,
  clearMessages,
  clearErrors,
})(withRouter(Register));
