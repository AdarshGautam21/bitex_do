import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";

import {
	getReferral,
	getReferralTree,
	getReferralRedeem,
	getReferralEarned,
} from "../../actions/referralActions";

import {
	Card,
	CardContent,
	CardHeader,
	Container,
	Grid,
	Typography,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	LinearProgress,
	Fade,
} from "@mui/material";

import isEmpty from "../../validation/isEmpty";
import tableIcons from "../../common/tableIcons";

import MaterialTable from "material-table";

import { withStyles } from "@mui/styles/";
import themeStyles from "../../assets/themeStyles";

import Snackbar from "@mui/material/Snackbar";
import SnackbarMessage from "../../common/SnackbarMessage";
import fileImg from "../../assets/img/file.webp";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import Tooltip from "@mui/material/Tooltip";

const moment = require("moment");

class UserReferral extends Component {
	state = {
		copy: false,
		snackMessages: {},
		snackbarMessage: "",
		variant: "info",
		redeemDialog: false,
		ajaxProcess: false,
		currentUserFiatWallet: {
			coin: "",
		},
	};

	componentDidMount = async () => {
		await this.props.getReferral(this.props.auth.user.id);
		await this.props.getReferralTree(this.props.auth.user.id);
		await this.props.getReferralEarned(this.props.auth.user.id);
		if (!isEmpty(this.props.trading.activeMarket)) {
			const userActiveFiatAsset = this.props.wallet.userAssets.find(
				(item) => item.coin === this.props.trading.activeMarket.money
			);
			if (!isEmpty(userActiveFiatAsset)) {
				this.setState({
					currentUserFiatWallet: userActiveFiatAsset,
				});
			} else {
				if (this.props.auth.isAuthenticated) {
					this.setState({
						currentUserFiatWallet: { coin: "USDT" },
					});
				}
			}
		}
	};

	componentWillReceiveProps = async (nextProps) => {
		for (let x in nextProps.wallet.userAssets) {
			if (nextProps.wallet.userAssets[x].fiat) {
				if (nextProps.wallet.userAssets[x].active) {
					await this.setState({
						currentUserFiatWallet: nextProps.wallet.userAssets[x],
					});
				}
			}
		}
	};

	handleTooltipClose = () => {
		this.setState({
			copy: false,
		});
	};

	handleSnackbarClose = () => {
		this.setState({
			snackMessages: {},
			snackbarMessage: "",
			varient: "success",
			snackMessageView: false,
		});
	};

	handleTooltipOpen = () => {
		console.log("copy");
		this.setState({
			copy: true,
			snackMessages: {
				variant: "success",
				message: "Copied to clipboard.",
			},
		});
	};

	redeemReferral = () => {
		const { referral } = this.props;

		if (parseFloat(referral.referralDetails.totalReferralEarnings) === 0) {
			this.setState({
				snackMessages: {
					variant: "error",
					message: "Not enough balance to redeem",
				},
			});
		} else {
			this.setState({ redeemDialog: true });
		}
	};

	processRedeem = async () => {
		this.setState({ ajaxProcess: true });
		const { user } = this.props.auth;
		await this.props.getReferralRedeem(user.id);
		await this.props.getReferral(user.id);
		await this.props.getReferralTree(user.id);
		this.setState({ ajaxProcess: false, redeemDialog: false });
	};

	render() {
		const { referral } = this.props;
		const {
			snackMessages,
			snackbarMessage,
			variant,
			redeemDialog,
			ajaxProcess,
			currentUserFiatWallet,
		} = this.state;

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
				<Dialog
					open={redeemDialog}
					aria-labelledby="form-dialog-title"
					fullWidth={true}
				>
					<DialogTitle id="form-dialog-title">
						Redeem Referral Earning
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Your referral earning{" "}
							{referral.referralDetails.totalReferralEarnings}{" "}
							{currentUserFiatWallet.coin} will be added to your{" "}
							{currentUserFiatWallet.coin} wallet.
						</DialogContentText>
						<Fade
							in={ajaxProcess}
							style={{
								transitionDelay: ajaxProcess ? "100ms" : "0ms",
							}}
							unmountOnExit
						>
							<LinearProgress />
						</Fade>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() =>
								this.setState({ redeemDialog: false })
							}
							color="primary"
							disabled={ajaxProcess}
						>
							Close
						</Button>
						<Button
							onClick={this.processRedeem}
							color="primary"
							disabled={ajaxProcess}
						>
							Redeem
						</Button>
					</DialogActions>
				</Dialog>
				<Container className="mainbody transactions">
					<Grid container spacing={3}>
						<Grid item xs={12} md={3} />
						<Grid item xs={12} md={6} className="bodyInformation">
							<Card className="dataListCard referralBox">
								<CardHeader title="Referral" />
								<CardContent className="referralBoxInfo">
									<Typography variant="h3" className="title">
										Referral Link
									</Typography>

									<CopyToClipboard
										text={
											window.location.origin +
											"/register/" +
											referral.referralDetails
												.referralCode
										}
										onCopy={() => this.handleTooltipOpen()}
									>
										<Typography
											variant="h5"
											className="subTitle"
										>
											{window.location.origin +
												"/register/" +
												referral.referralDetails
													.referralCode}
										</Typography>
									</CopyToClipboard>

