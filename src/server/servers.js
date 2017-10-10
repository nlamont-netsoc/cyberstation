/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import {ServerInfoPanel} from './serverInfoPanel.js';
import {TaxiiConnect, Server} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import {FormControl} from 'material-ui/Form';
import {CircularProgress} from 'material-ui/Progress';
import {AlertSlide} from '../server/alertSlide.js';
import {isValidURL} from '../stix/stixutil.js';
import PropTypes from 'prop-types';
import AddPanel from '../components/addPanel.js';


const styles = {};

/**
 * Display the list of servers and the selected server information including its api roots.
 * Can add new servers to storage and deleting selected servers from storage.
 *
 */
export class ServersPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,         // for the progress spinner
            alert: false,           // to open the alert dialog, when a server cannot connect
            serverListUrl: [],      // the list of servers url
            discovery: undefined,   // the current server discovery info
            currentServer: '',      // the current selected server url
            serverObj: undefined,   // the current selected server object
            currentApiroot: ''      // the current selected api root url
        }
    };

    componentDidMount() {
        this.setState({
            currentServer: localStorage.getItem('serverSelected') || '',
            discovery: JSON.parse(localStorage.getItem('serverDiscovery')) || undefined,
            currentApiroot: localStorage.getItem('serverApiroot') || '',
            serverListUrl: JSON.parse(localStorage.getItem('serverUrlList')) || [],
            serverObj: this.props.server,
        });
        if (!this.props.server) this.createServer();
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({
            currentServer: localStorage.getItem('serverSelected'),
            discovery: JSON.parse(localStorage.getItem('serverDiscovery')) || undefined,
            currentApiroot: localStorage.getItem('serverApiroot') || '',
            serverListUrl: JSON.parse(localStorage.getItem('serverUrlList')) || [],
            serverObj: newProps.server
        });
    };

    // update the selected api root url
    updateApiRootSelection = value => {
        localStorage.setItem('serverApiroot', value);
        this.setState({currentApiroot: value});
    };

    // close the alert dialog
    handleAlertRequestClose = () => {
      //  this.setState({alert: false});
         this.setState({alert: false, currentServer: '', currentApiroot: '', serverObj: undefined});
        // localStorage.setItem('serverSelected', '');
        // localStorage.setItem('serverApiroot', '');
        // localStorage.setItem('serverDiscovery', JSON.stringify({}));
        // localStorage.setItem('collectionSelected', JSON.stringify({}));
    };

    // display the server info including the api roots
    serverInfo() {
        if (this.state.serverObj) {
            return <ServerInfoPanel server={this.state.serverObj} update={this.updateApiRootSelection}/>
        } else {
            return <div>no TAXII-2 server selected</div>
        }
    }

    createServer() {
        if (isValidURL(this.state.currentServer)) {
            this.setState({waiting: true});
            // create a server, get its discovery info and add it to the list
            let newServer = new Server("/taxii/", new TaxiiConnect(this.state.currentServer, "user-me", "user-password"));
            // timeout for connecting to the server
            let timeout = 5000;
            // fancy foot work
            Promise.race([
                newServer.discovery().then(discovery => {
                    this.setState({
                        waiting: false,
                        discovery: discovery,
                        currentServer: newServer.conn.baseURL,
                        serverObj: newServer
                    });
                    localStorage.setItem("serverDiscovery", JSON.stringify(discovery));
                    // get the storage serverList
                    let thisServerList = JSON.parse(localStorage.getItem('serverUrlList')) || [];
                    // see if already in the list
                    let foundUrl = thisServerList.find(item => item === newServer.conn.baseURL);
                    // if not in the list
                    if (!foundUrl) {
                        // add this new server url to the list
                        thisServerList.push(newServer.conn.baseURL);
                        // update the store
                        localStorage.setItem("serverUrlList", JSON.stringify(thisServerList));
                        localStorage.setItem('serverSelected', foundUrl);
                    }
                    // tell the parent component
                    this.props.update(newServer);
                }).catch(err => {
                    this.setState({waiting: false, currentServer: '', serverObj: undefined});
                    localStorage.setItem('serverSelected', '');
                    localStorage.setItem('serverApiroot', '');
                    localStorage.setItem('serverDiscovery', JSON.stringify({}));
                    localStorage.setItem('collectionSelected', JSON.stringify({}));
                    // tell the parent component
                    this.props.update(undefined);
                    new Error('fetch error')
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
            ]).catch(err => {
                // show the alert about cannot connect to the server
                this.setState({waiting: false, alert: true, serverObj: undefined, discovery: '', currentApiroot: ''});
                this.forceUpdate();
                localStorage.setItem('serverApiroot', '');
                localStorage.setItem('serverDiscovery', JSON.stringify({}));
                localStorage.setItem('collectionSelected', JSON.stringify({}));
                // tell the parent component
                this.props.update(undefined);
            });
        } else {
            this.setState({currentServer: '', serverObj: undefined});
            localStorage.setItem('serverSelected', '');
            // tell the parent component
            this.props.update(undefined);
        }
    };

    // callback from the AddPanel, either a selection or the list of server url
    handleServerUpdate = (event) => {
        // if there is nothing in the list remove the server object
        if (event.target.value.length <= 0) {
            localStorage.setItem('serverApiroot', '');
            localStorage.setItem('serverDiscovery', JSON.stringify({}));
            localStorage.setItem('serverSelected', '');
            localStorage.setItem('collectionSelected', JSON.stringify({}));
            this.setState({serverObj: '', currentServer: '', discovery: '', currentApiroot: ''});
            this.forceUpdate();
            // tell the parent component
            this.props.update(undefined);
            return;
        }
        // event.target.value can be a string or an array of strings
        if (event.target.value) {
            if (Array.isArray(event.target.value)) {
                // pick the last value of the array
                let lastUrl = event.target.value[event.target.value.length - 1];
                // check it is a valid url
                if (isValidURL(lastUrl)) {
                    // the list of url
                    this.state.serverListUrl = event.target.value;
                    this.state.currentServer = lastUrl;
                    // store the array as a json string object
                    localStorage.setItem('serverUrlList', JSON.stringify(event.target.value));
                    localStorage.setItem('serverSelected', lastUrl);
                    this.forceUpdate();
                    this.createServer()
                } else {
                    // not a valid url, remove the last url
                    event.target.value.splice((event.target.value.length - 1), 1);
                    this.state.serverListUrl = event.target.value;
                    this.forceUpdate();
                }
            } else {
                // a single selection
                this.state.currentServer = event.target.value;
                localStorage.setItem('serverSelected', event.target.value);
                this.forceUpdate();
                this.createServer();
            }
        }
    };

    render() {
        return (
            <div>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" required>
                            <AddPanel initSelection={this.state.currentServer}
                                      title="server url" itemList={this.state.serverListUrl}
                                      update={this.handleServerUpdate}/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        {this.serverInfo()}
                    </Grid>
                </Grid>

                <div style={{marginLeft: 400, marginTop: 40}}>
                    {this.state.waiting && <CircularProgress size={40}/>}
                </div>

                <AlertSlide open={this.state.alert}
                            onClose={this.handleAlertRequestClose}
                            url={this.state.currentServer}/>
            </div>
        );
    };

}

ServersPage.propTypes = {
    update: PropTypes.func.isRequired,
    server: PropTypes.object
};
