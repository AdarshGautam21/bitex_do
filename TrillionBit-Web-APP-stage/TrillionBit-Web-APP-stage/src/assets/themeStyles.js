const styles = theme => ({

    root: {
        // flexGrow: 1,
        // maxHeight: 35,
        // boxShadow: 'none',
        // marginRight: theme.spacing(2),
    },
    backdropLoader: {
        paddingLeft: '2%',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    switchBase: {
        color: '#ddd',
        '&$checked': {
          color: '#3f51b5',
        },
        '&$checked + $track': {
          backgroundColor: '#3f51b5',
        },
    },
    track: {},
    checked: {},
    darktoolbar: {
        backgroundcolor:'#ddd',
    },
    drawer: {
        width: 240,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 240,
    },
    tabRoot: {
        flexGrow: 1,
        display: 'flex',
        // justifyContent: 'flex-end',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
});

export default styles;
