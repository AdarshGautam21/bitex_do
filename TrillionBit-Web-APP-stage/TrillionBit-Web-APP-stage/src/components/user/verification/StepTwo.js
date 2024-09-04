import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { withStyles } from '@mui/styles';

import isEmpty from '../../../validation/isEmpty';
import { uploadDocuments, saveResidenceDoc } from '../../../actions/userActions';

import {
    TextField,
    Grid,
    Typography,
    MenuItem,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    Card,
    CardContent,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import themeStyles from '../../../assets/themeStyles';

import uploadIcon from '../../../assets/img/uploadIcon.webp';

import Countries from '../../../common/Countries';

class StepTwo extends Component {

    constructor() {
        super();
        this.state = {
            errors: {},
            countryCode: "",
            country: {},
            helpMenu: false,
            address: "",
            city: "",
            zipcode: "",
            currentChiledStep: "resedencyInput",
            userCurrentDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            dropzonClass: 'dropzon-input'
        }
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value});
        if(name === 'country') {
            this.setState({ countryCode: event.target.value.sortname });
        }
    };

    nextSteps = (value) => {
        this.setState({ currentChiledStep: value })
    }

    selectedFile = (selectedFiles, docType) => {
        if(isEmpty(selectedFiles)){
            let errorObj = {};
            let userCurrentObj = this.state.userCurrentDocument;
            if(docType === 'proof_of_recidence') {
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    userCurrentDocument: userCurrentObj
                }
            }
            this.setState(errorObj);
        } else {
            const { user } = this.props;
            let droppedFile = {};
            let userCurrentObj = this.state.userCurrentDocument;

            selectedFiles.map((file) => {
                droppedFile = file;
                return true;
            });

            userCurrentObj.userIdentityId = user.userIdentity._id;
            userCurrentObj.address = this.state.address;
            userCurrentObj.city = this.state.city;
            userCurrentObj.zipcode = this.state.zipcode;
            userCurrentObj.country = this.state.countryCode;
            userCurrentObj.file = droppedFile;
            this.setState({
                userCurrentDocument: userCurrentObj,
                dropzonClass: 'dropzon-input'
            });

            this.props.saveResidenceDoc(userCurrentObj);
        }
    }

    uploadUseDocuments = () => {
        this.props.uploadDocuments(this.state.userCurrentDocument);
        this.props.nextStep('stepThree');
    }

    render() {
        const {
            errors,
            countryCode,
            address,
            city,
            zipcode,
            currentChiledStep,
        } = this.state;
        const {classes} = this.props;

        let nextButton = true;
        if(!isEmpty(countryCode) && !isEmpty(address) && !isEmpty(city) && !isEmpty(zipcode)){
            nextButton = false;
        }

        let countries = [];
        countries.push(<MenuItem key={0} value="">
                            <em>None</em>
                        </MenuItem>);

        Countries.map( countryData =>
            countries.push(<MenuItem key={countryData.id} value={countryData}>{countryData.name}</MenuItem>)
        );

        let currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                        Residency Information
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        We'll need a information about your residency
                                    </Typography>

                                    <Grid container>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                label="Add your home address"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={this.state.address}
                                                onChange={this.handleChange('address')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                className=" form-control"
                                                label="City"
                                                type="text"
                                                fullWidth={true}
                                                value={this.state.city}
                                                onChange={this.handleChange('city')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                className=" form-control"
                                                label="Zipcode"
                                                type="number"
                                                fullWidth={true}
                                                value={this.state.zipcode}
                                                onChange={this.handleChange('zipcode')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={12} xs={12}>
                                            <FormControl
                                                fullWidth={true}
                                                error={errors.country}
                                                className="form-control text-left"
                                            >
                                                <InputLabel htmlFor="country-helper">Select country</InputLabel>
                                                <Select
                                                    autoWidth={true}
                                                    value={this.state.country}
                                                    inputProps={{
                                                        name: 'country',
                                                    }}
                                                    onChange={this.handleChange('country')}
                                                >
                                                    { countries }
                                                </Select>
                                                <FormHelperText>{errors.country}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                    </Grid>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        disabled={nextButton}
                                        onClick={() => this.nextSteps('selectID')}
                                    >
                                        Continue
                                    </Button>
                                </CardContent>
                            </Card>;

        if(currentChiledStep === 'selectID') {
            currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                        Upload proof of residency
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        This document shows that you're living at the provided address. please make sure:
                                    </Typography>

                                    <div className="uploadBox">

                                        <div className={(isEmpty(this.state.userCurrentDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                Proof of residency
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'proof_of_recidence')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.userCurrentDocument.file) ?
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.userCurrentDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img
                                                                                className="idImage"
                                                                                src={URL.createObjectURL(this.state.userCurrentDocument.file)}
                                                                                alt={this.state.userCurrentDocument.file.path}
                                                                            />
                                                                        </div>
                                                                        { this.state.userCurrentDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        disabled={
                                            (!isEmpty(this.state.userCurrentDocument.file)) ? false : true
                                        }
                                        onClick={this.uploadUseDocuments}
                                    >
                                        Continue
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

StepTwo.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    uploadDocuments: PropTypes.func.isRequired,
    nextStep: PropTypes.func,
    saveResidenceDoc: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors,
});

const routeStepTwo = withRouter(props => <StepTwo {...props}/>);

export default connect(
    mapStateToProps,
    { uploadDocuments, saveResidenceDoc }
)(withStyles(themeStyles)(routeStepTwo));
