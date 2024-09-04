import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { withStyles } from '@mui/styles';


import {
    List,
    ListItem,
    Typography,
    Link,
} from '@mui/material';

import wBannerImg from "../../assets/img/w-banner.webp";
import exchangeImg from "../../assets/img/home/exchange.webp";
import webWalletImg from "../../assets/img/home/web-wallet.webp";
import quicklyBSImg from '../../assets/img/quicklyBS.webp';


import {getAvailaleMarkets, getMarketLast} from '../../actions/walletActions';

import isEmpty from '../../validation/isEmpty';
import currencyIcon from '../../common/CurrencyIcon';

import themeStyles from '../../assets/themeStyles';
import '../../assets/css/home.css';

let CurrencyFormat = require('react-currency-format');
const ipLocation = require("iplocation");
const publicIp = require('public-ip');

class wallet extends Component {
    componentDidMount() {
        // window.fcWidget.destroy();
        window.scrollTo(0, 0);
    }
    state = {
        marketLast: {},
        currentCurrency : 'USD',
    }

    componentDidMount = async () => {
        window.scrollTo(0, 0);
        const currentIpLocation = await ipLocation(await publicIp.v4());
        this.setState({currentCurrency: currentIpLocation.country.code === 'IN' ? 'INR' : currentIpLocation.country.code === 'AE' ? 'AED' : 'USD'});
        await this.props.getAvailaleMarkets();
        await this.props.getMarketLast();
        let marketList = [];
        let marketLast = this.state.marketLast;
        for(let key in this.props.trading.markets) {
            marketList.push(this.props.trading.markets[key].name);
            marketLast[this.props.trading.markets[key].name] = this.props.wallet.marketLasts[this.props.trading.markets[key].name];
            this.setState({marketLast: marketLast});
        }
    }

    render() {
    
        return <React.Fragment>
        
        <div className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}></div>
        <div className="paddingTopbody"> </div>
        
        <div className="subSlider">
            <Container>
                <Grid container>
                    <Grid item xs={12} sm={6} md={5} className="oneCenterBox">
                        <div className="slideText">
                            <Typography variant="h1" className="">
                                Multi-signature <span> Web Wallet </span>
                            </Typography>

                            <Typography variant="body1" className="subtext">
                                Securely store all your digital currencies in the web wallet.
                            </Typography>

                            <Link href="/register" className="orange">
                                Sign Up Today
                            </Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={7}>
                        <div className="slideImg">
                            <img src={wBannerImg} alt="Multi-signatureWeb Wallet" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>


        <div className="quicklySection">
            <Container>
                <Grid container>
                    <Grid item xs={12} sm={12} md={7}>
                        <div className="investorText">
                            <Typography variant="h2">
                            A <strong>  Trillionbit Wallet  </strong> 
                              At Your Fingertips
                            </Typography>

                            <Typography variant="h6" className="text">
                            Trillionbit is a fully regulated and compliant financial exchange. It follows a strict Anti-money laundering (AML) and Know your customer (KYC) policy. In order to secure your funds and give no way to frauds on our platform, we request our customers to follow these policies and be a part of the Trillionbit family.

                            </Typography>

