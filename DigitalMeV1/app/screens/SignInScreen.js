import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../redux/store/userStore";
import { Button } from "../components/ButtonWithMargin";
import { Input } from "../components/Input";
import { Loader } from "../components/Loader";

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Sign in"
  };
  state = {
    username: "swartdev1",
    password: "Test123"
  };

  render() {
    if (this.props.loading) {
      return <Loader />;
    } else {
      return (
        <View style={styles.container}>
          <Input
            label="Username"
            style={styles.input}
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
          />

          <Input
            label="Password"
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            secureTextEntry={true}
          />

          <Button onPress={this.handleSignIn} title="Login" />
          <Button onPress={this.handleCancel} title="Cancel" />

          {this.props.user !== null ? (
            <Text>{JSON.stringify(this.props.user)}</Text>
          ) : (
            <Text>has no user</Text>
          )}
        </View>
      );
    }
  }

  handleSignIn = async () => {
    if (!this.state.username) {
      Alert.alert("Please enter a username");
    } else if (!this.state.password) {
      Alert.alert("Please enter a password");
    } else {
      try {
        var result = await this.props.actions.signInUser(
          this.state.username,
          this.state.password
        );
        if (result.isValid) this.props.navigation.navigate("Home");
      } catch (error) {
        Alert.alert(error);
      }
    }
  };

  handleCancel = () => {
    this.props.navigation.navigate("HomeAuth");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    padding: 15
  }
});

// function mapStateToProps(state) {
//   return {
//     user: state.user,
//     loading: state.apiCallsInProgress > 0
//   };
// }

const mapStateToProps = state => ({
  user: state.user,
  loading: state.apiCallsInProgress > 0
});

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: {
//       signInUser: bindActionCreators(userActions.signInUser, dispatch)
//     }
//   };
// }
const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInScreen);
