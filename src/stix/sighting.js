/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import {commonStix} from '../stix/common.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import {BundleContent} from '../stix/bundleContent.js';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Button from 'material-ui/Button';
import Cached from 'material-ui-icons/Cached';
import AddPanel from '../components/addPanel.js';
import Switch from 'material-ui/Switch';
import {FormControlLabel} from 'material-ui/Form';
import PropTypes from "prop-types";
import uuidv4 from "uuid/v4";


const styles = {};

const SDOTYPE = "sighting";

/**
 * common:
 * name, created, modify, revoked, confidence, lang, labels, created_by_ref,
 * object_marking_refs, external_references
 *
 * todo granular_markings
 */

let theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '',
    first_seen: '', last_seen: '', sighting_of_ref: '', observed_data_refs: [],
    where_sighted_refs: [], summary: false, count: 0
};

export class SightingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {display: false, stix: this.stixDefault()};
    }

    // before leaving the component, update the store
    componentWillUnmount(){
        let theBundleArr = JSON.parse(localStorage.getItem('bundleList'));
        theBundleArr[localStorage.getItem('bundleSelected')] = this.props.bundle;
        localStorage.setItem('bundleList', JSON.stringify(theBundleArr));
    }

    stixDefault = () => {
        // make a deep copy of theStix
        let dstix = JSON.parse(JSON.stringify(theStix));
        dstix.id = SDOTYPE + "--" + uuidv4();
        dstix.revoked = false;
        dstix.created = moment().toISOString();
        dstix.modified = moment().toISOString();
        dstix.confidence = 0;
        dstix.lang = "en";
        return dstix;
    };

    updateBundleObject = (fieldName, value) => {
        // find the object in the bundle
        let objFound = this.props.bundle.objects.find(obj => obj.id === this.state.stix.id);
        if (objFound) {
            objFound[fieldName] = value;
        }
    };

    // change the state value of the given fieldName
    handleChange = fieldName => (event, checked) => {
        let theValue = event.target.value;
        // if event came from some switch
        if (checked === true || checked === false) theValue = checked;
        // change the individual field value of the stix
        this.setState((prevState) => {
            prevState.stix[fieldName] = theValue;
            return prevState;
        });
        // update the bundle object
        this.updateBundleObject(fieldName, theValue);
    };

    // update the info display of the selected bundle object
    selectedObject = (sdoid, isDeleted) => {
        if (isDeleted) {
            this.setState({display: false, stix: JSON.parse(JSON.stringify(theStix))});
        } else {
            if (sdoid) {
                // find the object with id=sdoid in the bundle
                let objFound = this.props.bundle.objects.find(obj => obj.id === sdoid);
                if (objFound) {
                    this.setState({display: true, stix: objFound});
                }
            }
        }
    };

    render() {
        // prepare a default stix object
        let defaultStix = this.stixDefault();
        if (this.state.display === true) {
            return (
                <Grid container className={this.props.root}>
                    <Grid item xs={3}>
                        <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={this.state.stix}/>
                    </Grid>
                    <Grid item xs={9}>
                        {commonStix(this.state.stix, this.handleChange)}
                        {this.specific()}
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container className={this.props.root}>
                    <Grid item xs={3}>
                        <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={this.state.stix}/>
                    </Grid>
                </Grid>
            );
        }
    };

    // attributes specific to sighting objects
    specific() {
        return (
            <Grid>
                <form noValidate autoComplete="off">
                    <Grid key="b4" item>
                        <TextField style={{marginLeft: 8, width: 210}}
                                   type="text"
                                   name="first_seen"
                                   id="first_seen"
                                   label="first_seen"
                                   value={this.state.stix.first_seen}
                                   margin="normal"
                                   onChange={this.handleChange('first_seen')}
                        />
                        <Button fab dense color="primary" style={{width: 33, height: 22}}
                                onClick={(e) => {
                                    this.handleChange('first_seen')({target: {value: moment().toISOString()}})
                                }}>
                            <Cached/>
                        </Button>

                        <TextField style={{marginLeft: 8, width: 210}}
                                   type="text"
                                   name="last_seen"
                                   id="last_seen"
                                   label="last_seen"
                                   value={this.state.stix.last_seen}
                                   margin="normal"
                                   onChange={this.handleChange('last_seen')}
                        />
                        <Button fab dense color="primary" style={{width: 33, height: 22}}
                                onClick={(e) => {
                                    this.handleChange('last_seen')({target: {value: moment().toISOString()}})
                                }}>
                            <Cached/>
                        </Button>
                    </Grid>
                    <Grid key="b6" item>
                        <TextField style={{marginLeft: 8}}
                                   type="text"
                                   name="sighting_of_ref"
                                   id="sighting_of_ref"
                                   label="sighting_of_ref"
                                   value={this.state.stix.sighting_of_ref}
                                   margin="normal"
                                   onChange={this.handleChange('sighting_of_ref')}
                                   fullWidth
                        />
                    </Grid>
                </form>

                <Grid key="a9" item>

                    <AddPanel title="Observed data refs" itemList={this.state.stix.observed_data_refs}
                              update={this.handleChange('observed_data_refs')}/>

                    <AddPanel title="Where sighted refs" itemList={this.state.stix.where_sighted_refs}
                              update={this.handleChange('where_sighted_refs')}/>
                </Grid>

                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.stix.summary}
                            onChange={this.handleChange('summary')}
                            aria-label="summary"
                        />
                    }
                    label="summary"
                    style={{padding: 22}}
                />
                <TextField style={{marginLeft: 8, width: 50}}
                           type="number"
                           name="count"
                           id="count"
                           label="count"
                           value={this.state.stix.count}
                           margin="normal"
                           onChange={this.handleChange('count')}
                           InputLabelProps={{shrink: true}}
                />
            </Grid>
        );
    };

}

SightingPage.propTypes = {
    bundle: PropTypes.object.isRequired
};
