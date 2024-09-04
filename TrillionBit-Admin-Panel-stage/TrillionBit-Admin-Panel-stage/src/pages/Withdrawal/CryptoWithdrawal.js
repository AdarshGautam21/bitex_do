import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Modal } from "reactstrap";
import { withRouter } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { TransactionStatus, coinList } from "../../common/marketList";
import {
	updateCryptoWithdrawalRequest,
	clearResponse,
} from "../../store/withdrawal/actions";
import CustomSearchRender from "../../common/CustomSearchRender";

import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const txBlockApi = "https://live.blockcypher.com/btc/tx";
const txXrpApi = "https://xrpscan.com/tx";
const txEthApi = "https://etherscan.io/tx";

class CryptoWithdrawal extends Component {
	state = {
		ajaxProcess: false,
		editData: {},
		isModalOpen: false,
	};


	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.withdrawal.isUpdateCryptoWithdrawal !== this.props.withdrawal.isUpdateCryptoWithdrawal) {
			if (!isEmpty(this.props.withdrawal.isUpdateCryptoWithdrawal)) {
				toast.success(this.props.withdrawal.response.message);
				this.props.clearResponse();
				this.refreshCryptoTransactionTableData();
			}
		}
		
	};

	userCryptoTranscationColunms = () => [
		{
			name: "name",
			label: "Name",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (value) => {
					return value?._id ? (
						<a
							style={{ textDecoration: "none" }}
							href={`/user-details/${value._id}`}
						>
							{`${value.firstname} ${value.lastname}`}
						</a>
					) : (
						"Admin Transfer"
					);
				},
			},
		},
		{
			name: "email",
			label: "Email",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Date",
			name: "date",
			options: {
				filterType: "custom",
				customFilterListOptions: {
					render: (v) => {
						if (v?.[0])
							return `From Date : ${moment(v[0]).format(
								"MM/DD/YYYY"
							)} - To Date : ${moment(v[1]).format(
								"MM/DD/YYYY"
							)}`;
						return [];
					},
					update: (filterList, filterPos, index) => {
						filterList[index] = [];
						return filterList;
					},
				},
				filterOptions: {
					display: (filterList, onChange, index, column) => {
						return (
							<Flatpickr
								className="form-control d-block"
								placeholder="Date Range"
								options={{
									mode: "range",
									dateFormat: "m/d/Y",
								}}
								value={
									filterList[index] || [
										new Date(),
										new Date(),
									]
								}
								onChange={(date) => {
									filterList[index] = date;
									onChange(filterList[index], index, column);
								}}
							/>
						);
					},
				},
				sort: true,
			},
		},

		{
			name: "coin",
			label: "Account",
			options: {
				// customFilterListOptions: {
				//     render: v => v.map(l => this.getCountryName(l)),
				// },
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = coinList;
						return (
							<div className="mb-3">
								<label
									htmlFor="choices-single-no-sorting"
									className="form-label font-size-13 text-muted"
								></label>
								<select
									value={filterList[index][0] || ""}
									onChange={(event) => {
										filterList[index][0] =
											event.target.value;
										onChange(
											filterList[index],
											index,
											column
										);
									}}
									className="form-control"
									name="choices-single-no-sorting"
								>
									<option disabled value="">
										Account
									</option>
									{optionValues.map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>
						);
					},
				},
				sort: false,
			},
		},
		{
			name: "value",
			label: "Value",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "Rate",
			label: "rate",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "fees",
			label: "Fees",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "txid_short",
			label: "Short Transcation ID",
			options: {
				filter: false,
				sort: false,
			},
		},
		// {
		//     name: 'txid',
		//     label: 'Transcation ID',
		//     options: {
		//         filter: false,
		//         sort: false,
		//     }
		// },
		// {
		//     name: 'sender',
		//     label: 'Sender ID',
		//     options: {
		//         filter: false,
		//         sort: false,
		//     }
		// },
		// {
		//     name: 'receiver',
		//     label: 'receiver ID',
		//     options: {
		//         filter: false,
		//         sort: false,
		//     }
		// },

		{
			name: "state",
			label: "Status",
			options: {
				// customFilterListOptions: {
				//     render: v => v.map(l => this.getCountryName(l)),
				// },
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = TransactionStatus;
						return (
							<div className="mb-3">
								<label
									htmlFor="choices-single-no-sorting"
									className="form-label font-size-13 text-muted"
								></label>
								<select
									value={filterList[index][0] || ""}
									onChange={(event) => {
										filterList[index][0] =
											event.target.value;
										onChange(
											filterList[index],
											index,
											column
										);
									}}
									className="form-control"
									name="choices-single-no-sorting"
								>
									<option disabled value="">
										Status
									</option>
									{optionValues.map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>
						);
					},
				},
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
					["user crypto withdrawal update"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["user crypto withdrawal update"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (value) => {
					return (
						<>
							<HasAnyPermission
								permission={["user crypto withdrawal update"]}
							>
								<button
									onClick={() =>
										this.handleEditWithdrawal(value)
									}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
						</>
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

	cryptoTranscationResultFormatter = (result) => {
		function userNameWrapper(user) {
			Object.assign(this, user);
		}
		userNameWrapper.prototype.toString = function () {
			return this._id
				? `${this.firstname} ${this.lastname}`
				: "Admin Transfer";
		};
		return result.data.docs.map((item) => {
			return {
				name: new userNameWrapper(item.user),
				email: item.user?.email,
				state: item.state,
				value: item.value,
				// senderAddress: item.senderAddress,
				// receiverAddress: item.receiverAddress,
				// txid: item.txid,
				fees: item.fees,
				rate: this.formatPrice(item.rate),
				coin: item.coin,
				txid_short: item.txid.substr(1, 8),
				date: moment(item.date).format("L LTS"),
				action: item,
			};
		});
	};

	expandableComponentCryptoTranscation = (rowData, rowMeta) => {
		const data = rowData[rowData.length - 1];
		return (
			<>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Transcation ID</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{" "}
						{isEmpty(data.txid) ? (
							"-"
						) : (
							<a
								href={`${this.getTxApi(data.coin)}/${
									data.txid
								}/`}
								rel="noopener noreferrer"
								target="_blank"
							>
								{data.txid}
							</a>
						)}{" "}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Sender Address</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{" "}
						{isEmpty(data.senderAddress)
							? "-"
							: data.senderAddress}{" "}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Receiver Address</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.receiverAddress) ? (
							"-"
						) : (
							<CopyToClipboard
								text={data.receiverAddress}
								style={{ cursor: "pointer" }}
								onCopy={() => this.handleTooltipOpen()}
							>
								<span style={{ cursor: "pointer" }}>
									{data.receiverAddress}
								</span>
							</CopyToClipboard>
						)}
					</td>
				</tr>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Destination Tag</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.destinationTag) ? (
							"-"
						) : (
							<CopyToClipboard
								text={data.destinationTag}
								style={{ cursor: "pointer" }}
								onCopy={() => this.handleTooltipOpen()}
							>
								<span style={{ cursor: "pointer" }}>
									{data.destinationTag}
								</span>
							</CopyToClipboard>
						)}
					</td>
				</tr>
			</>
		);
	};

	handleTooltipOpen = () => {
		toast.success("Copied to clipboard.");
	};

	handleChange = (event) => {
		let editData = this.state.editData;
		editData[event.target.name] = event.target.value;
		this.setState({ editData });
	};

	handleEditWithdrawal = (data) => {
		this.setState({ isModalOpen: true, editData: data });
	};

	closeDialog = () => {
		this.setState({ isModalOpen: false });
	};

	update = async (e) => {
		e.stopPropagation();
		e.preventDefault();
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then(async (result) => {
			if (result.value) {
				let editData = this.state.editData;
				this.props.updateCryptoWithdrawalRequest({
					_id: editData._id,
					status: editData.state,
					txid: editData.txid,
				});
				this.closeDialog();
				this.refreshCryptoTransactionTableData();
			}
		});
	};

	getTxApi = (type) => {
		let txApi = txBlockApi;
		if (type === "XRP") {
			txApi = txXrpApi;
		}
		if (type === "ETH") {
			txApi = txEthApi;
		}
		return txApi;
	};

	formatPrice(value) {
		var value_split = (value + "").split(".");
		var fraction = value_split[1];
		if (fraction === undefined) {
			fraction = "00";
		}
		value = value_split[0].replace(/[^0-9]/g, "");
		let val = (value / 1).toFixed(0).replace(".", ".");
		return (
			val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
			"." +
			fraction
		);
	}

	render() {
		
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Fiat Deposit | Bitex Admin</title>
					</MetaTags>
					<div className="container-fluid">
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
													permission={[
														"user crypto withdrawal list",
													]}
												>
													<div className="table-responsive">
														<ReactDataTable
															url={`${apiUrl}/api/admin/users/get-crypto-withdrawals`}
															columns={this.userCryptoTranscationColunms()}
															resultFormatter={
																this
																	.cryptoTranscationResultFormatter
															}
															renderExpandableRow={
																this
																	.expandableComponentCryptoTranscation
															}
															setRefresh={(
																refresh
															) =>
																(this.refreshCryptoTransactionTableData =
																	refresh)
															}
															expandableRows={
																true
															}
															customSearchRender={(
																searchText,
																handleSearch,
																hideSearch,
																options
															) => {
																return (
																	<CustomSearchRender
																		searchText={
																			searchText
																		}
																		onSearch={
																			handleSearch
																		}
																		onHide={
																			hideSearch
																		}
																		options={
																			options
																		}
																	/>
																);
															}}
															origin={
																"Crypto Withdrawals List"
															}
															rowsPerPage={10}
														/>
													</div>
												</HasAnyPermission>
											</div>
										</div>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
				</div>

				<Modal isOpen={this.state.isModalOpen} centered={true}>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Update</h5>
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
						<div className="mb-3">
							<label
								htmlFor="basicpill-firstname-input"
								className="form-label"
							>
								TranscationID
							</label>
							<input
								type="text"
								className="form-control"
								name="txid"
								value={this.state.editData?.txid}
								onChange={this.handleChange}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="choices-single-no-sorting"
								className="form-label font-size-13 text-muted"
							></label>
							<select
								value={this.state.editData?.state}
								onChange={this.handleChange}
								className="form-control"
								name="state"
							>
								<option disabled value="">
									Status
								</option>
								{TransactionStatus.map((item) => (
									<option key={item} value={item}>
										{item}
									</option>
								))}
							</select>
						</div>

						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-danger"
								onClick={() => this.closeDialog()}
							>
								Close
							</button>
							<button
								onClick={this.update}
								type="button"
								className="btn btn-primary"
							>
								Update
							</button>
						</div>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

CryptoWithdrawal.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	withdrawal: state.withdrawal,
});

export default connect(mapStateToProp, {
	updateCryptoWithdrawalRequest,
	clearResponse
})(withRouter(CryptoWithdrawal));
