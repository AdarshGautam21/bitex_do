import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import {Helmet} from "react-helmet";

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { Typography } from '@mui/material';

import '../../assets/css/home.css';

import security from '../../assets/img/security.webp';
import trust from '../../assets/img/trust.webp';
import ssl256 from '../../assets/img/ssl-256.webp';

class TrustAndSecurity extends Component {
    componentDidMount() {
        // window.fcWidget.destroy();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title class="next-head">Trust and Security | Trillionbit</title>
                    <meta name="description" content="Trillionbit is a leading cryptocurrency Bitcoin exchange in India offering a secure, real time Bitcoin,Ethereum, XRP, Litecoin and Bitcoin Cash trading multi-signature wallet platform tobuy and sell." />
                    <meta name="keywords" content="bitcoin, trillionbit, trillionbit india, trillionbit crypto, trillionbit wallet, cryptocurrency, Exchange, btc, eth, ltc, bch, xrp, buy bitcoin India, bitcoin wallet, buy bitcoin, buy btc, buy ripple, buy ethereum, inr to btc, inr to ripple, eth to inr, bitcoin exchange, bitcoin inr conversion, btc price inr, cheap btc, cheap eth, lowest fee crypto exchange, receive bitcoin india, buy ripple india, buy bitcoin in india" />
                    <meta property="og:url" content="https://www.trillionbit.com/trust-and-security" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Trust and Security | Trillionbit" />
                    <meta property="og:site_name" content="Trillionbit" />
                    <meta property="og:image" content="https://trillionbit.com/static/media/logo.d54102a2.webp" />
                    <meta property="twitter:title" content="Trust and Security | Trillionbit" />
                    <meta property="twitter:site" content="Trillionbit" />
                    <meta property="twitter:image" content="https://trillionbit.com/static/media/logo.d54102a2.webp" />
                    <meta property="twitter:image:src" content="https://trillionbit.com/static/media/logo.d54102a2.webp" />
                </Helmet>
                <div className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}></div>
                <div className={this.props.auth.isAuthenticated ? "paddingTopbody" : "paddingTopbody2"}></div>

                <div className="slider">
                    <Container>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} className="oneCenterBox">
                                <div className="slideText text-center inviteBox">
                                    <Typography variant="h1" className="">
                                        Trust and Security
                                    </Typography>

                                    <Typography variant="body2" className="subtext">
                                        At Trillionbit, we take security seriously and your trust is important to us.
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </div>

                <div className="bglightgray inviteSection">
                    <Container>
                        <Grid container>

                            <Grid item xs={12} sm={8} md={10}>
                                <div className="detailedRulesText">
                                    <Typography variant="h4" style={{color: '#5d5a5a'}}>
                                        Trust
                                    </Typography>
                                    <br/>
                                    <Typography variant="body1" className="text" style={{color: '#666'}}>
                                        Trillionbit is a fully regulated and compliant financial exchange. It follows a strict Anti-money laundering (AML) and Know your customer (KYC) policy. In order to secure your funds and give no way to frauds on our platform, we request our customers to follow these policies and be a part of the Trillionbit family.
                                    </Typography>
                                    <br/>
                                    <Typography variant="body1" className="text" style={{color: '#666'}}>
                                        You can read the complete AML/KYC policy <Link to="/AML_KYC_Trillion.pdf" target="_blank" className="">here</Link>.
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={4} md={2}>
                                <div className="imgBox">
                                    <img src={trust} alt="re1" height="200" />
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container>                            

                            <Grid item xs={12} sm={3} md={2}>
                                <div className="imgBox">
                                    <img src={security} alt="re1" height="200" />
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={9} md={10}>
                                <div className="detailedRulesText">
                                    <Typography variant="h4" style={{color: '#5d5a5a'}}>
                                        Security
                                    </Typography>
                                    <br/>
                                    <Typography variant="body1" className="text" style={{color: '#666'}}>
                                        The Exchange platform is developed using the latest technologies and we have followed the best development practices to reduce the risk of fraud. We use numerous measures like 2fa, email verification, IP blocking, mobile verification and also manually verify unusual account activity and transactions in order to provide a secure experience. All the identity documents submitted to us also remain securely stored in a remote database with highest standards of encryption in order to maintain user privacy.
                                    </Typography>
                                    <br/>
                                    <Typography variant="body1" className="text" style={{color: '#666'}}>
                                        The digital asset wallets are secured using the multi-signature technology. There are 3 keys for each wallet stored in different locations and at least 2 of the 3 keys are required for a transaction to process.
                                    </Typography>
                                    <br/>
                                    <div className="imgBox">
                                        <img src={ssl256} alt="re1" height="50" />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </div>

                <div className="detailedRulesSection">
                    <Container>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <div className="detailedRulesText">
                                    <Typography variant="h5" style={{color: '#5d5a5a'}}>
                                        Transparency
                                    </Typography>
                                    <br/>
                                    <Typography variant="body1" className="text" style={{color: '#666'}}>
                                        All the transaction that happen on Trillionbit are posted on the Blockchain and we provide a Transaction ID for you to verify the transaction on websites like Blockcyper or Etherescan.
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={6} md={6}>
                                <div className="detailedRulesText">
                                    <Typography variant="h5" style={{color: '#5d5a5a'}}>
                                        Account Protection
                                    </Typography>
                                    <br/>
                                    <Typography variant="body1" className="text" style={{color: '#666'}}>
                                        All the account information is securely stored with us and we suggest our customers to follow proper practices to protect their accounts. We require Email and Mobile verification to access the account and unrecognized IP addresses need to be verified through email.
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </div>

            </React.Fragment>
        )
    }
}

TrustAndSecurity.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { }
)(TrustAndSecurity);
