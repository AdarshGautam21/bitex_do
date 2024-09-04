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
	createTag as create,
	updateTag as update,
	removeTag as remove,
	toggleTag as toggle,
	clearResponse,
} from "../../store/article/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class Tag extends Component {
	state = {
		ajaxProcess: false,
		details: {
			name: "",
			active: true,
		},
		isModalOpen: false,
	};

	componentDidMount = () => {};

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
							id={"square-switch" + rowData._id}
							checked={rowData.active}
							onChange={() => {
								this.toggle(rowData._id);
							}}
							disabled={
								!hasPermission(
									["article update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"square-switch" + rowData._id}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
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
					["article update", "article delete", "article view"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["article update", "article delete", "article view"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (value) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={["article update", "article view"]}
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
							<HasAnyPermission permission={["article delete"]}>
								<button
									onClick={(e) => this.remove(value._id)}
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
				active: { _id: item._id, active: item.active },
				createdAt: moment(item.createdAt).format("L LTS"),
				action: item,
			};
		});
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete article tag?",
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
			text: "Do you really want to update article tag?",
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
			["article update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["article add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.article.response?.message)) {
			toast.success(this.props.article.response.message, {
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
						<title>Tag | Admin</title>
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
														"article list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/article-tags/get_article_tags`}
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
																	Academy Tag
																	List &nbsp;
																	<HasAnyPermission
																		permission={[
																			"article add",
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
						<h5 className="modal-title mt-0">Tag</h5>
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
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<AvField
									type="text"
									className="form-control"
									name="name"
									value={this.state.details.name}
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

Tag.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	article: state.article,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	toggle,
	clearResponse,
})(withRouter(Tag));
