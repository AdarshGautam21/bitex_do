import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withStyles } from "@mui/styles/";
import isEmpty from '../../validation/isEmpty';
import themeStyles from '../../assets/themeStyles';

import {
    Card,
    CardContent,
    CardHeader,
    Container,
    Button,
    TextField,
    Link,
} from '@mui/material';
import {Tabs, Tab, Grid} from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';

import {
    placeMarketOrder,
    placeLimitOrder,
    getUserOrders,
    getMarketDeals,
    getOrderBook,
    getOrderDepth,
} from '../../actions/orderActions';
import {getUserProfile} from '../../actions/userActions';
import { clearSnackMessages } from '../../actions/messageActions';

import Snackbar from '@mui/material/Snackbar';
import SnackbarMessage from '../../common/SnackbarMessage';

import tableIcons from '../../common/tableIcons';

import MaterialTable from 'material-table';

class UserOrder extends Component {
    state = {
        orderTab: 'my_orders',
        errors: {},
        snackMessages: {},
        marketAmount: '',
        limitPrice: '',
        limitAmount: '',
        variant: 'success',
        snackbarMessage: '',
        takerFee: '',
        makerFee: '',
    }

    componentDidMount = () => {
        // window.fcWidget.destroy();
        const {user} = this.props.auth;
        this.props.getUserOrders(user.id);
        this.props.getUserProfile(user.id);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
        if(nextProps.snackMessages) {
            this.setState({ snackMessages: nextProps.snackMessages });
        }
        if(!isEmpty(nextProps.user.userProfile)) {
            this.setState({
                takerFee: parseFloat(nextProps.user.userProfile.traderLevelFees.takerFee)/100,
                makerFee: parseFloat(nextProps.user.userProfile.traderLevelFees.makerFee)/100,
            })
        }
    };

    handleChange = (event, newValue) => {
        let currentMarket = this.props.trading.activeMarket;
        if(newValue === 'live_trades') {
            const userParams = {
                market: currentMarket.name,
                limit: 100,
                interval: "0"
            }
            this.props.getOrderDepth(userParams);
        }
        if(newValue === 'order_book') {
            const userSellParams = {
                market: currentMarket.name,
                side: 1,
                offset: 0,
                limit: 100
            }
            this.props.getOrderBook(userSellParams);
            const userBuyParams = {
                market: currentMarket.name,
                side: 2,
                offset: 0,
                limit: 100
            }
            this.props.getOrderBook(userBuyParams);
        }
        this.setState({orderTab: newValue});
    };

    handleInputChange = (name) => event => {
        this.setState({ [name]: event.target.value });
    };

    createMarketOrder = async (value) => {
        let currentMarket = this.props.trading.activeMarket;
        let userParams = {};
        const {user} = this.props.auth;
        if(value === 'buy') {
            userParams.userId = user.id;
            userParams.user_id = parseInt(user.id.replace(/\D/g,''));
            userParams.market = currentMarket.name;
            userParams.side = 2;
            userParams.amount = this.state.marketAmount;
            userParams.taker_fee_rate = this.state.takerFee;
            userParams.fiat = currentMarket.money;
            userParams.crypto = currentMarket.stock;
            userParams.source = '';
            await this.props.placeMarketOrder(userParams);
        }

        if(value === 'sell') {
            userParams.userId = user.id;
            userParams.user_id = parseInt(user.id.replace(/\D/g,''));
            userParams.market = currentMarket.name;
            userParams.side = 1;
            userParams.amount = this.state.marketAmount;
            userParams.taker_fee_rate = this.state.takerFee;
            userParams.fiat = currentMarket.money;
            userParams.crypto = currentMarket.stock;
            userParams.source = '';
            await this.props.placeMarketOrder(userParams);
        }

        this.props.getUserOrders(user.id);
    }

