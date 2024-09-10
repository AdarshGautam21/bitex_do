import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Card, CardBody } from "reactstrap";
import ReactDataTable from "../../common/ReactDataTable";
import HasAnyPermission from "../../common/Permission";

const UsdTradingLevel = ({
	columns,
	resultFormatter,
	setRefresh,
	openModal,
	apiUrl,
}) => (
	<Row>
		<Col>
			<Card>
				<CardBody>
					<div className="table-rep-plugin">
						<div
							className="table-responsive mb-0"
							data-pattern="priority-columns"
						>
							<ReactDataTable
								url={`${apiUrl}/api/admin/trading/get_usd_trader_levels`}
								columns={columns("usd")}
								resultFormatter={resultFormatter}
								setRefresh={(refresh) => setRefresh(refresh)}
								origin={
									<div className="row">
										<div className="col-auto h4">
											USDT Trader Level &nbsp;
											<HasAnyPermission
												permission={[
													"trading level add",
												]}
											>
												<button
													onClick={(e) =>
														openModal("usd")
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
						</div>
					</div>
				</CardBody>
			</Card>
		</Col>
	</Row>
);

UsdTradingLevel.propTypes = {
	columns: PropTypes.func,
	resultFormatter: PropTypes.func,
	openModal: PropTypes.func,
	apiUrl: PropTypes.string,
};

export default UsdTradingLevel;
