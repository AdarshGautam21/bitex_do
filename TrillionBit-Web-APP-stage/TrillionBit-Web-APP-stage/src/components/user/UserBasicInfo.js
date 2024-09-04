import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import isEmpty from "../../validation/isEmpty";
import { makeStyles } from "@mui/styles";
import {
	Grid,
	Card,
	CardContent,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Typography,
	Button,
	CardHeader,
} from "@mui/material";

import Countries from "../../common/Countries";
import {
	getUserPersonalInfo,
	saveUserPersonalInfo,
	getUserBankInfo,
	saveUserBankInfo,
} from "../../actions/userActions";
import { clearSnackMessages, clearErrors } from "../../actions/messageActions";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";
import SimpleReactValidator from "simple-react-validator";

class UserBasicInfo extends Component {
	state = {
		errors: {},
		snackMessages: {},
		streetAddress: "",
		postalCode: "",
		city: "",
		country: "",
		bankAddress: "",
		beneficiaryName: "",
		bankName: "",
		bankAccount: "",
		bankSwift: "",
		bankIban: "",
		bankCurrency: "AED",
		bankCity: "",
		snackbarMessage: "",
		variant: "success",
	};

	basicInfoValidator = new SimpleReactValidator({
		element: (message) => (
			<div style={{ color: "red" }} className={"error"}>
				{message}
			</div>
		),
	});

	bankInfoValidator = new SimpleReactValidator({
		element: (message) => (
			<div style={{ color: "red" }} className={"error"}>
				{message}
			</div>
		),
	});

	componentDidMount = async () => {
		if (this.props.auth.isAuthenticated) {
			const { user } = this.props.auth;
			const promises = [
				this.props.getUserPersonalInfo(user.id),
				this.props.getUserBankInfo(user.id),
			];
			const res = await Promise.all(promises);

			if (this.props.user?.userBankInfo) {
				const {
					bankAddress,
					bankName,
					bankAccount,
					bankSwift,
					bankIban,
					bankCurrency,
					bankCity,
					beneficiaryName,
				} = this.props.user.userBankInfo;

				this.setState({
					bankAddress: bankAddress ? bankAddress : "",
					bankName: bankName ? bankName : "",
					bankAccount: bankAccount ? bankAccount.trim() : "",
					bankSwift: bankSwift ? bankSwift : "",
					bankIban: bankIban ? bankIban : "",
					bankCurrency: bankCurrency ? bankCurrency : "",
					bankCity: bankCity ? bankCity : "",
					beneficiaryName: beneficiaryName ? beneficiaryName : "",
				});
			}

			if (this.props.user?.userPersonalInfo) {
				const { streetAddress, postalCode, city, country } =
					this.props.user.userPersonalInfo;

				this.setState({
					streetAddress: streetAddress ? streetAddress : "",
					postalCode: postalCode ? postalCode : "",
					city: city ? city : "",
					country: country ? country : "",
				});
			}
		}
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
		if (nextProps.snackMessages) {
			this.setState({ snackMessages: nextProps.snackMessages });
		}
	}

	handleChange = (name) => (event) => {
		if (name === "postalCode") {
			const onlyNumberInput = /^[0/-9]*$/;
			this.setState({
				[name]: onlyNumberInput.test(event.target.value)
					? event.target.value
					: this.state.postalCode,
			});
		} else {
			this.setState({ [name]: event.target.value });
		}
	};

	handleSnackbarClose = () => {
		this.props.clearSnackMessages();
	};

	saveBasicInfo = async (e) => {
		e.preventDefault();
		if (this.basicInfoValidator.allValid()) {
			const { user } = this.props.auth;
			const userPersonalInfoData = {
				userId: user.id,
				streetAddress: this.state.streetAddress,
				postalCode: this.state.postalCode,
				city: this.state.city,
				country: this.state.country,
			};
			// await this.props.saveUserPersonalInfo(userPersonalInfoData);
			// await this.props.getUserPersonalInfo(user.id);
			const promises = [
				this.props.saveUserPersonalInfo(userPersonalInfoData),
				this.props.getUserPersonalInfo(user.id),
			];
			const res = await Promise.all(promises);
			if (this.props.user?.userPersonalInfo) {
				const { streetAddress, postalCode, city, country } =
					this.props.user.userPersonalInfo;

				this.setState({
					streetAddress: streetAddress ? streetAddress : "",
					postalCode: postalCode ? postalCode : "",
					city: city ? city : "",
					country: country ? country : "",
				});
			}
		} else {
			this.basicInfoValidator.showMessages();
			this.forceUpdate();
		}
	};

