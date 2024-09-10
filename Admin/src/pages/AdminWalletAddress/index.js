import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Input, Label, Modal } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	create,
	update,
	remove,
	clearResponse,
} from "../../store/adminWalletAddress/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

class AdminWalletAddress extends Component {
	state = {
		ajaxProcess: false,
		details: {
			coin: "",
			address: "",
			addressIndex: "",
			mnemonic: "",
		},
		isModalOpen: false,
	};

	componentDidMount = () => {};

	componentDidUpdate = (prevProps, prevState) => {
		if (
			prevProps.adminWalletAddress.response !==
			this.props.adminWalletAddress.response
		) {
			if (!isEmpty(this.props.adminWalletAddress.response.message)) {
				toast.success(this.props.adminWalletAddress.response.message);
				this.props.clearResponse();
				this.refreshTableData();
			}
		}
	};

	columns = () => [
		{
			name: "coin",
			label: "Coin",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "mnemonic",
			label: "Mnemonic",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "address",
			label: "Address",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "addressIndex",
			label: "Address Index",
			options: {
				filter: false,
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
					["assets update", "assets delete", "assets view"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["assets update", "assets delete", "assets view"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (value) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={["assets update", "assets view"]}
							>
								<button
									onClick={(e) => this.openDilalog(value)}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission permission={["assets delete"]}>
								<button
									onClick={(e) => this.remove(value)}
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

		{
			name: "action",
			label: "action",
			options: {
				filter: false,
				display: "excluded",
				viewColumns: false,
				download: false,
			},
		},
	];

	resultFormatter = (result) => {
		return result.data.docs.map((item) => {
			return {
				...item,
				action: item,
			};
		});
	};

	remove = (data) => {
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
				this.props.remove(data._id);
			}
		});
	};

	update = (event, data) => {
		const details = this.state.details;
		if (details?._id) this.props.update(details);
		else this.props.create(details);
		this.setState({
			isModalOpen: false,
			details: {
				coin: "",
				address: "",
				addressIndex: "",
				mnemonic: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState(details);
	};

	openDilalog = (editData = null) => {
		this.setState({
			isModalOpen: true,
			details: editData ? editData : this.state.details,
		});
	};

	closeDialog = () => {
		this.setState({ isModalOpen: false });
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["assets update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["assets add"],
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
						<title>Admin Wallet Address | Bitex Admin</title>
					</MetaTags>
					<div className="container-fluid">
						{/* <Breadcrumbs title="User" breadcrumbItem="User List" /> */}
						<Row>
							<Col>
								<Card>
									<CardBody>
										<div className="table-rep-plugin">
											<div
												className="table-responsive mb-0"
												data-pattern="priority-columns"
											>
												<HasAnyPermission
													permission={["assets list"]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/assets/get-admin-wallet-address-with-pagination`}
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
																	Admin Wallet
																	Address List
																	&nbsp;
																	<HasAnyPermission
																		permission={[
																			"assets add",
																		]}
																	>
																		<button
																			onClick={(
																				e
																			) =>
																				this.openDilalog()
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
														rowsPerPage={10}
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
					size="xl"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">
							Admin Wallet Address
						</h5>
						<button
							type="button"
							onClick={() => this.closeDialog()}
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
								this.update(e, v);
							}}
							disabled={!this.couldHaveAddUpdatePermission()}
						>
							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="coin"
											className="form-label"
										>
											Coin
										</label>
										<AvField
											type="text"
											className="form-control"
											name="coin"
											value={this.state.details.coin}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="address"
											className="form-label"
										>
											Address
										</label>
										<AvField
											type="text"
											className="form-control"
											name="address"
											value={this.state.details.address}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="mnemonic"
											className="form-label"
										>
											Mnemonic
										</label>
										<AvField
											type="text"
											className="form-control"
											name="mnemonic"
											value={this.state.details.mnemonic}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="addressIndex"
											className="form-label"
										>
											Address Index
										</label>
										<AvField
											type="text"
											className="form-control"
											name="addressIndex"
											value={
												this.state.details.addressIndex
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => this.closeDialog()}
								>
									Close
								</button>

								<HasAnyPermission
									permission={["assets update", "assets add"]}
								>
									{this.couldHaveAddUpdatePermission() && (
										<button
											type="submit"
											className="btn btn-primary"
										>
											Save
										</button>
									)}
								</HasAnyPermission>
							</div>
						</AvForm>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

AdminWalletAddress.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	adminWalletAddress: state.adminWalletAddress,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	clearResponse,
})(withRouter(AdminWalletAddress));
