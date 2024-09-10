import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Modal } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { withRouter } from "react-router-dom";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	createAssetsCurrencyAdvanced,
	updateAssetsCurrencyAdvanced,
	removeAssetsCurrencyAdvanced,
	clearResponse,
} from "../../store/assetsCurrency/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class AssetsCurrencyAdvance extends Component {
	state = {
		details: { settingName: "", value: 0 },
		isModalOpen: false,
	};

	columns = () => [
		{
			label: "Setting",
			name: "settingName",
			options: {
				filter: false,
				sort: false,
			},
		},

		{
			label: "Value (%)",
			name: "value",
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
					[
						"assets currency update",
						"assets currency delete",
						"assets currency view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"assets currency update",
						"assets currency delete",
						"assets currency view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={[
									"assets currency update",
									"assets currency view",
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
								permission={["assets currency delete"]}
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
		const { details } = this.state;
		if (details?._id) {
			this.props.updateAssetsCurrencyAdvanced(details);
		} else {
			this.props.createAssetsCurrencyAdvanced(details);
		}
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete Assets Currency Advanced?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.removeAssetsCurrencyAdvanced(id);
			}
		});
	};

	openModal = (data = null) => {
		this.setState({
			isModalOpen: true,
			details: data === null ? this.state.details : data,
		});
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
				settingName: "",
				value: 0,
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
			["assets currency update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["assets currency add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.assetsCurrency.response?.message)) {
			toast.success(this.props.assetsCurrency.response.message, {
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
						<title>Assets Currency | Admin</title>
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
														"assets currency view",
														"assets currency list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/trading/get_currency_advance_settings`}
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
																	Assets
																	Currency
																	Advanced
																	Setting
																	&nbsp;
																	<HasAnyPermission
																		permission={[
																			"assets currency add",
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
					size="md"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">
							Assets Currency Advanced
						</h5>
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
								<label
									htmlFor="settingName"
									className="form-label"
								>
									Setting
								</label>
								<AvField
									type="text"
									className="form-control"
									name="settingName"
									value={this.state.details.settingName}
									onChange={this.handleChange}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="value" className="form-label">
									Value (%)
								</label>
								<AvField
									type="text"
									className="form-control"
									name="value"
									value={this.state.details.value}
									onChange={this.handleChange}
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

AssetsCurrencyAdvance.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	assetsCurrency: state.assetsCurrency,
});

export default connect(mapStateToProp, {
	createAssetsCurrencyAdvanced,
	updateAssetsCurrencyAdvanced,
	removeAssetsCurrencyAdvanced,
	clearResponse,
})(withRouter(AssetsCurrencyAdvance));
