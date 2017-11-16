//React imports
import React, { Component } from 'react';
import { 
	Navigator, 
	NativeModules, 
	Text,
	View,
	TextInput,	
	StyleSheet,
} from 'react-native';

//libraries import
import { 
	COLOR, 
	ThemeProvider,
	ActionButton,
	Button,
} from '../../node_modules/react-native-material-ui';

let SharedPreferences = require('../../node_modules/react-native-shared-preferences');

//components
import Login from './Login';
import LabList from './LabList';


export default class Main extends Component{
	constructor(props){
		super(props);

		this.state = {
			token: null,
		};
	}

	componentWillMount(){
		SharedPreferences.getItem("auth_token", (value) => {
			this.setState({ token: value });
		});	
	}

	render(){
		if (this.state.token == null) {
			return (
				//<Login />
				<LabList />
			)	
		}else{
			return(
				<LabList auth={this.state.token} />
			)		
		}
	}
}
