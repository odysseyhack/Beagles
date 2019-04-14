import React from "react";
import { Alert, Image, View, ScrollView, StyleSheet } from "react-native";
import { Button } from "../components/ButtonWithMargin";
import { Loader } from "../components/Loader";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { registerPassport } from "../redux/store/passportStore";

class SignUpScreen extends React.Component {
  static navigationOptions = { title: "Register" };
  state = {
    passportData: this.props.navigation.getParam("passportData", null)
  };

  onChangeText = (key, val) => this.setState({ [key]: val });

  render() {
    if (this.props.loading) {
      return <Loader />;
    } else {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: "center" }} />
          {this.renderPassportImage()}
          <Button onPress={this.handleSignup} title="Sign Up" />
          <Button onPress={this.handleCancel} title="Cancel" />
        </ScrollView>
      );
    }
  }

  renderPassportImage() {
    return (
      <Image
        style={{
          width: "100%",
          height: 300,
          resizeMode: "contain",
          marginBottom: 50
        }}
        source={{
          uri: "data:image/png;base64," + this.state.passportData.documentImage
        }}
      />
    );
  }

  handleSignup = async () => {
    try {
      const result = await this.props.actions.registerPassport(this.state.passportData);
      if (result === true) this.props.navigation.navigate("Home");
    } catch (error) {
      if (error && error.message) Alert.alert(error.message);
    }
  };

  handleCancel = () => {
    this.props.navigation.navigate("HomeAuth");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 15
  }
});

export default connect(
  state => ({ loading: state.apiCallsInProgress > 0 }),
  dispatch => ({
    actions: {
      registerPassport: bindActionCreators(registerPassport, dispatch)
    }
  })
)(SignUpScreen);
