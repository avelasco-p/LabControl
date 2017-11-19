import React, { Component } from 'react';
import { 
	Navigator, 
	Text,
	View,
	TextInput,	
	ListView,
	StyleSheet,
	RefreshControl,
} from 'react-native';

import { 
	COLOR, 
	ThemeProvider,
	Button,
	ListItem,
	Toolbar,
} from 'react-native-material-ui';

import { NavigationActions } from 'react-navigation';
import Snackbar from 'react-native-snackbar';

let SharedPreferences = require('react-native-shared-preferences');

const resetAction = NavigationActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: 'Main'  }),
	],
});

let server, token;

function fetchMyRooms(url){
	return fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(token: token),
	})
	.then((response) => reponse.json())
	.then((responseJson) => {
		if (responseJson.success) {
			this.setState({
				rooms: responseJson.rooms.map((x) => {
					return x.roomname;			
				}),
			});		
		}	
	})
	.catch((error) => {
		Snackbar.show({ title: 'Ha ocurrido un error ' + server });
	});
}

export default class LabList extends Component{
	constructor(props){
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			rooms : [],
			dataSource: ds.cloneWithRows([
				'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',		      
			]),
			refreshing: false,			
		};
	}

	componentWillMount(){
		SharedPreferences.getItem('server', (value) => {
			server = value; 
		});

		SharedPreferences.getItem('auth_token', (value) => {
			token = value;
		});

		fetchMyRooms('http://' + server + ':8080/api/fetch_my_rooms/').then().catch((error) => this.setState({rooms: dataSource}));
	}	
	
	render(){
		const { dispatch } = this.props.navigation;

		return (
			<View style={styles.mainContainer}>
				<Toolbar 
					centerElement="Laboratorios"	
					rightElement='exit-to-app' //more-vert is another option
					onRightElementPress={() => {
						SharedPreferences.removeItem('auth_token');			
						dispatch(resetAction);
					}}
				/>	
				<View style={styles.listContainer}>
					<ListView 
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this._onRefresh.bind(this)}
							/>
						}
						dataSource = {this.state.dataSource}
						renderRow = { 
							(rowData) => {
								if (Math.random() > 0.5) {
									return <ListItem 
										centerElement={rowData} 
										rightElement='record-voice-over'
										divider={true}
										onPress={this._listItemPress.bind(this, rowData)}
									/>			
								}else{
									return <ListItem 
										centerElement={rowData} 
										rightElement='lock-open'
										divider={true}
										onPress={this._listItemPress.bind(this, rowData)}
									/>
								}
							}
						}
					/>
				</View>
			</View>
		);
	}

	_onRefresh(){
		this.setState({refreshing: true});	

		//fetch function here
		fetchMyRooms('http://' + server + ':8080/api/fetch_my_rooms/');
		this.setState({refreshing: false});
	}

	_listItemPress(data){
		const { navigate } = this.props.navigation;
		navigate('LabDetail', {
			room: this.state.rooms.find(this._findByName, data),
		});
	}

	_findByName(element, name){
		return element ==  name;
	}

}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	listContainer: {
		flex: 1,
		justifyContent: 'center',
	},
});
