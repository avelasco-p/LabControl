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

let SharedPreferences = require('react-native-shared-preferences');

const resetAction = NavigationActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: 'Main'  }),
	],
});


fetchData = () => {
	alert('fetching data');	
};


export default class LabList extends Component{
	constructor(props){
		super(props);

		let labs = [];

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			dataSource: ds.cloneWithRows([
				'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',		      
			]),
			refreshing: false,			
		};
	}

	_onRefresh(){
		this.setState({refreshing: true});	
		//fetch function here
		setTimeout(() => {
			this.setState({refreshing: false});
		}, 2000);

		/*fetchData().then(() => {
			this.setState({refreshing: false});	
			alert('ended refreshing');
		});*/
	}
	
	render(){
		const { token } = this.props;
		const { navigate, dispatch } = this.props.navigation;

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
							(rowData) => 
								<ListItem 
									centerElement={rowData} 
									divider={true}
									onPress={this._listItemPress.bind(this, rowData)}
								/>
						}
					/>
				</View>
			</View>
		);
	}

	_listItemPress(data){
		const { navigate } = this.props.navigation;
		navigate('LabDetail', {
			name: data,
		});
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
