/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import uuidv4 from "uuid/v4";
import AddPanel from '../components/addPanel.js';
import {FormControl, FormLabel, FormControlLabel} from 'material-ui/Form';
import PropTypes from "prop-types";
import {defaultBundle, emptyBundle} from './stixutil.js';
import Divider from 'material-ui/Divider';
import {Collection} from "../libs/taxii2lib";
import Button from 'material-ui/Button';
import Cached from 'material-ui-icons/Cached';


const styles = {};

/**
 * control add/delete/save/load and send bundles to the server,
 * display the bundle info and its objects list
 */
export class BundlePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,         // for the progress spinner
            server: this.props.server,
            collection: '',
            apiroot: '',
            bundleMap: new Map(),
            bundleList: [],
            bundleNameList: [],
            objList: [],
            info: '',
            bundle: JSON.parse(JSON.stringify(defaultBundle))
        };
    }

    initialise(theServer) {
        // make a deep copy of the bundle list
        let bndlList = JSON.parse(localStorage.getItem('bundleList'));
        //   let theMap = new Map();
        //   for (let bndl of bndlList) theMap.set(bndl.name, bndl);
        this.setState({
            server: theServer,
            collection: JSON.parse(localStorage.getItem('collectionSelected')),
            apiroot: localStorage.getItem('serverApiroot') || '',
            //    bundleMap: theMap,
            bundleList: bndlList,
            bundle: bndlList[localStorage.getItem('bundleSelected')],
            bundleNameList: bndlList.map(bndl => bndl.name)
        });
        this.showServerInfo();
    };

    // initialise the state
    componentDidMount() {
        this.initialise(this.props.server)
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.initialise(newProps.server)
    };

    objectsAsFormLabels() {
        const objslist = this.state.bundle ? this.state.bundle.objects : [];
        let formItems = [];
        objslist.map(sdo => formItems.push(
            <Typography type="body1" key={sdo.id} style={{margin: 8, marginLeft: 16}}>{sdo.name}</Typography>));
        return formItems;
    };

    // changes to bundle due to user input editing
    handleChange = name => event => {
        // update only the specific attribute
        this.setState({bundle: {...this.state.bundle, [name]: event.target.value}});
        // special case, changing the name of the bundle, we need to also update the bundleNameList
        if (name === 'name') {
            // the index of the selected bundle in the list
            let ndx = localStorage.getItem('bundleSelected');
            // update the value of this name in the list
            this.state.bundleNameList[ndx] = event.target.value;
        }
        this.forceUpdate();
    };

    // callback from the AddPanel, either a selection or the list of bundle names
    handleBundleUpdate = (event) => {
        // event.target.value can be a string or an array of strings
        if (event.target.value) {
            if (Array.isArray(event.target.value)) {
                // if there is nothing in the list clear everything
                if (event.target.value.length <= 0) {
                    localStorage.setItem('bundleSelected', '');
                    localStorage.setItem('bundleList', JSON.stringify([]));
                    this.state.bundleList = [];
                    this.state.bundleNameList = [];
                    this.state.objList = [];
                    this.state.info = '';
                    this.state.bundle = undefined;
                    this.forceUpdate();
                    // tell the parent about having no bundle selected
                    this.props.update(false);
                    return;
                }
                // pick the last value of the array
                let lastValue = event.target.value[event.target.value.length - 1];
                // update the list
                this.state.bundleNameList = event.target.value;
                // find the index of the lastValue bundle in the list
                let ndx = this.state.bundleList.findIndex(bndl => bndl.name === lastValue);
                if (ndx === -1) {
                    // must create a new bundle
                    let newBundle = JSON.parse(JSON.stringify(defaultBundle));
                    newBundle.name = lastValue;
                    this.state.bundleList = [newBundle];
                    this.state.bundleNameList = [newBundle.name];
                    this.state.objList = [];
                    this.state.info = '';
                    this.state.bundle = newBundle;
                    // update the store selected bundle
                    localStorage.setItem('bundleSelected', 0);
                    // store the array as a json string object
                    localStorage.setItem('bundleList', JSON.stringify(this.state.bundleList));
                } else {
                    // update the store selected bundle
                    localStorage.setItem('bundleSelected', ndx);
                }
                // tell the parent about having a bundle selected
                this.props.update(true);
                this.forceUpdate();
            }
        } else {
            // a single selection
            this.forceUpdate();
            // find the index of the selected named bundle in the list
            let ndx = this.state.bundleList.findIndex(bndl => bndl.name === event.target.value);
            // update the store selected bundle
            localStorage.setItem('bundleSelected', ndx);
        }
    };

    showServerInfo() {
        if (this.state.server) {
            this.state.server.discovery().then(discovery => {
                let colEntry = 'no collection selected';
                let writeVal = '';
                let colInfo = 'Collection';
                if (this.state.collection) {
                    writeVal = this.state.collection.can_write ? 'can write to' : 'cannot write to';
                    colInfo = 'Collection' + " (" + writeVal + ")";
                    colEntry = this.state.collection.title;
                }
                let serverInfo = <Table style={{marginLeft: 8}}>
                    <TableBody>
                        <TableRow key="Title">
                            <TableCell>Title</TableCell>
                            <TableCell>{discovery.title}</TableCell>
                        </TableRow>
                        <TableRow key="Description">
                            <TableCell>Description</TableCell>
                            <TableCell>{discovery.description}</TableCell>
                        </TableRow>
                        <TableRow key="Contact">
                            <TableCell>Contact</TableCell>
                            <TableCell>{discovery.contact}</TableCell>
                        </TableRow>
                        <TableRow key="Endpoint">
                            <TableCell>{colInfo}</TableCell>
                            <TableCell>{colEntry}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>;
                this.setState({info: serverInfo});
            })
        } else {
            this.setState({info: "no server"});
        }
    };

    showBundleInfo() {
        if (this.state.bundle) {
            return <form noValidate autoComplete="off">
                <Grid key="bundle1" item>
                    <TextField style={{marginLeft: 8, width: 350}}
                               name="name"
                               id="name"
                               label="name"
                               value={this.state.bundle.name}
                               margin="normal"
                               onChange={this.handleChange('name')}
                    />
                    <TextField style={{marginLeft: 22, width: 40}}
                               name="spec_version"
                               id="spec_version"
                               label="spec_version"
                               value={this.state.bundle.spec_version}
                               margin="normal"
                               onChange={this.handleChange('spec_version')}
                    />
                </Grid>
                <Grid key="bundle2" item>
                    <TextField style={{marginLeft: 8, width: 400}}
                               name="id"
                               id="id"
                               label="id"
                               value={this.state.bundle.id}
                               margin="normal"
                               onChange={this.handleChange('id')}
                    />
                    <Button fab dense color="primary" aria-label="redo" style={{width: 33, height: 22}}
                            onClick={(e) => {
                                this.handleChange('id')({target: {value: "bundle--" + uuidv4()}})
                            }}>
                        <Cached/>
                    </Button>
                </Grid>
            </form>
        } else {
            return <div> no bundle information </div>
        }
    };

    render() {
        const sendable = this.state.collection ? this.state.collection.can_write : false;
        const bundleName = this.state.bundle ? this.state.bundle.name : '';
        return (
            <Grid container spacing={8}>

                <Grid item xs={5}>
                    <FormControl component="fieldset" required>
                        <AddPanel title="bundle"
                                  initSelection={bundleName}
                                  itemList={this.state.bundleNameList}
                                  update={this.handleBundleUpdate}/>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>

                    <Grid>
                        {this.showBundleInfo()}
                    </Grid>

                    <Grid key="bundle3" item>
                        <div style={{height: 20}}/>
                        <Typography type="body1" style={{marginLeft: 8}}>Connected to</Typography>
                        {this.state.info}
                    </Grid>

                    <Grid key="bundle4" item>
                        <div style={{height: 20}}/>
                        <Typography type="body1" style={{marginLeft: 8}}>Objects list</Typography>
                        <Divider/>
                        {this.objectsAsFormLabels()}
                    </Grid>

                </Grid>
            </Grid>
        );
    }
    ;

}

BundlePage.propTypes = {
    server: PropTypes.object,
    update: PropTypes.func
};

export default withRoot(withStyles(styles)(BundlePage));