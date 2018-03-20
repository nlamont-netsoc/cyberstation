/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak

import Grid from 'material-ui/Grid';
import React from 'react';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Button from 'material-ui/Button';
import Cached from 'material-ui-icons/Cached';
import AddKillPhase from './addKillPhase.js';
import Tooltip from 'material-ui/Tooltip';
import uuidv4 from "uuid/v4";
import {StixBase} from "./stixBase";



// the stix object type
const SDOTYPE = "indicator";

// a "indicator" stix object
let theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '',
    pattern: '', valid_from: '', valid_until: '', description: '', kill_chain_phases: []
};

// a default stix
let stixDefault = () => {
    // make a deep copy of theStix
    let dstix = JSON.parse(JSON.stringify(theStix));
    dstix.id = SDOTYPE + "--" + uuidv4();
    dstix.revoked = false;
    dstix.created = moment().toISOString();
    dstix.modified = moment().toISOString();
    dstix.valid_from = moment().toISOString();
    //  dstix.valid_until = moment().add(1, 'M').toISOString();
    dstix.confidence = 0;
    dstix.lang = "en";
    return dstix;
};

/**
 * allows for add/delete/edit of indicators.
 */
export class IndicatorPage extends StixBase {

    constructor(props) {
        super(props, stixDefault());
        this.state.specific = this.specific();
    }

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
                        <Tooltip id="tooltip-add" title="Renew the timestamp" placement="top" enterDelay={500}>
                            <Button variant="fab" dense="true" color="primary" aria-label="redo" style={{width: 33, height: 22}}
                                    onClick={(e) => {
                                        this.handleChange('valid_from')({target: {value: moment().toISOString()}})
                                    }}>
                                <Cached/>
                            </Button>
                        </Tooltip>
                        <TextField style={{marginLeft: 26, width: 210}}
                                   type="text"
                                   name="valid_until"
                                   id="valid_until"
                                   label="valid_until"
                                   value={this.state.stix.valid_until}
                                   margin="normal"
                                   onChange={this.handleChange('valid_until')}
                        />
                        <Tooltip id="tooltip-add" title="Renew the timestamp" placement="top" enterDelay={500}>
                            <Button variant="fab" dense="true" color="primary" aria-label="redo" style={{width: 33, height: 22}}
                                    onClick={(e) => {
                                        this.handleChange('valid_until')({target: {value: moment().toISOString()}})
                                    }}>
                                <Cached/>
                            </Button>
                        </Tooltip>
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
                    <Grid key="a9" item>
                        <AddKillPhase title="Kill chain phases" itemList={this.state.stix.kill_chain_phases}
                                      update={this.handleChange('kill_chain_phases')}/>
                    </Grid>
                </form>
            </Grid>
        );
    };

}
