/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

const useStyles = makeStyles({
  input: {
    fontSize: "96px", // Adjust font size
    fontFamily: "Arial, sans-serif", // Specify font family
    fontWeight: "700", // Specify font weight
    color: "red", // Specify font color
  },
});

export default function Buy(props) {
  const classes = useStyles();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [currency, setCurrency] = React.useState();
  const [fiatCurency, setFiatCurrency] = React.useState("");

  const [formData, setFormData] = React.useState({
    amountValue: "",
    coinValue: "",
    fiatCurrency: "",
  });
  const [errors, setErrors] = React.useState({});
  const [errorValues, setValueErrors] = React.useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://trillionbit-api-production.up.railway.app/api/guest/get_active_markets"
        ); // Replace with your API endpoint
        if (!response) {
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
  }, []);

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
      // setFiatCurrency(param);

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
    <>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
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
                  InputProps={{
                    className: classes.input,
                  }}
                  helperText={errors.amountValue}
                  sx={{
                    width: "100%",
                  }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Select
                  value={currency}
                  onChange={(e) => {
                    handleChange(e);
                  }}
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
                  sx={{
                    width: "100%",
                  }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Select
                  labelId="select-currency-label"
                  id="select-currency"
                  // value={currency}
                  // onChange={handleChange}
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
                </Button>{" "}
                <Button
                  fullWidth={true}
                  style={{
                    borderRadius: "25px",
                    padding: "5px",
                    margin: "2px",
                  }}
                  variant="contained"
                  onClick={() => handleSetBuyVal("300")}
                  color="warning"
                >
                  $ 300
                </Button>
                <Button
                  fullWidth={true}
                  style={{
                    borderRadius: "25px",
                    padding: "5px",
                    margin: "2px",
                  }}
                  variant="contained"
                  onClick={() => handleSetBuyVal("400")}
                  color="warning"
                >
                  $ 400
                </Button>
              </Stack>
            </div>
            <div>
              <Button
                type="submit"
                fullWidth={true}
                style={{
                  padding: "10px",
                  borderRadius: "25px",
                  marginTop: "20px",
                }}
                variant="contained"
                color="primary"
                // disabled={true}
                // endIcon={<ArrowForwardIcon />}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyItems: "right",
                  }}
                >
                  <div>Buy</div>
                  <div>
                    <ArrowForwardIcon />
                  </div>
                </div>
              </Button>
            </div>
          </Stack>
        </div>
      </form>
    </>
  );
}
