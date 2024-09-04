import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { logOut } from "../../actions/authActions";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import isEmpty from "../../validation/isEmpty";
import apiUrl from "../config";
import {
  Box,
  // Avatar,
  List,
  ListItem,
  Button,
  Typography,
  MenuItem,
  Menu,
} from "@mui/material";
import Avatar from "react-avatar";

import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import colorLogo from "../../assets/img/logo.webp";
import whiteLogo from "../../assets/img/white-logo.webp";

import { toggleExpandNav, getMyLocation } from "../../actions/authActions";

const tabGuestLinks = [
  "/",
  "/register",
  "/register/*",
  "/login",
  "/email-verification",
  "/forgot-password",
  "/reset-password/*",
  "/fees",
  "/referral-info",
  "/terms-of-service",
  "/trust-and-security",
  "/about",
  "/client_activation/*",
  "/margintrading",
  "/futuretrading",
  "/exchange",
  "/wallet",
  "/developer",
  "/press",
  "/lending",
  "/btxCoin",
  "/donate",
  "/buy-sell-swap"
];

const tabAuthLinks = [
  "/",
  "/dashboard",
  "/user-wallet",
  "/orders",
  "/user-profile",
  "/user-profile/basic_info",
  "/transactions",
  "/referral",
  "/fees",
  "/agent-portal",
  "/press",
  "/lending",
  "/btxCoin",
  "/donate",
];

const lightHeaderBar = [
  "/",
  "/fees",
  "/referral-info",
  "/terms-of-service",
  "/trust-and-security",
  "/about",
  "/margintrading",
  "/futuretrading",
  "/exchange",
  "/wallet",
  "/developer",
  "/press",
  "/lending",
  "/btxCoin",
  "/donate",
  "/buy-sell-swap"
];

const tabExpandNav = [
  "/",
  "/fees",
  "/referral-info",
  "/terms-of-service",
  "/trust-and-security",
  "/about",
  "/margintrading",
  "/futuretrading",
  "/exchange",
  "/wallet",
  "/developer",
  "/press",
  "/lending",
  "/btxCoin",
  "/donate",
  "/buy-sell-swap"
];

