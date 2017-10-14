/* eslint-disable flowtype/require-valid-file-annotation */

// @flow weak
import Grid from 'material-ui/Grid';
import React from 'react';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import {relationshipsNames} from "./stixutil";
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl} from 'material-ui/Form';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import uuidv4 from "uuid/v4";
import {StixBase} from "./stixBase";



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 12;

// the stix object type
const SDOTYPE = "relationship";

// a "relationship" stix object
let theStix = {
    name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
    created_by_ref: '', labels: [], confidence: '', external_references: [], lang: '',
    object_marking_refs: [], granular_markings: '', description: '',
    source_ref: '', relationship_type: '', target_ref: ''
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
 * allows for add/delete/edit of relationships.
 */
export class RelationShipPage extends StixBase {

    constructor(props) {
        super(props, stixDefault());
        this.state.specific = this.specific();
    }

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
