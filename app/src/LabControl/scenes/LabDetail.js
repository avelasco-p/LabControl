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
		this.interval = null;

		this.state = {
			status: 3,
			room: {
				light: 'no recibido aun',
				presence: 'no recibido aun'
			},
			bg: null,
			counter: 0,
		}

		SharedPreferences.getItems(['server', 'auth_token'], (values) => {
			const { params } = props.navigation.state;

			server = values[0]
			token = values[1];

			this._getRoomInfo('http://' + server + ':8080/api/room/' + params.room.id + '/info');	
			this.interval = setInterval(() => {
				this._getRoomInfo('http://' + server + ':8080/api/room/' + params.room.id + '/info');	
			}, 5000);	

			this._updateToolbar(params.room.status);
		});
	}

	_updateToolbar(status){
		const { params } = this.props.navigation.state;
		let bg;
		let toolbarElements = [];
		let room = params.room;

		switch (status) {
			case 0:
				bg = { backgroundColor: '#3a3733' };
				room.status = 0;
				break;

			case 1:
				bg = { backgroundColor: '#339966' };
				room.status = 1;
				break;

			case 2:
				bg = { backgroundColor: '#ef7a08' };
				room.status = 2;
				break;

			default:
				bg = { backgroundColor: '#0095a5' };	
		}

		this.setState({
			status: status,
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
		}).catch((err) => console.log(err));
	}

	_changeState(url, status){
		return navigator.geolocation.getCurrentPosition((pos) => {
			return fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: token,
					position: pos
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
		}, (error) => {
			Snackbar.show({ title: error.message });
		});

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

		return(
			<View style={styles.mainContainer}>
				<Toolbar
					style={{ container: this.state.bg }}
					centerElement={ params.room.roomname }
					leftElement='arrow-back'
					onLeftElementPress={() => {
						dispatch(resetAction) //to refresh list automatically
					}}
					rightElement={{
						actions: ['place'],
						menu: {
							icon: 'more-vert',
							labels: ['Abrir', 'Cerrar', 'Ocupar']
						}
					}}
					onRightElementPress={(elem) => {
						let url = 'http://' + server + ':8080/api/room/' + params.room.id;
						let newS;

						if (elem.action === 'place') return this._showMap();

						switch (elem.index) {
							case 0:
								url += '/open'	
								newS = 1;
								break;
							case 1:
								url += '/close'
								newS = 0;
								break;	
							case 2:
								url += '/occupy';
								newS = 2;
								break;
							default:
								return;
						}

						this._changeState(url, newS);
					}}
				/>		
				  <View style={styles.cardRow}>
					<SensorView
					  value='Estado'
					  icon={ this.state.room.status == 0 ? require('../../../res/img/LOCKED.png') : this.state.room.status == 1 ?  require('../../../res/img/UNLOCKED.png') : require('../../../res/img/BUSSY.png')}
					  sensVal={ this.state.room.status == 0 ? 'Cerrado' : this.state.room.status == 1? 'Abierto' : 'Ocupado'}
					  room={ this.state.room }/>
				  </View>
				  <View style={styles.cardRow}>
					<SensorView
					  value='Luz'
					  icon={this.state.room.light > 100 ? require('../../../res/img/ON.png') : require('../../../res/img/OFF.png')}
					  sensVal={'LDR: ' + this.state.room.light || 'no recibido aun'}
					  room={this.state.room}/>
					  <SensorView
						value='Presencia'
						icon={this.state.room.presence == 1 ? require('../../../res/img/FULL.png') : require('../../../res/img/EMPTY.png')}
						sensVal={ this.state.room.presence == 1 ? 'Deteccion de movimiento' : 'No hay movimiento'}
						room={this.state.room}/>
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
