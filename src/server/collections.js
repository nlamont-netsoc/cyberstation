/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak

import {Collections} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import {CircularProgress} from 'material-ui/Progress';
import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table';
import {isEmpty} from '../stix/stixutil.js';



const styles = theme => ({
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    paper: {
        height: 140,
        width: 100
    },
    control: {
        padding: theme.spacing.unit * 3
    }
});

/**
 * Display all collections from the selected server and api root.
 */
export class CollectionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,
            selectedColid: '',
            collectionList: [],
            objectList: [],
            apiroot: '',
            info: ''
        };
    }

    // get the selected server and api root from storage and then
    // get the list of all collections
    initialise(theServer) {
        let apiroot = localStorage.getItem('serverApiroot');
        if (theServer && apiroot ) {
            let colInfo = JSON.parse(localStorage.getItem('collectionSelected'));
            let colid = !isEmpty(colInfo) ? colInfo.id : '';
            this.setState({info: colInfo, apiroot: apiroot, selectedColid: colid, waiting: true});
            const theCollections = new Collections(apiroot, theServer.conn);
            theCollections.collections().then(collections => {
                this.setState({collectionList: collections, waiting: false});
            }).catch(err => {
                this.setState({waiting: false, selectedColid: '', collectionList: [], objectList: [], apiroot: '', info: ''});
            });
        } else {
            this.setState({waiting: false, selectedColid: '', collectionList: [], objectList: [], apiroot: '', info: ''});
        }
    };

    // load the collections of the given server
    componentDidMount() {
        this.initialise(this.props.server);
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.initialise(newProps.server);
    };

    colsAsFormLabels() {
       if (this.state.collectionList) {
          return this.state.collectionList.map(col =>
            <FormControlLabel style={{margin: 8}}
                 disabled={!col.can_read}
                 key={col.id}
                 value={col.id}
                 checked={col.id === this.state.selectedColid}
                 control={<Radio style={{color: (col.can_write && col.can_read) ? green[500] : red[500] }}/>}
                 label={col.title}/>);
       }
        else {
            return [];
       }
    };

    // change the selected collection
    handleSelected = (event, colid) => {
        this.setState({selectedColid: colid});
        // find the collection info
        let thisColInfo = this.state.collectionList.find(col => col.id === colid);
        this.setState({info: thisColInfo});
        localStorage.setItem('collectionSelected', JSON.stringify(thisColInfo));
    };

    showCollectionInfo() {
        if (this.state.selectedColid) {
            let canread = this.state.info.can_read ? 'yes' : 'no';
            let canwrite = this.state.info.can_write ? 'yes' : 'no';
            return <Table style={{marginLeft: 8}}>
                <TableBody>
                    <TableRow key="Title">
                        <TableCell>Title</TableCell>
                        <TableCell>{this.state.info.title}</TableCell>
                    </TableRow>
                    <TableRow key="Id">
                        <TableCell>Id</TableCell>
                        <TableCell>{this.state.info.id}</TableCell>
                    </TableRow>
                    <TableRow key="Description">
                        <TableCell>Description</TableCell>
                        <TableCell style={{whiteSpace: "normal", wordWrap: "break-word"}}>
                            {this.state.info.description}
                        </TableCell>
                    </TableRow>
                    <TableRow key="CanRead">
                        <TableCell>Can be read</TableCell>
                        <TableCell>{canread}</TableCell>
                    </TableRow>
                    <TableRow key="CanWrite">
                        <TableCell>Can write to</TableCell>
                        <TableCell>{canwrite}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>;
        } else {
            return <div> no collection information </div>
        }
    };

    render() {
        return (
            <Grid container className={this.props.root}>

                <Grid item xs={4}>
                    <Typography type="body1">Collections list</Typography>
                    <RadioGroup
                        style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                        aria-label="obj"
                        name="objGroup"
                        value={this.state.selectedColid}
                        onChange={this.handleSelected}>
                        {this.colsAsFormLabels()}
                    </RadioGroup>
                </Grid>

                <Grid item xs={8}>
                    <Typography type="body1">Collection information</Typography>
                    {this.showCollectionInfo()}
                </Grid>

                <div style={{marginLeft: 400, marginTop: 40}}>
                    {this.state.waiting && <CircularProgress size={40}/>}
                </div>
            </Grid>
        );
    };

}

CollectionsPage.propTypes = {
    server: PropTypes.object
};
