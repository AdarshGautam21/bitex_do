import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Row, Col, Card, CardBody, Modal } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import { withRouter } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	create,
	update,
	remove,
	clearResponse,
} from "../../store/announcement/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

class Announcements extends Component {
	state = {
		ajaxProcess: false,
		details: {
			announceTitle: "",
			announceDetails: "",
		},
		isModalOpen: false,
	};

	columns = () => [
		{
			name: "announceTitle",
			label: "Title",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "announceDetails",
			label: "Announcement",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "createdAt",
			label: "Date",
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
						"announcements update",
						"announcements delete",
						"announcements view",
					],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					[
						"announcements update",
						"announcements delete",
						"announcements view",
					],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (value) => {
					return (
						<div className="text-center">
							{/* <button
								onClick={(e) => this.openDilalog(value)}
								type="button"
								className="btn btn-soft-primary waves-effect waves-light"
							>
								<i className="bx bx-edit-alt font-size-16 align-middle"></i>
							</button> */}
							{/* &nbsp; */}
							<HasAnyPermission
								permission={["announcements delete"]}
							>
								<button
									onClick={(e) => this.remove(value)}
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
				createdAt: moment(item.createdAt).format("L LTS"),
				action: item,
			};
		});
	};

	remove = (data) => {
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

	save = (event, data) => {
		const details = this.state.details;
		if (details?._id) this.props.update(details);
		else this.props.create(details);
		this.setState({
			isModalOpen: false,
			details: {
				announceTitle: "",
				announceDetails: "",
			},
		});
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState(details);
	};

	openDilalog = (editData = null) => {
		this.setState({
			isModalOpen: true,
			details: editData ? editData : this.state.details,
		});
	};

	closeDialog = () => {
		this.setState({ isModalOpen: false });
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["announcements update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["announcements add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.announcement.response?.message)) {
			toast.success(this.props.announcement.response.message, {
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
						<title>Announcements | Admin</title>
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
														"announcements list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/users/get_announcements`}
														columns={this.columns()}
														resultFormatter={
															this.resultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														disableFilterIcon={true}
														disableSearchIcon={true}
														origin={
															<div className="row">
																<div className="col-auto h4">
																	Announcements
																	List &nbsp;
																	<HasAnyPermission
																		permission={[
																			"announcements add",
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
														rowsPerPage={100}
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
					size="md"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Announcements</h5>
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
								this.save(e, v);
							}}
							disabled={!this.couldHaveAddUpdatePermission()}
						>
							<div className="mb-3">
								<label
									htmlFor="announceTitle"
									className="form-label"
								>
									Title
								</label>
								<AvField
									type="text"
									className="form-control"
									name="announceTitle"
									value={this.state.details.announceTitle}
									onChange={this.handleChange}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="announceDetails"
									className="form-label"
								>
									Announce Details
								</label>
								<AvField
									type="textarea"
									className="form-control"
									name="announceDetails"
									value={this.state.details.announceDetails}
									onChange={this.handleChange}
								/>
							</div>

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

Announcements.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	announcement: state.announcement,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	clearResponse,
})(withRouter(Announcements));
