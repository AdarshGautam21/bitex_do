import React from "react";
import PropTypes from "prop-types";
import { Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

const DaysIntrestRateField = ({ days, handleChangeIntrestRate, openModal }) =>
	days.map((data) => (
		<Col key={data.numberOfDays} md={6}>
			<div className="mb-3">
				<label htmlFor="name" className="form-label">
					{`${data.numberOfDays} Days interest Rate`}
				</label>

				<div className="input-group">
					<AvField
						type="text"
						className="form-control"
						name={data.numberOfDays}
						value={data.interestRate}
						onChange={handleChangeIntrestRate}
					/>
					<div className="input-group-prepend">
						<button
							onClick={() =>
								openModal("isChangeDayModalOpen", data)
							}
							type="button"
							className="btn btn-soft-primary waves-effect waves-light"
						>
							<i className="bx bx-edit-alt font-size-16 align-middle"></i>
						</button>
					</div>
				</div>
			</div>
		</Col>
	));

DaysIntrestRateField.propTypes = {
	days: PropTypes.array,
	handleChangeIntrestRate: PropTypes.func,
	openModal: PropTypes.func,
};

export default DaysIntrestRateField;
