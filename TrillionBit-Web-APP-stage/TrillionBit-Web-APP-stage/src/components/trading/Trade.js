import React from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    Typography,
    Grid,
} from '@mui/material';
import wifiImg from "../../assets/img/loader.webp";

const moment = require('moment');

const Trade = ({ orderDeals, activeMarket }) => (
    
    <Grid item xs={12} md={5} sm={6} className="hidden-sm">
        <div className="tradeBox">
            <div className="headTitle">
                <Typography component="h6">
                    Trade
                </Typography>
            </div>

            <div className="table">
                <List className="data">
                    <ListItem className="tableData table-subheading" id="">
                        <div className="amount">Amount</div>
                        <div className="time">Time</div>
                        <div className="price">Price</div>
                    </ListItem>
                </List>

                

                {orderDeals.length > 0 ? (
                    <List className="data scrollBody leftTradeData">
                        {(orderDeals.map((orderDeal, index) => <ListItem className={(orderDeal.m || orderDeal.type === 'sell') ? 'tableData red' : 'tableData'} key={index}>
                            <div className="amount" id="trades_price"> {parseFloat(orderDeal.q ? orderDeal.q : orderDeal.amount).toFixed(4)} </div>
                            <div className="time" id="trades_time"> {moment(parseInt(orderDeal.T ? orderDeal.T : orderDeal.time * 1000)).format('LT')} </div>
                            <div className="price" id="trades_amount"> {activeMarket.stock === 'BTX' ? parseFloat(orderDeal.p ? orderDeal.p : orderDeal.price).toFixed(4) : parseFloat(orderDeal.p ? orderDeal.p : orderDeal.price).toFixed(4)} </div>
                        </ListItem>))}
                    </List>
                ) : (
                    <List className="data scrollBody leftTradeData">
                    
                        <div className="connectingbox">
                            <div className="loaderWrap">
                                <div class="loader">
                                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                                </div>
                            </div>

                            {/* <Typography variant="body2" className="">
                                Connecting...
                            </Typography> */}
                        </div>
                    
                    </List>
                )}

            </div>
        </div>
    </Grid>                                

);

Trade.propTypes = {
    orderDeals: PropTypes.array, 
    activeMarket: PropTypes.object
};

export default Trade;