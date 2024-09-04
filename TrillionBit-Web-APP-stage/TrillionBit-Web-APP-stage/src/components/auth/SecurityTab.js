import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Switch,
  Typography,
  Chip,
  TextField,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { withStyles } from "@mui/styles";
import themeStyles from "../../assets/themeStyles";
import MaterialTable from "material-table";
import tableIcons from "../../common/tableIcons";
import moment from "moment";
import SumsubWebSdk from "@sumsub/websdk-react";
var twoFactor = require("node-2fa");

class SecurityTab extends Component {
  state = {
    startDocVr: false,
    processPaymentBox: false,
    accessToken: null,
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
      console.log("Fetching access token...");
      const accessToken = await this.props.getSumsubVerificationToken(
        this.props.auth.user.id
      );
      console.log("Access token received:", accessToken);
      this.setState({ accessToken, startDocVr: true });
    } catch (error) {
      console.error("Error initializing Sumsub WebSDK:", error);
    }
  };

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

  render() {
    const { classes, auth, user } = this.props;
    const { authEnabled, startDocVr, processPaymentBox, accessToken } =
      this.state;

    return (
      <div className="bodyInformation">
        <Dialog
          open={startDocVr}
          onClose={() => this.setState({ startDocVr: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            {processPaymentBox ? <CircularProgress /> : undefined}
            {accessToken && (
              <SumsubWebSdk
                testEnv={true}
                accessToken={accessToken}
                expirationHandler={this.handleTokenExpiration}
                config={{
                  lang: "en",
                  email: auth.user.email,
                  phone: auth.user.phone,
                  theme: "light",
                }}
                options={{ addViewportTag: false, adaptIframeHeight: true }}
                onMessage={(data, payload) =>
                  console.log("Message received:", data, payload)
                }
                onError={(error) => console.error("Error occurred:", error)}
              />
            )}
          </DialogContent>
        </Dialog>
        <Typography component="h2" className="bodyTitle">
          Security Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card className="dataListCard autoHeight">
              <CardHeader title="Authentication" />
              <CardContent className="padBoxBody authentication">
                <Typography className="authNote">
                  To increase your account SECURITY, please enable Two-factor
                  authentication.
                </Typography>

                <Typography>Two-factor Authentication (2FA)</Typography>
                <Switch
                  checked={authEnabled || false}
                  onChange={this.props.handleTwoFaChange("authEnabled")}
                  value={authEnabled || ""}
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.checked,
                    track: classes.track,
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </CardContent>
            </Card>

            <Card className="dataListCard autoHeight">
              <CardHeader title="Verification" />
              <div className="identityBoxInfo auth">
                <div className="iconBox">
                  {user.userIdentity.approve ? (
                    <VerifiedUserIcon style={{ color: "#1D8341" }} />
                  ) : (
                    <VerifiedUserIcon style={{ color: "#ddd" }} />
                  )}

                  <div className="title">
                    <Typography variant="h3" className="title">
                      Verification
                    </Typography>

                    <Typography variant="h5" className="subTitle">
                      {user.userIdentity.approve
                        ? "Account is verified"
                        : user.userIdentity.submitted
                        ? "Account is waiting for verification"
                        : "Account is not verified"}
                    </Typography>
                  </div>
                </div>
                <div className="iconBox">
                  {user.userIdentity.approve ? (
                    <Chip label="Account Verified" color="primary" />
                  ) : user.userIdentity.submitted ? (
                    <Chip
                      label="Verification Pending"
                      color="primary"
                      className="pending"
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={this.checkFeatureFlagForVerification}
                    >
                      Verify Account
                    </Button>
                  )}
                  {!user.userIdentity.approve &&
                    user.userIdentity.submitted && (
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.checkFeatureFlagForVerification}
                      >
                        Check Status
                      </Button>
                    )}
                </div>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <form noValidate onSubmit={this.props.changePassword}>
              <Card className="dataListCard">
                <CardHeader title="Reset Password" />
                <CardContent className="padBoxBody authentication">
                  <TextField
                    error={this.props.errors.oldPassword ? true : false}
                    variant="filled"
                    label="Old Password *"
                    type="password"
                    name="oldPassword"
                    className="form-control"
                    fullWidth={true}
                    value={this.props.oldPassword}
                    onChange={this.props.handleChange("oldPassword")}
                    margin="normal"
                    onBlur={this.props.validator.hideMessageFor("oldPassword")}
                    helperText={
                      this.props.errors?.oldPassword
                        ? this.props.errors.oldPassword
                        : this.props.validator.message(
                            "oldPassword",
                            this.props.oldPassword,
                            "required"
                          )
                    }
                  />
                  <TextField
                    error={this.props.errors.newPassword ? true : false}
                    variant="filled"
                    label="New Password *"
                    type="password"
                    name="newPassword"
                    className="form-control"
                    fullWidth={true}
                    value={this.props.newPassword}
                    onChange={this.props.handleChange("newPassword")}
                    margin="normal"
                    onBlur={this.props.validator.hideMessageFor("password")}
                    helperText={
                      this.props.errors?.newPassword
                        ? this.props.errors.newPassword
                        : this.props.validator.message(
                            "newPassword",
                            this.props.newPassword,
                            "required|password"
                          )
                    }
                  />
                  <TextField
                    error={this.props.errors.confirmPassword ? true : false}
                    variant="filled"
                    label="Confirm Password *"
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    fullWidth={true}
                    value={this.props.confirmPassword}
                    onChange={this.props.handleChange("confirmPassword")}
                    margin="normal"
                    onBlur={this.props.validator.hideMessageFor(
                      "confirmPassword"
                    )}
                    helperText={
                      this.props.errors?.confirmPassword
                        ? this.props.errors.confirmPassword
                        : this.props.validator.message(
                            "confirmPassword",
                            this.props.confirmPassword,
                            `required|in:${this.props.newPassword}`,
                            { messages: { in: "Passwords need to match!" } }
                          )
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    Change
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Grid>
          <Grid item xs={12} md={12}>
            <MaterialTable
              className="bodyInformation dataListCard loginActivity"
              title="All Login activity"
              options={{
                actionsColumnIndex: -1,
                search: false,
              }}
              icons={tableIcons}
              columns={[
                {
                  title: "Device",
                  field: "device",
                  render: (rowData) => (
                    <div>
                      {rowData.deviceType === "Mobile"
                        ? `${rowData.mobileVendor} (${rowData.mobileModel})`
                        : `${rowData.browserName} (${rowData.fullBrowserVersion})`}
                    </div>
                  ),
                },
                {
                  title: "OS",
                  field: "os",
                  render: (rowData) => (
                    <div>
                      {rowData.osName} ({rowData.osVersion})
                    </div>
                  ),
                },
                { title: "IP", field: "userIp" },
                {
                  title: "Log Time",
                  field: "device",
                  render: (rowData) => (
                    <div>{moment(rowData.logTime).format("LLL")}</div>
                  ),
                },
              ]}
              data={user.userLogs ? user.userLogs : []}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

SecurityTab.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getSumsubVerificationToken: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleTwoFaChange: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  oldPassword: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
};

export default withStyles(themeStyles)(SecurityTab);
