import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { orderStatus, marketList } from "../../common/marketList";

import { totalSellOrder, totalBuyOrder } from "../../store/dashboard/actions";
import { isEmpty } from "lodash";
import CountUp from "react-countup";

class Order extends Component {
	state = {
		orders: {
			sell: {
				filters: {
					coin: "BTC",
					market: "",
					status: "Finished",
					orderType: "Market",
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
			buy: {
				filters: {
					coin: "BTC",
					market: "",
					status: "Finished",
					orderType: "Market",
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
		this.getTotalSellOrder("market");
		this.getTotalBuyOrder("market");
	};

	onChangeFilter = (name) => (event) => {
		const filterKey = event.target.name === "market" ? "coin" : "market";
		this.setState(
			(prevState) => ({
				orders: {
					...prevState.orders,
					[name]: {
						...prevState.orders[name],
						filters: {
							...prevState.orders[name]["filters"],
							[event.target.name]: event.target.value,
							[filterKey]: event.target.value
								? ""
								: filterKey === "market"
								? "BTCINR"
								: "BTC",
						},
					},
				},
			}),
			() => {
				if (name === "sell") {
					this.getTotalSellOrder(filterKey);
				} else {
					this.getTotalBuyOrder(filterKey);
				}
			}
		);
	};

	onChangeDateFilter = (name) => (date) => {
		this.setState(
			(prevState) => ({
				orders: {
					...prevState.orders,
					[name]: {
						...prevState.orders[name],
						filters: {
							...this.props.toggleResetFilter(
								prevState.orders[name]["filters"],
								"date"
							),
							date: date,
						},
					},
				},
			}),
			() => {
				if (name === "sell") {
					this.getTotalSellOrder();
				} else {
					this.getTotalBuyOrder();
				}
			}
		);
	};

	selectTime = (name) => (event) => {
		this.setState(
			(prevState) => ({
				orders: {
					...prevState.orders,
					[name]: {
						...prevState.orders[name],
						filters: {
							...this.props.toggleResetFilter(
								prevState.orders[name]["filters"],
								"time"
							),
							time: {
								years: "",
								months: "",
								days: "",
								hours: "",
								last:
									event.target.name ===
									prevState.orders[name]["filters"]["time"][
										"last"
									]
										? ""
										: event.target.name,
								[event.target.name.includes("years")
									? "years"
									: event.target.name]:
									event.target.name !==
									prevState.orders[name]["filters"]["time"][
										"last"
									]
										? event.target.value
										: "",
							},
						},
					},
				},
			}),
			() => {
				if (name === "sell") {
					this.getTotalSellOrder();
				} else {
					this.getTotalBuyOrder();
				}
			}
		);
	};

	getTotalSellOrder = (removePropertyName = null) => {
		let filters = this.props.setDateFilter(this.state.orders.sell.filters);
		if (removePropertyName) {
			const { [removePropertyName]: removedProperty, ...restfilters } =
				filters;
			filters = restfilters;
		}
		this.props.totalSellOrder({
			...this.state.orders.sell,
			filters: JSON.stringify(filters),
		});
	};

	getTotalBuyOrder = (removePropertyName = null) => {
		let filters = this.props.setDateFilter(this.state.orders.buy.filters);
		if (removePropertyName) {
			const { [removePropertyName]: removedProperty, ...restfilters } =
				filters;
			filters = restfilters;
		}
		this.props.totalBuyOrder({
			...this.state.orders.buy,
			filters: JSON.stringify(filters),
		});
	};

	render() {
		const {
			orders: { sell, buy },
		} = this.state;
		const totalBuy = {
				...this.props.orders.totalBuy.crypto,
				...this.props.orders.totalBuy.fiat,
			},
			totalSell = {
				...this.props.orders.totalSell.crypto,
				...this.props.orders.totalSell.fiat,
			},
			{ sellLoader, buyLoader } = this.props.orders;

		return (
			<React.Fragment>
				<Row>
					<Col xl={6}>
						<Card className="card-h-100">
							<CardBody>
								<span className="text-muted mb-3 lh-1 d-block text-truncate">
									Total Sell Order
								</span>

								<div className="d-flex flex-wrap  mb-4">
									{/* <h5 className="card-title me-2">
												Total Fiat Transcation
											</h5> */}
									<div className="">
										<select
											name="market"
											className="form-select form-select-sm"
											value={sell.filters.market}
											onChange={this.onChangeFilter(
												"sell"
											)}
										>
											<option value="">
												Market List
											</option>
											{marketList.map((item) => (
												<option key={item} value={item}>
													{item}
												</option>
											))}
										</select>
									</div>

									{/* <div className="ms-auto mb-2 mb-2 mb-2">
										<select
											name="coin"
											className="form-select form-select-sm"
											value={sell.filters.coin}
											onChange={this.onChangeFilter(
												"sell"
											)}
										>
											<option value="">Account</option>
											{this.props
												.getMarketStockList()
												.map((item) => (
													<option
														key={item}
														value={item}
													>
														{item}
													</option>
												))}
										</select>
									</div> */}
									<div className="ms-auto mb-2 mb-2 mb-2">
										<select
											name="orderType"
											className="form-select form-select-sm"
											value={sell.filters.orderType}
											onChange={this.onChangeFilter(
												"sell"
											)}
										>
											<option disabled value="">
												Order Type
											</option>
											<option value="Market">
												Market
											</option>
											<option value="Limit">Limit</option>
										</select>
									</div>
									<div className="ms-auto mb-2 mb-2 mb-2">
										<Flatpickr
											className="form-control form-control-sm d-block"
											placeholder="Date Range"
											options={{
												mode: "range",
												dateFormat: "m/d/Y",
											}}
											maxDate={new Date()}
											name="date"
											value={sell.filters.date}
											onChange={this.onChangeDateFilter(
												"sell"
											)}
										/>
									</div>
									<div className="ms-auto mb-2 mb-2 mb-2">
										<select
											name="status"
											className="form-select form-select-sm"
											value={sell.filters.status}
											onChange={this.onChangeFilter(
												"sell"
											)}
										>
											<option disabled value="">
												Status
											</option>
											{orderStatus.map((item) => (
												<option key={item} value={item}>
													{item}
												</option>
											))}
										</select>
									</div>
								</div>

								<Row className="align-items-center">
									<Col xs={5}>
										<span className="text-muted mb-3 lh-1 d-block text-truncate"></span>
										<h4 className="mb-3">
											{/* {`${sell.filters.coin} : `} */}
											<span className="counter-value">
												{sellLoader ? (
													<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
												) : (
													<CountUp
														className="account-balance"
														start={0}
														end={this.props.formatValue(
															totalSell[
																!isEmpty(
																	sell.filters
																		.coin
																)
																	? sell
																			.filters
																			.coin
																	: !isEmpty(
																			Object.keys(
																				totalSell
																			)[0]
																	  )
																	? Object.keys(
																			totalSell
																	  )[0]
																	: ""
															]
														)}
														duration={0.75}
														separator=""
														decimals={6}
														suffix={` ${
															!isEmpty(
																sell.filters
																	.coin
															)
																? sell.filters
																		.coin
																: !isEmpty(
																		Object.keys(
																			totalSell
																		)[0]
																  )
																? Object.keys(
																		totalSell
																  )[0]
																: ""
														}`}
													></CountUp>
												)}

												{""}
											</span>
										</h4>

										{!isEmpty(sell.filters.market) && (
											<h4 className="mb-3">
												{/* {`${sell.filters.coin} : `} */}
												<span className="counter-value">
													{sellLoader ? (
														<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
													) : (
														<CountUp
															className="account-balance"
															start={0}
															end={this.props.formatValue(
																totalSell[
																	!isEmpty(
																		sell
																			.filters
																			.coin
																	)
																		? sell
																				.filters
																				.coin
																		: !isEmpty(
																				Object.keys(
																					totalSell
																				)[1]
																		  )
																		? Object.keys(
																				totalSell
																		  )[1]
																		: ""
																]
															)}
															duration={0.75}
															separator=""
															decimals={6}
															suffix={` ${
																!isEmpty(
																	sell.filters
																		.coin
																)
																	? sell
																			.filters
																			.coin
																	: !isEmpty(
																			Object.keys(
																				totalSell
																			)[1]
																	  )
																	? Object.keys(
																			totalSell
																	  )[1]
																	: ""
															}`}
														></CountUp>
													)}

													{""}
												</span>
											</h4>
										)}
									</Col>
									<Col xs={7}>
										<span className="text-muted mb-0 lh-1 d-block text-truncate"></span>

										<div className="ms-auto mb-2 mb-2 mb-2">
											<div className="d-flex flex-wrap gap-2">
												{/* <button
													type="button"
													name="hours"
													value="24"
													className={`btn ${
														sell.filters.time.hours
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"sell"
													)}
												>
													LAST 24H
												</button>
												<button
													name="months"
													value="1"
													type="button"
													className={`btn ${
														sell.filters.time.months
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"sell"
													)}
												>
													1M
												</button> */}
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
																	sell.filters
																		.time
																		.years
																)
																	? parseInt(
																			sell
																				.filters
																				.time
																				.years
																	  ) === year
																		? "btn-soft-primary"
																		: "btn-soft-secondary"
																	: "btn-soft-secondary"
															} btn-sm`}
															onClick={this.selectTime(
																"sell"
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
									Total Buy Order
								</span>
								<div className="d-flex flex-wrap  mb-4">
									<div className="">
										<select
											name="market"
											className="form-select form-select-sm"
											value={buy.filters.market}
											onChange={this.onChangeFilter(
												"buy"
											)}
										>
											<option value="">
												Market List
											</option>
											{marketList.map((item) => (
												<option key={item} value={item}>
													{item}
												</option>
											))}
										</select>
									</div>
									{/* <div className="ms-auto mb-2 mb-2 mb-2">
										<select
											name="coin"
											className="form-select form-select-sm"
											value={buy.filters.coin}
											onChange={this.onChangeFilter(
												"buy"
											)}
										>
											<option disabled value="">
												Account
											</option>
											{this.props
												.getMarketStockList()
												.map((item) => (
													<option
														key={item}
														value={item}
													>
														{item}
													</option>
												))}
										</select>
									</div> */}
									<div className="ms-auto mb-2 mb-2 mb-2">
										<select
											name="orderType"
											className="form-select form-select-sm"
											value={buy.filters.orderType}
											onChange={this.onChangeFilter(
												"buy"
											)}
										>
											<option disabled value="">
												Order Type
											</option>
											<option value="Market">
												Market
											</option>
											<option value="Limit">Limit</option>
										</select>
									</div>
									<div className="ms-auto mb-2 mb-2 mb-2">
										<Flatpickr
											className="form-control form-control-sm d-block"
											placeholder="Date Range"
											options={{
												mode: "range",
												dateFormat: "m/d/Y",
											}}
											maxDate={new Date()}
											name="date"
											value={buy.filters.date}
											onChange={this.onChangeDateFilter(
												"buy"
											)}
										/>
									</div>
									<div className="ms-auto mb-2 mb-2 mb-2">
										<select
											name="status"
											className="form-select form-select-sm"
											value={buy.filters.status}
											onChange={this.onChangeFilter(
												"buy"
											)}
										>
											<option disabled value="">
												Status
											</option>
											{orderStatus.map((item) => (
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
											{/* {" "}
													{`${buy.filters.coin} : `} */}
										</span>
										<h4 className="mb-3">
											<span className="counter-value">
												{buyLoader ? (
													<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
												) : (
													<CountUp
														className="account-balance"
														start={0}
														end={this.props.formatValue(
															totalBuy[
																!isEmpty(
																	buy.filters
																		.coin
																)
																	? buy
																			.filters
																			.coin
																	: !isEmpty(
																			Object.keys(
																				totalBuy
																			)[0]
																	  )
																	? Object.keys(
																			totalBuy
																	  )[0]
																	: ""
															]
														)}
														duration={0.75}
														separator=""
														decimals={6}
														suffix={` ${
															!isEmpty(
																buy.filters.coin
															)
																? buy.filters
																		.coin
																: !isEmpty(
																		Object.keys(
																			totalBuy
																		)[0]
																  )
																? Object.keys(
																		totalBuy
																  )[0]
																: ""
														}`}
													></CountUp>
												)}
												{""}
											</span>
										</h4>
										{!isEmpty(buy.filters.market) && (
											<h4 className="mb-3">
												{/* {`${buy.filters.coin} : `} */}
												<span className="counter-value">
													{buyLoader ? (
														<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
													) : (
														<CountUp
															className="account-balance"
															start={0}
															end={this.props.formatValue(
																totalBuy[
																	!isEmpty(
																		buy
																			.filters
																			.coin
																	)
																		? buy
																				.filters
																				.coin
																		: !isEmpty(
																				Object.keys(
																					totalBuy
																				)[1]
																		  )
																		? Object.keys(
																				totalBuy
																		  )[1]
																		: ""
																]
															)}
															duration={0.75}
															separator=""
															decimals={6}
															suffix={` ${
																!isEmpty(
																	buy.filters
																		.coin
																)
																	? buy
																			.filters
																			.coin
																	: !isEmpty(
																			Object.keys(
																				totalBuy
																			)[1]
																	  )
																	? Object.keys(
																			totalBuy
																	  )[1]
																	: ""
															}`}
														></CountUp>
													)}
													{""}
												</span>
											</h4>
										)}
									</Col>
									<Col xs={7}>
										<div className="ms-auto mb-2 mb-2 mb-2">
											<span className="text-muted mb-0 lh-1 d-block text-truncate"></span>
											<div className="d-flex flex-wrap gap-2">
												{/* <button
													type="button"
													name="hours"
													value="24"
													className={`btn ${
														buy.filters.time.hours
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"buy"
													)}
												>
													LAST 24H
												</button>
												<button
													name="months"
													value="1"
													type="button"
													className={`btn ${
														buy.filters.time.months
															? "btn-soft-primary"
															: "btn-soft-secondary"
													} btn-sm`}
													onClick={this.selectTime(
														"buy"
													)}
												>
													1M
												</button> */}
												{this.props
													.getTotalYear()
													.map((year) => (
														<button
															key={year}
															name={`years-${year}`}
															value={year}
															data-id={
																buy.filters.time
																	.years
															}
															data-json={
																buy.filters.time
																	.years
															}
															type="button"
															className={`btn ${
																!isEmpty(
																	buy.filters
																		.time
																		.years
																)
																	? parseInt(
																			buy
																				.filters
																				.time
																				.years
																	  ) === year
																		? "btn-soft-primary"
																		: "btn-soft-secondary"
																	: "btn-soft-secondary"
															} btn-sm`}
															onClick={this.selectTime(
																"buy"
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

Order.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	orders: state.dashboard.orders,
	markets: state.market.markets,
});

export default connect(mapStateToProp, {
	totalSellOrder,
	totalBuyOrder,
})(withRouter(Order));
