import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import CounterScreen from '../screens/CounterScreen/CounterScreen';
import { colorConfig } from '../config/config';
import AddCounterScreen from '../screens/AddCounterScreen/AddCounterScreen';
import ModifyScreen from '../screens/UpdateScreen/UpdateScreen';
import { Moment } from 'moment';

type params = {
  id: String,
  name: String,
  initialCount: Number,
  cycleLength: Number,
  lifeTime: Number,
  Today: Number,
  createdDate: Moment,
  lastUpdateDate: Moment
}

export type RootStackParamList = {
  DrawerRoot: undefined;
  AddCounter: undefined;
  Modify: params,
  Counter: params
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const DrawerRoot = () => (
  <Drawer.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: colorConfig.PRIMARY_COLOR
    },
    headerTitleAlign: 'center',
  }} initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="History" component={HistoryScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

const RootNavigator = () => (
  <Stack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: colorConfig.PRIMARY_COLOR
    },
    headerTitleAlign: 'center'
  }}>
    <Stack.Screen name="DrawerRoot" options={{
      headerShown: false
    }} component={DrawerRoot} />
    <Stack.Screen name="AddCounter" options={{
      headerShown: true,
      headerTitle: 'Add Counter'
    }} component={AddCounterScreen} />
    <Stack.Screen name="Modify" options={{
      headerShown: true,
      headerTitle: 'Modify'
    }} component={ModifyScreen} />
    <Stack.Screen name="Counter" options={{
      headerShown: true,
      headerTitle: 'Counter'
    }} component={CounterScreen} />
  </Stack.Navigator>
);

export default RootNavigator;
