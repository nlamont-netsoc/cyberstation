/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {ServerInfoPanel} from './serverInfoPanel.js';
import {TaxiiConnect, Server} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Divider from 'material-ui/Divider';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import {CircularProgress} from 'material-ui/Progress';
import {AlertSlide} from '../server/alertSlide.js';
import Typography from 'material-ui/Typography';
import {isValidURL} from '../stix/stixutil.js';
import {ServerPanel} from '../server/serverPanel.js';


const styles = {
    root: {
        textAlign: 'center',
        paddingTop: 200
    },
    addButton: {
        position: 'absolute',
        bottom: 32,
        right: 32
    }
};

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
            openNewDialog: false,   // to open a new server input dialog
            serverList: [],         // the list of server objects to choose from
            discovery: '',          // the current server discovery info
            currentServer: '',      // the current selected server url
            currentApiroot: ''      // the current selected api root url
        }
    };

    componentDidMount() {
        if (this.props.server) {
            this.setState({currentServer: this.props.server.conn.baseURL});
            this.handleRequestDialogOk();
        }
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        if (newProps.server) {
            this.state.currentServer = newProps.server.conn.baseURL;
            this.forceUpdate();
            this.handleRequestDialogOk();
        }
    };

    serverListAsFormLabels() {
        let formItems = [];
        this.state.serverList.map(serv =>
            formItems.push(<FormControlLabel
                style={{margin: 8}}
                key={serv.conn.baseURL}
                value={serv.conn.baseURL}
                control={<Radio/>}
                label={serv.conn.baseURL}/>));
        return formItems;
    };

    // update the selected api root url
    updateApiRootSelection = value => {
        this.setState({currentApiroot: value});
        // tell the parent component
        this.props.apiroot(value);
    };

    // change the selected server
    handleServerSelection = event => {
        let url = event.target.value;
        let theServer = this.state.serverList.find(s => s.conn.baseURL === url);
        if (theServer) {
            // tell the parent component
            this.props.update(theServer);
            // get the discovery info
            this.setState({waiting: true});
            theServer.discovery().then(discovery => {
                this.setState({waiting: false, discovery: discovery, currentServer: url});
            });
        }
    };

    // delete the selected server
    // handleDelete = (event) => {
    //     // delete the selected server from the list
    //     let withoutSelected = this.state.serverList.filter(s => s.conn.baseURL !== this.state.currentServer);
    //     this.setState({serverList: withoutSelected, discovery: '', currentServer: ''});
    //     // tell the parent the server and thus the apiroot have been deleted
    //     this.props.update(undefined);
    //     this.props.apiroot(undefined);
    // };

    // add a new server to the display list
    handleAdd = (event) => {
        this.setState({openNewDialog: true});
    };

    // save the current server to storage
    handleSave = (event) => {
        if (this.state.currentServer) localStorage.setItem("server--" + this.state.currentServer, this.state.currentServer);
    };

    // change the url input text of the dialog
    handleDialogChange = event => {
        this.setState({currentServer: event.target.value});
    };

    handleRequestDialogCancel = () => {
        this.setState({openNewDialog: false});
    };

    // when a new server url has been entered in the dialog text field.
    // try to create a new server object, add it to the list and select it.
    handleRequestDialogOk = () => {
        if (isValidURL(this.state.currentServer)) {
            // try to find the url in the list of current servers
            let found = this.state.serverList.find(s => s.conn.baseURL === this.state.currentServer);
            // do not add a new server if it is already in the list
            if (found) return;

            this.setState({waiting: true, openNewDialog: false});
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
                        serverList: [...this.state.serverList, newServer],
                        currentServer: newServer.conn.baseURL
                    });
                    let event = {target: {value: newServer.conn.baseURL}};
                    this.handleServerSelection(event);
                }).catch(err => {
                    this.setState({waiting: false, currentServer: ''});
                    new Error('fetch error')
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), timeout)
                )
            ]).catch(err => {
                // show the alert about cannot connect to the server
                this.setState({waiting: false, alert: true});
            });
        } else {
            this.setState({currentServer: ''});
        }
    };

    // close the alert dialog
    handleAlertRequestClose = () => {
        this.setState({alert: false});
    };

    // display the server info including the api roots
    serverInfo() {
        let theServer = this.state.serverList.find(s => s.conn.baseURL === this.state.currentServer);
        if (theServer) {
            return <ServerInfoPanel server={theServer} update={this.updateApiRootSelection}/>
        } else {
            return <div>no server selected</div>
        }
    }

    // load a server from storage, called from ServerPanel
    handleLoad = (theUrl) => {
        if (theUrl) {
            // try to find the url in the list of current servers
            let found = this.state.serverList.find(s => s.conn.baseURL === theUrl);
            // set the server selection and apiroot selections
            this.state.currentServer = theUrl;
            this.forceUpdate();
            // clear the apiroot selection
            this.updateApiRootSelection('');
            // if already displayed, just select it
            if (found) {
                // update the currentServer selection
                let event = {target: {value: theUrl}};
                this.handleServerSelection(event);
            } else {
                // create the server, update the state and selection
                this.handleRequestDialogOk();
            }
        }
    };

    render() {
        return (
            <div>
                <Grid container spacing={8}>
                    <Grid item xs={6}>

                        <FormControl component="fieldset" required>
                            <Typography type="body1" style={{margin: 8}}> Servers </Typography>

                            <Grid key="kk">
                                <Grid key="k1">
                                    <Button aria-labelledby="new" onClick={this.handleAdd} raised color="primary"
                                            style={{margin: 4}}>New</Button>
                                    <Button aria-labelledby="save" onClick={this.handleSave} raised color="primary"
                                            style={{margin: 4}}>Save</Button>
                                </Grid>
                                <Grid key="k2" style={{margin: 8}}>
                                    <ServerPanel update={this.handleLoad}/>
                                </Grid>
                            </Grid>

                            <Divider/>
                            <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                        aria-label="obj"
                                        name="objGroup"
                                        value={this.state.currentServer}
                                        onChange={this.handleServerSelection}>
                                {this.serverListAsFormLabels()}
                            </RadioGroup>
                        </FormControl>

                    </Grid>

                    <Grid item xs={6}>
                        {this.serverInfo()}
                    </Grid>
                </Grid>

                <Dialog open={this.state.openNewDialog} transition={Slide}
                        onRequestClose={this.handleRequestDialogClose}>
                    <DialogTitle>{"Enter the server URL"}</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus={true}
                                   style={{marginLeft: 8, width: 300}}
                                   name="serverUrl"
                                   type="text"
                                   id="serverUrl"
                                   label="server url"
                                   value={this.state.currentServer}
                                   margin="normal"
                                   onChange={this.handleDialogChange}
                                   fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestDialogCancel} color="primary">Cancel</Button>
                        <Button onClick={this.handleRequestDialogOk} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>

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
    server: PropTypes.object,
    update: PropTypes.func.isRequired,
    apiroot: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(ServersPage));