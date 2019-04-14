import React from "react";
import {
  Alert,
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet
} from "react-native";
import { Loader } from "../components/Loader";
import { Button } from "../components/ButtonWithMargin";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../redux/store/walletStore";

class WalletScreen extends React.Component {
  static navigationOptions = {
    title: "Wallet"
  };

  state = { status: null };

  async componentDidMount() {
    try {
      const result = await this.props.getWalletstatus(this.props.mobIdToken);
      this.setState({ status: ({ valid, validUntil, errorMessage } = result) });
    } catch (error) {
      Alert.alert(error);
      this.setState({ transactionsItems: [] });
    }
  }

  render() {
    const { passport, booking } = this.props;
    if (this.props.loading) {
      return <Loader />;
    } else {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Passport</Text>
              {this.state.status !== null && (
                <Text style={styles.cardText}>
                  Token valid until: {this.state.status.validUntil}
                </Text>
              )}
              <View>
                <Text style={styles.cardText}>Name: {passport.lastName}</Text>
                <Text style={styles.cardText}>
                  First name: {passport.firstName}
                </Text>
                <Text style={styles.cardText}>
                  Date of birth: {passport.dateOfBirth}
                </Text>
                <Text style={styles.cardText}>
                  Nationality: {passport.issueCountry}
                </Text>
                <Text style={styles.cardText}>
                  Date of issue: {passport.issueDate}
                </Text>
                <Text style={styles.cardText}>
                  Date of expiry: {passport.expiryDate}
                </Text>
                <Button title="revoke" />
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Booking</Text>
              {booking !== null && (
                <View>
                  <Text style={styles.cardText}>Id: {booking.bookingId}</Text>
                  <Text style={styles.cardText}>
                    Airline: {booking.airlineId}
                  </Text>
                  <Text style={styles.cardText}>
                    Lounges: {booking.loungeAccess}
                  </Text>
                  <Text style={styles.cardText}>
                    Travel type: {booking.travelType}
                  </Text>
                  <Text style={styles.cardText}>
                    Travel date: {booking.travelDate}
                  </Text>
                  <Button title="revoke" />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    backgroundColor: "#eaece5",
    padding: 10,
    margin: 15
  },
  cardTitle: {
    fontSize: 22,
    paddingBottom: 8
  },
  cardBody: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardText: {
    color: "#3b3a30",
    fontSize: 18
  }
});

export default connect(
  state => ({
    loading: state.apiCallsInProgress > 0,
    mobIdToken: state.passport.mobIdToken,
    passport: state.passport,
    booking: state.booking
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(WalletScreen);
