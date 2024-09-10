import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Modal } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withRouter } from "react-router-dom";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	create,
	update,
	remove,
	clearResponse,
} from "../../store/tradingLevel/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";
import AedTradingLevel from "./AedTradingLevel";
import InrTradingLevel from "./InrTradingLevel";
import AgentTradingLevel from "./AgentTradingLevel";
import SubAgentTradingLevel from "./SubAgentTradingLevel";
import UsdTradingLevel from "./UsdTradingLevel";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class TradingLevel extends Component {
	state = {
		currentTraderLevel: "",
		details: {
			fromAmount: "",
			maker_fee: "",
			name: "",
			taker_fee: "",
			toAmount: "",
		},
		isModalOpen: false,
	};

	componentDidUpdate = (prevProps) => {
		if (prevProps.match.params.slug !== this.props.match.params.slug) {
			window.scrollTo(0, 0);
		}
	};

	columns = (currentTraderLevel) => [
		{
			name: "name",
			label: "Level",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "fromAmount",
			label: "From (AED)",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "toAmount",
			label: "To (AED)",
			options: {
				filter: false,
				sort: false,
			},
		},

		{
			name: "maker_fee",
			label: "Maker Fee (%)",
			options: {
				filter: false,
				sort: false,
			},
		},

		{
			name: "taker_fee",
			label: "Taker Fee (%)",
			options: {
				filter: false,
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
					[
						"trading level update",
						"trading level delete",
						"trading level view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"trading level update",
						"trading level delete",
						"trading level view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={[
									"trading level update",
									"trading level view",
								]}
							>
								<button
									onClick={(e) =>
										this.openModal(currentTraderLevel, data)
									}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission
								permission={["trading level delete"]}
							>
								<button
									onClick={(e) =>
										this.remove(
											data._id,
											currentTraderLevel
										)
									}
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
		return result.data.map((item) => {
			return {
				...item,
				action: item,
			};
		});
	};

	save = (event, data) => {
		const { details } = this.state;
		const additionalData = {
			...details,
			takerFee: details.taker_fee,
			makerFee: details.maker_fee,
			type: this.state.currentTraderLevel,
		};
		if (details?._id) {
			this.props.update(additionalData);
		} else {
			this.props.create(additionalData);
		}
		this.closeModal();
	};

	remove = (id, type) => {
		this.setState({
			currentTraderLevel: type,
		});
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete this trader?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.remove(id, type);
			}
		});
	};

	openModal = (name, data = null) => {
		this.setState({
			isModalOpen: true,
			currentTraderLevel: name,
			details: data === null ? this.state.details : data,
		});
	};

	closeModal = () => {
		this.setState({
			isModalOpen: false,
		});
		this.clearForm();
	};

	clearForm = () => {
		this.setState({
			details: {
				fromAmount: "",
				maker_fee: "",
				name: "",
				taker_fee: "",
				toAmount: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	refreshCurrentTableData = () => ({
		aed: this.aedRefreshTableData,
		inr: this.inrRefreshTableData,
		usd: this.usdRefreshTableData,
		agent: this.agentRefreshTableData,
		subAgent: this.subAgentRefreshTableData,
	});

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["trading level update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["trading level add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.tradingLevel.response?.message)) {
			toast.success(this.props.tradingLevel.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.refreshCurrentTableData()?.[
						this.state.currentTraderLevel
					]?.();
				},
			});
		}
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Trader Level | Admin</title>
					</MetaTags>
					<HasAnyPermission
						permission={[
							"trading level list",
							"trading level view",
						]}
					>
						<div className="container-fluid">
							{this.props.match.params.slug ===
							"aed-trading-level" ? (
								<AedTradingLevel
									columns={this.columns}
									resultFormatter={this.resultFormatter}
									setRefresh={(refresh) =>
										(this.aedRefreshTableData = refresh)
									}
									openModal={this.openModal}
									apiUrl={apiUrl}
								/>
							) : this.props.match.params.slug ===
							  "inr-trading-level" ? (
								<InrTradingLevel
									columns={this.columns}
									resultFormatter={this.resultFormatter}
									setRefresh={(refresh) =>
										(this.inrRefreshTableData = refresh)
									}
									openModal={this.openModal}
									apiUrl={apiUrl}
								/>
							) : this.props.match.params.slug ===
							  "usd-trading-level" ? (
								<UsdTradingLevel
									columns={this.columns}
									resultFormatter={this.resultFormatter}
									setRefresh={(refresh) =>
										(this.usdRefreshTableData = refresh)
									}
									openModal={this.openModal}
									apiUrl={apiUrl}
								/>
							) : this.props.match.params.slug ===
							  "agent-trading-level" ? (
								<AgentTradingLevel
									columns={this.columns}
									resultFormatter={this.resultFormatter}
									setRefresh={(refresh) =>
										(this.agentRefreshTableData = refresh)
									}
									openModal={this.openModal}
									apiUrl={apiUrl}
								/>
							) : this.props.match.params.slug ===
							  "subAgent-trading-level" ? (
								<SubAgentTradingLevel
									columns={this.columns}
									resultFormatter={this.resultFormatter}
									setRefresh={(refresh) =>
										(this.subAgentRefreshTableData =
											refresh)
									}
									openModal={this.openModal}
									apiUrl={apiUrl}
								/>
							) : null}
						</div>
					</HasAnyPermission>
				</div>

				<Modal
					size="md"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">{`${
							this.state.currentTraderLevel
								?.charAt(0)
								.toUpperCase() +
							this.state.currentTraderLevel?.slice(1)
						} Trader Level`}</h5>
						<button
							type="button"
							onClick={() => this.closeModal()}
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
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Level
								</label>
								<AvField
									type="text"
									className="form-control"
									name="name"
									value={this.state.details.name}
									onChange={this.handleChange}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="fromAmount"
									className="form-label"
								>
									From Amount
								</label>
								<AvField
									type="text"
									className="form-control"
									name="fromAmount"
									value={this.state.details.fromAmount}
									onChange={this.handleChange}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="toAmount"
									className="form-label"
								>
									To Amount
								</label>
								<AvField
									type="text"
									className="form-control"
									name="toAmount"
									value={this.state.details.toAmount}
									onChange={this.handleChange}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="maker_fee"
									className="form-label"
								>
									Maker Fee
								</label>
								<AvField
									type="text"
									className="form-control"
									name="maker_fee"
									value={this.state.details.maker_fee}
									onChange={this.handleChange}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="taker_fee"
									className="form-label"
								>
									Taker Fee
								</label>
								<AvField
									type="text"
									className="form-control"
									name="taker_fee"
									value={this.state.details.taker_fee}
									onChange={this.handleChange}
								/>
							</div>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => this.closeModal()}
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

TradingLevel.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	tradingLevel: state.tradingLevel,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	clearResponse,
})(withRouter(TradingLevel));
