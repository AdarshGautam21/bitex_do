import React from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import currencyIcon from '../../../common/CurrencyIcon';
import isEmpty from '../../../validation/isEmpty';



const MarketList = ({ marketTabValue, handleBuyCoinChange, marketList, changeActiveMarket, marketLast, activeMarket }) => (
    
    <div className="marketList">
        <Tabs onChange={handleBuyCoinChange} value={marketTabValue} textColor="primary" indicatorColor="primary">
            <Tab
                value="INR"
                label="INR"
            />
            <Tab
                value="AED"
                label="AED"
            />
            <Tab
                value="USDT"
                label="USDT"
            />
        </Tabs>

        <div className="scrollBody">
                {
                    (marketTabValue === 'INR') ?
                        
                            <List className="">
                                <ListItem className="firstList">                                                           
                                    <div className="coinList">                                                                
                                        <div className="info">
                                            <Typography component="h5">
                                                Pair
                                            </Typography>                                                                
                                        </div>
                                    </div>

                                    <div className="coinprice">
                                        <Typography component="h6">
                                            Change
                                        </Typography>
                                    </div>
                                </ListItem> 
                                { 
                                    marketList['INR'] && marketList['INR'].map(market => 
                                    <ListItem className={ market.name === activeMarket.name ? 'selected' : ''}  key={market.name} onClick={() => changeActiveMarket(market)}>                                                           
                                        <div className="coinList">
                                            <div className="img">
                                                <img src={currencyIcon(market.stock)} alt="bitcoin" />
                                            </div>

                                            <div className="info">
                                                <Typography component="h5">
                                                    {market.stock} /  <span> {market.money} </span> 
                                                </Typography>

                                                <Typography component="h6" 
                                                    className={
                                                    (!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        (((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100) < 0) ?
                                                        'change red' : 'change green' : 'change green' : 'change red'
                                                    }
                                                >
                                                    {
                                                    (!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        (((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100) < 0) ?
                                                        <ArrowDownwardIcon/>  : <ArrowUpwardIcon/> : <ArrowUpwardIcon/> : <ArrowDownwardIcon/>
                                                    }
                                                    
                                                    {(!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        ((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100).toFixed(2) :
                                                        '0.00' : '-'
                                                    } %
                                                </Typography>
                                            </div>
                                        </div>

                                        <div className="coinprice">
                                            <Typography component="h6">
                                            ₹ {
                                                (!isEmpty(marketLast)) ?
                                                (marketLast[market.name]) ?
                                                (parseFloat(marketLast[market.name].ask)).toFixed(2) :
                                                0.00 : 0.00
                                            }
                                            </Typography>
                                        </div>
                                    </ListItem> 
                                    )
                                }
                            </List> 
                        

                    :

                    (marketTabValue === 'AED') ?
                        
                        <List className="">

                                <ListItem className="firstList">                                                           
                                    <div className="coinList">                                                                
                                        <div className="info">
                                            <Typography component="h5">
                                                Pair
                                            </Typography>                                                                
                                        </div>
                                    </div>

                                    <div className="coinprice">
                                        <Typography component="h6">
                                            Change
                                        </Typography>
                                    </div>
                                </ListItem> 

                                { 
                                    marketList['AED'] && marketList['AED'].map(market => 
                                    <ListItem className={ market.name === activeMarket.name ? 'selected' : ''} key={market.name} onClick={() => changeActiveMarket(market)}>                                                           
                                        <div className="coinList">
                                            <div className="img">
                                                <img src={currencyIcon(market.stock)} alt="bitcoin" />
                                            </div>

                                            <div className="info">
                                                <Typography component="h5">
                                                {market.stock} /  <span> {market.money} </span> 
                                                </Typography>

                                                <Typography component="h6" 
                                                    className={
                                                    (!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        (((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100) < 0) ?
                                                        'change red' : 'change green' : 'change green' : 'change red'
                                                    }
                                                >
                                                    {
                                                    (!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        (((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100) < 0) ?
                                                        <ArrowDownwardIcon/>  : <ArrowUpwardIcon/> : <ArrowUpwardIcon/> : <ArrowDownwardIcon/>
                                                    }
                                                    
                                                    {(!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        ((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100).toFixed(2) :
                                                        '0.00' : '-'
                                                    } %
                                                </Typography>
                                            </div>
                                        </div>

                                        <div className="coinprice">
                                            <Typography component="h6">
                                            {
                                                (!isEmpty(marketLast)) ?
                                                (marketLast[market.name]) ?
                                                (parseFloat(marketLast[market.name].ask)).toFixed(2) :
                                                0.00 : 0.00
                                            }د.إ
                                            </Typography>
                                        </div>
                                    </ListItem> 
                                    )
                                }

                                                                                   
                            </List> 
                        
                    :

                    (marketTabValue === 'USDT') ?
                        
                        <List className="">
                                <ListItem className="firstList">                                                           
                                    <div className="coinList">                                                                
                                        <div className="info">
                                            <Typography component="h5">
                                                Pair
                                            </Typography>                                                                
                                        </div>
                                    </div>

                                    <div className="coinprice">
                                        <Typography component="h6">
                                            Change
                                        </Typography>
                                    </div>
                                </ListItem> 
                                { 
                                    marketList['USDT'] && marketList['USDT'].map(market => 
                                    <ListItem className={ market.name === activeMarket.name ? 'selected' : ''} key={market.name} onClick={() => changeActiveMarket(market)}>                                                           
                                        <div className="coinList">
                                            <div className="img">
                                                <img src={currencyIcon(market.stock)} alt="bitcoin" />
                                            </div>

                                            <div className="info">
                                                <Typography component="h5">
                                                {market.stock} /  <span> {market.money} </span> 
                                                </Typography>

                                                <Typography component="h6" 
                                                    className={
                                                    (!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        (((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100) < 0) ?
                                                        'change red' : 'change green' : 'change green' : 'change red'
                                                    }
                                                >
                                                    {
                                                    (!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        (((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100) < 0) ?
                                                        <ArrowDownwardIcon/>  : <ArrowUpwardIcon/> : <ArrowUpwardIcon/> : <ArrowDownwardIcon/>
                                                    }
                                                    
                                                    {(!isEmpty(marketLast)) ?
                                                        (marketLast[market.name]) ?
                                                        ((((parseFloat(marketLast[market.name].last) - parseFloat(marketLast[market.name].open))) / ((parseFloat(marketLast[market.name].open) === 0) ? 1 : parseFloat(marketLast[market.name].open))) * 100).toFixed(2) :
                                                        '0.00' : '-'
                                                    } %
                                                </Typography>
                                            </div>
                                        </div>

                                        <div className="coinprice">
                                            <Typography component="h6">
                                            {
                                                (!isEmpty(marketLast)) ?
                                                (marketLast[market.name]) ?
                                                (parseFloat(marketLast[market.name].ask)).toFixed(2) :
                                                0.00 : 0.00
                                            } USDT
                                            </Typography>
                                        </div>
                                    </ListItem> 
                                    )
                                }
                            </List> 
                        
                    : null
                }
                </div>
    </div>
);

MarketList.propTypes = {
    marketTabValue: PropTypes.string, 
    handleBuyCoinChange: PropTypes.func,
    marketList: PropTypes.array,
    changeActiveMarket: PropTypes.func,
    marketLast: PropTypes.object, 
    activeMarket: PropTypes.object,  
    
};

export default MarketList;