import React, { Component }from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableHighlight,	
} from 'react-native';

import {
	Card,	
} from 'react-native-material-ui';

export default class SensorView extends Component {
	constructor(props){
		super(props);

		this.state = {
				
		};
	}

	render(){
		const { value, icon, action } = this.props;

		return(
			<Card style={{ container: { flex:1, justifyContent: 'center', } }}>
				<Text style={styles.header}>{ value }</Text>
			</Card>	
		)
	}
}

const styles = StyleSheet.create({
	header: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
	},
});
