import React from "react";
import { DocumentPicker, FileSystem } from "expo";
import { ScrollView, StyleSheet, View, Image, Text } from "react-native";
import { Button } from "../components/ButtonWithMargin";

export default class HomeAuthScreen extends React.Component {
  static navigationOptions = { title: "Welcome" };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: "center" }}>
            {this.renderMobLogo()}
            {this.renderKlmLogo()}
          </View>
          <Button title="Register" onPress={this._signUp} />
        </ScrollView>
        <View>{this.renderPowerBy()}</View>
      </View>
    );
  }

  renderPowerBy() {
    return (
      <Text
        style={{
          paddingLeft: 10,
          paddingBottom: 25,
          fontSize: 14
        }}
      >
        powerd by The Beagels
      </Text>
    );
  }

  renderMobLogo() {
    return (
      <Image
        style={{
          width: "70%",
          resizeMode: "contain",
          marginBottom: 100
        }}
        source={require("../assets/images/mobidl.png")}
      />
    );
  }

  renderKlmLogo() {
    return (
      <Image
        style={{
          width: "100%",
          height: 100,
          resizeMode: "contain",
          marginBottom: 5
        }}
        source={require("../assets/images/KLM.png")}
      />
    );
  }

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
