import React from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import { Loader } from "../components/Loader";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../redux/store/transactionStore";

class TransactionsScreen extends React.Component {
  static navigationOptions = { title: "Transactions" };

  state = {
    transactionsItems: [],
    errorMessage: null,
    refresh: true
  };

  async componentDidMount() {
    try {
      const result = await this.props.getTransactionReport(this.props.mobIdToken);
      if (result.errorMessage === undefined) result.errorMessage = null;
      this.setState({
        transactionsItems: result.transactions,
        errorMessage: result.errorMessage,
        refresh: !this.state.refresh
      });
    } catch (error) {
      if (error.message !== undefined) {
        this.setState({ transactionsItems: [], errorMessage: error.message });
      }
    }
  }

  render() {
    if (this.props.loading) {
      return <Loader />;
    } else if (this.state.errorMessage !== null) {
      return this.renderError();
    } else {
      return this.renderTransactions();
    }
  }

  renderTransactions() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <FlatList
          data={this.state.transactionsItems}
          extraData={this.state.refresh}
          keyExtractor={(item, index) => "key" + index}
          renderItem={({ item }) => this.renderItem(item)}
        />
      </ScrollView>
    );
  }

  renderItem(item) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.requestType}</Text>
        <View>
          <Text style={styles.cardText}>{item.requestId}</Text>
          <Text style={styles.cardText}>{item.requestDate}</Text>
        </View>
      </View>
    );
  }

  renderError() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{this.state.errorMessage}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#eaece5",
    padding: 10,
    margin: 15
  },
  cardTitle: {
    fontSize: 20
  },
  cardText: {
    color: "#3b3a30",
    fontSize: 18
  }
});

export default connect(
  state => ({
    loading: state.apiCallsInProgress > 0,
    mobIdToken: state.passport.mobIdToken
  }),
  dispatch => bindActionCreators(actionCreators, dispatch)
)(TransactionsScreen);
