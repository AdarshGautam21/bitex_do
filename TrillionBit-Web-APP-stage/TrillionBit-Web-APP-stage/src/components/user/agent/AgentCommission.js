import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withStyles } from '@mui/styles';

import MaterialTable from 'material-table';

import {
    Button,
    Grid,
    TextField,
} from '@mui/material';
import tableIcons from '../../../common/tableIcons';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {
    getAgetDefaultSettings,
    getAgentCommissions,
    updateAgentCommissions,
    getClientTradingLevels,
    createClientTradingLevel,
    updateClientTradingLevel,
    removeClientTradingLevel,
} from '../../../actions/userActions';
import {
    clearSnackMessages,
    clearErrors,
} from '../../../actions/messageActions';

import Snackbar from '@mui/material/Snackbar';
import SnackbarMessage from '../../../common/SnackbarMessage';

import themeStyles from '../../../assets/themeStyles';
import isEmpty from '../../../validation/isEmpty';

class AgentCommission extends Component {
    state = {
        commissionUpdateForm: false,
        makerCommission: 0,
        takerCommission: 0,
        makerDefaultFee: 0,
        takerDefaultFee: 0,
        errors: {},
        snackMessages: {},
        variant: 'dark',
        snackbarMessage: '',
    }

    componentDidMount = async () => {
        await this.props.getAgetDefaultSettings();
        await this.props.getAgentCommissions(this.props.auth.user.id);
        await this.props.getClientTradingLevels(this.props.clientInfo._id);
    }

    componentWillReceiveProps = nextProps => {
        if(!isEmpty(nextProps.user.agentDefaultSettings)) {
            this.setState({
                makerDefaultFee: nextProps.user.agentDefaultSettings.makerFee,
                takerDefaultFee: nextProps.user.agentDefaultSettings.takerFee,
            });
        }

        if(!isEmpty(nextProps.user.agentCommissions)) {
            this.setState({
                makerCommission: nextProps.user.agentCommissions.makerFee,
                takerCommission: nextProps.user.agentCommissions.takerFee,
            });
        }

        if(nextProps.snackMessages) {
            this.setState({ snackMessages: nextProps.snackMessages });
        }
    }

    handleSnackbarClose = () => {
        this.props.clearSnackMessages();
    }

    updateAgentCommission = async () => {
        let params = {
            makerFee: this.state.makerCommission,
            takerFee: this.state.takerCommission,
        }
        await this.props.updateAgentCommissions(
            this.props.auth.user.id,
            params,
        )
        await this.props.getAgentCommissions(this.props.auth.user.id);
        this.setState({commissionUpdateForm: false});
    }

    handleChange = (name) => (event) => {
        this.setState({ [name]: event.target.value });
    };

    addClientTraderLevel = async (data) => {
        let newData = {
            agentId: this.props.auth.user.id,
            clientId: this.props.clientInfo._id,
            fromAmount: data.fromAmount,
            makerFee: data.maker_fee,
            name: data.name,
            takerFee: data.taker_fee,
            toAmount: data.toAmount,
        }
        await this.props.createClientTradingLevel(newData);
        this.props.getClientTradingLevels(this.props.clientInfo._id);
    }

    updateClientTraderLevel = async (traderLevelId, data) => {
        let newData = {
            fromAmount: data.fromAmount,
            makerFee: data.maker_fee,
            name: data.name,
            takerFee: data.taker_fee,
            toAmount: data.toAmount,
        }
        await this.props.updateClientTradingLevel(traderLevelId, newData);
        this.props.getClientTradingLevels(this.props.clientInfo._id);
    }

    removeClientTraderLevel = async (traderLevelId) => {
        await this.props.removeClientTradingLevel(traderLevelId);
        this.props.getClientTradingLevels(this.props.clientInfo._id);
    }

