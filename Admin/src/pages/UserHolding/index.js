import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Input, Label } from "reactstrap";
import { withRouter } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import ReactDataTable from "../../common/ReactDataTable";
import { accountList } from "../../common/marketList";
import { apiUrl } from "../../config";
import PropTypes from "prop-types";
import CustomSearchRender from "../../common/CustomSearchRender";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

class UserHolding extends Component {
	state = {
		ajaxProcess: false,
	};

	componentDidMount = () => {};

	formatPrice(value) {
		value = parseFloat(value).toFixed(8);
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

	colunms = () => [
		{
			name: "name",
			label: "Name",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (value) => {
					return (
						<a
							style={{ textDecoration: "none" }}
							href={`/user-details/${value?._id}`}
						>
							{`${value?.firstname} ${value?.lastname}`}
						</a>
					);
				},
			},
		},
		{
			name: "name",
			label: "Email",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (value) => {
					return (
						<a
							style={{ textDecoration: "none" }}
							href={`/user-details/${value?._id}`}
						>
							{value?.email}
						</a>
					);
				},
			},
		},

		{
			name: "coin",
			label: "Account",
			options: {
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = ["INR", "AED", ...accountList];
						return (
							<div className="mb-3">
								<label
									htmlFor="order-market"
									className="form-label font-size-13 text-muted"
								></label>
								<select
									value={filterList[index][0] || "BTC"}
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
			name: "walletAmount",
			label: "Balance",
			options: {
				sort: false,
				filter: false,
			},
		},

		{
			name: "walletAddress",
			label: "Wallet Address",
			options: {
				sort: false,
				filter: false,
			},
		},

		{
			name: "date",
			label: "Date",
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
		return result.data.docs.map((item) => {
			return {
				name: item.user,
				...item,
				walletAmount: this.formatPrice(item.walletAmount),
				date: moment(item.createdAt).format("L LTS"),
				action: item,
			};
		});
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>User Holdings | Bitex Admin</title>
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
												<HasAnyPermission
													permission={[
														"user order list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/users/get-all-user-wallet-balance`}
														columns={this.colunms()}
														resultFormatter={
															this.resultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														origin={
															"UserHoldings List"
														}
														rowsPerPage={10}
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
			</React.Fragment>
		);
	}
}

UserHolding.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProp, {})(withRouter(UserHolding));
