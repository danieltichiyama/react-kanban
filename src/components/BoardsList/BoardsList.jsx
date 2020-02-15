import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./BoardsList.module.scss";
import { actionsGetBoards, actionsGetBoardData } from "../../actions";
import AddNewBoard from "../AddNewBoard";
import BoardThumbnail from "../BoardThumbnail";

class BoardsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewBoard: false,
      showArchived: false
    };
  }

  componentDidMount = () => {
    return this.props.dispatchGetBoards(1);
  };

  getBoardData = event => {
    let { id } = event.target;
    return this.props.dispatchGetBoardData(id);
  };

  toggleAddNewBoard = () => {
    return this.setState({ addNewBoard: !this.state.addNewBoard });
  };

  toggleArchivedBoards = () => {
    return this.setState({ showArchived: !this.state.showArchived });
  };

  render() {
    return (
      <div className={styles.BoardsList}>
        {/* List of Boards */}
        {this.props.boards
          ? this.props.boards.map(board => {
              if (!board.is_archived) {
                return (
                  <BoardThumbnail
                    board={board}
                    key={board.id}
                    getBoardData={this.getBoardData}
                  />
                );
              }
              return null;
            })
          : null}

        {/* Add New Board Button */}
        <button className={styles.li_board} onClick={this.toggleAddNewBoard}>
          New Board
        </button>

        {/* Show Archied Boards button */}
        <button className={styles.li_board} onClick={this.toggleArchivedBoards}>
          Show Archived Boards
        </button>

        {/* Archived Boards List */}
        {this.state.showArchived
          ? this.props.boards.map(board => {
              if (board.is_archived) {
                return (
                  <BoardThumbnail
                    board={board}
                    key={board.id}
                    getBoardData={this.getBoardData}
                  />
                );
              }
              return null;
            })
          : null}
        {/* Add New Board Modal */}
        {this.state.addNewBoard ? (
          <AddNewBoard toggleAddNewBoard={this.toggleAddNewBoard} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    boards: state.boards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchGetBoards: userID => {
      return dispatch(actionsGetBoards(userID));
    },
    dispatchGetBoardData: boardID => {
      return dispatch(actionsGetBoardData(boardID));
    }
  };
};

export default BoardsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardsList);
