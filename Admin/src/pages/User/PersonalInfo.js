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
	basicInfo,
	personalInfo,
	updatePersonalInfo,
	clearResponse,
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
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

class PersonalInfo extends Component {
	state = {
		details: {
			_id: "",
			userId: "",
			firstname: "",
			lastname: "",
			email: "",
			phone: "",
			dateOfBirth: "",
			city: "",
			country: "",
			postalCode: "",
			streetAddress: "",
		},
	};

	componentDidMount = () => {
		this.props.basicInfo(this.props.userId);
		this.props.personalInfo(this.props.userId);
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (
			prevProps.userDetails.basicInfo !== this.props.userDetails.basicInfo
		) {
			this.setState({
				details: {
					...this.state.details,
					...this.props.userDetails.basicInfo,
					dateOfBirth: this.props.userDetails.basicInfo?.dateOfBirth
						? this.formatToDate(
								this.props.userDetails.basicInfo.dateOfBirth
						  )
						: "",
				},
			});
		}

		if (
			prevProps.userDetails.personalInfo !==
			this.props.userDetails.personalInfo
		) {
			const { _id, ...rest } = this.props.userDetails.personalInfo;
			this.setState({
				details: {
					...this.state.details,
					...rest,
				},
			});
		}
		if (!isEmpty(this.props.response?.message)) {
			toast.success(this.props.response.message);
			this.props.clearResponse();
			this.props.basicInfo(this.props.userId);
			this.props.personalInfo(this.props.userId);
		}

		if (prevProps.userId !== this.props.userId) {
			this.props.basicInfo(this.props.userId);
			this.props.personalInfo(this.props.userId);
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
				this.props.updatePersonalInfo({
					...this.state.details,
					dateOfBirth: this.formatDateToString(
						this.state.details.dateOfBirth?.[0]
					),
				});
			}
		});
	};

	formatToDate = (date) => {
		try {
			return moment(date, moment.defaultFormat).toDate();
		} catch (err) {
			return date;
		}
	};

	formatDateToString = (date) => {
		try {
			return moment(date).format("YYYY-MM-DD");
		} catch (err) {
			return date;
		}
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
						<CardTitle className="mb-0">
							Personal Information
						</CardTitle>
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
														htmlFor="firstname"
														className="col-sm-3 col-form-label"
													>
														First name
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="firstname"
															value={
																this.state
																	.details
																	.firstname
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
														htmlFor="lastname"
														className="col-sm-3 col-form-label"
													>
														Last name
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="lastname"
															value={
																this.state
																	.details
																	.lastname
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
														htmlFor="email"
														className="col-sm-3 col-form-label"
													>
														Email
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="email"
															value={
																this.state
																	.details
																	.email
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
														htmlFor="phone"
														className="col-sm-3 col-form-label"
													>
														Phone
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="phone"
															value={
																this.state
																	.details
																	.phone
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
														htmlFor="dateOfBirth"
														className="col-sm-3 col-form-label"
													>
														Date of Birth
													</Label>
													<Col sm={9}>
														<Flatpickr
															className="form-control d-block"
															placeholder="dd M,yyyy"
															options={{
																altInput: true,
																altFormat:
																	"F j, Y",
																dateFormat:
																	"Y-m-d",
															}}
															name="dateOfBirth"
															value={
																this.state
																	.details
																	.dateOfBirth ||
																null
															}
															onChange={(
																date
															) => {
																this.handleChange(
																	{
																		target: {
																			name: "dateOfBirth",
																			value: date,
																		},
																	}
																);
															}}
														/>
													</Col>
												</Row>

												<Row className="mb-4">
													<Label
														htmlFor="city"
														className="col-sm-3 col-form-label"
													>
														city
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="city"
															value={
																this.state
																	.details
																	.city
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
														htmlFor="streetAddress"
														className="col-sm-3 col-form-label"
													>
														Address
													</Label>
													<Col sm={9}>
														<AvField
															type="textarea"
															className="form-control"
															name="streetAddress"
															value={
																this.state
																	.details
																	.streetAddress
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
														htmlFor="postalCode"
														className="col-sm-3 col-form-label"
													>
														postalCode
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="postalCode"
															value={
																this.state
																	.details
																	.postalCode
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
														htmlFor="country"
														className="col-sm-3 col-form-label"
													>
														country
													</Label>
													<Col sm={9}>
														<AvField
															type="text"
															className="form-control"
															name="country"
															readOnly={true}
															value={
																this.state
																	.details
																	.country
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
	basicInfo,
	personalInfo,
	updatePersonalInfo,
	clearResponse,
})(withRouter(PersonalInfo));
