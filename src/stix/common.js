import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Input, {InputLabel} from 'material-ui/Input';
import {FormControl, FormHelperText} from 'material-ui/Form';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import green from 'material-ui/colors/green';
import Switch from 'material-ui/Switch';
import {FormControlLabel} from 'material-ui/Form';
import moment from 'moment';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import Cached from 'material-ui-icons/Cached';
import uuidv4 from 'uuid/v4';
import {labelsNames} from '../stix/stixutil.js';


export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 12;

export const commonStix = (state, handler) => {

    //  let redoId = e => {
    //    let event = {target: {value: state.type + "--" + uuidv4()}};
    //    handler('id')(event);
    // };

    // let redoTime = fieldName => {
    //     let event = {target: {value: moment().toISOString()}};
    //     handler(fieldName)(event);
    // };
    //
    // let handleDateTime = fieldName => (event) => {
    //     // let newEvent = {target: {value: state.type + "--" + uuidv4()}};
    //     let v = moment().toISOString();
    //     console.log("-->v=" + v);
    //     event.target.value = v;
    //     console.log("-->event.target.value=" + event.target.value);
    //     handler('fieldName')(event);
    // };
    //
    // let asLocalDateTime = (iso) => {
    //     let theValue = moment(iso).toLocaleString();
    //     console.log("-->theValue=" + theValue);
    //     return theValue;
    // };

    return (
        <Grid>
            <form noValidate autoComplete="off">
                <Grid key="a0" item>
                    <TextField style={{marginLeft: 8}}
                               name="name"
                               type="text"
                               id="name"
                               label="name"
                               value={state.name}
                               margin="normal"
                               onChange={handler('name')}
                               fullWidth
                    />
                </Grid>

                <Grid key="a1" item>
                    <TextField style={{marginLeft: 8, width: 210}}
                               type="text"
                               name="created"
                               id="created"
                               label="created"
                               value={state.created}
                               margin="normal"
                               onChange={handler('created')}
                    />
                    <Button fab dense color="primary" aria-label="redo" style={{width: 33, height: 22}}
                            onClick={(e) => {
                                handler('created')({target: {value: moment().toISOString()}})
                            }}>
                        <Cached/>
                    </Button>

                    <TextField style={{marginLeft: 26, width: 210}}
                               type="text"
                               name="modified"
                               id="modified"
                               label="modified"
                               value={state.modified}
                               margin="normal"
                               onChange={handler('modified')}
                    />
                    <Button fab dense color="primary" aria-label="redo" style={{width: 33, height: 22}}
                            onClick={(e) => {
                                handler('modified')({target: {value: moment().toISOString()}})
                            }}>
                        <Cached/>
                    </Button>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.revoked}
                                onChange={handler('revoked')}
                                aria-label="revoked"
                            />
                        }
                        label="revoked"
                        style={{padding: 22}}
                    />
                </Grid>

                <Grid key="a2" item>
                    <TextField style={{marginLeft: 8, width: 50}}
                               type="number"
                               name="confidence"
                               id="confidence"
                               label="conf"
                               value={state.confidence}
                               margin="normal"
                               onChange={handler('confidence')}
                               InputLabelProps={{shrink: true}}
                    />
                    <TextField style={{marginLeft: 20, width: 100}}
                               type="text"
                               name="lang"
                               id="lang"
                               label="lang"
                               value={state.lang}
                               margin="normal"
                               onChange={handler('lang')}
                    />

                    <FormControl style={{marginLeft: 20, top: 3}}>
                        <InputLabel htmlFor="labels-multiple">Labels</InputLabel>
                        <Select
                            style={{width: 550}}
                            multiple
                            value={state.labels}
                            onChange={handler('labels')}
                            input={<Input id="labels-multiple"/>}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                        width: 200,
                                    },
                                },
                            }}
                        >
                            {labelsNames.map(name => (
                                <MenuItem key={name} value={name}
                                          style={{
                                              fontWeight: state.labels.indexOf(name) !== -1 ? '500' : '400',
                                          }}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>

                <Grid key="a4" item>
                    <TextField style={{marginLeft: 8}}
                               type="text"
                               name="created_by_ref"
                               id="created_by_ref"
                               label="created_by_ref"
                               value={state.created_by_ref}
                               margin="normal"
                               onChange={handler('created_by_ref')}
                               fullWidth
                    />
                </Grid>
                <Grid key="a5" item>
                    <TextField style={{marginLeft: 8}}
                               type="text"
                               name="external_references"
                               id="external_references"
                               label="external_references"
                               value={state.external_references}
                               margin="normal"
                               onChange={handler('external_references')}
                               fullWidth
                    />
                </Grid>
                <Grid key="a6" item>
                    <TextField style={{marginLeft: 8}}
                               type="text"
                               name="object_marking_refs"
                               id="object_marking_refs"
                               label="object_marking_refs"
                               value={state.object_marking_refs}
                               margin="normal"
                               onChange={handler('object_marking_refs')}
                               fullWidth
                    />
                </Grid>
            </form>
        </Grid>
    );
};

export default commonStix;
