/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

//import { Router, Route, Switch } from 'react-router'
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

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});


export class ObjectsPage extends Component {

  constructor(props) {
    super(props);
    this.state = { value: ""};
  }

  listOfItems(n) {
    let items = [];
    for (let j = 0; j < n; j++) {
      items.push(<ListItem dense button key={j}>
        <Checkbox tabIndex={-1} />
        <ListItemText key={j} primary={`Objects ${j}  `} />
      </ListItem>);
    }
    return items;
  };

  render() {
    return (
      <Grid container className={this.props.root}>

        <Grid item xs={6}>
          <Grid container className={this.props.root} justify="center">
            <List> {this.listOfItems(22)} </List>
          </Grid>
        </Grid>

      </Grid>
    );
  };

};

ObjectsPage.propTypes = {
  server: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(ObjectsPage));