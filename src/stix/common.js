import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import green from 'material-ui/colors/green';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import moment from 'moment';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import Cached from 'material-ui-icons/Cached';
import uuidv4 from 'uuid/v4';




export const commonStix = (state, handler) => {

  //  let redoId = e => {
  //    let event = {target: {value: state.type + "--" + uuidv4()}};
  //    handler('id')(event);
  //};

  return (
    <Grid>
      <form noValidate autoComplete="off">
        <Grid key="a0" item>
          <TextField style={{ marginLeft: 8 }}
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
          <TextField style={{ marginLeft: 8 }}
            type="text"
            name="id"
            id="id"
            label="id"
            value={state.id}
            margin="normal"
            onChange={handler('id')}
            style={{ width: 460 }}
          />
          <Button fab dense color="primary" aria-label="redo" style={{width: 33, height: 22}}
            onClick={(e) => { handler('id')({ target: { value: state.type + "--" + uuidv4() } }) }}>
            <Cached />
          </Button>
        </Grid>
        <Grid key="a2" item>
          <TextField style={{ marginLeft: 8 }}
            type="datetime-local"
            name="created"
            id="created"
            label="created"
            value={state.created}
            margin="normal"
            onChange={handler('created')}
          />
          <TextField style={{ marginLeft: 8 }}
            type="datetime-local"
            name="modified"
            id="modified"
            label="modified"
            value={state.modified}
            margin="normal"
            onChange={handler('modified')}
          />

          <TextField style={{ marginLeft: 8, width: 80 }}
            type="number"
            name="confidence"
            id="confidence"
            label="confidence"
            value={state.confidence}
            margin="normal"
            onChange={handler('confidence')}
          />
          <TextField style={{ marginLeft: 8, width: 40 }}
            type="text"
            name="lang"
            id="lang"
            label="lang"
            value={state.lang}
            margin="normal"
            onChange={handler('lang')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.revoked}
                onChange={handler('revoked')}
                aria-label="revoked"
              />
            }
            label="revoked"
            style={{ padding: 22 }}
          />
        </Grid>
        <Grid key="a4" item>
          <TextField style={{ marginLeft: 8 }}
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
          <TextField style={{ marginLeft: 8 }}
            name="external_references"
            id="external_references"
            label="external_references"
            value={state.external_references}
            margin="normal"
            onChange={handler('external_references')}
          />
          <TextField style={{ marginLeft: 8 }}
            name="object_marking_refs"
            id="object_marking_refs"
            label="object_marking_refs"
            value={state.object_marking_refs}
            margin="normal"
            onChange={handler('object_marking_refs')}
          />
        </Grid>
      </form>
    </Grid>
  );
};

export default commonStix;
