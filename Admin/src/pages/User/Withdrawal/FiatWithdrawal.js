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
	CardHeader,
	CardTitle,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../../common/Permission";
import hasPermission from "../../../common/HasPermission";
import ReactDataTable from "../../../common/ReactDataTable";
import { apiUrl } from "../../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { updateWithdrawalRequest, clearResponse } from "../../../store/withdrawal/actions";
import { toast } from "react-toastify";
import isEmpty from "../../../validation/isEmpty";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { coinList, TransactionStatus } from "../../../common/marketList";
import { basicInfo } from "../../../store/user/actions";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
class FiatWithdrawal extends Component {
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.userId !== this.props.userId) {
			this.refreshTableData();
		}
		if (prevProps.withdrawal.isUpdateFiatWithdrawal !== this.props.withdrawal.isUpdateFiatWithdrawal) {
			if (!isEmpty(this.props.withdrawal.isUpdateFiatWithdrawal)) {
				toast.success(this.props.withdrawal.response.message);
				this.props.clearResponse();
				this.refreshTableData();

			}
		}
		
	};

	userWithdrawalColunms = () => [
		{
			name: "coin",
			label: "Account",
			options: {
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
			name: "amount",
			label: "Amount",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "noteNumber",
			label: "Note Number",
			options: {
				filter: false,
				sort: false,
			},
		},
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
					["user fiat withdrawal update"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["user fiat withdrawal update"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (rowData) => {
					return (
						<HasAnyPermission
							permission={["user fiat withdrawal update"]}
						>
							<div className="d-flex flex-wrap gap-2">
								{rowData.status === "Pending" ? (
									<button
										onClick={() =>
											this.approveWithdrawalRequest(
												rowData
											)
										}
										type="button"
										className="btn btn-primary btn-rounded waves-effect waves-light"
									>
										Approve
									</button>
								) : rowData.status === "Approved" ? (
									<button
										onClick={() =>
											this.approveWithdrawalRequest(
												rowData
											)
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
										className="btn btn-danger btn-rounded waves-effect waves-light"
									>
										Cancelled
									</button>
								) : rowData.status === "Finished" ? (
									<button
										type="button"
										disabled
										className="btn btn-primary btn-rounded waves-effect waves-light"
									>
										Finished
									</button>
								) : (
									<button
										type="button"
										disabled
										className="btn btn-danger btn-rounded waves-effect waves-light"
									>
										Cancelled
									</button>
								)}
								{rowData.status === "Pending" ||
								rowData.status === "Approved" ? (
									<button
										onClick={() =>
											this.cancelWithdrawalRequest(
												rowData
											)
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
	];

	withdrawalResultFormatter = (result) => {
		return result.data.docs.map((item) => {
			return {
				amount: item.amount,
				status: item.status,
				noteNumber: item?.noteNumber ? item.noteNumber : "-",
				referenceNumber: item?.referenceNumber
					? item.referenceNumber
					: "-",
				coin: item.coin,
				createdAt: moment(item.createdAt).format("L LTS"),
				action: item,
			};
		});
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

	approveWithdrawalRequest = async (withdrawalRequest) => {
		const msg =
			withdrawalRequest.status === "Pending" ? "approve" : "finish";
		Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to ${msg} withdrawal Request?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then(async (result) => {
			if (result.value) {
				if (withdrawalRequest.status === "Pending") {
					await this.props.updateWithdrawalRequest(
						"approved",
						withdrawalRequest._id
					);
				}
				if (withdrawalRequest.status === "Approved") {
					await this.props.updateWithdrawalRequest(
						"finished",
						withdrawalRequest._id
					);
				}
				if (this.props.withdrawal.updateFiatWithdrawal) {
					toast.success(
						this.props.withdrawal.updateFiatWithdrawal?.message
					);
				}
				this.refreshTableData();
			}
		});
	};

	cancelWithdrawalRequest = async (withdrawalRequest) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to cancel withdrawal Request?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then(async (result) => {
			if (result.value) {
				await this.props.updateWithdrawalRequest(
					"canceled",
					withdrawalRequest._id
				);
				if (this.props.withdrawal.updateFiatWithdrawal) {
					toast.success(
						this.props.withdrawal.updateFiatWithdrawal?.message
					);
				}
				this.refreshTableData();
			}
		});
	};

	handleTooltipOpen = () => {
		toast.success("Copied to clipboard.");
	};

	render() {
		return (
			<React.Fragment>
				<Card>
					{/* <CardHeader>
						<CardTitle className="mb-0">Fiat Withdrawal</CardTitle>
					</CardHeader> */}
					<CardBody>
						<div className="table-rep-plugin">
							<div
								className="table-responsive mb-0"
								data-pattern="priority-columns"
							>
								<HasAnyPermission
									permission={["user fiat withdrawal list"]}
								>
									<div className="table-responsive">
										<ReactDataTable
											url={`${apiUrl}/api/admin/users/get_withdrawal_requests/${this.props.userId}`}
											columns={this.userWithdrawalColunms()}
											resultFormatter={
												this.withdrawalResultFormatter
											}
											setRefresh={(refresh) =>
												(this.refreshTableData =
													refresh)
											}
											downloadOptions={{
												filename: `fiat withdraw-${
													this.props.userDetails
														.basicInfo?.email
														? this.props.userDetails
																.basicInfo
																.email + ".csv"
														: "tableDownload.csv"
												}`,
											}}
											// customSearchRender={(
											// 	searchText,
											// 	handleSearch,
											// 	hideSearch,
											// 	options
											// ) => {
											// 	return (
											// 		<CustomSearchRender
											// 			searchText={
											// 				searchText
											// 			}
											// 			onSearch={
											// 				handleSearch
											// 			}
											// 			onHide={
											// 				hideSearch
											// 			}
											// 			options={
											// 				options
											// 			}
											// 		/>
											// 	);
											// }}
											origin={"Withdrawal List"}
											rowsPerPage={10}
										/>
									</div>
								</HasAnyPermission>
							</div>
						</div>
					</CardBody>
				</Card>
			</React.Fragment>
		);
	}
}

FiatWithdrawal.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	withdrawal: state.withdrawal,
	userDetails: state.user.userDetails,
});

export default connect(mapStateToProp, {
	updateWithdrawalRequest,
	basicInfo,
	clearResponse
})(withRouter(FiatWithdrawal));
