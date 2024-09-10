import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import Countries from "../../common/Countries";
import ReactDataTable from "../../common/ReactDataTable";
import CustomSearchRender from "../../common/CustomSearchRender";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { apiUrl } from "../../config";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import { accountList } from "../../common/marketList";
import { getBitexSaving } from "../../store/bitexLend/actions";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
class BitexLend extends Component {
	componentDidMount = () => {
		this.props.getBitexSaving();
	};

	getCountryName = (val) => {
		const country = Countries.find((country) => country.sortname === val);
		return country ? country.name : val;
	};

	handleDateChange = (date) => {
		this.setState({ selectedDate: date });
	};

	toggleDateRangeModal = () => {
		this.setState({
			isOpenDateRangeModal: !this.state.isOpenDateRangeModal,
		});
	};

	formatToDate = (date) => {
		moment.defaultFormat = "MM/DD/YYYY";
		if (!isEmpty(date[0]))
			date[0] = moment(date[0], moment.defaultFormat).toDate();
		else date[0] = null;
		if (!isEmpty(date[1]))
			date[1] = moment(date[1], moment.defaultFormat).toDate();
		else date[1] = null;
		return date;
	};

	formatDateToString = (date) => {
		if (date[0]) date[0] = moment(date[0]).format("MM/DD/YYYY");
		else date[0] = null;
		if (date[1]) date[1] = moment(date[1]).format("MM/DD/YYYY");
		else date[1] = null;
		return date;
	};

	columns = [
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
									htmlFor="bitexlend-account"
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
									name="bitexlend-account"
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
			name: "lockDay",
			label: "Lock Duration",
			options: {
				// customFilterListOptions: {
				//     render: v => v.map(l => this.getCountryName(l)),
				// },
				filterType: "custom",
				filterOptions: {
					names: [],
					display: (filterList, onChange, index, column) => {
						const optionValues = ["7", "30", "90", "180"];
						return (
							<div className="mb-3">
								<label
									htmlFor="lock-duration"
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
									name="lock-duration"
								>
									<option disabled value="">
										Lock Duration
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
			name: "createdAt",
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
				sort: false,
			},
		},
		{
			name: "redemptionDate",
			label: "Redemption Date",
			options: {
				filter: false,
				sort: true,
			},
		},

		{
			name: "interestAmount",
			label: "Interest Amount",
			options: {
				filter: false,
				sort: true,
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
						const optionValues = ["finished", "transfer"];
						return (
							<div className="mb-3">
								<label
									htmlFor="bitexLend-status"
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
									name="bitexLend-status"
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

		// {
		//     label: 'Actions',
		//     name:'action',
		//     options: {
		//         filter: false,
		//         sort: false,
		//         empty: true,
		//         download: false,
		//         display: true,
		//         customBodyRender: (value) => {
		//             const user = JSON.parse(value);
		//             return (
		//                 <>
		//                     <a className="btn btn-success btn-circle" type="button"
		//                         href={`/users/${user._id}/edit`}>
		//                         <i className="fa fa-edit" data-toggle="tooltip" title="Edit User" />
		//                     </a>
		//                     &nbsp;

		//                     <button  className="btn btn-danger btn-circle"  data-toggle="tooltip"
		//                         title="Delete" type="button">
		//                         <i className="fa fa-times"></i>
		//                     </button>
		//                 </>
		//             )
		//         }
		//     },
		// },
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

	diffrenceInTwoDate = (createdAt) => {
		const now = moment();
		const date = moment(createdAt);
		return now.diff(date, "days");
	};

	getCoinInterestRate = (coin, numberOfDays) => {
		const coinData = this.props.bitexLend.bitexSavingPlans.find(
			(plan) => plan.coin === coin
		);

		if (!isEmpty(coinData)) {
			const day = coinData.days.find(
				(day) => day.numberOfDays === numberOfDays
			);
			return day.interestRate;
		}
		return "-";
	};

	bitexLendResultFormatter = (result) => {
		if (result.data) {
			function UserWrapper(user) {
				Object.assign(this, user);
			}
			UserWrapper.prototype.toString = function () {
				return `${this.firstname} ${this.lastname}`;
			};
			return result.data.docs.map((item) => {
				const duration = this.diffrenceInTwoDate(item.createdAt);
				const annualizedInterestRate = this.getCoinInterestRate(
					item.coin,
					item.lockDay
				);
				const redemptionDate = moment(item.redemptionDate).format(
					"L LTS"
				);

				return {
					name: new UserWrapper(item.user),
					email: item.user.email,
					coin: item.coin,
					amount: item.amount,
					lockDay: item.lockDay,
					duration: duration,
					annualizedInterestRate: annualizedInterestRate,
					createdAt: moment(item.createdAt).format("L LTS"),
					interestAmount: item.interestAmount,
					totalAmount: item.totalAmount,
					redemptionDate: redemptionDate,
					status: item.status,
					action: {
						...item,
						duration,
						annualizedInterestRate,
						redemptionDate,
					},
				};
			});
		} else {
			return [];
		}
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
					<td colSpan="2">Total Amount</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.totalAmount) ? (
							"-"
						) : (
							<CopyToClipboard
								text={data.totalAmount}
								style={{ cursor: "pointer" }}
								onCopy={() => this.handleTooltipOpen()}
							>
								<span style={{ cursor: "pointer" }}>
									{data.totalAmount}
								</span>
							</CopyToClipboard>
						)}
					</td>
				</tr>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Duration (days)</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.duration) ? (
							"-"
						) : (
							<CopyToClipboard
								text={data.duration}
								style={{ cursor: "pointer" }}
								onCopy={() => this.handleTooltipOpen()}
							>
								<span style={{ cursor: "pointer" }}>
									{data.duration}
								</span>
							</CopyToClipboard>
						)}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">Annualized Interest Rate</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{" "}
						{isEmpty(data.annualizedInterestRate)
							? "-"
							: data.annualizedInterestRate}{" "}
					</td>
				</tr>
			</>
		);
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Bitex Lend Orders | Bitex Admin</title>
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
											<HasAnyPermission
												permission={[
													"bitex lend orders list",
												]}
											>
												<div className="table-responsive">
													<ReactDataTable
														url={`${apiUrl}/api/admin/bitex-saving/get-bitex-saving-wallet-history`}
														columns={this.columns}
														resultFormatter={
															this
																.bitexLendResultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														expandableRows={true}
														renderExpandableRow={
															this
																.expandableComponent
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
														origin={"Lend Orders"}
														rowsPerPage={10}
													/>
												</div>
											</HasAnyPermission>
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

BitexLend.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	bitexLend: state.bitexLend,
});

export default connect(mapStateToProp, { getBitexSaving })(
	withRouter(BitexLend)
);
