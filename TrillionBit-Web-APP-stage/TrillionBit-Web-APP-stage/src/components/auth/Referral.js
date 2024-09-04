import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import { List, ListItem, Typography } from "@mui/material";

import { refferalSetting } from "../../actions/authActions";

import "../../assets/css/home.css";

import re1Logo from "../../assets/img/re-01.webp";
import re2Logo from "../../assets/img/re-02.webp";
import re3Logo from "../../assets/img/re-03.webp";

class Referral extends Component {
	componentDidMount() {
		window.scrollTo(0, 0);
		this.props.refferalSetting();
	}

	getRefferalCommisionPercentage = () => {
		if (this.props.auth.refferalSetting?.commissionPercentage) {
			return parseFloat(
				parseFloat(
					this.props.auth.refferalSetting?.commissionPercentage
				) * 100
			);
		}
		return 0.0;
	};

	render() {
		return (
			<React.Fragment>
				<Helmet>
					<title class="next-head">Referral | Trillionbit</title>
					<meta
						name="description"
						content="Trillionbit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell."
					/>
					<meta
						name="keywords"
						content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india"
					/>
					<meta
						property="og:url"
						content="https://www.trillionbit.com/referral-info"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:title" content="Referral | Trillionbit" />
					<meta property="og:site_name" content="Trillionbit" />
					<meta
						property="og:image"
						content="https://trillionbit.com/static/media/logo.d54102a2.webp"
					/>
					<meta property="twitter:title" content="Referral | Trillionbit" />
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
								<div className="slideText text-center inviteBox">
									<Typography variant="h1" className="">
										Invite Friends <br /> Earn
										Cryptocurrency
									</Typography>

									<Typography
										variant="body2"
										className="subtext"
									>
										Earn up to{" "}
										{this.getRefferalCommisionPercentage()}%
										commission every time your friends make
										a trade on Trillionbit
									</Typography>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>

				<div className="bglightgray">
					<Container>
						<Grid container>
							<Grid item xs={12} sm={1} md={3}></Grid>
							<Grid
								item
								xs={12}
								sm={10}
								md={6}
								className="createReferlLinkBox"
							>
								<div className="mainTitle text-center">
									<Typography variant="h4" className="">
										Generate Your Referral Link
									</Typography>
								</div>

								<div>
									<List className="">
										<ListItem></ListItem>
									</List>
								</div>

								<div className="receiveSection">
									<List className="receiveList">
										<ListItem>
											<Typography
												variant="h5"
												className=""
											>
												You Receive
											</Typography>

											<Typography
												variant="h4"
												className=""
											>
												{this.getRefferalCommisionPercentage()}
												%
											</Typography>
										</ListItem>
									</List>
								</div>

								<div className="text-center">
									<Link to="/login" className="inviteNow">
										Invite Now
									</Link>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>

				<div className="bglightgray inviteSection">
					<Container>
						<Grid container className="">
							<Grid item xs={12}>
								<div className="title">
									<Typography variant="h5">
										{" "}
										How to invite your friends{" "}
									</Typography>
								</div>
							</Grid>
						</Grid>

						<Grid container className="inviteBoxSection">
							<Grid item xs={12} sm={4} md={4}>
								<div className="wrapBox">
									<div className="imgBox">
										<img src={re1Logo} alt="re1" />
									</div>

									<Typography variant="h5" className="">
										01
									</Typography>

									<Typography variant="h3" className="title">
										Get Referral Link
									</Typography>

									<Typography
										variant="body2"
										className="subText"
									>
										Register and generate referral links and
										QR codes with a commission kickback
										rate.
									</Typography>
								</div>
							</Grid>

							<Grid item xs={12} sm={4} md={4}>
								<div className="wrapBox">
									<div className="imgBox">
										<img src={re2Logo} alt="re2" />
									</div>

									<Typography variant="h5" className="">
										02
									</Typography>

									<Typography variant="h3" className="title">
										Invite Friends
									</Typography>

									<Typography
										variant="body2"
										className="subText"
									>
										Invite your friends to register through
										the referral link or QR and get rewards
										when they complete trade every time.
									</Typography>
								</div>
							</Grid>

							<Grid item xs={12} sm={4} md={4}>
								<div className="wrapBox">
									<div className="imgBox">
										<img src={re3Logo} alt="re3" />
									</div>

									<Typography variant="h5" className="">
										03
									</Typography>

									<Typography variant="h3" className="title">
										Earn Crypto Together
									</Typography>

									<Typography
										variant="body2"
										className="subText"
									>
										Every time your friends make a trade,
										you'll get{" "}
										{this.getRefferalCommisionPercentage()}%
										commission in real time!
									</Typography>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>

				<div className="detailedRulesSection">
					<Container>
						<Grid container>
							<Grid item xs={12} sm={12} md={12}>
								<div className="detailedRulesText">
									<Typography variant="h2">
										Detailed Rules
									</Typography>

									<Typography variant="h6" className="text">
										Trillionbit has upgraded our Referral Program!
										Invite your friends to register and
										trade on trillionbit.com, and you get{" "}
										{this.getRefferalCommisionPercentage()}%
										of the referral commissions from their
										trading fees.
									</Typography>
									{/* 
                                    <Typography variant="h5"> 
                                        Rules:-
                                    </Typography>

                                    <Typography variant="h6" className="text"> 
                                        Inviters can choose to share a portion of the commissions received from the trading fees of the friends they invite, as a “kickback”. Inviters can set the sharing rates as follows:
                                    </Typography>

                                    <Typography variant="h6" className="text"> 
                                        1. If the inviter’s daily average BNB account balance is less than 500 BNB and their base referral rate is 20%, they can choose to share 0%, 5% or 10% with the friends they invite.
                                    </Typography>
                                    <Typography variant="h6" className="text"> 
                                        2. If the inviter’s daily average BNB account balance is 500 BNB or more, their base referral rate is increased to 40%, and they can choose to share 0%, 5%, 10%, 15% or 20% 
                                        with the friends they invite.
                                    </Typography>
                                    <Typography variant="h6" className="text"> 
                                        3. Daily average BNB Balance Calculation Rules: here
                                    </Typography>

 */}

									<Typography variant="h5">
										Details:
									</Typography>

									<Typography variant="h6" className="text">
										1. All referral commissions are
										calculated in real-time and transferred
										to the respective Trillionbit accounts in
										real-time.
									</Typography>

									<Typography variant="h6" className="text">
										2. The settlement asset of referral
										commissions is the fiat currency used by
										Trillionbit.
									</Typography>

									<Typography variant="h6" className="text">
										3. In order for an inviter friend to
										earn commission, the invitee must
										register using the corresponding
										referral link (or QR code or referral
										ID).
									</Typography>

									<Typography variant="h6" className="text">
										4. There is no limit to the number of
										friends a single account can invite.
									</Typography>

									<Typography variant="h6" className="text">
										5. Referral commission is independent on
										the type of trade (Market or Limit).
									</Typography>

									<Typography variant="h6" className="text">
										6. Trillionbit may adjust the proportion of
										referrals at any point and reserves the
										right to adjust the rules of the
										referral program.
									</Typography>

									<Typography variant="h6" className="text">
										7. Trillionbit does not allow any user to
										self-invite through multiple accounts.
										Once such activity has been detected,
										all referrals will be canceled and all
										referral commission kickbacks for the
										invitee’s accounts will be canceled.
									</Typography>

									<Typography variant="h6" className="text">
										8. Once referral commission is earned,
										inviter must redeem the referral balance
										in order to transfer the balance to
										actual usable wallet. It can be found
										under “Settings `${">"}` Referral” page.
									</Typography>

									<Typography variant="h5">
										Important Notice:
									</Typography>

									<Typography variant="h6" className="text">
										Trillionbit reserves the right to change the
										terms of the referral program at any
										time due to changing market conditions,
										risk of fraud, or any other factors we
										deem relevant..
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

Referral.propTypes = {
	auth: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps, { refferalSetting })(Referral);