const hideLogout = [
  "/dashboard",
  "/user-wallet",
  "/orders",
  "/user-profile",
  "/user-profile/basic_info",
  "/transactions",
  "/agent-portal",
];

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.divElement = React.createRef();
  }

  state = {
    anchorEl: null,
    anchorElProfile: false,
  };

  componentDidMount = async () => {
    //
  };

  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChange = (event, value) => {
    this.props.history.push(value);
  };

  handleClose = () => {
    this.setState({
      anchorTrade: null,
      anchorProducts: null,
      anchorcompany: null,
      anchorsupport: null,
      tradeExpand: false,
      productExpand: false,
      companyExpand: false,
      supportExpand: false,
      anchorElProfile: false,
    });
    this.props.toggleExpandNav(false);
  };

  handleMainMenuToggle = (event, value) => {
    if (value === "trade") {
      console.log(value, "value")
      this.setState({
        anchorTrade: event.currentTarget,
        anchorcompany: null,
        anchorsupport: null,
        tradeExpand: !this.state.tradeExpand,
        productExpand: false,
        companyExpand: false,
        supportExpand: false,
      });
    }

    if (value === "products") {
      this.setState({
        anchorProducts: event.currentTarget,
        anchorcompany: null,
        anchorsupport: null,
        productExpand: !this.state.productExpand,
        companyExpand: false,
        supportExpand: false,
      });
    }

    if (value === "company") {
      this.setState({
        anchorProducts: null,
        anchorcompany: event.currentTarget,
        anchorsupport: null,
        companyExpand: !this.state.companyExpand,
        productExpand: false,
        supportExpand: false,
      });
    }

    if (value === "support") {
      this.setState({
        anchorProducts: null,
        anchorcompany: null,
        anchorsupport: event.currentTarget,
        supportExpand: !this.state.supportExpand,
        productExpand: false,
        companyExpand: false,
      });
    }

    this.props.toggleExpandNav(false);
  };

  handleMainMenuClick = (event, value) => {
    if (value === "trade") {
      this.setState({
        anchorTrade: event.currentTarget,
        anchorcompany: null,
        anchorsupport: null,
        tradeExpand: !this.state.tradeExpand,
        productExpand: false,
        companyExpand: false,
        supportExpand: false,
      });
    }
    if (value === "products") {
      this.setState({
        anchorProducts: event.currentTarget,
        anchorcompany: null,
        anchorsupport: null,
        tradeExpand: false,
        productExpand: true,
        companyExpand: false,
        supportExpand: false,
      });
    }

    if (value === "company") {
      this.setState({
        anchorProducts: null,
        anchorcompany: event.currentTarget,
        anchorsupport: null,
        companyExpand: true,
        tradeExpand: false,
        productExpand: false,
        supportExpand: false,
      });
    }

    if (value === "support") {
      this.setState({
        anchorProducts: null,
        anchorcompany: null,
        anchorsupport: event.currentTarget,
        supportExpand: true,
        tradeExpand: false,
        productExpand: false,
        companyExpand: false,
      });
    }

    if (value === "profile") {
      this.setState({ anchorElProfile: event.currentTarget });
    }

    this.props.toggleExpandNav(true);
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.setState({
      anchorEl: null,
      anchorCurrencyEl: null,
      anchorElProfile: null,
    });
    const ele = document.getElementsByClassName("overlay");
    ele[0].className = "overlay hide";
    this.props.logOut();
  };

  render() {
    const { classes, auth, user } = this.props;
    const { anchorEl } = this.state;
    const { pathname } = this.props.location;
    let pathName = pathname;
    const { isAuthenticated } = this.props.auth;
    const authLinks = (
      <List
        component="nav"
        className="mainNavBar"
        aria-label="main mailbox folders"
      >
        <ListItem
          className={"listItem" + (pathname === "/dashboard" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/dashboard">Dashboard</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname === "/user-wallet" ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/user-wallet">Wallet</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname.includes("/trading") ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/trading">Exchange</Link>
        </ListItem>

        {/* <ListItem className={"listItem" + ((pathname.includes('/future-trading')) ? ' active' : '')} onClick={this.handleMenuClose}>
                          <Link to="/future-trading">
                            Future
                          </Link>
                        </ListItem> */}

        <ListItem
          className={
            "listItem" + (pathname === "/transactions" ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/transactions">Transactions</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname === "/user-profile" ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/user-profile">Settings</Link>
        </ListItem>

        {!hideLogout.includes(pathName) ? (
          <ListItem className={"listItem"}>
            <div className="userbox">
              <Button
                aria-controls="customized-menu2"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={(e) => this.handleMainMenuClick(e, "profile")}
              >
                {!isEmpty(auth.currentLoginUser?.avatar) ? (
                  <Avatar
                    round={true}
                    size="30"
                    src=""
                    // src={`${apiUrl}/api/guest/get_image/${auth.currentLoginUser?.avatar}`}
                    className={classes?.avatar}
                  />
                ) : (
                  <Avatar
                    round={true}
                    size="30"
                    src=""
                    // src={`${apiUrl}/api/guest/get_image/user_logo.png`}
                    className={classes?.avatar}
                  />
                )}
                <ExpandMore className="trt" />
              </Button>
              <Menu
                elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                id="customized-menu2"
                className="logoutBtn"
                anchorEl={this.state.anchorElProfile}
                keepMounted
                open={Boolean(this.state.anchorElProfile)}
                onClose={this.handleClose.bind(this)}
              >
                <MenuItem onClick={this.onLogoutClick.bind(this)}>
                  {" "}
                  Log out{" "}
                </MenuItem>
              </Menu>
            </div>
          </ListItem>
        ) : null}

        {user ? (
          user.agent || user.subAgent ? (
            <ListItem
              className={
                "listItem" + (pathname === "/agent-portal" ? " active" : "")
              }
              onClick={this.handleMenuClose}
            >
              <Link to="/agent-portal">Agent</Link>
            </ListItem>
          ) : undefined
        ) : undefined}
      </List>
    );

    const authMobileLinks = (
      <div>
        {tabExpandNav.includes(pathName) ? (
          <List>
            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "trade")}
                onClick={(e) => this.handleMainMenuToggle(e, "trade")}
              >
                <ListItemText primary="Trade" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.tradeExpand}
              >
                <List component="div" disablePadding className="subMenu">
                  <ListItem>
                    <Link to="/exchange" className="">
                      Spot
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/margintrading" className="">
                      Margin
                    </Link>
                  </ListItem>

                  <ListItem>
                    <Link to="/futuretrading" className="">
                      Futures
                    </Link>
                  </ListItem>

                  <ListItem>
                    <Link to="/lending" className="">
                      Lend
                    </Link>
                  </ListItem>
                </List>
              </Collapse>
            </div>
            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "products")}
                onClick={(e) => this.handleMainMenuToggle(e, "products")}
              >
                <ListItemText primary="Products" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.productExpand}
              >
                <List
                  component="div"
                  disablePadding
                  className="subMenu"
                  onMouseLeave={() => this.handleClose()}
                >
                  {/* <ListItem>
										<Link to="/btxCoin" className="">
											BTX Coin
										</Link>
									</ListItem> */}
                  <ListItem>
                    <Link to="/exchange" className="">
                      Exchange
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/wallet" className="">
                      Web Wallet
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/developer" className="">
                      Developer
                    </Link>
                  </ListItem>
                  <ListItem>
                    <a href="https://academy.bitex.com/" className="">
                      Academy
                    </a>
                  </ListItem>
                </List>
              </Collapse>
            </div>
            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "company")}
                onClick={(e) => this.handleMainMenuToggle(e, "company")}
              >
                <ListItemText primary="Company" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.companyExpand}
              >
                <List
                  component="div"
                  disablePadding
                  className="subMenu"
                  onMouseLeave={() => this.handleClose()}
                >
                  <ListItem>
                    <Link to="/about" className="">
                      About Us
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/fees" className="">
                      Fee Schedule
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/referral-info" className="">
                      Referral
                    </Link>
                  </ListItem>
                  {/* <ListItem>
										<a
											href="https://careers.bitex.com"
											className=""
										>
											Careers
										</a>
									</ListItem> */}
                  <ListItem>
                    <Link to="/trust-and-security" className="">
                      Trust & Security
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/terms-of-service" className="">
                      Terms of Service
                    </Link>
                  </ListItem>
                </List>
              </Collapse>
            </div>

            <div
              className="inlineList"
              onMouseEnter={(e) => this.handleMainMenuClick(e, "support")}
              onClick={(e) => this.handleMainMenuToggle(e, "support")}
            >
              <ListItem button>
                <ListItemText primary="Support" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.supportExpand}
              >
                <List
                  component="div"
                  disablePadding
                  className="subMenu"
                  onMouseLeave={() => this.handleClose()}
                >
                  <ListItem>
                    <a href="#" className="">
                      Customer Support
                    </a>
                  </ListItem>
                  <ListItem>
                    <a href="#" className="">
                      FAQs
                    </a>
                  </ListItem>
                  <ListItem>
                    <a href="#" className="">
                      Submit a request
                    </a>
                  </ListItem>
                  {/* <ListItem>
										<a
											href="https://bitexuae.statuspage.io"
											className=""
										>
											Status
										</a>
									</ListItem> */}

                  {/* <ListItem>
										<Link to="/press" className="">
											Press
										</Link>
									</ListItem> */}
                </List>
              </Collapse>
            </div>
          </List>
        ) : undefined}
        <ListItem
          className={"listItem" + (pathname === "/dashboard" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/dashboard">Dashboard</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname === "/user-wallet" ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/user-wallet">Wallet</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname.includes("/trading") ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/trading">Exchange</Link>
        </ListItem>

        {/* <ListItem className={"listItem" + ((pathname.includes('/future-trading')) ? ' active' : '')} onClick={this.handleMenuClose}>
          <Link to="/future-trading">
            Future
          </Link>
        </ListItem> */}

        <ListItem
          className={
            "listItem" + (pathname === "/transactions" ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/transactions">Transactions</Link>
        </ListItem>

        <ListItem
          className={
            "listItem" + (pathname === "/user-profile" ? " active" : "")
          }
          onClick={this.handleMenuClose}
        >
          <Link to="/user-profile">Settings</Link>
        </ListItem>

        <ListItem
          className={"listItem" + (pathname === "/login" ? " active" : "")}
          onClick={this.onLogoutClick.bind(this)}
        >
          <Link to="/login">Log out</Link>
        </ListItem>

        {user ? (
          user.agent || user.subAgent ? (
            <ListItem
              className={
                "listItem" + (pathname === "/agent-portal" ? " active" : "")
              }
              onClick={this.handleMenuClose}
            >
              <Link to="/agent-portal">Agent</Link>
            </ListItem>
          ) : undefined
        ) : undefined}
      </div>
    );

    const guestLinks = (
      <List
        component="nav"
        className="mainNavBar"
        aria-label="main mailbox folders"
      >
        <ListItem
          className={"listItem" + (pathname === "/trading" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/trading">Exchange</Link>
        </ListItem>
        {/* 
						<ListItem className={"listItem" + ((pathname === '/trading') ? ' active' : '')} onClick={this.handleMenuClose}>
                          <Link to="/future-trading">
                            Future
                          </Link>
                        </ListItem> */}

        <ListItem
          className={"listItem" + (pathname === "/register" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/register">Signup</Link>
        </ListItem>

        <ListItem
          className={"listItem btn" + (pathname === "/login" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/login">Login</Link>
        </ListItem>
      </List>
    );

    const guestMobileLinks = (
      <div>
        {tabExpandNav.includes(pathName) ? (
          <List>
            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "trade")}
                onClick={(e) => this.handleMainMenuToggle(e, "trade")}
              >
                <ListItemText primary="Trade" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.tradeExpand}
              >
                <List component="div" disablePadding className="subMenu">
                  <ListItem>
                    <Link to="/exchange" className="">
                      Spot
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/margintrading" className="">
                      Margin
                    </Link>
                  </ListItem>

                  <ListItem>
                    <Link to="/futuretrading" className="">
                      Futures
                    </Link>
                  </ListItem>

                  <ListItem>
                    <Link to="/lending" className="">
                      Lend
                    </Link>
                  </ListItem>
                </List>
              </Collapse>
            </div>
            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "products")}
                onClick={(e) => this.handleMainMenuToggle(e, "products")}
              >
                <ListItemText primary="Products" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.productExpand}
              >
                <List component="div" disablePadding className="subMenu">
                  {/* <ListItem>
										<Link to="/btxCoin" className="">
											BTX Coin
										</Link>
									</ListItem> */}
                  <ListItem>
                    <Link to="/exchange" className="">
                      Exchange
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/wallet" className="">
                      Web Wallet
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/developer" className="">
                      Developer
                    </Link>
                  </ListItem>
                  <ListItem>
                    <a href="https://academy.bitex.com/" className="">
                      Academy
                    </a>
                  </ListItem>
                </List>
              </Collapse>
            </div>
            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "company")}
                onClick={(e) => this.handleMainMenuToggle(e, "company")}
              >
                <ListItemText primary="Company" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.companyExpand}
              >
                <List component="div" disablePadding className="subMenu">
                  <ListItem>
                    <Link to="/about" className="">
                      About Us
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/fees" className="">
                      Fee Schedule
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/referral-info" className="">
                      Referral
                    </Link>
                  </ListItem>
                  <ListItem>
                    <a href="https://careers.bitex.com" className="">
                      Careers
                    </a>
                  </ListItem>
                  <ListItem>
                    <Link to="/trust-and-security" className="">
                      Trust & Security
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/terms-of-service" className="">
                      Terms of Service
                    </Link>
                  </ListItem>
                </List>
              </Collapse>
            </div>

            <div className="inlineList">
              <ListItem
                button
                onMouseEnter={(e) => this.handleMainMenuClick(e, "support")}
                onClick={(e) => this.handleMainMenuClick(e, "support")}
              >
                <ListItemText primary="Support" />
                {this.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                timeout="auto"
                unmountOnExit
                in={this.state.supportExpand}
              >
                <List component="div" disablePadding className="subMenu">
                  <ListItem>
                    <a href="https://support.bitex.com" className="">
                      Customer Support
                    </a>
                  </ListItem>
                  <ListItem>
                    <a
                      href="https://support.bitex.com/support/solutions/folders/48000245620"
                      className=""
                    >
                      FAQs
                    </a>
                  </ListItem>
                  <ListItem>
                    <a
                      href="https://support.bitex.com/support/tickets/new"
                      className=""
                    >
                      Submit a request
                    </a>
                  </ListItem>
                  <ListItem>
                    <a href="https://bitexuae.statuspage.io" className="">
                      Status
                    </a>
                  </ListItem>
                  <ListItem>
                    <Link
                      to="/press"
                      className={
                        "listItem" + (pathname === "/press" ? " active" : "")
                      }
                      onClick={this.handleMenuClose}
                    >
                      Press
                    </Link>
                  </ListItem>
                </List>
              </Collapse>
            </div>
          </List>
        ) : undefined}

        <MenuItem
          className={"listItem" + (pathname === "/trading" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/trading">Exchange</Link>
        </MenuItem>
        {/* 
		<MenuItem className={"listItem" + ((pathname === '/future-trading') ? ' active' : '')} onClick={this.handleMenuClose}>
          <Link to="/future-trading">
            Future
          </Link>
        </MenuItem> */}

        <MenuItem
          className={"listItem" + (pathname === "/dashboard" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/register">Signup</Link>
        </MenuItem>
        <MenuItem
          className={"listItem" + (pathname === "/login" ? " active" : "")}
          onClick={this.handleMenuClose}
        >
          <Link to="/login">Login</Link>
        </MenuItem>
      </div>
    );

    let tabLinks = <Box></Box>;
    let mobileTabLinks = <Box></Box>;

    if (tabGuestLinks.includes(pathName) || tabAuthLinks.includes(pathName)) {
      tabLinks = isAuthenticated ? authLinks : guestLinks;
      mobileTabLinks = isAuthenticated ? authMobileLinks : guestMobileLinks;
    }

    let navBar = <Box></Box>;

    let toolbarColor = "lighttoolbar";
    let mainLogo = colorLogo;

    if (lightHeaderBar.includes(pathName)) {
      toolbarColor = "homeLighttoolbar";
      mainLogo = whiteLogo;
    }

    if (tabGuestLinks.includes(pathName) || tabAuthLinks.includes(pathName)) {
      navBar = (
        <Toolbar
          className={toolbarColor}
          onMouseLeave={() => this.handleClose()}
        >
          <div
            ref={(ele) => (this.divElement = ele)}
            className="leftNavigation"
          >
            <Link className="logoBox" to="/">
              <img src={mainLogo} alt="Bitex" />
            </Link>

            {tabExpandNav.includes(pathName) ? (
              <List
                component="nav"
                className="mainNavBar leftNev"
                aria-label="main mailbox folders"
              >
                <div className="inlineList">
                  <ListItem
                    button
                    onMouseEnter={(e) => this.handleMainMenuClick(e, "trade")}
                    onClick={(e) => this.handleMainMenuToggle(e, "trade")}
                  >
                    <ListItemText primary="Trade" />
                    {this.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    timeout="auto"
                    unmountOnExit
                    in={this.state.tradeExpand}
                  >
                    <List component="div" disablePadding className="subMenu">
                      <ListItem>
                        <Link to="/buy-sell-swap" className="">
                          Buy Sell Swap
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/exchange" className="">
                          Spot
                        </Link>
                      </ListItem>
                      {/* <ListItem>
											<Link to="/margintrading" className="">
												Margin
											</Link>
										</ListItem>
										<ListItem>
											<Link to="/futuretrading" className="">
												Futures
											</Link>
										</ListItem> */}
                      {/* 
                      <ListItem>
                        <Link to="/lending" className="">
                          Lend
                        </Link>
                      </ListItem> */}
                    </List>
                  </Collapse>
                </div>

                <div className="inlineList">
                  <ListItem
                    button
                    onMouseEnter={(e) =>
                      this.handleMainMenuClick(e, "products")
                    }
                    onClick={(e) => this.handleMainMenuToggle(e, "products")}
                  >
                    <ListItemText primary="Products" />
                    {this.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    timeout="auto"
                    unmountOnExit
                    in={this.state.productExpand}
                  >
                    <List component="div" disablePadding className="subMenu">
                      {/* <ListItem>
												<Link
													to="/btxCoin"
													className=""
												>
													BTX Coin
												</Link>
											</ListItem> */}
                      <ListItem>
                        <Link to="/exchange" className="">
                          Exchange
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/wallet" className="">
                          Web Wallet
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/developer" className="">
                          Developer
                        </Link>
                      </ListItem>

                      {/* <ListItem>
                        <a href="https://academy.bitex.com/" className="">
                          Academy
                        </a>
                      </ListItem> */}
                    </List>
                  </Collapse>
                </div>
                <div className="inlineList">
                  <ListItem
                    button
                    onMouseEnter={(e) => this.handleMainMenuClick(e, "company")}
                    onClick={(e) => this.handleMainMenuToggle(e, "company")}
                  >
                    <ListItemText primary="Company" />
                    {this.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    timeout="auto"
                    unmountOnExit
                    in={this.state.companyExpand}
                  >
                    <List component="div" disablePadding className="subMenu">
                      <ListItem>
                        <Link to="/about" className="">
                          About Us
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/fees" className="">
                          Fee Schedule
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/referral-info" className="">
                          Referral
                        </Link>
                      </ListItem>
                      <ListItem>
                        <a href="https://careers.bitex.com" className="">
                          Careers
                        </a>
                      </ListItem>
                      <ListItem>
                        <Link to="/trust-and-security" className="">
                          Trust & Security
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to="/terms-of-service" className="">
                          Terms of Service
                        </Link>
                      </ListItem>
                    </List>
                  </Collapse>
                </div>

                <div className="inlineList">
                  <ListItem
                    button
                    onMouseEnter={(e) => this.handleMainMenuClick(e, "support")}
                    onClick={(e) => this.handleMainMenuToggle(e, "support")}
                  >
                    <ListItemText primary="Support" />
                    {this.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    timeout="auto"
                    unmountOnExit
                    in={this.state.supportExpand}
                  >
                    <List component="div" disablePadding className="subMenu">
                      <ListItem>
                        <a href="https://support.bitex.com" className="">
                          Customer Support
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          href="https://support.bitex.com/support/solutions/folders/48000245620"
                          className=""
                        >
                          FAQs
                        </a>
                      </ListItem>
                      <ListItem>
                        <a
                          href="https://support.bitex.com/support/tickets/new"
                          className=""
                        >
                          Submit a request
                        </a>
                      </ListItem>
                      <ListItem>
                        <a href="https://bitexuae.statuspage.io" className="">
                          Status
                        </a>
                      </ListItem>

                      <ListItem>
                        <Link to="/press" className="">
                          Press
                        </Link>
                      </ListItem>
                    </List>
                  </Collapse>
                </div>
              </List>
            ) : undefined}
          </div>

          <div className="rightNavigation">
            {tabLinks}

            <div className="mobileMenu">
              <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                color="primary"
              >
                <Typography
                  variant="body1"
                  className=""
                  onClick={this.handleMenuOpen}
                >
                  <MenuIcon className="trt" />
                </Typography>
              </Button>
              <Menu
                elevation={0}
                id="mobile-menu"
                getContentAnchorEl={null}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={this.handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Typography
                  variant="body1"
                  className=""
                  onClick={this.handleMenuClose}
                >
                  <CloseIcon className="trt" />
                </Typography>
                {mobileTabLinks}
              </Menu>
            </div>
          </div>
        </Toolbar>
      );
    }

    return navBar;
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  toggleExpandNav: PropTypes.func.isRequired,
  getMyLocation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
});

const routerNavBar = withRouter((props) => <Navbar {...props} />);

export default connect(mapStateToProps, {
  toggleExpandNav,
  getMyLocation,
  logOut,
})(routerNavBar);
