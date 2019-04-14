import React from "react";
import {
  Alert,
  Image,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet
} from "react-native";
import { Button } from "../components/ButtonWithMargin";
import { Input } from "../components/Input";
import { Loader } from "../components/Loader";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { registerPassport } from "../redux/store/passportStore";

class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: "Register"
  };

  state = {
    username: "",
    password: "",
    passportData: this.props.navigation.getParam("passportData", null)
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  signUp = async () => {
    const { username, password, passportData } = this.state;
    try {
      // here place your signup logic
      console.log("user successfully signed up!: ", success);
    } catch (err) {
      console.log("error signing up: ", err);
    }
  };

  render() {
    if (this.props.loading) {
      return <Loader />;
    } else {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                width: "100%",
                height: 300,
                resizeMode: "contain",
                marginBottom: 50
              }}
              source={{
                uri:
                  "data:image/png;base64," +
                  this.state.passportData.documentImage
              }}
            />
          </View>
          {/* 
          <Input
            label="Username"
            onChangeText={val => this.onChangeText("username", val)}
          />
          <Input
            label="Password"
            secureTextEntry={true}
            onChangeText={val => this.onChangeText("password", val)}
          />
          */}

          <Button onPress={this.handleSignup} title="Sign Up" />
          <Button onPress={this.handleCancel} title="Cancel" />

          {/* {this.props.hasPasport ? (
              <Text>{JSON.stringify(this.props.passport)}</Text>
            ) : (
              <Text>has no passport</Text>
            )} */}
        </ScrollView>
      );
    }
  }

  handleSignup = async () => {
    //if (!this.state.username) {
    //  Alert.alert("Please enter a username");
    //} else if (!this.state.password) {
    //  Alert.alert("Please enter a password");
    //} else {
      try {
        const result = await this.props.actions.registerPassport(
          this.state.username,
          this.state.password,
          this.state.passportData
        );
        if (result === true) this.props.navigation.navigate("Home");
      } catch (error) {
        Alert.alert(error);
      }
    //}
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
    //alignItems: "center"
  }
});

const mapDispatchToProps = dispatch => ({
  actions: { registerPassport: bindActionCreators(registerPassport, dispatch) }
});

export default connect(
  state => ({ loading: state.apiCallsInProgress > 0 }),
  mapDispatchToProps
)(SignUpScreen);
