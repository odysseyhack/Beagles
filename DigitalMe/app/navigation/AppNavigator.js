import { createStackNavigator, createSwitchNavigator, createAppContainer } from "react-navigation";
import Colors from "../constants/Colors";

import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import HomeAuthScreen from "../screens/HomeAuthScreen";
import SignUpScreen from "../screens/SignUpScreenScreen";
import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import WalletScreen from "../screens/WalletScreen";
import ScannerScreen from "../screens/ScannerScreen";

const defaultNavigtionOptions = {
  headerStyle: {
    backgroundColor: Colors.primary
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold"
  }
};

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    Scanner: ScannerScreen,
    Wallet: WalletScreen,
    Transactions: TransactionsScreen
  },
  {
    defaultNavigationOptions: defaultNavigtionOptions
  }
);

const AuthStack = createStackNavigator(
  {
    HomeAuth: HomeAuthScreen,
    SignUp: SignUpScreen
  },
  {
    defaultNavigationOptions: defaultNavigtionOptions
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
