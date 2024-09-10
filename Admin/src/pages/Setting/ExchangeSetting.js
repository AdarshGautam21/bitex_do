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

import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	toggleExchangeSetting,
	clearResponse,
} from "../../store/setting/actions";
import { get as getAssets } from "../../store/assets/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class ExchangeSetting extends Component {
	state = {
		details: {
			asset: "",
			maxLeverageLevel: "",
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
			name: "status",
			label: "Status",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"square-switch-maintenance" + rowData._id}
							checked={rowData.status}
							onChange={() => {
								this.toggle(rowData._id);
							}}
							disabled={
								!hasPermission(
									["maintenance update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"square-switch-maintenance" + rowData._id}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},
		{
			label: "Date",
			name: "createdAt",
			options: {
				filter: false,
				sort: false,
			},
		},

		// {
		// 	label: "Actions",
		// 	name: "action",
		// 	options: {
		// 		filter: false,
		// 		sort: false,
		// 		empty: true,
		// 		download: false,
		// 		display: hasPermission(
		// 			[
		// 				"margin setting update",
		// 				"margin setting delete",
		// 				"margin setting view",
		// 			],
		// 			this.props.auth.currentUserRolePermissions
		// 		),
		// 		viewColumns: hasPermission(
		// 			[
		// 				"margin setting update",
		// 				"margin setting delete",
		// 				"margin setting view",
		// 			],
		// 			this.props.auth.currentUserRolePermissions
		// 		),
		// 		customBodyRender: (data) => {
		// 			return (
		// 				<div className="text-center">
		// 					<HasAnyPermission
		// 						permission={[
		// 							"margin setting update",
		// 							"margin setting view",
		// 						]}
		// 					>
		// 						<button
		// 							onClick={(e) => this.openModal(data)}
		// 							type="button"
		// 							className="btn btn-soft-primary waves-effect waves-light"
		// 						>
		// 							<i className="bx bx-edit-alt font-size-16 align-middle"></i>
		// 						</button>
		// 					</HasAnyPermission>
		// 					&nbsp;
		// 					<HasAnyPermission
		// 						permission={["margin setting delete"]}
		// 					>
		// 						<button
		// 							onClick={(e) => this.remove(data._id)}
		// 							type="button"
		// 							className="btn btn-soft-danger waves-effect waves-light"
		// 						>
		// 							<i className="bx bx-trash font-size-16 align-middle"></i>
		// 						</button>
		// 					</HasAnyPermission>
		// 				</div>
		// 			);
		// 		},
		// 	},
		// },
	];

	resultFormatter = (result) => {
		return result.data.map((item) => {
			return {
				...item,
				status: {status: item.status, _id: item._id  },
				createdAt: moment(item.date).format("L LTS"),
				action: item,
			};
		});
	};

	toggle = (id) => {
		console.log("toggle", id);
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
				this.props.toggleExchangeSetting(id);
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
				asset: "",
				maxLeverageLevel: "",
			},
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
						<title>Exchange Setting | Admin</title>
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
														"margin setting list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/dashboard/user/get-exchange-setting`}
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
																	Exchange
																	Setting
																	&nbsp;
																	{/* <HasAnyPermission
																		permission={[
																			"margin setting add",
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
																	</HasAnyPermission> */}
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
						<h5 className="modal-title mt-0">Margin Trading</h5>
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
							disabled={
								!hasPermission(
									[
										"margin setting update",
										"margin setting add",
									],
									this.props.auth.currentUserRolePermissions
								)
							}
						>
							<div className="mb-3">
								<label
									htmlFor="asset"
									className="form-label font-size-13 text-muted"
								>
									Assets
								</label>
								<select
									value={this.state.details.asset}
									onChange={this.handleChange}
									className="form-control"
									name="asset"
								>
									<option disabled value="">
										Assets
									</option>
									{this.props.assets?.map((item) => (
										<option key={item._id} value={item._id}>
											{item.name}
										</option>
									))}
								</select>
							</div>
							<div className="mb-3">
								<label
									htmlFor="maxLeverageLevel"
									className="form-label"
								>
									Max Leverage Level
								</label>
								<AvField
									type="text"
									className="form-control"
									name="maxLeverageLevel"
									value={this.state.details.maxLeverageLevel}
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

								<HasAnyPermission
									permission={[
										"margin setting update",
										"margin setting add",
									]}
								>
									{" "}
									<button
										type="submit"
										className="btn btn-primary"
									>
										Save
									</button>
								</HasAnyPermission>
							</div>
						</AvForm>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

ExchangeSetting.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	setting: state.setting,
	assets: state.assets.assets,
});

export default connect(mapStateToProp, {
	toggleExchangeSetting,
	clearResponse,
})(withRouter(ExchangeSetting));
