/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';


export default class AddPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {title: '', selection: '', openDialog: false,
            add: false, delete: false, objList: [],
            addition: ''};
    }

    // fill the list
    componentDidMount() {
        this.setState({title: this.props.title, objList: this.props.itemList})
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({title: newProps.title, objList: newProps.itemList})
    };

    asFormLabels() {
        let formItems = [];
        this.state.objList.map(sdo => formItems.push(<FormControlLabel
            style={{margin: 2}}
            key={sdo.id}
            value={sdo.id}
            control={<Radio/>}
            label={sdo.name}/>));
        return formItems;
    };

    // change the selected item
    handleSelected = (event, value) => {
        this.setState({selection: value});
        // tell the parent component
       // this.props.update(selection);
    };

    // create a new item
    handleAdd = (event) => {
        this.setState({openDialog: true});
    };

    // delete the selected item
    handleDelete = (event) => {
        // delete the selected item from the objList
        let indexToDelete = this.state.objList.findIndex(obj => obj.id === this.state.selection);
        if (indexToDelete !== -1) {
            this.state.objList.splice(indexToDelete, 1);
            this.forceUpdate();
        }
    };

    handleCancel = () => {
        this.setState({openDialog: false});
    };

    handleOk = () => {
        let newObj = {id: this.state.addition, name: this.state.addition};
        this.state.objList.push(newObj);
        this.setState({openDialog: false});
    };

    // entering a new item in the dialog
    handleChange = event => {
        this.setState({addition: event.target.value});
    };

    render() {
        return (
            <Grid container justify="flex-start">

                <Grid key="k2" container>
                    <Grid key="k3" item style={{marginTop: 8, margin: 8}}>
                        <Typography type="body1">{this.state.title}</Typography>
                        <Paper style={{marginTop: 12, maxHeight: 200, maxWidth: 400, overflow: 'auto'}}>
                            <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                        aria-label="obj"
                                        name="objGroup"
                                        value={this.state.selection}
                                        onChange={this.handleSelected}>
                                {this.asFormLabels()}
                            </RadioGroup>
                        </Paper>
                    </Grid>

                    <Grid key="k4" item>
                        <Button fab color="primary" onClick={this.handleAdd} raised
                                style={{width: 34, height: 12, margin: 8}}><AddIcon/></Button>
                        <Button fab color="primary" onClick={this.handleDelete} raised
                                style={{width: 34, height: 12, margin: 8}}><RemoveIcon/></Button>
                    </Grid>
                </Grid>


                <Dialog
                    open={this.state.openDialog}
                    transition={Slide}
                    ignoreBackdropClick
                    ignoreEscapeKeyUp
                    maxWidth="md"
                >
                    <DialogTitle>Add a new item</DialogTitle>
                    <DialogContent>
                        <TextField style={{marginLeft: 8}}
                                   name="name"
                                   type="text"
                                   id="name"
                                   label="name"
                                   value={this.state.name}
                                   margin="normal"
                                   onChange={this.handleChange}
                                   fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">Cancel</Button>
                        <Button onClick={this.handleOk} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>

            </Grid>
        );
    };

}

AddPanel.propTypes = {
    title: PropTypes.string.isRequired,
    itemList: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
};
