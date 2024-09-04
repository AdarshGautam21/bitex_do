import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    List,
    ListItem,
    Typography,
    Grid,
} from '@mui/material';

const OrderBook = ({ orderBookBids, orderBookAsks, wsConnection, openOrderBookModal }) => (
    
    <Grid item item xs={12} md={7} sm={6} className="hidden-sm">
    <div className="tradeBox orderBook">
        <div className="headTitle">
            <Typography component="h6">
                ORDERBOOK
            </Typography>
        </div>

        <div className="table">                    
            <List className="data">
                <div className="tableFixHead">
                    <div className="tableHead">
                        <List className="data">
                            <ListItem className="tableData table-subheading" id="">
                                <div className="amount">Amount</div>
                                <div className="bid">Bid</div>
                            </ListItem>
                        </List>
                    </div>
                    <div className="tableHead">
                        <List className="data">
                            <ListItem className="tableData table-subheading" id="">
                                <div className="value"> Ask </div>
                                <div className="amount">Amount</div>
                            </ListItem>
                        </List>
                    </div>
                </div>                         
            </List>

            <List className="data scrollBody leftorderBook">
                <div className="orderbookData">
                    <div className="table">
                        <List className="data">
                            {orderBookBids.map((bid, index) => <ListItem key={index} className={orderBookBids.includes(bid) ? bid.new ? 'tableData bid-list newBid' : 'tableData bid-list' : bid.new ? 'tableData newBid' : 'tableData'} id="">
                                {/* <div className="value" id="trades_value"> {(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(2)} </div> */}
                                <div className="amount trades_bid_amount" id="trades_amount"> {bid.amount ? bid.amount : bid[1]} </div>
                                <div className="bid" id="trades_bid"> {bid.price ? bid.price : bid[0]} </div>
                            </ListItem>)}
                        </List>
                    </div>

                    <div className="table">
                        <List className="data">
                            {orderBookAsks.map((ask, index) => <ListItem key={index} className={orderBookAsks.includes(ask) ? ask.new ? 'tableData ask-list newAsk' : 'tableData ask-list' : ask.new ? 'tableData newAsk' : 'tableData'} id="">
                                <div className="ask" id="trades_ask"> {ask.price ? ask.price : ask[0]} </div>
                                <div className="amount trades_ask_amount" id="trades_amount2"> {ask.amount ? ask.amount : ask[1]} </div>
                                {/* <div className="value trades_ask_amount" id="trades_value2"> {(parseFloat(ask[0]) * parseFloat(ask[1])).toFixed(2)} </div> */}
                            </ListItem>)}
                        </List>
                    </div>
                </div>
            
            </List>

            <div className="footTable"> 
                <Link to="#"> <span className={ wsConnection ? "status green" : "status red"}> </span> Real Time </Link>
                <Link to="#" onClick={openOrderBookModal}> FULL BOOK </Link>
            </div>
        </div>
    </div>
    </Grid>
);

OrderBook.propTypes = {
    orderBookBids: PropTypes.array, 
    orderBookAsks: PropTypes.array, 
    wsConnection: PropTypes.bool, 
    openOrderBookModal: PropTypes.func 
};

export default OrderBook;