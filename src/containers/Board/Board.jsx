import React, { Component } from "react";

import Card from "../../components/Card";

class Board extends Component {
  render() {
    console.log(this.props);
    return (
      <div className="board">
        <ul>
          {this.props.cards.map(element => {
            return <Card card={element} />;
          })}
        </ul>
      </div>
    );
  }
}

export default Board;