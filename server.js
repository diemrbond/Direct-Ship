// DEPENDENCIES
const express = require("express");
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const db = require("./models");
const logSymbols = require("log-symbols");
const path = require('path')

// EXPRESS SETUP
const app = express();
const PORT = process.env.PORT || 8080;

// APP SETTINGS
app.use(session({ secret: 'tcwa', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// HANDLEBARS
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ROUTES
require('./config/passport/passport.js')(passport, db.user);
require('./routes/authorisation.js')(app, passport);

// INITIAL SETUP
console.log(`\n///////////////////////////////////`)
console.log(`// ${logSymbols.info} Launching TCWA: Direct-Ship //`)
console.log(`///////////////////////////////////\n`)

// CONNECT TO DATABASE AND LAUNCH APP
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(`\n${logSymbols.success} App listening on PORT ${PORT}\n`);
  });
});
