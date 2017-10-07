/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-multi-comp */
import {viewStyle} from '../styles/viewStyle.js';
import Tabs, {Tab} from 'material-ui/Tabs';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
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
        this.state = {value: 0, server: this.props.server};
    }

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({server: newProps.server});
    };

    handleChange = (event, value) => {
        this.setState({value});
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
                    {this.state.value === 0 && <TabContainer><BundlePage server={this.state.server}/></TabContainer>}
                    {this.state.value === 1 && <TabContainer><AttackPatternPage /></TabContainer>}
                    {this.state.value === 2 && <TabContainer><RelationShipPage /></TabContainer>}
                    {this.state.value === 3 && <TabContainer><IndicatorPage /></TabContainer>}
                    {this.state.value === 4 && <TabContainer><SightingPage /></TabContainer>}
                    {this.state.value === 5 && <TabContainer>{'Malware'}</TabContainer>}
                    {this.state.value === 6 && <TabContainer>{'Campaign'}</TabContainer>}
                    {this.state.value === 7 && <TabContainer>{'Course of Action'}</TabContainer>}
                    {this.state.value === 8 && <TabContainer>{'Identity'}</TabContainer>}
                    {this.state.value === 9 && <TabContainer>{'Intrusion Set'}</TabContainer>}
                    {this.state.value === 10 && <TabContainer>{'Observed Data'}</TabContainer>}
                    {this.state.value === 11 && <TabContainer>{'Report'}</TabContainer>}
                    {this.state.value === 12 && <TabContainer>{'Threat Actor'}</TabContainer>}
                    {this.state.value === 13 && <TabContainer>{'Tool'}</TabContainer>}
                    {this.state.value === 14 && <TabContainer>{'Vulnerability'}</TabContainer>}
                </div>

            </div>
        );
    };

}

StixView.propTypes = {
    server: PropTypes.object
};

export default withRoot(withStyles(styles)(StixView));

