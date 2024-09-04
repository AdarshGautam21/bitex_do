import "./styles.css"; // We'll add styles here
import { Box, Card, CardContent, Stack } from "@mui/material";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Paper from "@mui/material/Paper";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import { useState } from "react";

const useStyles = makeStyles({
  listItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    margin: "8px 0",
    padding: "10px",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  input: {
    fontSize: "96px", // Adjust font size
    fontFamily: "Arial, sans-serif", // Specify font family
    fontWeight: "700", // Specify font weight
    color: "red", // Specify font color
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

const CurrencyPickerDialog = ({ isOpen, onClose, onCurrencySelected }) => {
  const classes = useStyles();

  const [data, setData] = useState(ETH_TOKENS);

  const handleChangeSearchCoins = (event) => {
    const term = event.target.value.toLowerCase();
    const filtered = data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );
  };

  return (
    <Card className={`bottom-sheet ${isOpen ? "open" : ""}`}>
      <div onClick={onClose}></div>
      <Stack flex={1} padding={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <TabList aria-label="lab API tabs example">
              <Tab
                label="Select Currency"
                value="1"
                style={{
                  color: "black",
                }}
              />
            </TabList>
          </Box>
          <Box>
            <CloseTwoToneIcon
              style={{
                marginTop: "10px",
              }}
              onClick={onClose}
            />
          </Box>
        </Box>

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
            placeholder="Search Coin "
            onChange={handleChangeSearchCoins}
            InputProps={{
              className: classes.input,
            }}
            sx={{
              width: "100%",
            }}
          />
        </Paper>
        <Box
          sx={{
            maxWidth: "100%",
          }}
        ></Box>
        <Grid item xs={12} md={6}>
          <List dense={false}>
            {data &&
              data.map((option, index) => (
                <ListItem
                  onClick={() => onCurrencySelected(option)}
                  className={classes.listItem}
                >
                  <ListItemIcon>
                    <Avatar
                      alt="User Name"
                      src={option.logoURI}
                      sx={{ width: 40, height: 40 }} // Customize size
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={option?.name}
                    secondary={option?.symbol}
                  />
                </ListItem>
              ))}
          </List>
        </Grid>
        <Box></Box>
      </Stack>
    </Card>
  );
};

export default CurrencyPickerDialog;
