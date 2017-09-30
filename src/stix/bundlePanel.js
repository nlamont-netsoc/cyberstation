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
        this.state = {sdoId: '', objList: []};
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

    // send the bundle to the server
    handleSend = (event) => {

    };

    // save the draft bundle
    handleSave = (event) => {

    };

    // load a saved draft bundle
    handleSave = (event) => {

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

    render() {
        return (
            <Grid container className={this.props.root} justify="flex-start">
                <FormControl component="fieldset" required>
                    <Typography type="body1" wrap style={{margin: 8}}> {this.title} </Typography>
                    <Button disabled={!this.props.canSend} onClick={this.handleSend} raised color="default" style={{margin: 8}}>Send to server</Button>
                    <Button onClick={this.handleLoad} raised color="default" style={{margin: 8}}>Load draft</Button>
                    <Button onClick={this.handleSave} raised color="default" style={{margin: 8}}>Save draft</Button>
                    <Button onClick={this.handleDelete} raised color="default" style={{margin: 8}}>Delete
                        selected</Button>
                    <Divider/>
                    <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                aria-label="obj"
                                name="objGroup"
                                value={this.state.sdoId}
                                onChange={this.handleSelected}>
                        {this.asFormLabels()};
                    </RadioGroup>
                </FormControl>
            </Grid>
        );
    };

};

BundlePanel.propTypes = {
    sdotype: PropTypes.string.isRequired,
    bundle: PropTypes.object.isRequired,
    selected: PropTypes.func.isRequired,
    canSend: PropTypes.bool.isRequired
};

export default withRoot(withStyles(styles)(BundlePanel));