import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { withStyles } from '@mui/styles';

import isEmpty from '../../../validation/isEmpty';

import passportLogo from '../../../assets/img/passport.webp';
import idCard from '../../../assets/img/idCard.webp';
import driving from '../../../assets/img/driving-license.webp';

import passportBlue from '../../../assets/img/passport-blue.webp';
import idCardBlue from '../../../assets/img/idCard-blue.webp';
import drivingBlue from '../../../assets/img/driving-license-blue.webp';

import uploadIcon from '../../../assets/img/uploadIcon.webp';

import {
    uploadDocuments,
    getUserIdentity,
    createUserIdentity,
    saveDocument,
    saveCorporateInfo,
} from '../../../actions/userActions';

import {
    Box,
    Grid,
    Typography,
    MenuItem,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    Select,
    Card,
    CardContent,
    InputLabel,
    TextField,
    InputAdornment,
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Drawer from '@mui/material/Drawer';
import { Help } from '@mui/icons-material';
import DateFnsUtils from '@date-io/date-fns';
// import MomentUtils from "@date-io/moment";
// import {
//     // MuiPickersUtilsProvider,
//     DesktopDatePicker
//     // KeyboardDatePicker,
// } from '@material-ui/pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';



import themeStyles from '../../../assets/themeStyles';

import Countries from '../../../common/Countries';

class StepOne extends Component {

    constructor() {
        super();
        this.state = {
            errors: {},
            countryCode: "",
            phoneCountryCode: "+00",
            country: {},
            officeCountry: {},
            dateOfBirth: new Date(),
            steps: 'country',
            userNationality: '',
            passportBox: false,
            driverLicenceBox: false,
            idCardBox: false,
            individualBox: false,
            corporateBox: false,
            selectedDocument: '',
            helpMenu: false,
            userCurrentDocument: {
                message: 'Drag & Drop files or Click here to upload',
                frontIdMessage: 'Drag & Drop files or Click here to upload',
                backIdMessage: 'Drag & Drop files or Click here to upload'
            },
            dropzonClass: 'dropzon-input',
            dropzonClassFront: 'dropzon-input',
            dropzonClassBack: 'dropzon-input',

            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            officeAddress: '',
            officeCity: '',
            officeZip: '',
        }

    }

    componentDidMount = async () => {
        console.log(this.state.dateOfBirth);
        const { auth } = this.props;
        await this.props.getUserIdentity(auth.user.id);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
        if(nextProps.user) {
            this.setState({
                country: (nextProps.user.userIdentity.userNationality) ? nextProps.user.userIdentity.userNationality : '',
                countryCode: nextProps.user.userIdentity.userNationality
            });
        }
    }

    handleChange = (name) => (event) => {
        if(name === 'dateOfBirth') {
            this.setState({dateOfBirth: event});
        } else {
            this.setState({ [name]: event.target.value });
        }

        if(name === "userNationality") {
            this.setState({ userNationality: event.target.value, phoneCountryCode: '+'+event.target.value.phoneCode});
        }
        if(name === "officeCountry") {
            this.setState({officeCountry: event.target.value});
        }
        if(name === "country") {
            const { auth } = this.props;
            this.props.createUserIdentity({userId: auth.user.id, userNationality: event.target.value});
            this.setState({ countryCode: event.target.value });
        }
    };

    nextSteps = (value) => {
        if(value === 'idType') {
            this.setState({
                userCurrentDocument: {
                    message: 'Drag & Drop files or Click here to upload',
                    frontIdMessage: 'Drag & Drop files or Click here to upload',
                    backIdMessage: 'Drag & Drop files or Click here to upload'
                }
            })
        }
        this.setState({ steps: value });
    }

    selectOption = (value) => {
        if(value === 'passport') {
            this.setState({
                passportBox: !this.state.passportBox,
                idCardBox: false,
                driverLicenceBox: false,
                selectedDocument: 'Passport'
            });
        }
        if(value === 'idCard') {
            this.setState({
                passportBox: false,
                idCardBox: !this.state.idCardBox,
                driverLicenceBox: false,
                selectedDocument: 'ID Card'
            });
        }
        if(value === 'driverLicence') {
            this.setState({
                passportBox: false,
                idCardBox: false,
                driverLicenceBox: !this.state.driverLicenceBox,
                selectedDocument: "Driver's Licence"
            });
        }

        if(value === 'individualAccount') {
            this.setState({
                corporateBox: false,
                individualBox: !this.state.individualBox
            })
        }

        if(value === 'corporateAccount') {
            this.setState({
                individualBox: false,
                corporateBox: !this.state.corporateBox
            })
        }
    }

    openHelp = () => {
        this.setState({ helpMenu: !this.state.helpMenu });
    }

    selectedFile = (selectedFiles, docType) => {
        if(isEmpty(selectedFiles)){
            let errorObj = {};
            let userCurrentObj = this.state.userCurrentDocument;
            if(docType === 'idCardFront') {
                userCurrentObj.frontIdMessage = 'Invalid file format please upload jpeg, png or pdf only.';
                errorObj = {
                    dropzonClassFront: 'dropzon-input error',
                    userCurrentDocument: userCurrentObj
                }
            }
            if(docType === 'idCardBack') {
                userCurrentObj.backIdMessage = 'Invalid file format please upload jpeg, png or pdf only.';
                errorObj = {
                    dropzonClassBack: 'dropzon-input error',
                    userCurrentDocument: userCurrentObj
                }
            }
            if(docType === 'passport') {
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
            if(docType === 'passport') {
                userCurrentObj.file = droppedFile;
                userCurrentObj.docType = docType;
                this.setState({
                    userCurrentDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });
                userCurrentObj.docName = 'Passport';
                userCurrentObj.userIdentityId = user.userIdentity._id;
                this.props.saveDocument(userCurrentObj);
            } else {
                let stateObj = {};

                if(docType === 'idCardFront') {
                    userCurrentObj.frontFile = droppedFile;
                    userCurrentObj.file = droppedFile;
                    userCurrentObj.docType = (this.state.idCardBox) ? 'idCardFront' : 'driverLicenceFront';
                    userCurrentObj.docName = (this.state.idCardBox) ? 'Id Card' : 'Driver Licence';
                    userCurrentObj.userIdentityId = user.userIdentity._id;
                    stateObj = {
                        dropzonClassFront: 'dropzon-input',
                        userCurrentDocument: userCurrentObj
                    }
                    this.props.saveDocument(userCurrentObj);
                }
                if(docType === 'idCardBack') {
                    userCurrentObj.backFile = droppedFile;
                    userCurrentObj.file = droppedFile;
                    userCurrentObj.docType = (this.state.idCardBox) ? 'idCardBack' : 'driverLicenceback';
                    userCurrentObj.docName = (this.state.idCardBox) ? 'Id Card' : 'Driver Licence';
                    userCurrentObj.userIdentityId = user.userIdentity._id;
                    stateObj = {
                        dropzonClassBack: 'dropzon-input',
                        userCurrentDocument: userCurrentObj
                    }
                    this.props.saveDocument(userCurrentObj);
                }

                this.setState(stateObj);
            }
        }
    }

    uploadUseDocuments = async () => {
        this.props.uploadDocuments(this.state.userCurrentDocument);
        this.props.nextStep('stepTwo');
    }

    saveCorporateInfoFirst = async () => {
        const {user, auth} = this.props;
        let corporateFirstInfoParams = {
            userIdentityId: user.userIdentity._id,
            userIdType: 'corporate',
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dateOfBirth: this.state.dateOfBirth,
            email: this.state.email,
            phone: this.state.phoneCountryCode + ' ' + this.state.phone,
            nationality: this.state.userNationality.name,
            officeAddress: this.state.officeAddress,
            officeCity: this.state.officeCity,
            officeZip: this.state.officeZip,
            officeCountry: this.state.officeCountry.name,
        }

        await this.props.saveCorporateInfo(auth.user.id, corporateFirstInfoParams);
        this.props.nextStep('stepTwoCorporate');
    }

    
    selectedDocumentIN = (documentType) => {
        switch(documentType) {
            case 'Passport':
                documentType = this.state.country === "IN" ? 'PAN card' : 'Passport';
              break;
            case 'ID Card':
                documentType = this.state.country === "IN" ? 'Aadhaar card' : 'ID card';
              break;
            default:
        }
        return documentType;
    }

    render() {
        const {
            errors,
            passportBox,
            idCardBox,
            driverLicenceBox,
            selectedDocument,
            countryCode,
            phoneCountryCode,
            individualBox,
            corporateBox,
            firstname,
            lastname,
            dateOfBirth,
            email,
            phone,
            officeAddress,
            officeCity,
            officeZip,
            officeCountry,
        } = this.state;
        const {classes} = this.props;

        let countries = [];
        countries.push(<MenuItem key={0} value="">
                            <em>None</em>
                        </MenuItem>);

        let userNationality = [];
        userNationality.push(<MenuItem key={0} value="">
                            <em>None</em>
                        </MenuItem>);

        Countries.map( countryData =>
            {
                countries.push(<MenuItem key={countryData.id} value={countryData.sortname}>{countryData.name}</MenuItem>)
                userNationality.push(<MenuItem key={countryData.id} value={countryData}>{countryData.name}</MenuItem>)
                return true;
            });

        let currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                        Select Nationality
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Choose the country that issued your ID.
                                    </Typography>

                                    <div className="imgBox">
                                        <img src={passportLogo} alt="passport"/>
                                    </div>

                                    <div>
                                    <FormControl
                                        style={stepOneStyle.formControl}
                                        error={errors.userNationality}
                                        variant="filled"
                                    >
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
                                        <FormHelperText>{errors.userNationality}</FormHelperText>
                                    </FormControl>
                                    </div>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        disabled={(isEmpty(countryCode) ? true : false)}
                                        onClick={() => this.nextSteps('customerType')}
                                    >
                                        Continue
                                    </Button>
                                </CardContent>
                            </Card>

        if(this.state.steps === 'customerType') {
            currentStep = <Card className="dataListCard">
                            <CardContent className="identityBoxInfo text-center">
                                <Typography variant="h3" className="title">
                                    Select Customer Type
                                </Typography>

                                <Typography variant="h5" className="subTitle">
                                    Choose customer type
                                </Typography>

                                <Grid container justify="center">
                                    <Grid item xs={12} md={6} sm={6}>
                                        <Box className={(individualBox) ? 'selectedBox' : 'selectBox'} onClick={() => this.selectOption('individualAccount')}>
                                            <IconButton className="CheckCircle" aria-label="CheckCircle">
                                                <CheckCircle />
                                            </IconButton>
                                            {(individualBox) ? <img src={passportBlue} alt=""/> : <img src={passportLogo} alt=""/>}
                                            <Typography variant="body1">Individual</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6} sm={6}>
                                        <Box className={(corporateBox) ? 'selectedBox' : 'selectBox'} onClick={() => this.selectOption('corporateAccount')}>
                                            <IconButton className="CheckCircle" aria-label="CheckCircle">
                                                <CheckCircle />
                                            </IconButton>
                                            {(corporateBox) ? <img src={idCardBlue} alt=""/> : <img src={idCard} alt=""/>}
                                            <Typography variant="body1">Corporate</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={6} xs={6} className="text-left">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            onClick={() => this.nextSteps('')}
                                        >
                                            Back
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={6} className="text-right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={(individualBox || corporateBox) ? false : true}
                                            onClick={() => {
                                                (individualBox) ? this.nextSteps('idType') : this.nextSteps('corporateInfo')
                                            }}
                                        >
                                            Continue
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
        }

        if(corporateBox) {
            let nextButton = true;
            if(
                !isEmpty(firstname) && !isEmpty(lastname) && !isEmpty(dateOfBirth) && !isEmpty(this.state.userNationality) && !isEmpty(email) && !isEmpty(phone)
                && !isEmpty(officeAddress) && !isEmpty(officeCountry) && !isEmpty(officeCity) && !isEmpty(officeZip)
            ){
                nextButton = false;
            }
            if(this.state.steps === 'corporateInfo') {
                currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                        Contact Person & Information
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Enter your contact details
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="First Name"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={firstname}
                                                onChange={this.handleChange('firstname')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="Last Name"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={lastname}
                                                onChange={this.handleChange('lastname')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}> */}
                                            {/* <DesktopDatePicker
                                                placeholder="DD/MM/YYYY"
                                                disableToolbar
                                                variant="inline"
                                                format="DD/MM/yyyy"
                                                margin="normal"
                                                fullWidth={true}
                                                id="date-picker-inline"
                                                label="Date Of Birth"
                                                value={dateOfBirth}
                                                onChange={this.handleChange('dateOfBirth')}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                /> */}
                                               
                                            {/* </MuiPickersUtilsProvider> */}
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                className="form-control"
                                                label="Email"
                                                type="text"
                                                fullWidth={true}
                                                value={email}
                                                onChange={this.handleChange('email')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <FormControl
                                                fullWidth={true}
                                                error={(errors.userNationality) ? true : false}
                                                style={stepOneStyle.formControl}
                                            >
                                                <InputLabel htmlFor="country-helper">Nationality</InputLabel>
                                                <Select
                                                    autoWidth={true}
                                                    value={this.state.userNationality}
                                                    inputProps={{
                                                        name: 'userNationality',
                                                    }}
                                                    onChange={this.handleChange('userNationality')}
                                                >
                                                    { userNationality }
                                                </Select>
                                                <FormHelperText>{errors.userNationality}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                error={(errors.phone) ? true : false}
                                                label="Phone"
                                                type="number"
                                                name="phone"
                                                className={classes.textField}
                                                fullWidth={true}
                                                value={phone}
                                                onChange={this.handleChange('phone')}
                                                margin="normal"
                                                helperText={errors.phone}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">{phoneCountryCode}</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h3" className="title">
                                        Registered Office Address
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Office Details
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                label="Address"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={officeAddress}
                                                onChange={this.handleChange('officeAddress')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="City"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={officeCity}
                                                onChange={this.handleChange('officeCity')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="Zip"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={officeZip}
                                                onChange={this.handleChange('officeZip')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <FormControl
                                                fullWidth={true}
                                                error={(errors.officeCountry) ? true : false}
                                                style={stepOneStyle.formControl}
                                            >
                                                <InputLabel htmlFor="country-helper">Country</InputLabel>
                                                <Select
                                                    autoWidth={true}
                                                    value={officeCountry}
                                                    inputProps={{
                                                        name: 'officeCountry',
                                                    }}
                                                    onChange={this.handleChange('officeCountry')}
                                                >
                                                    { userNationality }
                                                </Select>
                                                <FormHelperText>{errors.officeCountry}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                    </Grid>

                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={6} className="text-left">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                onClick={() => this.nextSteps('customerType')}
                                            >
                                                Back
                                            </Button>
                                        </Grid>
                                        <Grid item md={6} xs={6} className="text-right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                disabled={nextButton}
                                                onClick={() => this.saveCorporateInfoFirst()}
                                            >
                                                Continue
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
            }
        }

        if(individualBox) {
            if(this.state.steps === 'idType') {
                currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                        Select ID Type
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Choose the country that issued your ID.
                                    </Typography>

                                    <Grid container justify="center">
                                        <Grid item xs={12} md={3} sm={4}>
                                            <Box className={(passportBox) ? 'selectedBox' : 'selectBox'} onClick={() => this.selectOption('passport')}>
                                                <IconButton className="CheckCircle" aria-label="CheckCircle">
                                                    <CheckCircle />
                                                </IconButton>
                                                {(passportBox) ? <img src={passportBlue} alt="" /> : <img src={passportLogo} alt="" />} 
            <Typography variant="body1">{this.state.country === "IN" ? 'PAN card' : 'Passport'}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3} sm={4}>
                                            <Box className={(idCardBox) ? 'selectedBox' : 'selectBox'} onClick={() => this.selectOption('idCard')}>
                                                <IconButton className="CheckCircle" aria-label="CheckCircle">
                                                    <CheckCircle />
                                                </IconButton>
                                                {(idCardBox) ? <img src={idCardBlue} alt="" /> : <img src={idCard} alt="" />} 
                                                <Typography variant="body1">{this.state.country === "IN" ? 'Aadhaar card' : 'ID card'}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3} sm={4}>
                                            <Box className={(driverLicenceBox) ? 'selectedBox' : 'selectBox'} onClick={() => this.selectOption('driverLicence')}>
                                                <IconButton className="CheckCircle" aria-label="CheckCircle">
                                                    <CheckCircle />
                                                </IconButton>
                                                {(driverLicenceBox) ? <img src={drivingBlue} alt="" /> : <img src={driving} alt="" />} 
                                                <Typography variant="body1">Driver's License</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={6} className="text-left">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                onClick={() => this.nextSteps('customerType')}
                                            >
                                                Back
                                            </Button>
                                        </Grid>
                                        <Grid item md={6} xs={6} className="text-right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                disabled={(passportBox || idCardBox || driverLicenceBox) ? false : true}
                                                onClick={() => this.nextSteps('uploadDocs')}
                                            >
                                                Continue
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>;
            }

            if(this.state.steps === 'uploadDocs') {
                let dropzonArea = <div className="uploadBox">
                                        <div className={(isEmpty(this.state.userCurrentDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                            { this.state.country === "IN" ? 'PAN card' : 'Passport'} <Help onClick={this.openHelp} />
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'passport')}
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
                                                                        <input {...getInputProps()} />
                                                                        { this.state.userCurrentDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>;
    
                if(idCardBox || driverLicenceBox) {
                    dropzonArea = <div className="uploadBox">
    
                                    <div className={(isEmpty(this.state.userCurrentDocument.frontFile)) ? "sideBox" : "sideBox"}>
                                        <Typography variant="h5" className="subTitle">
                                            {this.selectedDocumentIN(selectedDocument)} - front side <Help onClick={this.openHelp} />
                                        </Typography>
                                        <div>
    
                                            <Dropzone
                                                onDrop={(selectedFile) => this.selectedFile(selectedFile, 'idCardFront')}
                                                accept="image/png, image/jpeg, application/pdf"
                                            >
                                                {({getRootProps, getInputProps}) => (
                                                    <div {...getRootProps()}>
                                                        {
                                                            (isEmpty(this.state.userCurrentDocument.frontFile) ?
                                                                <div className={this.state.dropzonClassFront}>
                                                                    <div className="imgBox">
                                                                        <img src={uploadIcon} alt="logo here" />
                                                                    </div>
                                                                    <input {...getInputProps()} />
                                                                    {this.state.userCurrentDocument.frontIdMessage}
                                                                </div> :
                                                                <div className={this.state.dropzonClassFront}>
                                                                    <div className="imgBox">
                                                                        <img
                                                                            className="idImage"
                                                                            src={URL.createObjectURL(this.state.userCurrentDocument.frontFile)}
                                                                            alt={this.state.userCurrentDocument.frontFile.path}
                                                                        />
                                                                    </div>
                                                                    <input {...getInputProps()} />
                                                                    { this.state.userCurrentDocument.frontFile.path }
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </div>
                                    </div>
    
                                    <div className={(isEmpty(this.state.userCurrentDocument.backFile)) ? "sideBox" : "sideBox"}>
                                        <Typography variant="h5" className="subTitle">
                                        {this.selectedDocumentIN(selectedDocument)}  - back side <Help onClick={this.openHelp} />
                                        </Typography>
                                        <div>
                                            <Dropzone
                                                onDrop={(selectedFile) => this.selectedFile(selectedFile, 'idCardBack')}
                                                accept="image/png, image/jpeg, application/pdf"
                                            >
                                                {({getRootProps, getInputProps}) => (
                                                    <div {...getRootProps()}>
                                                        {
                                                            (isEmpty(this.state.userCurrentDocument.backFile) ?
                                                                <div className={this.state.dropzonClassBack}>
                                                                    <div className="imgBox">
                                                                        <img src={uploadIcon} alt="logo here" />
                                                                    </div>
                                                                    <input {...getInputProps()} />
                                                                    {this.state.userCurrentDocument.backIdMessage}
                                                                </div> :
                                                                <div className={this.state.dropzonClassBack}>
                                                                    <div className="imgBox">
                                                                        <img
                                                                            className="idImage"
                                                                            src={URL.createObjectURL(this.state.userCurrentDocument.backFile)}
                                                                            alt={this.state.userCurrentDocument.backFile.path}
                                                                        />
                                                                    </div>
                                                                    <input {...getInputProps()} />
                                                                    { this.state.userCurrentDocument.backFile.path }
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </div>
                                    </div>
                                </div>
                }

                currentStep = <Card className="dataListCard">
                                <CardContent className="identityBoxInfo text-center">
                                    <Typography variant="h3" className="title">
                                       

                                        Upload {this.selectedDocumentIN(selectedDocument) } photo
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        You can use your phone’s camera, just make sure the picture is:
                                    </Typography>

                                    {dropzonArea}

                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={6} className="text-left">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                onClick={() => this.nextSteps('idType')}
                                            >
                                                Back
                                            </Button>
                                        </Grid>
                                        <Grid item md={6} xs={6} className="text-right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                disabled={
                                                    (
                                                        (
                                                            !isEmpty(this.state.userCurrentDocument.file)
                                                            && this.state.userCurrentDocument.docType === 'passport'
                                                        )
                                                        || (
                                                            !isEmpty(this.state.userCurrentDocument.frontFile)
                                                            && !isEmpty(this.state.userCurrentDocument.backFile)
                                                            )
                                                    )
                                                    ? false
                                                    : true
                                                }
                                                onClick={this.uploadUseDocuments}
                                            >
                                                Continue
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>;
            }
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

const stepOneStyle = {
    formControl: {
        marginTop: 16,
        marginBottom: 8,
        width: '100%',
        textAlign: 'left',
    },
    dropzonInputStyle: {
        border: '1px solid #ccc',
        borderStyle: 'dashed',
        borderRadius: 5,
        cursor: 'pointer',
        textAlign: 'center',
    },
    mainStepRoot: {
        height: '100%',
        textAlign: 'center'
    },
    dropzonStyle: {
        border: '1px solid #ccc',
        borderStyle: 'dashed',
        borderRadius: 5,
        cursor: 'pointer',
        textAlign: 'center',
        padding: '5%',
        marginBottom: 20,
    }
}

StepOne.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    uploadDocuments: PropTypes.func.isRequired,
    nextStep: PropTypes.func,
    getUserIdentity: PropTypes.func.isRequired,
    createUserIdentity: PropTypes.func.isRequired,
    saveDocument: PropTypes.func.isRequired,
    saveCorporateInfo: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors,
});

const routerStepOne = withRouter(props => <StepOne {...props}/>);

export default connect(mapStateToProps, {
    uploadDocuments,
    getUserIdentity,
    createUserIdentity,
    saveDocument,
    saveCorporateInfo,
})(withStyles(themeStyles)(routerStepOne));
