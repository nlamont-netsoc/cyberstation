/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

import {TaxiiConnect, Server} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Button from 'material-ui/Button';
import uuidv4 from 'uuid/v4';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';


const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna'];

const styles = {
    tabs: {
        width: '100%',
        position: 'fixed',
        top: 52,
        zIndex: 1,
        marginTop: 2,
        backgroundColor: "royalblue"
    },
    content: {
        marginTop: 74,
        top: 74
    }
};

export class BundlePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false, loadSelection: '', sdoId: '', objList: []};
        this.title = "Bundle " + this.props.sdotype;
        if (this.props.sdotype !== '') {
            this.title = this.title + "s";
        }
    }

    // fill the list with the filtered objects of the bundle
    componentDidMount() {
        // an array of sdo id
        let objItems = [];
        if (this.props.bundle !== undefined) {
            // if have no filtering, take all
            if (this.props.sdotype === undefined || this.props.sdotype === '') {
                objItems = this.props.bundle.objects;
            } else {
                // apply the type filter
                objItems = this.props.bundle.objects.filter(obj => obj.type === this.props.sdotype);
            }
        }
        this.setState({objList: objItems});
    };

    asFormLabels() {
        let formItems = [];
        this.state.objList.map(sdo => formItems.push(<FormControlLabel
            style={{margin: 8}} key={sdo.id} value={sdo.id} control={<Radio/>} label={sdo.name}/>));
        return formItems;
    };

    // change the selected object to edit
    handleSelected = (event, sdoid) => {
        this.setState({sdoId: sdoid});
        // tell the parent component
        this.props.selected(sdoid, false);
    };

    // create a new bundle
    handleNew = (event) => {
        let newBundle = {type: "bundle", id: "bundle--" + uuidv4(), spec_version: "2.0", objects: []};
        Object.assign(this.props.bundle, newBundle);
        this.props.update(newBundle);
        this.setState({objList: newBundle.objects});
    };

    // send the bundle to the server
    handleSend = (event) => {

    };

    // retrieve all bundles from storage
    getAllFromStorage2 = () => {
        let storeContent = new Map();
        let keys = Object.keys(localStorage);
        for (let key of keys) {
            storeContent.set(key, localStorage.getItem(key));
        }
        return storeContent;
    };

    getAllFromStorage = () => {
        let storeContent = [];
        let keys = Object.keys(localStorage);
        for (let key of keys) {
            storeContent.push(key);
        }
        return storeContent;
    };

    // save the bundle
    handleSave = (event) => {
        localStorage.setItem(this.props.bundle.id, JSON.stringify(this.props.bundle));
    };

    // load a saved bundle
    handleLoad = (event) => {
        this.setState({open: true});
    };

    // delete a bundle from storage
    handleStoreDelete = (event) => {
        localStorage.clear();
    };

    // delete the selected sdo from the bundle
    handleDelete = (event) => {
        // delete the selected sdoid from the objList
        let witoutSdoid = this.state.objList.filter(sdo => sdo.id !== this.state.sdoId);
        this.setState({objList: witoutSdoid});
        // delete the selected sdoid from the parent bundle
        let indexToDelete = this.props.bundle.objects.findIndex(sdo => sdo.id === this.state.sdoId);
        if (indexToDelete !== -1) {
            this.props.bundle.objects.splice(indexToDelete, 1);
        }
        // tell the parent it has been deleted
        this.props.selected(this.state.sdoId, true);
    };

    handleEntering = () => {
        this.radioGroup.focus();
    };

    handleCancel = () => {
        this.setState({open: false});
    };

    handleOk = () => {
        this.setState({open: false});
        let theBundle = localStorage.getItem(this.state.loadSelection);
        if (theBundle !== null) {
            let bundleObj = JSON.parse(theBundle);
            Object.assign(this.props.bundle, bundleObj);
            this.props.update(bundleObj);
            this.setState({objList: bundleObj.objects});
        }
    };

    handleChange = (event, value) => {
        this.setState({loadSelection: value});
    };

    render() {
        return (
            <Grid container className={this.props.root} justify="flex-start">
                <FormControl component="fieldset" required>
                    <Typography type="body1" wrap style={{margin: 8}}> {this.title} </Typography>
                    <Button disabled={!this.props.canSend} onClick={this.handleSend} raised color="default"
                            style={{margin: 8}}>Send to server</Button>
                    <Button onClick={this.handleNew} raised color="default" style={{margin: 8}}>New bundle</Button>
                    <Button onClick={this.handleLoad} raised color="default" style={{margin: 8}}>Load bundle</Button>
                    <Button onClick={this.handleSave} raised color="default" style={{margin: 8}}>Save bundle</Button>
                    <Button onClick={this.handleStoreDelete} raised color="default" style={{margin: 8}}>Delete from store</Button>
                    <Button onClick={this.handleDelete} raised color="default" style={{margin: 8}}>Delete
                        selected object</Button>
                    <Divider/>
                    <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                aria-label="obj"
                                name="objGroup"
                                value={this.state.sdoId}
                                onChange={this.handleSelected}>
                        {this.asFormLabels()};
                    </RadioGroup>
                </FormControl>

                <Dialog
                    open={this.state.open}
                    transition={Slide}
                    ignoreBackdropClick
                    ignoreEscapeKeyUp
                    maxWidth="md"
                    onEntering={this.handleEntering}
                >
                    <DialogTitle>Select a bundle</DialogTitle>
                    <DialogContent>
                        <RadioGroup
                            innerRef={node => {
                                this.radioGroup = node
                            }}
                            aria-label="loadbundle"
                            name="loadbundle"
                            value={this.state.loadSelection}
                            onChange={this.handleChange}
                        >
                            {this.getAllFromStorage().map(option => (
                                <FormControlLabel value={option} key={option} control={<Radio/>} label={option}/>
                            ))}
                        </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">Cancel</Button>
                        <Button onClick={this.handleOk} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>

            </Grid>
        );
    };

};

BundlePanel.propTypes = {
    sdotype: PropTypes.string.isRequired,
    bundle: PropTypes.object.isRequired,
    selected: PropTypes.func.isRequired,
    canSend: PropTypes.bool.isRequired,
    update: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(BundlePanel));