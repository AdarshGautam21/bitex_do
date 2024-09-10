import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Modal } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withRouter, Link } from "react-router-dom";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	create,
	update,
	remove,
	clearResponse,
	getRoles,
} from "../../store/admin/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
class Admin extends Component {
	state = {
		currentAssets: "",
		details: {
			name: "",
			email: "",
			roles: [],
			role: "",
			password: "",
			confirmPassword: "",
		},
		isModalOpen: false,
	};

	componentDidMount = () => {
		this.props.getRoles();
	};

	columns = () => [
		{
			label: "Name",
			name: "name",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Email",
			name: "email",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Role",
			name: "roles",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (roles) => {
					let data = "";
					if (roles) {
						data = roles.map((role) => role.name);
					}
					return data.toString();
				},
			},
		},
		{
			label: "Actions",
			name: "action",
			options: {
				filter: false,
				sort: false,
				empty: true,
				download: false,
				display: hasPermission(
					["admin update", "admin delete", "admin view"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["admin update", "admin delete", "admin view"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={["admin update", "admin view"]}
							>
								<button
									onClick={(e) => this.openModal(data)}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission permission={["admin delete"]}>
								<button
									onClick={(e) => this.remove(data._id)}
									type="button"
									className="btn btn-soft-danger waves-effect waves-light"
								>
									<i className="bx bx-trash font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
						</div>
					);
				},
			},
		},
	];

	resultFormatter = (result) => {
		return result.data.map((item) => {
			return {
				...item,
				action: item,
			};
		});
	};

	save = (event, data) => {
		let { details } = this.state;
		details["roles"] = [details.role];
		if (details?._id) {
			this.props.update(details);
		} else {
			this.props.create(details);
		}
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete Admins?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.remove(id);
			}
		});
	};

	openModal = (data = null) => {
		const state = {
			isModalOpen: true,
		};
		if (data) state["details"] = { ...data, role: data.roles?.[0]._id };
		else this.clearForm();
		this.setState(state);
	};

	closeModal = () => {
		this.setState({
			isModalOpen: false,
		});
		this.clearForm();
	};

	clearForm = () => {
		this.setState({
			details: {
				name: "",
				email: "",
				roles: [],
				role: "",
				password: "",
				confirmPassword: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	validateConfirmPassword = (value, ctx) => {
		return ctx.password === value ? true : "Need to match password.!";
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["admin update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["admin add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.admin.response?.message)) {
			toast.success(this.props.admin.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.refreshTableData();
				},
			});
		}
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Admin and Role | Admin</title>
					</MetaTags>
					<div className="container-fluid">
						<Row>
							<Col>
								<Card>
									<CardBody>
										<div className="table-rep-plugin">
											<div className="table-responsive">
												<HasAnyPermission
													permission={["admin list"]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/admin-user/get-admins`}
														columns={this.columns()}
														resultFormatter={
															this.resultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														disableFilterIcon={true}
														disableSearchIcon={true}
														origin={
															<div className="row">
																<div className="col-auto h4">
																	Admin List
																	&nbsp;
																	<HasAnyPermission
																		permission={[
																			"admin add",
																		]}
																	>
																		<button
																			onClick={(
																				e
																			) =>
																				this.openModal()
																			}
																			type="button"
																			className="btn btn-soft-primary waves-effect waves-light"
																		>
																			<i className="bx bx-plus-medical font-size-16 align-middle"></i>
																		</button>
																	</HasAnyPermission>
																</div>
															</div>
														}
														rowsPerPage={100}
													/>
												</HasAnyPermission>
											</div>
										</div>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
				</div>

				<Modal
					size="lg"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Admin</h5>
						<button
							type="button"
							onClick={() => this.closeModal()}
							className="close"
							data-dismiss="modal"
							aria-label="Close"
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>

					<div className="modal-body">
						<AvForm
							className="custom-form mt-4 pt-2"
							onValidSubmit={(e, v) => {
								this.save(e, v);
							}}
							disabled={!this.couldHaveAddUpdatePermission()}
						>
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<AvField
									type="text"
									className="form-control"
									name="name"
									value={this.state.details.name}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<AvField
									type="email"
									className="form-control"
									name="email"
									value={this.state.details.email}
									onChange={this.handleChange}
									required
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="role"
									className="form-label font-size-13 text-muted"
								>
									Role
								</label>
								<select
									value={this.state.details.role}
									onChange={this.handleChange}
									className="form-control"
									name="role"
									required
								>
									<option disabled value="">
										Role
									</option>
									{this.props.admin.roles?.map((item) => (
										<option key={item._id} value={item._id}>
											{item.name}
										</option>
									))}
								</select>
							</div>
							{!this.state.details?._id && (
								<>
									<div className="mb-3">
										<label
											htmlFor="password"
											className="form-label"
										>
											Password
										</label>
										<AvField
											type="password"
											className="form-control"
											name="password"
											value={this.state.details.password}
											onChange={this.handleChange}
											required
										/>
									</div>
									<div className="mb-3">
										<label
											htmlFor="confirmPassword"
											className="form-label"
										>
											confirmPassword
										</label>
										<AvField
											type="password"
											className="form-control"
											name="confirmPassword"
											value={
												this.state.details
													.confirmPassword
											}
											onChange={this.handleChange}
											validate={{
												myValidation:
													this
														.validateConfirmPassword,
											}}
											required
										/>
									</div>
								</>
							)}
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => this.closeModal()}
								>
									Close
								</button>
								{this.couldHaveAddUpdatePermission() && (
									<button
										type="submit"
										className="btn btn-primary"
									>
										Save
									</button>
								)}
							</div>
						</AvForm>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

Admin.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	admin: state.admin,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	clearResponse,
	getRoles,
})(withRouter(Admin));
