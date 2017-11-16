import React, { Component } from 'react';
import { 
	Navigator, 
	Text,
	View,
	TextInput,	
	ListView,
	StyleSheet,
} from 'react-native';

import { 
	COLOR, 
	ThemeProvider,
	Button,
	ListItem,
	Toolbar,
} from '../../node_modules/react-native-material-ui';

let SharedPreferences = require('../../node_modules/react-native-shared-preferences');

export default class LabList extends Component{
	constructor(props){
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.state = {
				dataSource: ds.cloneWithRows([
					'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',		      
					'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',
					'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',
				])		    
		};
	}

	render(){
		const { auth } = this.props;

		return (
			<View style={styles.mainContainer}>
				<Toolbar 
					centerElement="Laboratorios"	
					rightElement='more-vert'
				/>	
				<View style={styles.listContainer}>
					<ListView 
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
		alert('Pressed: ' + data);			
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
