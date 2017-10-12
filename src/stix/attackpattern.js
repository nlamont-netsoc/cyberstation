/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import {commonStix} from '../stix/common.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import {BundleContent} from '../stix/bundleContent.js';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import AddKillPhase from './addKillPhase.js';

const styles = {};

const SDOTYPE = "attack-pattern";
/**
 * common attributes:
 * name, created, modify, revoked, confidence, lang, labels, created_by_ref,
 * object_marking_refs, external_references
 *
 * todo granular_markings
 */

let theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '', description: '', kill_chain_phases: []
};

/**
 * allows for add/delete/edit of attack patterns.
 */
export class AttackPatternPage extends Component {

    constructor(props) {
        super(props);
        let theBundleArr = JSON.parse(localStorage.getItem('bundleList'));
        let theBundle = theBundleArr[localStorage.getItem('bundleSelected')];
        if(theBundle) {
            this.state = {
                display: false,
                bundle: JSON.parse(JSON.stringify(theBundle)),  // make a deep copy of theBundle
                stix: JSON.parse(JSON.stringify(theStix))       // make a deep copy of theStix
            };
        }
    }

    // before leaving the component, update the store
    componentWillUnmount() {
        let theBundleArr = JSON.parse(localStorage.getItem('bundleList'));
        theBundleArr[localStorage.getItem('bundleSelected')] = this.state.bundle;
        localStorage.setItem('bundleList', JSON.stringify(theBundleArr));
    }

    stixDefault = () => {
        // make a deep copy of theStix
        let dstix = JSON.parse(JSON.stringify(theStix));
        dstix.revoked = false;
        dstix.created = moment().toISOString();
        dstix.modified = moment().toISOString();
        dstix.confidence = 0;
        dstix.lang = "en";
        return dstix;
    };

    updateBundleObject = (fieldName, value) => {
        // find the object in the bundle
        let objFound = this.state.bundle.objects.find(obj => obj.id === this.state.stix.id);
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
                let objFound = this.state.bundle.objects.find(obj => obj.id === sdoid);
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
                        <BundleContent selected={this.selectedObject} bundle={this.state.bundle} stix={defaultStix}/>
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
                        <BundleContent selected={this.selectedObject} bundle={this.state.bundle} stix={defaultStix}/>
                    </Grid>
                </Grid>
            );
        }
    };

    // attributes specific to attack-pattern objects
    specific() {
        return (
            <Grid>
                <form noValidate autoComplete="off">
                    <Grid key="b4" item>
                        <TextField style={{marginLeft: 8}}
                                   type="text"
                                   name="description"
                                   id="description"
                                   label="description"
                                   value={this.state.stix.description}
                                   margin="normal"
                                   onChange={this.handleChange('description')}
                                   fullWidth
                                   multiline
                                   rows="4"
                        />
                    </Grid>
                    <Grid key="a9" item>
                        <AddKillPhase title="Kill chain phases" itemList={this.state.stix.kill_chain_phases}
                                      update={this.handleChange('kill_chain_phases')}/>
                    </Grid>
                </form>
            </Grid>
        );
    };

}


