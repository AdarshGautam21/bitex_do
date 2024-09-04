import React, { Component } from "react";
import axios from "axios";
import MUIDataTable, { ExpandButton } from "mui-datatables";
// import { Button, CircularProgress } from '@material-ui/core';
import {
	Button,
	CircularProgress,
	MuiThemeProvider,
	createMuiTheme,
} from "@material-ui/core";

const CancelToken = axios.CancelToken;
let cancel;

export default class ReactDataTable extends Component {
	constructor(props) {
		super(props);
		const { rowsPerPage, filters } = props;
		this.state = {
			data: [],
			page: 1,
			count: 0,
			rowsPerPage: rowsPerPage ? rowsPerPage : 10,
			searchText: "",
			sort: "",
			sortColumn: "",
			filters: [],
			url: "",
			isLoading: false,
			rowsExpanded: [],
			unExpandedRows: [],
			noMatch: (
				<CircularProgress size={30} style={{ color: "#3f51b5" }} />
			),
		};
	}

	UNSAFE_componentWillMount = () => {
		this.getDataList();
		if (this.props.setRefresh) {
			this.props.setRefresh(this.getDataList);
		}
	};

	componentDidMount = () => {};

	getDataList = async () => {
		await this.setState({
			noMatch: (
				<CircularProgress size={30} style={{ color: "#3f51b5" }} />
			),
			isLoading: true,
			data: [],
		});

		if (this.props.url === this.state.url) {
			cancel && cancel();
		}
		try {
			let filters = this.state.filters;
			if (this.props?.filters?.length)
				filters = [...filters, ...this.props.filters];
			const params = {
				admin_statistics: true,
				filters: JSON.stringify(filters),
				search: this.state.searchText.trim(),
				sort: this.state.sort,
				sortColumn: this.state.sortColumn,
				rows: this.state.rowsPerPage,
				page: this.state.page,
			};
			const result = await axios.get(this.props.url, {
				params,
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				}),
			});
			if (result.status === 200) {
				let data,
					unExpandedRows = [];
				if (
					this.props?.expandableRows &&
					this.props?.isUnexpandedRows
				) {
					const formatData = this.props.resultFormatter(result);
					data = Array.isArray(formatData)
						? formatData
						: formatData.data;
					unExpandedRows = formatData.unExpandedRows
						? formatData.unExpandedRows
						: [];
				} else {
					data = this.props.resultFormatter(result);
				}
				let count = result.data.totalDocs
					? result.data.totalDocs
					: result.data.totalCount;
				count =
					this.props?.originName === "Verified Users"
						? count + 25400
						: count;
				count =
					this.props?.originName === "User List"
						? count + 40300
						: count;
				this.setState({
					count: count,
					data: data,
					unExpandedRows: unExpandedRows,
					url: this.props.url,
					isLoading: false,
					noMatch: this.props?.noMatchTextLabels
						? this.props?.noMatchTextLabels
						: "Sorry, no matching records found.",
				});
			} else {
				this.setState({
					data: [],
					isLoading: false,
					noMatch: "Sorry, no matching records found.",
				});
			}
		} catch (error) {
			if (error.message)
				this.setState({
					data: [],
					isLoading: false,
					noMatch: "Sorry, no matching records found.",
				});
		}
	};

	handleFilterSubmit = (applyFilters) => {
		applyFilters();
		this.getDataList();
	};

	render() {
		const { data, count, searchText, noMatch, rowsExpanded } = this.state;
		const {
			url,
			columns,
			resultFormatter,
			setRefresh,
			origin,
			rowsPerPage,
			...otherProps
		} = this.props;
		const customComponents = {};
		const options = {
			serverSide: true,
			filter: this.props?.disableFilterIcon === true ? false : true,
			search: this.props?.disableSearchIcon === true ? false : true,
			searchText: searchText,
			selectableRows: "none",
			print: false,
			download: true,
			responsive: "standard",
			count: count,
			viewColumns: false,
			textLabels: {
				body: {
					noMatch: noMatch,
				},
			},
			rowsPerPage: this.state.rowsPerPage,
			rowsPerPageOptions: [10, 20, 50, 100, 1000, 50000, 100000],
			confirmFilters: true,
			expandableRowsHeader: false,
			rowsExpanded: rowsExpanded,
			expandableRowsOnClick: false,
			setTableProps: () => ({
				className: "align-middle table-bordered mb-0",
			}),
			onRowExpansionChange: (currentRowsExpanded) => {
				this.setState((prevState) => ({
					rowsExpanded:
						prevState.rowsExpanded?.[0] ===
						currentRowsExpanded[0]?.index
							? []
							: [currentRowsExpanded[0]?.index],
				}));
			},
			onColumnSortChange: (changedColumn, direction) => {
				let order = "desc";
				if (direction === "asc") {
					order = "asc";
				}
				this.setState(
					{
						sort: order,
						sortColumn: changedColumn,
					},
					() => {
						this.getDataList();
					}
				);
			},
			// // old methode
			onChangePage: (page) => {
				this.setState(
					{
						page: page + 1,
					},
					() => {
						this.getDataList();
					}
				);
			},

			// onPageChange: (page) => {
			// 	this.setState(
			// 		{
			// 			page: page + 1,
			// 		},
			// 		() => {
			// 			this.getDataList();
			// 		}
			// 	);
			// },

			// onRowsPerPageChange: (rowsPerPage) => {
			// 	this.setState(
			// 		{
			// 			rowsPerPage: rowsPerPage,
			// 			rowsExpanded: [],
			// 		},
			// 		() => {
			// 			this.getDataList();
			// 		}
			// 	);
			// },
			// // old methode
			onChangeRowsPerPage: (rowsPerPage) => {
				this.setState(
					{
						rowsPerPage: rowsPerPage,
						rowsExpanded: [],
						page: 1,
					},
					() => {
						this.getDataList();
					}
				);
			},

			onSearchChange: (searchText) => {
				cancel();
				if (this.searchTimeout) clearTimeout(this.searchTimeout);
				this.searchTimeout = setTimeout(this.getDataList, 500);
				this.setState({ searchText: searchText ? searchText : "" });
			},

			customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
				return (
					<div
						className={"text-center"}
						style={{ marginTop: "40px" }}
					>
						<button
							type="button"
							className="btn btn-primary btn-rounded waves-effect waves-light"
							onClick={() =>
								this.handleFilterSubmit(applyNewFilters)
							}
						>
							Apply Filters
						</button>
					</div>
				);
			},

			onFilterConfirm: (filterList) => {
				let filters = filterList.reduce((filters, filter, index) => {
					if (filter?.[0]) {
						filters.push({
							name: this.props.columns[index].name,
							value: filter,
						});
					}
					return filters;
				}, []);
				let fil = [...filters, ...(this.props.filters ?? [])];
				this.setState({ filters: fil, isLoading: true }, () =>
					this.getDataList()
				);
			},

			onFilterChange: (column, filterList, type) => {
				// if (type === 'chip' ) {

				let filters = filterList.reduce((filters, filter, index) => {
					if (filter?.[0]) {
						filter = filter.map((item) => {
							try {
								let isValidDate = new Date(item);
								if (isNaN(isValidDate)) {
									return item;
								}
								return `${isValidDate.getFullYear()}-${
									isValidDate.getMonth() + 1
								}-${
									isValidDate.getDate() > 9
										? isValidDate.getDate()
										: "0" + isValidDate.getDate()
								}`;
							} catch (error) {
								return item;
							}
						});
						filters.push({
							name: this.props.columns[index].name,
							value: filter,
						});
					}
					return filters;
				}, []);
				let fil = [...filters, ...(this.props.filters ?? [])];
				this.setState(
					{ filters: fil, rowsExpanded: [], isLoading: true },
					() => this.getDataList()
				);
				// }

				if (type === "reset") {
					filterList = [];
					// this.setState({ filters: filterList }, () => this.getDataList());
				}
				// else if(type === 'https://apply.hdfcbank.com/Vivid/trackapplication') {

				// }
			},

			// onDownload: (buildHead, buildBody, columns, data) => {
			// 	return (
			// 		buildHead(["nikullllllllllllllll patellllllllll"]) +
			// 		buildHead(columns) +
			// 		buildBody(data)
			// 	);
			// },
		};

		if (this.props?.expandableRows && this.props?.isUnexpandedRows) {
			customComponents["ExpandButton"] = (props) => {
				if (this.state.unExpandedRows?.includes(props.dataIndex))
					return <div style={{ width: "24px" }} />;
				return <ExpandButton {...props} />;
			};
		}
		const mergeOptions = { ...options, ...otherProps };
		return (
			<MuiThemeProvider>
				<MUIDataTable
					title={origin}
					data={data}
					columns={columns}
					options={mergeOptions}
					components={customComponents}
				/>
			</MuiThemeProvider>
		);
	}
}
