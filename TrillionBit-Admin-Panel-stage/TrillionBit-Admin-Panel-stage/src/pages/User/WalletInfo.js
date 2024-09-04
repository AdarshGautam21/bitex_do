import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import HasAnyPermission from "../../common/Permission";
import PropTypes from "prop-types";
import {
	walletInfo,
	totalFiatDeposit,
	totalFiatWithdrawal,
	totalCryptoDeposit,
	totalCryptoWithdrawal,
	clearResponse,
} from "../../store/user/actions";
import { TransactionStatus } from "../../common/marketList";
import { getActive as getActiveAssets } from "../../store/assets/actions";
import { toast } from "react-toastify";
import {
	Card,
	CardBody,
	CardTitle,
	CardHeader,
	CardContent,
	Col,
	Row,
	Label,
	Input,
} from "reactstrap";
import isEmpty from "../../validation/isEmpty";
class WalletInfo extends Component {
	state = {
		details: {},
		status: {
			fiat: {
				deposit: "Finished",
				withdrawal: "Finished",
			},
			crypto: {
				deposit: "Finished",
				withdrawal: "Finished",
			},
		},
	};

	componentDidMount = () => {
		this.props.getActiveAssets();
		this.props.walletInfo(this.props.userId);
		this.props.totalFiatDeposit({
			id: this.props.userId,
			status: this.state.status.fiat.deposit,
		});
		this.props.totalFiatWithdrawal({
			id: this.props.userId,
			status: this.state.status.fiat.withdrawal,
		});

		this.props.totalCryptoDeposit({
			id: this.props.userId,
			status: this.state.status.crypto.deposit,
		});
		this.props.totalCryptoWithdrawal({
			id: this.props.userId,
			status: this.state.status.crypto.withdrawal,
		});
	};

	totalTranscations = (type, name, status) => {
		if (type === "fiat")
			if (name === "deposit")
				this.props.totalFiatDeposit({
					id: this.props.userId,
					status: status,
				});
			else
				this.props.totalFiatWithdrawal({
					id: this.props.userId,
					status: status,
				});
		else if (type === "crypto")
			if (name === "deposit")
				this.props.totalCryptoDeposit({
					id: this.props.userId,
					status: status,
				});
			else
				this.props.totalCryptoWithdrawal({
					id: this.props.userId,
					status: status,
				});
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (!isEmpty(this.props.response?.message) || prevProps.userId !== this.props.userId) {
			toast.success(this.props.response.message);
			this.props.clearResponse();
			this.props.walletInfo(this.props.userId);
			this.props.totalFiatDeposit({
				id: this.props.userId,
				status: this.state.status.fiat.deposit,
			});
			this.props.totalFiatWithdrawal({
				id: this.props.userId,
				status: this.state.status.fiat.withdrawal,
			});

			this.props.totalCryptoDeposit({
				id: this.props.userId,
				status: this.state.status.crypto.deposit,
			});
			this.props.totalCryptoWithdrawal({
				id: this.props.userId,
				status: this.state.status.crypto.withdrawal,
			});
		}
	};

	handleStatusChange = (type) => (event) => {
		this.setState((prevState) => ({
			status: {
				...prevState.status,
				[type]: {
					...prevState.status[type],
					[event.target.name]: event.target.value,
				},
			},
		}));
		this.totalTranscations(type, event.target.name, event.target.value);
	};

	renderFiatCoinBalance = (data, type) => {
		return Object.entries(data).map(([key, value]) => (
			<Col lg={12}>
				<div className="input-group mb-3">
					<label className="input-group-text">{key}</label>
					<input
						type="text"
						className="form-control"
						placeholder={value}
						value={value}
						readOnly
					/>
					<label className="input-group-text">{type}</label>
				</div>
			</Col>
		));
	};

	renderCyptoCoinBalance = (data) => {
		return this.props.activeAssetCoins?.map((item) => (
			<Col lg={4}>
				<div className="input-group mb-3">
					<label className="input-group-text">{item}</label>
					<input
						type="text"
						className="form-control"
						placeholder={data?.[item] ? data[item] : "0.00"}
						value={data?.[item] ? data[item] : "0.00"}
						readOnly
					/>
					{/* <label className="input-group-text">{type}</label> */}
				</div>
			</Col>
		));
	};

