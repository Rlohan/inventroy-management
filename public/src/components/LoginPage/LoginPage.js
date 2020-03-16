import React, { useRef, useState } from "react";
import axios from "../../axios-config";

const LoginPage = props => {
  const passwordEl = useRef(null);
  const emailEl = useRef(null);
  const usernameEl = useRef(null);
  const [disableButton, setDisableButton] = useState(true);
  const [signUpState, setSignUpState] = useState(true);
  const [buttonLabel, setButtonLabel] = useState({
    buttonText: "Sign Up",
    switchButton: "Switch to Log In"
  });
  let signInBtnClasses = ["btn", "btn-danger"];
  let signInBtnStyle = {
    cursor: "not-allowed"
  };
  if (!disableButton) {
    signInBtnClasses = ["btn", "btn-primary"];
    signInBtnStyle = {};
  }

  const handleSignIn = e => {
    e.preventDefault();
    const password = passwordEl.current.value;
    const email = emailEl.current ? emailEl.current.value : "";
    const username = usernameEl.current.value;
    if (signUpState) {
      signUpApiCall(username, email, password);
    } else {
      loginApiCall(username, password);
    }
  };

  const loginApiCall = (username, password) => {
    axios
      .post("/api/accounts/login", {
        username: username,
        password: password
      })
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem(
          "access_token",
          JSON.stringify(response.data.token)
        );

        props.loginUser();
        props.history.push("/product-list");
      })
      .catch(function(error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.code === "credentials_invalid"
        ) {
          alert("Login credentials are not correct.");
        } else alert("Something went wrong. Please try again.");
      });
  };

  const signUpApiCall = (username, email, password) => {
    axios
      .post("/api/accounts", {
        username: username,
        email: email,
        password: password
      })
      .then(response => {
        setSignUpState(false);
        switchSignUp();
        alert("You have signed up successfully. Please login to continue.");
      })
      .catch(error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 11000
        ) {
          alert(
            "Email Id already exists. Please login or sign up with different email."
          );
        }
      });
  };
  const checkValidForm = () => {
    const password = passwordEl.current.value;
    const email = emailEl.current ? emailEl.current.value : true;
    const username = usernameEl.current.value;
    if (password !== "" && email !== "" && username !== "") {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };
  const switchSignUp = () => {
    passwordEl.current.value = "";
    usernameEl.current.value = "";
    if (emailEl.current) {
      emailEl.current.value = "";
    }
    if (buttonLabel.switchButton.includes("Sign Up")) {
      setSignUpState(true);
      setButtonLabel({
        buttonText: "Sign Up",
        switchButton: "Switch to Log In"
      });
    } else {
      setSignUpState(false);
      setButtonLabel({
        buttonText: "Log In",
        switchButton: "Switch to Sign Up"
      });
    }
  };
  let emailDiv = null;
  if (signUpState) {
    emailDiv = (
      <div className="form-group row">
        <label
          className="control-label col-sm-3 col-md-2 text-light"
          htmlFor="email"
        >
          Email:
        </label>
        <div className="col-sm-9 col-md-9">
          <input
            ref={emailEl}
            className="form-control"
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            onBlur={checkValidForm}
          />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="row">
        <div className="col-md-12" />
      </div>
      <div className="row">
        <form
          className="form-horizontal offset-sm-2 col-sm-10 offset-md-3 col-md-7"
          onSubmit={handleSignIn}
        >
          <div className="form-group row">
            <label
              className="control-label col-sm-3 col-md-2 text-light"
              htmlFor="username"
            >
              Username:
            </label>
            <div className="col-sm-9 col-md-9">
              <input
                ref={usernameEl}
                className="form-control"
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                onBlur={checkValidForm}
              />
            </div>
          </div>
          {emailDiv}
          <div className="row">
            <label
              className="col-form-label col-sm-3 col-md-2 text-light"
              htmlFor="password"
            >
              Password:
            </label>
            <div className="col-sm-9 col-md-9">
              <input
                ref={passwordEl}
                className="form-control"
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                onKeyUp={checkValidForm}
                minLength="6"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="offse-md-2 col-md-12 offset-sm-2 col-sm-10">
              <div className="row">
                <div className="col-sm-5 col-md-3">
                  <button
                    className={signInBtnClasses.join(" ")}
                    disabled={disableButton}
                    style={signInBtnStyle}
                  >
                    {buttonLabel.buttonText}
                  </button>
                </div>
                <div className="col-sm-7 col-md-5">
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={switchSignUp}
                  >
                    {buttonLabel.switchButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
