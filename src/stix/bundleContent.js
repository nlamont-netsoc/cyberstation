/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import RemoveCircleOutlineIcon from 'material-ui-icons/RemoveCircleOutline';
import RemoveIcon from 'material-ui-icons/Remove';
import Tooltip from 'material-ui/Tooltip';
import blue from 'material-ui/colors/blue';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

const styles = {
    tabs: {
        width: '100%',
        position: 'fixed',
        top: 52,
        zIndex: 1,
        marginTop: 2,
        backgroundColor: "royalblue"
    },
    content: {
        marginTop: 74,
        top: 74
    }
};

export class BundleContent extends Component {

    constructor(props) {
        super(props);
        this.state = {sdoId: '', objList: []};
        this.title = "Bundle " + this.props.stix.type;
        if (this.props.stix.type !== '') {
            this.title = this.title + "s";
        }
        // make a deep copy of the stix template
        this.stixTemplate = JSON.parse(JSON.stringify(this.props.stix));
    }

    // when a new props is received
    componentWillReceiveProps(newProps) {
        // make a deep copy of the new stix template
        this.stixTemplate = JSON.parse(JSON.stringify(newProps.stix));
    }

    // when a new props is received
    // componentWillReceiveProps(newProps) {
    //     // an array of stix id
    //     let objItems = [];
    //     if (newProps.bundle !== undefined) {
    //         // if have no filtering, take all
    //         if (newProps.stix.type === undefined || newProps.stix.type === '') {
    //             objItems = newProps.bundle.objects;
    //         } else {
    //             // apply the type filter
    //             objItems = newProps.bundle.objects.filter(obj => obj.type === newProps.stix.type);
    //         }
    //     }
    //     this.setState({objList: objItems});
    // };

    // fill the list with the filtered objects of the bundle
    componentDidMount() {
        // an array of stix id
        let objItems = [];
        if (this.props.bundle !== undefined) {
            // if have no filtering, take all
            if (this.props.stix.type === undefined || this.props.stix.type === '') {
                objItems = this.props.bundle.objects;
            } else {
                // apply the type filter
                objItems = this.props.bundle.objects.filter(obj => obj.type === this.props.stix.type);
            }
        }
        this.setState({objList: objItems});
    };

    asFormLabels() {
        let formItems = [];
        this.state.objList.map(sdo => formItems.push(<FormControlLabel
            style={{margin: 8}} key={sdo.id} value={sdo.id}
            control={<Radio/>} label={sdo.name}/>));
        return formItems;
    };

    // change the selected object to edit
    handleSelected = (event, sdoid) => {
        this.setState({sdoId: sdoid});
        // tell the parent component
        this.props.selected(sdoid, false);
    };

    // add a new stix to the bundle
    handleAdd = (event) => {
        // make a deep copy of a clean stix
        let newStix = JSON.parse(JSON.stringify(this.stixTemplate));
        // give it new id and name
        newStix.id = this.stixTemplate.type + "--" + uuidv4();
        newStix.name = "new-" + this.stixTemplate.type;
        // update the props stix --> todo check for deep copy
        Object.assign(this.props.stix, newStix);
        // add to the object list
        this.setState({objList: [...this.state.objList, newStix]});
        // add to the parent bundle
        this.props.bundle.objects.push(newStix);
        // select the newly added object and tell the parent
        this.handleSelected(event, newStix.id);
    };

    // delete the selected stix from the bundle
    handleDelete = (event) => {
        // delete the selected sdoid from the objList
        let witoutSdoid = this.state.objList.filter(sdo => sdo.id !== this.state.sdoId);
        this.setState({objList: witoutSdoid});
        // delete the selected sdoid from the parent bundle
        let indexToDelete = this.props.bundle.objects.findIndex(sdo => sdo.id === this.state.sdoId);
        if (indexToDelete !== -1) {
            this.props.bundle.objects.splice(indexToDelete, 1);
        }
        // tell the parent it has been deleted
        this.props.selected(this.state.sdoId, true);
    };

    render() {
    //    const addTip = "Add a new " + this.props.stix.type;
    //    const deleteTip = "Delete the selected " + this.props.stix.type;
        return (
            <Grid container className={this.props.root} justify="flex-start">
                <FormControl component="fieldset" required>
                    <Typography type="body1" style={{margin: 8}}> {this.title} </Typography>
                    <Grid key="k1">
                        <Button fab color="primary" onClick={this.handleAdd} raised
                                style={{margin: 8}}><AddIcon/></Button>
                        <Button fab color="primary" onClick={this.handleDelete} raised
                                style={{margin: 8}}><RemoveIcon/></Button>
                    </Grid>

                    <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                aria-label="obj"
                                name="objGroup"
                                value={this.state.sdoId}
                                onChange={this.handleSelected}>
                        {this.asFormLabels()}
                    </RadioGroup>
                </FormControl>
            </Grid>
        );
    };

}

BundleContent.propTypes = {
    stix: PropTypes.object.isRequired,
    bundle: PropTypes.object.isRequired,
    selected: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(BundleContent));