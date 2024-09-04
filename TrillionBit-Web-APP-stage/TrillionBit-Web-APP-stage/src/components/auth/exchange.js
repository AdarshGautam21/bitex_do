import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Link
  } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { withStyles } from '@mui/styles';

import {
    Typography,
} from '@mui/material';

import tradeBanner2Img from '../../assets/img/trade-banner-2.webp';
import tradeImg from '../../assets/img/trade-img.webp';
import buySellImg from '../../assets/img/buy-sell.webp';
import indicatorImg from '../../assets/img/indicator.webp';
import quicklyBSImg from '../../assets/img/quicklyBS.webp';

import themeStyles from '../../assets/themeStyles'; 
import '../../assets/css/home.css';

class exchange extends Component {
    componentDidMount() {
        // window.fcWidget.destroy();
        window.scrollTo(0, 0);
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
                                Professional Trading <span> Platform </span>
                            </Typography>

                            <Typography variant="body1" className="subtext">
                                Trillionbit is leading Cryptocurrency Wallet and Trading platform. Buy and Sell digital assets like Bitcoin, Ethereum, Ripple, Litecoin, Bitcoin Cash and more.
                            </Typography>

                            <Link to="/register" className="orange">
                                Sign Up Today
                            </Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={7}>
                        <div className="slideImg">
                            <img src={tradeBanner2Img} alt="Crypto trading" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>


        <div className="bg-map analyseSec">
            <Container>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <div className="wrapTitle text-center">
                            <Typography variant="h2">
                                Analyse Markets   <strong> Smartly </strong>
                            </Typography>

                            <Typography variant="body2" component="span" className="text">
                                We have variety of features that make it an ideal place to buy and sell digital assets.
                            </Typography>
                        </div>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12} md={12}>
                        <div className="analyseImage text-center">
                        <img src={tradeImg} alt="Cryptocurrency" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
        
        
        <div className="chartSection">
            <Container>         

            <Grid container className="adjustpadding">
                <Grid item xs={12} md={1}>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Grid container className="adjustpadding">
                        <Grid item xs={12} md={6} sm={6}>
                            <div className="subSections">
                                <Typography variant="h3">
                                    <strong> Powerful </strong>  Charts
                                </Typography>                            

                                <Typography variant="h6">
                                We give you the best charting
                                tools to spot market
                                trends and make informed decisions.
                                </Typography>                            
                            </div>
                        </Grid>

                        <Grid item xs={12} md={6} sm={6}>
                            <div className="WrapImg">
                                <img src={buySellImg} alt="Blockchain" />
                            </div>
                        </Grid>
                    </Grid>


                    <Grid container className=" flexRevers">
                        <Grid item xs={12} md={6} sm={6}>
                            <div className="WrapImg">
                                <img src={indicatorImg} alt="Bitcoin" />
                            </div>
                        </Grid>

                        <Grid item xs={12} md={6} sm={6}>
                            <div className="subSections">
                                <Typography variant="h3">
                                    <strong> 10+  </strong> Indicators
                                </Typography>

                                <Typography variant="h6">
                                    You can customize your charts
                                    with 10+ indicators and learn professional trading.
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
                <Grid container  >
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="imgBox">
                            <img src={quicklyBSImg} alt="Trillionbit wallet" />
                        </div>
                    </Grid>

                    

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="investorText">
                            <Typography variant="h2">
                            <strong>  Buy & Sell  </strong> 
                            Quickly
                            </Typography>

                            <Typography variant="h6" className="text">
                            Placing cover orders &
                            bracket orders just became more simple.
                            </Typography>

                            

                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
        
        
           
        </React.Fragment>;
    }
}

exchange.propTypes = {
    auth: PropTypes.object.isRequired,
}
  
const mapStateToProp = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProp, {

    }
)(withStyles(themeStyles)(exchange));
