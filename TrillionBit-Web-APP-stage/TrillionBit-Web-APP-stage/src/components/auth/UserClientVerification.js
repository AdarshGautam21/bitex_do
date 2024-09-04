import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Container, Grid, CircularProgress } from "@mui/material";
import { Typography, Toolbar } from "@mui/material";
import isEmpty from "../../validation/isEmpty";
import { clearMessages } from "../../actions/messageActions";
import { VerifiedUserOutlined } from "@mui/icons-material/";
import { verifyEmail } from "../../actions/authActions";

import whiteLogo from "../../assets/img/white-logo.webp";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";

class UserClientVerification extends Component {
  componentDidMount() {
    // window.fcWidget.destroy();
    window.scrollTo(0, 0);
  }
  state = {
    ajaxProcess: false,
    messages: {},
    loginLink: "/login",
    resetEmailSent: false,
    snackbarMessage: "",
    variant: "info",
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  componentDidMount = async () => {
    this.setState({ ajaxProcess: true });
    await this.props.verifyEmail(
      this.props.match.params.decodedEmail,
      this.props.match.params.emailCode
    );
    setTimeout(() => {
      this.setState({ ajaxProcess: false });
    }, 3000);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages) {
      this.setState({ messages: nextProps.messages });
    }
  }

  render() {
    const { ajaxProcess } = this.state;
    const { snackMessages, variant, snackbarMessage } = this.state;

    return (
      <React.Fragment>
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
        <Toolbar className="homeLighttoolbar">
          <Link className="logoBox" to="/">
            <img src={whiteLogo} alt="TrillionBit" />
          </Link>
        </Toolbar>
        <div>
          <div className="sliderClient" style={{ height: "100vh" }}>
            <Container>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item className="oneCenterBox">
                  <div className="pageNotFoundClient">
                    {ajaxProcess ? (
                      <CircularProgress />
                    ) : (
                      <Typography variant="h6" className="">
                        {!isEmpty(this.state.messages)
                          ? this.state.messages.message
                          : "Email successfully verified."}
                      </Typography>
                    )}

                    <Typography variant="h5" className="subtext">
                      {ajaxProcess ? (
                        "Please wait activating.. Do not go back, close or refresh the page."
                      ) : (
                        <VerifiedUserOutlined
                          style={{ fontSize: 50, color: "#1D8341" }}
                        />
                      )}
                    </Typography>

                    <Link to="/" className="orange">
                      Back to Trillionbit
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

UserClientVerification.propTypes = {
  auth: PropTypes.object.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  messages: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  messages: state.messages,
});

export default connect(mapStateToProp, {
  verifyEmail,
  clearMessages,
})(UserClientVerification);
