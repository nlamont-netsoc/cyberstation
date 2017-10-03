/* eslint-disable flowtype/require-valid-file-annotation */

/* global conn */
// @flow weak
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';


const styles = {};

export default class AddPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {title: '', selection: '', openDialog: false,
            add: false, delete: false, objList: [],
            addition: ''};
    }

    // fill the list
    componentDidMount() {
        this.setState({title: this.props.title, selection: '',
            openDialog: false, add: false, delete: false,
            objList: this.props.itemList, addition: ''})
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({title: newProps.title, selection: '',
            openDialog: false, add: false, delete: false,
            objList: newProps.itemList, addition: ''})
    };

    asFormLabels() {
        let formItems = [];
        this.state.objList.map(obj => formItems.push(<FormControlLabel
            style={{margin: 2}}
            key={obj}
            value={obj}
            control={<Radio/>}
            label={obj}/>));
        return formItems;
    };

    // change the selected item
    handleListSelection = (event, value) => {
        this.setState({selection: value});
    };

    // create a new item
    handleAddToList = (event) => {
        this.setState({openDialog: true, addition: ''});
    };

    // delete the selected item
    handleDeleteFromList = (event) => {
        // delete the selected item from the objList
        let indexToDelete = this.state.objList.findIndex(obj => obj === this.state.selection);
        if (indexToDelete !== -1) {
            this.state.objList.splice(indexToDelete, 1);
            this.forceUpdate();
            let event = {target: {value: this.state.objList}};
            this.props.update(event);
        }
    };

    handleDialogCancel = () => {
        this.setState({openDialog: false});
    };

    handleDialogOk = () => {
        if(this.state.addition.trim() !== '') {
            this.state.objList.push(this.state.addition);
            this.setState({openDialog: false});
            let event = {target: {value: this.state.objList}};
            this.props.update(event);
        }
    };

    // entering a new item in the dialog
    // handleChange = event => {
    //     this.setState({addition: event.target.value});
    // };

    handleDialogChange = name => event => {
        this.setState({ [name]: event.target.value});
    };

    render() {
        return (
            <Grid container justify="flex-start" style={{marginTop: 12}}>

                <Grid key="k2" container>
                    <Grid key="k3" item style={{margin: 12}}>
                        <Typography type="body1">{this.state.title}</Typography>
                    </Grid>
                        <Grid key="k4" item >
                            <Button fab color="primary" onClick={this.handleAddToList} raised
                                    style={{width: 34, height: 12, margin: 4}}><AddIcon/></Button>
                            <Button fab color="primary" onClick={this.handleDeleteFromList} raised
                                    style={{width: 34, height: 12, margin: 4}}><RemoveIcon/></Button>
                    </Grid>
                </Grid>
                <Grid key="k6" container>
                    <Grid key="k5" item >
                        <Paper style={{marginTop: 6, maxHeight: 200, minWidth: 400, maxWidth: 600, overflow: 'auto'}}>
                            <RadioGroup style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}
                                        aria-label="obj"
                                        name="objGroup"
                                        value={this.state.selection}
                                        onChange={this.handleListSelection}>
                                {this.asFormLabels()}
                            </RadioGroup>
                        </Paper>
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
                        <TextField autoFocus={true}
                                   fullWidth
                                   margin="normal"
                                   name="addition"
                                   type="text"
                                   id="addition"
                                   label="addition"
                                   value={this.state.addition}
                                   onChange={this.handleDialogChange('addition')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogCancel} color="primary">Cancel</Button>
                        <Button onClick={this.handleDialogOk} color="primary">Ok</Button>
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