/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-multi-comp */

import { ServerPage } from '../pages/servers.js';
import { TaxiiConnect, Server } from '../libs/taxii2lib.js';

import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import AppBar from 'material-ui/AppBar';


function TabContainer(props) {
  return <div>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    position: 'fixed',
    marginTop: 60,
    width: '100%',
    marginLeft: 1,
    order: 1
  }
});

export class TabsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      serverContent: "",
      collectionsContent: "",
      objectsContent: ""
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    return (
      <div  >
        <AppBar position="static" marginTop="60">
          <Tabs value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth >
            <Tab label="Servers" />
            <Tab label="Collections" />
            <Tab label="Objects" />
          </Tabs>
        </AppBar>

        <SwipeableViews index={this.state.value} onChangeIndex={this.handleChangeIndex}>
          <TabContainer> <ServerPage /> </TabContainer>
          <TabContainer>{'Collections'}</TabContainer>
          <TabContainer>{'Objects'}</TabContainer>
        </SwipeableViews>

      </div>
    );
  };

};

TabsView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TabsView);
//export default withRoot(withStyles(styles)(TabsView));

