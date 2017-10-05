/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {ServerPanel} from '../server/serverPanel.js';
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
 * Allows for adding new servers and deleting selected servers.
 * Display the list of servers and the selected server information and its api roots.
 */
export class ServersPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            alert: false,   // for the alert dialog
            open: false,    // for the new server dialog
            serverList: [], // the list of server objects to choose from
            discovery: '',  // the current server discovery info
            currentServer: '', // the current selected server url
            currentApiroot: '' // the current selected api root url
        }
    };

    componentDidMount() {
        this.setState({loading: true});
        let server = new Server("/taxii/", new TaxiiConnect("https://test.freetaxii.com:8000", "user-me", "user-password"));
        let objItems = [];
        objItems.push(server);
        server.discovery().then(discovery => {
            this.setState({
                loading: false,
                discovery: discovery,
                serverList: objItems,
                currentServer: server.conn.baseURL
            });
        });
        let event = {target: {value: server.conn.baseURL}};
        this.handleServerSelection(event);
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

    // update the selected api root url from the serverPanel
    updateApiRootSelection = value => {
        let theValue = value;
        this.setState({currentApiroot: theValue});
        // tell the parent component
        this.props.apiroot(theValue);
    };

    // change the selected server
    handleServerSelection = event => {
        let url = event.target.value;
        let theServer = this.state.serverList.find(s => s.conn.baseURL === url);
        if (theServer) {
            // tell the parent component
            this.props.update(theServer, false);
            // get the discovery info
            this.setState({loading: true});
            theServer.discovery().then(discovery => {
                this.setState({loading: false, discovery: discovery, currentServer: url});
            });
        }
    };

    // delete the selected server
    handleDelete = (event) => {
        // delete the selected server from the list
        let withoutSelected = this.state.serverList.filter(s => s.conn.baseURL !== this.state.currentServer);
        this.setState({serverList: withoutSelected, discovery: '', currentServer: ''});
        // tell the parent it has been deleted
        this.props.update(undefined);
        this.props.apiroot(undefined);
    };

    // add a new server to the list
    handleAdd = (event) => {
        this.setState({loadOpen: true});
    };

    handleRequestDialogCancel = () => {
        this.setState({loadOpen: false});
        this.setState({currentServer: ''});
    };

    // basic check of the url string
    isValidURL(str) {
        if(str) {
            let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?' + // port
                '(\\/[-a-z\\d%_.~+&:]*)*' + // path
                '(\\?[;&a-z\\d%_.,~+&:=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return pattern.test(str);
        } else {
            return false;
        }
    };

    handleRequestDialogOk = () => {
        if (this.isValidURL(this.state.currentServer)) {
            this.setState({loading: true, loadOpen: false});
            // create a server, get its discovery info and add it to the list
            let newServer = new Server("/taxii/", new TaxiiConnect(this.state.currentServer, "user-me", "user-password"));
            // timeout for connecting to the server
            let timeout = 5000;
            // fancy foot work
            Promise.race([
                newServer.discovery().then(discovery => {
                    this.setState({
                        loading: false,
                        discovery: discovery,
                        serverList: [...this.state.serverList, newServer],
                        currentServer: newServer.conn.baseURL
                    });
                    let event = {target: {value: newServer.conn.baseURL}};
                    this.handleServerSelection(event);
                }).catch(err => {
                    this.setState({loading: false, currentServer: ''});
                    new Error('fetch error')
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('timeout')), timeout)
                )
            ]).catch(err => {
                // show the alert about cannot connect to the server
                this.setState({loading: false, alert: true});
            });
        } else {
            this.setState({currentServer: ''});
        }
    };

    // close the alert dialog
    handleAlertRequestClose = () => {
        this.setState({alert: false});
    };

    // change the url input text of the dialog
    handleDialogChange = event => {
        this.setState({currentServer: event.target.value});
    };

    // display the server info including the api roots
    serverInfo() {
        let theServer = this.state.serverList.find(s => s.conn.baseURL === this.state.currentServer);
        if (theServer) {
            return <ServerPanel server={theServer} update={this.updateApiRootSelection}/>
        } else {
            return <div>no server selected</div>
        }
    }

    render() {
        return (
            <div>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" required>
                                <Button onClick={this.handleAdd} raised color="primary" style={{margin: 8}}>New
                                    server</Button>
                                <Button onClick={this.handleDelete} raised color="primary" style={{margin: 8}}>Delete
                                    selected</Button>
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

                <Dialog open={this.state.loadOpen} transition={Slide} onRequestClose={this.handleRequestDialogClose}>
                    <DialogTitle>{"Enter the server URL"}</DialogTitle>
                    <DialogContent>
                        <TextField style={{marginLeft: 8, width: 300}}
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
                    {this.state.loading && <CircularProgress size={40}/>}
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
    apiroot: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(ServersPage));