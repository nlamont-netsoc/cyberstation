/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */


import { TaxiiConnect, Server } from '../libs/taxii2lib.js';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import withStyles from 'material-ui/styles/withStyles';
import withRoot from '../components/withRoot';

const styles = {
  root: {
    textAlign: 'center',
    paddingTop: 200
  }
};

const conn = new TaxiiConnect("https://test.freetaxii.com:8000", "user-me", "user-password");
const server = new Server("/taxii/", conn);


class Index extends Component {

  state = {
    open: false
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleClick = () => {
    server.discovery().then(discovery => {
      console.log("--> discovery \n" + JSON.stringify(discovery));
      this.setState({ value: JSON.stringify(discovery) });
    });
    this.setState({ open: true });
  };

  render() {
    return (
      <div className={this.props.classes.root}>

        <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
          <DialogTitle>to taxii server</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.state.value}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleRequestClose}>OK</Button>
          </DialogActions>
        </Dialog>

        <Typography type="display1" gutterBottom>Material-UI</Typography>
        <Typography type="subheading" gutterBottom>example project</Typography>

        <Button raised color="accent" onClick={this.handleClick}>Check taxii server</Button>

      </div>
    );
  }
};

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Index));
