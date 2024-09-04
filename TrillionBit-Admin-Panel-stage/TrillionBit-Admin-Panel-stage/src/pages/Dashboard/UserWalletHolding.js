import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { totalUserWalletHolding } from "../../store/dashboard/actions";
import CountUp from "react-countup";
import { isEmpty } from "lodash";
import { accountList } from "../../common/marketList";

class UserWalletHolding extends Component {
	state = {
		users: {
			filters: {
				coin: "BTC",
				date: [null, null],
			},
			search: "",
			sort: "",
			sortColumn: "",
		},
	};

	componentDidMount = () => {
		this.getUserWalletHolding();
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
				this.getUserWalletHolding();
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
				this.getUserWalletHolding();
			}
		);
	};

	getUserWalletHolding = () => {
		// const filters = this.props.setDateFilter(this.state.users.filters);
		this.props.totalUserWalletHolding({
			...this.state.users,
			filters: JSON.stringify(this.state.users.filters),
		});
	};

	render() {
		const { users } = this.state;
		const { totalUserWalletHolding, userLoader } =
			this.props.userWalletHolding;
		return (
			<React.Fragment>
				<Col xl={6}>
					<Card className="card-h-100">
						<CardBody>
							<span className="text-muted mb-3 lh-1 d-block text-truncate">
								Total User Holding Wallet Balance
							</span>

							<div className="mb-4">
								<div className="ms-auto mb-2 mb-2 mb-2">
									<select
										name="coin"
										className="form-select form-select-sm"
										value={users.filters.coin}
										onChange={this.onChangeFilter}
									>
										<option value="">Account</option>
										{["INR", "AED", ...accountList].map(
											(item) => (
												<option key={item} value={item}>
													{item}
												</option>
											)
										)}
									</select>
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
														totalUserWalletHolding.total
													)}
													duration={0.75}
													separator=""
													suffix={` ${users.filters.coin}`}
													decimals={6}
												></CountUp>
											)}

											{""}
										</span>
									</h4>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</React.Fragment>
		);
	}
}

UserWalletHolding.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	userWalletHolding: state.dashboard.userWalletHolding,
});

export default connect(mapStateToProp, {
	totalUserWalletHolding,
})(withRouter(UserWalletHolding));
