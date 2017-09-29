/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import {StixPage, styles} from '../stix/stixPage.js';
import {TaxiiConnect, Server} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import {BundlePanel} from '../stix/bundlePanel.js';
import TextField from 'material-ui/TextField';
import List, {ListItemText} from 'material-ui/List';

export class BundlePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            objList: [],
            info: '',
            bundle: {type: '', id: '', spec_version: '', objects: []}
        };
    }

    // initialise this state with the prop.bundle
    componentDidMount() {
        Object.assign(this.state.bundle, this.props.bundle);
        this.props.server.discovery().then(discovery => {
            let serverInfo = <List>
                <ListItemText key="a1" primary={'Title: ' + discovery.title}/>
                <ListItemText key="a2" primary={'Description: ' + discovery.description}/>
                <ListItemText key="a3" primary={'Contact: ' + discovery.contact}/>
                <ListItemText key="a4" primary={'Default: ' + discovery.default}/>
            </List>;
            this.setState({info: serverInfo});
        });
        this.forceUpdate();
    };

    handleChange = name => event => {
        // copy the new value to the parent bundle
        Object.assign(this.props.bundle, this.props.bundle, {[name]: event.target.value});
        // copy the new value to this state bundle
        Object.assign(this.state.bundle, this.state.bundle, {[name]: event.target.value});
        // update the state
        this.forceUpdate();
    };

    selectedObject = (sdoid, isDeleted) => {

    };

    serverInfo() {
        this.props.server.discovery().then(discovery => {
            return <List>
                <ListItemText key="a1" primary={'Title: ' + discovery.title}/>
                <ListItemText key="a2" primary={'Description: ' + discovery.description}/>
                <ListItemText key="a3" primary={'Contact: ' + discovery.contact}/>
                <ListItemText key="a4" primary={'Default: ' + discovery.default}/>
            </List>;
        });
    };

    render() {
        return (
            <Grid container spacing={8}>
                <Grid item xs={3}>
                    <BundlePanel bundle={this.props.bundle} sdotype='' selected={this.selectedObject}/>
                </Grid>

                <Grid item xs={9}>

                    <Grid>
                        <form noValidate autoComplete="off">
                            <Grid key="bundle1" item>
                                <TextField style={{marginLeft: 8}}
                                           name="spec_version"
                                           id="spec_version"
                                           label="spec_version"
                                           className={this.props.textField}
                                           value={this.state.bundle.spec_version}
                                           margin="normal"
                                           onChange={this.handleChange('spec_version')}
                                />
                            </Grid>
                            <Grid key="bundle2" item>
                                <TextField style={{marginLeft: 8}}
                                           name="id"
                                           id="id"
                                           label="id"
                                           className={this.props.textField}
                                           value={this.state.bundle.id}
                                           margin="normal"
                                           onChange={this.handleChange('id')}
                                           fullWidth
                                />
                            </Grid>
                        </form>

                    </Grid>

                    <Grid key="bundle3" item>
                        <Typography type="body1" wrap style={{marginLeft: 8}}>Connected to server</Typography>
                        {this.state.info}
                    </Grid>

                </Grid>
            </Grid>
        );
    };

};

BundlePage.propTypes = {
    server: PropTypes.object.isRequired,
    bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(BundlePage));