import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { useAccount } from "wagmi";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CurrencyPickerDialog from "./CurrencyPicker";
import { useSelector, useDispatch } from "react-redux";
import { formatUnits, parseUnits } from "viem";
import CurrencyInputButton from "./CurrencyInputButton";
import { SDK, BLOCKCHAIN_NAME, EvmOnChainTrade, OnChainTrade } from 'rubic-sdk';

const FEES_RECIPIENT = "0x4432D8A82F5623598669cd9bC85d6D305e015e02";
const AFFILIATE_FEE = "0.01";

const ETH_TOKENS = [
  {
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032",
  },
  {
    chainId: 1,
    name: "Wrapped ETH",
    symbol: "WETH",
    decimals: 18,
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    logoURI: "https://assets.rubic.exchange/assets/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/logo.png",
  },
];

const configuration = {
  rpcProviders: {
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      rpcList: ['<your ethereum rpc #1>', '<your ethereum rpc #2>']
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      rpcList: ['<your bsc rpc>']
    },
    [BLOCKCHAIN_NAME.TRON]: {
      rpcList: [
        {
          fullHost: '<tron api>',
          headers: { "TRON-PRO-API-KEY": 'your api key' }
        }
      ]
    }
  },
  providerAddress: {
    EVM: {
      crossChain: '0x0000000000000000000000000000000000000000',
      onChain: '0x0000000000000000000000000000000000000000'
    }
  }
};

function Swap() {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [sellCurrency, setSellCurrency] = useState(ETH_TOKENS[0]);
  const [buyCurrency, setBuyCurrency] = useState(ETH_TOKENS[1]);
  const [formData, setFormData] = useState({ sellCurrency: "", buyCurrency: "" });
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [sdkInstance, setSdkInstance] = useState(null);

  useEffect(() => {
    const initSDK = async () => {
      const sdk = await SDK.createSDK(configuration);
      setSdkInstance(sdk);
    };
    initSDK();
  }, []);

  const fetchPriceData = async (value, direction) => {
    const parsedSellAmount = direction === "sell"
      ? parseUnits(value, sellCurrency.decimals).toString()
      : undefined;

    const parsedBuyAmount = direction === "buy"
      ? parseUnits(value, buyCurrency.decimals).toString()
      : undefined;

    if (sdkInstance) {
      const trades = await sdkInstance.onChainManager.calculateTrade(
        { blockchain: BLOCKCHAIN_NAME.ETHEREUM, address: sellCurrency.address },
        parsedSellAmount || parsedBuyAmount,
        buyCurrency.address
      );

      const bestTrade = trades[0];
      console.log(`Best Trade:`, bestTrade);
      trades.forEach(trade => {
        if (trade instanceof OnChainTrade || trade instanceof EvmOnChainTrade) {
          console.log(`Trade Info: ${trade.to.tokenAmount.toFormat(3)}, Gas: ${trade.gasFeeInfo}`);
        }
      });

      if (direction === "sell") {
        setFormData({ ...formData, buyCurrency: formatUnits(bestTrade.to.tokenAmount, buyCurrency.decimals) });
      } else {
        setFormData({ ...formData, sellCurrency: formatUnits(bestTrade.to.tokenAmount, buyCurrency.decimals) });
      }
    }
  };

  const handleInputCurrencyValueChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    fetchPriceData(value, name === "sellCurrency" ? "sell" : "buy");
  };

  const onProceedClicked = async () => {
    const parsedSellAmount = parseUnits(formData.sellCurrency, sellCurrency.decimals).toString();
    const trades = await sdkInstance.onChainManager.calculateTrade(
      { blockchain: BLOCKCHAIN_NAME.ETHEREUM, address: sellCurrency.address },
      parsedSellAmount,
      buyCurrency.address
    );
    const bestTrade = trades[0];
    const onConfirm = (hash) => console.log(`Transaction Hash: ${hash}`);
    await bestTrade.swap({ onConfirm });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "60vh" }}>
      <CurrencyPickerDialog isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />
      <Box>
        <form>
          <Stack direction="column" spacing={2}>
            <CurrencyInputButton
              currency={sellCurrency}
              name="sellCurrency"
              value={formData.sellCurrency}
              onChangeValue={handleInputCurrencyValueChange}
              onPickCurrency={() => setIsBottomSheetOpen(true)}
            />
            <CurrencyInputButton
              currency={buyCurrency}
              name="buyCurrency"
              value={formData.buyCurrency}
              onChangeValue={handleInputCurrencyValueChange}
              onPickCurrency={() => setIsBottomSheetOpen(true)}
            />
          </Stack>
        </form>
        <Box>
          {!isConnected ? (
            <Button variant="contained" color="primary" onClick={() => {}}>
              Connect Wallet
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={onProceedClicked}>
              Proceed
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Swap;
