import React from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    Typography,
    CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import isEmpty from '../../validation/isEmpty';

const getMaxQuantityMarketInrPrice = (userWallet, convertUserDefaultFiatToCrypto) => {
    const cryptoBalance = userWallet.map(wallet => convertUserDefaultFiatToCrypto(wallet.coin, wallet.walletAmount));
    return (Math.max.apply(Math, cryptoBalance));
}

const calculateMarketQuantity = (maxAmount, cryptoPriceInInr) => {
    maxAmount = maxAmount+300;
    return parseInt((cryptoPriceInInr * 100)/maxAmount);
}
const getCryptoUserWallet  = (userWallet, activeMarket) => {
    const cryptoUserWallet = userWallet.filter(item => item.fiat === false);
    const index = cryptoUserWallet.findIndex(item => item.coin === activeMarket.stock);
    if(index !== -1)
        return move(index, 0, ...cryptoUserWallet);
    return cryptoUserWallet;
}

const move = (from, to, ...a) => from === to ? a : (a.splice(to, 0, ...a.splice(from, 1)), a);

const AssetsAllocation = ({userWallet, currentUserFiatWallet, convertUserDefaultFiatToCrypto, isAuthenticated, activeMarket, isDefaltMarketChange,   classes}) => {
    if(isAuthenticated) {
        userWallet = getCryptoUserWallet(userWallet, activeMarket);
        const maxAmount = getMaxQuantityMarketInrPrice(userWallet, convertUserDefaultFiatToCrypto);
        return (<div className="tradeBox">
            <div className="headTitle">
                <Typography variant="h6" className="">
                    Asset Allocation
                </Typography> 
            </div>
            <div className="allocationCoins">
                <List className="">
                    {
                        !isEmpty(userWallet) && userWallet.map((wallet, index) => {
                                const cryptoPriceInInr = convertUserDefaultFiatToCrypto(wallet.coin, wallet.walletAmount)
                                return (
                                    <ListItem key={wallet.displayName} className="item"> 
                                        <div className="progressBar">
                                            <div className="data">
                                                <div className="coinName">
                                                    <Typography component="h3">
                                                        {wallet.coin}
                                                    </Typography>
                    
                                                    <Typography component="h5">
                                                        {wallet.displayName}
                                                    </Typography>
                                                    
                                                </div>
                                                <div className="value">
                                                    <Typography component="h3">
                                                    {parseFloat(wallet.walletAmount).toFixed(6)} {wallet.coin}
                                                    </Typography>
                                                    <Typography component="h5">
                                                    {
                                                        (wallet.coin === activeMarket.stock && isDefaltMarketChange) ? 
                                                        <CircularProgress size={10} color="inherit" /> :
                                                        currentUserFiatWallet.coin === "INR" ?
                                                            `₹ ${cryptoPriceInInr}`
                                                        :
                                                        currentUserFiatWallet.coin === "AED" ?
                                                            `${cryptoPriceInInr}د.إ`
                                                        :
                                                        currentUserFiatWallet.coin === "USDT" ?
                                                            `${cryptoPriceInInr} USDT`
                                                        : null
                                                    }
                                                    </Typography>
                                                </div>
                                            </div>
                                            <LinearProgress variant="determinate" value={calculateMarketQuantity(maxAmount, cryptoPriceInInr)} />
                                        </div>
                                    </ListItem>
                                )       
                        })
                    }
                    </List>
            </div>
        </div>);
    } else {
        return (
            <div className="tradeBox">
                <div className="headTitle">
                    <Typography variant="h6" className="">
                        Asset Allocation
                    </Typography> 
                </div>
                <div className="allocationCoins">
                    <div className="tradingLogin">

                        <Link to="/login" className="login">
                            Login to see Assets
                        </Link>

                        {/* <Link to="/login">
                            <Button variant="contained" color="primary" className={classes?.button}>
                                Log in
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="contained" color="secondary" className={classes?.button}>
                                Register
                            </Button>
                        </Link> */}
                    </div>
                </div>
            </div>
        );
    }
}

AssetsAllocation.propTypes = {
    userWallet: PropTypes.array, 
    currentUserFiatWallet: PropTypes.object, 
    convertUserDefaultFiatToCrypto: PropTypes.func, 
    isAuthenticated: PropTypes.bool
};

export default AssetsAllocation;