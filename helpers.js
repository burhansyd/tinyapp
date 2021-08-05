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
  return undefined;
}

function urlsForUser(userID, database) {
  const uniqURLs = {};
  for (let id in database) {
    if (userID === database[id]["userID"]) {
      uniqURLs[id] = database[id];
    }
  }
  return uniqURLs;
};

function checkURLOwnership(userID, shortURL, database) {
  for (let id in database) {
    if (userID === database[id]["userID"] && shortURL === id) {
      return true;
    }
  }
};

module.exports = { generateRandomString, checkEmail, urlsForUser, checkURLOwnership };