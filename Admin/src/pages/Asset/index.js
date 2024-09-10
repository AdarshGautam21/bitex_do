import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Input, Label, Modal } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	create,
	update,
	toggle,
	remove,
	clearResponse,
} from "../../store/assets/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CoinTypesInput from "./CoinTypesInput";
import {accountList} from "../../common/marketList";

const animatedComponents = makeAnimated();

class Asset extends Component {
	state = {
		ajaxProcess: false,
		assetsDetail: {
			availableCount: "",
			alias: "",
			name: "",
			displayName: "",
			totalBalance: "",
			availableBalance: "",
			freezeCount: "",
			freezeBalance: "",
			fiat: false,
			bitgo: false,
			active: true,
			depositFee: "",
			withdrawalFee: "",
			description: "",
			priority: 0,
			coinTypes: [],
			coinType: [],
			binancePairs: {},
			binancePair: "",
		},
		isModalOpen: false,
	};

	componentDidMount = () => {
		// console.log("this.props.", this.props.auth.currentUserRolePermissions);
	};

	componentDidUpdate = () => {
		if (!isEmpty(this.props.assets.response?.message)) {
			toast.success(this.props.assets.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.refreshTableData();
				},
			});
		}
	};

	columns = () => [
		{
			name: "name",
			label: "Name",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "alias",
			label: "Alias",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "displayName",
			label: "Display Name",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "fiat",
			label: "Fiat",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"square-switch" + rowData._id + "fiat"}
							checked={rowData.fiat}
							onChange={() => {
								this.toggleAssets(rowData._id, "fiat");
							}}
						/>
						<Label
							htmlFor={"square-switch" + rowData._id + "fiat"}
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
							id={"square-switch" + rowData._id + "active"}
							checked={rowData.active}
							onChange={() => {
								this.toggleAssets(rowData._id, "active");
							}}
						/>
						<Label
							htmlFor={"square-switch" + rowData._id + "active"}
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
				customBodyRender: (value) => {
					return (
						<div className="text-center">
							<button
								onClick={(e) => this.openDilalog(value)}
								type="button"
								className="btn btn-soft-primary waves-effect waves-light"
							>
								<i className="bx bx-edit-alt font-size-16 align-middle"></i>
							</button>
							&nbsp;
							<button
								onClick={(e) => this.removeAssets(value)}
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

	expandableComponent = (rowData, rowMeta) => {
		const data = rowData[rowData.length - 1];
		return (
			<>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Available Balance</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.availableBalance)
							? "-"
							: data.availableBalance}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Available Count</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.availableCount)
							? "-"
							: data.availableCount}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Freeze Balance</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.freezeBalance) ? "-" : data.freezeBalance}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Freeze Count</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.freezeCount) ? "-" : data.freezeCount}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Total Balance</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.totalBalance) ? "-" : data.totalBalance}
					</td>
				</tr>
			</>
		);
	};

	resultFormatter = (result) => {
		return result.data.docs.map((item) => {
			return {
				availableCount: item.availableCount,
				alias: item.alias,
				name: item.name,
				displayName: item.displayName,
				totalBalance: item.totalBalance,
				availableBalance: item.availableBalance,
				freezeCount: item.freezeCount,
				freezeBalance: item.freezeBalance,
				fiat: { fiat: item.fiat, _id: item._id },
				bitgo: { bitgo: item.bitgo, _id: item._id },
				active: { active: item.active, _id: item._id },
				depositFee: item.depositFee,
				withdrawalFee: item.withdrawalFee,
				description: item.description,
				updateDate: moment(item.updateDate).format("L LTS"),
				action: item,
			};
		});
	};

	removeAssets = (data) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete asset?",
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

	toggleAssets = (id, name) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update asset?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.toggle(id, name);
			}
		});
	};

	updateAssets = (event, data) => {
		let assetsDetail = this.state.assetsDetail;
		if (assetsDetail.binancePair) {
			let binancePairs = assetsDetail.binancePair
				.split(",")
				?.map((item) => item.trim());
			binancePairs?.map((subItem) => {
				let keyName = subItem.split(":");
				if (keyName?.[0])
					assetsDetail.binancePairs = {
						...assetsDetail.binancePairs,
						[keyName[0]]: keyName?.[1] ? keyName[1].trim() : "",
					};
			});
		}
		if (assetsDetail?._id) this.props.update(assetsDetail);
		else this.props.create(assetsDetail);
		this.clearForm();
	};

	handleChange = (event) => {
		const assetsDetail = this.state.assetsDetail;
		assetsDetail[event.target.name] = event.target.value;
		this.setState({ assetsDetail });
	};

	handleChangeCoinType = (data) => {
		console.log("data: --:-- ", data);
		const assetsDetail = this.state.assetsDetail;
		assetsDetail["coinType"] = data;
		const coinTypes = data.map((item) => {
			const index = assetsDetail["coinTypes"].findIndex(
				(coin) => coin.coinType === item.value
			);
			if (index === -1) {
				return {
					coinType: item.value,
					depositFee: "",
					withdrawalFee: "",
				};
			}
			return { ...assetsDetail["coinTypes"][index] };
		});
		assetsDetail["coinTypes"] = coinTypes;
		this.setState({ assetsDetail });
	};

	handleCoinTypeInputChange = (index) => (event) => {
		const coinTypes = this.state.assetsDetail.coinTypes;
		coinTypes[index][event.target.name] = event.target.value;
		this.setState({
			assetsDetail: {
				...this.state.assetsDetail,
				coinTypes: coinTypes,
			},
		});
	};

	openDilalog = (editData = null) => {
		if(editData) {
			if (editData?.binancePairs) {
				let binancePair = Object.entries(editData.binancePairs)
					.map((x) => x.join(","))
					.join("\n");
				editData = { ...editData, binancePair };
			}
			if (editData?.coinTypes) {
				let coinType = editData.coinTypes.map((item) => ({
					label: item.coinType,
					value: item.coinType,
				}));
				editData = { ...editData, coinType: coinType };
			} else {
				editData['coinTypes'] = [];
			}
		}
		this.setState({
			isModalOpen: true,
			assetsDetail: editData ? editData : this.state.assetsDetail,
		});
	};

	closeDialog = () => {
		this.setState({ isModalOpen: false });
	};

	clearForm = () => {
		this.setState({
			isModalOpen: false,
			assetsDetail: {
				availableCount: "",
				alias: "",
				name: "",
				displayName: "",
				totalBalance: "",
				availableBalance: "",
				freezeCount: "",
				freezeBalance: "",
				fiat: false,
				bitgo: false,
				active: true,
				depositFee: "",
				withdrawalFee: "",
				description: "",
				priority: 0,
				coinTypes: [],
				coinType: [],
				binancePairs: {},
				binancePair: "",
			},
		});
	};

	getCointTypeOptions = () => {
		return [...accountList, "ERC20", "TRC20", "DOGE"].map(
			(item) => ({
				label: item,
				value: item,
			})
		);
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Assets | Admin</title>
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
												<ReactDataTable
													url={`${apiUrl}/api/admin/assets/get-assets-with-pagination`}
													columns={this.columns()}
													resultFormatter={
														this.resultFormatter
													}
													expandableRows={true}
													renderExpandableRow={
														this.expandableComponent
													}
													setRefresh={(refresh) =>
														(this.refreshTableData =
															refresh)
													}
													origin={
														<div className="row">
															<div className="col-auto h4">
																Assets List
																&nbsp;
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
															</div>
														</div>
													}
													rowsPerPage={10}
												/>
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
						<h5 className="modal-title mt-0">Assets</h5>
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
								this.updateAssets(e, v);
							}}
						>
							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="name"
											className="form-label"
										>
											Name
										</label>
										<AvField
											type="text"
											className="form-control"
											name="name"
											value={this.state.assetsDetail.name}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="displayName"
											className="form-label"
										>
											Display Name
										</label>
										<AvField
											type="text"
											className="form-control"
											name="displayName"
											value={
												this.state.assetsDetail
													.displayName
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>
							{/* <Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="depositFee"
											className="form-label"
										>
											Deposit Fee
										</label>
										<AvField
											type="text"
											className="form-control"
											name="depositFee"
											value={
												this.state.assetsDetail
													.depositFee
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="withdrawalFee"
											className="form-label"
										>
											Withdrawal Fee
										</label>
										<AvField
											type="text"
											className="form-control"
											name="withdrawalFee"
											value={
												this.state.assetsDetail
													.withdrawalFee
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row> */}

							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="coinType"
											className="form-label"
										>
											coin Types
										</label>
										<Select
											isMulti={true}
											options={this.getCointTypeOptions()}
											classNamePrefix="select2-selection"
											closeMenuOnSelect={false}
											components={animatedComponents}
											name="coinType"
											value={
												this.state.assetsDetail.coinType
											}
											onChange={this.handleChangeCoinType}
											// onChange={(selectedOptions) => {
											// 	const target = {
											// 		name: "coinType",
											// 		value: selectedOptions,
											// 	};
											// 	this.handleChange({ target });
											// }}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="binancePair"
											className="form-label"
										>
											binancePairs
										</label>
										<AvField
											type="text"
											className="form-control"
											placeHolder=" key: value, key: value, ..."
											name="binancePair"
											value={
												this.state.assetsDetail
													.binancePair
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>

							{!isEmpty(this.state.assetsDetail.coinTypes) &&
								this.state.assetsDetail.coinTypes.map(
									(item, index) => (
										<CoinTypesInput
											handleChange={
												this.handleCoinTypeInputChange
											}
											coinType={item}
											index={index}
										/>
									)
								)}

							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="availableBalance"
											className="form-label"
										>
											Available Balance
										</label>
										<AvField
											type="text"
											className="form-control"
											name="availableBalance"
											value={
												this.state.assetsDetail
													.availableBalance
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="availableCount"
											className="form-label"
										>
											Available Count
										</label>
										<AvField
											type="text"
											className="form-control"
											name="availableCount"
											value={
												this.state.assetsDetail
													.availableCount
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>

							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="alias"
											className="form-label"
										>
											Alias Name
										</label>
										<AvField
											type="text"
											className="form-control"
											name="alias"
											value={
												this.state.assetsDetail.alias
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="description"
											className="form-label"
										>
											Description
										</label>
										<AvField
											type="text"
											className="form-control"
											name="description"
											value={
												this.state.assetsDetail
													.description
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>

							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="freezeBalance"
											className="form-label"
										>
											Freeze Balance
										</label>
										<AvField
											type="text"
											className="form-control"
											name="freezeBalance"
											value={
												this.state.assetsDetail
													.freezeBalance
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="freezeCount"
											className="form-label"
										>
											Freeze Count
										</label>
										<AvField
											type="text"
											className="form-control"
											name="freezeCount"
											value={
												this.state.assetsDetail
													.freezeCount
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="totalBalance"
											className="form-label"
										>
											Total Balance
										</label>
										<AvField
											type="text"
											className="form-control"
											name="totalBalance"
											value={
												this.state.assetsDetail
													.totalBalance
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="priority"
											className="form-label"
										>
											Priority
										</label>
										<AvField
											type="number"
											className="form-control"
											name="priority"
											value={
												this.state.assetsDetail.priority
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

Asset.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	assets: state.assets,
});

export default connect(mapStateToProp, {
	create,
	update,
	toggle,
	remove,
	clearResponse,
})(withRouter(Asset));
