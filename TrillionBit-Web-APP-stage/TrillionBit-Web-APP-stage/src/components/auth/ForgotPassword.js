import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Helmet } from "react-helmet";

import { makeStyles } from "@mui/styles";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";

import {
  sendResetPasswordLink,
  passwordLinkUnset,
} from "../../actions/authActions";
import login01 from "../../assets/img/login-01.webp";
import login02 from "../../assets/img/login-02.webp";
import login03 from "../../assets/img/login-03.webp";

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      errors: {},
      loginLink: "/login",
      resetEmailSent: false,
    };
  }

  componentDidMount() {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
    require("../../assets/css/fullheight.css");
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    this.props.passwordLinkUnset();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, resetEmailSent: false });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.props.sendResetPasswordLink({
      email: this.state.email.toLowerCase(),
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { errors } = this.state;

    const classes = forgetPasswordMaterialStyles;

    let forgetForm = this.props.auth.sendResetPasswordLink ? (
      <div className="leftLogBox width100">
        <div className="title">
          <Typography variant="h3" component="h2">
            Email Sent
          </Typography>
        </div>

        <Grid container spacing={0}>
          <Grid item className="signupFormField" md={12} xs={12}>
            <Typography variant="h6" component="h6">
              Email sent successfully please reset your password using email
              verification link
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
          </Grid>
        </Grid>
      </div>
    ) : (
      <div className="leftLogBox width100">
        <div className="title">
          <Typography variant="h3" component="h2">
            Forgot Password
          </Typography>

          <Typography variant="h6" component="h6">
            Password reset link will be sent to your registered Email.
          </Typography>
        </div>

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
        />

        <div className="inlinebox">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.onSubmit}
          >
            Recover
          </Button>

          {/* <Button
                                    variant="contained"
                                    type="reset"
                                    color="primary"
                                    onClick={() => window.location.replace('/login')}
                                >
                                    Cancel
                                </Button> */}
        </div>
      </div>
    );
    // }

    return (
      <React.Fragment>
        <Helmet>
          <title class="next-head">Forgot Password | TrillionBit</title>
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
            content="https://www.trillionbit.com/forgot-password"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Forgot Password | TrillionBit" />
          <meta property="og:site_name" content="TrillionBit" />
          <meta
            property="og:image"
            content="https://www.trillionbit.com/static/media/logo.d54102a2.webp"
          />
          <meta
            property="twitter:title"
            content="Forgot Password | TrillionBit"
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
                {forgetForm}
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const forgetPasswordMaterialStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  link: {
    margin: theme.spacing(1),
  },
}));

ForgotPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  sendResetPasswordLink: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  sendResetPasswordLink,
  passwordLinkUnset,
})(ForgotPassword);
