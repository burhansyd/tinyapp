const { assert } = require('chai');

const { checkEmail } = require('../helpers.js');

const testUsers = {
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

describe('checkEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('shoudl return undefined if given an email not in users database', function() {
    const user = checkEmail("user6@moohoo.com", testUsers);
    assert.equal(user, undefined);
  })
});