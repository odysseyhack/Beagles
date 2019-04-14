import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Loader } from "../components/Loader";
import { Button } from "../components/ButtonWithMargin";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getWalletstatus } from "../redux/store/walletStore";
import { hackPassportNumber } from "../redux/store/passportStore";
import { Input } from "../components/Input";

class WalletScreen extends React.Component {
  static navigationOptions = {
    title: "Wallet"
  };
  state = { status: null, enableHack: false };

  async componentDidMount() {
    try {
      const result = await this.props.actions.getWalletstatus(this.props.mobIdToken);
      this.setState({ status: ({ valid, validUntil, errorMessage } = result) });
    } catch {
      this.setState({ status: null });
    }
  }

  _hackPassportNumber = () => {
    this.setState({ enableHack: !this.state.enableHack });
  };

  _hackPassportNumberChange = value => {
    this.props.actions.hackPassportNumber(value);
  };

  render() {
    const { passport, booking } = this.props;
    if (this.props.loading) {
      return <Loader />;
    } else {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container}>{this.renderPassportCard(passport)}</View>
          <View style={styles.container}>{this.renderBookingCard(booking)}</View>
        </ScrollView>
      );
    }
  }

  renderBookingCard(booking) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Booking</Text>
        {booking !== null && this.renderBookingDetails(booking)}
      </View>
    );
  }

  renderBookingDetails(booking) {
    return (
      <View>
        <Text style={styles.cardText}>Id: {booking.bookingId}</Text>
        <Text style={styles.cardText}>Airline: {booking.airlineId}</Text>
        <Text style={styles.cardText}>Lounges: {booking.loungeAccess}</Text>
        <Text style={styles.cardText}>Travel type: {booking.travelType}</Text>
        <Text style={styles.cardText}>Travel date: {booking.travelDate}</Text>
        <Button title="revoke" />
      </View>
    );
  }

  renderPassportCard(passport) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Passport</Text>
        {this.state.status !== null && (
          <Text style={styles.cardText}>Token valid until: {this.state.status.validUntil}</Text>
        )}
        <View>
          {this.renderPassportDetails(passport)}
          <Button title="revoke" />
          <Button title="hack" onPress={this._hackPassportNumber} />
        </View>
      </View>
    );
  }

  renderPassportDetails(passport) {
    return (
      <>
        {this.renderPassportNumber(passport)}
        <Text style={styles.cardText}>Name: {passport.lastName}</Text>
        <Text style={styles.cardText}>First name: {passport.firstName}</Text>
        <Text style={styles.cardText}>Date of birth: {passport.dateOfBirth}</Text>
        <Text style={styles.cardText}>Nationality: {passport.issueCountry}</Text>
        <Text style={styles.cardText}>Date of issue: {passport.issueDate}</Text>
        <Text style={styles.cardText}>Date of expiry: {passport.expiryDate}</Text>
      </>
    );
  }

  renderPassportNumber(passport) {
    return (
      <>
        {this.state.enableHack ? (
          <Input
            label="hack documentNumber"
            value={passport.documentNumber}
            onChangeText={this._hackPassportNumberChange}
          />
        ) : (
          <Text style={styles.cardText}>documentNumber: {passport.documentNumber}</Text>
        )}
      </>
    );
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

const mapDispatchToProps = dispatch => ({
  actions: {
    getWalletstatus: bindActionCreators(getWalletstatus, dispatch),
    hackPassportNumber: bindActionCreators(hackPassportNumber, dispatch)
  }
});

export default connect(
  state => ({
    loading: state.apiCallsInProgress > 0,
    mobIdToken: state.passport.mobIdToken,
    passport: state.passport,
    booking: state.booking
  }),
  mapDispatchToProps
)(WalletScreen);
