import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
// import HomePage from "./home/HomePage";
import InfoRequest from "./code/InfoRequestPage";

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Switch>
        <Route exact path="/" component={InfoRequest} />
        <Route
          path="/request/:type"
          render={props => (
            <InfoRequest key={props.match.params.type} {...props} />
          )}
        />
        {/* <Route path="/request/:type" component={InfoRequest} /> */}
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}

export default App;
