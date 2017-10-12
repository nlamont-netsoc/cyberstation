/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-multi-comp */
import {viewStyle} from '../styles/viewStyle.js';
import Tabs, {Tab} from 'material-ui/Tabs';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IndicatorPage} from '../stix/indicator.js';
import {BundlePage} from '../stix/bundle.js';
import {RelationShipPage} from '../stix/relations.js';
import {AttackPatternPage} from '../stix/attackpattern.js';
import {SightingPage} from '../stix/sighting.js';


function TabContainer(props) {
    return <div style={{padding: 6}}>{props.children}</div>;
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: theme.spacing.unit * 30,
        backgroundColor: theme.palette.background.paper
    },
    appBar: {
        position: 'fixed',
        marginTop: 50,
        width: '100%',
        marginLeft: 1,
        order: 1
    }
});

/**
 * shows the bundle and all stix types tabs
 */
export class StixView extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 0, server: this.props.server, hasBundle: true};
    }

    // initialise the state
    componentDidMount() {
        let haveBundle = localStorage.getItem('bundleSelected') ? true : false;
        this.setState({value: 0, server: this.props.server, hasBundle: haveBundle});
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({server: newProps.server});
    };

    handleChange = (event, value) => {
        this.setState({value: value});
    };

    // update from the BundlePage, is for the case where all bundles have been deleted.
    // if false means no bundle is selected, true there is a selected bundle
    // Use to disable the sdo pages, see below
    handleBundleUpdate = (value) => {
        this.setState({hasBundle: value});
    };

    render() {
        return (
            <div>

                <div style={viewStyle.tabs}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="orchid"
                        textColor="inherit"
                        fullWidth
                        scrollable
                        scrollButtons="auto">
                        <Tab label="Bundle"/>
                        <Tab label="Attack Pattern"/>
                        <Tab label="Relationship"/>
                        <Tab label="Indicator"/>
                        <Tab label="Sighting"/>
                        <Tab label="Malware"/>
                        <Tab label="Campaign"/>
                        <Tab label="Course of Action"/>
                        <Tab label="Identity"/>
                        <Tab label="Intrusion Set"/>
                        <Tab label="Observed Data"/>
                        <Tab label="Report"/>
                        <Tab label="Threat Actor"/>
                        <Tab label="Tool"/>
                        <Tab label="Vulnerability"/>
                    </Tabs>
                </div>

                <div style={viewStyle.content}>
                    {this.state.value === 0 && <TabContainer><BundlePage update={this.handleBundleUpdate} server={this.state.server}/></TabContainer>}
                    {this.state.hasBundle && this.state.value === 1 && <TabContainer><AttackPatternPage /></TabContainer>}
                    {this.state.hasBundle && this.state.value === 2 && <TabContainer><RelationShipPage /></TabContainer>}
                    {this.state.hasBundle && this.state.value === 3 && <TabContainer><IndicatorPage /></TabContainer>}
                    {this.state.hasBundle && this.state.value === 4 && <TabContainer><SightingPage /></TabContainer>}
                    {this.state.hasBundle && this.state.value === 5 && <TabContainer>{'Malware'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 6 && <TabContainer>{'Campaign'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 7 && <TabContainer>{'Course of Action'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 8 && <TabContainer>{'Identity'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 9 && <TabContainer>{'Intrusion Set'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 10 && <TabContainer>{'Observed Data'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 11 && <TabContainer>{'Report'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 12 && <TabContainer>{'Threat Actor'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 13 && <TabContainer>{'Tool'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 14 && <TabContainer>{'Vulnerability'}</TabContainer>}
                </div>

            </div>
        );
    };

}

StixView.propTypes = {
    server: PropTypes.object
};

