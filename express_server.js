//Dependencies
const express = require("express");
const app = express();
const cookieSession = require('cookie-session')
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
const bcrypt = require('bcrypt');
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const { generateRandomString, checkEmail, urlsForUser, checkURLOwnership } = require('./helpers');

//Object Declerations
const urlDatabase = {};

const users = {};

//Get Requests
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      urls: urlsForUser(req.session.user_id.id, urlDatabase),
      user: req.session.user_id
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: req.session.user_id }
    res.render("user_registration", templateVars);
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: req.session.user_id }
  res.render("login_form", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = { user: req.session.user_id }
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  //Conditional checks if user cookie exists and if user owns url that is entered
  if (req.session.user_id && checkURLOwnership(req.session.user_id.id, req.params.id, urlDatabase)) {
    const templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id]["longURL"],
      user: req.session.user_id
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("401 Unauthorized");
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]["longURL"]
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send("404 Not Found");
  }
})

//Post Requests
app.post("/login", (req, res) => {
  const user = checkEmail(req.body.email, users);
  if (user) {
    if (bcrypt.compareSync(req.body.password, users[user]["password"])){
      req.session.user_id = users[user];
      res.redirect("/urls");
    } else {
      res.send("403 Invalid Password");
    }
  } else {
    res.send("403 Invalid E-Mail");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const newID = generateRandomString();
  if (req.body.email === "" || req.body.password === "" || (req.body.email === "" && req.body.email === "")) {
    res.send("400 Invalid Email or Password")
  } else if (checkEmail(req.body.email, users)) {
    res.send("400 Email Already Exists")
  } else {
    users[newID] = {
      id: newID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = users[newID];
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const shortURL = generateRandomString();
    res.redirect("/urls");
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id.id
    }
  }
  res.send("401 Unauthorized");
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id && checkURLOwnership(req.session.user_id.id, req.params.id, urlDatabase)) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.send("401 Unauthorized");
  }
});

app.post("/urls/:id", (req, res) => {
  if (req.session.user_id) {
    urlDatabase[req.params.id] = {
      longURL: req.body.longURL,
      userID: req.session.user_id.id
    }
    res.redirect("/urls");
  }
  res.send("401 Unauthorized");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});