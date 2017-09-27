/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import { commonStix } from '../stix/common.js';
import { StixPage, styles } from '../stix/stixPage.js';
import { TabsView } from '../pages/tabsView.js';
import Grid from 'material-ui/Grid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import { BundleContent } from '../stix/bundleContent.js';
import TextField from 'material-ui/TextField';


const SDOTYPE = "relationship";
const theStix = {
  name: '', type: SDOTYPE, id: '', created: '', modified: '', revoked: '',
  created_by_ref: '', labels: '', confidence: '', external_references: '', lang: '',
  object_marking_refs: '', granular_markings: '',
  pattern: '', valid_from: '', valid_until: '', description: ''
};
const initialState = { display: false, stix: theStix };

export class RelationsPage extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  updateBundleObject = (fieldName, value) => {
    // find the object in the bundle
    let objFound = this.props.bundle.objects.find(obj => obj.id === this.state.stix.id);
    if (objFound !== undefined) {
      objFound[fieldName] = value;
    }
  };

  // change the state value of the given fieldName
  handleChange = fieldName => event => {
    event.persist();
    let theValue = event.target.value;
    // change the individual field of the stix
    this.setState((prevState) => {
      prevState.stix[fieldName] = theValue;
      return prevState;
    });
    // update the bundle object
    this.updateBundleObject(fieldName, theValue);
  };

  // attributes specific to indicator objects
  specific() {
    return (
      <Grid>
        <form noValidate autoComplete="off">
          <Grid key="b1" item>
            <TextField style={{ marginLeft: 8 }}
              name="pattern"
              id="pattern"
              label="pattern"
              value={this.state.stix.pattern}
              margin="normal"
              onChange={this.handleChange('pattern')}
              fullWidth
            />
          </Grid>
          <Grid key="b2" item>
            <TextField style={{ marginLeft: 8 }}
              name="valid_from"
              id="valid_from"
              label="valid_from"
              value={this.state.stix.valid_from}
              margin="normal"
              onChange={this.handleChange('valid_from')}
            />
            <TextField style={{ marginLeft: 8 }}
              name="valid_until"
              id="valid_until"
              label="valid_until"
              value={this.state.stix.valid_until}
              margin="normal"
              onChange={this.handleChange('valid_until')}
            />
          </Grid>
          <Grid key="b4" item>
            <TextField style={{ marginLeft: 8 }}
              name="description"
              id="description"
              label="description"
              value={this.state.stix.description}
              margin="normal"
              onChange={this.handleChange('description')}
            />
          </Grid>
        </form>
      </Grid>
    );
  };

  // update the info display of the selected bundle object
  selectedObject = (sdoid, isDeleted) => {
    if (isDeleted) {
      this.setState(initialState);
    } else {
      if (sdoid !== undefined && sdoid !== '') {
        // find the object with id=sdoid in the bundle
        let objFound = this.props.bundle.objects.find(obj => obj.id === sdoid);
        if (objFound !== undefined) {
          this.setState({ display: true, stix: objFound });
        }
      }
    }
  };

  render() {
    if (this.state.display === true) {
      return (
        <Grid container className={this.props.root}>
          <Grid item xs={3}>
            <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={theStix} />
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
            <BundleContent selected={this.selectedObject} bundle={this.props.bundle} stix={theStix} />
          </Grid>
        </Grid>
      );
    }
  };

};

RelationsPage.propTypes = {
  server: PropTypes.object.isRequired,
  bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(RelationsPage));

