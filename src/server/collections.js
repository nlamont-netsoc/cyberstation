/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

//import { Router, Route, Switch } from 'react-router'
import {TaxiiConnect, Server, Collections, Collection} from '../libs/taxii2lib.js';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import { CircularProgress } from 'material-ui/Progress';


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

const labelStyles = {
    canread: {
        color: green[500],
    },
    cannotread: {
        color: red[500],
    },
    canwrite: {
        color: green[500],
    },
    cannotwrite: {
        color: red[500],
    }
};

export class CollectionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            colSelection: '',
            collectionList: [],
            objectList: [],
            apiroot: ''};
    }

    // load the collections of the api root
    componentDidMount() {
        this.setState({apiroot: this.props.apiroot});
        this.dataCollectionList();
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        // newProps.server;
        this.setState({collectionList: [], objectList: [], apiroot: newProps.apiroot});
        this.dataCollectionList();
    };

    dataCollectionList() {
        let colList = [];
        if (this.state.apiroot !== '') {
            this.setState({loading: true});
            const theCollections = new Collections(this.state.apiroot, this.props.server.conn);
            theCollections.get().then(collections => {
                collections.map(col => colList.push(col));
                this.setState({collectionList: colList, loading: false});
            });
        }
    };

    dataObjectList(col) {
        if (this.state.apiroot !== '') {
            this.setState({loading: true});
            const theCollection = new Collection(col, this.state.apiroot, this.props.server.conn);
            theCollection.getObjects().then(bundle =>
                this.setState({objectList: bundle.objects, loading: false}));
        }
    };

    colsAsFormLabels() {
        let colItems = [];
        this.state.collectionList.map(col => {
            let readVal = col.can_read ? 'can read' : 'cannot read';
            let writeVal = col.can_write ? 'can write' : 'cannot write';
            let labelValue = col.title  + ' (' + readVal + ', ' + writeVal + ')';
            let theColor = (col.can_write && col.can_read) ? green[500] : red[500];
            colItems.push(<FormControlLabel style={{margin: 8}}
                                            disabled = {!col.can_read}
                                            key={col.id} value={col.id}
                                            control={<Radio style={{color: theColor}}/>}
                                            label={labelValue} />);
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
        this.setState({colSelection: colid});
        // find the collection info
        let thisCol = this.state.collectionList.find(col => col.id === colid);
        if (thisCol !== undefined) {
            this.dataObjectList(thisCol);
            // tell the parent about the selected collection
            this.props.collection(thisCol);
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid container className={this.props.root}>

                <Grid item xs={3}>
                    <Typography type="body1" wrap>Collections list</Typography>
                    <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                aria-label="obj"
                                name="objGroup"
                                value={this.state.colSelection}
                                onChange={this.handleSelected}>
                        {this.colsAsFormLabels()}
                    </RadioGroup>

                </Grid>

                <Grid item xs={9}>
                    <Typography type="body1" wrap>Objects list</Typography>
                    <List> {this.objsAsFormLabels()} </List>
                </Grid>

                <div style={{marginLeft: 400, marginTop: 40}}>
                    {this.state.loading && <CircularProgress size={40}  />}
                </div>
            </Grid>
        );
    };

};

CollectionsPage.propTypes = {
    server: PropTypes.object.isRequired,
    apiroot: PropTypes.string.isRequired,
    collection: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(CollectionsPage));