/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import {commonStix} from '../stix/common.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import {BundleContent} from '../stix/bundleContent.js';
import PropTypes from "prop-types";

const styles = {};


/**
 * base class for stix types subclasses to extend.
 * Provide for all common functions and attributes editing, have to supply:
 * the stix default object (theStix) in the constructor and
 * in the subclass set the specific attributes (this.state.specific) of the stix type subclass.
 */
export class StixBase extends Component {

    constructor(props, theStix) {
        super(props);
        this.state = { display: false, stix: theStix, specific: '' };
        // make a copy of the initial default stix object
        this.defaultStix = JSON.parse(JSON.stringify(theStix));
    }

    // before leaving the component, update the store
    componentWillUnmount() {
        let theBundleArr = JSON.parse(localStorage.getItem('bundleList'));
        theBundleArr[localStorage.getItem('bundleSelected')] = this.props.bundle;
        localStorage.setItem('bundleList', JSON.stringify(theBundleArr));
    }

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
        // also update the field in the bundle object
        // first find the object in the bundle
        let objFound = this.props.bundle.objects.find(obj => obj.id === this.state.stix.id);
        if (objFound) {
            objFound[fieldName] = theValue;
        }
    };

    // callback for BundleContent
    // update the info display of the selected bundle object
    selectedObject = (sdoid, isDeleted) => {
        if (isDeleted) {
            this.setState({display: false, stix: this.defaultStix});
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
        if (this.state.display === true) {
            return (
                <Grid container className={this.props.root}>
                    <Grid item xs={3}>
                        <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={this.defaultStix}/>
                    </Grid>
                    <Grid item xs={9}>
                        {commonStix(this.state.stix, this.handleChange)}
                        {this.state.specific}
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container className={this.props.root}>
                    <Grid item xs={3}>
                        <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={this.defaultStix}/>
                    </Grid>
                </Grid>
            );
        }
    };

}

StixBase.propTypes = {
    bundle: PropTypes.object.isRequired
};

