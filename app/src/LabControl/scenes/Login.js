import React, { Component } from 'react';
import { 
	ActivityIndicator,
	Navigator, 
	Text,
	Image,
	View,
	TextInput,	
	StyleSheet,
} from 'react-native';

import { 
	COLOR, 
	ThemeProvider,
	Button,
} from 'react-native-material-ui';

import { NavigationActions } from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';

let SharedPreferences = require('react-native-shared-preferences');

const resetAction = NavigationActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: 'Main' }),
	],
});

export default class Login extends Component{
	constructor(props){
		super(props);
			
		this.state= {
			username: '',
			password: '',
			server: '',
			loading: false,
		};
	}

	render(){
		return (
			<View style={styles.mainContainer}>
				<Image 
					style={{
						flex: 1,
						position: 'absolute',
						width: '100%',
						height: '100%',
						justifyContent: 'center',
					}}	
					source={require('../../../res/img/LOGIN.png')}
				/>
				<View style={styles.firstContainer}>
					<ActivityIndicator
						animating={this.state.loading}
						color='white'
						size='large'
					/>
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
						primary text="SIGN IN"
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
		const { navigate, dispatch } = this.props.navigation;

		if (this._validateInput(this.state.username) && this._validateInput(this.state.password) && this._validateServer(this.state.server)) {

			//AsyncStorage code here
			this.setState({loading: true});

			fetch('http://' + this.state.server + ':8080/api/login/', {
				method: 'POST',
				headers: {
					'Accept':'application/json',
					'Content-Type' : 'application/json',
				},
				body: JSON.stringify({
					username: this.state.username,
					password: this.state.password,
				}),
			})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({ loading:false });
				if (responseJson.success) {
					SharedPreferences.setItem('auth_token', responseJson.token)	;	
					dispatch(resetAction);
				}else{
					Snackbar.show({
						title: 'Error autentificando: ' + responseJson.message,
					});
				}
			})
			.catch((error) => {
				Snackbar.show({
					title: 'Ha habido un error',
				});
				this.setState({ loading:false });
			});
		}
	}

	_validateInput(text){
		if (text != '') {
			return true;
		}
		Snackbar.show({
			title: 'Error: algunos campos están vacios.',
		});
		
		return false;
	}

	_validateServer(server){
		if (server.match(/(\d+\.){3}\d+/g) != null) {
			SharedPreferences.setItem('server', server);
			return true;	
		}
		Snackbar.show({
			title: 'El campo del servidor no tiene un formato IPv4',
		});
		return false;
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: COLOR.blue500,
	},
	firstContainer: {
		flex: 3,
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