    createLimitOrder = async (value) => {
        let currentMarket = this.props.trading.activeMarket;
        let userParams = {};
        const {user} = this.props.auth;
        if(value === 'buy') {
            userParams.userId = user.id;
            userParams.user_id = parseInt(user.id.replace(/\D/g,''));
            userParams.market = currentMarket.name;
            userParams.side = 2;
            userParams.amount = this.state.limitAmount;
            userParams.price = this.state.limitPrice;
            userParams.taker_fee_rate = this.state.takerFee;
            userParams.maker_fee_rate = this.state.makerFee;
            userParams.fiat = currentMarket.money;
            userParams.crypto = currentMarket.stock;
            userParams.source = '';
            await this.props.placeLimitOrder(userParams);
        }

        if(value === 'sell') {
            userParams.userId = user.id;
            userParams.user_id = parseInt(user.id.replace(/\D/g,''));
            userParams.market = currentMarket.name;
            userParams.side = 1;
            userParams.amount = this.state.limitAmount;
            userParams.price = this.state.limitPrice;
            userParams.taker_fee_rate = this.state.takerFee;
            userParams.maker_fee_rate = this.state.makerFee;
            userParams.fiat = currentMarket.money;
            userParams.crypto = currentMarket.stock;
            userParams.source = '';
            await this.props.placeLimitOrder(userParams);
        }

        this.props.getUserOrders(user.id);
    }

    handleSnackbarClose = () => {
        this.props.clearSnackMessages();
    }

