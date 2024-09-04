import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    List,
    ListItem,
    Typography,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';

import {
    ExpandMore
} from '@mui/icons-material';


const AuthLink = ({ pathname, classes, avatar, apiUrl, auth, anchoragentEl, anchorEl, makeAnchoragentElNull, handleMainMenuClick, handleClose, keyPressEvent, onLogoutClick }) => (
    <List component="nav" aria-label="main mailbox folders">
    <ListItem className={"listItem" + ((pathname === '/dashboard') ? ' active' : '')}>
        <Link to="/dashboard">
            Dashboard
        </Link>
    </ListItem>

    {/* <ListItem className={"listItem" + ((pathname === '/future-trading') ? ' active' : '')}>
        <Link to="/future-trading">
            Future
        </Link>
    </ListItem> */}

    <ListItem className={"listItem" + ((pathname === '/user-wallet') ? ' active' : '')}>
        <Link to="/user-wallet">
            Wallet
        </Link>
    </ListItem>

    <ListItem className={"listItem" + ((pathname === '//user-profile') ? ' active' : '')}>
        <Link to="/user-profile">
            Settings
        </Link>
    </ListItem>

    {/* <ListItem className={"listItem" + ((pathname === '//margin-trading') ? ' active' : '')}>
    {
        auth.user.marginTrading ? (
            <Link to="/margin-trading"> Margin Trading </Link>
        ) : undefined
    }
    </ListItem> */}

        {auth.user.agent ? (
            <ListItem className={"listItem agent" + ((pathname === '//user-profile') ? ' active' : '')}>
            <Link
                aria-controls="customized-menu3"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                to="#"
                onClick={(e) => handleMainMenuClick(e, 'agent')}
            >
                {/* <Avatar alt="Remy Sharp" src={require("../assets/img/1.jpg")} className={classes.avatar} /> */}
                <Typography variant="h6" className="">
                    Agent                    
                <ExpandMore className="trt" />
                </Typography>                        
            </Link>
       
        {auth.user.agent ? (
            <Menu
                elevation={0} 
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                id="customized-menu3"
                className="agentBtn"
                anchorEl={anchoragentEl}
                keepMounted
                open={Boolean(anchoragentEl)}
                onClose={handleClose.bind(this)}
            >
                <MenuItem onClick={(event) => {keyPressEvent('b', event);  makeAnchoragentElNull()}}> Buy Order </MenuItem>
                <MenuItem onClick={(event) => {keyPressEvent('s', event);  makeAnchoragentElNull()}}> Sell Order </MenuItem>
                <MenuItem onClick={(event) => {keyPressEvent('a', event);  makeAnchoragentElNull()}}> All Orders </MenuItem>
                <MenuItem onClick={(event) => {keyPressEvent('o', event);  makeAnchoragentElNull()}}> Open Orders </MenuItem>
            </Menu>
        ) : undefined}
        </ListItem>
    ) : undefined}

    <ListItem className={"listItem avatar" + ((pathname === '//user-profile') ? ' active' : '')}>
    {(auth.isAuthenticated) ?
        <>
            <Link
                to={'#'}
                aria-controls="customized-menu2"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={(e) => handleMainMenuClick(e, 'profile')}
            >
                <Avatar alt="Remy Sharp" src={`${apiUrl}/api/guest/get_image/${avatar}`} className={classes.avatar} />
                <ExpandMore className="trt" />
            </Link>
            <Menu
                elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                id="customized-menu2"
                className="logoutBtn tradeBTN"
                anchorEl={anchorEl}
                keepMounted
                open={(Boolean(anchorEl)) ? Boolean(anchorEl) : false}
                onClose={handleClose.bind(this)}
            >
                <MenuItem onClick={onLogoutClick.bind(this)}> Log out </MenuItem>
            </Menu>
        </> :
        ""
    }
    </ListItem>
</List>
);

AuthLink.propTypes = {
  pathname: PropTypes.string,
};

export default AuthLink;