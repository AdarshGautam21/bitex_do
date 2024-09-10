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
	agentSetting,
	updateAgentSetting,
	clearResponse,
} from "../../store/setting/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class Refferal extends Component {
	state = {
		details: {
			makerFee: "",
			takerFee: "",
		},
	};

	componentDidMount = () => {
		this.props.agentSetting();
	};

	componentDidUpdate = (prevProps) => {
		if (!isEmpty(this.props.setting.response?.message)) {
			this.props.clearResponse();
			toast.success(this.props.setting.response.message);
			this.props.agentSetting();
		}
		if (
			prevProps.setting.agentSetting !== this.props.setting.agentSetting
		) {
			this.setState((prevState) => ({
				details: this.props.setting.agentSetting,
			}));
		}
	};

	save = () => {
		let { details } = this.state;
		this.props.updateAgentSetting({
			details,
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
						<title>Agent Setting | Admin</title>
					</MetaTags>
					<div className="container-fluid">
						<Card className="border border-primary">
							<CardHeader className="align-items-center d-flex">
								<CardTitle className="mb-0 flex-grow-1">
									<h5 className="my-0 text-primary">
										<i className="mdi mdi-bullseye-arrow me-3"></i>
										Agent Setting
									</h5>
								</CardTitle>
								<div className="flex-shrink-0"></div>
							</CardHeader>
						</Card>
						<Row>
							<Col>
								<Card>
									<CardBody>
										<HasAnyPermission
											permission={["agent setting view"]}
										>
											<AvForm
												className="custom-form mt-4 pt-2"
												onValidSubmit={(e, v) => {
													this.save(e, v);
												}}
												disabled={
													!hasPermission(
														[
															"agent setting update",
														],
														this.props.auth
															.currentUserRolePermissions
													)
												}
											>
												<div className="mb-3">
													<label
														htmlFor="makerFee"
														className="form-label"
													>
														Maker Fee
													</label>
													<AvField
														type="number"
														className="form-control"
														name="makerFee"
														value={
															this.state.details
																.makerFee
														}
														onChange={
															this.handleChange
														}
													/>
												</div>

												<div className="mb-3">
													<label
														htmlFor="takerFee"
														className="form-label"
													>
														Taker Fee
													</label>
													<AvField
														type="number"
														className="form-control"
														name="takerFee"
														value={
															this.state.details
																.takerFee
														}
														onChange={
															this.handleChange
														}
													/>
												</div>

												<HasAnyPermission
													permission={[
														"agent setting update",
													]}
												>
													<div className="mb-3">
														<button
															type="submit"
															className="btn btn-primary"
														>
															Save
														</button>
													</div>
												</HasAnyPermission>
											</AvForm>
										</HasAnyPermission>
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
	agentSetting,
	updateAgentSetting,
	clearResponse,
})(withRouter(Refferal));
