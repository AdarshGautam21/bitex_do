import SDK, { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

const defaultConfig = {
    rpcProviders: {
      // Binance Smart Chain
      BSC: {
        rpcList: [
          'https://bsc-dataseed.binance.org/', 
          'https://bsc-dataseed1.ninicoin.io/',
          'https://bsc-dataseed1.defibit.io/'
        ]
      },
      
      // Polygon
      POLYGON: {
        rpcList: [
          'https://polygon-rpc.com',
          'https://rpc-mainnet.maticvigil.com',
          'https://rpc-mainnet.matic.network'
        ]
      },
      
      // Ethereum
      ETHEREUM: {
        rpcList: [
          'https://mainnet.infura.io/v3/<your-infura-api-key>', 
          'https://eth-mainnet.alchemyapi.io/v2/<your-alchemy-api-key>'
        ]
      },
      
      // Avalanche
      AVALANCHE: {
        rpcList: [
          'https://api.avax.network/ext/bc/C/rpc', 
          'https://avalanche-mainnet.infura.io/v3/<your-infura-api-key>'
        ]
      },
  
      // Fantom
      FANTOM: {
        rpcList: [
          'https://rpcapi.fantom.network', 
          'https://fantom-mainnet.public.blastapi.io'
        ]
      },
  
      // Arbitrum
      ARBITRUM: {
        rpcList: [
          'https://arb1.arbitrum.io/rpc', 
          'https://arbitrum-mainnet.infura.io/v3/<your-infura-api-key>'
        ]
      },
  
      // Optimism
      OPTIMISM: {
        rpcList: [
          'https://mainnet.optimism.io', 
          'https://optimism-mainnet.infura.io/v3/<your-infura-api-key>'
        ]
      },
  

  
      // Solana
      SOLANA: {
        rpcList: [
          'https://api.mainnet-beta.solana.com', 
          'https://solana-mainnet.rpcpool.com'
        ]
      },
  
      // Harmony
      HARMONY: {
        rpcList: [
          'https://api.harmony.one', 
          'https://harmony-0-rpc.gateway.pokt.network'
        ]
      }
    }
  };
  

const createConfig = async(chain, address) =>{

    if(chain == 'EVM'){
    
    const newConfig = {
        ...defaultConfig,
        walletProvider: {
          [CHAIN_TYPE.EVM]: {
            core: window.ethereum,
            address: address
          }
        },
      };
      const rubicSDK = await SDK.createSDK(newConfig)
      return rubicSDK;
    }

    else if(chain == 'SOL'){
        const newConfig = {
            ...defaultConfig,
            walletProvider: {
                [CHAIN_TYPE.SOLANA]: {
                core: window.solana,            // Injected by Phantom or Sollet
                address: address
                }
            },
          };
          const rubicSDK = await SDK.createSDK(newConfig)
             return rubicSDK;
    }
    //   const rubicSDK = await SDK.createSDK(newConfig)
    //   return rubicSDK;
}

// const rubicSDK = await SDK.createSDK(config)

export default createConfig;