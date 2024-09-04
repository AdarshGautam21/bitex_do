import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import {
	Row,
	Col,
	Card,
	CardBody,
	Modal,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Table,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
	referralSetting,
	updateReferralSetting,
	clearResponse,
} from "../../store/setting/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class Refferal extends Component {
	state = {
		details: {
			commissionPercentage: "",
			earningPeriod: "",
			btxCommissionPercentage: "",
		},
	};

	componentDidMount = () => {
		this.props.referralSetting();
	};

	componentDidUpdate = (prevProps) => {
		if (!isEmpty(this.props.setting.response?.message)) {
			this.props.clearResponse();
			toast.success(this.props.setting.response.message);
			this.props.referralSetting();
		}
		if (
			prevProps.setting.referralSetting !==
			this.props.setting.referralSetting
		) {
			this.setState((prevState) => ({
				details: this.props.setting.referralSetting,
			}));
		}
	};

	save = () => {
		let { details } = this.state;
		this.props.updateReferralSetting({
			...details,
			commission: details.commissionPercentage,
			referralPeriod: details.earningPeriod,
		});
	};

	handleChange = (event) => {
		this.setState((prevState) => ({
			details: {
				...prevState.details,
				[event.target.name]: event.target.value,
			},
		}));
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Refferal | Admin</title>
					</MetaTags>
					<div className="container-fluid">
						<Card className="border border-primary">
							<CardHeader className="align-items-center d-flex">
								<CardTitle className="mb-0 flex-grow-1">
									<h5 className="my-0 text-primary">
										<i className="mdi mdi-bullseye-arrow me-3"></i>
										Refferal Setting
									</h5>
								</CardTitle>
								<div className="flex-shrink-0"></div>
							</CardHeader>
						</Card>
						<Row>
							<Col>
								<Card>
									<CardBody>
										<AvForm
											className="custom-form mt-4 pt-2"
											onValidSubmit={(e, v) => {
												this.save(e, v);
											}}
											disabled={
												!hasPermission(
													[
														"refferal setting view",
														"refferal setting add",
													],
													this.props.auth
														.currentUserRolePermissions
												)
											}
										>
											<div className="mb-3">
												<label
													htmlFor="commissionPercentage"
													className="form-label"
												>
													commission (%)
												</label>
												<AvField
													type="number"
													className="form-control"
													name="commissionPercentage"
													value={
														this.state.details
															.commissionPercentage
													}
													onChange={this.handleChange}
													required
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="earningPeriod"
													className="form-label"
												>
													Referral Period
												</label>
												<AvField
													type="number"
													className="form-control"
													name="earningPeriod"
													value={
														this.state.details
															.earningPeriod
													}
													onChange={this.handleChange}
													required
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="btxCommissionPercentage"
													className="form-label"
												>
													BTX Commission (%)
												</label>
												<AvField
													type="number"
													className="form-control"
													name="btxCommissionPercentage"
													value={
														this.state.details
															.btxCommissionPercentage
													}
													onChange={this.handleChange}
													required
												/>
											</div>
											<div className="mb-3">
												<HasAnyPermission
													permission={[
														"refferal setting update",
														"refferal setting add",
													]}
												>
													<button
														type="submit"
														className="btn btn-primary"
													>
														Save
													</button>
												</HasAnyPermission>
											</div>
										</AvForm>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

Refferal.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	setting: state.setting,
});

export default connect(mapStateToProp, {
	referralSetting,
	updateReferralSetting,
	clearResponse,
})(withRouter(Refferal));
