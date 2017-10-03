/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {commonStix} from '../stix/common.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import {BundleContent} from '../stix/bundleContent.js';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Button from 'material-ui/Button';
import Cached from 'material-ui-icons/Cached';


const styles = {};

const SDOTYPE = "indicator";

//  kill_chain_phases: Option[List[KillChainPhase]] = None,
//  KillChainPhase(kill_chain_name: String, phase_name: String)

var theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '',
    pattern: '', valid_from: '', valid_until: '', description: ''
};

export class IndicatorPage extends Component {

    constructor(props) {
        super(props);
        // make a deep copy of theStix
        this.state = {display: false, stix: JSON.parse(JSON.stringify(theStix))};
    }

    stixDefault = () => {
        // make a deep copy of theStix
        let dstix = JSON.parse(JSON.stringify(theStix));
        dstix.revoked = false;
        dstix.created = moment().toISOString();
        dstix.modified = moment().toISOString();
        dstix.valid_from = moment().toISOString();
        //  dstix.valid_until = moment().add(1, 'M').toISOString();
        dstix.confidence = 0;
        dstix.lang = "en";
        return dstix;
    };

    updateBundleObject = (fieldName, value) => {
        // find the object in the bundle
        let objFound = this.props.bundle.objects.find(obj => obj.id === this.state.stix.id);
        if (objFound !== undefined) {
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
            if (sdoid !== undefined && sdoid !== '') {
                // find the object with id=sdoid in the bundle
                let objFound = this.props.bundle.objects.find(obj => obj.id === sdoid);
                if (objFound !== undefined) {
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
                    <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={defaultStix}/>
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
                    <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={defaultStix}/>
                  </Grid>
                </Grid>
            );
        }
    };

    // attributes specific to indicator objects
    specific() {
        return (
            <Grid>
              <form noValidate autoComplete="off">
                <Grid key="b1" item>
                  <TextField style={{marginLeft: 8}}
                             type="text"
                             name="pattern"
                             id="pattern"
                             label="pattern"
                             value={this.state.stix.pattern}
                             margin="normal"
                             onChange={this.handleChange('pattern')}
                             fullWidth
                             multiline
                             rows="2"
                  />
                </Grid>
                <Grid key="b2" item>

                  <TextField style={{marginLeft: 8, width: 210}}
                             type="text"
                             name="valid_from"
                             id="valid_from"
                             label="valid_from"
                             value={this.state.stix.valid_from}
                             margin="normal"
                             onChange={this.handleChange('valid_from')}
                  />
                  <Button fab dense color="primary" aria-label="redo" style={{width: 33, height: 22}}
                          onClick={(e) => {
                              this.handleChange('valid_from')({target: {value: moment().toISOString()}})
                          }}>
                    <Cached/>
                  </Button>
                  <TextField style={{marginLeft: 26, width: 210}}
                             type="text"
                             name="valid_until"
                             id="valid_until"
                             label="valid_until"
                             value={this.state.stix.valid_until}
                             margin="normal"
                             onChange={this.handleChange('valid_until')}
                  />
                  <Button fab dense color="primary" aria-label="redo" style={{width: 33, height: 22}}
                          onClick={(e) => {
                              this.handleChange('valid_until')({target: {value: moment().toISOString()}})
                          }}>
                    <Cached/>
                  </Button>

                </Grid>
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
              </form>
            </Grid>
        );
    };

}

IndicatorPage.propTypes = {
    server: PropTypes.object.isRequired,
    bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(IndicatorPage));

