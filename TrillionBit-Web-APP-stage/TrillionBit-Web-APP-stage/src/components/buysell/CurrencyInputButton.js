import { Button, Divider, FormControl, Paper, TextField } from "@mui/material";
import React from "react";

function CurrencyInputButton({
  name,
  currency,
  value,
  onChangeValue,
  onPickCurrency,
}) {
  return (
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
          type="number"
          value={value}
          onChange={onChangeValue}
          name={name}
          //   error={!!errors.amountValue}
          //   helperText={errors.amountValue}
          inputProps={{
            sx: {
              color: "1c1c1c",
              fontWeight: "700",
              fontSize: "1.2rem",
            },
          }}
          sx={{
            width: "100%",
          }}
        />
        <Divider sx={{ height: 35, m: 0.5 }} orientation="vertical" />
        <Button
          border={0}
          onClick={onPickCurrency}
          variant="contained"
          startIcon={
            <img
              alt={currency.name}
              style={{ width: "18px", height: "18px" }}
              src={currency.logoURI}
            />
          }
          style={{
            padding: "2px",
            margin: "5px",
            color: "white",
            borderRadius: "20px",
          }}
        >
          {currency.symbol}
        </Button>
      </Paper>
    </FormControl>
  );
}

export default CurrencyInputButton;
