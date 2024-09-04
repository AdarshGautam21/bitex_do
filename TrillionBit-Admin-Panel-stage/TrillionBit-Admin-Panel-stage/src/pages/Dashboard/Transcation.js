import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Countries from "../../common/Countries";

import {
	coinList,
	paymentTypeList,
	accountList,
	TransactionStatus,
	orderStatus,
} from "../../common/marketList";

import {
	totalFiatTranscation,
	totalCryptoTranscation,
} from "../../store/dashboard/actions";
import moment from "moment";
import { isEmpty } from "lodash";
import CountUp from "react-countup";

class Transcation extends Component {
	state = {
		transcations: {
			cryptoParams: {
				filters: {
					coin: "BTC",
					status: "Finished",
					type: "Deposit",
					date: [null, null],
					time: {
						years: "",
						months: "",
						days: "",
						hours: "",
						last: "",
					},
				},
				search: "",
				sort: "",
				sortColumn: "",
			},
			fiatParams: {
				filters: {
					coin: "INR",
					status: "Finished",
					type: "Deposit",
					date: [null, null],
					time: {
						years: "",
						months: "",
						days: "",
						hours: "",
						last: "",
					},
				},
				search: "",
				sort: "",
				sortColumn: "",
			},
		},
	};

	componentDidMount = () => {
		this.getTotalFiatTranscation();
		this.getTotalCryptoTranscation();
	};

	onChangeFilter = (name) => (event) => {
		this.setState(
			(prevState) => ({
				transcations: {
					...prevState.transcations,
					[name]: {
						...prevState.transcations[name],
						filters: {
							...prevState.transcations[name]["filters"],
							[event.target.name]: event.target.value,
						},
					},
				},
			}),
			() => {
				if (name === "fiatParams") {
					this.getTotalFiatTranscation();
				} else {
					this.getTotalCryptoTranscation();
				}
			}
		);
	};

	onChangeDateFilter = (name) => (date) => {
		this.setState(
			(prevState) => ({
				transcations: {
					...prevState.transcations,
					[name]: {
						...prevState.transcations[name],
						filters: {
							...this.props.toggleResetFilter(
								prevState.transcations[name]["filters"],
								"date"
							),
							date: date,
						},
					},
				},
			}),
			() => {
				if (name === "fiatParams") {
					this.getTotalFiatTranscation();
				} else {
					this.getTotalCryptoTranscation();
				}
			}
		);
	};

	getTotalFiatTranscation = () => {
		const filters = this.props.setDateFilter(
			this.state.transcations.fiatParams.filters
		);
		this.props.totalFiatTranscation({
			...this.state.transcations.fiatParams,
			filters: JSON.stringify(filters),
		});
	};

	getTotalCryptoTranscation = () => {
		const filters = this.props.setDateFilter(
			this.state.transcations.cryptoParams.filters
		);
		this.props.totalCryptoTranscation({
			...this.state.transcations.cryptoParams,
			filters: JSON.stringify(filters),
		});
	};

	selectTime = (name) => (event) => {
		this.setState(
			(prevState) => ({
				transcations: {
					...prevState.transcations,
					[name]: {
						...prevState.transcations[name],
						filters: {
							...this.props.toggleResetFilter(
								prevState.transcations[name]["filters"],
								"time"
							),
							time: {
								years: "",
								months: "",
								days: "",
								hours: "",
								last:
									event.target.name ===
									prevState.transcations[name]["filters"][
										"time"
									]["last"]
										? ""
										: event.target.name,
								[event.target.name.includes("years")
									? "years"
									: event.target.name]:
									event.target.name !==
									prevState.transcations[name]["filters"][
										"time"
									]["last"]
										? event.target.value
										: "",
							},
						},
					},
				},
			}),
			() => {
				if (name === "fiatParams") {
					this.getTotalFiatTranscation();
				} else {
					this.getTotalCryptoTranscation();
				}
			}
		);
	};

