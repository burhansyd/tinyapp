function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

function checkEmail(email, database) {
  for (let user in database) {
    if (email === database[user]["email"]) {
      const id = user;
      return id;
    }
  }
  return false;
}

function urlsForUser(userID) {
  const uniqURLs = {};
  for (let id in urlDatabase) {
    if (userID === urlDatabase[id]["userID"]) {
      uniqURLs[id] = urlDatabase[id];
    }
  }
  return uniqURLs;
};

function delEdit(userID, shortURL) {
  for (let id in urlDatabase) {
    if (userID === urlDatabase[id]["userID"] && shortURL === id) {
      return true;
    }
  }
};

module.exports = { generateRandomString, checkEmail, urlsForUser, delEdit };