	saveBankInfo = async (e) => {
		e.preventDefault();
		if (this.bankInfoValidator.allValid()) {
			const { user } = this.props.auth;
			const userBankInfoData = {
				userId: user.id,
				bankAddress: this.state.bankAddress,
				bankName: this.state.bankName,
				bankAccount: this.state.bankAccount,
				bankSwift: this.state.bankSwift,
				bankIban: this.state.bankIban,
				bankCurrency: this.state.bankCurrency,
				bankCity: this.state.bankCity,
				beneficiaryName: this.state.beneficiaryName,
			};

			// await this.props.saveUserBankInfo(userBankInfoData);
			// this.props.getUserBankInfo(user.id);

			const promises = [
				this.props.saveUserBankInfo(userBankInfoData),
				this.props.getUserBankInfo(user.id),
			];
			const res = await Promise.all(promises);
			if (this.props.user?.userBankInfo) {
				const {
					bankAddress,
					bankName,
					bankAccount,
					bankSwift,
					bankIban,
					bankCurrency,
					bankCity,
					beneficiaryName,
				} = this.props.user.userBankInfo;

				this.setState({
					bankAddress: bankAddress ? bankAddress : "",
					bankName: bankName ? bankName : "",
					bankAccount: bankAccount ? bankAccount.trim() : "",
					bankSwift: bankSwift ? bankSwift : "",
					bankIban: bankIban ? bankIban : "",
					bankCurrency: bankCurrency ? bankCurrency : "",
					bankCity: bankCity ? bankCity : "",
					beneficiaryName: beneficiaryName ? beneficiaryName : "",
				});
			}
		} else {
			this.bankInfoValidator.showMessages();
			this.forceUpdate();
		}
	};

