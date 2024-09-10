import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Input, Label } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { updateFiatDeposit, clearResponse } from "../../store/deposit/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
	coinList,
	paymentTypeList,
	TransactionStatus,
} from "../../common/marketList";
import CustomSearchRender from "../../common/CustomSearchRender";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

class FiatDeposit extends Component {


	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.deposit.isUpdateFiatDeposit !== this.props.deposit.isUpdateFiatDeposit) {
			if(!isEmpty(this.props.deposit.isUpdateFiatDeposit)) {
				toast.success(this.props.deposit.response.message);
				this.props.clearResponse();
				this.refreshDepositTableData();
			}
		}

	};
	userDepositeColunms = () => [
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
			name: "paymentType",
			label: "Payment Type",
			options: {
				// customFilterListOptions: {
				//     render: v => v.map(l => this.getCountryName(l)),
				// },
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = paymentTypeList;
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
										Payment Type
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
			name: "amount",
			label: "Amount",
			options: {
				filter: false,
				sort: false,
			},
		},
		// {
		//     name: 'noteNumber',
		//     label: 'Note Number',
		//     options: {
		//         filter: false,
		//         sort: false,
		//     }
		// },
		{
			name: "referenceNumber",
			label: "Reference Number",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "status",
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
			label: "Date",
			name: "createdAt",
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
			label: "Actions",
			name: "action",
			options: {
				filter: false,
				sort: false,
				empty: true,
				download: false,
				display: hasPermission(
					["user fiat deposit update"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["user fiat deposit update"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (rowData) => {
					return (
						<HasAnyPermission
							permission={["user fiat deposit update"]}
						>
							<div className="d-flex flex-wrap gap-2">
								{rowData.status === "Pending" ? (
									<button
										onClick={() =>
											this.approveDepositeRequest(rowData)
										}
										type="button"
										className="btn btn-primary btn-rounded waves-effect waves-light"
									>
										Finish
									</button>
								) : rowData.status === "Cancelled" ? (
									<button
										type="button"
										disabled
										className="btn btn-primary btn-rounded waves-effect waves-light"
									>
										Cancelled
									</button>
								) : (
									<button
										type="button"
										disabled
										className="btn btn-primary btn-rounded waves-effect waves-light"
									>
										Finished
									</button>
								)}
								{rowData.status === "Pending" ||
								rowData.status === "Approved" ? (
									<button
										onClick={() =>
											this.cancelDepositeRequest(rowData)
										}
										type="button"
										className="btn btn-danger btn-rounded waves-effect waves-light"
									>
										Cancel
									</button>
								) : undefined}
							</div>
						</HasAnyPermission>
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
				download: false,
				viewColumns: false,
			},
		},
	];

	resultFormatter = (result) => {
		function userNameWrapper(user) {
			Object.assign(this, user);
		}
		userNameWrapper.prototype.toString = function () {
			return this._id
				? `${this.firstname} ${this.lastname}`
				: "Admin Transfer";
		};
		const unExpandedRows = [];
		const data = result.data.docs.map((item, index) => {
			if (!item?.paymentType) unExpandedRows.push(index);
			return {
				name: new userNameWrapper(item.user),
				email: item.user?.email,
				amount: item.amount,
				status: item.status,
				// type: (item?.type) ? item.type : '-',
				transactionId: item?.transactionId ? item.transactionId : "-",
				paymentType: item?.paymentType
					? item.paymentType
					: "Bank Transfer",
				referenceNumber: item?.referenceNumber
					? item.referenceNumber
					: "-",
				coin: item.coin,
				createdAt: moment(item.createdAt).format("L LTS"),
				action: item,
			};
		});
		return { data, unExpandedRows };
	};

	approveDepositeRequest = (depositRequest) => {
		Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to finish deposit Request?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.updateFiatDeposit("finished", depositRequest._id);
				this.refreshDepositTableData();
			}
		});
	};

	cancelDepositeRequest = (depositRequest) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to cancel deposit Request?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.updateFiatDeposit("canceled", depositRequest._id);
				this.refreshDepositTableData();
			}
		});
	};

	handleTooltipOpen = () => {
		toast.success("Copied to clipboard.");
	};

	expandableComponent = (rowData, rowMeta) => {
		const data = rowData[rowData.length - 1];
		return (
			<>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Transcation ID</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.transactionId) ? (
							"-"
						) : (
							<CopyToClipboard
								text={data.transactionId}
								style={{ cursor: "pointer" }}
								onCopy={() => this.handleTooltipOpen()}
							>
								<span style={{ cursor: "pointer" }}>
									{data.transactionId}
								</span>
							</CopyToClipboard>
						)}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">responseMsg</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{" "}
						{isEmpty(data.responseMsg)
							? "-"
							: data.responseMsg}{" "}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Referance Number</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.referenceNumber) ? (
							"-"
						) : (
							<CopyToClipboard
								x
								text={data.referenceNumber}
								style={{ cursor: "pointer" }}
								onCopy={() => this.handleTooltipOpen()}
							>
								<span style={{ cursor: "pointer" }}>
									{data.referenceNumber}
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
														"user fiat deposit list",
													]}
												>
													<div className="table-responsive">
														<ReactDataTable
															url={`${apiUrl}/api/admin/users/get-deposit-requests`}
															columns={this.userDepositeColunms()}
															resultFormatter={
																this
																	.resultFormatter
															}
															setRefresh={(
																refresh
															) =>
																(this.refreshDepositTableData =
																	refresh)
															}
															renderExpandableRow={
																this
																	.expandableComponent
															}
															expandableRows={
																true
															}
															isUnexpandedRows={
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
																"Deposit List"
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

FiatDeposit.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	deposit: state.deposit,
});

export default connect(mapStateToProp, {
	updateFiatDeposit,
	clearResponse,
})(withRouter(FiatDeposit));
