
import React, {Component} from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import PropTypes from 'prop-types';
import withRoot from '../components/withRoot';
import withStyles from 'material-ui/styles/withStyles';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 30,
        padding: theme.spacing.unit * 12,
        backgroundColor: theme.palette.background.paper
    }
});

// todo --> generalise this
// used in ServersPage when connection to the server cannot be established
export class AlertSlide extends Component {

    constructor(props) {
        super(props);
        this.state = { open: this.props.open, url: this.props.url};
        console.log("---> AlertSlide");
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.setState({open: newProps.open, url: newProps.url});
    };

    handleRequestClose = () => {
        this.setState({ open: false });
        // tell the parent component
        this.props.onClose();
    };

    render() {
        const msg = "Could not connect to the specified server ";
        return (
            <div>
                <Dialog open={this.state.open} transition={Slide} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>{"Connection problem"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText> {msg} </DialogContentText>
                        <DialogContentText> {this.state.url} </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };
}

AlertSlide.propTypes = {
    open: PropTypes.bool.isRequired,
    url: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(AlertSlide));
