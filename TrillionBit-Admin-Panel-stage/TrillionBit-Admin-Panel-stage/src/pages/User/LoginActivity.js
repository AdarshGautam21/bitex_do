import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardBody } from "reactstrap";
import { withRouter } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import PropTypes from "prop-types";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
class LoginActivity extends Component {
	state = {
		ajaxProcess: false,
	};

	componentDidMount = () => {
		this.refreshTableData();
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.userId !== this.props.userId) {
			this.refreshTableData();
		}
	};

	colunms = () => [
		{
			name: "action",
			label: "Device",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (rowData) => (
					<div>
						{rowData.deviceType === "Mobile"
							? `${rowData.mobileVendor} (${rowData.mobileModel})`
							: `${rowData.browserName} (${rowData.fullBrowserVersion})`}
					</div>
				),
			},
		},

		{
			name: "userIp",
			label: "IP Address",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			name: "action",
			label: "OS Detail",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (rowData) => (
					<div>
						{rowData.osName} ({rowData.osVersion})
					</div>
				),
			},
		},
		{
			name: "logTime",
			label: "Log Time",
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
				viewColumns: false,
			},
		},
	];

	resultFormatter = (result) => {
		return result.data.docs.map((item) => {
			return {
				...item,
				logTime: moment(item.logTime).format("L LTS"),
				action: item,
			};
		});
	};

	render() {
		return (
			<React.Fragment>
				<Card>
					<CardBody>
						<div className="table-rep-plugin">
							<div
								className="table-responsive mb-0"
								data-pattern="priority-columns"
							>
								<ReactDataTable
									url={`${apiUrl}/api/admin/users/get-user-login-histories/${this.props.userId}`}
									columns={this.colunms()}
									resultFormatter={this.resultFormatter}
									setRefresh={(refresh) =>
										(this.refreshTableData = refresh)
									}
									origin={"Login Activity"}
									rowsPerPage={10}
								/>
							</div>
						</div>
					</CardBody>
				</Card>
			</React.Fragment>
		);
	}
}

LoginActivity.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProp, {})(withRouter(LoginActivity));