                            <Typography variant="h6" className="text">
                            Placing cover orders &
                            bracket orders just became more simple.
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={5}>
                        <div className="currencyMarket">
                            <div className="title">
                                <Typography variant="h4">                                        
                                    Currency Market
                                </Typography>
                            </div>
                            <List className="List">
                                {this.props.trading.markets.map( (userAsset, index) => {
                                        if (this.state.currentCurrency === userAsset.money) {
                                            return <ListItem>
                                                        <div className="img">
                                                            <img src={currencyIcon(userAsset.stock)} alt="Im" />
                                                        </div>
                    
                                                        <Typography variant="h4">                                        
                                                            {userAsset.stock} - {userAsset.money}
                                                        </Typography>
                    
                                                        <Typography variant="h5">
                                                            <CurrencyFormat value={
                                                                (!isEmpty(this.state.marketLast)) ?
                                                                (this.state.marketLast[userAsset.name]) ?
                                                                (parseFloat(this.state.marketLast[userAsset.name].ask)).toFixed(2) :
                                                                0.00 : 0.00
                                                            } displayType={'text'} thousandSeparator={true} prefix={`${userAsset.money === 'INR' ? '₹' : userAsset.money === 'USD' ? '$' : ''} `} suffix={`${userAsset.money === 'AED' ? 'د.إ' : ''} `} />                                        
                                                            <small>
                                                                ({(!isEmpty(this.state.marketLast)) ?
                                                                    (this.state.marketLast[userAsset.name]) ?
                                                                    ((((parseFloat(this.state.marketLast[userAsset.name].last) - parseFloat(this.state.marketLast[userAsset.name].open))) / ((parseFloat(this.state.marketLast[userAsset.name].open) === 0) ? 1 : parseFloat(this.state.marketLast[userAsset.name].open))) * 100).toFixed(2) :
                                                                    '0.00' : '-'
                                                                } %)
                                                            </small>
                                                        </Typography>
                    
                                                    </ListItem>
                                        } else {
                                            return undefined;
                                        }
                                    })
                                }
                            </List>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>


        <div className="investorSection protectedSection">
            <Container>
            <Grid container>
            <Grid item xs={12} md={1}>
            
            </Grid>

            <Grid item xs={12} md={10}>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <div className="wrapTitle text-center">
                            <Typography variant="h2">
                            <strong> Protected </strong>  with 3-keys
                            </Typography>

                            <Typography variant="body2" component="span" className="text">
                                We have variety of features that make it an ideal place to buy and sell digital assets.
                            </Typography>
                        </div>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12} sm={4} md={4} className="oneCenterBox">
                        <div className="inBox">
                            <img src={exchangeImg} alt="Im" />
                            <Typography variant="h3">
                                Stored with us
                            </Typography>
                            <Typography variant="h6">
                                The most advanced trading platform.
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={4} md={4}>
                        <div className="inBox">
                            <img src={webWalletImg} alt="Im" />
                            <Typography variant="h3">
                                With our Wallet partner
                            </Typography>
                            <Typography variant="h6">
                                Secure your digital assets with us.
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={4} md={4} className="oneCenterBox">
                        <div className="inBox">
                            <img src={exchangeImg} alt="Im" />
                            <Typography variant="h3">
                                The Recovery key
                            </Typography>
                            <Typography variant="h6">
                                The most advanced trading platform.
                            </Typography>
                        </div>
                    </Grid>

                   
                </Grid>
            </Grid>

            <Grid item xs={12} md={1}>
            
            </Grid>
            </Grid>
                
            </Container>
        </div>
        
        
       

        <div className="quicklySection">
            <Container>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="investorText">
                            <Typography variant="h2">
                                <strong>  Send/Receive  </strong> Quickly    
                            </Typography>

                            <Typography variant="h6" className="text">
                                The Trillionbit wallet allows you to send digital assets to third-party wallets and you can also receive from other wallets. You need the wallet address to send while you need to provide your wallet address to receive.
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="imgBox">
                            <img src={quicklyBSImg} alt="Trillionbit wallet" />
                           
                        </div>
                    </Grid>

                </Grid>
            </Container>
        </div>
        
        
           
        </React.Fragment>;
    }
}

wallet.propTypes = {
    auth: PropTypes.object.isRequired,
    trading: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    getAvailaleMarkets: PropTypes.func.isRequired,
    getMarketLast: PropTypes.func.isRequired,
}
  
const mapStateToProp = state => ({
    auth: state.auth,
    trading: state.trading,
    wallet: state.wallet,
});

export default connect(
    mapStateToProp, {
        getAvailaleMarkets, getMarketLast,
    }
)(withStyles(themeStyles)(wallet));
