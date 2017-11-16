/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import Main from './src/LabControl/Main';

import { Navigator, NativeModules } from 'react-native';

import { 
	COLOR, 
	ThemeProvider, 
	Toolbar,
	Card,
} from './node_modules/react-native-material-ui';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const uiTheme = {
	palette: {
		primaryColor: COLOR.blue500,
		accentColor: COLOR.orange500,
	},
	toolbar: {
		container: {
			height: 50,
		},
	},	
};

export default class App extends Component<{}> {
  render() {
    return (
	<ThemeProvider uiTheme={uiTheme}>
		<Main />
	 </ThemeProvider>
    );
  }
}

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
