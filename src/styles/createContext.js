/* global sheetsManager */

// @flow

import {create} from 'jss';
import preset from 'jss-preset-default';
import {SheetsRegistry} from 'react-jss/lib/jss';
import {createMuiTheme} from 'material-ui/styles';
import {blue, purple, green, cyan} from 'material-ui/colors';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';


// default theme
let theme = createMuiTheme({palette: {primary: blue, secondary: green}});

// Configure JSS
const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

export const sheetsManager = new Map();

export function createContext() {
    return {
        jss,
        theme,
        // This is needed in order to deduplicate the injection of CSS in the page.
        sheetsManager,
        // This is needed in order to inject the critical CSS.
        sheetsRegistry: new SheetsRegistry()
    };
}

export function createContextWith(theme) {
    return {
        jss,
        theme,
        // This is needed in order to deduplicate the injection of CSS in the page.
        sheetsManager,
        // This is needed in order to inject the critical CSS.
        sheetsRegistry: new SheetsRegistry()
    };
}

export function createTheme(name) {
    switch (name) {
        case 'Summer':
            return createMuiTheme({palette: {primary: blue, secondary: green}});
        case 'Spring':
            return createMuiTheme({palette: {primary: green, secondary: green}});
        case 'Autumn':
            return createMuiTheme({palette: {primary: purple, secondary: green}});
        case 'Winter':
            return createMuiTheme({palette: {primary: cyan, secondary: green}});
        default:
            return createMuiTheme({palette: {primary: blue, secondary: green}});
    }
}