	render() {
		const {
			transcations: { cryptoParams, fiatParams },
		} = this.state;
		const {
			totalFiatTranscation,
			totalCryptoTranscation,
			fiatLoader,
			cryptoLoader,
		} = this.props.transcations;

		return (
			<React.Fragment>
				<Row>
					<Col xl={6}>
						<Card className="card-h-100">
							<CardBody>
								<span className="text-muted mb-3 lh-1 d-block text-truncate">
									Total Fiat Transcation
								</span>
								<div className="d-flex flex-wrap  mb-4">
									{/* <h5 className="card-title me-2">
												Total Fiat Transcation
											</h5> */}
									<div className="">
										<select
											name="coin"
											className="form-select form-select-sm"
											value={fiatParams.filters.coin}
											onChange={this.onChangeFilter(
												"fiatParams"
											)}
										>
											<option disabled value="">
												Currency
											</option>
											<option value="INR">INR</option>
											<option value="AED">AED</option>
											<option value="USD">USD</option>
										</select>
									</div>
									<div className="ms-auto mb-2">
										<select
											name="type"
											className="form-select form-select-sm"
											value={fiatParams.filters.type}
											onChange={this.onChangeFilter(
												"fiatParams"
											)}
										>
											<option disabled value="">
												Type
											</option>
											<option value="Deposit">
												Deposit
											</option>
											<option value="Withdrawal">
												Withdrawal
											</option>
										</select>
									</div>
									<div className="ms-auto mb-2">
										<Flatpickr
											className="form-control form-control-sm d-block"
											placeholder="Date Range"
											options={{
												mode: "range",
												dateFormat: "m/d/Y",
											}}
											maxDate={new Date()}
											name="date"
											value={fiatParams.filters.date}
											onChange={this.onChangeDateFilter(
												"fiatParams"
											)}
										/>
									</div>
									<div className="ms-auto mb-2">
										<select
											name="status"
											className="form-select form-select-sm"
											value={fiatParams.filters.status}
											onChange={this.onChangeFilter(
												"fiatParams"
											)}
										>
											<option disabled value="">
												Status
											</option>
											{TransactionStatus.map((item) => (
												<option key={item} value={item}>
													{item}
												</option>
											))}
										</select>
									</div>
								</div>

								<Row className="align-items-center">
									<Col xs={5}>
										<span className="text-muted mb-3 lh-1 d-block text-truncate">
											{""}
										</span>
										<h4 className="mb-3">
											<span className="counter-value">
												{fiatLoader ? (
													<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
												) : (
													<CountUp
														className="account-balance"
														start={0}
														end={this.props.formatValue(
															totalFiatTranscation[
																fiatParams
																	.filters
																	.coin
															]
														)}
														duration={0.75}
														separator=""
														decimals={2}
														suffix={` ${fiatParams.filters.coin}`}
													></CountUp>
												)}

												{""}
											</span>
										</h4>
									</Col>
									<Col xs={7}>
										<span className="text-muted mb-0 lh-1 d-block text-truncate"></span>

										<div className="ms-auto mb-2">
											<div className="d-flex flex-wrap gap-2">
												<button
													type="button"
													name="hours"
													value="24"
													className={`btn ${
														fiatParams.filters.time
															.hours
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"fiatParams"
													)}
												>
													LAST 24H
												</button>
												<button
													name="months"
													value="1"
													type="button"
													className={`btn ${
														fiatParams.filters.time
															.months
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"fiatParams"
													)}
												>
													1M
												</button>
												{this.props
													.getTotalYear()
													.map((year) => (
														<button
															key={year}
															name={`years-${year}`}
															value={year}
															type="button"
															className={`btn ${
																!isEmpty(
																	fiatParams
																		.filters
																		.time
																		.years
																)
																	? parseInt(
																			fiatParams
																				.filters
																				.time
																				.years
																	  ) === year
																		? "btn-soft-primary"
																		: "btn-soft-secondary"
																	: "btn-soft-secondary"
															} btn-sm`}
															onClick={this.selectTime(
																"fiatParams"
															)}
														>
															{`${year}`}
														</button>
													))}
											</div>
										</div>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>

					<Col xl={6}>
						<Card className="card-h-100">
							<CardBody>
								<span className="text-muted mb-3 lh-1 d-block text-truncate">
									Total Crypto Transcation
								</span>

								<div className="d-flex flex-wrap  mb-4">
									{/* <h5 className="card-title me-2">
												Total Fiat Transcation
											</h5> */}
									<div className="">
										<select
											name="coin"
											className="form-select form-select-sm"
											value={cryptoParams.filters.coin}
											onChange={this.onChangeFilter(
												"cryptoParams"
											)}
										>
											<option disabled value="">
												Account
											</option>
											{accountList.map((item) => (
												<option key={item} value={item}>
													{item}
												</option>
											))}
										</select>
									</div>
									<div className="ms-auto mb-2">
										<select
											name="type"
											className="form-select form-select-sm"
											value={cryptoParams.filters.type}
											onChange={this.onChangeFilter(
												"cryptoParams"
											)}
										>
											<option disabled value="">
												Type
											</option>
											<option value="Deposit">
												Deposit
											</option>
											<option value="Withdrawal">
												Withdrawal
											</option>
										</select>
									</div>
									<div className="ms-auto mb-2">
										<Flatpickr
											className="form-control form-control-sm d-block"
											placeholder="Date Range"
											options={{
												mode: "range",
												dateFormat: "m/d/Y",
											}}
											maxDate={new Date()}
											name="date"
											value={cryptoParams.filters.date}
											onChange={this.onChangeDateFilter(
												"cryptoParams"
											)}
										/>
									</div>
									<div className="ms-auto mb-2">
										<select
											name="status"
											className="form-select form-select-sm"
											value={cryptoParams.filters.status}
											onChange={this.onChangeFilter(
												"cryptoParams"
											)}
										>
											<option disabled value="">
												Status
											</option>
											{TransactionStatus.map((item) => (
												<option key={item} value={item}>
													{item}
												</option>
											))}
										</select>
									</div>
								</div>

								<Row className="align-items-center">
									<Col xs={5}>
										<span className="text-muted mb-3 lh-1 d-block text-truncate">
											{""}
										</span>
										<h4 className="mb-3">
											<span className="counter-value">
												{cryptoLoader ? (
													<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
												) : (
													<CountUp
														className="account-balance"
														start={0}
														end={this.props.formatValue(
															totalCryptoTranscation[
																cryptoParams
																	.filters
																	.coin
															],
															4
														)}
														duration={0.75}
														separator=""
														decimals={4}
														suffix={` ${cryptoParams.filters.coin}`}
													></CountUp>
												)}

												{""}
											</span>
										</h4>
									</Col>
									<Col xs={7}>
										<span className="text-muted mb-0 lh-1 d-block text-truncate"></span>

										<div className="ms-auto mb-2">
											<div className="d-flex flex-wrap gap-2">
												<button
													type="button"
													name="hours"
													value="24"
													className={`btn ${
														cryptoParams.filters
															.time.hours
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"cryptoParams"
													)}
												>
													LAST 24H
												</button>
												<button
													name="months"
													value="1"
													type="button"
													className={`btn ${
														cryptoParams.filters
															.time.months
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"cryptoParams"
													)}
												>
													1M
												</button>
												{this.props
													.getTotalYear()
													.map((year) => (
														<button
															key={year}
															name={`years-${year}`}
															value={year}
															type="button"
															className={`btn ${
																!isEmpty(
																	cryptoParams
																		.filters
																		.time
																		.years
																)
																	? parseInt(
																			cryptoParams
																				.filters
																				.time
																				.years
																	  ) === year
																		? "btn-soft-primary"
																		: "btn-soft-secondary"
																	: "btn-soft-secondary"
															} btn-sm`}
															onClick={this.selectTime(
																"cryptoParams"
															)}
														>
															{`${year}`}
														</button>
													))}
											</div>
										</div>
									</Col>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}

Transcation.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	transcations: state.dashboard.transcations,
	markets: state.market.markets,
});

export default connect(mapStateToProp, {
	totalCryptoTranscation,
	totalFiatTranscation,
})(withRouter(Transcation));
