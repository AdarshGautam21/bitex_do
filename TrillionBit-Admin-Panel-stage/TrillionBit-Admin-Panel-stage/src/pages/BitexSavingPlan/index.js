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
	Modal,
	Table,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
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
} from "../../store/bitexLend/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import DaysIntrestRateField from "./DaysIntrestRateField";
import { accountList } from "../../common/marketList";

class BitexSavingPlan extends Component {
	state = {
		details: {
			coin: "",
			name: "",
			annualizedInterestRate: "",
			active: true,
			days: [
				{
					numberOfDays: "7",
					interestRate: "",
				},
				{
					numberOfDays: "30",
					interestRate: "",
				},
				{
					numberOfDays: "90",
					interestRate: "",
				},
				{
					numberOfDays: "180",
					interestRate: "",
				},
			],
		},
		currentDays: "",
		changeCurrentDays: "",
		isModalOpen: false,
		isAddDayModalOpen: false,
		isChangeDayModalOpen: false,
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
										Coin
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
			label: "Days & Interest Rate",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="table-responsive">
						<Table className="table mb-0">
							<thead className="table-light">
								<tr>
									<th>Days</th>
									<th>Intrest Rate(%)</th>
								</tr>
							</thead>
							<tbody>
								{rowData.days?.map((item) => (
									<>
										<tr>
											<td>{item.numberOfDays}</td>
											<td>{item.interestRate}</td>
										</tr>
									</>
								))}
							</tbody>
						</Table>
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
								this.toggle(rowData._id);
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
				display: hasPermission(
					[
						"bitex lend plan update",
						"bitex lend plan delete",
						"bitex lend plan view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"bitex lend plan update",
						"bitex lend plan delete",
						"bitex lend plan view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={[
									"bitex lend plan update",
									"bitex lend plan view",
								]}
							>
								<button
									onClick={(e) =>
										this.openModal("isModalOpen", data)
									}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission
								permission={["bitex lend plan delete"]}
							>
								<button
									onClick={(e) => this.remove(data._id)}
									type="button"
									className="btn btn-soft-danger waves-effect waves-light"
								>
									<i className="bx bx-trash font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
						</div>
					);
				},
			},
		},
	];

	resultFormatter = (result) => {
		return result.data.docs.map((item) => {
			return {
				...item,
				createdAt: moment(item.createdAt).format("L LTS"),
				active: { _id: item._id, active: item.active },
				action: item,
			};
		});
	};

	save = (event, data) => {
		const { details } = this.state;
		if (details?._id) this.props.update(details);
		else this.props.create(details);
		this.closeModal("isModalOpen");
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete Plan?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.remove(id);
			}
		});
	};

	toggle = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update BitexSavingPlan?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.toggle(id);
			}
		});
	};

	openModal = (name, data = null) => {
		if (name === "isChangeDayModalOpen")
			this.setState({
				currentDays: data.numberOfDays,
				changeCurrentDays: data.numberOfDays,
				isChangeDayModalOpen: true,
			});
		else if (name === "isModalOpen" && data) {
			this.setState({
				isModalOpen: true,
				details: data,
			});
		} else {
			this.setState({
				[name]: true,
			});
		}
	};

	closeModal = (modalName) => {
		if (
			modalName === "isAddDayModalOpen" ||
			modalName === "isAddModalOpen"
		) {
			this.setState({
				currentDay: "",
				changeCurrentDays: "",
				isChangeDayModalOpen: false,
				isAddDayModalOpen: false,
			});
		} else {
			this.setState({
				isModalOpen: false,
				details: {
					coin: "",
					name: "",
					annualizedInterestRate: "",
					active: true,
					days: [
						{
							numberOfDays: "7",
							interestRate: "",
						},
						{
							numberOfDays: "30",
							interestRate: "",
						},
						{
							numberOfDays: "90",
							interestRate: "",
						},
						{
							numberOfDays: "180",
							interestRate: "",
						},
					],
				},
			});
		}
	};

	handleChangeIntrestRate = (event) => {
		const details = this.state.details;
		const index = details.days.findIndex(
			(data) => data.numberOfDays === event.target.name
		);
		details.days[index] = {
			numberOfDays: event.target.name,
			interestRate: event.target.value,
		};
		this.setState({ details });
	};

	handleChange = (event) => {
		if (event.target.name !== "changeCurrentDays") {
			const details = this.state.details;
			details[event.target.name] = event.target.value;
			this.setState({ details });
		} else {
			this.setState({ changeCurrentDays: event.target.value });
		}
	};

	editDays = () => {
		const details = this.state.details;
		const index = details.days.findIndex(
			(data) => data.numberOfDays === this.state.currentDays
		);
		details.days[index]["numberOfDays"] = this.state.changeCurrentDays;
		this.setState({
			details,
			currentDays: "",
			changeCurrentDays: "",
			isChangeDayModalOpen: false,
		});
	};

	addDays = () => {
		const details = this.state.details;
		details.days = [
			...details.days,
			{
				numberOfDays: this.state.changeCurrentDays,
				interestRate: "",
			},
		];
		this.setState({
			details,
			currentDays: "",
			changeCurrentDays: "",
			isAddDayModalOpen: false,
		});
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["bitex lend plan update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["bitex lend plan add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.bitexLend.response?.message)) {
			toast.success(this.props.bitexLend.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.refreshTableData();
				},
			});
		}
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Bitex Saving Plan | Admin</title>
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
														"bitex lend plan list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/bitex-saving/get-bitex-saving-plan-with-pagination`}
														columns={this.columns()}
														resultFormatter={
															this.resultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														origin={
															<div className="row">
																<div className="col-auto h4">
																	Bitex Saving
																	Plan List
																	&nbsp;
																	<HasAnyPermission
																		permission={[
																			"bitex lend plan add",
																		]}
																	>
																		<button
																			onClick={(
																				e
																			) =>
																				this.openModal(
																					"isModalOpen"
																				)
																			}
																			type="button"
																			className="btn btn-soft-primary waves-effect waves-light"
																		>
																			<i className="bx bx-plus-medical font-size-16 align-middle"></i>
																		</button>
																	</HasAnyPermission>
																</div>
															</div>
														}
														rowsPerPage={10}
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

				<Modal
					size="xl"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">BitexSavingPlan</h5>
						<button
							type="button"
							onClick={() => this.closeModal("isModalOpen")}
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
							disabled={!this.couldHaveAddUpdatePermission()}
						>
							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="coin"
											className="form-label"
										>
											Coin
										</label>
										<AvField
											type="text"
											className="form-control"
											name="coin"
											value={this.state.details.coin}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="name"
											className="form-label"
										>
											Coin Name
										</label>
										<AvField
											type="text"
											className="form-control"
											name="name"
											value={this.state.details.name}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>
							<Row>
								<DaysIntrestRateField
									days={this.state.details.days}
									handleChangeIntrestRate={
										this.handleChangeIntrestRate
									}
									openModal={this.openModal}
								/>
							</Row>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() =>
										this.closeModal("isModalOpen")
									}
								>
									Close
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={() =>
										this.openModal("isAddDayModalOpen")
									}
								>
									Add Day
								</button>

								{this.couldHaveAddUpdatePermission() && (
									<button
										type="submit"
										className="btn btn-primary"
									>
										Save
									</button>
								)}
							</div>
						</AvForm>
					</div>
				</Modal>

				<Modal
					size="sm"
					isOpen={
						this.state.isChangeDayModalOpen ||
						this.state.isAddDayModalOpen
					}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">
							{this.state.isChangeDayModalOpen
								? "Change Day"
								: "Add Day"}
						</h5>
						<button
							type="button"
							onClick={() => this.closeModal("isAddDayModalOpen")}
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
								this.state.isAddDayModalOpen
									? this.addDays()
									: this.editDays();
							}}
						>
							<div className="mb-3">
								<label htmlFor="coin" className="form-label">
									Number of Days
								</label>
								<AvField
									type="number"
									className="form-control"
									name="changeCurrentDays"
									onChange={this.handleChange}
									value={this.state.changeCurrentDays}
								/>
							</div>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() =>
										this.closeModal("isAddDayModalOpen")
									}
								>
									Close
								</button>
								<button
									type="submit"
									className="btn btn-primary"
								>
									{this.state.isChangeDayModalOpen
										? "Change"
										: "Add"}
								</button>
							</div>
						</AvForm>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

BitexSavingPlan.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	bitexLend: state.bitexLend,
});

export default connect(mapStateToProp, {
	create,
	update,
	toggle,
	remove,
	clearResponse,
})(withRouter(BitexSavingPlan));
