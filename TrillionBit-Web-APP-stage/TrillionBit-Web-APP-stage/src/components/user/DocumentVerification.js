import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Toolbar from "@mui/material/Toolbar";
import { makeStyles } from "@mui/styles";
import { ExpandMore } from "@mui/icons-material";
import { Card, CardContent } from "@mui/material";

import { logOut } from "../../actions/authActions";

import styles from "../../assets/styles";

import apiUrl from "../config";

import { Container, Typography } from "@mui/material";

import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";

import StepOne from "./verification/StepOne";
import StepTwo from "./verification/StepTwo";
import StepThree from "./verification/StepThree";

import StepTwoCorporate from "./verification/StepTwoCorporate";
import StepThreeCorporate from "./verification/StepThreeCorporate";
import logoImg from "../../assets/img/logo.webp";
import verificationImg from "../../assets/img/verification.webp";
class DocumentVerification extends Component {
  state = {
    stepOne: false,
    stepTwo: false,
    stepTwoCorporate: false,
    stepThreeCorporate: false,
    finalCoprporateStep: false,
    stepThree: false,
    finalStep: false,
    userMenu: false,
    anchorEl: null,
  };

  componentDidMount = () => {
    // window.fcWidget.destroy();
  };

  navigateTo = () => {
    this.props.history.push("/");
  };

  navSteps = (value) => {
    if (value === "stepOne") {
      this.setState({
        stepOne: true,
        stepTwo: false,
        stepThree: false,
        stepTwoCorporate: false,
        stepThreeCorporate: false,
        finalCoprporateStep: false,
      });
    }
    if (value === "stepTwo") {
      this.setState({
        stepOne: false,
        stepTwo: true,
        stepThree: false,
        stepTwoCorporate: false,
        stepThreeCorporate: false,
        finalCoprporateStep: false,
      });
    }
    if (value === "stepTwoCorporate") {
      this.setState({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        stepTwoCorporate: true,
        stepThreeCorporate: false,
        finalCoprporateStep: false,
      });
    }
    if (value === "stepThreeCorporate") {
      this.setState({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        stepTwoCorporate: false,
        stepThreeCorporate: true,
        finalCoprporateStep: false,
      });
    }
    if (value === "stepThree") {
      this.setState({
        stepOne: false,
        stepTwo: false,
        stepThree: true,
        stepTwoCorporate: false,
        stepThreeCorporate: false,
        finalCoprporateStep: false,
      });
    }
    if (value === "finalStep") {
      this.setState({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        finalStep: true,
        stepTwoCorporate: false,
        stepThreeCorporate: false,
        finalCoprporateStep: false,
      });
    }
    if (value === "finalCorporateStep") {
      this.setState({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        finalStep: false,
        stepTwoCorporate: false,
        stepThreeCorporate: false,
        finalCoprporateStep: true,
      });
    }
  };

  handleClose = () => {
    this.setState({ userMenu: false });
  };

  handleOpenUserMenu = (event) => {
    this.setState({ userMenu: true, anchorEl: event.currentTarget });
  };

  render() {
    const classes = dashboardVerificationStyles;

    const {
      stepOne,
      stepTwo,
      stepThree,
      finalStep,
      stepTwoCorporate,
      stepThreeCorporate,
      finalCoprporateStep,
      userMenu,
      anchorEl,
    } = this.state;
    const { auth } = this.props;

    let currentStep = (
      <Card className="dataListCard">
        <CardContent className="identityBoxInfo text-center">
          <Typography variant="h3" className="title">
            Get Ready To Trade
          </Typography>

          <Typography variant="h5" className="subTitle">
            First, We'll need to verify it's reailly you
          </Typography>

          <div className="imgBox">
            <img src={verificationImg} alt="logo here" />
          </div>

          <Typography variant="h5" className="subTitle">
            It only takes a few minutes to get verified.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.navSteps("stepOne")}
          >
            Start your verificataion
          </Button>
        </CardContent>
      </Card>
    );

    if (stepOne) {
      currentStep = <StepOne nextStep={this.navSteps} />;
    }

    if (stepTwo) {
      currentStep = <StepTwo nextStep={this.navSteps} />;
    }

    if (stepTwoCorporate) {
      currentStep = <StepTwoCorporate nextStep={this.navSteps} />;
    }

    if (stepThreeCorporate || finalCoprporateStep) {
      currentStep = <StepThreeCorporate nextStep={this.navSteps} />;
    }

    if (stepThree || finalStep) {
      currentStep = <StepThree nextStep={this.navSteps} />;
    }

    let activeStep = 0;
    if (stepTwo || stepTwoCorporate) {
      activeStep = 1;
    }
    if (stepThree || stepThreeCorporate) {
      activeStep = 2;
    }
    if (finalStep) {
      activeStep = 3;
    }

    return (
      <React.Fragment>
        <div className="mainbody">
          <Toolbar className="stepsHeader lighttoolbar">
            <Link className="logoBox" to="/dashboard">
              <img src={logoImg} alt="logo here" />
            </Link>

            <Stepper activeStep={activeStep} className="stepperBar">
              <Step key="Step 1" completed={activeStep > 0 ? true : false}>
                <StepLabel>Step 1</StepLabel>
              </Step>
              <Step key="Step 2" completed={activeStep > 1 ? true : false}>
                <StepLabel>Step 2</StepLabel>
              </Step>
              <Step key="Step 1" completed={activeStep > 2 ? true : false}>
                <StepLabel>Step 3</StepLabel>
              </Step>
            </Stepper>

            <div className="userbox">
              <Button
                aria-controls="customized-menu2"
                aria-haspopup="true"
                variant="contained"
                onClick={this.handleOpenUserMenu}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={`${apiUrl}/api/guest/get_image/${auth.currentLoginUser?.avatar}`}
                  className={classes.avatar}
                />
                <Typography variant="body1" className="userName">
                  {auth.user.firstname} {auth.user.lastname}
                </Typography>
                <ExpandMore className="trt" />
              </Button>
              <Menu
                elevation={0}
                // getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                id="customized-menu2"
                className="verification logoutBtn"
                anchorEl={anchorEl}
                keepMounted
                open={userMenu}
                onClose={this.handleClose}
              >
                <MenuItem onClick={() => this.props.history.push("/dashboard")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => this.props.logOut()}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
          <Container style={styles.mainContainer} fixed={false}>
            {/* <div className="mobile-stepper">
                            <Stepper activeStep={activeStep}>
                                <Step
                                    key="Step 1"
                                    completed={(activeStep > 0) ? true : false}
                                >
                                    <StepLabel>Step 1</StepLabel>
                                </Step>
                                <Step
                                    key="Step 2"
                                    completed={(activeStep > 1) ? true : false}
                                >
                                    <StepLabel>Step 2</StepLabel>
                                </Step>
                                <Step
                                    key="Step 1"
                                    completed={(activeStep > 2) ? true : false}
                                >
                                    <StepLabel>Step 3</StepLabel>
                                </Step>
                            </Stepper>
                        </div> */}
            <Grid
              container
              spacing={2}
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12} md={12} className="stepSectionBox">
                {currentStep}
              </Grid>
            </Grid>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const dashboardVerificationStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
    marginTop: 20,
  },
  assignmentIcon: {
    margin: theme.spacing(1),
    fontSize: 32,
  },
}));

DocumentVerification.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  logOut: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps, { logOut })(
  withRouter(DocumentVerification)
);
