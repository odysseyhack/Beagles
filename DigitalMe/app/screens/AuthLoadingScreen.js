import React from "react";
import { connect } from "react-redux";
import { Loader } from "../components/Loader";

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this.props.navigation.navigate(this.props.hasUser ? "App" : "Auth");
  }

  render() {
    return <Loader />;
  }
}

const mapStateToProps = state => ({ hasUser: state.user !== null });

export default connect(mapStateToProps)(AuthLoadingScreen);
