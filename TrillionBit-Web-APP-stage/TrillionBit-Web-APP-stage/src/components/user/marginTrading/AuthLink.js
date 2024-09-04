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


const AuthLink = ({ pathname, classes, avatar, apiUrl, auth, anchorEl,  handleMainMenuClick, handleClose, onLogoutClick, openTranserDialog, openBorrowDialog }) => (
    <List component="nav" aria-label="main mailbox folders">
        <ListItem className={"listItem" + ((pathname === '/dashboard') ? ' active' : '')}>
            <Link to="/dashboard">
                Dashboard
            </Link>
        </ListItem>

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
        {/* <ListItem className={"listItem" + ((pathname === '//trading') ? ' active' : '')}>
            {
                auth.user.marginTrading ? (
                    <Link to="/trading"> Exchange Trading </Link>
                ) : undefined
            }
        </ListItem> */}

        <ListItem className={"listItem" + ((pathname === '//margin-trading') ? ' active' : '')}>
            <Link
                to="#"
                aria-controls="customized-menu3"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={openTranserDialog}
            >
                <Typography variant="body2" className="">
                    Transfer
                </Typography>
            </Link>
        </ListItem>

        <ListItem className={"listItem" + ((pathname === '//margin-trading') ? ' active' : '')}>
           <Link
                to="#"
                aria-controls="customized-menu3"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={openBorrowDialog}
            >
                <Typography variant="body2" className="">
                    Borrow
                </Typography>                        
            </Link>
        </ListItem>


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
                    onClose={handleClose}
                >
                    <MenuItem onClick={onLogoutClick}> Log out </MenuItem>
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