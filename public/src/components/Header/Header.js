import React from "react";
import { NavLink } from "react-router-dom";

const header = props => {
  let button = null;
  if (props.showButton) {
    button = (
      <NavLink
        to="/logout"
        className="nav-link"
        activeClassName="active"
        onClick={props.signOut}
      >
        Logout
      </NavLink>
    );
  }
  return (
    <>
      <nav className="NabBar-Background navbar navbar-expand-lg">
        <h2 className="navbar-brand" style={{ cursor: "pointer" }}>
          Product Manager
        </h2>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                to="/product-list"
                exact
                className="nav-link"
                activeClassName="active"
              >
                Product List
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav border-left">
            <li className="nav-item">{button}</li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default header;
