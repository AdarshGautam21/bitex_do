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
	createBitgoSetting,
	updateBitgoSetting,
	removeBitgoSetting,
	liveBitgoSetting,
	bitgoSetting,
	clearResponse,
} from "../../store/setting/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";

class BitGo extends Component {
	state = {
		currentAssets: "",
		details: {
			name: "",
			identifier: "",
			type: "",
		},
		isModalOpen: false,
	};

	componentDidMount = () => {
		this.props.bitgoSetting();
	};

	columns = () => [
		{
			label: "Coin",
			name: "name",
			options: {
				filter: false,
				sort: false,
			},
		},

		{
			label: "Wallet Identifier",
			name: "identifier",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Wallet Type",
			name: "type",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Balance",
			name: "balance",
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
							<button
								onClick={(e) => this.remove(data._id)}
								type="button"
								className="btn btn-soft-danger waves-effect waves-light"
							>
								<i className="bx bx-trash font-size-16 align-middle"></i>
							</button>
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
				active: { _id: item._id, active: item.isActive },
				action: item,
			};
		});
	};

	save = (event, data) => {
		let { details } = this.state;
		this.props.createBitgoSetting(details);
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete BitGo?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.removeBitgoSetting(id);
			}
		});
	};

	toggle = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update BitGo?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.liveBitgoSetting(id);
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
				identifier: "",
				type: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	render() {
		if (!isEmpty(this.props.setting.response?.message)) {
			toast.success(this.props.setting.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.props.bitgoSetting();
					this.refreshTableData();
				},
			});
		}
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>BitGo | Admin</title>
					</MetaTags>
					<HasAnyPermission permission={["bitgo setting"]}>
						<div className="container-fluid">
							{this.props.setting?.bitgoSetting && (
								<Card className="border border-primary">
									<CardHeader className="align-items-center d-flex">
										<CardTitle className="mb-0 flex-grow-1">
											<h5 className="my-0 text-primary">
												<i className="mdi mdi-bullseye-arrow me-3"></i>
												Live
											</h5>
										</CardTitle>
										<div className="flex-shrink-0">
											<div className="d-flex flex-wrap gap-2 mb-0 my-n1">
												<div className="square-switch">
													<Input
														type="checkbox"
														switch="none"
														id={"square-switch"}
														checked={
															this.props.setting
																?.bitgoSetting
																.live
														}
														onChange={() => {
															this.toggle(
																this.props
																	.setting
																	?.bitgoSetting
																	._id
															);
														}}
													/>
													<Label
														htmlFor={
															"square-switch"
														}
														data-on-label="Yes"
														data-off-label="No"
													></Label>
												</div>
											</div>
										</div>
									</CardHeader>
								</Card>
							)}
							<Row>
								<Col>
									<Card>
										<CardBody>
											<div className="table-rep-plugin">
												<div className="table-responsive">
													<ReactDataTable
														url={`${apiUrl}/api/admin/users/bitgo_wallet_identifier`}
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
																	BitGo List
																	&nbsp;
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
																</div>
															</div>
														}
														rowsPerPage={100}
													/>
												</div>
											</div>
										</CardBody>
									</Card>
								</Col>
							</Row>
						</div>
					</HasAnyPermission>
				</div>

				<Modal
					size="lg"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">BitGo</h5>
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
									htmlFor="identifier"
									className="form-label"
								>
									Wallet Identifier
								</label>
								<AvField
									type="text"
									className="form-control"
									name="identifier"
									value={this.state.details.identifier}
									onChange={this.handleChange}
									required
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="type" className="form-label">
									Wallet Type
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

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => this.closeModal()}
								>
									Close
								</button>

								<button
									type="submit"
									className="btn btn-primary"
								>
									Save
								</button>
							</div>
						</AvForm>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

BitGo.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	setting: state.setting,
});

export default connect(mapStateToProp, {
	createBitgoSetting,
	updateBitgoSetting,
	removeBitgoSetting,
	liveBitgoSetting,
	bitgoSetting,
	clearResponse,
})(withRouter(BitGo));
