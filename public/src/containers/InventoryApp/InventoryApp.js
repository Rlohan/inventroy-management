import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import axios from "../../axios-config";
import "./InventoryApp.css";
import NotFound from "../../components/404-Not-Found/NotFound";
import LoginPage from "../../components/LoginPage/LoginPage";
import Header from "../../components/Header/Header";

const ProductList = React.lazy(() => import("../ProductList/ProductList"));
const Logout = React.lazy(() => import("../../components/Logout/Logout"));

class InventoryApp extends Component {
  state = {
    loggedIn: false,
    editMode: false,
    enableButton: true
  };

  changeState = (editMode, enableButton) => {
    this.setState({
      editMode: editMode,
      enableButton: enableButton
    });
  };

  loginUserHandler = () => {
    this.setState({
      loggedIn: true
    });
  };

  signOutHandler = () => {
    const auth_token = JSON.parse(localStorage.getItem("access_token"));
    axios
      .post(
        "/api/accounts/logout",
        {},
        { headers: { Authorization: auth_token } }
      )
      .then(response => {
        this.setState({
          loggedIn: false
        });
        localStorage.setItem("user", JSON.stringify([]));
        localStorage.setItem("access_token", JSON.stringify(""));
      })
      .catch(error => {});
  };
  render() {
    let guardedRoutes = null;
    let routes = (
      <Switch>
        {guardedRoutes}
        <Route
          path="/login"
          render={props => {
            return <LoginPage {...props} loginUser={this.loginUserHandler} />;
          }}
        ></Route>
        <Route
          path="/logout"
          render={props => {
            return (
              <Suspense fallback={<div>Loading...</div>}>
                <Logout {...props} loggedIn={this.state.loggedIn} />
              </Suspense>
            );
          }}
        ></Route>
        <Redirect exact from="/" to="/login"></Redirect>
        <Route
          render={props => (
            <NotFound {...props} loggedIn={this.state.loggedIn} />
          )}
        ></Route>
      </Switch>
    );
    if (this.state.loggedIn) {
      routes = (
        <Switch>
          <Route
            path="/product-list"
            render={props => (
              <Suspense fallback={<div>Loading...</div>}>
                <ProductList
                  {...props}
                  editMode={this.state.editMode}
                  enableButton={this.state.enableButton}
                  changeState={this.changeState}
                />
              </Suspense>
            )}
          ></Route>
          <Route
            path="/login"
            render={props => {
              return <LoginPage {...props} loginUser={this.loginUserHandler} />;
            }}
          ></Route>
          <Route
            path="/logout"
            render={props => {
              return (
                <Suspense fallback={<div>Loading...</div>}>
                  <Logout {...props} loggedIn={this.state.loggedIn} />
                </Suspense>
              );
            }}
          ></Route>
          <Redirect exact from="/" to="/login"></Redirect>
          <Route
            render={props => (
              <NotFound {...props} loggedIn={this.state.loggedIn} />
            )}
          ></Route>
        </Switch>
      );
    }

    return (
      <>
        <Header
          showButton={this.state.loggedIn}
          signOut={this.signOutHandler}
        />
        <div className="container">
          <br></br>
          <br></br>
          {routes}
        </div>
      </>
    );
  }
}

export default InventoryApp;
