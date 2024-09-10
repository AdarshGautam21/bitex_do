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
	xrpWithdrawalSetting,
	createXrpWithdrawalSetting,
	updateXrpWithdrawalSetting,
	removeXrpWithdrawalSetting,
	xrpDepositSetting,
	createXrpDepositSetting,
	updateXrpDepositSetting,
	removeXrpDepositSetting,
	xrpWalletBalance,
	xrpTransferAmount,
	clearResponse,
} from "../../store/setting/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";

class XrpSetting extends Component {
	state = {
		currentAssets: "",
		details: {
			name: "",
			identifier: "",
			type: "",
		},
		transferDetail: {
			transferAmount: "",
			toAddress: "",
			fromAddress: "",
		},
		isModalOpen: false,
		isTransferModalOpen: false,
		type: false,
	};

	componentDidMount = () => {
		this.props.xrpDepositSetting();
		this.props.xrpWithdrawalSetting();
	};

	save = (event, data) => {
		let { details } = this.state;
		this.props.createBitgoSetting(details);
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete Xrp Setting?",
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

	toggle = (id, type) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update Xrp Setting?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				type === "deposit"
					? this.props.updateXrpDepositSetting(id)
					: this.props.updateXrpWithdrawalSetting(id);
			}
		});
	};

	transferBalance = (event, data) => {
		this.props.xrpTransferAmount(this.state.transferDetail);
		this.closeModal("isTransferModalOpen");
	};

	openModal = (type, data = null) => {
		const state = {
			[type]: true,
		};
		if (data) state["details"] = data;
		else this.clearForm();
		this.setState(state);
	};

	closeModal = (type) => {
		this.setState({
			[type]: false,
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
			transferDetail: {
				transferAmount: "",
				toAddress: "",
				fromAddress: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	handleChangeTransferDetail = (event) => {
		this.setState((prevState) => ({
			transferDetail: {
				...prevState.transferDetail,
				[event.target.name]: event.target.value,
			},
		}));
	};

	render() {
		if (!isEmpty(this.props.setting.response?.message)) {
			toast.success(this.props.setting.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.props.xrpDepositSetting();
					this.props.xrpWithdrawalSetting();
				},
			});
		}
		const {
			xrpDepositSetting,
			xrpWithdrawalSetting,
			xrpDepositWallatBalance,
			xrpWithdrawalWallatBalance,
		} = this.props.setting;
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Xrp Setting | Admin</title>
					</MetaTags>
					<HasAnyPermission permission={["xrp setting"]}>
						<div className="container-fluid">
							{!isEmpty(xrpDepositSetting) && (
								<Card className="border border-primary">
									<CardHeader className="align-items-center d-flex bg-transparent border-primary">
										<CardTitle className="mb-0 flex-grow-1">
											<h5 className="my-0 text-primary">
												<i className="mdi mdi-bullseye-arrow me-3"></i>
												XRP Deposit Setting
											</h5>
										</CardTitle>
										<div className="flex-shrink-0">
											<div className="d-flex flex-wrap gap-2 mb-0 my-n1">
												<button
													type="button"
													className="btn btn-primary waves-effect waves-light"
													onClick={() =>
														this.openModal(
															"isTransferModalOpen",
															"deposit"
														)
													}
												>
													Transfer Balance
												</button>
											</div>
										</div>
									</CardHeader>
									<CardBody>
										<div className="table-responsive">
											<Table className="table table-borderless mb-0">
												<thead></thead>
												<tbody>
													<tr>
														<th scope="row">
															<h4>Live</h4>
														</th>
														<td>
															<div className="square-switch">
																<Input
																	type="checkbox"
																	switch="none"
																	id={
																		"square-switch"
																	}
																	checked={
																		xrpDepositSetting.live
																			? true
																			: false
																	}
																	onChange={() => {
																		this.toggle(
																			xrpDepositSetting._id,
																			"deposit"
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
														</td>
													</tr>

													<tr>
														<th scope="row">
															<h4>Address</h4>
														</th>
														<td>
															<h5>
																{
																	xrpDepositSetting.address
																}
															</h5>
														</td>
													</tr>
													<tr>
														<th scope="row">
															<h4>
																Last generated
																tag
															</h4>
														</th>
														<td>
															<h5>
																{
																	xrpDepositSetting.lastDestinationTag
																}
															</h5>
														</td>
													</tr>

													<tr>
														<th scope="row">
															<h4>Client Id</h4>
														</th>
														<td>
															<h5>
																{
																	xrpDepositSetting.clientId
																}
															</h5>
														</td>
													</tr>

													<tr>
														<th scope="row">
															<h4>
																Wallet Balance
															</h4>
														</th>
														<td>
															<h5>
																{xrpDepositWallatBalance?.value
																	? xrpDepositWallatBalance.value
																	: ""}
															</h5>
														</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</CardBody>
								</Card>
							)}

							{!isEmpty(xrpWithdrawalSetting) && (
								<Card className="border border-primary">
									<CardHeader className="align-items-center d-flex bg-transparent border-primary">
										<CardTitle className="mb-0 flex-grow-1">
											<h5 className="my-0 text-primary">
												<i className="mdi mdi-bullseye-arrow me-3"></i>
												XRP Withdrawal Setting
											</h5>
										</CardTitle>
										<div className="flex-shrink-0">
											<div className="d-flex flex-wrap gap-2 mb-0 my-n1">
												<button
													type="button"
													className="btn btn-primary waves-effect waves-light"
													onClick={() =>
														this.openModal(
															"isTransferModalOpen",
															"withdrawal"
														)
													}
												>
													Transfer Balance
												</button>
											</div>
										</div>
									</CardHeader>
									<CardBody>
										<div className="table-responsive">
											<Table className="table table-borderless mb-0">
												<thead></thead>
												<tbody>
													<tr>
														<th scope="row">
															<h4>Live</h4>
														</th>
														<td>
															<div className="square-switch">
																<Input
																	type="checkbox"
																	switch="none"
																	id={
																		"square-switch" +
																		xrpWithdrawalSetting._id
																	}
																	checked={
																		xrpWithdrawalSetting.live
																			? true
																			: false
																	}
																	onChange={() => {
																		this.toggle(
																			xrpWithdrawalSetting._id,
																			"withdrawal"
																		);
																	}}
																/>
																<Label
																	htmlFor={
																		"square-switch" +
																		xrpWithdrawalSetting._id
																	}
																	data-on-label="Yes"
																	data-off-label="No"
																></Label>
															</div>
														</td>
													</tr>

													<tr>
														<th scope="row">
															<h4>Address</h4>
														</th>
														<td>
															<h5>
																{
																	xrpWithdrawalSetting.address
																}
															</h5>
														</td>
													</tr>
													<tr>
														<th scope="row">
															<h4>
																Last generated
																tag
															</h4>
														</th>
														<td>
															<h5>
																{
																	xrpWithdrawalSetting.lastDestinationTag
																}
															</h5>
														</td>
													</tr>

													<tr>
														<th scope="row">
															<h4>Client Id</h4>
														</th>
														<td>
															<h5>
																{
																	xrpWithdrawalSetting.clientId
																}
															</h5>
														</td>
													</tr>

													<tr>
														<th scope="row">
															<h4>
																Wallet Balance
															</h4>
														</th>
														<td>
															<h5>
																{xrpWithdrawalWallatBalance?.value
																	? xrpWithdrawalWallatBalance.value
																	: "Error on getting balance"}
															</h5>
														</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</CardBody>
								</Card>
							)}
						</div>
					</HasAnyPermission>
				</div>

				{/* <Modal
					size="lg"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Xrp Setting</h5>
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
				</Modal> */}

				<Modal
					size="md"
					isOpen={this.state.isTransferModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Xrp Setting</h5>
						<button
							type="button"
							onClick={() =>
								this.closeModal("isTransferModalOpen")
							}
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
								this.transferBalance(e, v);
							}}
						>
							<div className="mb-3">
								<label
									htmlFor="transferAmount"
									className="form-label"
								>
									Transfer Amount
								</label>
								<AvField
									type="number"
									className="form-control"
									name="transferAmount"
									value={
										this.state.transferDetail.transferAmount
									}
									onChange={this.handleChangeTransferDetail}
									required
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="fromAddress"
									className="form-label font-size-13 text-muted"
								>
									From Address
								</label>
								<AvField
									type="select"
									value={
										this.state.transferDetail.fromAddress
									}
									onChange={this.handleChangeTransferDetail}
									className="form-control"
									name="fromAddress"
									required
								>
									<option disabled value="">
										From Address
									</option>
									{xrpDepositSetting?.address && (
										<option
											key={xrpDepositSetting.address}
											value={xrpDepositSetting.address}
										>
											{`Deposit Wallet ${xrpDepositSetting.address}`}
										</option>
									)}
									{xrpWithdrawalSetting?.address && (
										<option
											key={xrpWithdrawalSetting.address}
											value={xrpWithdrawalSetting.address}
										>
											{`Withdrawal Wallet ${xrpWithdrawalSetting.address}`}
										</option>
									)}
								</AvField>
							</div>
							<div className="mb-3">
								<label
									htmlFor="toAddress"
									className="form-label font-size-13 text-muted"
								>
									To Address
								</label>
								<AvField
									type="select"
									value={this.state.transferDetail.toAddress}
									onChange={this.handleChangeTransferDetail}
									className="form-control"
									name="toAddress"
									required
								>
									<option disabled value="">
										to Address
									</option>
									{xrpDepositSetting?.address && (
										<option
											key={xrpDepositSetting.address}
											value={xrpDepositSetting.address}
										>
											{`Deposit Wallet ${xrpDepositSetting.address}`}
										</option>
									)}
									{xrpWithdrawalSetting?.address && (
										<option
											key={xrpWithdrawalSetting.address}
											value={xrpWithdrawalSetting.address}
										>
											{`Withdrawal Wallet ${xrpWithdrawalSetting.address}`}
										</option>
									)}
								</AvField>
							</div>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() =>
										this.closeModal("isTransferModalOpen")
									}
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

XrpSetting.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	setting: state.setting,
});

export default connect(mapStateToProp, {
	xrpWithdrawalSetting,
	createXrpWithdrawalSetting,
	updateXrpWithdrawalSetting,
	removeXrpWithdrawalSetting,
	xrpDepositSetting,
	createXrpDepositSetting,
	updateXrpDepositSetting,
	removeXrpDepositSetting,
	xrpWalletBalance,
	xrpTransferAmount,
	clearResponse,
})(withRouter(XrpSetting));
