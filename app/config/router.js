import React from 'react';
import { StackNavigator } from 'react-navigation';

//screens
import Main from '../src/LabControl/Main';
import Login from '../src/LabControl/scenes/Login';
import LabList from '../src/LabControl/scenes/LabList';
import LabDetail from '../src/LabControl/scenes/LabDetail';

const Navigator = StackNavigator({
	Main: {
		screen: Main, 	
	},				
	Login: {
		screen: Login,
	},
	LabList: {
		screen: LabList,
	},
	LabDetail: {
		screen: LabDetail,
	},
}, { headerMode: 'none' });

export default Navigator;
