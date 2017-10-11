/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak

import {Collections, Collection} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import List, {ListItemText} from 'material-ui/List';
import {FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import {CircularProgress} from 'material-ui/Progress';


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
 * list all collections from the selected server and api root.
 * Display the objects of the selected collection.
 */
export class CollectionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,
            selectedColid: '',
            collectionList: [],
            objectList: [],
            apiroot: ''
        };
    }

    initialise(theServer) {
        let apiroot = localStorage.getItem('serverApiroot');
        if (theServer && apiroot) {
            let colInfo = JSON.parse(localStorage.getItem('collectionSelected'));
            let colid = colInfo ? colInfo.id : '';
            //    this.setState({apiroot: apiroot, selectedColid: colid});
            this.state.apiroot = apiroot;
            this.state.selectedColid = colid;
            this.forceUpdate();
            // if already have a collection id selected
            if (colid) {
                this.setState({waiting: true});
                const theCollections = new Collections(apiroot, theServer.conn);
                theCollections.get().then(collections => {
                    let colList = [];
                    // fill the array with collections info
                    collections.map(col => colList.push(col));
                    // get the selected collection info
                    let thisCol = colList.find(col => col.id === colid);
                    // create the selected collection endpoint
                    const theCollection = new Collection(thisCol, apiroot, theServer.conn);
                    // get the objects
                    theCollection.getObjects().then(bundle => {
                        this.setState({collectionList: colList, objectList: bundle.objects, waiting: false});
                        this.forceUpdate();
                    });
                });
            } else {
                // just list the collections
                this.setState({waiting: true});
                const theCollections = new Collections(apiroot, theServer.conn);
                theCollections.get().then(collections => {
                    let colList = [];
                    collections.map(col => colList.push(col));
                    this.setState({collectionList: colList, waiting: false});
                });
            }
        } else {
            this.setState({waiting: false, selectedColid: '', collectionList: [], objectList: [], apiroot: ''});
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

    // get the objects of the selected collection
    dataObjectList(col) {
        if (this.state.apiroot && this.props.server) {
            this.setState({waiting: true});
            const theCollection = new Collection(col, this.state.apiroot, this.props.server.conn);
            theCollection.getObjects().then(bundle =>
                this.setState({objectList: bundle.objects, waiting: false}));
        }
    };

    colsAsFormLabels() {
        let colItems = [];
        this.state.collectionList.map(col => {
            let readVal = col.can_read ? 'can read' : 'cannot read';
            let writeVal = col.can_write ? 'can write' : 'cannot write';
            let labelValue = col.title + ' (' + readVal + ', ' + writeVal + ')';
            let theColor = (col.can_write && col.can_read) ? green[500] : red[500];
            colItems.push(<FormControlLabel style={{margin: 8}}
                                            disabled={!col.can_read}
                                            key={col.id}
                                            value={col.id}
                                            checked={col.id === this.state.selectedColid}
                                            control={<Radio style={{color: theColor}}/>}
                                            label={labelValue}/>);
        });
        return colItems;
    }

    objsAsFormLabels() {
        let objItems = [];
        this.state.objectList.map(sdo => {
            objItems.push(<ListItemText key={sdo.id} primary={sdo.type + " " + sdo.name}/>);
        });
        return objItems;
    }

    // change the selected collection
    handleSelected = (event, colid) => {
        this.setState({selectedColid: colid});
        // find the collection info
        let thisCol = this.state.collectionList.find(col => col.id === colid);
        if (thisCol) this.dataObjectList(thisCol);
        localStorage.setItem('collectionSelected', JSON.stringify(thisCol));
    };

    render() {
        return (
            <Grid container className={this.props.root}>

                <Grid item xs={3}>
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

                <Grid item xs={9}>
                    <Typography type="body1">Objects list</Typography>
                    <List> {this.objsAsFormLabels()} </List>
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
