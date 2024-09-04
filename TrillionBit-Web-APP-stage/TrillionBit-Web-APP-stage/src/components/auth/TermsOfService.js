import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import { Typography } from "@mui/material";

import "../../assets/css/home.css";

class TermsOfService extends Component {
	componentDidMount() {
		// window.fcWidget.destroy();
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<React.Fragment>
				<Helmet>
					<title class="next-head">Terms of Service | Trillionbit</title>
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
						content="https://www.trillionbit.com/terms-of-service"
					/>
					<meta property="og:type" content="website" />
					<meta
						property="og:title"
						content="Terms of Service | Trillionbit"
					/>
					<meta property="og:site_name" content="Trillionbit" />
					<meta
						property="og:image"
						content="https://trillionbit.com/static/media/logo.d54102a2.webp"
					/>
					<meta
						property="twitter:title"
						content="Terms of Service | Trillionbit"
					/>
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
										Terms of Service
									</Typography>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>

				<div className="termsofServiceSection">
					<Container>
						<Grid container>
							<Grid item xs={12} sm={12} md={12}>
								<div className="termsofServiceText">
									<Typography variant="h5">
										TERMS OF SERVICE
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										By using this website (“www.trillionbit.com”),
										registering for a Trillionbit Account or using
										any other Trillionbit Services, you ("you,
										your, or yourself") are agreeing to
										accept and comply with the terms and
										conditions of use stated below ("Terms
										of Use"). You should read the entire
										Terms of Use carefully before using this
										site or any of the Trillionbit Services.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										As used in this Terms of Use, “Trillionbit"
										refers to the company "Trillionbit
										DMCC.", with its
										registered addresses in Dubai, UAE including,
										without limitation, its owners,
										directors, investors, employees or other
										related parties. The service operated by
										Trillionbit allows buyers ("Buyers") and
										sellers ("Sellers") to buy and sell
										Cryptocurrencies such as Bitcoin,
										Ethereum, Litecoin and Ripple.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Depending on your country of residence,
										you may not be able to use all the
										functions of the Site. It is your
										responsibility to follow those rules and
										laws in your country of residence and/or
										country from which you access this Site
										and Services. As long as you agree to
										and comply with these Terms of Use,
										Trillionbit grants you the personal,
										non-exclusive, non-transferable,
										non-sublicensable and limited right to
										enter and use the Site and the Service.
									</Typography>

									<Typography variant="h5">
										DO NOT ACCESS THIS WEBSITE OR ITS
										SERVICES IF YOU DO NOT ACCEPT THE TERMS
										OF USE MENTIONED HERE.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										By opening an Account, you expressly
										represent and warrant:
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• That you have accepted these Terms
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• That you are at least 18 years of age
										and have the full capacity to accept
										these Terms and enter into a transaction
										involving Bitcoins, Ethereum, Litecoin
										and Ripple.
									</Typography>

									<Typography variant="h5">
										RISKS INVOLVED
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										The trading of goods and products, real
										or virtual, as well as virtual
										currencies involves significant risk.
										Prices can and do fluctuate on any given
										day. Such price fluctuations may
										increase or decrease the value of your
										assets at any given moment. Any currency
										- virtual or not - may be subject to
										large swings in value and may even
										become worthless. There is an inherent
										risk that losses will occur as a result
										of buying, selling or trading anything
										on a market.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Cryptocurrency trading also has special
										risks not generally shared with official
										currencies or goods or commodities in a
										market. Unlike most currencies, which
										are backed by governments or other legal
										entities, or by commodities such as gold
										or silver, Cryptocurrencies are unique
										type of "fiat" currency, backed by
										technology and trust. There is no
										central bank that can issue more
										currency or take corrective measures to
										protect the value of Cryptocurrencies in
										a crisis.Instead, Cryptocurrencies are
										an as-yet autonomous and largely
										unregulated global system of currency
										firms and individuals. Traders put their
										trust in a digital, decentralised and
										partially anonymous system that relies
										on peer-to-peer networking and
										cryptography to maintain its integrity.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										There may be additional risks that we
										have not foreseen or identified in our
										Terms of Use. You should carefully
										assess whether your financial situation
										and tolerance for risk is suitable for
										buying, selling or trading Bitcoins,
										Ethereum, Litecoin and Ripple. We use
										our banking providers in order to
										receive client funds and make payments.
										Our banking providers DO NOT transfer,
										exchange, or provide any services in
										connection with Cryptocurrencies.
									</Typography>

									<Typography variant="h5">
										LIMITED RIGHT OF USE
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Unless otherwise specified, all
										Materials on this Site are the property
										of Trillionbit and are protected by copyright,
										trademark and other applicable laws. You
										may view, print and/or download a copy
										of the Materials from this Site on any
										single computer solely for your
										personal, informational and/or
										non-commercial use, provided you comply
										with all copyright and other proprietary
										notices.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										The trademarks, service marks and logos
										of Trillionbit and others used in this Site
										("Trademarks") are the property of Trillionbit
										and their respective owners. The
										software, text, images, graphics, data,
										prices, trades, charts, graphs, video
										and audio used on this Site belong to
										Trillionbit. The Trademarks and Material
										should not be copied, reproduced,
										modified, republished, uploaded, posted,
										transmitted, scraped, collected or
										distributed in any form or by any means,
										whether manual or automated. The use of
										any such Materials on any other Site or
										networked computer environment for any
										other purpose is strictly prohibited;
										any such unauthorised use may violate
										copyright, trademark and other
										applicable laws and could result in
										criminal or civil penalties.
									</Typography>

									<Typography variant="h5">
										MAINTAINING YOUR ACCOUNT
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										This Site is for your personal and
										non-commercial use only. We are vigilant
										in maintaining the security of our Site
										and the Service. By registering with us,
										you agree to provide Trillionbit with current,
										accurate and complete information about
										yourself, as prompted by the
										registration process, and to keep such
										information updated. You further agree
										that you will not use any Account other
										than your own or access the Account of
										any other Member at any time or assist
										others in obtaining unauthorised access.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										The creation or use of Accounts without
										obtaining prior express permission from
										Trillionbit will result in the immediate
										suspension of all said Accounts, as well
										as all pending purchase/sale offers. Any
										attempt to do so or to assist others
										(Members or otherwise), or the
										distribution of instructions, software
										or tools for that purpose, will result
										in the Accounts of such Members being
										terminated. Termination is not the
										exclusive remedy for such a violation,
										and Trillionbit may elect to take further
										action against you.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										You are also responsible for maintaining
										the confidentiality of your Account
										information, including your password,
										safeguarding your own Cryptocurrencies,
										and all activity including Transactions
										that are posted to your Account. If
										there is suspicious activity related to
										your Account, we may, but are not
										obligated to, request additional
										information from you, including
										authenticating documents, and to freeze
										any transactions pending our review. You
										are obligated to comply with these
										security requests or accept termination
										of your Account. You are required to
										notify Trillionbit immediately of any
										unauthorised use of your Account or
										password, or any other breach of
										security, by email to support@trillionbit.com.
										Any Member who violates these rules may
										be terminated, and thereafter held
										liable for losses incurred by Trillionbit or
										any user of the Site.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Lastly, you agree that you will not use
										the Service to perform criminal activity
										of any sort, including but not limited
										to, money laundering, illegal gambling
										operations, terrorist financing, or
										malicious hacking.
									</Typography>

									<Typography variant="h5">
										TERMINATION AND ESCROW OF UNVERIFIED
										ACCOUNTS
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										You may terminate this agreement with
										Trillionbit, and close your Account at any
										time, following settlement of any
										pending transactions.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										You also agree that Trillionbit may, by giving
										notice, in its sole discretion terminate
										your access to the Site and to your
										Account, including without limitation,
										its right to: limit, suspend or
										terminate the service and Members'
										Accounts, prohibit access to the Site
										and its content, services and tools,
										delay or remove hosted content, and take
										technical and legal steps to keep
										Members off the Site if we suspect that
										they are creating problems or possible
										legal liabilities, infringing the
										intellectual property rights of third
										parties, or acting inconsistently with
										the letter or spirit of these Terms.
										Additionally, we may, in appropriate
										circumstances and at our discretion,
										suspend or terminate Accounts of Members
										for any reason, including without
										limitation: (1) attempts to gain
										unauthorised access to the Site or
										another Member's account or providing
										assistance to others' attempting to do
										so, (2) overcoming software security
										features limiting use of or protecting
										any content, (3) usage of the Service to
										perform illegal activities such as money
										laundering, illegal gambling operations,
										financing terrorism, or other criminal
										activities, (4) violations of these
										Terms of Use, (5) a failure to pay or a
										fraudulent payment for Transactions, (6)
										unexpected operational difficulties, or
										(7) upon the request of law enforcement
										or other government agencies, if deemed
										legitimate and compelling to do so by
										Trillionbit, acting in its sole discretion.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										We expressly reserve the right to cancel
										and/or terminate Accounts that have not
										been verified by the Client despite
										efforts made in good faith by Trillionbit to
										contact you to obtain such verification
										(“Unverified Accounts”). All Unverified
										Accounts which have been inactive for a
										period of 6 months or more are further
										subject to transfer to a third-party
										escrow (the "Unverified Escrow”), and
										will no longer be maintained or under
										the legal responsibility of Trillionbit. The
										administrator/trustee of the Unverified
										Escrow shall make any and all additional
										reasonable efforts required by law to
										determine and contact each Unverified
										Account owner and, after suitable effort
										and time has been expended, we may be
										required to convert the residual
										Cryptocurrencies into fiat and send it
										to a national authority responsible for
										the safekeeping of such funds.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										The suspension of an Account shall not
										affect the payment of commissions due
										for past Transactions. Upon termination,
										Members shall send details of a valid
										bank account to allow for the transfer
										of any currencies credited to their
										account. This bank account must be held
										by the Member. Bitcoins may be
										transferred to a valid bank account only
										after conversion into a fiat currency.
										Trillionbit shall transfer the currencies as
										soon as possible following the Member's
										request and within the time frames
										specified by Trillionbit.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Trillionbit will send you the credit balance
										of your Account; however, in certain
										circumstances a number of intermediaries
										may be involved in an international
										payment and these or the beneficiary
										bank may deduct charges. We will make
										all reasonable efforts to ensure that
										such charges are disclosed to you prior
										to sending your payment; however, where
										they cannot be avoided, you acknowledge
										that these charges cannot always be
										calculated in advance, and that you
										agree to be responsible for such
										charges.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Trillionbit reserves the right to not convert
										Cryptocurrencies into fiat and to return
										them to a Wallet that belongs to the
										Customer.
									</Typography>

									<Typography variant="h5">
										AVAILABILITY OF SERVICES
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										All services are provided without
										warranty of any kind, either express or
										implied. We do not represent that this
										Site will be available 100% of the time
										to meet your needs. We will strive to
										provide you with the Service as soon as
										possible, but there are no guarantees
										that access will not be interrupted, or
										that there will be no delays, failures,
										errors, omissions or a loss of
										transmitted information.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										We will use reasonable endeavours to
										ensure that the Site can be accessed by
										you in accordance with these Terms of
										Use. However, we may suspend use of the
										Site for maintenance and will make
										reasonable efforts to give you notice of
										this. You acknowledge that this may not
										be possible in an emergency.
									</Typography>

									<Typography variant="h5">
										FINANCIAL REGULATION
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Our business model and our Service
										facilitate the buying, selling and
										trading of Bitcoins and their use to
										purchase goods in an unregulated,
										international open payment system. The
										Services we provide are currently
										unregulated within UAE.
									</Typography>

									<Typography variant="h5">EMAIL</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Unencrypted email messages sent over the
										Internet are not secure and Trillionbit is not
										responsible for any damages incurred by
										the result of sending email messages in
										this way.
									</Typography>

									<Typography variant="h5">
										DISCLOSURES TO LEGAL AUTHORITIES AND
										AUTHORIZED FINANCIAL INSTITUTIONS
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										We may share your Personal Information
										with law enforcement, data protection
										authorities, government officials, and
										other authorities when:
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• Required by law;
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• Compelled by subpoena, court order, or
										other legal procedure;
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• We believe that disclosure is
										necessary to prevent physical harm or
										financial loss;
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• Disclosure is necessary to report
										suspected illegal activity; or
									</Typography>
									<Typography
										variant="body1"
										className="text"
									>
										• Disclosure is necessary to investigate
										violations of our Terms of Use or
										Privacy Policy.
									</Typography>

									<Typography variant="h5">
										LIMITATION OF LIABILITY
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										To the extent permitted by law, Trillionbit
										will not be held liable for any damages,
										loss of profit, loss of revenue, loss of
										business, loss of opportunity, loss of
										data, indirect or consequential loss
										unless the loss suffered arose from
										negligence or wilful deceit or fraud.
										Nothing in these terms excludes or
										limits the liability of either party for
										fraud, death or personal injury caused
										by its negligence, breach of terms
										implied by operation of law or any other
										liability which may not be limited or
										excluded by law.
									</Typography>

									<Typography variant="h5">
										INDEMNITY
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										To the full extent permitted by
										applicable law, you hereby agree to
										indemnify Trillionbit and its partners against
										any action, liability, cost, claim,
										loss, damage, proceeding or expense
										suffered or incurred if direct or not
										directly arising from your use of Trillionbit
										Sites, your use of the Service or from
										your violation of these Terms of Use.
									</Typography>

									<Typography variant="h5">
										LIMITATION OF LOSS
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										In addition to the liability cap section above, 
										in no event shall we, our affiliates or service providers, 
										or any of our or their respective officers, directors, agents, 
										employees or representatives, be liable for any of the following 
										types of loss or damage arising under or in connection with this 
										Agreement or otherwise:
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										(i) any loss of profits or loss of expected revenue or gains, 
										including any loss of anticipated trading profits and/or any 
										actual or hypothetical trading losses, even if we are advised 
										of or knew or should have known of the possibility of the same. 
										This means, by way of example only (and without limiting the scope 
										of the preceding sentence), that if you claim that we failed to process 
										a buy or sell transaction properly, your damages are limited to no 
										more than the combined value of the supported Digital Asset and Fiat 
										Deposit Amount at issue in the transaction, and that you may not recover 
										for any ”loss“ of anticipated trading profits or for any actual trading 
										losses made as a result of the failure to buy or sell;
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										(ii) any loss of or damage to reputation or goodwill; any loss of 
										business or opportunity, customers, or contracts; any loss or waste of 
										overheads, management, or other staff time; or any other loss of revenue 
										or actual or anticipated savings, even if we are advised of or knew or should 
										have known of the possibility of the same;
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										(iii) any loss of use of hardware, software or data and/or any corruption of data; 
										including but not limited to any losses or damages arising out of or relating to 
										any inaccuracy, defect or omission of Digital Asset price data; any platform technical 
										glitch or falsely placed orders; any error or delay in the transmission of such data; 
										and/or any interruption in any such data;
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										(iv) any loss or damage whatsoever which does not stem directly from 
										our breach of this Agreement; and/or
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										(v) any loss or damage whatsoever which is in excess of that which was 
										caused as a direct result of our breach of this Agreement (whether or not 
										you are able to prove such loss or damage).
									</Typography>

									<Typography variant="h5">
										NO WARRANTIES 
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										The Trillionbit Site is provided on an “as is”, “with all faults” and “as available” basis. 
										We, our officers, directors, shareholders, employees, and agents expressly disclaim 
										all warranties of any kind, expressed, implied or statutory, relating to the Trillionbit Site 
										and its content including without limitation the warranties of title, merchantability, 
										fitness for a particular purpose, non-infringement of proprietary rights, course of 
										dealing or course of performance. We do not warrant that a) the Trillionbit Site will meet 
										your specific requirements, b) the Trillionbit Site will be uninterrupted, timely, secure 
										or error-free, c) the Trillionbit Transactions will be accurate, error-free, reliable or 
										complete, d) any errors on the Trillionbit Site will be corrected, or e) any services through 
										the Trillionbit Site will meet your expectations or requirements.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										We do not warrant and are not responsible for any injuries or losses 
										sustained by you as a result of your use of the Trillionbit Site. We do not warrant 
										that your use of the Trillionbit Site is lawful in any particular jurisdiction, and we 
										specifically disclaim any such warranties. Some jurisdictions limit or do not allow 
										the disclaimer of implied or other warranties so the above disclaimer may not apply 
										to you to the extent such jurisdiction’s law is applicable to you and this Agreement. 
										By accessing or using the Trillionbit Site, you represent and warrant that your activities are 
										lawful in every jurisdiction where you access or use the Trillionbit Site.
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										In no event shall we be liable for any damages whatsoever, whether direct, 
										indirect, general, special, exemplary, compensatory, consequential, and/or 
										incidental, arising out of or relating out of, or relating to the conduct of 
										you or anyone else in connection with the use of the Trillionbit Site, including without 
										limitation, loss, impairment, bodily injury, death, emotional distress, damage to your 
										possessions and/or any other damages resulting from any Trillionbit Transactions initiated on 
										the Trillionbit Site, unauthorized access to or alteration of your transmissions to the 
										Trillionbit Site and errors, mistakes or inaccuracies of any content on the Site. You agree 
										to take reasonable precautions when executing Trillionbit Transaction.
									</Typography>

									<Typography variant="h5">
										CLASS ACTION WAIVER
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										If permitted by applicable law, each party waives the right to litigate 
										in court or an arbitration proceeding any Dispute as a class action, 
										either as a member of a class or as a representative, or to act as a 
										private attorney general.
									</Typography>

									<Typography variant="h5">
										MISCELLANEOUS
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										If we are unable to perform the Services
										outlined in the Terms of Use due to
										factors beyond our control including but
										not limited to an event of Force
										Majeure, change of law or change in
										sanctions policy, we shall not be liable
										for the Services provided under this
										agreement during the time period
										coincident with the event.
									</Typography>

									<Typography variant="h5">
										MODIFICATION OF TERMS
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										Trillionbit reserves the right to change, add
										or remove parts of these Terms at any
										time and at its sole discretion. You
										will be notified of any changes in
										advance through your Account. Upon such
										notification, it is your responsibility
										to review the amended Terms. Your
										continued use of the Site following the
										posting of a notice of changes to the
										Terms signifies that you accept and
										agree to the changes, and that all
										subsequent transactions by you will be
										subject to the amended Terms.
									</Typography>

									<Typography variant="h5">
										CONTACT US
									</Typography>

									<Typography
										variant="body1"
										className="text"
									>
										If you have any questions relating to
										these Terms of Use, your rights and
										obligations arising from these Terms
										and/or your use of the Site and the
										Service, your Account or any other
										matter, please contact
										support@trillionbit.com.
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

TermsOfService.propTypes = {
	auth: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user,
	errors: state.errors,
});

export default connect(mapStateToProps, {})(TermsOfService);
