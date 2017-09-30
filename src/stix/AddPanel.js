/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Button from 'material-ui/Button';
import uuidv4 from 'uuid/v4';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';


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

export class AddPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {success: false, loading: true, objList: []};
    }

    // fill the list with the filtered objects of the bundle
    componentDidMount() {
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
        let newBundle = {
            name: "new bundle",
            type: "bundle",
            id: "bundle--" + uuidv4(),
            spec_version: "2.0",
            objects: []
        };
        Object.assign(this.props.bundle, newBundle);
        this.props.update(newBundle);
        this.setState({objList: newBundle.objects});
    };

    // send the bundle to the server
    handleSend = (event) => {
        // must remove the name from the bundle object
    };

    // retrieve all bundles from storage as a Map
    getMapFromStorage = () => {
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
            let bndl = JSON.parse(localStorage.getItem(key));
            storeContent.push({name: bndl.name, key: key});
        }
        return storeContent;
    };

    // save the bundle
    handleSave = (event) => {
        localStorage.setItem(this.props.bundle.id, JSON.stringify(this.props.bundle));
    };

    // load a saved bundle
    handleLoad = (event) => {
        this.setState({loadOpen: true});
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
        this.setState({loadOpen: false});
    };

    handleOk = () => {
        this.setState({loadOpen: false});
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
                    <Button disabled={!this.props.canSend} onClick={this.handleSend} raised color="primary"
                            style={{margin: 8}}>Send to server</Button>

                    <Grid key="kk">
                        <Grid key="k1" >
                            <Button onClick={this.handleNew} raised color="primary" style={{margin: 8}}>New</Button>
                            <Button onClick={this.handleLoad} raised color="primary" style={{margin: 8}}>Load</Button>
                        </Grid>
                        <Grid key="k2">
                            <Button onClick={this.handleSave} raised color="primary" style={{margin: 8}}>Save</Button>
                            <Button onClick={this.handleStoreDelete} raised color="primary" style={{margin: 8}}>Delete</Button>
                        </Grid>

                    </Grid>

                    {/*<Button onClick={this.handleDelete} raised color="default" style={{margin: 8}}>Delete*/}
                        {/*selected object</Button>*/}
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
                    open={this.state.loadOpen}
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
                            {this.getAllFromStorage().map(bndl => (
                                <FormControlLabel
                                    value={bndl.key}
                                    key={bndl.key}
                                    control={<Radio/>}
                                    label={bndl.name + " " + bndl.key}/>
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
/*
// fo scrolling the list
<Paper style={{maxHeight: 200, overflow: 'auto'}}>
  <List>
   ...
  </List>
</Paper>
 */
AddPanel.propTypes = {
    sdotype: PropTypes.string.isRequired,
    update: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(AddPanel));