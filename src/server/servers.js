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



/**
 * Display the list of servers and the selected server information including its api roots.
 * Can add new servers to storage and delete selected servers from storage.
 */
export class ServersPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,         // for the progress spinner
            alert: false,           // to open the alert dialog, when a server cannot connect
            alertMessage: "",       // the message to display by the alert dialog
            serverListUrl: [],      // the list of servers url
            discovery: undefined,   // the current server discovery info object
            currentServer: '',      // the current selected server url
            serverObj: undefined,   // the current selected server object
            currentApiroot: ''      // the current selected api root url
        }
    };

    componentDidMount() {
        // set the state to the storage info
        const disco = localStorage.getItem('serverDiscovery') !== undefined ? localStorage.getItem('serverDiscovery') : JSON.stringify({});
        this.setState({
            currentServer: localStorage.getItem('serverSelected') || '',
            discovery: JSON.parse(disco) || undefined,
            currentApiroot: localStorage.getItem('serverApiroot') || '',
            serverListUrl: JSON.parse(localStorage.getItem('serverUrlList')) || [],
            serverObj: this.props.server,
        });
        // if did not get a server obj, create one
        if (!this.props.server) this.createServer();
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        const disco = localStorage.getItem('serverDiscovery') !== undefined ? localStorage.getItem('serverDiscovery') : JSON.stringify({});
        this.setState({
            currentServer: localStorage.getItem('serverSelected'),
            discovery: JSON.parse(disco) || undefined,
            currentApiroot: localStorage.getItem('serverApiroot') || '',
            serverListUrl: JSON.parse(localStorage.getItem('serverUrlList')) || [],
            serverObj: newProps.server
        });
    };

    // update the selected api root url
    updateApiRootSelection = value => {
        localStorage.setItem('serverApiroot', value);
    //    this.setState({currentApiroot: value});
        // must not trigger a render
        this.state.currentApiroot = value;
    };

    // close the alert dialog, clear all current info including in storage
    handleAlertRequestClose = () => {
         this.setState({alert: false, alertMessage: "", currentServer: '', currentApiroot: '', serverObj: undefined});
         localStorage.setItem('serverSelected', '');
         localStorage.setItem('serverApiroot', '');
         localStorage.setItem('serverDiscovery', JSON.stringify({}));
         localStorage.setItem('collectionSelected', JSON.stringify({}));
    };

    // display the server info including the api roots
    serverInfo() {
        if (this.state.serverObj) {
            return <ServerInfoPanel server={this.state.serverObj} update={this.updateApiRootSelection}/>
        } else {
            return <div>no TAXII-2 server selected</div>
        }
    };

    createServer() {
        if (isValidURL(this.state.currentServer)) {
            this.setState({waiting: true});
            const timeout = 10000;
            // setup a server
            let newServer = new Server("/taxii/", new TaxiiConnect(this.state.currentServer, "guest", "guest"));
            // get the server discovery info and add it to the list
                newServer.discovery().then(discovery => {
                    this.setState({
                        waiting: false,
                        discovery: discovery,
                        currentServer: newServer.conn.baseURL,
                        serverObj: newServer,
                        currentApiroot: discovery.default
                    });
                    localStorage.setItem('collectionSelected', JSON.stringify({}));
                    localStorage.setItem('serverApiroot', discovery.default);
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
                    this.setState({alert: true, alertMessage: this.state.currentServer, waiting: false, serverObj: undefined});
                    localStorage.setItem('serverSelected', '');
                    localStorage.setItem('serverApiroot', '');
                    localStorage.setItem('serverDiscovery', JSON.stringify({}));
                    localStorage.setItem('collectionSelected', JSON.stringify({}));
                    // tell the parent component
                    this.props.update(undefined);
                    new Error('fetch error')
                })
        } else {
            // not valid url
            this.setState({currentServer: '', serverObj: undefined, currentApiroot: ''});
            localStorage.setItem('serverSelected', '');
            // tell the parent component
            this.props.update(undefined);
        }
    };

    // callback for the AddPanel (add/delete/select), either a selection or the list of server url
    handleServerUpdate = (event) => {
        // if there is nothing in the list (because we deleted all servers) clear everything
        if (event.target.value.length <= 0) {
            localStorage.setItem('serverApiroot', '');
            localStorage.setItem('serverDiscovery', JSON.stringify({}));
            localStorage.setItem('serverSelected', '');
            localStorage.setItem('collectionSelected', JSON.stringify({}));
            this.setState({serverObj: '', currentServer: '', discovery: '', currentApiroot: ''});
            // tell the parent component
            this.props.update(undefined);
            return;
        }
        // event.target.value can be a string or an array of strings
        if (event.target.value) {
            // if have an array representing the list of servers
            if (Array.isArray(event.target.value)) {
                // pick the last value of the array, because this is the one we have just added
                let lastUrl = event.target.value[event.target.value.length - 1];
                // check it is a valid url
                if (isValidURL(lastUrl)) {
                    // update the list of url
                    this.state.serverListUrl = event.target.value;
                    this.state.currentServer = lastUrl;
                    // store the array as a json string object
                    localStorage.setItem('serverUrlList', JSON.stringify(event.target.value));
                    localStorage.setItem('serverSelected', lastUrl);
                    this.forceUpdate();
                    this.createServer()
                } else {
                    // not a valid url, remove the last url from the list
                    event.target.value.splice((event.target.value.length - 1), 1);
                    this.state.serverListUrl = event.target.value;
                    this.forceUpdate();
                }
            } else {
                // have a single selection
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
                                      update={this.handleServerUpdate}
                                      updateFlag={true} />
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
                            url={this.state.alertMessage}/>
            </div>
        );
    };

}

ServersPage.propTypes = {
    update: PropTypes.func.isRequired,
    server: PropTypes.object
};
