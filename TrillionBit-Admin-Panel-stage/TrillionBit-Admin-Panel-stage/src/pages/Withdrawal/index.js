import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import FiatWithdrawal from "./FiatWithdrawal";
import CryptoWithdrawal from "./CryptoWithdrawal";

const Withdrawal = (props) => {
	if (props.match.params?.slug === "fiat-withdrawal") {
		return (
			<React.Fragment>
				<FiatWithdrawal />
			</React.Fragment>
		);
	} else if (props.match.params?.slug === "crypto-withdrawal") {
		return (
			<React.Fragment>
				<CryptoWithdrawal />
			</React.Fragment>
		);
	} else {
		return <Redirect to="/" />;
	}
};

export default withRouter(Withdrawal);
