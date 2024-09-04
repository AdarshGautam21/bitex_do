import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Helmet } from "react-helmet";

import isEmpty from "../../validation/isEmpty";

import { makeStyles } from "@mui/styles";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";

import login01 from "../../assets/img/login-01.webp";
import login02 from "../../assets/img/login-02.webp";
import login03 from "../../assets/img/login-03.webp";
import { resetUserPassword } from "../../actions/authActions";
import SimpleReactValidator from "simple-react-validator";

class ResetPassword extends Component {
  componentDidMount() {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
    require("../../assets/css/fullheight.css");
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  constructor() {
    super();

    this.state = {
      password: "",
      password2: "",
      errors: {},
      loginLink: "/login",
      resetPasswordStatus: false,
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
      },
    });
  }

  // componentDidMount() {
  //     // window.fcWidget.destroy();
  //     require('../../assets/css/fullheight.css');
  //     if(this.props.auth.isAuthenticated) {
  //         this.props.history.push('/dashboard');
  //     }
  //   }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, resetPasswordStatus: false });
      if (isEmpty(nextProps.errors)) {
        this.setState({ resetPasswordStatus: true });
      }
    }
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      const resetData = {
        emailToken: this.props.match.params.emailToken,
        password: this.state.password,
        password2: this.state.password2,
      };
      await this.props.resetUserPassword(resetData);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const { errors, resetPasswordStatus } = this.state;
    const classes = resetPasswordMaterialStyles;

    console.log(isEmpty(errors));

    let resetForm = (
      <div className="leftLogBox width100">
        <div className="title">
          <Typography variant="h3" component="h2">
            Password reseted
          </Typography>
        </div>

        <Typography variant="h6" component="h6">
          Password successfully reseted. Login to access your account
        </Typography>

        <Button
          fullWidth
          variant="contained"
          type="reset"
          color="primary"
          onClick={() => window.location.replace("/")}
        >
          Login
        </Button>
      </div>
    );

    if (!resetPasswordStatus) {
      resetForm = (
        <div className="leftLogBox width100">
          <div className="title">
            <Typography variant="h3" component="h2">
              Reset Password
            </Typography>
            <Typography variant="h6" component="h6">
              Enter new password to reset
            </Typography>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <TextField
              error={errors.password ? true : false}
              label="New Password"
              type="password"
              name="password"
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
              error={errors.password2}
              label="Confirm Password"
              type="password"
              name="password2"
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

            <Button
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              // onClick={this.onSubmit}
            >
              Reset
            </Button>
          </form>
        </div>
      );
    }

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Reset Password | TrillionBit</title>
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
            content="https://www.trillionbit.com/reset-password"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Reset Password | TrillionBit" />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:title"
            content="Reset Password | TrillionBit"
          />
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
              <Grid item xs={12} sm={6} md={6} className="forCenter">
                {resetForm}
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const resetPasswordMaterialStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  link: {
    margin: theme.spacing(1),
  },
}));

ResetPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  resetUserPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  errors: state.errors,
});

export default connect(mapStateToProps, { resetUserPassword })(ResetPassword);
