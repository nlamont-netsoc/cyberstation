/* eslint-disable flowtype/require-valid-file-annotation */



import React, {Component} from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import {withStyles, MuiThemeProvider} from 'material-ui/styles';
import wrapDisplayName from 'recompose/wrapDisplayName';
import {createContext, createContextWith} from '../styles/createContext';


// Apply some reset
const styles = theme => ({
    '@global': {
        html: {
            background: theme.palette.background.default,
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale' // Antialiasing.
        },
        body: {
            margin: 0
        }
    }
});

let AppWrapper = props => props.children;

AppWrapper = withStyles(styles)(AppWrapper);

function withRoot(BaseComponent) {
    class WithRoot extends Component {

        constructor(props) {
            super(props);
            this.state = {context: createContext()};
            // because we are inside a function we need this
            this.updateContext = this.updateContext.bind(this);
        }

        // callback for the BaseCompoment to change the theme
        updateContext(newTheme) {
            if(newTheme) this.setState({context: createContextWith(newTheme)});
        }

        componentDidMount() {
            // Remove the server-side injected CSS.
            const jssStyles = document.querySelector('#jss-server-side');
            if (jssStyles && jssStyles.parentNode) {
                jssStyles.parentNode.removeChild(jssStyles);
            }
        }

        render() {
            return (
                <JssProvider registry={this.state.context.sheetsRegistry} jss={this.state.context.jss}>
                    <MuiThemeProvider theme={this.state.context.theme} sheetsManager={this.state.context.sheetsManager}>
                        <AppWrapper>
                            <BaseComponent update={this.updateContext}/>
                        </AppWrapper>
                    </MuiThemeProvider>
                </JssProvider>
            );
        }
    };

 //   if (process.env.NODE_ENV !== 'production') {
 //       WithRoot.displayName = wrapDisplayName(BaseComponent, 'withRoot');
 //   }

    return WithRoot;
}


export default withRoot;
