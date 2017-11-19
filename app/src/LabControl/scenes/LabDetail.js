import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import {
	Card,
	Button,
	Toolbar,
} from 'react-native-material-ui';

import SensorView from '../components/SensorView';
import Snackbar from 'react-native-snackbar';

const backAction = NavigationActions.back();

export default class LabDetail extends Component {
	constructor(props){
		super(props);
	}

	render(){
		const { dispatch, navigate } = this.props.navigation;
		const { params } = this.props.navigation.state;
		Snackbar.show({
			title: 'room: ' + params.room,
		});
		
		return(
			<View style={styles.mainContainer}>
				<Toolbar
					centerElement={ params.room }
					leftElement='arrow-back'
					onLeftElementPress={() => {
						dispatch(backAction);
					}}
				/>		
				<View style={styles.cardRow}>
					<SensorView style={styles.cardView} value='Estado'/>
					<SensorView style={styles.cardView} value='Temperatura'/>
				</View>
				<View style={styles.cardRow}>
					<SensorView value='Luz'/>
					<SensorView value='Presencia'/>
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
