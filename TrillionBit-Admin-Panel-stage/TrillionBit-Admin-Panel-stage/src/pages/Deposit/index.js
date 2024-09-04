import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import FiatDeposit from "./FiatDeposit";
import CryptoDeposit from "./CryptoDeposit";

const Deposit = (props) => {
	if (props.match.params?.slug === "fiat-deposit") {
		return (
			<React.Fragment>
				<FiatDeposit />
			</React.Fragment>
		);
	} else if (props.match.params?.slug === "crypto-deposit") {
		return (
			<React.Fragment>
				<CryptoDeposit />
			</React.Fragment>
		);
	} else {
		return <Redirect to="/" />;
	}
};

export default withRouter(Deposit);
