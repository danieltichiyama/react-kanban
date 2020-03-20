import React from "react";
import "./App.scss";
import LoginPage from "../pages/LoginPage";
import ErrorPage from "../pages/ErrorPage";
import AppPage from "../pages/AppPage";
import BoardsList from "../components/BoardsList";
import Board from "../components/Board";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

let App = () => {
  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => {
          return sessionStorage.getItem("user") ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          );
        }}
      />
    );
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute path="/" exact={true} component={BoardsList} />
          <Route path="/login" exact={true} component={LoginPage} />
          <Route path="/register" exact={true} component={LoginPage} />
          <PrivateRoute path="/boards" exact={true} component={BoardsList} />
          <PrivateRoute path="/board" exact={true} component={Board} />
          <PrivateRoute path="/app" exact={true} component={AppPage} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
