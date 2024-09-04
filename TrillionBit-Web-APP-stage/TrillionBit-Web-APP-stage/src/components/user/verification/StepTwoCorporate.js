import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { withStyles } from '@mui/styles';

import isEmpty from '../../../validation/isEmpty';
import {
    uploadDocuments,
    saveResidenceDoc,
    saveCoroprateDocs,
    saveCorporateInfoTwo,
} from '../../../actions/userActions';

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
import DateFnsUtils from '@date-io/date-fns';
// import {
//     // MuiPickersUtilsProvider,
//     DesktopDatePicker
//     // KeyboardDatePicker,
// } from '@material-ui/pickers';
import themeStyles from '../../../assets/themeStyles';

import uploadIcon from '../../../assets/img/uploadIcon.webp';

import Countries from '../../../common/Countries';

class StepTwoCorporate extends Component {
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
            fullLegleName: '',
            numberOfDirectors: '',
            incorporationDate: new Date(),
            bussinessType: '',
            registrationNumber: '',
            bankName: '',
            bankAccountNumber: '',
            bankAccountHolderName: '',
            bankCountry: '',
            bankCountryCode: '',
            certificateOfInsuranceDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            memorandumOfAssociationDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            detailsOfOwnershipDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            bankStatementDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            shareHoldersDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            userCurrentDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            shareHoldersProofDocument: {
                message: 'Drag & Drop files or Click here to upload file'
            },
            dropzonClass: 'dropzon-input'
        }
    }

    handleChange = (name) => (event) => {
        if(name === 'incorporationDate') {
            this.setState({incorporationDate: event+''});
        } else {
            this.setState({ [name]: event.target.value });
        }

        if(name === 'country') {
            this.setState({ countryCode: event.target.value.sortname });
        }
        if(name === 'bankCountry') {
            this.setState({ bankCountryCode: event.target.value.name });
        }
    };

    nextSteps = (value) => {
        this.setState({ currentChiledStep: value })
    }

    selectedFile = (selectedFiles, docType) => {
        if(isEmpty(selectedFiles)) {
            let errorObj = {};
            if(docType === 'certificate_of_incorporation') {
                let userCurrentObj = this.state.certificateOfInsuranceDocument;
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                userCurrentObj.error = true;
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    certificateOfInsuranceDocument: userCurrentObj
                }
            }
            if(docType === 'memorandum_of_association') {
                let userCurrentObj = this.state.memorandumOfAssociationDocument;
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                userCurrentObj.error = true;
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    memorandumOfAssociationDocument: userCurrentObj
                }
            }
            if(docType === 'details_of_ownership') {
                let userCurrentObj = this.state.detailsOfOwnershipDocument;
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                userCurrentObj.error = true;
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    detailsOfOwnershipDocument: userCurrentObj
                }
            }
            if(docType === 'bank_statement') {
                let userCurrentObj = this.state.bankStatementDocument;
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                userCurrentObj.error = true;
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    bankStatementDocument: userCurrentObj
                }
            }
            if(docType === 'share_holders') {
                let userCurrentObj = this.state.shareHoldersDocument;
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                userCurrentObj.error = true;
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    shareHoldersDocument: userCurrentObj
                }
            }
            if(docType === 'share_holders_documents') {
                let userCurrentObj = this.state.shareHoldersProofDocument;
                userCurrentObj.message = 'Invalid file format please upload jpeg, png or pdf only.';
                userCurrentObj.error = true;
                errorObj = {
                    dropzonClass: 'dropzon-input error',
                    shareHoldersProofDocument: userCurrentObj
                }
            }
            this.setState(errorObj);
        } else {
            const { user } = this.props;

            if(docType === 'certificate_of_incorporation') {
                let userCurrentObj = this.state.certificateOfInsuranceDocument;
                let droppedFile = {};

                selectedFiles.map((file) => {
                    droppedFile = file;
                    return true;
                });
                userCurrentObj.userIdentityId = user.userIdentity._id;
                userCurrentObj.file = droppedFile;
                userCurrentObj.docType = docType;
                userCurrentObj.docName = 'Certificate Of Incorporation';
                this.setState({
                    certificateOfInsuranceDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });

                this.props.saveCoroprateDocs(userCurrentObj);
            }
            if(docType === 'memorandum_of_association') {
                let userCurrentObj = this.state.memorandumOfAssociationDocument;
                let droppedFile = {};

                selectedFiles.map((file) => {
                    droppedFile = file;
                    return true;
                });
                userCurrentObj.userIdentityId = user.userIdentity._id;
                userCurrentObj.file = droppedFile;
                userCurrentObj.docType = docType;
                userCurrentObj.docName = 'Memorandum Of Association';
                this.setState({
                    memorandumOfAssociationDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });

                this.props.saveCoroprateDocs(userCurrentObj);
            }
            if(docType === 'details_of_ownership') {
                let userCurrentObj = this.state.detailsOfOwnershipDocument;
                let droppedFile = {};

                selectedFiles.map((file) => {
                    droppedFile = file;
                    return true;
                });
                userCurrentObj.userIdentityId = user.userIdentity._id;
                userCurrentObj.file = droppedFile;
                userCurrentObj.docType = docType;
                userCurrentObj.docName = 'Details Of Ownership';
                this.setState({
                    detailsOfOwnershipDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });

                this.props.saveCoroprateDocs(userCurrentObj);
            }
            if(docType === 'bank_statement') {
                let userCurrentObj = this.state.bankStatementDocument;
                let droppedFile = {};

                selectedFiles.map((file) => {
                    droppedFile = file;
                    return true;
                });
                userCurrentObj.userIdentityId = user.userIdentity._id;
                userCurrentObj.file = droppedFile;
                userCurrentObj.docType = docType;
                userCurrentObj.docName = 'Bank Statement';
                this.setState({
                    bankStatementDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });

                this.props.saveCoroprateDocs(userCurrentObj);
            }
            if(docType === 'share_holders') {
                let userCurrentObj = this.state.shareHoldersDocument;
                let droppedFile = {};

                selectedFiles.map((file) => {
                    droppedFile = file;
                    return true;
                });
                userCurrentObj.userIdentityId = user.userIdentity._id;
                userCurrentObj.file = droppedFile;
                userCurrentObj.docType = docType;
                userCurrentObj.docName = 'Share Holders';
                this.setState({
                    shareHoldersDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });

                this.props.saveCoroprateDocs(userCurrentObj);
            }
            if(docType === 'share_holders_documents') {
                let userCurrentObj = this.state.shareHoldersProofDocument;
                let droppedFile = [];

                for(let key in selectedFiles) {
                    droppedFile.push(selectedFiles[key]);
                }
                userCurrentObj.userIdentityId = user.userIdentity._id;
                userCurrentObj.files = droppedFile;
                userCurrentObj.docType = docType;
                userCurrentObj.docName = 'Share Holder Documents';
                this.setState({
                    shareHoldersProofDocument: userCurrentObj,
                    dropzonClass: 'dropzon-input'
                });

                this.props.saveCoroprateDocs(userCurrentObj);
            }
        }
    }

    saveCorporateInfoTwo = async () => {
        const { auth, user } = this.props;
        let userParams = {
            userIdentityId: user.userIdentity._id,
            fullLegleName: this.state.fullLegleName,
            numberOfDirectors: this.state.numberOfDirectors,
            incorporationDate: this.state.incorporationDate,
            nationality: this.state.nationality,
            bussinessType: this.state.bussinessType,
            registraionNumber: this.state.registrationNumber,
            bankName: this.state.bankName,
            bankAccountNumber: this.state.bankAccountNumber,
            bankAccountHolderName: this.state.bankAccountHolderName,
            bankCountry: this.state.bankCountryCode,
        }
        await this.props.saveCorporateInfoTwo(auth.user.id, userParams);
        this.props.nextStep('stepThreeCorporate');
    }

    render() {
        const {
            errors,
            fullLegleName,
            numberOfDirectors,
            incorporationDate,
            country,
            bussinessType,
            registrationNumber,
            bankName,
            bankAccountNumber,
            bankAccountHolderName,
            bankCountry,
        } = this.state;
        const {classes} = this.props;

        let nextButton = true;
        if(
            !isEmpty(fullLegleName)
            && !isEmpty(numberOfDirectors)
            && !isEmpty(incorporationDate)
            && !isEmpty(country)
            && !isEmpty(bussinessType)
            && !isEmpty(registrationNumber)
            && !isEmpty(bankName)
            && !isEmpty(bankAccountNumber)
            && !isEmpty(bankAccountHolderName)
            && !isEmpty(bankCountry)
            && !isEmpty(this.state.certificateOfInsuranceDocument.file)
            && !isEmpty(this.state.memorandumOfAssociationDocument.file)
            && !isEmpty(this.state.detailsOfOwnershipDocument.file)
            && !isEmpty(this.state.bankStatementDocument.file)
            && !isEmpty(this.state.shareHoldersDocument.file)
            && !isEmpty(this.state.shareHoldersProofDocument.files)
        ){
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
                                <CardContent className="identityBoxInfo corporateUploadBox text-center">
                                    <Typography variant="h3" className="title">
                                        Corporate Information
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Company details
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                label="Full Legal Name"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={fullLegleName}
                                                onChange={this.handleChange('fullLegleName')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="Number Of Directors"
                                                className="form-control"
                                                type="number"
                                                fullWidth={true}
                                                value={numberOfDirectors}
                                                onChange={this.handleChange('numberOfDirectors')}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}> */}
                                                {/* <DesktopDatePicker
                                                    disableToolbar
                                                    variant="inline"
                                                    format="dd/MM/yyyy"
                                                    margin="normal"
                                                    fullWidth={true}
                                                    id="date-picker-inline"
                                                    label="Incorporation Date"
                                                    value={incorporationDate}
                                                    onChange={this.handleChange('incorporationDate')}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                /> */}
                                            {/* </MuiPickersUtilsProvider> */}
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <FormControl
                                                fullWidth={true}
                                                style={stepTwoCorprateStyle.formControl}
                                            >
                                                <InputLabel htmlFor="country-helper">Nationality</InputLabel>
                                                <Select
                                                    autoWidth={true}
                                                    value={country}
                                                    inputProps={{
                                                        name: 'country',
                                                    }}
                                                    onChange={this.handleChange('country')}
                                                >
                                                    { countries }
                                                </Select>
                                                <FormHelperText>{errors.userNationality}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                className=" form-control"
                                                label="Business Type"
                                                type="text"
                                                fullWidth={true}
                                                value={bussinessType}
                                                onChange={this.handleChange('bussinessType')}
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                className=" form-control"
                                                label="Registration / Incorporation Number"
                                                type="text"
                                                fullWidth={true}
                                                value={registrationNumber}
                                                onChange={this.handleChange('registrationNumber')}
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h3" className="title">
                                        Financial Information
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Company Bank Information
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="Bank Name"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={bankName}
                                                onChange={this.handleChange('bankName')}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="Account Number"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={bankAccountNumber}
                                                onChange={this.handleChange('bankAccountNumber')}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label="Account Holder Name"
                                                className="form-control"
                                                type="text"
                                                fullWidth={true}
                                                value={bankAccountHolderName}
                                                onChange={this.handleChange('bankAccountHolderName')}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <FormControl
                                                fullWidth={true}
                                                style={stepTwoCorprateStyle.formControl}
                                            >
                                                <InputLabel htmlFor="country-helper">Bank Country</InputLabel>
                                                <Select
                                                    autoWidth={true}
                                                    value={bankCountry}
                                                    inputProps={{
                                                        name: 'bankCountry',
                                                    }}
                                                    onChange={this.handleChange('bankCountry')}
                                                >
                                                    { countries }
                                                </Select>
                                                <FormHelperText>{errors.userNationality}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h3" className="title">
                                        Corporate Documents
                                    </Typography>

                                    <Typography variant="h5" className="subTitle">
                                        Upload Documents
                                    </Typography>

                                    <div className="uploadBox">
                                        <div className={(isEmpty(this.state.certificateOfInsuranceDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                Certificate Of Incorporation
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'certificate_of_incorporation')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.certificateOfInsuranceDocument.file) ?
                                                                    <div className={(this.state.certificateOfInsuranceDocument.error) ? "dropzon-input error" : "dropzon-input"}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.certificateOfInsuranceDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img
                                                                                className="idImage"
                                                                                src={URL.createObjectURL(this.state.certificateOfInsuranceDocument.file)}
                                                                                alt={this.state.certificateOfInsuranceDocument.file.path}
                                                                            />
                                                                        </div>
                                                                        { this.state.certificateOfInsuranceDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uploadBox">
                                        <div className={(isEmpty(this.state.memorandumOfAssociationDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                Memorandum Of Association
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'memorandum_of_association')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.memorandumOfAssociationDocument.file) ?
                                                                    <div className={(this.state.memorandumOfAssociationDocument.error) ? "dropzon-input error" : "dropzon-input"}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.memorandumOfAssociationDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img
                                                                                className="idImage"
                                                                                src={URL.createObjectURL(this.state.memorandumOfAssociationDocument.file)}
                                                                                alt={this.state.memorandumOfAssociationDocument.file.path}
                                                                            />
                                                                        </div>
                                                                        { this.state.memorandumOfAssociationDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uploadBox">
                                        <div className={(isEmpty(this.state.detailsOfOwnershipDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                Details Of Ownership
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'details_of_ownership')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.detailsOfOwnershipDocument.file) ?
                                                                    <div className={(this.state.memorandumOfAssociationDocument.error) ? "dropzon-input error" : "dropzon-input"}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.detailsOfOwnershipDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img
                                                                                className="idImage"
                                                                                src={URL.createObjectURL(this.state.detailsOfOwnershipDocument.file)}
                                                                                alt={this.state.detailsOfOwnershipDocument.file.path}
                                                                            />
                                                                        </div>
                                                                        { this.state.detailsOfOwnershipDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uploadBox">
                                        <div className={(isEmpty(this.state.bankStatementDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                Company Bank Statement With Address
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'bank_statement')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.bankStatementDocument.file) ?
                                                                    <div className={(this.state.bankStatementDocument.error) ? "dropzon-input error" : "dropzon-input"}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.bankStatementDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img
                                                                                className="idImage"
                                                                                src={URL.createObjectURL(this.state.bankStatementDocument.file)}
                                                                                alt={this.state.bankStatementDocument.file.path}
                                                                            />
                                                                        </div>
                                                                        { this.state.bankStatementDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uploadBox">
                                        <div className={(isEmpty(this.state.shareHoldersDocument.file)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                List of share holders
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'share_holders')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.shareHoldersDocument.file) ?
                                                                    <div className={(this.state.shareHoldersDocument.error) ? "dropzon-input error" : "dropzon-input"}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.shareHoldersDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            <img
                                                                                className="idImage"
                                                                                src={URL.createObjectURL(this.state.shareHoldersDocument.file)}
                                                                                alt={this.state.shareHoldersDocument.file.path}
                                                                            />
                                                                        </div>
                                                                        { this.state.shareHoldersDocument.file.path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uploadBox">
                                        <div className={(isEmpty(this.state.shareHoldersProofDocument.files)) ? "sideBox" : "sideBox"}>
                                            <Typography variant="h5" className="subTitle">
                                                Share holders who control more then 20%
                                            </Typography>
                                            <div>
                                                <Dropzone
                                                    onDrop={(selectedFile) => this.selectedFile(selectedFile, 'share_holders_documents')}
                                                    accept="image/png, image/jpeg, application/pdf"
                                                >
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}>
                                                            {
                                                                (isEmpty(this.state.shareHoldersProofDocument.files) ?
                                                                    <div className={(this.state.shareHoldersProofDocument.error) ? "dropzon-input error" : "dropzon-input"}>
                                                                        <div className="imgBox">
                                                                            <img src={uploadIcon} alt="logo here" />
                                                                        </div>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.shareHoldersProofDocument.message}
                                                                    </div> :
                                                                    <div className={this.state.dropzonClass}>
                                                                        <div className="imgBox">
                                                                            {this.state.shareHoldersProofDocument.files.map((file, index) =>
                                                                                {
                                                                                    return <img
                                                                                        key={index}
                                                                                        className="idImage"
                                                                                        src={URL.createObjectURL(file)}
                                                                                        alt={file.path}
                                                                                    />
                                                                                }
                                                                            )}
                                                                        </div>
                                                                        { this.state.shareHoldersProofDocument.files[0].path }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>

                                    <Grid container>
                                        <Grid item md={12} xs={12} className="text-center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                disabled={nextButton}
                                                onClick={() => this.saveCorporateInfoTwo()}
                                            >
                                                Continue
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </CardContent>
                            </Card>;
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

const stepTwoCorprateStyle = {
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

StepTwoCorporate.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    uploadDocuments: PropTypes.func.isRequired,
    nextStep: PropTypes.func,
    saveResidenceDoc: PropTypes.func.isRequired,
    saveCoroprateDocs: PropTypes.func.isRequired,
    saveCorporateInfoTwo: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors,
});

const routeStepTwo = withRouter(props => <StepTwoCorporate {...props}/>);

export default connect(
    mapStateToProps,
    {
        uploadDocuments,
        saveResidenceDoc,
        saveCoroprateDocs,
        saveCorporateInfoTwo,
    }
)(withStyles(themeStyles)(routeStepTwo));
