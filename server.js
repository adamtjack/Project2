// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// Handlebars config 
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");



// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);


// Change Later

// require("./routes/author-api-routes.js")(app);
//require("./routes/post-api-routes.js")(app);
//require("./routes/thread-api-routes.js")(app);
//require("./routes/category-api-routes.js")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function () {
  // REMOVE LATER
  db.User.create({
    name: 'johnsmith',
    rank: 'e-6',
    branch: 'army',
    deployment: 'sdf slkdfj sf deployment',
    mos: 'sdf asd mos',
    bio: 'sldkfj slkdfj sdflkj bio'
  }).then(function (testuser) {
    db.Category.create({
      categoryName: "General"
    }).then(function (testcat) {
      db.Thread.bulkCreate([{
        threadTitle: "This is a thread title",
        userId: testuser.userId,
        categoryId: testcat.categoryId,
      },
      {
        threadTitle: "This is another thread title",
        userId: testuser.userId,
        categoryId: testcat.categoryId,
      }]).then(function () {
        db.Thread.findOne({}).then(function (testthread) {
          db.Post.bulkCreate([{
            postTitle: "This is a test title",
            postContent: "Lorem ipsum dolor sit amet lkja lkjf",
            userId: testuser.userId,
            threadId: testthread.threadId
          },
          {
            postTitle: "This is a reply title",
            postContent: "Lorem ipsum dolor sit amet lkja lkjf reply crap blah blah blah",
            userId: testuser.userId,
            threadId: testthread.threadId
          }]);

          db.Subscription.create({
            userId: 1,
            threadId: testthread.threadId
          });
        })
      })
    })
  })
});

// REMOVE LATER
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

