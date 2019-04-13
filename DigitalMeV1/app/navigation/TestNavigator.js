import React from "react";
import {
  View,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";
import { Platform } from "react-native";
import { SecureStore } from "expo";

import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/SignUpScreenScreen";
import SettingsScreen from "../screens/SettingsScreen";
import BarCodeScannerScreen from "../screens/BarCodeScannerScreen";
import SignInScreen from "../screens/SignInScreen";
import WelcomeScreen from "../screens/HomeAuthScreen";

class LoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }
  // componentDidMount() {
  //   this._bootstrapAsync();
  // }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // const userToken = await SecureStore.getItemAsync("userToken");
    // const initialRouteName = userToken ? "App" : "Auth";
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({
  Home: HomeScreen,
  // Other: OtherScreen,
  // Scanner: BarCodeScannerScreen,
  // Settings: SettingsScreen
});
const AuthStack = createStackNavigator({
  Welcome: WelcomeScreen,
  // SignIn: SignInScreen,
  // Register: RegisterScreen
});

export default createAppContainer(
  createSwitchNavigator({
    App: AppStack,
    Auth: AuthStack,
    Loading: LoadingScreen
  },
  {
    initialRouteName: 'Loading'
  })
);