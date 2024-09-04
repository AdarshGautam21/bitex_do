import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { TextField, Paper, Divider, FormControl, Box } from "@mui/material";

import { useAccount, useSendTransaction, useEstimateGas } from "wagmi";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CurrencyPickerDialog from "./CurrencyPicker";

import { useModal } from "connectkit";
import { useSelector, useDispatch } from "react-redux";
import { getSwapPrice, getSwapQuote } from "../../actions/swapAction";
import { formatUnits, parseEther, parseUnits } from "viem";
import CurrencyInputButton from "./CurrencyInputButton";

const FEES_RECIPIENT = "0x6E55C0099e9DddD79B6dcD62D9cF0673f5feeab0";
const AFFILIATE_FEE = "0.01";

const styles = (theme) => ({
  textField: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
    color: "red",
  },
  input: {
    color: "white",
  },
});

const ETH_TOKENS = [
  {
    chainId: 137,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032",
  },
  {
    chainId: 137,
    name: "Wrapped ETH",
    symbol: "WETH",
    decimals: 18,
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    logoURI: "https://cryptologos.cc/logos/ethereum-pow-ethw-logo.svg?v=032",
  },
];

function Swap({ openCurrencyComponent }) {
  //const [data, setData] = React.useState(cryptoData);
  const dispatch = useDispatch();

  const { address, isConnected } = useAccount();

  const [isBuy, setIsBuy] = React.useState(false);

  const [sellCurrency, setSellCurrency] = React.useState(ETH_TOKENS[0]);
  const [buyCurrency, setBuyCurrency] = React.useState(ETH_TOKENS[1]);

  const [tradeDirection, setTradeDirection] = useState("sell");

  const { priceData, quoteData } = useSelector((state) => state.swap);

  console.log("quoteData", quoteData);

  const { data } = useEstimateGas({
    to: quoteData?.data?.to,
    value: parseEther("0.01"),
  });

  const { sendTransaction } = useSendTransaction();

  const connectKitModal = useModal();

  const [formData, setFormData] = React.useState({
    amountValue: "",
    coinValue: "",
    fiatCurrency: "",
  });

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const handleInputCurrencyValueChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTradeDirection(name === "sellCurrency" ? "sell" : "buy");
    fetchPriceData(value, "sellCurrency" ? "sell" : "buy");
    // let currency = name === "sellCurrency" ? sellCurrency : buyCurrency;
    // debugger;
    // if (name === "sellCurrency" || "buyCurrency") {
    //   let quantityRangeValue = currency?.quantityRangeValue;
    //   let buyValueErrors = {};
    //   if (
    //     parseFloat(quantityRangeValue?.max) <= parseFloat(value) &&
    //     parseFloat(quantityRangeValue?.min) >= parseFloat(value)
    //   ) {
    //     setFormData({ ...formData, [name]: value });
    //     setErrors({});
    //   } else {
    //     buyValueErrors.amountValue =
    //       "Coin Value must be maximum " +
    //       quantityRangeValue?.max +
    //       " and minimum " +
    //       quantityRangeValue?.min;
    //     setErrors(buyValueErrors);
    //   }
    // } else {
    //   setErrors({});
    // }
  };

  /**
   * get price data for each update
   */
  function fetchPriceData(value, direction) {
    const parsedSellAmount =
      value && direction === "sell"
        ? parseUnits(value, sellCurrency.decimals).toString()
        : undefined;

    const parsedBuyAmount =
      value && direction === "buy"
        ? parseUnits(value, buyCurrency.decimals).toString()
        : undefined;

    const params = {
      sellToken: sellCurrency.address,
      buyToken: buyCurrency.address,
      sellAmount: parsedSellAmount,
      buyAmount: parsedBuyAmount,
      takerAddress: address,
      feeRecipient: FEES_RECIPIENT,
      buyTokenPercentageFee: AFFILIATE_FEE,
    };

    dispatch(getSwapPrice(params));
  }

  useEffect(() => {
    console.log("price_data", priceData);
    if (priceData && priceData.success) {
      if (tradeDirection === "sell") {
        setFormData({
          ...formData,
          buyCurrency: formatUnits(
            priceData.data.buyAmount,
            buyCurrency.decimals
          ),
        });
      } else {
        setFormData({
          ...formData,
          sellCurrency: formatUnits(
            priceData.data.buyAmount,
            buyCurrency.decimals
          ),
        });
      }
    }
  }, [priceData]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.amountValue.trim()) {
      formErrors.amountValue = "Buy Value field must not be empty";
      isValid = false;
    }

    if (!formData.coinValue.trim()) {
      formErrors.coinValue = "Coin Value field must not be empty";
      isValid = false;
    }

    // setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log(formData);
    }
  };

  const onProceedClicked = () => {
    if (quoteData && quoteData.success) {
      sendTransaction({
        gas: data,
        to: quoteData.data.to,
        value: parseEther("0.01"),
      });
    } else if (priceData && priceData.success) {
      const parsedSellAmount =
        formData.sellCurrency && tradeDirection === "sell"
          ? parseUnits(formData.sellCurrency, sellCurrency.decimals).toString()
          : undefined;

      const parsedBuyAmount =
        formData.buyCurrency && tradeDirection === "buy"
          ? parseUnits(formData.buyCurrency, buyCurrency.decimals).toString()
          : undefined;

      const params = {
        sellToken: sellCurrency.address,
        buyToken: buyCurrency.address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        takerAddress: address,
        feeRecipient: FEES_RECIPIENT,
        buyTokenPercentageFee: AFFILIATE_FEE,
      };

      dispatch(getSwapQuote(params));
    }
  };

  /**
   * onn currency selected
   */
  const onCurrencySelected = (currency) => {
    if (isBuy) {
      setBuyCurrency(currency);
    } else {
      setSellCurrency(currency);
    }
    closeBottomSheet();
  };

  const handleModalBox = () => {
    connectKitModal.setOpen(true);
  };

  return (
    <>
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "60vh",
          }}
        >
          <CurrencyPickerDialog
            isOpen={isBottomSheetOpen}
            onClose={closeBottomSheet}
            onCurrencySelected={onCurrencySelected}
          />

          <Box>
            <>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack direction="column" spacing={2}>
                    <CurrencyInputButton
                      currency={sellCurrency}
                      name={"sellCurrency"}
                      value={formData.sellCurrency}
                      onChangeValue={handleInputCurrencyValueChange}
                      onPickCurrency={() => {
                        setIsBuy(false);
                        openBottomSheet();
                      }}
                    />

                    <CurrencyInputButton
                      currency={buyCurrency}
                      name={"buyCurrency"}
                      value={formData.buyCurrency}
                      onChangeValue={handleInputCurrencyValueChange}
                      onPickCurrency={() => {
                        setIsBuy(true);
                        openBottomSheet();
                      }}
                    />
                  </Stack>
                </div>
              </form>
            </>

            {/* <Button onClick={() => dispatch(getSwapPrice())}>Get price</Button>

            <Button onClick={() => dispatch(getSwapQuote())}>Get Quote</Button>

            <Button
              disabled={!Boolean(data)}
              onClick={() =>
                sendTransaction({
                  gas: data,
                  to: quoteData.to,
                  value: parseEther("0.01"),
                })
              }
            >
              Place Order
            </Button> */}

            <Box>
              {!isConnected ? (
                <Button
                  type="submit"
                  fullWidth={true}
                  style={{
                    padding: "10px",
                    borderRadius: "25px",
                    marginTop: "5%",
                    marginBottom: "2%",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardRoundedIcon fontSize="1rem" />}
                  onClick={handleModalBox}
                >
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  fullWidth={true}
                  style={{
                    padding: "10px",
                    borderRadius: "25px",
                    marginTop: "20px",
                  }}
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={onProceedClicked}
                >
                  {quoteData && quoteData?.success ? "Approve" : "Proceed"}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default Swap;
