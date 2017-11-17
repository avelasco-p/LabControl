import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Main from './src/LabControl/Main';

import { 
	COLOR, 
	ThemeProvider, 
} from './node_modules/react-native-material-ui';

const uiTheme = {
	palette: {
		primaryColor: COLOR.blue500,
		accentColor: COLOR.orange500,
	},
	toolbar: {
		container: {
			height: 55,
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
