import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./ProfileMenu.module.scss";
import { actionsLogoutUser, actionsToggleModal } from "../../actions";
import { withRouter } from "react-router-dom";
import ToDoList from "../ToDoList";
import EditProfileMenu from "../EditProfileMenu";

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAssignedCards: false,
      showEditProfile: false
    };
  }

  handleLogoutClick = () => {
    let id = JSON.parse(sessionStorage.getItem("user")).id;
    return this.props.dispatchLogoutUser(id);
  };

  handleMyProfileClick = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    return this.setState({ showEditProfile: !this.state.showEditProfile });
  };

  handleToDoClick = e => {
    if (e) {
      e.stopPropagation();
    }
    return this.setState({ showAssignedCards: !this.state.showAssignedCards });
  };

  render() {
    return (
      <div
        className={styles.ProfileMenu_container}
        onClick={this.props.toggleThis}
      >
        <ul className={styles.ProfileMenu}>
          <div className={styles.menuHeader}>
            <h3>Profile Menu</h3>
            <button
              className={styles.exitButton}
              onClick={this.props.toggleThis}
            ></button>
          </div>
          <hr></hr>
          <li className={styles.menu_li} onClick={this.handleMyProfileClick}>
            My Profile
          </li>
          {!this.state.showEditProfile ? null : (
            <EditProfileMenu toggleThis={this.handleMyProfileClick} />
          )}
          <li className={styles.menu_li} onClick={this.handleToDoClick}>
            Assigned Card
          </li>
          {!this.state.showAssignedCards ? null : (
            <ToDoList closeProfileMenu={this.props.toggleThis} />
          )}
          <li onClick={this.handleLogoutClick} className={styles.menu_li}>
            Logout
          </li>
        </ul>
      </div>
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
