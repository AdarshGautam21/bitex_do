import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withStyles } from "@mui/styles/";

import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Button,
  Grid,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import isEmpty from "../../validation/isEmpty";

import { clearSnackMessages } from "../../actions/messageActions";
import {
  getUserApiKeys,
  createUserApiKeys,
  removeUserApiKeys,
} from "../../actions/userActions";

import tableIcons from "../../common/tableIcons";
import MaterialTable from "material-table";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";

import themeStyles from "../../assets/themeStyles";

class UserApi extends Component {
  state = {
    label: "",
    errors: {},
    wallet: false,
    order: false,
    apiAccess: [],
    snackMessages: {},
    variant: "success",
    snackbarMessage: "",
    newApiKey: false,
    apiKey: "",
  };

  componentDidMount = () => {
    // window.fcWidget.destroy();
    this.props.getUserApiKeys(this.props.auth.user.id);
  };

  handleSnackbarClose = () => {
    this.props.clearSnackMessages();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.snackMessages) {
      this.setState({ snackMessages: nextProps.snackMessages });
      if (!isEmpty(nextProps.snackMessages.newApiKey)) {
        this.setState({
          newApiKey: true,
          apiKey: nextProps.snackMessages.newApiKey,
        });
      }
    }
  }

  startValidation = () => {
    this.props.history.push("/start-verification");
  };

  createApiKey = async () => {
    if (isEmpty(this.state.label)) {
      this.setState({
        errors: {
          label: "Please enter label",
        },
      });
    } else if (isEmpty(this.state.apiAccess)) {
      this.setState({
        errors: {
          apiAccess: "Please select api access",
        },
      });
    } else {
      await this.props.createUserApiKeys(this.props.auth.user.id, this.state);
      await this.props.getUserApiKeys(this.props.auth.user.id);
      this.setState({
        label: "",
        apiAccess: [],
        wallet: false,
        order: false,
      });
    }
  };

  handleChange = (name) => (event) => {
    let apiAccess = this.state.apiAccess;
    if (name === "wallet" || name === "order") {
      if (apiAccess.includes(name)) {
        if (!this.state[name] === false) {
          apiAccess.splice(apiAccess.indexOf(name), 1);
        }
      } else {
        apiAccess.push(name);
      }
      this.setState({
        [name]: !this.state[name],
        apiAccess: apiAccess,
        errors: {},
      });
    } else {
      this.setState({ [name]: event.target.value, errors: {} });
    }
  };

  removeUserApiKeys = async (oldData) => {
    await this.props.removeUserApiKeys(oldData._id);
    await this.props.getUserApiKeys(oldData.userId);
  };

  render() {
    const { classes, user } = this.props;
    const {
      errors,
      snackMessages,
      variant,
      snackbarMessage,
      newApiKey,
      apiKey,
    } = this.state;

    let currentContent = (
      <div className="bodyInformation">
        <Typography component="h2" className="bodyTitle">
          API Service
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={3} />
          <Grid item xs={12} md={6}>
            <Card className="dataListCard">
              <CardHeader title="Account Verification" />
              <CardContent className="identityBoxInfo">
                <Typography variant="h3" className="title">
                  Continue setting up your account.
                </Typography>

                <Typography variant="h5" className="subTitle">
                  Verify to start using API service!
                </Typography>

                <IconButton aria-label="settings">
                  <VerifiedUserIcon style={{ fontSize: 50 }} />
                </IconButton>

                <Typography variant="h5" className="subTitle">
                  It only takes a few minutes to get verified.
                </Typography>

                {this.props.user.userIdentity.submitted ? (
                  <Chip label="Verification Pending" color="secondary" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.startValidation.bind(this)}
                  >
                    Verify Account
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );

    if (user.userIdentity.approve) {
      currentContent = (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader title="Create API" />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Api Section notes Creating an API private key provides access
                  to markets and real-time trading services on TrillionBit via a
                  third-party site or application.
                </Typography>
                <Link href="#" onClick={() => console.log("API documentation")}>
                  <Typography variant="button" display="block" gutterBottom>
                    View API documentation
                  </Typography>
                </Link>
                <div>
                  <TextField
                    error={!isEmpty(errors.label)}
                    label="Enter key label"
                    type="text"
                    name="label"
                    className="form-control"
                    value={this.state.label}
                    onChange={this.handleChange("label")}
                    margin="normal"
                    helperText={errors.label}
                  />
                </div>
                <div>
                  <FormControl
                    required
                    error={isEmpty(this.state.apiAccess)}
                    component="fieldset"
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.wallet}
                          onChange={this.handleChange("wallet")}
                          value="wallet"
                          color="primary"
                        />
                      }
                      label="Wallet"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.order}
                          onChange={this.handleChange("order")}
                          value="order"
                          color="primary"
                        />
                      }
                      label="Order"
                    />
                    <FormHelperText>
                      {!isEmpty(errors.apiAccess) ? errors.apiAccess : ""}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.createApiKey}
                    // disabled={}
                  >
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <MaterialTable
              title="API keys"
              options={{
                actionsColumnIndex: -1,
              }}
              icons={tableIcons}
              columns={[
                { title: "Api key label", field: "name" },
                // { title: 'Key', field: 'apiKey' },
                {
                  title: "Api access",
                  field: "apiAccess",
                  render: (rowData) => (
                    <div>{rowData.apiAccess.join(", ")}</div>
                  ),
                },
                { title: "Date", field: "createdAt" },
              ]}
              data={user.userApiKeys}
              editable={{
                onRowDelete: (oldData) => this.removeUserApiKeys(oldData),
              }}
            />
          </Grid>
        </Grid>
      );
    }

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
        <Dialog
          open={newApiKey}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">API key</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography>
                Store your API key in safe place, You will not able to see api
                key again.
              </Typography>
              <Typography variant="h6" gutterBottom>
                {newApiKey ? apiKey : "Something is wrong, try again."}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ newApiKey: false, apiKey: "" })}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Container className="mainbody" fixed={false}>
          {currentContent}
        </Container>
      </React.Fragment>
    );
  }
}

UserApi.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  clearSnackMessages: PropTypes.func.isRequired,
  getUserApiKeys: PropTypes.func.isRequired,
  createUserApiKeys: PropTypes.func.isRequired,
  removeUserApiKeys: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
  user: state.user,
  wallet: state.wallet,
  snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
  clearSnackMessages,
  getUserApiKeys,
  createUserApiKeys,
  removeUserApiKeys,
})(withStyles(themeStyles)(UserApi));
