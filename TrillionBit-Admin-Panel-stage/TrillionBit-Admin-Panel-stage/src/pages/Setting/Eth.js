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
	ethWithdrawalSetting,
	createEthWithdrawalSetting,
	updateEthWithdrawalSetting,
	removeEthWithdrawalSetting,
	ethDepositSetting,
	createEthDepositSetting,
	updateEthDepositSetting,
	removeEthDepositSetting,
	ethWalletBalance,
	ethTransferAmount,
	clearResponse,
} from "../../store/setting/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";

class EthSetting extends Component {
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
		this.props.ethDepositSetting();
		// this.props.ethWithdrawalSetting();
	};

	save = (event, data) => {
		let { details } = this.state;
		this.props.createBitgoSetting(details);
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete Eth Setting?",
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
			text: "Do you really want to update Eth Setting?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				type === "deposit"
					? this.props.updateEthDepositSetting(id)
					: this.props.updateEthWithdrawalSetting(id);
			}
		});
	};

	transferBalance = (event, data) => {
		this.props.ethTransferAmount(this.state.transferDetail);
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
					this.props.ethDepositSetting();
					this.props.ethWithdrawalSetting();
				},
			});
		}
		const {
			ethDepositSetting,
			ethWithdrawalSetting,
			ethDepositWallatBalance,
			ethWithdrawalWallatBalance,
		} = this.props.setting;
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Eth Setting | Admin</title>
					</MetaTags>
					<HasAnyPermission permission={["eth setting"]}>
						<div className="container-fluid">
							{!isEmpty(ethDepositSetting) && (
								<Card className="border border-primary">
									<CardHeader className="align-items-center d-flex bg-transparent border-primary">
										<CardTitle className="mb-0 flex-grow-1">
											<h5 className="my-0 text-primary">
												<i className="mdi mdi-bullseye-arrow me-3"></i>
												ETH Setting
											</h5>
										</CardTitle>
										{/* <div className="flex-shrink-0">
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
										</div> */}
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
																		ethDepositSetting.live
																			? true
																			: false
																	}
																	onChange={() => {
																		this.toggle(
																			ethDepositSetting._id,
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
																	ethDepositSetting.address
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
																	ethDepositSetting.clientId
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
																{ethDepositWallatBalance?.value
																	? ethDepositWallatBalance.value
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

							{!isEmpty(ethWithdrawalSetting) && (
								<Card className="border border-primary">
									<CardHeader className="align-items-center d-flex bg-transparent border-primary">
										<CardTitle className="mb-0 flex-grow-1">
											<h5 className="my-0 text-primary">
												<i className="mdi mdi-bullseye-arrow me-3"></i>
												ETH Withdrawal Setting
											</h5>
										</CardTitle>
										{/* <div className="flex-shrink-0">
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
										</div> */}
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
																		ethWithdrawalSetting._id
																	}
																	checked={
																		ethWithdrawalSetting.live
																			? true
																			: false
																	}
																	onChange={() => {
																		this.toggle(
																			ethWithdrawalSetting._id,
																			"withdrawal"
																		);
																	}}
																/>
																<Label
																	htmlFor={
																		"square-switch" +
																		ethWithdrawalSetting._id
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
																	ethWithdrawalSetting.address
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
																	ethWithdrawalSetting.clientId
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
																{ethWithdrawalWallatBalance?.value
																	? ethWithdrawalWallatBalance.value
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
						<h5 className="modal-title mt-0">Eth Setting</h5>
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
						<h5 className="modal-title mt-0">Eth Setting</h5>
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
									{ethDepositSetting?.address && (
										<option
											key={ethDepositSetting.address}
											value={ethDepositSetting.address}
										>
											{`Deposit Wallet ${ethDepositSetting.address}`}
										</option>
									)}
									{ethWithdrawalSetting?.address && (
										<option
											key={ethWithdrawalSetting.address}
											value={ethWithdrawalSetting.address}
										>
											{`Withdrawal Wallet ${ethWithdrawalSetting.address}`}
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
									{ethDepositSetting?.address && (
										<option
											key={ethDepositSetting.address}
											value={ethDepositSetting.address}
										>
											{`Deposit Wallet ${ethDepositSetting.address}`}
										</option>
									)}
									{ethWithdrawalSetting?.address && (
										<option
											key={ethWithdrawalSetting.address}
											value={ethWithdrawalSetting.address}
										>
											{`Withdrawal Wallet ${ethWithdrawalSetting.address}`}
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

EthSetting.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	setting: state.setting,
});

export default connect(mapStateToProp, {
	ethWithdrawalSetting,
	createEthWithdrawalSetting,
	updateEthWithdrawalSetting,
	removeEthWithdrawalSetting,
	ethDepositSetting,
	createEthDepositSetting,
	updateEthDepositSetting,
	removeEthDepositSetting,
	ethWalletBalance,
	ethTransferAmount,
	clearResponse,
})(withRouter(EthSetting));
