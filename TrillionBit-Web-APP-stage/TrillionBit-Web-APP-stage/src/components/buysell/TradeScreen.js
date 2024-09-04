import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Grid from "@mui/system/Unstable_Grid";
import { IconButton, Typography } from "@mui/material";
import Buy from "./BuyCoins";
import Sell from "./SellCoins";
import Swap from "./SwapCoins";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";
import "./animations.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { ConnectKitButton } from "connectkit";


const qs = require("qs");

function TradeScreen() {


  const [tabKeyValue, setValue] = React.useState("3");
  const [showMenu, setShowMenu] = React.useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = React.useState(false);
  const [currenyObj, setCurrency] = React.useState(null);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabView = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onSetSelectedCurrency = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    console.log(selectedCurrency, "selectedCurrency");
  };

  const cardStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const typographyHeader = {
    fontSize: "4rem",
    fontWeight: 700,
    color: "#17294e",
  };

  const subTitle = {
    fontSize: "1.3rem",
    fontWeight: 400,
    color: "#17294e",
    opacity: 0.6,
  };

  return (
    <React.Fragment>
      <Helmet>
        <title class="next-head">Buy | Sell | swap | Trillionbit</title>
        <meta
          name="keywords"
          content="Bitcoin Exchange, Blockchain Crypto Exchange, Cryptocurrency Exchange, Bitcoin Trading, Ethereum, XRP, Ripple, Litecoin, Bitcoin Cash, BTC, LTC, ETH, XRP, BCH, BTC price, Wallet, LTC price, Trillionbit UAE, UAE, Dubai, India, Mumbai, Delhi, Dubai cryptocurrency exchange, Trillionbit, login"
        />
        <meta property="og:url" content="https://www.trillionbit.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Buy Sell Swap | Trillionbit" />
        <meta property="og:site_name" content="Trillionbit" />
        <meta
          property="og:image"
          content="https://trillionbit.com/static/media/logo.d54102a2.webp"
        />
        <meta property="twitter:title" content="Buy Sell Swap | Trillionbit" />
        <meta property="twitter:site" content="Trillionbit" />
        <meta
          property="twitter:image"
          content="https://trillionbit.com/static/media/logo.d54102a2.webp"
        />
        <meta
          property="twitter:image:src"
          content="https://trillionbit.com/static/media/logo.d54102a2.webp"
        />
      </Helmet>
      <div className={"overlay hide"}></div>
      <div className={"paddingTopbody2"}></div>

      <Box
        sx={{
          position: "absolute",
          top: 100,
          right: "3%",
        }}
      >
        <ConnectKitButton showBalance />
      </Box>

      <Grid container>
        <Grid
          item
          xs={12}
          md={7}
          style={{ order: isMobile || isTabView ? 2 : 1 }}
        >
          <div className="wrapTitle " style={cardStyle}>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="column"
              style={{ margin: "0% 10% 0 10%" }}
              spacing={2}
            >
              <Typography style={typographyHeader}>
                Simplify Your Crypto Experience..
              </Typography>
              <Typography style={subTitle}>
                Welcome to Bitex, where buying, selling, and swapping digital
                assets is just a click away.
              </Typography>
            </Stack>
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          md={5}
          style={{
            order: isMobile || isTabView ? 1 : 2,
            backgroundColor: "black",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              " radial-gradient(circle, #1c1c1c 1.5px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "10px",
              width: "100%",
              margin: "0 7% 0 7%",
              minHeight: "75vh",
              maxHeight: "75vh",
            }}
          >
            <TabContext value={tabKeyValue}>
              <Box
                display="flex"
                style={{ margin: "4% 2% 0 2%" }}
                justifyContent="space-between"
              >
                <Box>
                  <TabList
                    onChange={handleChange}
                    sx={{ indicator: { backgroundColor: "white" } }}
                  >
                    <Tab
                      label="Buy"
                      value="1"
                      style={{
                        color: "white",
                        fontWeight: 800,
                      }}
                    />
                    <Tab
                      label="Sell"
                      value="2"
                      style={{
                        color: "white",
                        fontWeight: 800,
                      }}
                    />
                    <Tab
                      label="Swap"
                      value="3"
                      style={{
                        color: "white",
                        fontWeight: 800,
                      }}
                    />
                  </TabList>
                </Box>

                <IconButton>
                  <MenuIcon
                    onClick={() => setShowMenu(true)}
                    style={{
                      marginTop: "10px",
                      color: "white",
                    }}
                  />
                </IconButton>
              </Box>

              <div
                style={{
                  borderBottom: "1px solid #2c2c2e",
                  margin: "0 2% 0 2%",
                }}
              />

              <TabPanel value="1">
                <Buy />
              </TabPanel>
              <TabPanel value="2">
                <Sell />
              </TabPanel>
              <TabPanel value="3">
                <Swap openCurrencyComponent={() => setShowCurrencyMenu(true)} />
              </TabPanel>
            </TabContext>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

TradeScreen.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
  errors: state.errors,
});

export default connect(mapStateToProps, {})(TradeScreen);
