/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

import Grid from 'material-ui/Grid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
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

export class LogoutPage extends Component {

  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
  }

  handleLogout = value => {
    this.props.loggedin(false);
  };

  handleChange = username => event => {
    this.setState({ username: event.target.value });
  };

  render() {
    return (
      <Grid container className={this.props.root}>
        <Grid item xs={12}>
          <div style={{ height: 150, width: 150 }} />
        </Grid>

        <Grid item xs={12}>
          <Grid container className={this.props.container} justify="center" spacing={16}>
            <Typography type="body1">logged out</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <div style={{ height: 20, width: 20 }} />
        </Grid>

        <Grid item xs={12}>
          <Grid container className={this.props.container} justify="center" spacing={8}>
            <Button raised color="primary" style={{ margin: 16 }} className={this.props.button}
              onClick={this.handleLogout} >
              Ok
            </Button>                       
          </Grid>
        </Grid>

      </Grid>
    );
  };

}

LogoutPage.propTypes = {
  conn: PropTypes.object.isRequired,
  loggedin: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(LogoutPage));