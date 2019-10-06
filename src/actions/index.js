//action types
export const LOAD_CARDS = "LOAD_CARDS";
export const ADD_CARD = "ADD_CARD";
export const EDIT_CARD = "EDIT_CARD";
export const GET_CARD = "GET_CARD";

//action creators
export const loadCards = () => async dispatch => {
  await fetch("/cards")
    .then(results => {
      return results.json();
    })
    .then(results => {
      dispatch({
        type: LOAD_CARDS,
        payload: results
      });
    });
};

export const getCardData = id => async dispatch => {
  dispatch({
    type: GET_CARD,
    payload: id
  });
};

export const addCard = data => async dispatch => {
  await fetch("/cards", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(results => {
      return results.json();
    })
    .then(results => {
      dispatch({
        type: ADD_CARD,
        payload: results
      });
    });
};

export const editCard = data => async dispatch => {
  await fetch(`/cards/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json"
    }
  }).then(results => {
    dispatch({
      type: EDIT_CARD,
      payload: results
    });
  });
};