    render() {
        const {
            errors,
            snackMessages,
            snackbarMessage,
            variant,
        } = this.state;

        return (
            <Grid container spacing={3}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={!isEmpty(snackMessages) ? true : false}
                    autoHideDuration={3000}
                    onClose={this.handleSnackbarClose}
                >
                    <SnackbarMessage
                        onClose={this.handleSnackbarClose}
                        variant={!isEmpty(snackMessages) ? snackMessages.variant : variant}
                        message={!isEmpty(snackMessages) ? snackMessages.message : snackbarMessage}
                    />
                </Snackbar>
                <Dialog open={this.state.commissionUpdateForm} onClose={() => this.setState({commissionUpdateForm: !this.state.commissionUpdateForm})} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Commission Update</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Changing commissions will effect on all client's new order only.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            error={(errors.transferAmount) ? true : false}
                            label="Maker commission percentage (%)"
                            type="text"
                            name="makerCommission"
                            fullWidth
                            value={this.state.makerCommission}
                            onChange={this.handleChange('makerCommission')}
                            margin="normal"
                            helperText={errors.makerCommission}
                        />
                        <TextField
                            error={(errors.takerCommission) ? true : false}
                            label="Taker commission percentage (%)"
                            type="text"
                            name="takerCommission"
                            fullWidth
                            value={this.state.takerCommission}
                            onChange={this.handleChange('takerCommission')}
                            margin="normal"
                            helperText={errors.takerCommission}
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.setState({commissionUpdateForm: !this.state.commissionUpdateForm})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.updateAgentCommission()} color="primary">
                        Update
                    </Button>
                    </DialogActions>
                </Dialog>
                {/* <Grid item sm={12}>
                    <Button size="small" onClick={() => this.setState({commissionUpdateForm: !this.state.commissionUpdateForm})}>Edit</Button>
                </Grid>
                <Grid item sm={6}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Maker Fee {this.state.makerCommission === 0 ? this.state.makerDefaultFee : this.state.makerCommission}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm={6}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Taker Fee {this.state.takerCommission === 0 ? this.state.takerDefaultFee : this.state.takerCommission}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid> */}
                <Grid item sm={12}>
                    <div className="tableResponsive" fixed="false">
                        <MaterialTable
                            title="Trader Levels"
                            options={{
                                actionsColumnIndex: -1
                            }}
                            icons={tableIcons}
                            columns={[
                                { title: 'Level', field: 'name' },
                                { title: 'From Amount', field: 'fromAmount' },
                                { title: 'To Amount', field: 'toAmount' },
                                { title: 'Maker Fee (%)', field: 'maker_fee' },
                                { title: 'Taker Fee (%)', field: 'taker_fee' },
                            ]}
                            data={this.props.user.clientTradeLevels}
                            editable={{
                                onRowAdd: newData => this.addClientTraderLevel(newData),
                                onRowUpdate: (newData, oldData) => this.updateClientTraderLevel(oldData._id, newData),
                                onRowDelete: oldData => this.removeClientTraderLevel(oldData._id)
                            }}
                        />
                    </div>
                </Grid>
            </Grid>
        )
    }
}

AgentCommission.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    snackMessages: PropTypes.object.isRequired,
    getAgetDefaultSettings: PropTypes.func.isRequired,
    getAgentCommissions: PropTypes.func.isRequired,
    updateAgentCommissions: PropTypes.func.isRequired,
    clearSnackMessages: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getClientTradingLevels: PropTypes.func.isRequired,
    createClientTradingLevel: PropTypes.func.isRequired,
    updateClientTradingLevel: PropTypes.func.isRequired,
    removeClientTradingLevel: PropTypes.func.isRequired,
}

const mapStateToProp = state => ({
    auth: state.auth,
    user: state.user,
    wallet: state.wallet,
    errors: state.errors,
    snackMessages: state.snackMessages,
});

export default connect(mapStateToProp, {
    getAgetDefaultSettings,
    getAgentCommissions,
    updateAgentCommissions,
    clearSnackMessages,
    clearErrors,
    getClientTradingLevels,
    createClientTradingLevel,
    updateClientTradingLevel,
    removeClientTradingLevel,
})(withStyles(themeStyles)(AgentCommission));
