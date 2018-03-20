/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import Grid from 'material-ui/Grid';
import React from 'react';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Button from 'material-ui/Button';
import Cached from 'material-ui-icons/Cached';
import AddPanel from '../components/addPanel.js';
import Switch from 'material-ui/Switch';
import {FormControlLabel} from 'material-ui/Form';
import uuidv4 from "uuid/v4";
import {StixBase} from "./stixBase";



// the stix object type
const SDOTYPE = "sighting";

// a "sighting" stix object
let theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '',
    first_seen: '', last_seen: '', sighting_of_ref: '', observed_data_refs: [],
    where_sighted_refs: [], summary: false, count: 0
};

// a default stix
let stixDefault = () => {
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


/**
 * allows for add/delete/edit of sightings.
 */
export class SightingPage extends StixBase {

    constructor(props) {
        super(props, stixDefault());
        this.state.specific = this.specific();
    }

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
                        <Button variant="fab" dense="true" color="primary" style={{width: 33, height: 22}}
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
                        <Button variant="fab" dense="true" color="primary" style={{width: 33, height: 22}}
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
