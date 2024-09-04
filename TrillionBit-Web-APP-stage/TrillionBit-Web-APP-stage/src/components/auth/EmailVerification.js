import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import isEmpty from '../../validation/isEmpty';
import { verifyEmail, resendVerificationCode } from '../../actions/authActions';
import { clearSnackMessages, clearMessages } from '../../actions/messageActions';
import { Carousel } from 'react-responsive-carousel';
import { logOut } from '../../actions/authActions';

import { makeStyles } from '@mui/styles';
import {
    Grid,
    TextField,
    Button,
    Typography,
    Container,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import SnackbarMessage from '../../common/SnackbarMessage';
import login01 from '../../assets/img/login-01.webp';
import login02 from '../../assets/img/login-02.webp';
import login03 from '../../assets/img/login-03.webp';


class EmailVerification extends Component {
    componentDidMount() {
        // window.fcWidget.destroy();
        window.scrollTo(0, 0);
        require('../../assets/css/fullheight.css');
        if(isEmpty(this.props.auth.verifyEmail)) {
            this.props.history.push('/login');
        }
        this.props.clearMessages();
    }

    constructor() {
        super();

        this.state = {
            verificationCode: "",
            errors: {},
            messages: {},
            snackMessages: {},
            loginLink: "/login",
            resetEmailSent: false,
            snackbarMessage: '',
            variant: 'success',
        };
    }

    // componentDidMount() {
    //     // window.fcWidget.destroy();
    //     require('../../assets/css/fullheight.css');
    //     if(isEmpty(this.props.errors.userEmail)) {
    //         this.props.history.push('/login');
    //     }
    //     this.props.clearMessages();
    // }

    componentWillReceiveProps(nextProps) {
        if (isEmpty(nextProps.auth.verifyEmail)) {
            this.props.history.push('/login');
        }

        if(nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }

        if(nextProps.messages) {
            this.setState({ messages: nextProps.messages });
        }
        if(nextProps.snackMessages) {
            this.setState({ snackMessages: nextProps.snackMessages });
        }
    }

    handleSnackbarClose = () => {
        this.props.clearSnackMessages();
    }

    onSubmit = () => {
        this.props.verifyEmail(this.props.auth.verifyEmail, this.state.verificationCode);
    }

    resendVerificationCode = () => {
        this.props.resendVerificationCode(this.props.auth.verifyEmail);
    }

    handleChange = (name) => (event) => {
        this.setState({ [name]: event.target.value });
    };

    render() {

        const { errors, messages, snackMessages, variant, snackbarMessage } = this.state;

        const classes = emailVerificationStyles;

        let codeVerificationForm = <div className="leftLogBox width100">
                                        <div className="title">
                                            <Typography variant="h3" component="h2">
                                                Verify Email
                                            </Typography>

                                            <Typography variant="h6" component="h6">
                                                Enter verification code
                                            </Typography>
                                        </div>

                                        <Grid container spacing={0}>
                                            <Grid item className="signupFormField" md={12} xs={12}>
                                                <TextField
                                                    error={(errors.verificationCode) ? true : false}
                                                    label="Verification Code"
                                                    type="number"
                                                    name="verificationCode"
                                                    className={classes.textField}
                                                    fullWidth={true}
                                                    value={this.state.verificationCode}
                                                    onChange={this.handleChange('verificationCode')}
                                                    margin="normal"
                                                    helperText={errors.verificationCode}
                                                />


                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={this.onSubmit}
                                                >
                                                    Verify
                                                </Button>

                                                <div className="inlinebox">
                                                    <Button
                                                        variant="contained"
                                                        type="reset"
                                                        color="primary"
                                                        onClick={this.resendVerificationCode}
                                                    >
                                                        Resend Code
                                                    </Button>

                                                    <Link to='/login' className={classes.link}>
                                                        <Button
                                                            variant="contained"
                                                            type="reset"
                                                            color="primary"
                                                            onClick={this.props.logOut}
                                                        >
                                                            Back
                                                        </Button>
                                                    </Link>

                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>

        if(messages.message) {
            codeVerificationForm = <div className="leftLogBox width100">
                                        <div className="title">
                                            <Typography variant="h3" component="h2">
                                                Verify Email
                                            </Typography>

                                            <Typography variant="h6" component="h6">
                                                Enter verification code
                                            </Typography>
                                        </div>

                                        <Grid container spacing={0}>
                                            <Grid item className="signupFormField" md={12} xs={12}>

                                                <Typography variant="h6" component="h6">
                                                    {messages.title}
                                                </Typography>

                                                <Typography variant="subtitle2" component="h6">
                                                    {messages.message}
                                                </Typography>

                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    type="reset"
                                                    color="primary"
                                                    onClick={() => window.location.replace('/login')}
                                                >
                                                    Login
                                                </Button>

                                            </Grid>
                                        </Grid>
                                    </div>;
        }

        return (
            <React.Fragment>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={!isEmpty(snackMessages) ? true : false}
                    autoHideDuration={3000}
                    onClose={this.handleSnackbarClose}
                >
                    <SnackbarMessage
                        onClose={this.handleSnackbarClose}
                        variant={!isEmpty(snackMessages) ? snackMessages.variant : variant}
                        message={!isEmpty(snackMessages) ? snackMessages.message : snackbarMessage}
                    />
                </Snackbar>
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
                                {codeVerificationForm}
                            </Grid>
                        </Grid>
                    </Container>
                </div>

                {/* <Container fixed={false} style={emailVerificationStyle.mainContainer}>
                    <Grid container style={{ height: '100vh' }}
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={12} md={4}>
                            { codeVerificationForm }
                        </Grid>
                    </Grid>
                </Container> */}
            </React.Fragment>
        )
    }
}

const emailVerificationStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    link: {
        margin: theme.spacing(1),
    },
}));

EmailVerification.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    snackMessages: PropTypes.object.isRequired,
    clearSnackMessages: PropTypes.func.isRequired,
    resendVerificationCode: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors,
    messages: state.messages,
    snackMessages: state.snackMessages,
});

export default connect(
    mapStateToProps,
    {
        verifyEmail,
        clearSnackMessages,
        clearMessages,
        resendVerificationCode,
        logOut,
    }
)(EmailVerification);
