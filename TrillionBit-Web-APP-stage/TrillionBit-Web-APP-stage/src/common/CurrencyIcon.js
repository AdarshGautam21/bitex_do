import btcSymbol from '../assets/img/coins/btc.webp';
import btxSymbol from '../assets/img/coins/btx.webp';
import bchSymbol from '../assets/img/coins/bch.webp';
import aedSymbol from '../assets/img/coins/aed.webp';
import inrSymbol from '../assets/img/coins/inr.webp';
import usdSymbol from '../assets/img/coins/usd.webp';
import xrpSymbol from '../assets/img/coins/xrp.webp';
import ltcSymbol from '../assets/img/coins/ltc.webp';
import ethSymbol from '../assets/img/coins/eth.webp';
import zecSymbol from '../assets/img/coins/zec.webp';
import xlmSymbol from '../assets/img/coins/xlm.webp';
import dashSymbol from '../assets/img/coins/dash.webp';
// import usdtSymbol from '../assets/img/usdt.webp';
import usdtSymbol from '../assets/img/coins/tether.webp';
import trxSymbol from '../assets/img/coins/trx.webp';
import eurSymbol from '../assets/img/coins/eur.webp';
import gbpSymbol from '../assets/img/coins/gbp.webp';

const currencyIcon = (currency) => {
    switch (currency) {
        case 'BTC':
            return btcSymbol;
        case 'tbtc':
            return btcSymbol;
        case 'BCH':
            return bchSymbol;
        case 'tbch':
            return bchSymbol;
        case 'AED':
            return aedSymbol;
        case 'INR':
            return inrSymbol;
        case 'USD':
            return usdSymbol;
        case 'XRP':
            return xrpSymbol;
        case 'ETH':
            return ethSymbol;
        case 'LTC':
            return ltcSymbol;
        case 'tltc':
            return ltcSymbol;
        case 'ZEC':
            return zecSymbol;
        case 'tzec':
            return zecSymbol;
        case 'XLM':
            return xlmSymbol;
        case 'txlm':
            return xlmSymbol;
        case 'DASH':
            return dashSymbol;
        case 'tdash':
            return dashSymbol;
        case 'USDT':
            return usdtSymbol;
        case 'tusdt':
            return usdtSymbol;
        case 'BTX':
            return btxSymbol;
        case 'TRX':
            return trxSymbol;
        case 'EUR':
            return eurSymbol;
        case 'GBP':
            return gbpSymbol;
        default:
            return btcSymbol;
    }
}

export default currencyIcon;