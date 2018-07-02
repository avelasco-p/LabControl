import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

import Main from './src/LabControl/Main';
import Navigator from './config/router';

import { 
  COLOR, 
  ThemeContext, 
  getTheme
} from 'react-native-material-ui';

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

export default class App extends Component<{}> {
  render() {
    return (
	  <ThemeContext.Provider value={getTheme(uiTheme)}>
		<Navigator/>
	  </ThemeContext.Provider>
    );
  }
}

const uiTheme = {
	palette: {
		primaryColor: '#0095a5',
		accentColor: '#ef7a08',
	},
	toolbar: {
		container: {
			height: 55,
		},
	},	
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
