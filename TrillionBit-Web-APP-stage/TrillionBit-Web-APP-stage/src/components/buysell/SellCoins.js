import React, { useEffect, useState } from "react";
import { Stack, Button, TextField, Select, MenuItem, FormControl, Paper, Divider } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { makeStyles } from "@mui/styles";
import { getMerchantAuthToken, getPartnerAuthToken } from './transactWorld'; // Import the API functions

const useStyles = makeStyles({
  input: {
    fontSize: "96px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "700",
    color: "red",
  },
});

export default function Sell() {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [setLoading] = useState(true);
  const [currency, setCurrency] = useState(null);
  const [formData, setFormData] = useState({
    amountValue: "",
    coinValue: "",
    fiatCurrency: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching Auth Tokens
        const merchantAuthToken = await getMerchantAuthToken();
        console.log('Merchant Auth Token:', merchantAuthToken);

        const partnerAuthToken = await getPartnerAuthToken();
        console.log('Partner Auth Token:', partnerAuthToken);

        // Fetching Market Data
        const response = await fetch(
          "https://trillionbit-api-production.up.railway.app/api/guest/get_active_markets"
        ); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  const handleChange = (event) => {
    let selectedOption = event.target.value;
    setCurrency(selectedOption);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amountValue") {
      let quantityRangeValue = currency?.quantityRange;
      let buyValueErrors = {};
      if (
        parseFloat(quantityRangeValue?.max) <= parseFloat(value) &&
        parseFloat(quantityRangeValue?.min) >= parseFloat(value)
      ) {
        setFormData({ ...formData, [name]: value });
        setErrors({});
      } else {
        buyValueErrors.amountValue =
          "Coin Value must be maximum " +
          quantityRangeValue?.max +
          " and minimum " +
          quantityRangeValue?.min;
        setErrors(buyValueErrors);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({});
    }
  };

  const handleSetBuyVal = (param) => {
    if (currency) {
      setFormData({ ...formData, fiatCurrency: param });
    }
  };

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

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log(formData);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Stack direction="column" spacing={2}>
            <FormControl>
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  borderRadius: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TextField
                  placeholder="Buy"
                  type="number"
                  value={formData.amountValue}
                  onChange={handleInputChange}
                  name="amountValue"
                  disabled={!currency}
                  error={!!errors.amountValue}
                  InputProps={{ className: classes.input }}
                  helperText={errors.amountValue}
                  sx={{ width: "100%" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Select
                  value={currency}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  label="Select Option"
                  variant="outlined"
                >
                  <MenuItem value="">Select</MenuItem>
                  {data &&
                    data.map((option) => (
                      <MenuItem key={option._id} value={option}>
                        {option.displayName}
                      </MenuItem>
                    ))}
                </Select>
              </Paper>
            </FormControl>
            <FormControl>
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  borderRadius: "10px",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TextField
                  placeholder="Enter the Value"
                  value={formData.fiatCurrency}
                  onChange={handleInputChange}
                  error={!!errors.fiatCurrency}
                  helperText={errors.fiatCurrency}
                  name="fiatCurrency"
                  sx={{ width: "100%" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Select
                  labelId="select-currency-label"
                  id="select-currency"
                  value={formData.fiatCurrency}
                  onChange={(e) => handleInputChange(e)}
                  name="fiatCurrency"
                  label="Currency"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="usd">USD</MenuItem>
                  <MenuItem value="eur">EUR</MenuItem>
                  <MenuItem value="gbp">GBP</MenuItem>
                  <MenuItem value="jpy">JPY</MenuItem>
                </Select>
              </Paper>
            </FormControl>
            <div>
              <Stack direction="row" style={{ margin: "1px" }}>
                <Button
                  fullWidth={true}
                  style={{
                    borderRadius: "25px",
                    padding: "5px",
                    margin: "2px",
                  }}
                  variant="contained"
                  onClick={() => handleSetBuyVal("100")}
                  color="warning"
                >
                  $ 100
                </Button>
                <Button
                  fullWidth={true}
                  style={{
                    borderRadius: "25px",
                    padding: "5px",
                    margin: "2px",
                  }}
                  variant="contained"
                  onClick={() => handleSetBuyVal("200")}
                  color="warning"
                >
                  $ 200
                </Button>
                <Button
                  fullWidth={true}
                  style={{
                    borderRadius: "25px",
                    padding: "5px",
                    margin: "2px",
                  }}
                  variant="contained"
                  onClick={() => handleSetBuyVal("500")}
                  color="warning"
                >
                  $ 500
                </Button>
              </Stack>
            </div>
            <Button
              fullWidth
              type="submit"
              style={{
                borderRadius: "25px",
                padding: "10px",
                margin: "2px",
              }}
              variant="contained"
              color="warning"
            >
              <ArrowForwardIcon /> Submit
            </Button>
          </Stack>
        </div>
      </form>
    </div>
  );
}
