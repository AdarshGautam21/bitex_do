import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { AvField } from "availity-reactstrap-validation";

const CoinTypesInput = ({ coinType, handleChange, index }) => (
	<>
		<Row>
			<Col md={6}>
				<div className="mb-3">
					<label htmlFor="depositFee" className="form-label">
						Deposit Fee {`(${coinType.coinType})`}
					</label>
					<AvField
						type="text"
						className="form-control"
						name="depositFee"
						value={coinType.depositFee}
						onChange={handleChange(index)}
					/>
				</div>
			</Col>
			<Col md={6}>
				<div className="mb-3">
					<label htmlFor="withdrawalFee" className="form-label">
						Withdrawal Fee {`(${coinType.coinType})`}
					</label>
					<AvField
						type="text"
						className="form-control"
						name="withdrawalFee"
						value={coinType.withdrawalFee}
						onChange={handleChange(index)}
					/>
				</div>
			</Col>
		</Row>
	</>
);

CoinTypesInput.propTypes = {
	handleChange: PropTypes.func,
	coinType: PropTypes.object,
};

export default CoinTypesInput;
