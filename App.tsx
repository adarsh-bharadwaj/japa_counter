import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from 'react-redux';
import jailMonkey from 'jail-monkey'
import { Alert, BackHandler, useColorScheme } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { config } from './src/config/config';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AppInner = () => {
  const { i18n } = useTranslation();
  const isDarkMode=useColorScheme();

  const setLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem('language');
      console.log({ value });
      if (value !== null) {
        i18n.changeLanguage(value)
      }
      else {
        i18n.changeLanguage('en')
      }
    }
    catch (e) {
      console.log({ e })
    }
  }

  const rootDeviceCheck = async () => {
    if (jailMonkey.isJailBroken()) {
      exitAlert("The Device Is Rooted");
    }
  }

  const checkIfDeviceIsEmulator = async () => {
    if (await DeviceInfo.isEmulator()) {
      exitAlert("The device is an emulator.")
    }
  }

  const exitAlert = (message: string) => {
    Alert.alert("Warning", message, [{
      text: "Exit",
      onPress: () => BackHandler.exitApp()
    }])
  }
  const securityChecks = async () => {
    rootDeviceCheck();
    checkIfDeviceIsEmulator();
  }
  React.useEffect(() => {
    if (config.ENABLE_SECURITY_CHECKS)
      securityChecks();
    setLanguage();
  }, [])
  return (
    // <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
    <NavigationContainer theme={isDarkMode=="dark"?{...DefaultTheme,colors: {...DefaultTheme.colors,background: 'black',}}:DefaultTheme}>
  {/* <ThemedView> */ }
  < RootNavigator />
  {/* </ThemedView> */ }
    </NavigationContainer >
  );
};

const App = () => (
  <AppInner />
);

export default App;
