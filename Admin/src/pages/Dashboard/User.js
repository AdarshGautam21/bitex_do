import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Countries from "../../common/Countries";
import { totalUser } from "../../store/dashboard/actions";
import CountUp from "react-countup";
import { isEmpty } from "lodash";

class User extends Component {
	state = {
		users: {
			filters: {
				country: "",
				type: "",
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
	};

	componentDidMount = () => {
		this.getUser();
	};

	onChangeFilter = (event) => {
		this.setState(
			(prevState) => ({
				users: {
					...prevState.users,
					filters: {
						...prevState.users.filters,
						[event.target.name]: event.target.value,
					},
				},
			}),
			() => {
				this.getUser();
			}
		);
	};

	onChangeDateFilter = (date) => {
		this.setState(
			(prevState) => ({
				users: {
					...prevState.users,
					filters: {
						...this.props.toggleResetFilter(
							prevState.users["filters"],
							"date"
						),
						date: date,
					},
				},
			}),
			() => {
				this.getUser();
			}
		);
	};

	selectTime = (event) => {
		this.setState(
			(prevState) => ({
				users: {
					...prevState.users,
					filters: {
						...this.props.toggleResetFilter(
							prevState.users["filters"],
							"time"
						),
						time: {
							years: "",
							months: "",
							days: "",
							hours: "",
							last:
								event.target.name ===
								prevState.users["filters"]["time"]["last"]
									? ""
									: event.target.name,
							[event.target.name.includes("years")
								? "years"
								: event.target.name]:
								event.target.name !==
								prevState.users["filters"]["time"]["last"]
									? event.target.value
									: "",
						},
					},
				},
			}),
			() => {
				this.getUser();
			}
		);
	};

	getUser = () => {
		const filters = this.props.setDateFilter(this.state.users.filters);
		this.props.totalUser({
			...this.state.users,
			filters: JSON.stringify(filters),
		});
	};

	render() {
		const { users } = this.state;
		const { totalUser, userLoader } = this.props.users;
		return (
			<React.Fragment>
				<Col xl={6}>
					<Card className="card-h-100">
						<CardBody>
							<span className="text-muted mb-3 lh-1 d-block text-truncate">
								Total User
							</span>

							<div className="d-flex flex-wrap  mb-4">
								{/* <h5 className="card-title me-2">
										Total Fiat 
									</h5> */}
								<div className="">
									<select
										name="country"
										className="form-select form-select-sm"
										value={users.filters.country}
										onChange={this.onChangeFilter}
									>
										<option disabled value="Country">
											Country
										</option>
										<option value="">All</option>
										{Countries.map((item) => (
											<option
												key={item.sortname}
												value={item.sortname}
											>
												{item.name}
											</option>
										))}
									</select>
								</div>
								<div className="ms-auto mb-2">
									<select
										name="type"
										className="form-select form-select-sm"
										value={users.filters.type}
										onChange={this.onChangeFilter}
									>
										<option disabled value="Type">
											Type
										</option>
										<option value="">All</option>
										{[
											"Verified",
											"Suspended",
											"First Deposit",
											"Undeposited",
											"Document Submitted",
											"UnVerified",
										].map((item) => (
											<option key={item} value={item}>
												{item}
											</option>
										))}
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
										value={users.filters.date}
										onChange={this.onChangeDateFilter}
									/>
								</div>
							</div>
							<Row className="align-items-center">
								<Col xs={5}>
									<span className="text-muted mb-3 lh-1 d-block text-truncate"></span>
									<h4 className="mb-3">
										<span className="counter-value">
											{userLoader ? (
												<i className="bx bx-loader bx-spin font-size-20 align-middle me-2"></i>
											) : (
												<CountUp
													className="account-balance"
													start={0}
													end={this.props.formatValue(
														totalUser.total +
															(users.filters
																.type ===
															"Verified"
																? 25400
																: 40300)
													)}
													duration={0.75}
													separator=""
													suffix={``}
													// decimals={0}
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
											{/* <button
												type="button"
												name="hours"
												value="24"
												className={`btn ${
													users.filters.time.hours
														? "btn-soft-primary"
														: "btn-soft-secondary"
												} btn-sm`}
												onClick={this.selectTime}
											>
												LAST 24H
											</button>
											<button
												name="months"
												value="1"
												type="button"
												className={`btn ${
													users.filters.time.months
														? "btn-soft-primary"
														: "btn-soft-secondary"
												} btn-sm`}
												onClick={this.selectTime}
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
																users.filters
																	.time.years
															)
																? parseInt(
																		users
																			.filters
																			.time
																			.years
																  ) === year
																	? "btn-soft-primary"
																	: "btn-soft-secondary"
																: "btn-soft-secondary"
														} btn-sm`}
														onClick={
															this.selectTime
														}
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
			</React.Fragment>
		);
	}
}

User.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	users: state.dashboard.users,
});

export default connect(mapStateToProp, {
	totalUser,
})(withRouter(User));
