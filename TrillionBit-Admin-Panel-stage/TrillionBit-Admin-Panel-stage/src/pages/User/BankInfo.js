import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	bankInfo,
	clearResponse,
	updateBankInfo,
} from "../../store/user/actions";
import { toast } from "react-toastify";
import {
	Card,
	CardBody,
	CardTitle,
	CardHeader,
	Col,
	Row,
	Label,
	Input,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import isEmpty from "../../validation/isEmpty";

class PersonalInfo extends Component {
	state = {
		details: {
			_id: "",
			userId: "",
			beneficiaryName: "",
			bankName: "",
			bankAccount: "",
			bankSwift: "",
			bankAddress: "",
			bankCity: "",
			bankCurrency: "",
			bankIban: "",
		},
	};

	componentDidMount = () => {
		this.props.bankInfo(this.props.userId);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (
			prevProps.userDetails.bankInfo !== this.props.userDetails.bankInfo
		) {
			this.setState({
				details: {
					...this.state.details,
					...this.props.userDetails.bankInfo,
				},
			});
		}
		if (this.props.response?.message) {
			toast.success(this.props.response.message);
			this.setState({
				details: {
					...this.state.details,
					userId: "",
				},
			});
			this.props.clearResponse();
			this.props.bankInfo(this.props.userId);
		}
		if (prevProps.userId !== this.props.userId) {
			this.props.bankInfo(this.props.userId);
		}
	};

	save = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update user?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.updateBankInfo({
					...this.state.details,
					userId: !isEmpty(this.state.details.userId)
						? this.state.details.userId
						: this.props.userId,
				});
			}
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
				<Card>
					<CardHeader>
						<CardTitle className="mb-0">Bank Information</CardTitle>
					</CardHeader>
					<CardBody>
						<div>
							<div className="pb-3">
								<Row>
									<Col lg={6}>
										<div className="mt-4 mt-lg-0">
											<AvForm
												disabled={
													!hasPermission(
														["user update"],
														this.props.auth
															.currentUserRolePermissions
													)
												}
												className="custom-form mt-4 pt-2"
												onValidSubmit={(e, v) => {
													this.save(e, v);
												}}
											>
												<Row className="mb-4">
													<Label
														htmlFor="beneficiaryName"
														className="col-sm-3 col-form-label"
													>
														Beneficiary Name
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="beneficiaryName"
															value={
																this.state
																	.details
																	.beneficiaryName
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>
												<Row className="mb-4">
													<Label
														htmlFor="bankName"
														className="col-sm-3 col-form-label"
													>
														Bank Name
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="bankName"
															value={
																this.state
																	.details
																	.bankName
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>
												<Row className="mb-4">
													<Label
														htmlFor="bankAccount"
														className="col-sm-3 col-form-label"
													>
														Bank Account
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="bankAccount"
															value={
																this.state
																	.details
																	.bankAccount
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>
												<Row className="mb-4">
													<Label
														htmlFor="bankIban"
														className="col-sm-3 col-form-label"
													>
														Bank Iban
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="bankIban"
															value={
																this.state
																	.details
																	.bankIban
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>

												<Row className="mb-4">
													<Label
														htmlFor="bankSwift"
														className="col-sm-3 col-form-label"
													>
														Bank Swift
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="bankSwift"
															value={
																this.state
																	.details
																	.bankSwift
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>

												<Row className="mb-4">
													<Label
														htmlFor="bankAddress"
														className="col-sm-3 col-form-label"
													>
														Bank Address
													</Label>
													<Col sm={9}>
														<AvField
															type="textarea"
															className="form-control"
															name="bankAddress"
															value={
																this.state
																	.details
																	.bankAddress
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>

												<Row className="mb-4">
													<Label
														htmlFor="bankCity"
														className="col-sm-3 col-form-label"
													>
														Bank City
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="bankCity"
															value={
																this.state
																	.details
																	.bankCity
															}
															onChange={
																this
																	.handleChange
															}
														/>
													</Col>
												</Row>
												<HasAnyPermission
													permission={["user update"]}
												>
													<Row className="justify-content-end">
														<Col sm={9}>
															<div>
																<button
																	type="submit"
																	className="btn btn-primary w-md"
																>
																	Update
																</button>
															</div>
														</Col>
													</Row>
												</HasAnyPermission>
											</AvForm>
										</div>
									</Col>
								</Row>
							</div>
						</div>
					</CardBody>
				</Card>
			</React.Fragment>
		);
	}
}

PersonalInfo.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	userDetails: state.user.userDetails,
	response: state.user.response,
});

export default connect(mapStateToProp, {
	bankInfo,
	updateBankInfo,
	clearResponse,
})(withRouter(PersonalInfo));
