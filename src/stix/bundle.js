/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import {BundlePanel} from '../stix/bundlePanel.js';
import TextField from 'material-ui/TextField';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';


const styles = {

};

/**
 * control add/delete/save/load and send bundles to the server,
 * display the bundle info and its objects list
 */
export class BundlePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            objList: [],
            info: '',
            bundle: {name: '', type: '', id: '', spec_version: '', objects: []}
        };
    }

    // initialise the state with the prop.bundle
    componentDidMount() {
        this.state.bundle = JSON.parse(JSON.stringify(this.props.bundle));
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

    // from the BundlePanel when a bundle is loaded from localstore
    updateBundle = (theBundle) => {
        this.setState({bundle: theBundle});
        this.handleChange('spec_version')({target: {value: theBundle.spec_version}});
        this.handleChange('id')({target: {value: theBundle.id}});
    };

    serverInfo() {
        if(typeof this.props.server === 'object') {
            this.props.server.discovery().then(discovery => {
                let colEntry = 'no endpoint';
                let writeVal = 'cannot write to';
                let colInfo = 'Collection' + " (" + writeVal + ")";
                if (this.props.collection !== '') {
                    writeVal = this.props.collection.can_write ? 'can write to' : 'cannot write to';
                    colInfo = 'Collection' + " (" + writeVal + ")";
                    colEntry = this.props.collection.title;
                }
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
                            <TableCell>{colInfo}</TableCell>
                            <TableCell>{colEntry}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>;
                this.setState({info: serverInfo});
            })
        }
    };

    render() {
        const sendable = this.props.collection === '' ? false : this.props.collection.can_write;
        return (
            <Grid container spacing={8}>
                <Grid item xs={3}>
                    <BundlePanel canSend={sendable}
                                 bundle={this.props.bundle}
                                 collection={this.props.collection}
                                 sdotype=''
                                 update={this.updateBundle}
                                 selected={this.selectedObject}/>
                </Grid>

                <Grid item xs={9}>

                    <Grid>
                        <form noValidate autoComplete="off">
                            <Grid key="bundle1" item>
                                <TextField style={{marginLeft: 8, width: 500}}
                                           name="name"
                                           id="name"
                                           label="name"
                                           className={this.props.textField}
                                           value={this.state.bundle.name}
                                           margin="normal"
                                           onChange={this.handleChange('name')}
                                />
                                <TextField style={{marginLeft: 22, width: 40}}
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
                        <div style={{height: 20}}/>
                        <Typography type="body1" style={{marginLeft: 8}}>Connected to</Typography>
                        {this.state.info}
                    </Grid>

                </Grid>
            </Grid>
        );
    };

}

BundlePage.propTypes = {
    server: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    bundle: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(BundlePage));