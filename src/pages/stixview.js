/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-multi-comp */
import Tabs, {Tab} from 'material-ui/Tabs';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IndicatorPage} from '../stix/indicator.js';
import {BundlePage} from '../stix/bundle.js';
import {RelationShipPage} from '../stix/relations.js';
import {AttackPatternPage} from '../stix/attackpattern.js';
import {SightingPage} from '../stix/sighting.js';
import {getThemeColor} from "../stix/stixutil";


function TabContainer(props) {
    return <div style={{padding: 6}}>{props.children}</div>;
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

const styles = {
    root: {
        flexGrow: 1,
        width: '100%',
    //    marginTop: theme.spacing.unit * 30,
    //    backgroundColor: theme.palette.background.paper
    },
    appBar: {
        position: 'fixed',
        marginTop: 50,
        width: '100%',
        marginLeft: 1,
        order: 1
    },
    content: {
        marginTop: 74,
        top: 74
    }
};

/**
 * shows the BUNDLE and all STIX types tabs
 */
export class StixView extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 0, server: this.props.server, bundle: undefined, hasBundle: false};
    }

    // initialise the state
    componentDidMount() {
        let bndlList = JSON.parse(localStorage.getItem('bundleList')) || [];
        let theBundle = bndlList[localStorage.getItem('bundleSelected')];
        if (theBundle) {
            this.setState({value: 0, server: this.props.server, bundle: theBundle, hasBundle: true});
        } else {
            this.setState({value: 0, server: this.props.server, bundle: undefined, hasBundle: false});
        }
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({server: newProps.server});
    };

    // change to the Server page or the Collection page
    handleChange = (event, value) => {
        this.setState({value: value});
    };

    // callback for the BundlePage, set the currently selected bundle object
    handleBundleUpdate = (value) => {
        if (value) {
            this.setState({bundle: value, hasBundle: true});
        } else {
            this.setState({bundle: undefined, hasBundle: false});
        }
    };

    render() {
        // temporary hack to set the theme color
        const tabsStyle = {
            width: '100%',
            position: 'fixed',
            top: 52,
            zIndex: 1,
            marginTop: 2,
            color: '#FFFFFF',
            backgroundColor: getThemeColor(this.props.theme)};

        return (
            <div>

                <div style={tabsStyle}>
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

                <div style={styles.content}>
                    {this.state.value === 0 && <TabContainer>
                        <BundlePage update={this.handleBundleUpdate}
                                    server={this.state.server}
                                    bundle={this.state.bundle}/></TabContainer>}

                    {this.state.hasBundle && this.state.value === 1 &&
                    <TabContainer><AttackPatternPage bundle={this.state.bundle}/></TabContainer>}

                    {this.state.hasBundle && this.state.value === 2 &&
                    <TabContainer><RelationShipPage bundle={this.state.bundle}/></TabContainer>}

                    {this.state.hasBundle && this.state.value === 3 &&
                    <TabContainer><IndicatorPage bundle={this.state.bundle}/></TabContainer>}

                    {this.state.hasBundle && this.state.value === 4 &&
                    <TabContainer><SightingPage bundle={this.state.bundle}/></TabContainer>}

                    {this.state.hasBundle && this.state.value === 5 && <TabContainer>{'Malware not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 6 && <TabContainer>{'Campaign not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 7 && <TabContainer>{'Course of Action not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 8 && <TabContainer>{'Identity not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 9 && <TabContainer>{'Intrusion Set not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 10 && <TabContainer>{'Observed Data not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 11 && <TabContainer>{'Report not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 12 && <TabContainer>{'Threat Actor not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 13 && <TabContainer>{'Tool not yet implemented'}</TabContainer>}
                    {this.state.hasBundle && this.state.value === 14 && <TabContainer>{'Vulnerability not yet implemented'}</TabContainer>}
                </div>

            </div>
        );
    };

}

StixView.propTypes = {
    server: PropTypes.object,
    theme: PropTypes.string
};

