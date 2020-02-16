import React, { Component } from "react";
import { connect } from "react-redux";
import {
  actionsCreateList,
  actionsUpdateBoard,
  actionsUpdateCard
} from "../../actions";
import List from "../List";
import BoardMenu from "../BoardMenu";
import styles from "./Board.module.scss";
import { DragDropContext } from "react-beautiful-dnd";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = { board: {}, list: {}, showMenu: false };
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  updateBoard = e => {
    e.preventDefault();
    let formData = {
      ...this.state.board,
      id: this.props.board_id
    };
    return this.props.dispatchUpdateBoard(formData);
  };

  createList = e => {
    e.preventDefault();
    let lists = this.props.lists;
    let position;
    if (lists.length === 0) {
      position = 1;
    } else {
      position = parseInt(parseFloat(lists[lists.length - 1].position) + 1);
    }
    let formData = {
      ...this.state.list,
      board_id: this.props.board_id,
      position
    };

    this.props.dispatchCreateList(formData);
    return this.setState({ list: { name: "" } });
  };

  handleBoardInput = e => {
    const { value, name } = e.target;
    return this.setState({ board: { [name]: value } });
  };

  handleListInput = e => {
    const { value, name } = e.target;
    return this.setState({ list: { [name]: value } });
  };

  handleInputClick = e => {
    const { placeholder } = e.target;
    return this.setState({ board: { name: placeholder } });
  };

  onDragEnd = result => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let cardsInOldList;

    // if card is moved to a new list
    if (destination.droppableId !== source.droppableId) {
      cardsInOldList = this.props.cards
        .filter(card => {
          return card.list_id === parseInt(source.droppableId);
        })
        .sort((a, b) => {
          return parseFloat(a.position) - parseFloat(b.position);
        });
    }

    // creates an array of the cards in the destination list
    let cardsInList = this.props.cards
      .filter(card => {
        return card.list_id === parseInt(destination.droppableId);
      })
      .sort((a, b) => {
        return parseFloat(a.position) - parseFloat(b.position);
      });

    const newCardsInList = [...cardsInList];

    // removes the card from it's old position in the list
    if (destination.droppableId !== source.droppableId) {
      if (newCardsInList.length === 0) {
        newCardsInList.push(cardsInOldList[source.index]);
      } else {
        newCardsInList.splice(
          destination.index,
          0,
          cardsInOldList[source.index]
        );
      }
      cardsInOldList.splice(source.index, 1);
    } else {
      newCardsInList.splice(source.index, 1);
      newCardsInList.splice(destination.index, 0, cardsInList[source.index]);
    }

    let newCard = this.updateCardPosition(newCardsInList, destination.index);

    if (destination.droppableId !== source.droppableId) {
      newCard.list_id = parseInt(destination.droppableId);
    }

    let formData = Object.assign(
      {},
      { id: newCard.id, list_id: newCard.list_id, position: newCard.position }
    );

    return this.props.dispatchUpdateCard(formData);
  };

  updateCardPosition = (array, destinationIndex) => {
    if (destinationIndex === 0) {
      if (array.length === 1) {
        array[0].position = "1.00";
      } else {
        array[destinationIndex].position = (
          parseFloat(array[1].position) / 2
        ).toString();
      }
    } else if (destinationIndex === array.length - 1) {
      array[destinationIndex].position = (
        parseFloat(array[destinationIndex - 1].position) + 1
      ).toString();
    } else {
      array[destinationIndex].position = (
        (parseFloat(array[destinationIndex - 1].position) +
          parseFloat(array[destinationIndex + 1].position)) /
        2
      ).toString();
    }

    return array[destinationIndex];
  };

  render() {
    return (
      <div className={styles.Board}>
        <button onClick={this.toggleMenu}>Menu</button>
        {this.state.showMenu ? <BoardMenu /> : null}

        {/* Board Name */}
        <form onSubmit={this.updateBoard}>
          <input
            type="text"
            name="name"
            value={this.state.board.name}
            placeholder={this.props.name}
            onChange={this.handleBoardInput}
            onClick={this.handleInputClick}
          />
          <input type="submit" value="Change" />
        </form>

        {/* Lists */}

        <ul className={styles.Lists}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.props.lists
              ? this.props.lists.map(list => {
                  if (list.is_archived) {
                    return null;
                  } else {
                    return (
                      <List
                        list={list}
                        key={list.id}
                        cards={this.props.cards
                          .filter(card => {
                            return card.list_id === list.id;
                          })
                          .sort((a, b) => {
                            return (
                              parseFloat(a.position) - parseFloat(b.position)
                            );
                          })}
                      />
                    );
                  }
                })
              : null}
          </DragDropContext>

          {/* Add List */}
          <form onSubmit={this.createList}>
            <input
              className={styles.AddList}
              name="name"
              value={this.state.list.name}
              placeholder="+ Add List"
              onChange={this.handleListInput}
            />
            <input type="submit" value="Add" />
          </form>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    name: state.name,
    lists: state.lists,
    labels: state.labels,
    board_id: state.id,
    cards: state.cards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchCreateList: formData => {
      return dispatch(actionsCreateList(formData));
    },
    dispatchUpdateBoard: formData => {
      return dispatch(actionsUpdateBoard(formData));
    },
    dispatchUpdateCard: formData => {
      return dispatch(actionsUpdateCard(formData));
    }
  };
};

export default Board = connect(mapStateToProps, mapDispatchToProps)(Board);
