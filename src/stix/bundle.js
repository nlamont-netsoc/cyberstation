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
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';


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
        this.serverInfo();
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
            let colInfo = this.props.collection === '' ? 'no endpoint' : this.props.collection.title;
            let serverInfo = <Table style={{marginLeft: 8}}>
                <TableBody>
                    <TableRow key="Title">
                        <TableCell>Title</TableCell>
                        <TableCell>{discovery.title}</TableCell>
                    </TableRow>
                    <TableRow key="Description">
                        <TableCell>Description</TableCell>
                        <TableCell>{discovery.description}</TableCell>
                    </TableRow>
                    <TableRow key="Contact">
                        <TableCell>Contact</TableCell>
                        <TableCell>{discovery.contact}</TableCell>
                    </TableRow>
                    <TableRow key="Endpoint">
                        <TableCell>Collection</TableCell>
                        <TableCell>{colInfo}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>;
            this.setState({info: serverInfo});
        })
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
                        <div style={{height: 20}} />
                        <Typography type="body1" wrap style={{marginLeft: 8}}>Connected to</Typography>
                        {this.state.info}
                    </Grid>

                </Grid>
            </Grid>
        );
    };

};

BundlePage.propTypes = {
    server: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(BundlePage));