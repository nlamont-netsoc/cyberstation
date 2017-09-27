/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

//import { Router, Route, Switch } from 'react-router'
import { viewStyle } from '../styles/viewStyle.js';
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
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  paper: {
    height: 140,
    width: 100
  }
});

export class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = { name: "", psw: "" };
  }

  handleLogin = value => {
    this.props.loggedin(true);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <Grid container className={this.props.root}>
        <Grid item xs={12}>
          <div style={{ height: 150, width: 150 }} />
        </Grid>

        <Grid item xs={12}>
          <Grid container className={this.props.container} justify="center" spacing={16}>
            <form className={this.props.container} noValidate autoComplete="off">
              <Grid key="namekey" item>
                <TextField
                  id="name"
                  label="User name"
                  className={this.props.textField}
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                  margin="normal"
                />
              </Grid>
              <Grid key="pswkey" item>
                <TextField
                  id="password"
                  label="Password"
                  className={this.props.textField}
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                />
              </Grid>
            </form>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <div style={{ height: 20, width: 20 }} />
        </Grid>

        <Grid item xs={12}>
          <Grid container className={this.props.container} justify="center" spacing={8}>
            <Button raised color="primary" style={{ margin: 16 }} className={this.props.button}
              onClick={this.handleLogin} >
              Submit
            </Button>
          </Grid>
        </Grid>

      </Grid>
    );
  };

};

LoginPage.propTypes = {
  conn: PropTypes.object.isRequired,
  loggedin: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(LoginPage));