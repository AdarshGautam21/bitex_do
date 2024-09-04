import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import PropTypes from "prop-types";
// import { updateFiatDeposit } from "../../store/deposit/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { accountList, TransactionStatus } from "../../common/marketList";
import CustomSearchRender from "../../common/CustomSearchRender";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
const txBlockApi = "https://live.blockcypher.com/btc/tx";
const txXrpApi = "https://xrpscan.com/tx";
const txEthApi = "https://etherscan.io/tx";

class CryptoDeposit extends Component {
	state = {
		ajaxProcess: false,
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
						const optionValues = accountList;
						return (
							<div className="mb-3">
								<label
									htmlFor="order-market"
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
									name="order-market"
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
				download: false,
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
				state: item.state,
				value: item.value,
				email: item.user?.email,
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
				<tr>
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

				<tr>
					<td colSpan="1"> </td>
					<td colSpan="2">Sender Address</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{" "}
						{isEmpty(data.senderAddress)
							? "-"
							: data.senderAddress}{" "}
					</td>
				</tr>

				<tr>
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
				<tr>
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
														"user crypto deposit list",
													]}
												>
													<div className="table-responsive">
														<ReactDataTable
															url={`${apiUrl}/api/admin/users/get-crypto-deposite`}
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
																"Crypto Deposit List"
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
			</React.Fragment>
		);
	}
}

CryptoDeposit.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	deposit: state.deposit,
});

export default connect(mapStateToProp, {
	// updateFiatDeposit,
})(withRouter(CryptoDeposit));
