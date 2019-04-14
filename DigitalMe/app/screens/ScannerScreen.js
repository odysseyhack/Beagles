import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert,
  FlatList,
  TouchableOpacity
} from "react-native";
import { BarCodeScanner, Permissions, LocalAuthentication } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { acceptRequest, declineRequest } from "../redux/store/InfoRequestStore";
import { storeBooking } from "../redux/store/bookingStore";
import { bindActionCreators } from "redux";
import { textStyles } from "../constants/Styles";
import { connect } from "react-redux";
import { Button } from "../components/ButtonWithMargin";
import { Loader } from "../components/Loader";

class ScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    supportBioMetrics: false,
    infoRequest: null,
    errorMessage: null
  };
  static navigationOptions = { title: "Scan code" };

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
    }
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission, errorMessage } = this.state;
    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.props.loading) {
      return <Loader />;
    } else if (errorMessage !== null) {
      return this.renderError(errorMessage);
    } else if (this.state.infoRequest !== null) {
      return this.renderAuthorize();
    }
    return this.renderScanner();
  }

  renderError(errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.container}>{errorMessage}</Text>
        <Button onPress={this.handleCancel} title="Cancel" />
      </View>
    );
  }

  renderAuthorize() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={textStyles.headerText}>
          Info requested by {this.state.infoRequest.requestType}{" "}
          {this.state.infoRequest.accessPointId}
        </Text>
        {this.renderRequestedAttributes()}
        <View style={styles.confirmContainer}>
          {this.renderIcon(this.acceptRequest, "md-checkmark-circle", "green")}
          {this.renderIcon(this.declineRequest, "md-close-circle", "red")}
        </View>
      </ScrollView>
    );
  }

  renderIcon(onPress, iconName, color) {
    return (
      <TouchableOpacity activeOpacity={0.4} onPress={onPress} underlayColor="white">
        <Ionicons name={iconName} size={90} color={color} />
      </TouchableOpacity>
    );
  }

  renderRequestedAttributes() {
    return (
      <>
        <Text>Requested properties</Text>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.infoRequest.requestedAttributes}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Text style={textStyles.listItemText}>{item}</Text>}
        />
      </>
    );
  }

  renderScanner() {
    return (
      <>
        <View style={styles.container}>
          <BarCodeScanner onBarCodeRead={this.handleBarCodeRead} style={StyleSheet.absoluteFill} />
        </View>
        <View style={styles.container}>
          <Button onPress={this.handleCancel} title="Cancel" />
        </View>
      </>
    );
  }

  handleBarCodeRead = async ({ type, data }) => {
    if (data !== null && data !== undefined) {
      try {
        const request = JSON.parse(data);
        if (!(await this.getBooking(request))) {
          this.setState({ errorMessage: "Add a booking first!" });
          return;
        }
        if (request.infoRequest && request.infoRequest.requestId) {
          this.setState({ infoRequest: request.infoRequest });
          return;
        }
      } catch (error) {
        if (error && error.message) Alert.alert(error.message);
        return;
      }
    }
    Alert.alert("invalid code");
  };

  getBooking = async request => {
    let hasBooking = this.props.hasBooking === true;
    if (request.bookingDetails && request.bookingDetails.bookingId) {
      const result = await this.props.actions.storeBooking(
        request.bookingDetails,
        this.props.mobIdToken
      );
      hasBooking = result.processingOK;
    }
    return hasBooking;
  };

  acceptRequest = async () => {
    try {
      // var result = await LocalAuthentication.authenticateAsync(
      //   "Prompted message"
      // );
      var result = { success: true };
      if (result.success === true) {
        var result = await this.props.actions.acceptRequest(this.state.infoRequest);
        if (result === true) this.props.navigation.goBack();
      } else {
        return;
      }
    } catch (error) {
      if (error && error.message) Alert.alert(error.message);
    }
  };

  declineRequest = async () => {
    try {
      var result = await this.props.actions.declineRequest(
        this.state.infoRequest,
        this.props.mobIdToken
      );
      if (result === true) this.props.navigation.goBack();
    } catch (error) {
      if (error && error.message) Alert.alert(error.message);
    }
  };

  handleCancel = () => this.props.navigation.pop();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "center"
  },
  confirmContainer: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

function mapStateToProps(state) {
  return {
    loading: state.apiCallsInProgress > 0,
    mobIdToken: state.passport.mobIdToken,
    hasBooking: state.booking != null
  };
}

const mapDispatchToProps = dispatch => ({
  actions: {
    storeBooking: bindActionCreators(storeBooking, dispatch),
    acceptRequest: bindActionCreators(acceptRequest, dispatch),
    declineRequest: bindActionCreators(declineRequest, dispatch)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScannerScreen);
