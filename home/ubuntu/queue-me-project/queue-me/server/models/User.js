const db = require("../models/db");

const User = {
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  findById: (id, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  findAll: (callback) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  create: (userData, callback) => {
    db.query("INSERT INTO users SET ?", userData, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  update: (id, userData, callback) => {
    db.query("UPDATE users SET ? WHERE id = ?", [userData, id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  delete: (id, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  updateResetToken: (email, token, expires, callback) => {
    db.query("UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?", [token, expires, email], callback);
  },
  findByResetToken: (token, callback) => {
    db.query("SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()", [token], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  updatePassword: (id, password, callback) => {
    db.query("UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?", [password, id], callback);
  }
};

module.exports = User;

