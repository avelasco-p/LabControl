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
} from 'react-native-material-ui';

//components
import Login from './scenes/Login';
import LabList from './scenes/LabList';

let SharedPreferences = require('react-native-shared-preferences');

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
		console.log('component will mount');
	}

	render(){
		const { navigate } = this.props.navigation;

		if (this.state.token == null) {
			return (
				<Login {...this.props} />	
			)	
		}else{
			return(
				<LabList {...this.props} token={this.state.token}/>
			)		
		}
	}
}
