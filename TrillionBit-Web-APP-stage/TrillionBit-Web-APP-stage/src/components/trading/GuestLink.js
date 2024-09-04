import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
	List,
	ListItem,
} from '@mui/material';


const GuestLink = ({ pathname }) => (
	<List component="nav" aria-label="main mailbox folders">
		
		{/* <ListItem className={"listItem" + ((pathname === '/future-trading') ? ' active' : '')}>
			<Link to="/future-trading">
				Future
			</Link>
		</ListItem> */}

		<ListItem className={"listItem" + ((pathname === '/register') ? ' active' : '')}>
			<Link to="/register">
				Signup
			</Link>
		</ListItem>

		<ListItem className={"listItem" + ((pathname === '/login') ? ' active' : '')}>
			<Link to="/login">
				Login
			</Link>
		</ListItem>
	</List>
);

GuestLink.propTypes = {
  pathname: PropTypes.string,
};

export default GuestLink;