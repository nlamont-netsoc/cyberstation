/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

//import { Router, Route, Switch } from 'react-router'
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
import Radio, { RadioGroup } from 'material-ui/Radio';
import Paper from 'material-ui/Paper';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

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
    padding: theme.spacing.unit * 3
  }
});


export class ServerPage extends Component {

  constructor(props) {
    super(props);
    this.state = { discovery: undefined };
  }

  listOfApiRoots(arr) {
    let items = [];
    if (arr !== undefined) {
      for (let j = 0; j < arr.length; j++) {
        items.push(<ListItemText key={j} primary={arr[j]} />);
      }
    }
    return items;
  };

  serverInfo() {
    if (this.state.discovery !== undefined) {
      return <List>
        <ListItemText key="a1" primary={this.state.discovery.title} />
        <ListItemText key="a2" primary={this.state.discovery.description} />
        <ListItemText key="a3" primary={this.state.discovery.contact} />
        <ListItemText key="a4" primary={this.state.discovery.default} />
        <List> {this.listOfApiRoots(this.state.discovery.api_roots)} </List>
      </List>;
    }
  };

  componentDidMount() {
    this.props.server.discovery().then(discovery => {
      this.setState({ discovery: discovery });
    });
  };
    
  render() {
    return (
      <div className={this.props.root}>
        <Grid container spacing={8}>

          <Grid item xs={12} sm={6}>
            <Typography type="body1" wrap>{this.props.server.conn.baseURL}</Typography>
            {this.serverInfo()}
          </Grid>

          <Grid item xs={12} sm={3}>

          </Grid>

        </Grid>
      </div>
    );
  };

};

ServerPage.propTypes = {
  server: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(ServerPage));