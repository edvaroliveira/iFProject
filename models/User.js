// /backend/models/User.js
const db = require("../config/db");

const User = {
  create: (userData, callback) => {
    const query =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(
      query,
      [userData.username, userData.password, userData.role],
      callback
    );
  },
  findByUsername: (username, callback) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], callback);
  },
};

module.exports = User;
