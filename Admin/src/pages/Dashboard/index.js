import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { getActive as getActiveMarkets } from "../../store/market/actions";
import CountUp from "react-countup";
import moment from "moment";
import { isEmpty } from "lodash";
/** import Mini Widget data */
import { WidgetsData } from "../../common/data/dashboard";
import WalletBalance from "./WalletBalance";
import InvestedOverview from "./InvestedOverview";
import MarketOverview from "./MarketOverview";
import Locations from "./Locations";
import Trading from "./Trading";
import Transactions from "./Transactions";
import RecentActivity from "./RecentActivity";
import NewSlider from "./NewSlider";
import TotalUser from "./User";
import TotalOrder from "./Order";
import TotalTranscation from "./Transcation";
import TotalUserWalletHolding from "./UserWalletHolding";

const options = {
	chart: {
		height: 50,
		type: "line",
		toolbar: { show: false },
	},
	colors: ["#5156be"],
	stroke: {
		curve: "smooth",
		width: 2,
	},
	xaxis: {
		labels: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		axisBorder: {
			show: false,
		},
	},
	yaxis: {
		labels: {
			show: false,
		},
	},
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function (seriesName) {
					return "";
				},
			},
		},
		marker: {
			show: false,
		},
	},
};

class Dashboard extends Component {
	state = {};

	componentDidMount = () => {
		this.props.getActiveMarkets();
	};

	formatValue = (val, formatter = 2) => {
		return isNaN(parseFloat(val))
			? 0.0
			: parseFloat(val).toFixed(formatter);
	};

	getStringToDateRange = (filters) => {
		let { time } = filters;
		const timeValue = [];
		const key = time.last.includes("years") ? "years" : time.last;
		const value = time[key];
		if (key === "years") {
			timeValue[0] = moment(value, "YYYY").toDate().toString();
			timeValue[1] = moment(value, "YYYY")
				.endOf("year")
				.toDate()
				.toString();
		} else if (key === "months") {
			timeValue[0] = moment().subtract(value, "months").toDate();
			timeValue[1] = moment().toDate();
		} else if (key === "hours") {
			timeValue[0] = moment().subtract(value, "hours").toDate();
			timeValue[1] = moment().toDate();
		}
		return timeValue;
	};

	getMarketStockList = () => {
		const marketList = [];
		this.props.markets.map((item) => {
			if (!marketList.includes(item.stock)) {
				marketList.push(item.stock);
			}
			if (!marketList.includes(item.money)) {
				marketList.push(item.money);
			}
		});
		return marketList;
	};

	getTotalYear = () => {
		const numberofYear = [];
		const currentYear = new Date().getFullYear();
		for (let i = 2019; i <= parseInt(currentYear); i++) {
			numberofYear.push(i);
		}
		return numberofYear;
	};

	setDateFilter = (filters) => {
		const { time, ...rest } = filters;
		if (filters.date?.[0]) return rest;
		let newTimeValue = this.getStringToDateRange(filters);
		filters = { ...rest, date: newTimeValue };
		return filters;
	};

	toggleResetFilter = (filters, set) => {
		if (set === "date") {
			return {
				...filters,
				time: {
					years: "",
					months: "",
					days: "",
					hours: "",
					last: "",
				},
			};
		}
		return { ...filters, date: [null, null] };
	};

	render() {
		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Dashboard | Bitex Admin</title>
					</MetaTags>
					<Container fluid>
						<Breadcrumbs
							title="Dashboard"
							breadcrumbItem="Dashboard"
						/>
						<TotalTranscation
							toggleResetFilter={this.toggleResetFilter}
							formatValue={this.formatValue}
							getMarketStockList={this.getMarketStockList}
							getTotalYear={this.getTotalYear}
							setDateFilter={this.setDateFilter}
						/>

						<TotalOrder
							toggleResetFilter={this.toggleResetFilter}
							formatValue={this.formatValue}
							getMarketStockList={this.getMarketStockList}
							getTotalYear={this.getTotalYear}
							setDateFilter={this.setDateFilter}
						/>

						<Row>
							<TotalUser
								toggleResetFilter={this.toggleResetFilter}
								formatValue={this.formatValue}
								getTotalYear={this.getTotalYear}
								setDateFilter={this.setDateFilter}
							/>

							<TotalUserWalletHolding
								toggleResetFilter={this.toggleResetFilter}
								formatValue={this.formatValue}
								getTotalYear={this.getTotalYear}
								setDateFilter={this.setDateFilter}
							/>
						</Row>

						<Row>
							{(WidgetsData || []).map((widget, key) => (
								<Col xl={3} md={6} key={key}>
									<Card className="card-h-100">
										<CardBody>
											<Row className="align-items-center">
												<Col xs={6}>
													<span className="text-muted mb-3 lh-1 d-block text-truncate">
														{widget.title}
													</span>
													<h4 className="mb-3">
														{widget.isDoller ===
														true
															? "$"
															: ""}
														<span className="counter-value">
															<CountUp
																start={0}
																end={
																	widget.price
																}
																duration={12}
															/>
															{widget.postFix}
														</span>
													</h4>
												</Col>
												<Col xs={6}>
													<ReactApexChart
														options={options}
														series={[
															{
																data: [
																	...widget[
																		"series"
																	],
																],
															},
														]}
														type="line"
														className="apex-charts"
														dir="ltr"
													/>
												</Col>
											</Row>
											<div className="text-nowrap">
												<span
													className={
														"badge badge-soft-" +
														widget.statusColor +
														" text-" +
														widget.statusColor
													}
												>
													{widget.rank}
												</span>
												<span className="ms-1 text-muted font-size-13">
													Since last week
												</span>
											</div>
										</CardBody>
									</Card>
								</Col>
							))}
						</Row>
						<Row>
							<WalletBalance />
							<Col>
								<Row>
									<InvestedOverview />
									<NewSlider />
								</Row>
							</Col>
						</Row>
						<Row>
							<MarketOverview />
							<Locations />
						</Row>
						<Row>
							<Trading />
							<Transactions />
							<RecentActivity />
						</Row>
					</Container>
				</div>
			</React.Fragment>
		);
	}
}

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	markets: state.market.markets,
});

export default connect(mapStateToProp, {
	getActiveMarkets,
})(withRouter(Dashboard));
