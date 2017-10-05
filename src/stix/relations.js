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
import {relationshipsNames} from "./stixutil";
import {FormControlLabel} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';


export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 12;

const styles = {};

const SDOTYPE = "relationship";

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
    object_marking_refs: [], granular_markings: '', description: '',
    source_ref: '', relationship_type: '', target_ref: ''
};

export class RelationShipPage extends Component {

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

    // attributes specific to relationship objects
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
                    <Grid key="b5" item>
                        <TextField style={{marginLeft: 8}}
                                   type="text"
                                   name="source_ref"
                                   id="source_ref"
                                   label="source_ref"
                                   value={this.state.stix.source_ref}
                                   margin="normal"
                                   onChange={this.handleChange('source_ref')}
                                   fullWidth
                        />
                    </Grid>
                    <Grid key="b6" item>
                        <FormControl style={{marginLeft: 8, top: 3}}>
                            <InputLabel htmlFor="relationships">Relationship type</InputLabel>
                            <Select
                                style={{width: 200}}
                                value={this.state.stix.relationship_type}
                                onChange={this.handleChange('relationship_type')}
                                input={<Input id="relationships"/>}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                            width: 200,
                                        },
                                    },
                                }}
                            >
                                {relationshipsNames.map(name => (
                                    <MenuItem key={name} value={name} style={{fontWeight: '500'}}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid key="b7" item>
                        <TextField style={{marginLeft: 8}}
                                   type="text"
                                   name="target_ref"
                                   id="target_ref"
                                   label="target_ref"
                                   value={this.state.stix.target_ref}
                                   margin="normal"
                                   onChange={this.handleChange('target_ref')}
                                   fullWidth
                        />
                    </Grid>
                </form>
            </Grid>
        );
    };

}

RelationShipPage.propTypes = {
    bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(RelationShipPage));


