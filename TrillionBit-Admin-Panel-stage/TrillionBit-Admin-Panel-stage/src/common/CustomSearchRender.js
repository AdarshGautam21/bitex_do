import React from 'react';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';
import {

    Grid
} from '@material-ui/core';
const defaultSearchStyles = theme => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
  },
  searchText: {
    flex: '0.8 0',
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
});

class CustomSearchRender extends React.Component {
    searchText = {search: '', name: ''};
    
    handleTextChange = (searchName) => event => {
        if(searchName === 'search') {
            this.searchText['search'] = event.target.value;
            // this.searchText['name'] = '';
        } else {
            this.searchText['name'] = event.target.value;
            // this.searchText['search'] = '';
        }
        this.props.onSearch(JSON.stringify(this.searchText));
    };

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown, false);
    }

    onKeyDown = event => {
        if (event.keyCode === 27) {
        this.props.onHide();
        }
    };

    isJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

  render() {
    const { classes, options, onHide } = this.props;
    let searchText = this.props.searchText;
    searchText = this.isJsonString(searchText) ? JSON.parse(searchText) : {search: '', name: ''};
    return (
        <Grid
            container
            spacing={3}
        > 
            <Grid item xs={12} md={5}>
                <Grow appear in={true} timeout={300}>
                    <div className={classes.main} ref={el => (this.rootRef = el)}>
                        <TextField
                            placeholder={'Search by user name or email'}
                            className={classes.searchText}
                            InputProps={{
                                'aria-label': options.textLabels.toolbar.search,
                            }}
                            value={searchText?.name || ''}
                            onChange={this.handleTextChange('name')}
                            fullWidth={true}
                            inputRef={el => (this.searchField = el)}
                        />
                    </div>
                </Grow>
            </Grid>

            <Grid item xs={12} md={5}>
                <Grow appear in={true} timeout={300}>
                    <div className={classes.main} ref={el => (this.rootRef = el)}>
                    <TextField
                        placeholder={'Search'}
                        className={classes.searchText}
                        InputProps={{
                            'aria-label': options.textLabels.toolbar.search,
                        }}
                        value={searchText?.search || ''}
                        onChange={this.handleTextChange('search')}
                        fullWidth={true}
                        inputRef={el => (this.searchField = el)}
                    />
                    </div>
                </Grow>
            </Grid>

            <Grid item xs={12} md={2}>
                <IconButton className={classes.clearIcon} onClick={onHide}>
                    <ClearIcon />
                </IconButton>
            </Grid>

        </Grid>
    );
  }
}

export default withStyles(defaultSearchStyles, { name: 'CustomSearchRender' })(CustomSearchRender);
