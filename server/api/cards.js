const express = require("express");

const router = express.Router();

router.get("/smoke", (req, res) => {
  return res.send("There's smoke in the cards route.");
});

router.post("/new", (req, res) => {
  //req.body = {title, [details], [due_date], position, created_by, [assigned_to], list_id, [is_archived]}
  return req.database.Card.forge(req.body)
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/:cardID", (req, res) => {
  return req.database.Card.where({ id: req.params.cardID })
    .fetch()
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
