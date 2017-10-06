/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';


const styles = {};

/**
 * to load/delete servers url from storage
 */
export class ServerPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storeOpen: false,       // to open the storeDialog for delete or load
            storeSelection: '',     // the store (load or delete) server url selection
            storeDelete: false,     // to select delete (true) or load (false) action in the store dialog
            urlList: [],            // the list of server url from localStorage
        }
    };

    // retrieve all url from storage as an array
    getAllFromStorage = () => {
        let storeContent = [];
        // get all the servers keys but not the bundles
        let keys = Object.keys(localStorage).filter(k => k.startsWith("server--"));
        for (let key of keys) {
            let url = localStorage.getItem(key);
            storeContent.push({name: url, key: key});
        }
        return storeContent;
    };

    handleChange = (event, value) => {
        this.setState({storeSelection: value});
    };

    handleOk = () => {
        this.setState({storeOpen: false});
        let theUrl = this.state.storeSelection;
        if (theUrl) {
            if (this.state.storeDelete) {
                // deleting
                localStorage.removeItem(theUrl);
                let withoutSelection = this.state.urlList.filter(item => item !== this.state.storeSelection);
                this.setState({urlList: withoutSelection, storeDelete: false});
            } else {
                // loading
                // tell the parent component to load the selected server url
                this.props.update(theUrl);
            }
        }
    };

    // show load a url from storage
    handleStoreLoad = () => {
        this.setState({storeOpen: true, storeDelete: false});
    };

    // show delete a url from storage
    handleStoreDelete = () => {
        this.setState({storeOpen: true, storeDelete: true});
    };

    handleCancel = () => {
        this.setState({storeOpen: false, storeDelete: false});
    };

    render() {
        const dialogTitle = this.state.storeDelete ? "Select a server to delete" : "Select a server to load";
        return (
            <Grid container justify="flex-start">
                <FormControl component="fieldset" required>
                    <Grid key="kk">
                        <Button aria-labelledby="load" onClick={this.handleStoreLoad} raised color="primary"
                                style={{margin: 4}}>Load</Button>
                        <Button aria-labelledby="delete" onClick={this.handleStoreDelete} raised color="primary"
                                style={{margin: 4}}>Delete</Button>
                    </Grid>
                </FormControl>

                <Dialog
                    open={this.state.storeOpen}
                    transition={Slide}
                    ignoreBackdropClick
                    ignoreEscapeKeyUp
                    maxWidth="md"
                >
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <RadioGroup
                            innerRef={node => {this.radioGroup = node}}
                            aria-label="storeurl"
                            name="storeurl"
                            value={this.state.storeSelection}
                            onChange={this.handleChange}
                        >
                            {this.getAllFromStorage().map(bndl => (
                                <FormControlLabel
                                    value={bndl.name}
                                    key={bndl.key}
                                    control={<Radio/>}
                                    label={bndl.name}/>
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

}

ServerPanel.propTypes = {
    update: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(ServerPanel));