// @flow weak

import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Collection, Server} from "../libs/taxii2lib";
import {CircularProgress} from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import {isEmpty} from '../stix/stixutil.js';
import Table, {
    TableHeaderColumn,
    TableHeader,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';


/**
 * list all objects of the selected collection
 */
export class ObjectsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,
            selectedCol: '',
            objectList: [],
            apiroot: ''
        };
    }

    initialise(theServer) {
        const theSelectedCol = localStorage.getItem('collectionSelected');
        const theApiroot = localStorage.getItem('serverApiroot');
        this.setState({
            objectList: [],
            selectedCol: theSelectedCol,
            apiroot: theApiroot,
            waiting: true
        });
        if (theServer && theApiroot && !isEmpty(theSelectedCol)) {
            const colInfoObj = JSON.parse(theSelectedCol);
            const theCollection = new Collection(colInfoObj, theApiroot, theServer.conn);
            theCollection.getObjects().then(bundle => {
              this.setState({objectList: bundle.objects, waiting: false});
            }).catch(err => { this.setState({waiting: false, objectList: []}); });
        } else {
            this.setState({waiting: false});
        }
    };

    // load the collections of the api root
    componentDidMount() {
        this.initialise(this.props.server);
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.initialise(newProps.server);
    };

    objectsTableEntries() {
        if (!isEmpty(this.state.selectedCol) && this.state.objectList) {
            return this.state.objectList.map(obj =>
                <TableRow key={obj.id}>
                    <TableCell>{obj.type}</TableCell>
                    <TableCell>{obj.name}</TableCell>
                    <TableCell>{obj.id}</TableCell>
                    <TableCell>{obj.description}</TableCell>
                </TableRow>);
        } else {
            return [];
        }
    };

    render() {
        return (
            <Grid container className={this.props.root}>
                <Grid item xs={12}>
                    <Paper style={{width: '100%'}}>
                        <Table style={{marginLeft: 8}}>
                            <TableHead>
                                <TableRow key="headKey">
                                    <TableCell>Type</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.objectsTableEntries()}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <div style={{marginLeft: 400, marginTop: 40}}>
                    {this.state.waiting && <CircularProgress size={40}/>}
                </div>
            </Grid>
        )
    };

}

ObjectsPage.propTypes = {
    server: PropTypes.object
};