									<Typography variant="h3" className="title">
										Referral Code
									</Typography>

									<CopyToClipboard
										text={
											referral.referralDetails
												.referralCode
										}
										onCopy={() => this.handleTooltipOpen()}
									>
										<Typography
											variant="h5"
											className="subTitle"
										>
											{`${referral.referralDetails.referralCode}  `}
											<Tooltip title="Copy">
												<FilterNoneIcon />
											</Tooltip>
										</Typography>
									</CopyToClipboard>

									<Grid
										container
										spacing={3}
										style={{ paddingTop: 10 }}
									>
										<Grid
											item
											xs={6}
											md={6}
											style={{
												textAlign: "center",
												borderRight: "1px solid #ccc",
											}}
										>
											<Typography
												variant="h6"
												component="h2"
											>
												{
													referral.referralDetails
														.totalReferralEarnings
												}{" "}
												{currentUserFiatWallet.coin}
											</Typography>
											<Typography
												variant="h5"
												className="subTitle"
											>
												Balance
											</Typography>
										</Grid>
										<Grid
											item
											xs={6}
											md={6}
											style={{ textAlign: "center" }}
										>
											<Typography
												variant="h6"
												component="h2"
											>
												{
													referral.referralDetails
														.numberOfReferrals
												}
											</Typography>
											<Typography
												variant="h5"
												className="subTitle"
											>
												Registered Referral
											</Typography>
										</Grid>
									</Grid>

									<Grid container spacing={3}>
										<Grid
											item
											xs={6}
											md={6}
											style={{ textAlign: "center" }}
										>
											<CopyToClipboard
												text={
													window.location.origin +
													"/register/" +
													referral.referralDetails
														.referralCode
												}
												onCopy={() =>
													this.handleTooltipOpen()
												}
											>
												<Button
													variant="contained"
													color="primary"
												>
													Copy Link
												</Button>
											</CopyToClipboard>
										</Grid>
										<Grid
											item
											xs={6}
											md={6}
											style={{ textAlign: "center" }}
										>
											<Button
												variant="contained"
												color="primary"
												onClick={this.redeemReferral}
											>
												Redeem
											</Button>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={12} md={12}>
							{!isEmpty(referral.referralTrees) ? (
								<MaterialTable
									className="dataListCard"
									title="Referral Tree"
									options={{
										actionsColumnIndex: -1,
										search: false,
										pageSizeOptions: [],
									}}
									icons={tableIcons}
									columns={[
										{ title: "User", field: "user" },
										{ title: "Email", field: "userEmail" },
										{
											title: "Total Earning (AED)",
											field: "referredUserEarning",
										},
										{
											title: "Date",
											field: "date",
											render: (rowData) =>
												moment(rowData.date).format(
													"LLL"
												),
										},
									]}
									data={
										referral.referralTrees
											? referral.referralTrees
											: []
									}
								/>
							) : (
								<Card className="dataListCard">
									<CardHeader title="Referral Tree" />
									<CardContent>
										<div className="noDatafound">
											<img
												src={fileImg}
												alt="Remy Sharp"
											/>
											<Typography
												variant="h6"
												component="h2"
											>
												No Record Found
											</Typography>
										</div>
									</CardContent>
								</Card>
							)}
						</Grid>

						<Grid item xs={12} md={12}>
							{!isEmpty(referral.referralEarned) ? (
								<MaterialTable
									className="dataListCard"
									title="Earning Detail"
									options={{
										actionsColumnIndex: -1,
										search: false,
										pageSizeOptions: [],
									}}
									icons={tableIcons}
									columns={[
										{
											title: "Referral Name",
											field: "ReferralUser.firstname",
											render: (rowData) =>
												`${rowData.ReferralUser.firstname} ${rowData.ReferralUser.lastname}`,
										},
										{
											title: "Referral Email",
											field: "ReferralUser.email",
										},
										{ title: "Coin", field: "coin" },
										{
											title: "Earning Amount",
											field: "earnedAmount",
										},
										{
											title: "Date",
											field: "createdAt",
											render: (rowData) =>
												moment(
													rowData.createdAt
												).format("LLL"),
										},
									]}
									data={
										referral.referralEarned
											? referral.referralEarned
											: []
									}
								/>
							) : (
								<Card className="dataListCard">
									<CardHeader title="Earning Detail" />
									<CardContent>
										<div className="noDatafound">
											<img
												src={fileImg}
												alt="Remy Sharp"
											/>
											<Typography
												variant="h6"
												component="h2"
											>
												No Record Found
											</Typography>
										</div>
									</CardContent>
								</Card>
							)}
						</Grid>
					</Grid>
				</Container>
			</React.Fragment>
		);
	}
}

UserReferral.propTypes = {
	auth: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	wallet: PropTypes.object.isRequired,
	trading: PropTypes.object.isRequired,
	referral: PropTypes.object.isRequired,
	getReferral: PropTypes.func.isRequired,
	getReferralTree: PropTypes.func.isRequired,
	getReferralRedeem: PropTypes.func.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	user: state.user,
	wallet: state.wallet,
	trading: state.trading,
	referral: state.referral,
	snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
	getReferral,
	getReferralTree,
	getReferralRedeem,
	getReferralEarned,
})(withStyles(themeStyles)(UserReferral));
