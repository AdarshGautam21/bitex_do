import React from 'react';
import PropTypes from 'prop-types';
import {
    Typography,
    Grid,
} from '@mui/material';
import Iframe from 'react-iframe'
import isEmpty from '../../validation/isEmpty';

const CurrencyFormat = require('react-currency-format');

const Graph = ({ currentUserCryptoWallet, currentUserFiatWallet, trading, marketLast, activeMoney, chartCoin }) => (

    <Grid item xs={12} md={12} sm={12}>
        <div className="graphBox">
            <div className="headTitle">
                <Typography component="h3">
                    {trading.activeMarket?.name}
                </Typography>
                <div className="balance_head">
                
                    
                <Typography component="h5"  className="">
                        Last: <span>  {
                                (!isEmpty(marketLast)) ?
                                (marketLast[trading.activeMarket.name]) ?
                                (parseFloat(marketLast[trading.activeMarket.name].last)).toFixed(2) :
                                0.00 : 0.00
                            } {activeMoney} </span>
                    </Typography>


                    <Typography component="h5"  className="">
                        High: <span><CurrencyFormat value={
                                (!isEmpty(marketLast)) ?
                                (marketLast[trading.activeMarket.name]) ?
                                (parseFloat(marketLast[trading.activeMarket.name].high)).toFixed(2) :
                                0.00 : 0.00
                            } displayType={'text'} thousandSeparator={true} prefix={`${trading.activeMarket.money === 'INR' ? '₹' : trading.activeMarket.money === 'USD' ? '$' : ''} `} suffix={`${trading.activeMarket.money === 'AED' ? 'د.إ' : ''} `} />
                        </span>
                     </Typography>


                     <Typography component="h5"  className="">
                        Low: <span><CurrencyFormat value={
                                (!isEmpty(marketLast)) ?
                                (marketLast[trading.activeMarket.name]) ?
                                (parseFloat(marketLast[trading.activeMarket.name].low)).toFixed(2) :
                                0.00 : 0.00
                            } displayType={'text'} thousandSeparator={true} prefix={`${trading.activeMarket.money === 'INR' ? '₹' : trading.activeMarket.money === 'USD' ? '$' : ''} `} suffix={`${trading.activeMarket.money === 'AED' ? 'د.إ' : ''} `} />
                        </span>
                     </Typography>

                    {/* {!isEmpty(currentUserCryptoWallet) ? (
                        <Typography component="h5"  className="">
                            {currentUserCryptoWallet.displayName}: <span> {parseFloat(currentUserCryptoWallet.walletAmount).toFixed(8)} {currentUserCryptoWallet.coin} </span>
                        </Typography>
                    ) : ''}

                    {!isEmpty(currentUserCryptoWallet) ? (
                        <Typography component="h5"  className="">
                            {currentUserFiatWallet.displayName}: <span>{currentUserFiatWallet.coin === 'INR' ? '₹' : ''} {parseFloat(currentUserFiatWallet.walletAmount).toFixed(2)} {currentUserFiatWallet.coin === 'INR' ? '' : 'د.إ'}</span>
                        </Typography>
                    ) : ''} */}

                </div>
            </div>
            <div className="graphData">
                <Iframe 
                    url={`https://wchart.bitexuae.net/${activeMoney}/${chartCoin}`}
                    className="pricechart-iframe"
                    display="initial"
                    position="relative"
                    allow="geolocation; midi; encrypted-media"
                />
            </div>
        </div>
    </Grid>
);

Graph.propTypes = {
    chartCoin: PropTypes.string,
    activeMoney: PropTypes.string,
    currentUserCryptoWallet: PropTypes.object, 
    currentUserFiatWallet: PropTypes.object,
    trading: PropTypes.object, 
    marketLast: PropTypes.object, 
};

export default Graph;