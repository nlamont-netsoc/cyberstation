/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {Server, TaxiiConnect} from "../libs/taxii2lib";
import { ServerView } from '../pages/serverview.js';
import { StixView } from '../pages/stixview.js';
import { LoginPage } from '../pages/userlogin.js';
import { LogoutPage } from '../pages/userlogout.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';


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
        marginTop: theme.spacing.unit,
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
    menuButton: {
        marginLeft: -12,
        marginRight: 20
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
    }
});

// for testing --> todo to be removed
const testServer = new Server("/taxii/", new TaxiiConnect("https://test.freetaxii.com:8000", "user-me", "user-password"));

/**
 * main entry point into CyberStation app.
 * Provide a single page application consisting of a AppBar with login/logout and
 * a server and stix views buttons.
 */
class MainPage extends Component {

    constructor(props) {
        super(props);
        // for testing--> todo to be removed
        this.taxiCom = new TaxiiConnect("https://test.freetaxii.com:8000", "user-me", "user-password");
        this.state = { view: "", isLogged: false, loglabel: "Login", selectedServer: testServer, selectedCollection: '' };
    }

    isLoggedin = (value) => {
        if (value) {
            this.setState({ isLogged: true, loglabel: "Logout" });
            this.handleServer();
        } else {
            this.setState({ isLogged: false, loglabel: "Login" });
            this.setState({ view: <LoginPage conn={this.taxiCom} loggedin={this.isLoggedin} /> });
        }
    };

    handleLogin = () => {
        if (this.state.isLogged) {
            this.setState({ view: <LogoutPage conn={this.taxiCom} loggedin={this.isLoggedin} /> });
        } else {
            this.setState({ view: <LoginPage conn={this.taxiCom} loggedin={this.isLoggedin} /> });
        }
    };

    // called by ServerView to update the selected server
    updateServer = server => {
        this.setState({selectedServer: server});
    };

    // called by ServerView -> Collections to update the selected collection endpoint
    updateCollection = col => {
        this.setState({selectedCollection: col});
    };

    handleServer = () => {
        this.setState({ view: <ServerView update={this.updateServer} updateCollection={this.updateCollection}/> });
    };

    handleStix = () => {
        this.setState({ view: <StixView server={this.state.selectedServer} collection={this.state.selectedCollection} /> });
    };

    componentDidMount() {
        this.setState({ view: <LoginPage conn={this.taxiCom} loggedin={this.isLoggedin} /> });
    };

    render() {
        return (
            <div className={this.props.classes.root}>
                <div className={this.props.classes.appFrame}>

                    <AppBar className={this.props.classes.appBar}>
                        <Toolbar>
                            <Typography type="title" color="inherit" className={this.props.classes.flex}>CyberStation 0.1</Typography>
                            <Button color="contrast" onClick={this.handleLogin}>{this.state.loglabel}</Button>
                            <Button disabled={!this.state.isLogged} color="contrast" onClick={this.handleServer}>Server</Button>
                            <Button disabled={!this.state.isLogged} color="contrast" onClick={this.handleStix}>Stix</Button>
                        </Toolbar>
                    </AppBar>

                    <main className={this.props.classes.content}>
                        {this.state.view}
                    </main>

                </div>
            </div>
        );
    }
}

MainPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(MainPage));
