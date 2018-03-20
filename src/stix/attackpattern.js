/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak
import Grid from 'material-ui/Grid';
import React from 'react';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import AddKillPhase from './addKillPhase.js';
import uuidv4 from "uuid/v4";
import {StixBase} from './stixBase.js';



// the stix object type
const SDOTYPE = "attack-pattern";

// a "attack-pattern" stix object
let theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '', description: '', kill_chain_phases: []
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
    dstix.object_marking_refs = [];
    return dstix;
};

/**
 * allows for add/delete/edit of attack patterns.
 */
export class AttackPatternPage extends StixBase {

    constructor(props) {
        super(props, stixDefault());
        this.state.specific = this.specific();
    }

    // attributes specific to attack-pattern objects
    specific = () => {
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
