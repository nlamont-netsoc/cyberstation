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
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';



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

export class CollectionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {currentSelection: '', collectionList: [], objectsList: [], colObjectsMap: new Map() };
    }

    dataList(theMap) {
        let objItems = [];
        let colItems = [];
        for (let [key, value] of theMap.entries()) {
            const theCollections = new Collections(key, this.props.server.conn);
            theCollections.get().then(collections => {
                collections.map(col => {
                    colItems.push(<FormControlLabel style={{margin: 8}}
                                                    key={col.id} value={col.title} control={<Radio/>}
                                                    label={col.title}/>);

                    const theCollection = new Collection(col, key, this.props.server.conn);
                    theCollection.getObjects().then(bundle => {
                        for (let sdo of bundle.objects) {
                            objItems.push(<ListItemText key={sdo.id} primary={sdo.type + " " + sdo.name}/>);
                        }
                    });
                });
            });
        }
        this.setState({collectionList: colItems});
        this.setState({objectsList: objItems});
    };

    getObjects(col) {
        // const theCollection = new Collection(col, key, this.props.server.conn);
        // theCollection.getObjects().then(bundle => {
        //     for (let sdo of bundle.objects) {
        //         objItems.push(<ListItemText key={sdo.id} primary={sdo.type + " " + sdo.name}/>);
        //     }
        // });
    }

    // load the apiroots map with key=url value=the api root object
    componentDidMount() {
        this.props.server.api_rootsMap().then(theMap => this.dataList(theMap));
    };

    // change the selected collection
    handleSelected = event => {
        console.log("--> event.target.value");
        this.setState({currentServer: event.target.value});





    };

    render() {
        return (
            <Grid container className={this.props.root}>

                <Grid item xs={3}>
                    <Typography type="body1" wrap>Collection list</Typography>
                    <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                aria-label="obj"
                                name="objGroup"
                                value={this.state.currentServer}
                                onChange={this.handleSelected}>
                        {this.state.collectionList}
                    </RadioGroup>

                </Grid>

                <Grid item xs={9}>
                    <Typography type="body1" wrap>Objects list</Typography>
                    <List> {this.state.objectsList} </List>
                </Grid>

            </Grid>
        );
    };

};

CollectionsPage.propTypes = {
    server: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(CollectionsPage));