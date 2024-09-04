import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import {
    Card,
    CardContent,
    CardHeader,
    Button,
    Typography,
    List,
    ListItem,
    Tab,
    Tabs,
    TextField,
    CircularProgress,
    RadioGroup,
    Radio,
    FormControlLabel,
    InputAdornment
} from '@mui/material';
import currencyIcon from '../../../common/CurrencyIcon';
import ReactSpeedometer from "react-d3-speedometer";
const moment = require('moment');


const UserTrade = ({
    classes, 
    state, 
    activeStock,
    activeMoney, 
    marketAmount, 
    limitAmount, 
    limitPrice, 
    trading, 
    errors, 
    wallet,
    currentUserMarginFiatWallet,
    currentUserMarginCryptoWallet,
    handlebuyChange,
    changeBuySell,
    handleInputChange,
    createMarketOrder,
    createLimitOrder,
    handleopenChange,
    cancelUserOrder,
    getCurrentTradeBidValue,
    getCurrentTradeAskValue
    }) => (
    
        <Grid item xs={12} md={3} sm={12} className="col-03">
        <div className="buySellBox tabBox">
        <div className="headTitle">
            <Typography component="h6">
                Trade
            </Typography>

            <Button
                variant="contained"
                color="primary"
                className={(state.currentTrade === 'buy') ? "trade-buy-button active" : "trade-buy-button"}
                onClick={() => changeBuySell('buy')}
            >
                Buy
            </Button>
            <Button
                variant="contained"
                color="secondary"
                className={(state.currentTrade === 'sell') ? "trade-sell-button active" : "trade-sell-button"}
                onClick={() => changeBuySell('sell')}
            >
                Sell
            </Button>
        </div>

        <Card className="">
            <CardHeader
                title={
                    <RadioGroup aria-label="gender" name="gender1"  onChange={handlebuyChange} value={state.buyTabValue}>
                        <FormControlLabel value="buy" control={<Radio />} label="Market"  />
                        <FormControlLabel value="sell" control={<Radio />} label="Limit" />
                    </RadioGroup>
                }
            />

            <CardContent>
                {
                    (state.buyTabValue === 'buy') ?

                        <div className="subData">
                            <Grid container>
                                <Grid item md={6} sm={6} xs={6} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <div className="currentMarket">
                                        <img src={currencyIcon(activeStock)} width="20" alt={activeStock} />
                                        <span>{activeStock} / {activeMoney}</span>
                                    </div>
                                </Grid>
                                <Grid item md={6} sm={6} xs={6} style={{textAlign: 'right'}}>
                                    <Typography component="h2">
                                        {(state.currentTrade === 'buy') ?
                                            `Available: ${parseFloat(currentUserMarginFiatWallet.walletAmount).toFixed(2)} ${currentUserMarginFiatWallet.coin}` :
                                            `Available: ${parseFloat(currentUserMarginCryptoWallet.walletAmount).toFixed(8)} ${currentUserMarginCryptoWallet.coin}`
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>


                            
                            <TextField
                                type="number"
                                error={(errors.marketAmount) ? true : false}
                                value={marketAmount}
                                onChange={handleInputChange('marketAmount')}
                                fullWidth={true}
                                placeholder={(`I want to ${state.currentTrade} (in `) + ((state.currentTrade === 'buy' ? `${activeMoney})` : `${activeStock})`))}
                                className={classes.input}
                                InputProps={{
                                    startAdornment: <InputAdornment> Amount </InputAdornment>,
                                }}
                            />

                           
                                <TextField
                                    type="number"
                                    name="marketApprox"
                                    fullWidth={true}
                                    disabled
                                    className={classes.textField}
                                    value={state.currentTrade === 'buy' ? state.marketLastBuy : state.marketLastSell}
                                    InputProps={{
                                        startAdornment: <InputAdornment> Price </InputAdornment>,
                                    }}
                                />
                               

                            
                            <TextField
                                type="number"
                                name="marketSubtotal"
                                fullWidth={true}
                                disabled
                                className={classes.textField}
                                value={(state.currentTrade === 'buy') ? state.marketApprox : state.marketSubtotal}
                                InputProps={{
                                    startAdornment: <InputAdornment> Total  {(state.currentTrade === 'buy' ? `${activeStock}` : `${activeMoney}`)}</InputAdornment>,
                                }}
                            />

                            <div className="inline fee">
                                <Typography component="h5">
                                    
                                </Typography>

                                <Typography component="h5">
                                    Fee:  {state.takerFee * 100} %
                                </Typography>
                            </div>
                            {
                                (state.currentTrade === 'buy') ?
                                    (state.orderProcess) ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                        >
                                            <CircularProgress size={24} color="secondary" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => createMarketOrder('buy')}
                                            disabled={state.orderProcess}
                                            className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                        >
                                            Buy
                                        </Button>
                                    )
                                : (state.orderProcess) ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                    >
                                        <CircularProgress size={24} />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => createMarketOrder('sell')}
                                        disabled={state.orderProcess}
                                        className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                    >
                                        Sell
                                    </Button>
                                )
                            }
                        </div>

                    :

                        <div className="limitData">
                            <div className="subData">

                                <Grid container>
                                    <Grid item md={6} sm={6} xs={6} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                        <div className="currentMarket">
                                            <img src={currencyIcon(activeStock)} width="20" alt={activeStock} />
                                            <span>{activeStock} / {activeMoney}</span>
                                        </div>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6} style={{textAlign: 'right'}}>
                                        <Typography component="h2">
                                            {(state.currentTrade === 'buy') ?
                                                `Available: ${parseFloat(currentUserMarginFiatWallet.walletAmount).toFixed(2)} ${currentUserMarginFiatWallet.coin}` :
                                                `Available: ${parseFloat(currentUserMarginCryptoWallet.walletAmount).toFixed(8)} ${currentUserMarginCryptoWallet.coin}`
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <TextField
                                    type="number"
                                    error={(errors.limitAmount) ? true : false}
                                    value={limitAmount}
                                    onChange={handleInputChange('limitAmount')}
                                    fullWidth={true}
                                    placeholder={`I want to ${state.currentTrade} (in ${activeStock})`}
                                    className={classes.input}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="end"> Amount </InputAdornment>,
                                    }}
                                />

                                <TextField
                                    type="number"
                                    error={(errors.limitPrice) ? true : false}
                                    value={limitPrice}
                                    onChange={handleInputChange('limitPrice')}
                                    fullWidth={true}
                                    placeholder={`I want to ${state.currentTrade} (in ${activeMoney})`}
                                    className={classes.input}
                                    InputProps={{
                                        startAdornment: <InputAdornment onClick={state.currentTrade === 'buy' ? getCurrentTradeBidValue : getCurrentTradeAskValue } position="end">{(state.currentTrade === 'buy') ? `Price` : `Price`}</InputAdornment>,
                                    }}
                                />

                               

                                <TextField
                                    type="number"
                                    value={limitPrice && limitAmount ?  parseFloat(limitPrice*limitAmount).toFixed(4): 0}
                                    fullWidth={true}
                                    placeholder={`Total ${activeMoney}`}
                                    className={classes.input}
                                    disabled
                                    InputProps={{
                                        startAdornment: <InputAdornment position="end"> Total {activeMoney}</InputAdornment>,
                                    }}
                                />

                               

                                <div className="space15"> </div>

                                {(state.currentTrade === 'buy') ?
                                (state.orderProcess) ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                    >
                                        <CircularProgress size={24} color="secondary" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => createLimitOrder('buy')}
                                        disabled={state.orderProcess}
                                        className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                    >
                                        Buy
                                    </Button>
                                ) :
                                (state.orderProcess) ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                    >
                                        <CircularProgress size={24} />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => createLimitOrder('sell')}
                                        disabled={state.orderProcess}
                                        className={(state.currentTrade === 'buy') ? 'btn buyMarket' : 'btn sellMarket'}
                                    >
                                        Sell
                                    </Button>
                                )
                            }

                                </div>
                        </div>
                }
            </CardContent>
        </Card>
    </div>


    <div className="riskGraph">
        <div className="icon">
        <div
            style={{
                width: "130px",
                height: "65px",
            }}
        >
            <ReactSpeedometer
                fluidWidth={true}
                ringWidth={4}
                minValue={1}
                maxValue={1.6}
                segments={10}
                value={wallet.userMarginLevel.marginLevel ? wallet.userMarginLevel.marginLevel > 1.5 ? 1.6 : wallet.userMarginLevel.marginLevel : 0}
                needleColor="#fff"
                startColor="red"
                endColor="green"
                labelFontSize={"10px"}
                valueTextFontSize={"10px"}
                needleHeightRatio={0.6}
                outerCircleStyle={{
                    display: 'none',
                }}
                labelStyle={{
                    display: 'none',
                }}
                maxSegmentLabels={0}
                // currentValuePlaceholderStyle={{display: 'none'}}
            />
        </div>
        </div>
        <div className="textInfo">
            <List>
                <ListItem>
                    <Typography  component="h6">
                        Margin Level: {wallet.userMarginLevel.marginLevel}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography  component="h6">
                        Total Balance: {wallet.userMarginLevel.totalCurrentAssetValue} BTC
                    </Typography>
                </ListItem>

                <ListItem>
                    <Typography  component="h6">
                        Total Debt: {wallet.userMarginLevel.totalDebtAssetValue} BTC
                    </Typography>
                </ListItem>
            </List>
                </div>
            </div>

        <div className="openAllBox tabBox">
            <Card className="">
                <CardHeader
                    title={
                        <Tabs scrollButtons="auto" variant="scrollable" onChange={handleopenChange} value={state.openTabValue} textColor="primary" indicatorColor="primary">
                            <Tab value="open" className={classes.tabRoot} label="OPEN" />
                            <Tab value="all" className={classes.tabRoot} label="ALL" />
                        </Tabs>
                    }
                />
                <CardContent>
                {
                    (state.openTabValue === 'open') ?

                    <List className="openallList margintradingOpenALLBox">

                        {trading.pendingOrders.map((order, index) => <ListItem className={(order.side === 1) ? 'redBorder' : ''} key={index}>
                            <Typography component="h3">
                                <span> {order.market} - </span> {(order.type === 1) ?
                                `${order.amount} @ ${order.price}` :
                                `${order.dealStock} @ ${order.price}`}
                            </Typography>

                            <Typography component="h4">
                                {(order.side === 1) ? 'Sell' : 'Buy'} - {((order.type === 1) ? 'Limit' : 'Market')}
                            </Typography>

                            <Typography component="h5">
                                {moment(order.createTime).format('LLLL')}
                            </Typography>

                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={() => cancelUserOrder(order._id)}
                            >
                                Cancel
                            </Button>

                        </ListItem>)}

                    </List>

                    :

                    <List className="openallList margintradingOpenALLBox">

                        {trading.orders.map((order, index) => <ListItem className={(order.side === 1) ? 'redBorder' : ''} key={index}>
                            <Typography component="h3">
                                <span> {order.market} </span>
                                {(order.type === 1) ?
                                `${order.amount} @ ${order.price}` :
                                `${order.dealStock} @ ${order.price}`}
                            </Typography>

                            <Typography component="h4">
                                {(order.side === 1) ? 'Sell' : 'Buy'} - {((order.type === 1) ? 'Limit' : 'Market')}
                            </Typography>

                            <Typography component="h5">
                                {moment(order.createTime).format('LLLL')}
                            </Typography>

                        </ListItem>)}

                    </List>
                }
                </CardContent>
            </Card>
        </div>
    </Grid>
);

UserTrade.propTypes = {

};

export default UserTrade;