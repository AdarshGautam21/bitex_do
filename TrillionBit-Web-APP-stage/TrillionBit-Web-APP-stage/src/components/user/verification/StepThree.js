import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isEmpty from '../../../validation/isEmpty';
import { withStyles } from '@mui/styles';

import {
    Grid,
    Typography,
    Radio,
    RadioGroup,
    Button,
    FormControlLabel,
    Card,
    CardContent,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';

import themeStyles from '../../../assets/themeStyles';

import { finishIdentityForm } from '../../../actions/userActions';

class StepThree extends Component {

    constructor() {
        super();
        this.state = {
            errors: {},
            helpMenu: false,
            usCitizen: '',
            residentAlien: '',
            usTexPerson: '',
            getVerified: false,
        }
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
    };

    nextSteps = () => {
        this.setState({ getVerified: true });
        this.props.nextStep('finalStep');
    }

    navRedirect = async () => {
        await this.props.finishIdentityForm(this.props.auth.user.id);
        this.props.history.push('/dashboard');
    }

    render() {

        const { usCitizen, residentAlien, usTexPerson, getVerified } = this.state;
        const {classes} = this.props;

        let nextButton = true;
        if(!isEmpty(usCitizen) && !isEmpty(residentAlien) && !isEmpty(usTexPerson)){
            nextButton = false;
        }

        let currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                        You are almost done
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Don't worry, no more photos
                                    </Typography>
                                    <Grid container>
                                        <Grid item md={8} sm={8} xs={12} style={{marginTop: '0.6%', textAlign: 'left'}}>
                                            <Typography variant="body1">
                                                I am a US citizen
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <RadioGroup
                                                    aria-label="question"
                                                    name="usCitizen"
                                                    value={usCitizen}
                                                    onChange={this.handleChange('usCitizen')}
                                                    row={true}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Grid>

                                        <Grid item md={8} sm={8} xs={12} style={{marginTop: '0.6%', textAlign: 'left'}}>
                                            <Typography variant="body1">
                                                I am a US resident alien
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <RadioGroup
                                                    aria-label="question"
                                                    name="residentAlien"
                                                    value={residentAlien}
                                                    onChange={this.handleChange('residentAlien')}
                                                    row={true}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Grid>

                                        <Grid item md={8} sm={8} xs={12} style={{marginTop: '0.6%', textAlign: 'left'}}>
                                            <Typography variant="body1">
                                                I am a US tax person for any other reason
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <RadioGroup
                                                    aria-label="question"
                                                    name="usTexPerson"
                                                    value={usTexPerson}
                                                    onChange={this.handleChange('usTexPerson')}
                                                    row={true}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Grid>

                                    </Grid>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        disabled={nextButton}
                                        onClick={this.nextSteps}
                                    >
                                        Get verified
                                    </Button>
                                </CardContent>
                            </Card>

        if(getVerified) {
            currentStep = <Card className="dataListCard">
                            <CardContent className="identityBoxInfo text-center">
                                <Typography variant="h3" className="title">
                                    Success!
                                </Typography>

                                <div>
                                    <Typography variant="body1" style={{color: '#7d7d7d'}}>
                                        You're done with verification and you will be notified within a day about your status.
                                    </Typography>
                                </div>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.navRedirect}
                                >
                                    Home
                                </Button>
                            </CardContent>
                        </Card>
        }

        return (
            <React.Fragment>
                <Drawer anchor="right" open={this.state.helpMenu} onClose={this.openHelp}>
                    <Typography variant="h6">Help</Typography>
                </Drawer>
                {currentStep}
            </React.Fragment>
        )
    }
}

StepThree.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    nextStep: PropTypes.func,
    finishIdentityForm: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors,
});

const routeStepThree = withRouter(props => <StepThree {...props}/>);

export default connect(
    mapStateToProps,
    { finishIdentityForm }
)(withStyles(themeStyles)(routeStepThree));
