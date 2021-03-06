import React, { Component } from "react";
import styles from "./Card.module.scss";
import { connect } from "react-redux";
import { actionsUpdateCard } from "../../actions";
import { Draggable } from "react-beautiful-dnd";
import TextareaAutosize from "react-textarea-autosize";

import CardMenu from "../CardMenu";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      label: {}
    };
  }

  componentDidMount = () => {
    return this.setState({ name: this.props.card.name });
  };

  componentDidUpdate = prevProps => {
    if (prevProps.card !== this.props.card) {
      return this.setState({ name: this.props.card.name });
    }
  };

  updateCard = e => {
    if (e) {
      e.preventDefault();
    }
    let formData = { ...this.state, id: this.props.card.id };
    delete formData.label;
    delete formData.showMenu;

    if (formData.name.length === 0) {
      formData.name = this.props.card.name;
    }

    return this.props.dispatchUpdateCard(formData);
  };

  toggleMenu = e => {
    if (e) {
      e.stopPropagation();
    }
    return this.setState({ showMenu: !this.state.showMenu });
  };

  handleCardInput = e => {
    const { value, name } = e.target;
    return this.setState({ [name]: value });
  };

  handleLabelInput = e => {
    const { value, name } = e.target;
    return this.setState({ label: { [name]: value } });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.updateCard();
      return e.target.blur();
    }
  };

  render() {
    return (
      <Draggable
        draggableId={this.props.card.id.toString()}
        index={this.props.index}
      >
        {provided => {
          return (
            <div
              className={styles.Card}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className={styles.card_labelsAndMenu}>
                {/* Card's Labels */}
                {this.props.card.labels ? (
                  <div className={styles.labelsContainer}>
                    {this.props.card.labels.map(label => {
                      let color = { backgroundColor: label.color };
                      let labelName = this.props.labels[label.color].name;
                      return (
                        <div
                          className={styles.Label}
                          key={label.color}
                          style={color}
                        >
                          <span> {labelName}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* Show Card Editor Menu or Unarchive Card Button*/}

                <button
                  onClick={this.toggleMenu}
                  className={styles.menuButton}
                ></button>
              </div>

              {/* Card Name */}
              <div className={styles.cardBody}>
                <TextareaAutosize
                  className={styles.cardName}
                  type="text"
                  name="name"
                  minRows={1}
                  value={this.state.name}
                  onChange={this.handleCardInput}
                  onKeyPress={this.handleKeyPress}
                />
              </div>
              <div className={styles.card_extraInfo} onClick={this.toggleMenu}>
                <div className={styles.card_extraInfo_userInfo}>
                  {/* assigned to */}
                  {this.props.card.assignedTo ? (
                    <span>
                      assigned to: {this.props.card.assignedTo.firstname}
                    </span>
                  ) : null}
                </div>
                {!this.props.card.details ? null : (
                  <div className={styles.extraInfo_details}>
                    <hr className={styles.details_top}></hr>
                    <hr className={styles.details_middle} />
                    <hr className={styles.details_bottom} />
                  </div>
                )}
              </div>

              {/* Card Menu */}
              {!this.state.showMenu ? null : (
                <CardMenu
                  card={this.props.card}
                  toggleMenu={this.toggleMenu}
                  updateCard={this.updateCard}
                ></CardMenu>
              )}
            </div>
          );
        }}
      </Draggable>
    );
  }
}

const mapStateToProps = state => {
  return {
    labels: state.labels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchUpdateCard: formData => {
      return dispatch(actionsUpdateCard(formData));
    }
  };
};

export default Card = connect(mapStateToProps, mapDispatchToProps)(Card);
