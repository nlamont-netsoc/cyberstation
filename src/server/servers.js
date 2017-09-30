/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {ServerPanel} from '../server/serverPanel.js';
import {StixPage, styles} from '../stix/stixPage.js';
import {TaxiiConnect, Server} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, {ListItemText} from 'material-ui/List';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import { CircularProgress } from 'material-ui/Progress';


export class ServersPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: false,    // for the url dialog
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
            this.setState({loading: false, discovery: discovery, serverList: objItems, currentServer: server.conn.baseURL});
        });
        let event = {target: {value: server.conn.baseURL}};
        this.handleServerSelection(event);
    };

    serverListAsFormLabels() {
        let formItems = [];
        this.state.serverList.map(serv =>
            formItems.push(<FormControlLabel style={{margin: 8}} key={serv.conn.baseURL} value={serv.conn.baseURL}
                                             control={<Radio/>} label={serv.conn.baseURL}/>));
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
        if (theServer !== undefined) {
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
        let witoutSelected = this.state.serverList.filter(s => s.conn.baseURL !== this.state.currentServer);
        this.setState({serverList: witoutSelected, discovery: '', currentServer: ''});
        // tell the parent it has been deleted
        this.props.update(this.state.currentServer, true);
    };

    // add a new server to the list
    handleAdd = (event) => {
        this.setState({loadOpen: true});
    };

    handleRequestDialogCancel = () => {
        this.setState({loadOpen: false});
        this.setState({currentServer: ''});
    };

    // vague attempt to check the url string
    isValidURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?'+ // port
            '(\\/[-a-z\\d%_.~+&:]*)*'+ // path
            '(\\?[;&a-z\\d%_.,~+&:=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    };

    handleRequestDialogOk = () => {
        if (this.isValidURL(this.state.currentServer)) {
            this.setState({loading: true, loadOpen: false});
            // create a server, test it and add it to the list
            let newServer = new Server("/taxii/", new TaxiiConnect(this.state.currentServer, "user-me", "user-password"));
            newServer.discovery().then(discovery => {
                console.log("--> discovery="+discovery);
                this.setState({
                    loading: false,
                    discovery: discovery,
                    serverList: [...this.state.serverList, newServer],
                    currentServer: newServer.conn.baseURL
                });
                let event = {target: {value: newServer.conn.baseURL}};
                this.handleServerSelection(event);
            }).catch(err => {
                console.log("--> error="+err);
                this.setState({loading: false, currentServer: ''});
                // todo --> add an alert here to say cannot connect
            });
        } else {
            this.setState({currentServer: ''});
        }
    };

    // change the url input text of the dialog
    handleDialogChange = event => {
        this.setState({currentServer: event.target.value});
    };

    // display the server info including the api roots
    serverInfo() {
        let theServer = this.state.serverList.find(s => s.conn.baseURL === this.state.currentServer);
        if (theServer === undefined) {
            return <div>no server selected</div>
        } else {
            return <ServerPanel server={theServer} update={this.updateApiRootSelection}/>
        }
    }

    render() {
        return (
            <div>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <FormControl component="fieldset" required>
                            <Typography type="body1" wrap style={{margin: 8}}> {this.title} </Typography>
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
                    {this.state.loading && <CircularProgress size={40}  />}
                </div>

            </div>
        );
    };

};

ServersPage.propTypes = {
    update: PropTypes.func.isRequired,
    apiroot: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(ServersPage));