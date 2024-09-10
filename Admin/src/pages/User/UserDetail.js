import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import moment from "moment";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	basicInfo,
	identityInfo,
	toggleVerification,
	toggleBlock,
	clearResponse,
	updatePassword,
	profileInfo,
	updateUserProfile,
} from "../../store/user/actions";
import {
	updateNotification,
	getNotifications,
} from "../../store/notification/actions";

import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import {
	Card,
	CardBody,
	Col,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
	Modal,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

//import images
import isEmpty from "../../validation/isEmpty";
import classnames from "classnames";
import PersonalInfo from "./PersonalInfo";
import BankInfo from "./BankInfo";
import Order from "./Order";
import LoginActivity from "./LoginActivity";
import WalletInfo from "./WalletInfo";
import CryptoTranscation from "./Deposit/CryptoDeposit";
import FiatDeposit from "./Deposit/FiatDeposit";
import FiatWithdrawal from "./Withdrawal/FiatWithdrawal";

class UserDetail extends Component {
	state = {
		ajaxProcess: false,
		activeTab: window.location.href.split("#")?.[1] ?? "PersonalInfo",
		userId: "",
		details: {
			id: "",
			password: "",
			confirmPassword: "",
		},
		isModalOpen: false,
	};

	componentDidMount = () => {
		this.props.basicInfo(this.props.match.params.id);
		this.props.identityInfo(this.props.match.params.id);
		this.props.profileInfo(this.props.match.params.id);
		this.setState({ userId: this.props.match.params.id });
		if (!isEmpty(window.location.href.split("#")?.[2])) {
			const notificatioinId = window.location.href.split("#")?.[2].trim();
			this.props.updateNotification({ _id: notificatioinId });
			setTimeout(() => {
				this.props.getNotifications();
			}, 300);
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (!isEmpty(this.props.response?.message)) {
			this.props.clearResponse();
			toast.success(this.props.response.message);
			this.props.identityInfo(this.props.match.params.id);
			this.props.basicInfo(this.props.match.params.id);
			this.props.profileInfo(this.props.match.params.id);
		}
		if (prevProps.match?.params.id !== this.props.match?.params.id) {
			this.setState({ userId: this.props.match.params.id });
			this.props.basicInfo(this.props.match.params.id);
			this.props.identityInfo(this.props.match.params.id);
			this.props.profileInfo(this.props.match.params.id);
			if (!isEmpty(window.location.href.split("#")?.[2])) {
				const notificatioinId = window.location.href
					.split("#")?.[2]
					.trim();
				this.props.updateNotification({ _id: notificatioinId });
				setTimeout(() => {
					this.props.getNotifications();
				}, 300);
			}
		}
		if (
			!isEmpty(window.location.href.split("#")?.[1]) &&
			window.location.href.split("#")[1] !== prevState.activeTab
		) {
			this.setState({ activeTab: window.location.href.split("#")?.[1] });
			this.props.basicInfo(this.props.match.params.id);
			this.props.identityInfo(this.props.match.params.id);
			this.props.profileInfo(this.props.match.params.id);
			if (!isEmpty(window.location.href.split("#")?.[2])) {
				const notificatioinId = window.location.href
					.split("#")?.[2]
					.trim();
				this.props.updateNotification({ _id: notificatioinId });
				setTimeout(() => {
					this.props.getNotifications();
				}, 300);
			}
		}
	};

	toggleTab = (tab) => {
		window.history.pushState({}, "", `#${tab}`);
		this.setState({ activeTab: tab });
	};

	toggleBlock = (data) => {
		const text = data?.suspended ? "un-block" : "block";
		Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to ${text} user?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.toggleBlock(data._id);
			}
		});
	};

	openModal = (id) => {
		const state = {
			isModalOpen: true,
		};
		state["details"] = { ...this.state.details, id: id };
		this.setState(state);
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
				password: "",
				confirmPassword: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	validateConfirmPassword = (value, ctx) => {
		return ctx.password === value ? true : "Need to match password.!";
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["admin update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["admin add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	changePassword = () => {
		let { details } = this.state;
		if (details?.id) this.props.updatePassword(details);
		this.closeModal();
	};

	toggleVerification = (data) => {
		const text = data?.approve ? "un-verify" : "verify";
		Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to ${text} user?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				const id = data?.userId
					? data.userId
					: this.props.userDetails.basicInfo._id;
				this.props.toggleVerification(id);
			}
		});
	};

	toggleEmailVerification = (data) => {
		const text = data?.emailVerified ? "un-verify" : "verify";
		Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to ${text} user email.?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				const id = data?.userId
					? data.userId
					: this.props.userDetails.basicInfo._id;
				this.props.updateUserProfile({ id: id });
			}
		});
	};

	render() {
		const { basicInfo, identityInfo, profileInfo } = this.props.userDetails;
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>
							{`${basicInfo.firstname} ${basicInfo.lastname}`} |
							Bitex Admin
						</title>
					</MetaTags>
					<div className="container-fluid">
						<Row>
							<Col xl={12} lg={12}>
								<Card>
									<CardBody>
										<Row>
											<div className="col-sm order-2 order-sm-1">
												<div className="d-flex align-items-start mt-3 mt-sm-0">
													<div className="flex-shrink-0">
														<div className="avatar-xl me-3">
															<img
																src={`${apiUrl}/api/guest/get_image/${basicInfo.avatar}`}
																alt=""
																className="img-fluid rounded-circle d-block"
															/>
														</div>
													</div>
													<div className="flex-grow-1">
														<div>
															<h5 className="font-size-16 mb-1">
																{`${basicInfo.firstname} ${basicInfo.lastname}`}
															</h5>
															<p className="text-muted font-size-13">
																{`${basicInfo.email}     ( ${basicInfo.phone} )`}
															</p>

															<div className="d-flex flex-wrap align-items-start gap-2 gap-lg-3 text-muted font-size-13">
																<div>
																	<ReactTooltip
																		id="approve"
																		type="info"
																		effect="float"
																		place="bottom"
																	>
																		<span>
																			{identityInfo.approve
																				? "Click to un-verify user account"
																				: "Click to verify user account"}
																		</span>
																	</ReactTooltip>
																	<button
																		type="button"
																		data-tip
																		data-for="approve"
																		disabled={
																			!hasPermission(
																				[
																					"user verification",
																				],
																				this
																					.props
																					.auth
																					.currentUserRolePermissions
																			)
																		}
																		className={`btn waves-effect btn-label waves-light w-sm ${
																			identityInfo.approve
																				? "btn-success"
																				: identityInfo.submitted
																				? "btn-warning"
																				: "btn-danger"
																		} label-icon`}
																		onClick={() =>
																			this.toggleVerification(
																				identityInfo
																			)
																		}
																	>
																		<i
																			className={`bx ${
																				identityInfo.approve
																					? "bx-check-double"
																					: "bx-x"
																			} label-icon`}
																		></i>{" "}
																		{identityInfo.approve
																			? "Account Verified"
																			: identityInfo.submitted
																			? "Verification Pending"
																			: "Verify"}
																	</button>
																</div>

																<div>
																	<ReactTooltip
																		id="approveEmail"
																		type="info"
																		effect="float"
																		place="bottom"
																	>
																		<span>
																			{profileInfo.emailVerified
																				? "Click to un-verify user email"
																				: "Click to verify user email"}
																		</span>
																	</ReactTooltip>
																	<button
																		type="button"
																		data-tip
																		data-for="approveEmail"
																		disabled={
																			!hasPermission(
																				[
																					"user verification",
																				],
																				this
																					.props
																					.auth
																					.currentUserRolePermissions
																			)
																		}
																		className={`btn waves-effect btn-label waves-light w-sm ${
																			profileInfo.emailVerified
																				? "btn-success"
																				: "btn-danger"
																		} label-icon`}
																		onClick={() =>
																			this.toggleEmailVerification(
																				identityInfo
																			)
																		}
																	>
																		<i
																			className={`bx ${
																				profileInfo.emailVerified
																					? "bx-check-double"
																					: "bx-x"
																			} label-icon`}
																		></i>{" "}
																		{profileInfo.emailVerified
																			? "Email Verified"
																			: "Email Verification Pending"}
																	</button>
																</div>

																<div>
																	<ReactTooltip
																		id="suspended"
																		type="info"
																		effect="float"
																		place="bottom"
																	>
																		<span>
																			{basicInfo.suspended
																				? "Click to un-block user account"
																				: "Click to block user account"}
																		</span>
																	</ReactTooltip>
																	<button
																		type="button"
																		data-tip
																		data-for="suspended"
																		disabled={
																			!hasPermission(
																				[
																					"user block un-block",
																				],
																				this
																					.props
																					.auth
																					.currentUserRolePermissions
																			)
																		}
																		className={`btn waves-effect btn-label waves-light w-sm ${
																			basicInfo.suspended
																				? "btn-success"
																				: "btn-danger"
																		} label-icon`}
																		onClick={() =>
																			this.toggleBlock(
																				basicInfo
																			)
																		}
																	>
																		<i
																			className={`bx ${
																				basicInfo.suspended
																					? "bx-check-double"
																					: "bx-x"
																			} label-icon`}
																		></i>{" "}
																		{basicInfo.suspended
																			? "Block"
																			: "Block"}
																	</button>
																</div>

																<div>
																	<ReactTooltip
																		id="twoFactorAuth"
																		type="info"
																		effect="float"
																		place="bottom"
																	>
																		<span>
																			{basicInfo.twoFactorAuth
																				? "Click to Disable 2FA"
																				: "2FA Disable"}
																		</span>
																	</ReactTooltip>
																	<button
																		type="button"
																		data-tip
																		data-for="twoFactorAuth"
																		className={`btn waves-effect btn-label waves-light w-sm ${
																			basicInfo.twoFactorAuth
																				? "btn-success"
																				: "btn-danger"
																		} label-icon`}
																		disabled={
																			identityInfo.twoFactorAuth
																				? false
																				: true
																		}
																	>
																		<i
																			className={`bx ${
																				identityInfo.twoFactorAuth
																					? "bx-check-double"
																					: "bx-x"
																			} label-icon`}
																		></i>{" "}
																		{identityInfo.twoFactorAuth
																			? "2FA"
																			: "2FA"}
																	</button>
																</div>

																<div>
																	<ReactTooltip
																		id="faceId"
																		type="info"
																		effect="float"
																		place="bottom"
																	>
																		<span>
																			{basicInfo.faceId
																				? "Enable FaceID"
																				: "Disable FaceID"}
																		</span>
																	</ReactTooltip>
																	<button
																		type="button"
																		data-tip
																		data-for="faceId"
																		className={`btn waves-effect btn-label waves-light w-sm ${
																			basicInfo.faceId
																				? "btn-success"
																				: "btn-danger"
																		} label-icon`}
																		disabled={
																			identityInfo.faceId
																				? false
																				: true
																		}
																	>
																		<i
																			className={`bx ${
																				identityInfo.faceId
																					? "bx-check-double"
																					: "bx-x"
																			} label-icon`}
																		></i>{" "}
																		{identityInfo.faceId
																			? "FaceID"
																			: "FaceID"}
																	</button>
																</div>

																{hasPermission(
																	[
																		"user change password",
																	],
																	this.props
																		.auth
																		.currentUserRolePermissions
																) && (
																	<div>
																		<ReactTooltip
																			id="userChangePassword"
																			type="info"
																			effect="float"
																			place="bottom"
																		>
																			<span>
																				Click
																				to
																				change
																				password
																			</span>
																		</ReactTooltip>
																		<button
																			type="button"
																			data-tip
																			data-for="userChangePassword"
																			className={`btn waves-effect  waves-light btn-primary w-sm label-icon`}
																			onClick={() =>
																				this.openModal(
																					basicInfo._id
																				)
																			}
																		>
																			Change
																			Password
																		</button>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="col-sm-auto order-1 order-sm-2">
												<div className="d-flex align-items-start justify-content-end gap-2">
													<div>
														{/* <button
															type="button"
															className="btn btn-soft-light"
														>
															<i className="me-1"></i>{" "}
															Message
														</button> */}
														<h5 className="font-size-16 mb-1">
															{`Account Open Date: ${moment(
																basicInfo.createdAt
															).format(
																"DD-MM-YYYY"
															)}`}
														</h5>
													</div>
												</div>
											</div>
										</Row>

										<Nav className="nav-tabs-custom card-header-tabs border-top mt-4">
											<NavItem>
												<NavLink
													to="#"
													className={classnames(
														{
															active:
																this.state
																	.activeTab ===
																"PersonalInfo",
														},
														"px-3"
													)}
													onClick={() => {
														this.toggleTab(
															"PersonalInfo"
														);
													}}
												>
													Personal Info
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													to="#"
													className={classnames(
														{
															active:
																this.state
																	.activeTab ===
																"BankInfo",
														},
														"px-3"
													)}
													onClick={() => {
														this.toggleTab(
															"BankInfo"
														);
													}}
												>
													Bank Info
												</NavLink>
											</NavItem>
											<HasAnyPermission
												permission={[
													"user wallet details view",
												]}
											>
												<NavItem>
													<NavLink
														to="#"
														className={classnames(
															{
																active:
																	this.state
																		.activeTab ===
																	"WalletInfo",
															},
															"px-3"
														)}
														onClick={() => {
															this.toggleTab(
																"WalletInfo"
															);
														}}
													>
														Wallet Info
													</NavLink>
												</NavItem>
											</HasAnyPermission>

											<HasAnyPermission
												permission={["user order list"]}
											>
												<NavItem>
													<NavLink
														to="#"
														className={classnames(
															{
																active:
																	this.state
																		.activeTab ===
																	"Orders",
															},
															"px-3"
														)}
														onClick={() => {
															this.toggleTab(
																"Orders"
															);
														}}
													>
														Orders
													</NavLink>
												</NavItem>
											</HasAnyPermission>

											<HasAnyPermission
												permission={[
													"user crypto deposit list",
													"user crypto withdrawal list",
												]}
											>
												<NavItem>
													<NavLink
														to="#"
														className={classnames(
															{
																active:
																	this.state
																		.activeTab ===
																	"CryptoTranscation",
															},
															"px-3"
														)}
														onClick={() => {
															this.toggleTab(
																"CryptoTranscation"
															);
														}}
													>
														Crypto Transcations
													</NavLink>
												</NavItem>
											</HasAnyPermission>

											<HasAnyPermission
												permission={[
													"user fiat deposit list",
												]}
											>
												<NavItem>
													<NavLink
														to="#"
														className={classnames(
															{
																active:
																	this.state
																		.activeTab ===
																	"FiatDepositTranscation",
															},
															"px-3"
														)}
														onClick={() => {
															this.toggleTab(
																"FiatDepositTranscation"
															);
														}}
													>
														Fiat Deposit
														Transcations
													</NavLink>
												</NavItem>
											</HasAnyPermission>
											<HasAnyPermission
												permission={[
													"user fiat withdrawal list",
												]}
											>
												<NavItem>
													<NavLink
														to="#"
														className={classnames(
															{
																active:
																	this.state
																		.activeTab ===
																	"FiatWithdrawalTranscation",
															},
															"px-3"
														)}
														onClick={() => {
															this.toggleTab(
																"FiatWithdrawalTranscation"
															);
														}}
													>
														Fiat Withdrawal
														Transcations
													</NavLink>
												</NavItem>
											</HasAnyPermission>
											<HasAnyPermission
												permission={["user view"]}
											>
												<NavItem>
													<NavLink
														to="#"
														className={classnames(
															{
																active:
																	this.state
																		.activeTab ===
																	"LoginActivity",
															},
															"px-3"
														)}
														onClick={() => {
															this.toggleTab(
																"LoginActivity"
															);
														}}
													>
														Login Activity
													</NavLink>
												</NavItem>
											</HasAnyPermission>
										</Nav>
									</CardBody>
								</Card>
								<TabContent activeTab={this.state.activeTab}>
									<TabPane tabId="PersonalInfo">
										<PersonalInfo
											userId={this.props.match.params.id}
										/>
									</TabPane>
									<TabPane tabId="BankInfo">
										<BankInfo
											userId={this.props.match.params.id}
										/>
									</TabPane>

									<TabPane tabId="WalletInfo">
										<WalletInfo
											userId={this.props.match.params.id}
										/>
									</TabPane>

									<TabPane tabId="FiatDepositTranscation">
										<FiatDeposit
											userId={this.props.match.params.id}
										/>
									</TabPane>

									<TabPane tabId="FiatWithdrawalTranscation">
										<FiatWithdrawal
											userId={this.props.match.params.id}
										/>
									</TabPane>

									<TabPane tabId="CryptoTranscation">
										<CryptoTranscation
											userId={this.props.match.params.id}
										/>
									</TabPane>

									<TabPane tabId="Orders">
										<Order
											userId={this.props.match.params.id}
										/>
									</TabPane>
									<TabPane tabId="LoginActivity">
										<LoginActivity
											userId={this.props.match.params.id}
										/>
									</TabPane>
								</TabContent>
							</Col>
						</Row>
					</div>
				</div>
				<Modal
					size="md"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Change Passoword</h5>
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
								this.changePassword(e, v);
							}}
							disabled={!this.couldHaveAddUpdatePermission()}
						>
							<div className="mb-3">
								<label
									htmlFor="password"
									className="form-label"
								>
									Password
								</label>
								<AvField
									type="password"
									className="form-control"
									name="password"
									value={this.state.details.password}
									onChange={this.handleChange}
									required
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="confirmPassword"
									className="form-label"
								>
									confirmPassword
								</label>
								<AvField
									type="password"
									className="form-control"
									name="confirmPassword"
									value={this.state.details.confirmPassword}
									onChange={this.handleChange}
									validate={{
										myValidation:
											this.validateConfirmPassword,
									}}
									required
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

UserDetail.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	userDetails: state.user.userDetails,
	response: state.user.response,
});

export default connect(mapStateToProp, {
	basicInfo,
	identityInfo,
	toggleVerification,
	toggleBlock,
	updatePassword,
	clearResponse,
	updateNotification,
	getNotifications,
	profileInfo,
	updateUserProfile,
})(withRouter(UserDetail));
