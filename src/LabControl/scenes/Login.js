import React, { Component } from 'react';
import { 
	Navigator, 
	Text,
	View,
	TextInput,	
	StyleSheet,
} from 'react-native';

import { 
	COLOR, 
	ThemeProvider,
	Button,
} from 'react-native-material-ui';

import {
	StackNavigator,
} from 'react-navigation';

let SharedPreferences = require('react-native-shared-preferences');

export default class Login extends Component{
	constructor(props){
		super(props);
			
		this.state= {
			username: '',
			password: '',
			server: '',
		};
	}

	render(){
		return (
			<View style={styles.mainContainer}>
				<View style={styles.firstContainer}>
				</View>
				<View style={styles.secondContainer}>
					<TextInput 
						style={styles.textInput}
						placeholder="Usuario"
						returnKeyTYpe={'next'}
						blurOnSubmit={false}
						onChangeText={ (text) => this.setState({username: text}) }
						value={this.state.username}
						onSubmitEditing={ (event) => {
							this.refs.Password.focus();
						}}
					/>
					<TextInput 
						ref='Password'
						style={styles.textInput}
						placeholder="Contraseña"
						secureTextEntry={true}
						onChangeText={ (text) => this.setState({password: text}) }
						value={this.state.password}
					/>
					<Button 
						ref='Submit'
						style={{ 
								container: { 
									backgroundColor: 'orange', 
									alignSelf: 'center',
									margin: 20,
								}}} 
						onPress={this._signupButton.bind(this)}
						raised 
						primary text="SIGN UP"
					/>
					<TextInput 
						style={styles.textInput}
						placeholder="Auth Server IP"
						onChangeText={ (text) => this.setState({server: text}) }
						value={this.state.server}
					/>
				</View>
			</View>
		);
	}

	_signupButton(){
		if (this._validateInput(this.state.username) && this._validateInput(this.state.password) && this._validateServer(this.state.server)) {
			alert('username: ' + this.state.username + '\n' + 'server: http://' + this.state.password + ':8080/api/');	
			//SharedPreferences.setItem('auth_token', 'response_token');
		}
	}

	_validateInput(text){
		if (text != '') {
			return true;
		}
		alert('Campo vacio');
		return false;
	}

	_validateServer(server){
		if (server.match(/(\d+\.){3}\d+/g) != null) {
			return true;	
		}
		alert('dirección de server no cumple con los requisitos: (IPv4) XXX.XXX.XXX.XXX');
		return false;
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: COLOR.blue500,
	},
	firstContainer: {
		flex: 2,
		margin: 20,
		justifyContent: 'center',
	},
	secondContainer: {
		flex: 7,	
		margin: 24,
		justifyContent: 'center',
	},
	textInput: {
		fontSize: 18,
		margin: 10,
		color: 'white',
	},
});
