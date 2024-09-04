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
import makeAnimated from "react-select/animated";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	walletBonusSetting,
	updateWalletBonusSetting,
	removeWalletBonusSetting,
	toggleWalletBonusSetting,
	createWalletBonusSetting,
	clearResponse,
} from "../../store/setting/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class WalletBonus extends Component {
	state = {
		currentAssets: "",
		details: {
			name: "",
			type: "",
			couponCode: "",
			coin: "",
			value: 0,
			active: true,
		},
		isModalOpen: false,
	};

	componentDidMount = () => {};

	componentDidUpdate = (prevProps) => {
		if (!isEmpty(this.props.setting.response?.message)) {
			toast.success(this.props.setting.response.message);
			this.props.clearResponse();
			this.refreshTableData();
		}
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
			label: "Coin",
			name: "coin",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Type",
			name: "type",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Coupon Code",
			name: "couponCode",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Value",
			name: "value",
			options: {
				filter: false,
				sort: false,
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
							id={"square-switch" + rowData._id}
							checked={rowData.active}
							onChange={() => {
								this.toggle(rowData._id);
							}}
							disabled={
								!hasPermission(
									["wallet bonuses update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"square-switch" + rowData._id}
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
						"wallet bonuses update",
						"wallet bonuses delete",
						"wallet bonuses view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"wallet bonuses update",
						"wallet bonuses delete",
						"wallet bonuses view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							{/* <button
								onClick={(e) => this.openModal(data)}
								type="button"
								className="btn btn-soft-primary waves-effect waves-light"
							>
								<i className="bx bx-edit-alt font-size-16 align-middle"></i>
							</button>
							&nbsp; */}
							<HasAnyPermission
								permission={["wallet bonuses delete"]}
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
				active: { _id: item._id, active: item.active },
				action: item,
			};
		});
	};

	save = (event, data) => {
		const { details } = this.state;
		if (details?._id) this.props.updateWalletBonusSetting(details);
		else this.props.createWalletBonusSetting(details);
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete WalletBonus?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.removeWalletBonusSetting(id);
			}
		});
	};

	toggle = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update WalletBonus?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.toggleWalletBonusSetting(id);
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
				type: "",
				couponCode: "",
				coin: "",
				value: 0,
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
		const isUpdatePermission = hasPermission(
			["wallet bonuses update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["wallet bonuses add"],
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
						<title>Wallet Bonus | Admin</title>
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
														"wallet bonuses view",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/wallet-bonus/get_wallet_bonus`}
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
																	WalletBonus
																	List &nbsp;
																	<HasAnyPermission
																		permission={[
																			"wallet bonuses add",
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
						<h5 className="modal-title mt-0">WalletBonus</h5>
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
								<label htmlFor="coin" className="form-label">
									Coin
								</label>
								<AvField
									type="text"
									className="form-control"
									name="coin"
									value={this.state.details.coin}
									onChange={this.handleChange}
									required
								/>
							</div>

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
									htmlFor="couponCode"
									className="form-label"
								>
									Coupon Code
								</label>
								<AvField
									type="text"
									className="form-control"
									name="couponCode"
									value={this.state.details.couponCode}
									onChange={this.handleChange}
									required
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="value" className="form-label">
									Value
								</label>
								<AvField
									type="text"
									className="form-control"
									name="value"
									value={this.state.details.value}
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

WalletBonus.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	setting: state.setting,
});

export default connect(mapStateToProp, {
	updateWalletBonusSetting,
	removeWalletBonusSetting,
	toggleWalletBonusSetting,
	createWalletBonusSetting,
	clearResponse,
})(withRouter(WalletBonus));
