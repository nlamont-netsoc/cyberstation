/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import uuidv4 from 'uuid/v4';
import Tooltip from 'material-ui/Tooltip';


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

/**
 * Allow for adding/deleting/editing stix objects of the chosen type.
 * Displays the content of the bundle objects list of the chosen stix type.
 * For example stix type "attack-pattern", the BundleContent displays
 * all stix objects of this type in the AttackPatternPage.
 */
export class BundleContent extends Component {

    constructor(props) {
        super(props);
        this.state = {sdoId: '', objList: []};
    }

    initialise(theProps) {
        // make a deep copy of the new stix template
        this.stixTemplate = JSON.parse(JSON.stringify(theProps.stix));
        this.title = "Bundle " + theProps.stix.type;
        if (theProps.stix.type) {
            this.title = this.title + "s";
        }
        // an array of stix id
        let objItems = [];
        if (theProps.bundle) {
            if (theProps.stix.type) {
                // apply the type filter
                objItems = theProps.bundle.objects.filter(obj => obj.type === theProps.stix.type);
            } else {
                // take all types
                objItems = theProps.bundle.objects;
            }
        }
        this.setState({objList: objItems});
    }

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.initialise(newProps);
    }

    // fill the list with the filtered objects of the bundle
    componentDidMount() {
        this.initialise(this.props);
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
        // add to the parent bundle
        this.props.bundle.objects.push(newStix);
        // add to the object list
        this.setState({objList: [...this.state.objList, newStix]});
        // select the newly added object and tell the parent
        this.handleSelected(event, newStix.id);
    };

    // delete the selected stix from the bundle
    handleDelete = (event) => {
        // delete the selected sdoid from the objList
        let withoutSdoid = this.state.objList.filter(sdo => sdo.id !== this.state.sdoId);
        this.setState({objList: withoutSdoid});
        // delete the selected sdoid from the parent bundle
        let indexToDelete = this.props.bundle.objects.findIndex(sdo => sdo.id === this.state.sdoId);
        if (indexToDelete !== -1) {
            this.props.bundle.objects.splice(indexToDelete, 1);
        }
        // tell the parent it has been deleted
        this.props.selected(this.state.sdoId, true);
    };

    render() {
        return (
            <Grid container className={this.props.root} justify="flex-start">
                <FormControl component="fieldset" required>
                    <Typography type="body1" style={{margin: 8}}> {this.title} </Typography>
                    <Grid key="k1">
                        <Tooltip id="tooltip-add" title={"Add a new " + this.props.stix.type} placement="top" enterDelay={500}>
                            <Button fab color="primary" onClick={this.handleAdd} raised
                                    style={{margin: 8}}><AddIcon/></Button>
                        </Tooltip>
                        <Tooltip id="tooltip-delete" title={"Delete selected " + this.props.stix.type} placement="top"
                                 enterDelay={500}>
                            <Button fab color="primary" onClick={this.handleDelete} raised
                                    style={{margin: 8}}><RemoveIcon/></Button>
                        </Tooltip>
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
