import createConfig from "./rubicSetup";
import SDK, { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

const tradeValue = async(chain1, chain2, address)  =>{
    const sdk = await createConfig(chain1, address)

    if(chain1 == chain2){
        // Define trade parametres
        const fromToken = {
            blockchain: BLOCKCHAIN_NAME.ETHEREUM,
            address: '0x0000000000000000000000000000000000000000'
        };
        const fromAmount = 1;
        const toToken = {
            blockchain: BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
            address: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        };

        // calculated trades
        const trades = await sdk.crossChainManager.calculateTrade(fromToken, fromAmount, toToken);
        const bestTrade = trades[0];
    }


}