import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import {
	Row,
	Col,
	Card,
	CardBody,
	Input,
	Label,
	Modal,
	Table,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import makeAnimated from "react-select/animated";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	createBankDetail as create,
	updateBankDetail as update,
	removeBankDetail as remove,
	clearResponse,
} from "../../store/admin/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class BankDetail extends Component {
	state = {
		currentAssets: "",
		details: {
			type: "",
			bankName: "",
			accountName: "",
			accountNumber: "",
			accountType: "",
			swiftCode: "",
			ifscCode: "",
			IBAN: "",
		},
		isModalOpen: false,
	};

	componentDidMount = () => {};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.admin.response !== this.props.admin.response) {
			if (!isEmpty(this.props.admin.response.message)) {
				toast.success(this.props.admin.response.message);
				this.props.clearResponse();
				this.refreshTableData();
			}
		}
	};

	columns = () => [
		{
			label: "Type",
			name: "type",
			options: {
				filter: true,
				sort: false,
			},
		},
		{
			label: "Bank Name",
			name: "bankName",
			options: {
				filter: true,
				sort: false,
			},
		},
		{
			label: "Account Name",
			name: "accountName",
			options: {
				filter: true,
				sort: false,
			},
		},
		{
			label: "AccounNumber",
			name: "accountNumber",
			options: {
				filter: true,
				sort: false,
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
					[
						"bank detail update",
						"bank detail delete",
						"bank detail view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"bank detail update",
						"bank detail delete",
						"bank detail view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={[
									"bank detail update",
									"bank detail view",
								]}
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
							<HasAnyPermission
								permission={["bank detail delete"]}
							>
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
			text: "Do you really want to delete?",
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

	toggle = (data) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.toggle(data);
			}
		});
	};

	openModal = (data = null) => {
		const state = {
			isModalOpen: true,
		};
		if (data) state["details"] = data;
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
				active: true,
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdate = hasPermission(
			["bank detail update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAdd = hasPermission(
			["bank detail add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdate && isAdd) return true;
		else if (isUpdate && this.state.details?._id) return true;
		else if (isAdd && isEmpty(this.state.details._id)) return true;
		else return false;
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>BankDetail | Admin</title>
					</MetaTags>
					<div className="container-fluid">
						<Row>
							<Col>
								<Card>
									<CardBody>
										<div className="table-rep-plugin">
											<div className="table-responsive">
												<HasAnyPermission
													permission={[
														"bank detail list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/admin-user/get-bank-details`}
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
																	Bank Detail
																	List &nbsp;
																	<HasAnyPermission
																		permission={[
																			"bank detail add",
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
														rowsPerPage={1000}
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
						<h5 className="modal-title mt-0">Bank Detail</h5>
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
								<label htmlFor="type" className="form-label">
									Type
								</label>
								<AvField
									type="text"
									className="form-control"
									name="type"
									value={this.state.details.type}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="bankName"
									className="form-label"
								>
									Bank Name
								</label>
								<AvField
									type="text"
									className="form-control"
									name="bankName"
									value={this.state.details.bankName}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="accountName"
									className="form-label"
								>
									Account Name
								</label>
								<AvField
									type="text"
									className="form-control"
									name="accountName"
									value={this.state.details.accountName}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="accountNumber"
									className="form-label"
								>
									Account Number
								</label>
								<AvField
									type="text"
									className="form-control"
									name="accountNumber"
									value={this.state.details.accountNumber}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="accountType"
									className="form-label"
								>
									Account Type
								</label>
								<AvField
									type="text"
									className="form-control"
									name="accountType"
									value={this.state.details.accountType}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="swiftCode"
									className="form-label"
								>
									Swift Code
								</label>
								<AvField
									type="text"
									className="form-control"
									name="swiftCode"
									value={this.state.details.swiftCode}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="ifscCode"
									className="form-label"
								>
									IFSC Code
								</label>
								<AvField
									type="text"
									className="form-control"
									name="ifscCode"
									value={this.state.details.ifscCode}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="IBAN" className="form-label">
									IBAN
								</label>
								<AvField
									type="text"
									className="form-control"
									name="IBAN"
									value={this.state.details.IBAN}
									onChange={this.handleChange}
									required
								/>
							</div>
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

BankDetail.propTypes = {
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
})(withRouter(BankDetail));
