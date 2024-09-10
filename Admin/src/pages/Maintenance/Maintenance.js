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
import makeAnimated from "react-select/animated";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	toggleMaintenance as toggle,
	clearResponse,
} from "../../store/maintenance/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

class Maintenance extends Component {
	state = {
		isModalOpen: false,
	};

	componentDidMount = () => {};

	componentDidUpdate = (prevProps, prevState) => {
		if (
			prevProps.maintenance.response !== this.props.maintenance.response
		) {
			if (!isEmpty(this.props.maintenance.response.message)) {
				toast.success(this.props.maintenance.response.message);
				this.props.clearResponse();
				this.refreshTableData();
			}
		}
	};
	columns = () => [
		{
			label: "Type",
			name: "type",
			options: {
				filter: true,
				sort: false,
			},
		},

		{
			name: "maintenance",
			label: "Maintenance Mode",
			options: {
				filter: false,
				sort: false,
				download: false,
				customBodyRender: (rowData) => (
					<div className="square-switch">
						<Input
							type="checkbox"
							switch="none"
							id={"square-switch-maintenance" + rowData._id}
							checked={rowData.maintenance}
							onChange={() => {
								this.toggle(rowData._id);
							}}
							disabled={
								!hasPermission(
									["maintenance update"],
									this.props.auth.currentUserRolePermissions
								)
							}
						/>
						<Label
							htmlFor={"square-switch-maintenance" + rowData._id}
							data-on-label="Yes"
							data-off-label="No"
						></Label>
					</div>
				),
			},
		},
	];

	resultFormatter = (result) => {
		return result.data.map((item) => {
			return {
				...item,
				maintenance: { _id: item._id, maintenance: item.maintenance },
				action: item,
			};
		});
	};

	toggle = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to update?",
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

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Maintenance | Admin</title>
					</MetaTags>
					<div className="container-fluid">
						<Row>
							<Col>
								<Card>
									<CardBody>
										<div className="table-rep-plugin">
											<div className="table-responsive">
												<HasAnyPermission
													permission={[
														"maintenance list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/maintenance/get-maintenance`}
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
																	Maintenance
																	List &nbsp;
																</div>
															</div>
														}
														rowsPerPage={1000}
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

Maintenance.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	maintenance: state.maintenance,
});

export default connect(mapStateToProp, {
	toggle,
	clearResponse,
})(withRouter(Maintenance));
