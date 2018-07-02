import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import SharedPreferences from 'react-native-shared-preferences';

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
      const { room } = props.navigation.state.params;

      this.server = values[0]
      this.token = values[1];
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Toolbar
          centerElement="Lugares Permitidos"/>
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