	render() {
		const {
			errors,
			streetAddress,
			postalCode,
			city,
			country,
			bankAddress,
			bankName,
			bankAccount,
			bankSwift,
			bankIban,
			bankCity,
			beneficiaryName,
			snackMessages,
			snackbarMessage,
			variant,
		} = this.state;

		const classes = userBaseMaterialStyles;

		let countries = [];

		countries.push(
			<MenuItem key={0} value="">
				<em>None</em>
			</MenuItem>
		);

		Countries.map((countryData) =>
			countries.push(
				<MenuItem key={countryData.id} value={countryData.sortname}>
					{countryData.name}
				</MenuItem>
			)
		);

		return (
			<div className="bodyInformation">
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
						variant={
							!isEmpty(snackMessages)
								? snackMessages.variant
								: variant
						}
						message={
							!isEmpty(snackMessages)
								? snackMessages.message
								: snackbarMessage
						}
					/>
				</Snackbar>
				<Typography component="h2" className="bodyTitle">
					Basic Information
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<form noValidate onSubmit={this.saveBasicInfo}>
							<Card className="dataListCard sameHeight">
								<CardHeader title="Personal Information" />

								<CardContent className="padBoxBody">
									<TextField
										error={
											errors.streetAddress ? true : false
										}
										variant="filled"
										label="Address *"
										type="text"
										name="streetAddress"
										className={classes.textField}
										fullWidth={true}
										value={streetAddress}
										onChange={this.handleChange(
											"streetAddress"
										)}
										onBlur={this.basicInfoValidator.hideMessageFor(
											"firstname"
										)}
										margin="normal"
										helperText={
											errors?.streetAddress
												? errors.streetAddress
												: this.basicInfoValidator.message(
														"firstname",
														this.state
															.streetAddress,
														"required"
												  )
										}
									/>
									<TextField
										error={errors.postalCode ? true : false}
										variant="filled"
										label="Zipcode *"
										type="text"
										name="postalCode"
										className={classes.textField}
										fullWidth={true}
										value={postalCode || ""}
										onChange={this.handleChange(
											"postalCode"
										)}
										onBlur={this.basicInfoValidator.hideMessageFor(
											"postalCode"
										)}
										margin="normal"
										helperText={
											errors?.postalCode
												? errors.postalCode
												: this.basicInfoValidator.message(
														"postalCode",
														this.state.postalCode,
														"required"
												  )
										}
										InputLabelProps={{
											shrink: true,
										}}
									/>
									<div className="form-group three_Group">
										<TextField
											error={errors.city ? true : false}
											variant="filled"
											label="City *"
											type="text"
											name="city"
											className="form-control"
											fullWidth={true}
											value={city}
											onChange={this.handleChange("city")}
											onBlur={this.basicInfoValidator.hideMessageFor(
												"city"
											)}
											margin="normal"
											helperText={
												errors?.city
													? errors.city
													: this.basicInfoValidator.message(
															"city",
															this.state.city,
															"required"
													  )
											}
										/>
										<FormControl
											style={
												userPersonalInfoStyle.formControl
											}
											error={
												errors.country ? true : false
											}
											variant="filled"
										>
											<InputLabel htmlFor="country-helper">
												Country
											</InputLabel>
											<Select
												autoWidth={true}
												value={country}
												disabled={
													isEmpty(country)
														? false
														: true
												}
												inputProps={{
													name: "country",
												}}
												onChange={this.handleChange(
													"country"
												)}
											>
												{countries}
											</Select>
											<FormHelperText>
												{errors.country}
											</FormHelperText>
										</FormControl>
									</div>
									<Button
										variant="contained"
										color="primary"
										className={classes.button}
										type="submit"
									>
										Save
									</Button>
								</CardContent>
							</Card>
						</form>
					</Grid>
					<Grid item xs={12} md={6}>
						<form noValidate onSubmit={this.saveBankInfo}>
							<Card className="dataListCard sameHeight">
								<CardHeader title="Bank Information" />
								<CardContent className="padBoxBody">
									<div className="form-group two_Group">
										<TextField
											error={
												errors.bankAddress
													? true
													: false
											}
											variant="filled"
											label="Bank Beneficiary Name *"
											type="text"
											name="beneficiaryName"
											className="form-control"
											fullWidth={true}
											value={beneficiaryName}
											onChange={this.handleChange(
												"beneficiaryName"
											)}
											onBlur={this.bankInfoValidator.hideMessageFor(
												"beneficiaryName"
											)}
											margin="normal"
											helperText={
												errors?.beneficiaryName
													? errors.beneficiaryName
													: this.bankInfoValidator.message(
															"beneficiaryName",
															this.state
																.beneficiaryName,
															"required"
													  )
											}
										/>
										<TextField
											error={
												errors.bankAddress
													? true
													: false
											}
											variant="filled"
											label="Bank Address *"
											type="text"
											name="bankAddress"
											className="form-control"
											fullWidth={true}
											value={bankAddress}
											onChange={this.handleChange(
												"bankAddress"
											)}
											onBlur={this.bankInfoValidator.hideMessageFor(
												"bankAddress"
											)}
											margin="normal"
											helperText={
												errors?.bankAddress
													? errors.bankAddress
													: this.bankInfoValidator.message(
															"bankAddress",
															this.state
																.bankAddress,
															"required"
													  )
											}
										/>
									</div>
									<div className="form-group two_Group">
										<TextField
											error={
												errors.bankName ? true : false
											}
											variant="filled"
											label="Bank Name *"
											type="text"
											name="bankName"
											className="form-control"
											fullWidth={true}
											value={bankName}
											onChange={this.handleChange(
												"bankName"
											)}
											onBlur={this.bankInfoValidator.hideMessageFor(
												"bankName"
											)}
											margin="normal"
											helperText={
												errors?.bankName
													? errors.bankName
													: this.bankInfoValidator.message(
															"bankName",
															this.state.bankName,
															"required|alpha_space"
													  )
											}
										/>
										<TextField
											error={
												errors.bankAccount
													? true
													: false
											}
											variant="filled"
											label="Bank Account Number *"
											type="number"
											name="bankAccount"
											className="form-control"
											fullWidth={true}
											value={bankAccount}
											onChange={this.handleChange(
												"bankAccount"
											)}
											onBlur={this.bankInfoValidator.hideMessageFor(
												"bankAccount"
											)}
											margin="normal"
											helperText={
												errors?.bankAccount
													? errors.bankAccount
													: this.bankInfoValidator.message(
															"bankAccount",
															this.state
																.bankAccount,
															"required|number"
													  )
											}
										/>
									</div>
									<div className="form-group two_Group">
										<TextField
											error={
												errors.bankIban ? true : false
											}
											variant="filled"
											label={
												country === "IN"
													? "IFSC"
													: "IBAN"
											}
											type="text"
											name="bankIban"
											className="form-control"
											fullWidth={true}
											value={bankIban}
											onChange={this.handleChange(
												"bankIban"
											)}
											margin="normal"
											helperText={errors.bankIban}
										/>
										<TextField
											error={
												errors.bankSwift ? true : false
											}
											variant="filled"
											label="Bank Swift"
											type="text"
											name="bankSwift"
											className="form-control"
											fullWidth={true}
											value={bankSwift}
											onChange={this.handleChange(
												"bankSwift"
											)}
											margin="normal"
											helperText={errors.bankSwift}
										/>
									</div>
									<div className="form-group two_Group">
										<TextField
											error={
												errors.bankCurrency
													? true
													: false
											}
											variant="filled"
											label="Bank Currency"
											type="text"
											name="bankCurrency"
											className="form-control"
											fullWidth={true}
											// value={bankCurrency}
											value={
												country === "IN"
													? "INR"
													: country === "AE"
													? "AED"
													: "USDT"
											}
											onChange={this.handleChange(
												"bankCurrency"
											)}
											margin="normal"
											disabled={true}
											helperText={errors.bankCurrency}
										/>
										<TextField
											error={
												errors.bankCity ? true : false
											}
											variant="filled"
											label="Bank City *"
											type="text"
											name="bankCity"
											className="form-control"
											fullWidth={true}
											value={bankCity}
											onChange={this.handleChange(
												"bankCity"
											)}
											onBlur={this.bankInfoValidator.hideMessageFor(
												"bankCity"
											)}
											margin="normal"
											helperText={
												errors?.bankCity
													? errors.bankCity
													: this.bankInfoValidator.message(
															"bankCity",
															this.state.bankCity,
															"required|alpha"
													  )
											}
										/>
									</div>
									<Button
										variant="contained"
										color="primary"
										type="submit"
										className={classes.button}
										// onClick={this.saveBankInfo}
									>
										Save
									</Button>
								</CardContent>
							</Card>
						</form>
					</Grid>
				</Grid>
			</div>
		);
	}
}

const userBaseMaterialStyles = makeStyles((theme) => ({
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	link: {
		margin: theme.spacing(1),
	},
}));

const userPersonalInfoStyle = {
	formControl: {
		marginLeft: 10,
		marginTop: 16,
		marginBottom: 8,
		width: "100%",
	},
};

UserBasicInfo.propTypes = {
	auth: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	getUserPersonalInfo: PropTypes.func.isRequired,
	saveUserPersonalInfo: PropTypes.func.isRequired,
	getUserBankInfo: PropTypes.func.isRequired,
	saveUserBankInfo: PropTypes.func.isRequired,
	snackMessages: PropTypes.object.isRequired,
	clearSnackMessages: PropTypes.func.isRequired,
	clearErrors: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	user: state.user,
	errors: state.errors,
	snackMessages: state.snackMessages,
});

const routerUserBasicInfo = withRouter((props) => <UserBasicInfo {...props} />);

export default connect(mapStateToProp, {
	getUserPersonalInfo,
	saveUserPersonalInfo,
	getUserBankInfo,
	saveUserBankInfo,
	clearSnackMessages,
	clearErrors,
})(routerUserBasicInfo);
