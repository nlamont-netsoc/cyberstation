/* eslint-disable flowtype/require-valid-file-annotation */

// @flow weak
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {FormControlLabel} from 'material-ui/Form';
import Radio, {RadioGroup} from 'material-ui/Radio';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


const styles = {};

/**
 * general component to add/delete string items to an array.
 *
 */
export default class AddPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '', selection: '', openDialog: false,
            add: false, delete: false, objList: [],
            addition: '', showAlert: false
        };
    }

    // fill the list
    componentDidMount() {
        this.setState({
            title: this.props.title,
            selection: this.props.initSelection,
            openDialog: false, add: false, delete: false,
            objList: this.props.itemList, addition: '', showAlert: false
        });
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({
            title: newProps.title,
            selection: newProps.initSelection,
            openDialog: false, add: false, delete: false,
            objList: newProps.itemList, addition: '', showAlert: false
        });
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
        this.setState({selection: value.trim()});
    };

    // show the add dialog
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
        let newEntry = this.state.addition.trim();
        if (newEntry) {
            let found = this.state.objList.find(obj => obj === newEntry);
            // if this entry is already in the list
            if (found) {
                this.setState({ showAlert: true });
            } else {
                // ok, a new entry
                this.state.objList.push(newEntry);
                this.state.openDialog = false;
                this.forceUpdate();
                let event = {target: {value: this.state.objList}};
                this.props.update(event);
            }
        }
    };

    // typing the text
    handleDialogChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    handleAlertClose = () => {
        this.setState({ showAlert: false });
    };

    render() {
        const itemType = this.state.title;
        return (
            <Grid container justify="flex-start" style={{marginTop: 12}}>

                <Grid key="k2" container>
                    <Grid key="k3" item style={{margin: 8}}>
                        <Typography type="body1">{this.state.title}</Typography>
                        {/*<Tooltip id="tooltip-add" title={"Add a new " + itemType} placement="top" enterDelay={500}>*/}
                        <Button fab color="primary" onClick={this.handleAddToList} raised
                                style={{width: 34, height: 12, margin: 4}}><AddIcon/></Button>
                        {/*</Tooltip>*/}
                        {/*<Tooltip id="tooltip-del" title={"Delete selected " + itemType} placement="top" enterDelay={500}>*/}
                        <Button fab color="primary" onClick={this.handleDeleteFromList} raised
                                style={{width: 34, height: 12, margin: 4}}><RemoveIcon/></Button>
                        {/*</Tooltip>*/}
                        <Divider/>
                    </Grid>

                </Grid>

                <Grid key="k6" container>
                    <Grid key="k5" item>
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
                    <DialogTitle>{"Add a new " + itemType}</DialogTitle>
                    <DialogContent style={{width: 400}}>
                        <TextField autoFocus={true}
                                   fullWidth
                                   margin="normal"
                                   name="addition"
                                   type="text"
                                   id="addition"
                                   label={this.state.title}
                                   value={this.state.addition}
                                   onChange={this.handleDialogChange('addition')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogCancel} color="primary">Cancel</Button>
                        <Button onClick={this.handleDialogOk} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.showAlert} transition={Slide} onRequestClose={this.handleAlertClose}>
                    <DialogTitle>{"This entry is already in the list"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText> change the name of this entry </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{justifyContent:'center'}}>
                        <Button onClick={this.handleAlertClose} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>

            </Grid>
        );
    };

}

AddPanel.propTypes = {
    title: PropTypes.string.isRequired,
    itemList: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired,
    initSelection: PropTypes.string
};
