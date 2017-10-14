/* eslint-disable flowtype/require-valid-file-annotation */


// @flow weak

import Grid from 'material-ui/Grid';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';


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
 * list all objects of the selected collection
 */
export class ObjectsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: false,
            selectedColid: '',
            objectList: [],
            apiroot: ''
        };
    }

    initialise(theServer) {

    };

    // load the collections of the api root
    componentDidMount() {
        this.initialise(this.props.server);
    };

    // when a new props is received
    componentWillReceiveProps(newProps) {
        this.initialise(newProps.server);
    };


    render() {
        return (
            <Grid container className={this.props.root}>
                <div style={{marginLeft: 200, marginTop: 40}}>
                <Typography type="body1">not yet implemented</Typography>
                </div>
            </Grid>
        );
    };

}

ObjectsPage.propTypes = {
    server: PropTypes.object
};
