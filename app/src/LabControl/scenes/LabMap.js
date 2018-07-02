import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {
  COLOR,
  Toolbar
} from 'react-native-material-ui'
import SharedPreferences from 'react-native-shared-preferences';
import { NavigationActions } from 'react-navigation';
import MapView, { Circle, Marker } from 'react-native-maps';
import _ from 'lodash';

const backAction = NavigationActions.back();
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
  ],
});

export default class LabNap extends React.Component {
  constructor(props) {
    super(props);

    this.server = null;
    this.token = null;

    this.state = {
      pos: null
    };

    SharedPreferences.getItems(['server', 'auth_token'], (values) => {
	  navigator.geolocation.getCurrentPosition((pos) => {
		const { room } = props.navigation.state.params;

		this.server = values[0]
		this.token = values[1];
		this.setState({pos: pos.coords});
	  });
    });

	this._renderCircles = this._renderCircles.bind(this);
  }

  _renderCircles() {
	const { room } = this.props.navigation.state.params;
	return _.map(room.coordinates, (c) => {
	  const { latitude, longitude, radius } = c.data
	  console.log('c.data', c.data);
	  return (
		<Circle
		  key={c.latitude + c.name}
		  fillColor="rgba(255,0,0,0.5)"
		  radius={radius}
		  center={{ latitude, longitude }}/>
	  );
	});
  }

  render() {
	const pos = this.state.pos || {
	  latitude: 0,
	  longitude: 0
	};
    return (
      <View style={styles.mainContainer}>
        <Toolbar
		  leftElement="arrow-back"
		  onLeftElementPress={this.props.navigation.goBack}
          centerElement="Lugares Permitidos"/>
		<MapView
		  initialRegion={{
			...pos,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421
		  }}
		  style={styles.mainContainer}>
		  {this._renderCircles()}
		  <Marker coordinate={pos}/>
		</MapView>
      </View>
    );
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
