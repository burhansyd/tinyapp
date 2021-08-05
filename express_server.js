const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser());
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

function checkEmail(email) {
  for (let user in users) {
    if (email === users[user]["email"]) {
      const id = user;
      return id;
    }
  }
  return false;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.cookies.user_id
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: req.cookies.user_id }
    res.render("user_registration", templateVars);
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: req.cookies.user_id }
  res.render("login_form", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies.user_id }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // const longURL = urlDatabase[req.params.shortURL]
  // res.redirect(longURL);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies.user_id
  };
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  const user = checkEmail(req.body.email);
  if (user) {
    if (users[user]["password"] === req.body.password){
      res.cookie("user_id", users[user]);
      res.redirect("/urls");
    } else {
      res.send("403 Invalid Password");
    }
  } else {
    res.send("403 Invalid E-Mail");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const newID = generateRandomString();
  if (req.body.email === "" || req.body.password === "" || (req.body.email === "" && req.body.email === "")) {
    res.send("400 Invalid Email or Password")
  } else if (checkEmail(req.body.email)) {
    res.send("400 Email Already Exists")
  } else {
    users.newID = {
      id: newID,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie("user_id", users.newID);
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  res.redirect(`/urls/${shortURL}`);
  urlDatabase[shortURL] = req.body.longURL;
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});