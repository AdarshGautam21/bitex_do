import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//Import Socket.io
// import openSocket from 'socket.io-client';

import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { List, ListItem } from "@mui/material";

import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";

import logoWhiteImg from "../../assets/img/white-logo.webp";

import btxLogoFloating from "../../assets/img/b-loader.webp";

const allowedLinks = [
	"/trading",
	"/margin-trading",
	"/tradingview",
	"/new-trading-view",
	"/new-marging-trading-view",
];

// let socket = openSocket(`api.trillionbit.com`, {secure: true, rejectUnauthorized : false });  // <-- make sure the port is the same

class Footer extends Component {
	componentDidMount = () => {
		// if (this.props.auth.isAuthenticated) {
		//     if (!socket) {
		//         socket = openSocket(`api.trillionbit.com`, {secure: true, rejectUnauthorized : false });
		//     }
		//     socket.emit('live', this.props.auth.user.email);
		// } else {
		//     // socket.emit('offline', {});
		//     if (socket) {
		//         socket.close();
		//         socket = null;
		//     }
		// }
	};

	componentWillReceiveProps = (nextProps) => {
		// if (nextProps.auth.isAuthenticated) {
		//     if (!socket) {
		//         socket = openSocket(`api.trillionbit.com`, {secure: true, rejectUnauthorized : false });
		//     }
		//     socket.emit('live', nextProps.auth.user.email);
		// } else {
		//     // socket.emit('offline', {});
		//     if (socket) {
		//         socket.close();
		//         socket = null;
		//     }
		// }
	};

	componentWillUnmount = () => {
		// if (socket) {
		//     socket.close();
		//     socket = null;
		// }
		// socket.emit('offline', this.props.auth.user.email);
	};

	render() {
		return (
			<React.Fragment>
				{!allowedLinks.includes(
					this.props.history.location.pathname
				) ? (
					<div>
						<div className="footer">
							<Container>
								<Grid container>
									<Grid item xs={12} sm={3} md={3}>
										<div className="col-one">
											<img
												src={logoWhiteImg}
												alt="img"
												width="160"
												height="auto"
											/>
											<Typography variant="h6">
												Trillionbit is secure Cryptocurrency
												Wallet and Trading platform. Buy
												and Sell digital assets like
												Bitcoin, Ethereum, Ripple,
												Litecoin, Bitcoin Cash and more.
											</Typography>
										</div>
									</Grid>
									<Grid item xs={12} sm={7} md={7}>
										<div className="col-list">
											<Typography variant="h5">
												Trade
											</Typography>
											<List className="">
												<ListItem>
													<Link
														to="/exchange"
														className=""
													>
														Spot
													</Link>
												</ListItem>
												{/* <ListItem>
                                                    <Link to="/margintrading" className="">
                                                    Margin
                                                    </Link>
                                                </ListItem>
                                                <ListItem>
                                                    <Link to="/futuretrading" className="">
                                                    Futures
                                                    </Link>
                                                </ListItem>                                                 */}
												<ListItem>
													<Link
														to="/lending"
														className=""
													>
														Lend
													</Link>
												</ListItem>
											</List>
										</div>

										<div className="col-list">
											<Typography variant="h5">
												Products
											</Typography>
											<List className="">
												{/* <ListItem>
													<Link
														to="/btxCoin"
														className=""
													>
														BTX Coin
													</Link>
												</ListItem> */}
												<ListItem>
													<Link
														to="/exchange"
														className=""
													>
														Exchange
													</Link>
												</ListItem>
												<ListItem>
													<Link
														to="/wallet"
														className=""
													>
														Web Wallet
													</Link>
												</ListItem>
												<ListItem>
													<Link
														to="/developer"
														className=""
													>
														Developer
													</Link>
												</ListItem>
												<ListItem>
													<a
														href="https://academy.trillionbit.com/"
														className=""
													>
														Academy
													</a>
												</ListItem>
											</List>
										</div>

										<div className="col-list">
											<Typography variant="h5">
												Company
											</Typography>
											<List className="">
												<ListItem>
													<Link
														to="/about"
														className=""
													>
														About Us
													</Link>
												</ListItem>
												<ListItem>
													<Link
														className=""
														to="/fees"
													>
														Fee Schedule
													</Link>
												</ListItem>
												<ListItem>
													<Link
														className=""
														to="/referral-info"
													>
														Referral
													</Link>
												</ListItem>
												<ListItem>
													<a href="https://careers.trillionbit.com">
														Careers
													</a>
												</ListItem>
												<ListItem>
													<Link
														to="/trust-and-security"
														className=""
													>
														Trust & Security
													</Link>
												</ListItem>
												<ListItem>
													<Link
														to="/terms-of-service"
														className=""
													>
														Terms of Service
													</Link>
												</ListItem>
											</List>
										</div>

										<div className="col-list">
											<Typography variant="h5">
												Support
											</Typography>
											<List className="">
												<ListItem>
													<a href="http://support.trillionbit.com">
														Customer Support
													</a>
												</ListItem>
												<ListItem>
													<a href="http://support.trillionbit.com/support/solutions/folders/48000245620">
														FAQs
													</a>
												</ListItem>
												<ListItem>
													<a href="http://support.trillionbit.com/support/tickets/new">
														Submit a request
													</a>
												</ListItem>
												<ListItem>
													<a href="#">
														Status
													</a>
												</ListItem>

												<ListItem>
													<Link
														to="/press"
														className=""
													>
														Press
													</Link>
												</ListItem>
											</List>
										</div>
									</Grid>
									<Grid
										item
										xs={12}
										sm={2}
										md={2}
										className="lastcolList"
									>
										<div className="col-list">
											<Typography variant="h5">
												Stay Connected On.
											</Typography>
											<List className="">
												<ListItem>
													<Link to="/" className="">
														support@trillionbit.com
													</Link>
												</ListItem>
											</List>
										</div>
										<div className="col-list col-one">
											<div className="socialLink">
												<List className="">
													<ListItem>
														<a
															href="https://www.facebook.com/"
															rel="noopener noreferrer"
															target="_blank"
															className=""
														>
															<Facebook />
														</a>
													</ListItem>
													<ListItem>
														<a
															href="https://twitter.com/"
															rel="noopener noreferrer"
															target="_blank"
															className=""
														>
															<Twitter />
														</a>
													</ListItem>
													<ListItem>
														<a
															href="https://www.linkedin.com/company/"
															rel="noopener noreferrer"
															target="_blank"
															className=""
														>
															<LinkedIn />
														</a>
													</ListItem>
													<ListItem>
														<a
															href="https://www.instagram.com/"
															rel="noopener noreferrer"
															target="_blank"
															className=""
														>
															<Instagram />
														</a>
													</ListItem>
												</List>
											</div>
										</div>
									</Grid>
								</Grid>
							</Container>

							{/* <div className="floatBtn">
								<a href="/btxCoin">
									<img src={btxLogoFloating} alt="img" />
									<span> Buy BTX </span>
								</a>
							</div> */}
						</div>

						<div className="copyRight">
							<Typography variant="h6">
								© 2022-2023 Trillionbit. All Rights Reserved.
							</Typography>
						</div>
					</div>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}

Footer.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

const routerFooter = withRouter((props) => <Footer {...props} />);

export default connect(mapStateToProps, {})(routerFooter);
