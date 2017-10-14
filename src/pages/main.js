/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import {TaxiiConnect} from "../libs/taxii2lib";
import {ServerView} from '../pages/serverview.js';
import {StixView} from '../pages/stixview.js';
import {LoginPage} from '../pages/userlogin.js';
import {LogoutPage} from '../pages/userlogout.js';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import {defaultBundle} from '../stix/stixutil.js';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';


const ITEM_HEIGHT = 45;

function TabContainer(props) {
    return <div>{props.children}</div>;
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: 'hidden'
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    appBar: {
        position: 'fixed',
        top: 0,
        width: '100%',
        height: 54,
        marginLeft: 1,
        order: 1
    },
    flex: {
        flex: 1
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        //   padding: theme.spacing.unit * 6,
        height: 'calc(100% - 56px)',
        marginTop: 26,
        marginLeft: 0,
        [theme.breakpoints.up('md')]: {
            height: 'calc(100% - 64px)',
            marginTop: 26
        }
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
});



/**
 * main entry point into CyberStation.
 * Provide a single page application consisting of a AppBar with Login/Logout and
 * a SERVER and STIX views buttons.
 */
class MainPage extends Component {

    constructor(props) {
        super(props);
        // todo to be removed, for testing
        this.taxiCom = new TaxiiConnect("https://test.freetaxii.com:8000", "user-me", "user-password");
        this.state = {
            view: '',
            server: undefined,
            isLogged: false,
            loglabel: 'Login'
        };
    }

    componentDidMount() {
        this.initStore();
        this.setState({view: <LoginPage conn={this.taxiCom} loggedin={this.isLoggedin}/>});
    };

    initStore = () => {
        //    localStorage.clear();
        //   localStorage.setItem('collectionSelected', JSON.stringify({}));
        //  localStorage.setItem('bundleList', JSON.stringify([]));
        //      for(let key in localStorage) {
        //          console.log(key + ' = ' + localStorage.getItem(key));
        //      }

        // add a default bundle if the store is empty
        let defBndl = JSON.parse(JSON.stringify(defaultBundle)); // make a deep copy
        let bndlList = JSON.parse(localStorage.getItem('bundleList')) || [];
        // if the store bundleList is empty add the default bundle to it
        if (bndlList.length === 0) {
            localStorage.setItem('bundleList', JSON.stringify([defBndl]));
            // bundle selected is the index into the bundle list
            localStorage.setItem('bundleSelected', 0);
        }
        // add a default test taxii server if the list is empty
        let srvList = JSON.parse(localStorage.getItem('serverUrlList')) || [];
        if (srvList.length === 0) {
            localStorage.setItem('serverUrlList', JSON.stringify(["https://test.freetaxii.com:8000"]));
        }
    };

    isLoggedin = (value) => {
        if (value) {
            this.setState({isLogged: true, loglabel: "Logout"});
            this.handleServer();
        } else {
            this.setState({isLogged: false, loglabel: "Login"});
            this.setState({view: <LoginPage conn={this.taxiCom} loggedin={this.isLoggedin}/>});
        }
    };

    handleLogin = () => {
        if (this.state.isLogged) {
            this.setState({view: <LogoutPage conn={this.taxiCom} loggedin={this.isLoggedin}/>});
        } else {
            this.setState({view: <LoginPage conn={this.taxiCom} loggedin={this.isLoggedin}/>});
        }
    };

    // callback from ServerView
    updateServer = (server) => {
        this.setState({server: server});
    };

    // set the view to the ServerView
    handleServer = () => {
        this.setState({view: <ServerView server={this.state.server} update={this.updateServer} />});
    };

    // set the view to the StixView
    handleStix = () => {
        this.setState({view: <StixView server={this.state.server} />});
    };

    render() {
        return (
            <div className={this.props.classes.root}>
                <div className={this.props.classes.appFrame}>

                    <AppBar className={this.props.classes.appBar}>
                        <Toolbar>
                            <IconButton color="contrast" aria-label="Menu">
                                <MenuIcon/>
                            </IconButton>
                            <Typography type="title" color="inherit" className={this.props.classes.flex}>
                                CyberStation 0.1</Typography>
                            <Button color="contrast" onClick={this.handleLogin}>{this.state.loglabel}</Button>
                            <Button disabled={!this.state.isLogged} color="contrast"
                                    onClick={this.handleServer}>Server</Button>
                            <Button disabled={!this.state.isLogged} color="contrast"
                                    onClick={this.handleStix}>Stix</Button>
                        </Toolbar>
                    </AppBar>

                    <main className={this.props.classes.content}>{this.state.view}</main>

                </div>
            </div>
        );
    }
}

MainPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(MainPage));
