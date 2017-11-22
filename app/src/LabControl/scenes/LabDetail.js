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

const resetAction = NavigationActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: 'Main' }),
	],
});

let token, server;

export default class LabDetail extends Component {
	constructor(props){
		super(props);
		this.invertal = null;

		this.state = {
			status: 3,
			room: {
				light: 'no recibido aun',
				presence: 'no recibido aun'
			},
			toolbarElements: [],
			bg: null,
			counter: 0,
		}
	}

	_updateToolbar(status){
		const { params } = this.props.navigation.state;
		let bg;
		let toolbarElements = [];
		let room = params.room;

		switch (status) {
			case 0:
				bg = { backgroundColor: '#3a3733' };
				toolbarElements = ['lock-open'];
				room.status = 0;
				break;

			case 1:
				bg = { backgroundColor: '#339966' };
				toolbarElements = ['do-not-disturb-on', 'lock'];
				room.status = 1;
				break;

			case 2:
				bg = { backgroundColor: '#ef7a08' };
				toolbarElements = ['lock-open', 'lock'];
				room.status = 2;
				break;

			default:
				bg = { backgroundColor: '#0095a5' };	
		}

		this.setState({
			status: status,
			toolbarElements: toolbarElements,	
			bg: bg,
			room: room,
		});
	}

	_getRoomInfo(url){
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
				let room = this.state.room;
				room.light = responseJson.light;
				room.presence = responseJson.presence;
				this.setState({
					room: room,
				});	
			}else{
				Snackbar.show({ 
					title: responseJson.message, 
					duration: Snackbar.LENGTH_LONG, 
				});
			}
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
				Snackbar.show({ title: 'Cambiado con exito. '});	
			}else{
				Snackbar.show({ 
					title: responseJson.message, 
					duration: Snackbar.LENGTH_LONG, 
				});
			}
		})
		.catch((error) => {
			Snackbar.show({ title: responseJson.message });
			return error;
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

	componentDidMount(){
		const { params } = this.props.navigation.state;
		
		if (this.state.room.status > 0) {
			this.interval = setInterval(() => {
				this._getRoomInfo('http://' + server + ':8080/api/room/' + params.room.id + '/info');	
			}, 2000);	
		}
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	render(){
		const { dispatch, navigate } = this.props.navigation;
		const { params } = this.props.navigation.state;

		let lock_icon = '';
		let light_icon = '';
		let presence_icon = '';

		/*

		switch(this.state.room.status){
			case 0:
				lock_icon = require('../../../res/img/LOCKED.png');
				break;
			case 1:
				lock_icon = require('../../../res/img/UNLOCKED.png');
				break;
			case 2:
				lock_icon = require('../../../res/img/BUSSY.png');
				break;
		}

		if (this.state.room.light == 1) {
			light_icon = require('../../../res/img/ON.png');	
		}else{
			light_icon = require('../../../res/img/OFF.png');
		}

		if (this.state.room.presence == 1) {
			presence_icon = require('../../../res/img/FULL.png');	
		}else{
			presence_icon = require('../../../res/img/EMPTY.png');
		}

		*/
		
		return(
			<View style={styles.mainContainer}>
				<Toolbar
					style={{ container: this.state.bg }}
					centerElement={ params.room.roomname }
					leftElement='arrow-back'
					onLeftElementPress={() => {
						//dispatch(backAction);
						dispatch(resetAction) //to refresh list automatically
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
							case 'do-not-disturb-on':
								url += '/occupy';
								newS = 2;
								break;
							default:
								Snackbar.show({ title: 'unavailable request' });	
						}

						this._changeState(url, newS);

						if (newS > 0) {
							this.interval = setInterval(() => {
								this._getRoomInfo('http://' + server + ':8080/api/room/' + params.room.id + '/info');	
							}, 2000);
						}else{
							clearInterval(this.interval);
						}
					}}
				/>		
				<View style={styles.cardRow}>
					<SensorView value='Estado' icon={ this.state.room.status == 0 ? require('../../../res/img/LOCKED.png') : this.state.room.status == 1 ?  require('../../../res/img/UNLOCKED.png') : require('../../../res/img/BUSSY.png')} sensVal={ this.state.room.status == 0 ? 'Cerrado' : this.state.room.status == 1? 'Abierto' : 'Ocupado'} room={ this.state.room } />
				</View>
				<View style={styles.cardRow}>
					<SensorView value='Luz' icon={ this.state.room.light > 100 ? require('../../../res/img/ON.png') : require('../../../res/img/OFF.png') } sensVal={ 'LDR: ' + this.state.room.light } room={ this.state.room } />
					<SensorView value='Presencia' icon={ this.state.room.presence == 1 ? require('../../../res/img/FULL.png') : require('../../../res/img/EMPTY.png') } sensVal={ this.state.room.presence == 1 ? 'Deteccion de movimiento' : 'No hay movimiento' } room={ this.state.room } />
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
