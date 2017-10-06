/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-multi-comp */
import {viewStyle} from '../styles/viewStyle.js';
import {CollectionsPage} from '../server/collections.js';
import {ServersPage} from '../server/servers.js';
import Tabs, {Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import React, {Component, StyleSheet} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';



function TabContainer(props) {
    return <div style={{padding: 6}}>{props.children}</div>;
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 30,
        padding: theme.spacing.unit * 12,
        backgroundColor: theme.palette.background.paper
    },
    tabs: {
        position: 'fixed',
        top: 52,
        zIndex: 1,
        padding: theme.spacing.unit * 12,
        marginTop: theme.spacing.unit * 2
    }
});

/**
 * show the server and collections tabs
 */
export class ServerView extends Component {

    constructor(props) {
        super(props);
        this.state = { value: 0, server: undefined };
    }

    updateServer = (server) => {
        this.setState({server: server});
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    handleChangeIndex = index => {
        this.setState({value: index});
    };

    render() {
        return (
            <div className={this.props.root}>
                <div style={viewStyle.tabs}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="orchid"
                        textColor="inherit"
                        fullWidth>
                        <Tab label="Servers"/>
                        <Tab label="Collections"/>
                    </Tabs>
                </div>

                <SwipeableViews style={viewStyle.content} index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}>
                    <TabContainer> <ServersPage update={this.updateServer} /> </TabContainer>
                    <TabContainer> <CollectionsPage server={this.state.server} /> </TabContainer>
                </SwipeableViews>
            </div>
        );
    };

}

export default withRoot(withStyles(styles)(ServerView));
