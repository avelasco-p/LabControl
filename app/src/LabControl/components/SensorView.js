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
			status: props.room.status,
		};
	}

	render(){
		const { value, icon, room, sensVal } = this.props;

		return(
			<Card style={{ container: { flex:1, justifyContent: 'center', alignItems: 'center', } }}>
				<Text style={styles.header}>{ value }</Text>
				<Image 
					source={ icon }	
					style={ styles.icon }
				/>
				<Text style={ styles.sensor }> { sensVal }</Text>
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
	sensor: {
		textAlign: 'center',
		fontSize: 16,
	},	
	icon: {
		justifyContent: 'center',
		margin: 20,
		width: 100,
		height: 100,
	},
});
