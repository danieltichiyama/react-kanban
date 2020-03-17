import React, { Component } from "react";
import { connect } from "react-redux";
import { actionsRegisterUser } from "../../actions";
import styles from "./RegisterComponent.module.scss";

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      error: ""
    };
  }

  clearInput = () => {
    let defaultState = this.state;
    for (let key in defaultState) {
      defaultState[key] = "";
    }
    return this.setState(defaultState);
  };

  handleRegisterSubmit = e => {
    e.preventDefault();

    if (this.state.password !== this.state.confirmPassword) {
      return this.setState({ error: "passwords must match" });
    } else {
      this.props.dispatchRegisterSubmit(this.state);
      return this.clearInput();
    }
    //eventually will need to load LoginComponent
  };

  handleInput = event => {
    const { value, name } = event.target;
    const state = { ...this.state };
    state[name] = value;
    this.setState(state);
  };

  handleClose = () => {};

  handleLoginClick = () => {};

  render() {
    return (
      <div className={styles.registerComponent}>
        <form>
          <ul>
            <li className={styles.form_li}>
              <div className={styles.imgContainer}>
                <img
                  src="https://image.flaticon.com/icons/svg/25/25236.svg"
                  alt="email"
                  className={styles.reg_icon_img}
                />
              </div>
              <input
                type="text"
                name="email"
                value={this.state.email}
                onChange={this.handleInput}
                placeholder="Your email"
                className={styles.form_input}
              />
            </li>
            <li className={styles.form_li}>
              <div className={styles.imgContainer}>
                <img
                  src="https://image.flaticon.com/icons/svg/25/25239.svg"
                  alt="password"
                  className={styles.reg_icon_img}
                />
              </div>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInput}
                placeholder="Your password"
                className={styles.form_input}
              />
            </li>
            <li className={styles.form_li}>
              <div className={styles.imgContainer}></div>
              <input
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleInput}
                placeholder="Retype password"
                className={styles.form_input}
              />
            </li>
            <li className={styles.form_li}>
              {this.state.error ? (
                <p className={styles.error}>{this.state.error}</p>
              ) : null}
            </li>
          </ul>
          <button
            onClick={this.handleRegisterSubmit}
            className={styles.reg_button}
          >
            Register
          </button>
        </form>
        <div className={styles.options}>
          <div className={styles.AlreadyAMember}>
            <p>
              Already a member?{" "}
              <span
                className={styles.options_span}
                onClick={this.handleLoginClick}
              >
                Login
              </span>
            </p>
          </div>
          <div>
            <button className={styles.close_button} onClick={this.handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchRegisterUser: formData => {
      return dispatch(actionsRegisterUser(formData));
    }
  };
};

export default RegisterComponent = connect(
  null,
  mapDispatchToProps
)(RegisterComponent);
