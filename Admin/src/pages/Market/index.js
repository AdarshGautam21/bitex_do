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
} from "../../store/market/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class Market extends Component {
	state = {
		ajaxProcess: false,
		marketDetail: {
			name: "",
			displayName: "",
			priority: "",
			spreadBid: "",
			spreadAsk: "",
			min_amount: "",
			money: "",
			stock: "",
			fee_prec: "",
			money_prec: "",
			stock_prec: "",
			active: true,
			limitOrderRange: {
				min: "",
				max: "",
			},
			marketOrderRange: {
				min: "",
				max: "",
			},
			quantityRange: {
				min: "",
				max: "",
			},
			priceRange: {
				min: "",
				max: "",
			},
		},
		isModalOpen: false,
	};

	componentDidMount = () => {
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
			name: "displayName",
			label: "Display Name",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "spreadBid",
			label: "spreadBid",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "spreadAsk",
			label: "spreadAsk",
			options: {
				filter: false,
				sort: false,
			},
		},
		// {
		// 	name: "min_amount",
		// 	label: "min_amount",
		// 	options: {
		// 		filter: false,
		// 		sort: false,
		// 	},
		// },
		{
			name: "money",
			label: "money",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "stock",
			label: "stock",
			options: {
				filter: false,
				sort: false,
			},
		},
		// {
		// 	name: "fee_prec",
		// 	label: "fee_prec",
		// 	options: {
		// 		filter: false,
		// 		sort: false,
		// 	},
		// },
		// {
		// 	name: "money_prec",
		// 	label: "money_prec",
		// 	options: {
		// 		filter: false,
		// 		sort: false,
		// 	},
		// },
		// {
		// 	name: "stock_prec",
		// 	label: "stock_prec",
		// 	options: {
		// 		filter: false,
		// 		sort: false,
		// 	},
		// },
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
								this.toggleMarket(rowData._id);
							}}
							disabled={
								!hasPermission(
									["market update"],
									this.props.auth.currentUserRolePermissions
								)
							}
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
				download: false,
				display: hasPermission(
					["market update", "market delete", "market view"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["market update", "market delete", "market view"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (value) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={["market update", "market view"]}
							>
								<button
									onClick={(e) => this.openDilalog(value)}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission permission={["market delete"]}>
								<button
									onClick={(e) => this.removeMarket(value)}
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
					<td colSpan="2">min_amount</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.min_amount) ? "-" : data.min_amount}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">fee_prec</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.fee_prec) ? "-" : data.fee_prec}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">money_prec</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.money_prec) ? "-" : data.money_prec}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">stock_prec</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.stock_prec) ? "-" : data.stock_prec}
					</td>
				</tr>

				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">priority</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.priority) ? "-" : data.priority}
					</td>
				</tr>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">limitOrderRange</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.limitOrderRange)
							? "-"
							: `Min: ${data.limitOrderRange?.min}, Max: ${data.limitOrderRange?.max}`}
					</td>
				</tr>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">marketOrderRange</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.marketOrderRange)
							? "-"
							: `Min: ${data.marketOrderRange?.min}, Max: ${data.marketOrderRange?.max}`}
					</td>
				</tr>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">quantityRange</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.quantityRange)
							? "-"
							: `Min: ${data.quantityRange?.min}, Max: ${data.quantityRange?.max}`}
					</td>
				</tr>
				<tr className="MuiTableRow-root">
					<td colSpan="1"> </td>
					<td colSpan="2">priceRange</td>
					<td colSpan="6" style={{ wordBreak: "break-all" }}>
						{isEmpty(data.priceRange)
							? "-"
							: `Min: ${data.priceRange?.min}, Max: ${data.priceRange?.max}`}
					</td>
				</tr>
			</>
		);
	};

	resultFormatter = (result) => {
		return result.data.docs.map((item) => {
			return {
				name: item.name,
				displayName: item.displayName,
				priority: item.priority,
				spreadBid: item.spreadBid,
				spreadAsk: item.spreadAsk,
				min_amount: item.min_amount,
				money: item.money,
				stock: item.stock,
				fee_prec: item.fee_prec,
				money_prec: item.money_prec,
				stock_prec: item.stock_prec,
				active: { active: item.active, _id: item._id },
				updateDate: moment(item.updateDate).format("L LTS"),
				action: item,
			};
		});
	};

	removeMarket = (data) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete market?",
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

	toggleMarket = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update Market?",
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

	updateMarket = (event, data) => {
		const marketDetail = this.state.marketDetail;
		if (marketDetail?._id) this.props.update(marketDetail);
		else this.props.create(marketDetail);
		this.setState({
			isModalOpen: false,
			marketDetail: {
				name: "",
				displayName: "",
				priority: "",
				spreadBid: "",
				spreadAsk: "",
				min_amount: "",
				money: "",
				stock: "",
				fee_prec: "",
				money_prec: "",
				stock_prec: "",
				active: true,
				limitOrderRange: {
					min: "",
					max: "",
				},
				marketOrderRange: {
					min: "",
					max: "",
				},
				quantityRange: {
					min: "",
					max: "",
				},
				priceRange: {
					min: "",
					max: "",
				},
			},
		});
	};

	handleChange = (event) => {
		const marketDetail = this.state.marketDetail;
		marketDetail[event.target.name] = event.target.value;
		this.setState(marketDetail);
	};

	handleFieldChange = (name) => (event) => {
		const marketDetail = this.state.marketDetail;
		if (marketDetail[name] === undefined) {
			marketDetail[name] = {};
		}
		marketDetail[name][event.target.name] = event.target.value;
		this.setState({ marketDetail });
	};

	openDilalog = (editData = null) => {
		this.setState({
			isModalOpen: true,
			marketDetail: editData ? editData : this.state.marketDetail,
		});
	};

	closeDialog = () => {
		this.setState({ isModalOpen: false });
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["market update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["market add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.marketDetail?._id)
			return true;
		else if (isAddPermission && isEmpty(this.state.marketDetail._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.market.response?.message)) {
			toast.success(this.props.market.response.message, {
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
						<title>Market | Admin</title>
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
													permission={["market list"]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/market/get-market-with-pagination`}
														columns={this.columns()}
														resultFormatter={
															this.resultFormatter
														}
														expandableRows={true}
														renderExpandableRow={
															this
																.expandableComponent
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														origin={
															<div className="row">
																<div className="col-auto h4">
																	Market List
																	&nbsp;
																	<HasAnyPermission
																		permission={[
																			"market add",
																		]}
																	>
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
						<h5 className="modal-title mt-0">Market</h5>
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
								this.updateMarket(e, v);
							}}
							disabled={!this.couldHaveAddUpdatePermission()}
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
											value={this.state.marketDetail.name}
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
												this.state.marketDetail
													.displayName
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
											htmlFor="spreadBid"
											className="form-label"
										>
											spreadBid
										</label>
										<AvField
											type="text"
											className="form-control"
											name="spreadBid"
											value={
												this.state.marketDetail
													.spreadBid
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="spreadAsk"
											className="form-label"
										>
											spreadAsk
										</label>
										<AvField
											type="text"
											className="form-control"
											name="spreadAsk"
											value={
												this.state.marketDetail
													.spreadAsk
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
											htmlFor="min_amount"
											className="form-label"
										>
											Min Amount
										</label>
										<AvField
											type="text"
											className="form-control"
											name="min_amount"
											value={
												this.state.marketDetail
													.min_amount
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="fee_prec"
											className="form-label"
										>
											Fee Prec
										</label>
										<AvField
											type="text"
											className="form-control"
											name="fee_prec"
											value={
												this.state.marketDetail.fee_prec
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
											htmlFor="money"
											className="form-label"
										>
											money
										</label>
										<AvField
											type="text"
											className="form-control"
											name="money"
											value={
												this.state.marketDetail.money
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="money_prec"
											className="form-label"
										>
											money_prec
										</label>
										<AvField
											type="text"
											className="form-control"
											name="money_prec"
											value={
												this.state.marketDetail
													.money_prec
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
											htmlFor="stock"
											className="form-label"
										>
											stock
										</label>
										<AvField
											type="text"
											className="form-control"
											name="stock"
											value={
												this.state.marketDetail.stock
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>

								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="stock_prec"
											className="form-label"
										>
											stock_prec
										</label>
										<AvField
											type="text"
											className="form-control"
											name="stock_prec"
											value={
												this.state.marketDetail
													.stock_prec
											}
											onChange={this.handleChange}
										/>
									</div>
								</Col>
							</Row>

							<Row>
								<Col md={6}>
									<Row>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="min"
													className="form-label"
												>
													limitOrderRange (min)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="min"
													value={
														this.state.marketDetail
															.limitOrderRange
															?.min
													}
													onChange={this.handleFieldChange(
														"limitOrderRange"
													)}
												/>
											</div>
										</Col>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="priority"
													className="form-label"
												>
													limitOrderRange (max)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="max"
													value={
														this.state.marketDetail
															.limitOrderRange
															?.max
													}
													onChange={this.handleFieldChange(
														"limitOrderRange"
													)}
												/>
											</div>
										</Col>
									</Row>
								</Col>

								<Col md={6}>
									<Row>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="min"
													className="form-label"
												>
													marketOrderRange (min)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="min"
													value={
														this.state.marketDetail
															.marketOrderRange
															?.min
													}
													onChange={this.handleFieldChange(
														"marketOrderRange"
													)}
												/>
											</div>
										</Col>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="priority"
													className="form-label"
												>
													marketOrderRange (max)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="max"
													value={
														this.state.marketDetail
															.marketOrderRange
															?.max
													}
													onChange={this.handleFieldChange(
														"marketOrderRange"
													)}
												/>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<Row>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="min"
													className="form-label"
												>
													quantityRange (min)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="min"
													value={
														this.state.marketDetail
															.quantityRange?.min
													}
													onChange={this.handleFieldChange(
														"quantityRange"
													)}
												/>
											</div>
										</Col>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="priority"
													className="form-label"
												>
													quantityRange (max)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="max"
													value={
														this.state.marketDetail
															.quantityRange?.max
													}
													onChange={this.handleFieldChange(
														"quantityRange"
													)}
												/>
											</div>
										</Col>
									</Row>
								</Col>

								<Col md={6}>
									<Row>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="min"
													className="form-label"
												>
													priceRange (min)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="min"
													value={
														this.state.marketDetail
															.priceRange?.min
													}
													onChange={this.handleFieldChange(
														"priceRange"
													)}
												/>
											</div>
										</Col>
										<Col md={6}>
											<div className="mb-3">
												<label
													htmlFor="priority"
													className="form-label"
												>
													priceRange (max)
												</label>
												<AvField
													type="text"
													className="form-control"
													name="max"
													value={
														this.state.marketDetail
															.priceRange?.max
													}
													onChange={this.handleFieldChange(
														"priceRange"
													)}
												/>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<Col md={6}>
									<div className="mb-3">
										<label
											htmlFor="priority"
											className="form-label"
										>
											Priority
										</label>
										<AvField
											type="text"
											className="form-control"
											name="priority"
											value={
												this.state.marketDetail.priority
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
			</React.Fragment>
		);
	}
}

Market.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	market: state.market,
});

export default connect(mapStateToProp, {
	create,
	update,
	toggle,
	remove,
	clearResponse,
})(withRouter(Market));
