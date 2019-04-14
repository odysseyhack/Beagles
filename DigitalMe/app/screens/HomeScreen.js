import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/ButtonWithMargin";
import { Loader } from "../components/Loader";
import { textStyles } from "../constants/Styles";
import { bindActionCreators } from "redux";
import { signOffUser } from "../redux/store/userStore";
import { connect } from "react-redux";

class HomeScreen extends React.Component {
  static navigationOptions = { title: "MobID" };

  render() {
    if (this.props.loading) {
      return <Loader />;
    } else {
      return this._renderHome();
    }
  }

  _renderHome() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          {this.props.passport.faceImage && this._renderImage()}
        </View>
        <View style={styles.viewContainer}>
          <Text style={textStyles.headerText}>
            Hello {this.props.passport.firstName}
          </Text>
          {this._renderButtons()}
        </View>
      </ScrollView>
    );
  }

  _renderButtons() {
    return (
      <>
        <Button title="Barcode scanner" onPress={this._openScanner} />
        <Button title="Wallet" onPress={this._openWallet} />
        <Button title="Transactions" onPress={this._openTransactions} />
        <Button title="Forget me" onPress={this._signOutAsync} />
      </>
    );
  }

  _renderImage() {
    return (
      <Image
        style={{
          borderRadius: 10,
          width: 200,
          height: 200,
          resizeMode: "contain"
        }}
        source={{
          uri: "data:image/png;base64," + this.props.passport.faceImage
        }}
      />
    );
  }

  _signOutAsync = async () => {
    try {
      this.props.actions.signOffUser(this.props.passport.mobIdToken);
      this.props.navigation.navigate("Auth");
    } catch (error) {
      if (error.message !== undefined) {
        Alert.alert(error.message);
      }
    }
  };

  _openScanner = () => {
    this.props.navigation.navigate("Scanner");
  };

  _openWallet = () => {
    this.props.navigation.navigate("Wallet");
  };

  _openTransactions = () => {
    this.props.navigation.navigate("Transactions");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
    justifyContent: "center"
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  viewContainer: {
    marginHorizontal: 50
  }
});

function mapStateToProps(state) {
  return {
    hasPassport: state.passport !== null,
    passport: state.passport,
    booking: state.booking,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = dispatch => ({
  actions: {
    signOffUser: bindActionCreators(signOffUser, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
