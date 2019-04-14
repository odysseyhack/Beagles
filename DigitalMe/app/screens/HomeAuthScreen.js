import React from "react";
import { DocumentPicker, FileSystem } from "expo";
import { ScrollView, StyleSheet, View, Image, Text } from "react-native";
import { Button } from "../components/ButtonWithMargin";

export default class HomeAuthScreen extends React.Component {
  static navigationOptions = {
    title: "Welcome"
  };

  /*
  componentDidMount() {
    this.checkDeviceForHardware();
  }

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert("Biometrics not supported on this device");
      return;
    }
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (isEnrolled) {
      this.setState({ supportBioMetrics: isEnrolled });
      Alert.alert("Biometrics supported and set up by user:)");
    }

    // onderstaand zou aangeroepen kunnen worden wanneer 'accept' geklikt wordt
    // auke, moeten op bij authenticatie wel iets tonen naar de gebruiker. zie commentaar:
    // Attempts to authenticate via Fingerprint. Android: When using the fingerprint
    // module on Android, you need to provide a UI component to prompt the user to scan their fingerprint,
    // as the OS has no default alert for it.
    // const result = await LocalAuthentication.authenticateAsync("Prompted message").
    //   if (result.success === true) {
    //     // authenticate successfully
    //   } else {
    //     // failed to authenticate
    //   }
  };
  */

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: "70%",
                resizeMode: "contain",
                marginBottom: 100
              }}
              source={require("../assets/images/mobidl.png")}
            />
            <Image
              style={{
                width: "100%",
                height: 100,
                resizeMode: "contain",
                marginBottom: 5
              }}
              source={require("../assets/images/KLM.png")}
            />
          </View>
          <Button title="Register" onPress={this._signUp} />
        </ScrollView>
        <View><Text
          style={{
            paddingLeft: 10,
            paddingBottom: 25,
            fontSize: 14,
          }}>powerd by The Beagels</Text></View>
      </View>
    );
  }
//<Button title="Sign in" onPress={this._signIn} />
  _signIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  _signUp = async () => {
    const document = await DocumentPicker.getDocumentAsync();
    // { type: 'success', uri, name, size }
    if (document.type === "success") {
      const fileStringData = await FileSystem.readAsStringAsync(document.uri);
      const passportData = JSON.parse(fileStringData);
      this.props.navigation.navigate("SignUp", { passportData: passportData });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "center"
  }
});
