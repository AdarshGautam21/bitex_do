import React, { useEffect } from "react";
import { Box, Card, CardContent } from "@mui/material";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Paper from "@mui/material/Paper";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import cryptoData from "./CryptoData.json";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";

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

export default function SelectCurrency({
  onCloseButtonClick,
  onSelectCurrency,
}) {
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

  const [data, setData] = React.useState(ETH_TOKENS);
  const [loading, setLoading] = React.useState(true);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (optionSelected) => {
    onSelectCurrency(optionSelected);
    onCloseButtonClick();
  };

  const handleCloseMenu = () => {
    onCloseButtonClick();
  };

  // useEffect(() => {
  //   setData(cryptoData);
  //   setFilteredData(cryptoData);
  // }, []);

  const handleChangeSearchCoins = (event) => {
    const term = event.target.value.toLowerCase();
    const filtered = data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );

    setFilteredData(filtered);
  };

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://tokens.coingecko.com/uniswap/all.json"
  //       );
  //       if (!response) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const jsonData = await response.json();
  //       // setData(jsonData.tokens);
  //       setData(cryptoData)
  //     } catch (error) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const classes = useStyles();
  return (
    <>
      <Card
        style={{
          backgroundColor: "white",
          color: "black",
          height: "500px",
        }}
      >
        <CardContent className="walletGrid">
          <>
            <TabContext value={"1"}>
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
                    onClick={handleCloseMenu}
                  />
                </Box>
              </Box>
              <TabPanel value="1">
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
                          onClick={() => handleChange(option)}
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
              </TabPanel>
            </TabContext>
          </>
        </CardContent>
      </Card>
    </>
  );
}
