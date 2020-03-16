import React from "react";

const notFound = props => {
  const loadLogin = () => props.history.replace("/login");
  return (
    <div className="row">
      <div className="col-md-4 offset-md-4 col-sm-8 offset-sm-3">
        <h1 style={{ color: "#dc3545" }}>{props.loggedIn?"404 Not Found!":"401 Unauthorised!"}</h1>
        <h5 style={{ color: "white" }}>
          {props.loggedIn
            ? "The page that you are looking for is not there!"
            : "You are not allowed on this page! Please login to get access."}
        </h5>
        {!props.loggedIn ? (
          <button
            className="offset-md-2 offset-sm-4 btn btn-primary"
            onClick={loadLogin}
          >
            Go to login
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default notFound;
