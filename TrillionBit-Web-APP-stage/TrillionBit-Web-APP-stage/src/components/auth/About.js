import React, { Component } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import exchangeImg from "../../assets/img/home/exchange.webp";
import webWalletImg from "../../assets/img/home/web-wallet.webp";
import bitApiImg from "../../assets/img/home/bit-api.webp";
import bitexbannerlogo from "../../assets/img/office.webp";

import { Typography } from "@mui/material";

import "../../assets/css/home.css";

class About extends Component {
	componentDidMount() {
		// window.fcWidget.destroy();
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<React.Fragment>
				<Helmet>
					<title class="next-head">About | Trillionbit</title>
					<meta
						name="keywords"
						content="Bitcoin Exchange, Blockchain Crypto Exchange, Cryptocurrency Exchange, Bitcoin Trading, Ethereum, XRP, Ripple, Litecoin, Bitcoin Cash, BTC, LTC, ETH, XRP, BCH, BTC price, Wallet, LTC price, Trillionbit UAE, UAE, Dubai, India, Mumbai, Delhi, Dubai cryptocurrency exchange, Trillionbit, login"
					/>
					<meta
						property="og:url"
						content="https://www.trillionbit.com/about"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:title" content="About | Trillionbit" />
					<meta property="og:site_name" content="Trillionbit" />
					<meta
						property="og:image"
						content="https://trillionbit.com/static/media/logo.d54102a2.webp"
					/>
					<meta property="twitter:title" content="About | Trillionbit" />
					<meta property="twitter:site" content="Trillionbit" />
					<meta
						property="twitter:image"
						content="https://trillionbit.com/static/media/logo.d54102a2.webp"
					/>
					<meta
						property="twitter:image:src"
						content="https://trillionbit.com/static/media/logo.d54102a2.webp"
					/>
				</Helmet>
				<div
					className={
						this.props.auth.expandNavBar
							? "overlay"
							: "overlay hide"
					}
				></div>
				<div
					className={
						this.props.auth.isAuthenticated
							? "paddingTopbody"
							: "paddingTopbody2"
					}
				></div>

				<div className="slider">
					<Container>
						<Grid container>
							<Grid
								item
								xs={12}
								sm={12}
								md={12}
								className="oneCenterBox"
							>
								<div className="slideText">
									<Typography variant="h1" className="">
										About Trillionbit
									</Typography>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>

				<div className="investorSection no_bg">
					<Container>
						<Grid container>
							<Grid item xs={12} sm={12} md={6}>
								<div className="investorText aboutInfo">
									<Typography variant="h2">
										<strong> Who we are </strong>
									</Typography>

									<Typography variant="h6" className="text">
										Founded in 2018, Trillionbit is a digital
										currency exchange and a professional
										trading platform. With the advancement
										in Blockchain technology and the widely
										known digital currencies, Trillionbit foresaw
										the need of such a platform in one of
										the fastest growing regions in the
										world.
									</Typography>

									<Typography variant="h6" className="text">
										Trillionbit currently provides a platform for
										the investors whether they are new to
										blockchain and would just like to invest
										in digital assets for long term or if
										they are professional traders, an
										advanced platform with charting tools,
										orderbook and one-click trade option
										provided. As the government is pledging
										to integrate Blockchain and
										cryptocurrencies into the daily
										government activities, it will be a huge
										step forward for the country in the
										adoption of a transparent and secure
										means of transacting with the world.
									</Typography>
								</div>
							</Grid>
							<Grid item xs={12} sm={6} md={6} className="">
								<img src={bitexbannerlogo} alt="Im" />
							</Grid>
						</Grid>

						<Grid container className="aboutBoxes">
							<Grid item xs={12} sm={4} md={4} className="">
								<div className="inBox">
									<img src={exchangeImg} alt="Im" />
									<Typography variant="h3">
										Trillionbit Academy
									</Typography>
									<Typography variant="h6">
										Trillionbit is built with an aim to provide
										users with a simple yet secure trading
										platform to learn more about
										Cryptocurrencies.
									</Typography>
								</div>
							</Grid>

							<Grid item xs={12} sm={4} md={4}>
								<div className="inBox">
									<img src={bitApiImg} alt="Im" />
									<Typography variant="h3">
										Quick Transactions
									</Typography>
									<Typography variant="h6">
										An exchange market place helps buyers
										and sellers transact in an easy way.
									</Typography>
								</div>
							</Grid>

							<Grid item xs={12} sm={4} md={4}>
								<div className="inBox">
									<img src={webWalletImg} alt="Im" />
									<Typography variant="h3">
										Protected & Secure
									</Typography>
									<Typography variant="h6">
										It provides industry leading security
										and highest liquidity with ultra-fast
										matching engine with instant KYC
										verificaition.
									</Typography>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>
			</React.Fragment>
		);
	}
}

About.propTypes = {
	auth: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps, {})(About);
