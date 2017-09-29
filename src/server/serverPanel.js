/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {StixPage, styles} from '../stix/stixPage.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Divider from 'material-ui/Divider';
import List, {ListItemText} from 'material-ui/List';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';



export class ServerPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {currentApiroot: '', discovery: ''}
    };

    componentDidMount() {
        this.props.server.discovery().then(discovery => {
            this.setState({discovery: discovery, currentApiroot: discovery.default});
            // tell the parent component
            this.props.update(discovery.default);
        });
    };

    // change the selected api root
    handleSelection = event => {
        let value = event.target.value;
        this.setState({currentApiroot: value});
        // tell the parent component
        this.props.update(value);
    };

    // the api roots url as form labels
    apiRootsAsFormLabels() {
        let items = [];
        if (this.state.discovery !== '') {
            let arr = this.state.discovery.api_roots;
            if (arr !== undefined) {
                for (let j = 0; j < arr.length; j++) {
                    items.push(<FormControlLabel
                        style={{margin: 8}} key={j} value={arr[j]}
                        control={<Radio/>} label={arr[j]}/>);
                }
            }
        }
        return items;
    };

    serverInfo() {
        if (this.state.discovery !== undefined) {
            return <List>
                <ListItemText key="a1" primary={'Title: ' + this.state.discovery.title}/>
                <ListItemText key="a2" primary={'Description: ' + this.state.discovery.description}/>
                <ListItemText key="a3" primary={'Contact: ' + this.state.discovery.contact}/>
                <ListItemText key="a4" primary={'Default: ' + this.state.discovery.default}/>
            </List>;
        }
    };

    render() {
        return (
            <Grid item xs={12} sm={12}>
                {this.serverInfo()}
                <Divider/>
                <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                            aria-label="apiroots"
                            name="apiroots"
                            value={this.state.currentApiroot}
                            onChange={this.handleSelection}>
                    {this.apiRootsAsFormLabels()}
                </RadioGroup>
            </Grid>
        );
    };

};

ServerPanel.propTypes = {
    server: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(ServerPanel));