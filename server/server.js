const express = require("express");
const bodyParser = require("body-parser");
const decorator = require("./database/decorator");

const app = express();
const PORT = process.env.EXPRESS_HOST_PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(decorator);

app.get("/", (req, res) => {
  res.send("smoke test");
});

app.get("/cards", (req, res) => {
  return req.database.Card.fetchAll({
    withRelated: ["createdBy", "assignedTo"]
  })
    .then(results => {
      return res.json(results);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message:
          "Sorry, my hand slipped while grabbing those cards from the database."
      });
    });
});

app.post("/cards", (req, res) => {
  req.body.status_id = 1;
  return req.database.Card.forge(req.body)
    .save()
    .then(results => {
      return req.database.Card.where({ id: results.id }).fetch({
        withRelated: ["createdBy", "assignedTo"]
      });
    })
    .then(results => {
      return res.json(results);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "Sorry, I can't quite make a card out of that data."
      });
    });
});

app.put("/cards/:id", (req, res) => {
  let object = {
    id: req.body.id,
    title: req.body.title,
    body: req.body.body,
    created_by: req.body.created_by,
    assigned_by: req.body.assigned_by,
    priority_id: req.body.priority_id,
    status_id: req.body.status_id
  };

  return req.database.Card.where({ id: req.params.id })
    .save(object, { method: "update", patch: true })
    .then(results => {
      return req.database.Card.where({ id: results.id }).fetch({
        withRelated: ["createdBy", "assignedTo"]
      });
    })
    .then(results => {
      return res.json(results);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: "Sorry, something happened while editing that card."
      });
    });
});

app.delete("/cards/:id", (req, res) => {
  return req.database.Card.where({ id: req.params.id })
    .destroy()
    .then(results => {
      return res.status(200).json({ id: req.params.id });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message:
          "Sorry, that card has an invincibility shield on and can't be destroyed right now."
      });
    });
});

app.listen(PORT, () => {
  console.log(`PORT: ${PORT}, at your service.`);
});
