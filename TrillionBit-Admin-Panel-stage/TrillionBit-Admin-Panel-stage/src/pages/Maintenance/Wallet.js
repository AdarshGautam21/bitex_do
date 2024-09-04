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
	createWalletMaintenance as create,
	updateWalletMaintenance as update,
	removeWalletMaintenance as remove,
	toggleWalletMaintenance as toggle,
	clearResponse,
} from "../../store/maintenance/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class Wallet extends Component {
	state = {
		currentAssets: "",
		details: {
			name: "",
			active: true,
			fiat: false,
			maintenance: {
				deposit: false,
				withdrawal: false
			},
		},
		isModalOpen: false,
	};

	componentDidMount = () => {};

	componentDidUpdate = (prevProps, prevState) => {
		if (
			prevProps.maintenance.response !== this.props.maintenance.response
		) {
			if (!isEmpty(this.props.maintenance.response.message)) {
				toast.success(this.props.maintenance.response.message);
				this.props.clearResponse();
				this.refreshTableData();
			}
		}
	};
	columns = () => [
		{
			label: "Name",
			name: "name",
			options: {
				filter: true,
				sort: false,
			},
		},

		{
			name: "maintenance",
			label: "Deposit Maintenance",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"maintenance-deposit-" + rowData._id}
							checked={rowData.maintenance.deposit}
							onChange={() => {
								this.toggle({
									_id: rowData._id,
									type: "deposit",
									name: "maintenance",
								});
							}}
							disabled={
								!hasPermission(
									["wallet maintenance update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"maintenance-deposit-" + rowData._id}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},

		{
			name: "maintenance",
			label: "Withdrawal Maintenance",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"maintenance-withdrawal-" + rowData._id}
							checked={rowData.maintenance.withdrawal}
							onChange={() => {
								this.toggle({
									_id: rowData._id,
									type: "withdrawal",
									name: "maintenance",
								});
							}}
							disabled={
								!hasPermission(
									["wallet maintenance update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"maintenance-withdrawal-" + rowData._id}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},


		{
			name: "active",
			label: "Active",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"square-switch-active" + rowData._id}
							checked={rowData.active}
							onChange={() => {
								this.toggle({
									_id: rowData._id,
									name: "active",
								});
							}}
							disabled={
								!hasPermission(
									["wallet maintenance update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"square-switch-active" + rowData._id}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
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
						"wallet maintenance update",
						"wallet maintenance delete",
						"wallet maintenance view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"wallet maintenance update",
						"wallet maintenance delete",
						"wallet maintenance view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={[
									"wallet maintenance update",
									"wallet maintenance view",
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
								permission={["wallet maintenance delete"]}
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
		return result.data.docs.map((item) => {
			return {
				...item,
				active: { _id: item._id, active: item.active },
				maintenance: { _id: item._id, maintenance: item.maintenance },
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
			text: "Do you really want to delete Admin?",
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

	handleChangeMaintenance = (event) => {
		const maintenance = this.state.details.maintenance;
		maintenance[event.target.name] = event.target.value;
		this.setState(prevProps => ({  details: {...prevProps.details, maintenance } }));
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["wallet maintenance update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["wallet maintenance add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Wallet Maintenance | Admin</title>
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
														"wallet maintenance list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/wallet-maintenance/get-wallet-maintenance-with-pagination`}
														columns={this.columns()}
														resultFormatter={
															this.resultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														origin={
															<div className="row">
																<div className="col-auto h4">
																	Wallet
																	Maintenance
																	List &nbsp;
																	<HasAnyPermission
																		permission={[
																			"wallet maintenance add",
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
						<h5 className="modal-title mt-0">Wallet Maintenance</h5>
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
								<label
									htmlFor="deposit"
									className="form-label font-size-13 text-muted"
								>
									 Deposit Maintenance
								</label>
								<select
									value={this.state.details.maintenance?.deposit}
									onChange={this.handleChangeMaintenance}
									className="form-control"
									name="deposit"
								>
									<option disabled value="">
										Maintenance
									</option>
									<option value={true}>Enable</option>
									<option value={false}>Disable</option>
								</select>
							</div>

							<div className="mb-3">
								<label
									htmlFor="withdrawal"
									className="form-label font-size-13 text-muted"
								>
									 Withdrawal Maintenance
								</label>
								<select
									value={this.state.details.maintenance?.withdrawal}
									onChange={this.handleChangeMaintenance}
									className="form-control"
									name="withdrawal"
								>
									<option disabled value="">
										Maintenance
									</option>
									<option value={true}>Enable</option>
									<option value={false}>Disable</option>
								</select>
							</div>

							<div className="mb-3">
								<label
									htmlFor="fiat"
									className="form-label font-size-13 text-muted"
								>
									Fiat
								</label>
								<select
									value={this.state.details.fiat}
									onChange={this.handleChange}
									className="form-control"
									name="fiat"
								>
									<option disabled value="">
										Fiat
									</option>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
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

Wallet.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	maintenance: state.maintenance,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	toggle,
	clearResponse,
})(withRouter(Wallet));
