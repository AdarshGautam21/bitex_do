import SDK, { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

const config= {
  rpcProviders: {
    BSC: {
      rpcList: ['https://bsc-dataseed.binance.org/']
    },
    POLYGON: {
      rpcList: ['https://polygon-rpc.com']
    },
    
  }
};

const rubicSDK = await SDK.createSDK(config)