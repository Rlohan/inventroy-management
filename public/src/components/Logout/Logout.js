import React from "react";

const logout = props => {
  const loadLogin = () => props.history.replace("/login");
  let logout = (
    <div className="col-md-4 offset-md-4 col-sm-8 offset-sm-3">
      ><h5 style={{ color: "white" }}>You have logged out successfully.</h5>
      <button
        className="offset-md-3 offset-sm-4 btn btn-primary"
        onClick={loadLogin}
      >
        Go to login
      </button>
    </div>
  );
  if (props.loggedIn) {
    logout = (
      <div className="col-md-5 offset-md-3 col-sm-8 offset-sm-3">
        <h5 style={{ color: "white" }}>
          Something went wrong while logging out.
        </h5>
      </div>
    );
  }
  return <div className="row">{logout}</div>;
};

export default logout;
