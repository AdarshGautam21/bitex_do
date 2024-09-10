import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "../assets/css/permission.css";

class PermissionModal extends Component {
	state = {
		isModalOpen: true,
	};

	componentDidMount = async () => {};

	closeDialog = () => {
		this.setState({ isModalOpen: false });
		this.props.history.push("/dashboard");
	};

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<Dialog
					open={this.state.isModalOpen}
					onClose={() => this.closeDialog()}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					disableBackdropClick={true}
					fullWidth={true}
					maxWidth="md"
					disableEnforceFocus={true}
				>
					<DialogContent>
						<section className="error-container">
							<span>4</span>
							<span>
								<span className="screen-reader-text">0</span>
							</span>
							<span>1</span>
						</section>
						<h1>You do not have permission to access this page.</h1>
						<div className="link-container">
							<a href="/" className="more-link">
								Home
							</a>
						</div>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		);
	}
}

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
});

PermissionModal.propTypes = {
	auth: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermissionModal);
