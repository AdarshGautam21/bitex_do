import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { withStyles } from '@mui/styles';

import isEmpty from '../../../validation/isEmpty';

import {
    saveCorporateInfoTwo,
    saveCoroprateDocs,
    finishIdentityForm,
} from '../../../actions/userActions';

import {
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import themeStyles from '../../../assets/themeStyles';

import uploadIcon from '../../../assets/img/uploadIcon.webp';

import apiUrl from '../../config';


class StepThreeCorporate extends Component {
    state = {
        userCurrentDocument: {
            message: 'Drag & Drop files or Click here to upload file'
        },
        dropzonClass: 'dropzon-input',
        getVerified: false,
    }

    selectedFile = (selectedFiles, docType) => {
        if(isEmpty(selectedFiles)){
            let errorObj = {};
            let userCurrentObj = this.state.userCurrentDocument;
            if(docType === 'kyc_declaration_file') {
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

            userCurrentObj.file = droppedFile;
            this.setState({
                userCurrentDocument: userCurrentObj,
                dropzonClass: 'dropzon-input'
            });

            userCurrentObj.userIdentityId = user.userIdentity._id;
            userCurrentObj.file = droppedFile;
            userCurrentObj.docType = docType;
            userCurrentObj.docName = 'Kyc Declaration';
            this.setState({
                certificateOfInsuranceDocument: userCurrentObj,
                dropzonClass: 'dropzon-input'
            });

            this.props.saveCoroprateDocs(userCurrentObj);
        }
    }

    nextSteps = () => {
        this.setState({ getVerified: true });
        this.props.nextStep('finalCorporateStep');
    }

    downloadKycFile = () => {
		fetch(`${apiUrl}/api/guest/get_key_doc/Bitex_KYC_Form.pdf`)
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'Bitex_KYC_Form.pdf';
					a.click();
				});
		});
    }

    navRedirect = async () => {
        await this.props.finishIdentityForm(this.props.auth.user.id);
        this.props.history.push('/dashboard');
    }

    render() {
        const {getVerified} = this.state;
        const {classes} = this.props;

        let currentStep = <Card className="dataListCard">
                            <CardContent className="identityBoxInfo corporateUploadBox text-center">
                                <Typography variant="h3" className="title">
                                    KYC Declaration
                                </Typography>

                                <Typography variant="h5" className="subTitle">
                                    Download  Sign and Upload the KYC Declaration Doc
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12}>
                                        {/* <a href={`${apiUrl}/api/guest/get_image/kyc_declaration.pdf`} rel="noopener noreferrer" target="_blank" download={true}> */}
                                            <Button
                                                color="primary"
                                                onClick={() => this.downloadKycFile()}
                                            >Download KYC Declaration Form</Button>
                                        {/* </a> */}
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12}>
                                        <div className="uploadBox">

                                            <div className={(isEmpty(this.state.userCurrentDocument.file)) ? "sideBox" : "sideBox"}>
                                                <Typography variant="h5" className="subTitle">
                                                    KYC Declaration
                                                </Typography>
                                                <div>
                                                    <Dropzone
                                                        onDrop={(selectedFile) => this.selectedFile(selectedFile, 'kyc_declaration_file')}
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
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={12} xs={12} className="text-center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={
                                                (!isEmpty(this.state.userCurrentDocument.file)) ? false : true
                                            }
                                            onClick={this.nextSteps}
                                        >
                                            Get verified
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>;

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

        return <React.Fragment>
                {currentStep}
            </React.Fragment>
    }
}

StepThreeCorporate.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    nextStep: PropTypes.func,
    saveCorporateInfoTwo: PropTypes.func.isRequired,
    saveCoroprateDocs: PropTypes.func.isRequired,
    finishIdentityForm: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors,
});

const routeStepTwo = withRouter(props => <StepThreeCorporate {...props}/>);

export default connect(
    mapStateToProps,
    {
        saveCorporateInfoTwo,
        saveCoroprateDocs,
        finishIdentityForm,
    }
)(withStyles(themeStyles)(routeStepTwo));
