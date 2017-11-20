import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import {
	COLOR,
	Card,
	Button,
	Toolbar,
} from 'react-native-material-ui';

import SensorView from '../components/SensorView';
import Snackbar from 'react-native-snackbar';

const backAction = NavigationActions.back();
let SharedPreferences = require('react-native-shared-preferences');

let token, server;

export default class LabDetail extends Component {
	constructor(props){
		super(props);

		this.state = {
			status: 3,
			room: null,
			toolbarElements: [],
			bg: null,
		}
	}

	_updateToolbar(status){
		const { params } = this.props.navigation.state;
		let bg;
		let toolbarElements = [];

		switch (status) {
			case 0:
				bg = { backgroundColor: COLOR.red500 };
				toolbarElements = ['lock-open'];
				break;

			case 1:
				bg = { backgroundColor: COLOR.green500 };
				toolbarElements = ['do-not-disturb-on', 'lock'];
				break;

			case 2:
				bg = { backgroundColor: COLOR.orange500 };
				toolbarElements = ['lock-open', 'lock'];
				break;

			default:
				bg = { backgroundColor: COLOR.blue500 };	
		}

		this.setState({
			status: status,
			toolbarElements: toolbarElements,	
			bg: bg,
			room: params.room,
		});
	}

	_changeState(url, status){
		return fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: token,
			}),
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if (responseJson.success) {
				this._updateToolbar(status);
				Snackbar.show({ title: 'Cambiado con exito'});	
			}else{
				Snackbar.show({ 
					title: responseJson.message, 
					duration: Snackbar.LENGTH_LONG, 
				});
			}
		})
		.catch((error) => {
			Snackbar.show({ title: responseJson.message });
		});
	}	

	componentWillMount(){
		const { params } = this.props.navigation.state;

		let bg;
		let toolbarElements = [];

		SharedPreferences.getItem('auth_token', (value) => {
			token = value;
		});

		SharedPreferences.getItem('server', (value) => {
			server = value;
		});

		this._updateToolbar(params.room.status);
	}

	render(){
		const { dispatch, navigate } = this.props.navigation;
		const { params } = this.props.navigation.state;
		
		return(
			<View style={styles.mainContainer}>
				<Toolbar
					style={{ container: this.state.bg }}
					centerElement={ params.room.roomname }
					leftElement='arrow-back'
					onLeftElementPress={() => {
						dispatch(backAction);
					}}
					rightElement={this.state.toolbarElements}
					onRightElementPress={(elem) => {
						let url = 'http://' + server + ':8080/api/room/' + params.room.id;
						let newS;

						switch (elem.action) {
							case 'lock-open':
								url += '/open'	
								newS = 1;
								break;
							case 'lock':
								url += '/close'
								newS = 0;
								break;	
							case 'record-voice-over':
								url += '/occupy';
								newS = 2;
								break;
							default:
								Snackbar.show({ title: 'unavailable request' });	
						}

						this._changeState(url, newS);
					}}
				/>		
				<View style={styles.cardRow}>
					<SensorView value='Estado' room={ params.room } />
					<SensorView value='Temperatura' room={ params.room } />
				</View>
				<View style={styles.cardRow}>
					<SensorView value='Luz'room={ params.room } />
					<SensorView value='Presencia' room={ params.room } />
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,				
	},
	cardRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'stretch',
		margin: 6,
	},
});
