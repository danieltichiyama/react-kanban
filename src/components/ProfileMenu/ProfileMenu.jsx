import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./ProfileMenu.module.scss";
import { actionsLogoutUser, actionsToggleModal } from "../../actions";
import { withRouter } from "react-router-dom";
import ToDoList from "../ToDoList";

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAssignedCards: false
    };
  }

  handleLogoutClick = () => {
    let id = JSON.parse(sessionStorage.getItem("user")).id;
    return this.props.dispatchLogoutUser(id);
  };

  handleMyProfileClick = e => {
    if (e) {
      e.stopPropagation();
    }
    return this.props.dispatchToggleModal("profile");
  };

  handleToDoClick = e => {
    if (e) {
      e.stopPropagation();
    }
    return this.setState({ showAssignedCards: !this.state.showAssignedCards });
  };

  render() {
    return (
      <ul className={styles.ProfileMenu}>
        <li className={styles.menu_li} onClick={this.handleMyProfileClick}>
          My Profile
        </li>
        <li className={styles.menu_li} onClick={this.handleToDoClick}>
          Assigned Card
        </li>
        {!this.state.showAssignedCards ? null : <ToDoList />}
        <li onClick={this.handleLogoutClick} className={styles.menu_li}>
          Logout
        </li>
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogoutUser: id => {
      return dispatch(actionsLogoutUser(id));
    },
    dispatchToggleModal: modal => {
      return dispatch(actionsToggleModal(modal));
    }
  };
};

export default withRouter(
  (ProfileMenu = connect(mapStateToProps, mapDispatchToProps)(ProfileMenu))
);
