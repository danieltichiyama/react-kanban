const express = require("express");
const router = express.Router();

//authentication dependencies
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const saltRounds = 12;
const User = require("../database/models/User");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const client = redis.createClient({ url: process.env.REDIS_URL });

//used to create a transaction in register route
const Promise = require("bluebird");
const bookshelf = require("../database/bookshelf");
const tutorial = require("./tutorial_board");
//used to create a transaction in register route

router.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(username, password, done) {
      return new User({ username })
        .fetch({ require: false })
        .then(user => {
          if (user === null) {
            return done(null, false, { message: "bad username or password" });
          } else {
            user = user.toJSON();
            bcrypt
              .compare(password, user.password)
              .then(res => {
                if (res) {
                  return done(null, user); // this is the user that goes to serializeUser()
                } else {
                  return done(null, false, {
                    message: "bad username or password"
                  });
                }
              })
              .catch(err => {
                console.log("error: ", err);
                return done(err);
              });
          }
        })
        .catch(err => {
          console.log("error: ", err);
          return done(err);
        });
    }
  )
);

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

router.get("/smoke", (req, res) => {
  return res.json({ message: "I see smoke in auth." });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  let response = { ...req.user };

  delete response.password;
  delete response.created_at;
  delete response.updated_at;
  return res.json(response);
});

router.post("/register", (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
    }
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }

      return bookshelf
        .transaction(t => {
          return new User(Object.assign({ ...req.body }, { password: hash }))
            .save(null, { transacting: t })
            .tap(user => {
              return req.database.Board.forge(tutorial.board)
                .save({ created_by: user.id }, { transacting: t })
                .tap(board => {
                  return req.database.BoardImage.forge(
                    tutorial.boardImage
                  ).save({ board_id: board.id }, { transacting: t });
                })
                .tap(board => {
                  return Promise.map(tutorial.labels, label => {
                    return req.database.Label.forge(label).save(
                      { board_id: board.id },
                      { transacting: t }
                    );
                  }).tap(labels => {
                    return Promise.map(tutorial.lists, list => {
                      return req.database.List.forge(list).save(
                        { board_id: board.id },
                        { transacting: t }
                      );
                    }).tap(lists => {
                      let board_id = board.id;
                      let list_id = lists[0].id;
                      let created_by = user.id;

                      return Promise.map(tutorial.cards, card => {
                        let cardData = { ...card };
                        delete cardData.labels;

                        return req.database.Card.forge(cardData)
                          .save(
                            {
                              list_id,
                              board_id,
                              created_by
                            },
                            { transacting: t }
                          )
                          .tap(results => {
                            let label_ids = [];
                            for (let i = 0; i < card.labels.length; i++) {
                              label_ids.push(labels[card.labels[i]].id);
                            }

                            return results
                              .labels()
                              .attach(label_ids, { transacting: t });
                          });
                      });
                    });
                  });
                });
            });
        })
        .then(user => {
          let response = { ...user.attributes };

          delete response.password;
          delete response.created_at;
          delete response.updated_at;

          return res.json(response);
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  return res.json({ session: {} });
});

module.exports = router;
