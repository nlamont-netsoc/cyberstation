/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import { StixPage, styles } from '../stix/stixPage.js';
import { TabsView } from '../pages/tabsView.js';
import { TaxiiConnect, Server } from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import uuidv4 from 'uuid/v4';
import { BundlePanel } from '../stix/bundlePanel.js';
import TextField from 'material-ui/TextField';


export class BundlePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      objList: [],
      info: '',
      bundle: { type: '', id: '', spec_version: '', objects: [] }
    };
  }

  // initialise this state with the prop.bundle
  componentDidMount() {
    Object.assign(this.state.bundle, this.props.bundle);
    this.forceUpdate();
  };

  handleChange = name => event => {
    // copy the new value to the parent bundle
    Object.assign(this.props.bundle, this.props.bundle, { [name]: event.target.value });
    // copy the new value to this state bundle
    Object.assign(this.state.bundle, this.state.bundle, { [name]: event.target.value });
    // update the state
    this.forceUpdate();
  };

  selectedObject = (sdoid, isDeleted) => {

  };

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={3}>
          <BundlePanel bundle={this.props.bundle} sdotype='' selected={this.selectedObject} />
        </Grid>

        <Grid item xs={9}>

          <Grid>
            <form noValidate autoComplete="off">
              <Grid key="bundle1" item>
                <TextField style={{ marginLeft: 8 }}
                  name="spec_version"
                  id="spec_version"
                  label="spec_version"
                  className={this.props.textField}
                  value={this.state.bundle.spec_version}
                  margin="normal"
                  onChange={this.handleChange('spec_version')}
                />
              </Grid>
              <Grid key="bundle2" item>
                <TextField style={{ marginLeft: 8 }}
                  name="id"
                  id="id"
                  label="id"
                  className={this.props.textField}
                  value={this.state.bundle.id}
                  margin="normal"
                  onChange={this.handleChange('id')}
                  fullWidth
                />
              </Grid>
            </form>
          </Grid>

          <Grid item xs={12}>
            <Typography type="body1" wrap style={{ margin: 12 }}> {this.state.info} </Typography>
          </Grid>

        </Grid>
      </Grid>
    );
  };

};

BundlePage.propTypes = {
  server: PropTypes.object.isRequired,
  bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(BundlePage));