    render() {
        const {classes, trading} = this.props;
        const {
            orderTab,
            errors,
            marketAmount,
            limitPrice,
            limitAmount,
            snackMessages,
            variant,
            snackbarMessage,
        } = this.state;

        let tabContent = (
            <Grid container spacing={3}>
                <Grid md={6} item>
                    <Card className={classes.paperContainer}>
                        <CardHeader
                            title="Market Order"
                            subheader={'Place market orders'}
                        />
                        <CardContent className={classes.media}>
                            <Grid container spacing={2}>
                                <Grid item md={12}>
                                    <TextField
                                        error={(errors.marketAmount) ? true : false}
                                        margin="dense"
                                        id="marketAmount"
                                        label="I want to buy or sell"
                                        value={marketAmount}
                                        onChange={this.handleInputChange('marketAmount')}
                                        type="number"
                                        fullWidth={true}
                                        helperText={errors.marketAmount}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={() => this.createMarketOrder('buy')}
                                    >
                                        Buy
                                    </Button>
                                </Grid>
                                <Grid item md={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={() => this.createMarketOrder('sell')}
                                    >
                                        Sell
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid md={6} item>
                    <Card className={classes.paperContainer}>
                        <CardHeader
                            title="Limit Order"
                            subheader={'Place limit orders'}
                        />
                        <CardContent className={classes.media}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextField
                                        error={(errors.limitAmount) ? true : false}
                                        margin="dense"
                                        id="limitAmount"
                                        label="I want to buy or sell"
                                        value={limitAmount}
                                        onChange={this.handleInputChange('limitAmount')}
                                        type="number"
                                        fullWidth={true}
                                        helperText={errors.limitAmount}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        error={(errors.limitPrice) ? true : false}
                                        margin="dense"
                                        id="limitPrice"
                                        label="Buy or Sell price"
                                        value={limitPrice}
                                        onChange={this.handleInputChange('limitPrice')}
                                        type="number"
                                        fullWidth={true}
                                        helperText={errors.limitPrice}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={() => this.createLimitOrder('buy')}
                                    >
                                        Buy
                                    </Button>
                                </Grid>
                                <Grid item md={2}>
                                    <Link to="/user-wallet">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={() => this.createLimitOrder('sell')}
                                    >
                                        Sell
                                    </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid md={12} item>
                    <MaterialTable
                        title="My Orders"
                        options={{
                            actionsColumnIndex: -1
                        }}
                        icons={tableIcons}
                        columns={[
                            { title: 'Order ID', field: 'orderId' },
                            { title: 'Market', field: 'market' },
                            { title: 'Type', field: 'type' },
                            { title: 'Amount', field: 'amount' },
                            { title: 'Price', field: 'price' },
                            { title: 'Side', field: 'side' },
                            { title: 'Maker Fee', field: 'makerFee' },
                            { title: 'Taker Fee', field: 'takerFee' },
                            { title: 'Date', field: 'createTime' },
                        ]}
                        data={trading.orders}
                    />
                </Grid>
            </Grid>
        )

        if(orderTab === 'live_trades') {
            tabContent = <Grid container spacing={3}>
                <Grid item md={12}>
                    <Card className={classes.paperContainer}>
                        <CardHeader
                            title="Asks"
                            subheader={'Asks trades'}
                        />
                        <CardContent className={classes.media}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trading.orderDepths.asks.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {index}
                                            </TableCell>
                                            <TableCell align="right">{order[0]}</TableCell>
                                            <TableCell align="right">{order[1]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={12}>
                    <Card className={classes.paperContainer}>
                        <CardHeader
                            title="Bids"
                            subheader={'Bids trades'}
                        />
                        <CardContent className={classes.media}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trading.orderDepths.bids.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {index}
                                            </TableCell>
                                            <TableCell align="right">{order[0]}</TableCell>
                                            <TableCell align="right">{order[1]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>;
        }

        if(orderTab === 'order_book') {
            tabContent = <Card className={classes.paperContainer}>
                            <CardHeader
                                title="Order Book"
                                subheader={'Order book'}
                            />
                            <CardContent className={classes.media}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell align="right">Market</TableCell>
                                            <TableCell align="right">Type</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Side</TableCell>
                                            <TableCell align="right">Maker Fee</TableCell>
                                            <TableCell align="right">Taker Fee</TableCell>
                                            <TableCell align="right">Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {trading.orderSellBooks.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {order.id}
                                            </TableCell>
                                            <TableCell align="right">{order.market}</TableCell>
                                            <TableCell align="right">{(order.type === 1) ? 'Limit' : 'Market'}</TableCell>
                                            <TableCell align="right">{order.amount}</TableCell>
                                            <TableCell align="right">{order.price}</TableCell>
                                            <TableCell align="right">{(order.side === 1) ? 'Sell' : 'Buy'}</TableCell>
                                            <TableCell align="right">{order.maker_fee}</TableCell>
                                            <TableCell align="right">{order.taker_fee}</TableCell>
                                            <TableCell align="right">{order.ctime}</TableCell>
                                        </TableRow>
                                    ))}
                                    {trading.orderBuyBooks.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {order.id}
                                            </TableCell>
                                            <TableCell align="right">{order.market}</TableCell>
                                            <TableCell align="right">{(order.type === 1) ? 'Limit' : 'Market'}</TableCell>
                                            <TableCell align="right">{order.amount}</TableCell>
                                            <TableCell align="right">{order.price}</TableCell>
                                            <TableCell align="right">{(order.side === 1) ? 'Sell' : 'Buy'}</TableCell>
                                            <TableCell align="right">{order.maker_fee}</TableCell>
                                            <TableCell align="right">{order.taker_fee}</TableCell>
                                            <TableCell align="right">{order.ctime}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
        }

        return (
            <React.Fragment>
                <div className="paddingTopbody">
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        open={!isEmpty(snackMessages) ? true : false}
                        autoHideDuration={3000}
                        onClose={this.handleSnackbarClose}
                    >
                        <SnackbarMessage
                            onClose={this.handleSnackbarClose}
                            variant={!isEmpty(snackMessages) ? snackMessages.variant : variant}
                            message={!isEmpty(snackMessages) ? snackMessages.message : snackbarMessage}
                        />
                    </Snackbar>
                    <Tabs
                        className="settingSubMenu"
                        value={orderTab}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab value="my_orders" label="My Orders" />
                        <Tab value="live_trades" label="Live Trades" />
                        <Tab value="order_book" label="Order Book" />
                    </Tabs>
                    <Container maxWidth="md" component="main" style={userOrderStyle.mainContainer}>
                        {tabContent}
                    </Container>
                </div>
            </React.Fragment>
        )
    }
}

const userOrderStyle = {
    mainContainer: {
        // width: '100%',
        // flex: 1,
        // // maxWidth: '100%',
        // padding: 0,
        // textAlign: 'center',
        paddingTop: 35,
        // paddingBottom: 35,
        height: '100vh',
    }
}

UserOrder.propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    trading: PropTypes.object.isRequired,
    placeMarketOrder: PropTypes.func.isRequired,
    placeLimitOrder: PropTypes.func.isRequired,
    clearSnackMessages: PropTypes.func.isRequired,
    getUserOrders: PropTypes.func.isRequired,
    getMarketDeals: PropTypes.func.isRequired,
    getOrderBook: PropTypes.func.isRequired,
    getOrderDepth: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
}

const mapStateToProp = state => ({
    auth: state.auth,
    user: state.user,
    wallet: state.wallet,
    trading: state.trading,
    snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
    placeMarketOrder,
    placeLimitOrder,
    clearSnackMessages,
    getUserOrders,
    getMarketDeals,
    getOrderBook,
    getOrderDepth,
    getUserProfile,
})(withStyles(themeStyles)(UserOrder));