	render() {
		const {
			walletInfo,
			totalFiatDeposit,
			totalFiatWithdrawal,
			totalCryptoDeposit,
			totalCryptoWithdrawal,
		} = this.props.userDetails;
		return (
			<React.Fragment>
				<HasAnyPermission permission={["user wallet details view"]}>
					{!isEmpty(walletInfo) && (
						<div>
							<Card>
								<CardHeader>
									<CardTitle className="mb-0">
										Wallet Information
									</CardTitle>
								</CardHeader>
								<CardBody>
									<div>
										<div className="pb-3">
											<Row>
												{walletInfo.map(
													(userWallet) => (
														<Col
															key={
																userWallet.coin
															}
															lg={3}
														>
															<div className="input-group mb-3">
																<label className="input-group-text">
																	{
																		userWallet.coin
																	}
																</label>
																<input
																	type="text"
																	className="form-control"
																	placeholder={
																		userWallet.walletAmount
																	}
																	value={
																		userWallet.walletAmount
																	}
																	readOnly
																/>
															</div>
														</Col>
													)
												)}
											</Row>
										</div>
									</div>
								</CardBody>
							</Card>

							<Row>
								<Col lg={12}>
									<Card>
										<CardHeader className="align-items-center d-flex">
											<CardTitle className="mb-0 flex-grow-1">
												Total Crypto Deposit
											</CardTitle>
											{/* 
								<div className="mb-0 flex-grow-1">
									Total Crypto Deposit
								</div> */}
											<div className="flex-shrink-0">
												<select
													value={
														this.state.status.crypto
															.deposit || ""
													}
													onChange={this.handleStatusChange(
														"crypto"
													)}
													className="form-control"
													name="deposit"
												>
													<option disabled value="">
														Status
													</option>
													{TransactionStatus.map(
														(item) => (
															<option
																key={item}
																value={item}
															>
																{item}
															</option>
														)
													)}
												</select>
											</div>
										</CardHeader>
										<CardBody>
											<div>
												<div className="pb-3">
													<Row>
														{this.renderCyptoCoinBalance(
															totalCryptoDeposit
														)}
													</Row>
												</div>
											</div>
										</CardBody>
									</Card>
								</Col>
							</Row>
							<Row>
								<Col lg={12}>
									<Card>
										<CardHeader className="align-items-center d-flex">
											<CardTitle className="mb-0 flex-grow-1">
												Total Crypto Withdrawal
											</CardTitle>
											{/* 
								<div className="mb-0 flex-grow-1">
									Total Crypto Deposit
								</div> */}
											<div className="flex-shrink-0">
												<select
													value={
														this.state.status.crypto
															.withdrawal || ""
													}
													onChange={this.handleStatusChange(
														"crypto"
													)}
													className="form-control"
													name="withdrawal"
												>
													<option disabled value="">
														Status
													</option>
													{TransactionStatus.map(
														(item) => (
															<option
																key={item}
																value={item}
															>
																{item}
															</option>
														)
													)}
												</select>
											</div>
										</CardHeader>
										<CardBody>
											<div>
												<div className="pb-3">
													<Row>
														{this.renderCyptoCoinBalance(
															totalCryptoWithdrawal
														)}
													</Row>
												</div>
											</div>
										</CardBody>
									</Card>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<Card>
										<CardHeader className="align-items-center d-flex">
											<CardTitle className="mb-0 flex-grow-1">
												Total Fiat Deposit
											</CardTitle>
											{/* 
								<div className="mb-0 flex-grow-1">
									Total Crypto Deposit
								</div> */}
											<div className="flex-shrink-0">
												<select
													value={
														this.state.status.fiat
															.deposit || ""
													}
													onChange={this.handleStatusChange(
														"fiat"
													)}
													className="form-control"
													name="deposit"
												>
													<option disabled value="">
														Status
													</option>
													{TransactionStatus.map(
														(item) => (
															<option
																key={item}
																value={item}
															>
																{item}
															</option>
														)
													)}
												</select>
											</div>
										</CardHeader>
										<CardBody>
											<div>
												<div className="pb-3">
													<Row>
														{this.renderFiatCoinBalance(
															totalFiatDeposit,
															"Deposit"
														)}
													</Row>
												</div>
											</div>
										</CardBody>
									</Card>
								</Col>
								<Col lg={6}>
									<Card>
										<CardHeader className="align-items-center d-flex">
											<CardTitle className="mb-0 flex-grow-1">
												Total Fiat Withdrawal
											</CardTitle>
											<div className="flex-shrink-0">
												<select
													value={
														this.state.status.fiat
															.withdrawal || ""
													}
													onChange={this.handleStatusChange(
														"fiat"
													)}
													className="form-control"
													name="withdrawal"
												>
													<option disabled value="">
														Status
													</option>
													{TransactionStatus.map(
														(item) => (
															<option
																key={item}
																value={item}
															>
																{item}
															</option>
														)
													)}
												</select>
											</div>
										</CardHeader>

										<CardBody>
											<div>
												<div className="pb-3">
													<Row>
														{this.renderFiatCoinBalance(
															totalFiatWithdrawal,
															"Withdrawal"
														)}
													</Row>
												</div>
											</div>
										</CardBody>
									</Card>
								</Col>
							</Row>
						</div>
					)}
				</HasAnyPermission>
			</React.Fragment>
		);
	}
}

WalletInfo.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	userDetails: state.user.userDetails,
	activeAssetCoins: state.assets.activeAssetCoins,
	response: state.user.response,
});

export default connect(mapStateToProp, {
	getActiveAssets,
	walletInfo,
	totalFiatDeposit,
	totalFiatWithdrawal,
	totalCryptoDeposit,
	totalCryptoWithdrawal,
	clearResponse,
})(withRouter(WalletInfo));
