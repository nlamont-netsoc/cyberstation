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
import {Server, TaxiiConnect} from "../libs/taxii2lib";


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

// for testing --> todo to be removed
const testServer = new Server("/taxii/", new TaxiiConnect("https://test.freetaxii.com:8000", "user-me", "user-password"));

/**
 * presenting the server and collections tabs
 */
export class ServerView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            server: testServer,
            apiroot: '',
            collection: ''
        };
    }

    componentDidMount() {
        this.setState({server: testServer});
        this.updateServer(testServer, false)
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    handleChangeIndex = index => {
        this.setState({value: index});
    };

    updateServer = (server, isDeleted) => {
        this.setState({server: server});
        // tell the parent about the selected server
        this.props.update(server);
    };

    updateApiRoot = apiroot => {
        this.setState({apiroot: apiroot});
    };

    updateCollection = col => {
        this.setState({collection: col});
        // tell the parent about the selected collection
        this.props.updateCollection(col);
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
                    <TabContainer>
                        <ServersPage update={this.updateServer} apiroot={this.updateApiRoot}/>
                    </TabContainer>
                    <TabContainer>
                        <CollectionsPage collection={this.updateCollection} server={this.state.server} apiroot={this.state.apiroot}/>
                    </TabContainer>
                </SwipeableViews>
            </div>
        );
    };

}

ServerView.propTypes = {
    update: PropTypes.func.isRequired,
    updateCollection: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(ServerView));
