import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Input, Label } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import Countries from "../../common/Countries";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	toggleAgent,
	toggleSubAgent,
	toggleMarginTrading,
} from "../../store/user/actions";
import { toast } from "react-toastify";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

class Users extends Component {
	state = {
		ajaxProcess: false,
	};

	componentDidMount = () => {};

	getCountryName = (val) => {
		const country = Countries.find((country) => country.sortname === val);
		return country ? country.name : val;
	};

	verifyUserColunm = () => [
		{
			name: "name",
			label: "Name",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (user) => {
					return (
						<Link to={`/user-details/${user._id}`} className="">
							{`${user.firstname} ${user.lastname}`}
						</Link>
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
			name: "country",
			label: "Country",
			options: {
				customFilterListOptions: {
					render: (v) => v.map((l) => this.getCountryName(l)),
				},
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = Countries;
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
										Country
									</option>
									{optionValues.map((item) => (
										<option
											key={item.sortname}
											value={item.sortname}
										>
											{item.name}
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
			label: "Agent",
			name: "agent",
			options: {
				filter: false,
				sort: false,
				download: false,

				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"square-switch" + rowData._id + "agent"}
							disabled={
								!hasPermission(
									["user update"],
									this.props.auth.currentUserRolePermissions
								)
							}
							checked={rowData.agent}
							onChange={() => {
								this.toggleAgent(rowData._id);
							}}
						/>
						<Label
							htmlFor={"square-switch" + rowData._id + "agent"}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},
		{
			label: "Sub Agent",
			name: "subAgent",
			options: {
				filter: false,
				sort: false,
				download: false,

				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"square-switch" + rowData._id + "subAgent"}
							checked={rowData.subAgent}
							disabled={
								!hasPermission(
									["user update"],
									this.props.auth.currentUserRolePermissions
								)
							}
							onChange={() => this.toggleSubAgent(rowData._id)}
						/>
						<Label
							htmlFor={"square-switch" + rowData._id + "subAgent"}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},
		{
			label: "Margin Trading",
			name: "marginTrading",
			options: {
				filter: false,
				sort: false,
				download: false,

				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={
								"square-switch" + rowData._id + "margingTrading"
							}
							checked={rowData.marginTrading}
							disabled={
								!hasPermission(
									["user update"],
									this.props.auth.currentUserRolePermissions
								)
							}
							onChange={() =>
								this.toggleMarginTrading(rowData._id)
							}
						/>
						<Label
							htmlFor={
								"square-switch" + rowData._id + "margingTrading"
							}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},
		{
			label: "Created Date",
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
	];

	allUserColunms = () => [
		{
			name: "name",
			label: "Name",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (value) => {
					return (
						<Link to={`/user-details/${value._id}`} className="">
							{`${value.firstname} ${value.lastname}`}
						</Link>
					);
				},
			},
		},
		{
			name: "email",
			label: "Email",
			options: {
				customFilterListOptions: {
					render: (v) => v.map((l) => this.getCountryName(l)),
				},
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = [
							"Verified Users",
							"Document Submitted Users",
							"Suspended Users",
							"UnVerified Users",
						];
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
										Filter By
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
			name: "country",
			label: "Country",
			options: {
				customFilterListOptions: {
					render: (v) => v.map((l) => this.getCountryName(l)),
				},
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = Countries;
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
										Country
									</option>
									{optionValues.map((item) => (
										<option
											key={item.sortname}
											value={item.sortname}
										>
											{item.name}
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
			label: "Created Date",
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
					["user delete", "user view"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["user delete", "user view"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (value) => {
					return (
						<div className="text-center">
							<HasAnyPermission permission={["user view"]}>
								<a
									href={`/user-details/${value}`}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</a>
							</HasAnyPermission>
							&nbsp;
							{/* <HasAnyPermission permission={["user delete"]}>
								<button
									onClick={(e) => this.removeUser(e, value)}
									type="button"
									className="btn btn-soft-danger waves-effect waves-light"
								>
									<i className="bx bx-trash font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission> */}
						</div>
					);
				},
			},
		},
	];

	verifyUserResultFormatter = (result) => {
		return result.data.docs.map((item) => {
			function UserWrapper(user) {
				Object.assign(this, user);
			}
			UserWrapper.prototype.toString = function () {
				return `${this.firstname} ${this.lastname}`;
			};
			return {
				name: new UserWrapper(item),
				country: item.country,
				email: item.email,
				suspended: new UserWrapper(item),
				subAgent: { _id: item._id, subAgent: item.subAgent },
				marginTrading: {
					_id: item._id,
					marginTrading: item.marginTrading,
				},
				agent: { _id: item._id, agent: item.agent },
				createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
			};
		});
	};

	allUserResultFormatter = (result) => {
		return result.data.docs.map((item) => {
			function UserWrapper(user) {
				Object.assign(this, user);
			}
			UserWrapper.prototype.toString = function () {
				return `${this.firstname} ${this.lastname}`;
			};
			return {
				name: new UserWrapper(item),
				country: item.country,
				email: item.email,
				createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
				action: item._id,
			};
		});
	};

	removeUser = async (e, userEmail) => {
		e.stopPropagation();
		e.preventDefault();
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete user?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.setState({ ajaxProcess: true });
				// await this.props.deleteUser(userEmail);
				// await this.props.getUsers();
				this.setState({ ajaxProcess: false });
			}
		});
	};

	toggleAgent = async (userId) => {
		await this.props.toggleAgent(userId);
		if (this.props.user.toggleAgent) {
			toast.success(this.props.user.toggleAgent.message);
		}
		this.refreshVerifyUserTableData();
	};

	toggleSubAgent = async (userId) => {
		await this.props.toggleSubAgent(userId);
		if (this.props.user.toggleSubAgent) {
			toast.success(this.props.user.toggleSubAgent.message);
		}
		this.refreshVerifyUserTableData();
	};

	toggleMarginTrading = async (userId) => {
		await this.props.toggleMarginTrading(userId);
		if (this.props.user.toggleMarginTrading) {
			toast.success(this.props.user.toggleMarginTrading.message);
		}
		this.refreshVerifyUserTableData();
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Users | Bitex Admin</title>
					</MetaTags>
					<div className="container-fluid">
						{/* <Breadcrumbs title="User" breadcrumbItem="User List" /> */}
						<Row>
							<Col>
								<Card>
									{/* <CardHeader>
                            <CardTitle>Users </CardTitle>
                            <CardSubtitle>
                            </CardSubtitle>
                            </CardHeader> */}
									<CardBody>
										<div className="table-rep-plugin">
											<div
												className="table-responsive mb-0"
												data-pattern="priority-columns"
											>
												<ReactDataTable
													url={`${apiUrl}/api/admin/users/get-all-users`}
													columns={this.allUserColunms()}
													resultFormatter={
														this
															.allUserResultFormatter
													}
													// setRefresh={refresh => refreshTableData = refresh}
													origin={"User List"}
													originName={"User List"}
													rowsPerPage={10}
												/>
											</div>
										</div>
									</CardBody>
								</Card>
							</Col>
						</Row>

						<Row>
							<Col>
								<Card>
									{/* <CardHeader>
                            <CardTitle>Users </CardTitle>
                            <CardSubtitle>
                            </CardSubtitle>
                            </CardHeader> */}
									<CardBody>
										<div className="table-rep-plugin">
											<div
												className="table-responsive mb-0"
												data-pattern="priority-columns"
											>
												<ReactDataTable
													url={`${apiUrl}/api/admin/users/get-all-verify-users`}
													columns={this.verifyUserColunm()}
													resultFormatter={
														this
															.verifyUserResultFormatter
													}
													setRefresh={(refresh) =>
														(this.refreshVerifyUserTableData =
															refresh)
													}
													origin={"Verified Users"}
													originName={
														"Verified Users"
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
			</React.Fragment>
		);
	}
}

Users.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	user: state.user,
});

export default connect(mapStateToProp, {
	toggleAgent,
	toggleSubAgent,
	toggleMarginTrading,
})(withRouter(Users));
