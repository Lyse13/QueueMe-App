const db = require('./db');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  create: (userData, callback) => {
    db.query('INSERT INTO users SET ?', userData, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  updateResetToken: (email, token, expires, callback) => {
    db.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?', [token, expires, email], callback);
  },
  findByResetToken: (token, callback) => {
    db.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()', [token], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  updatePassword: (id, password, callback) => {
    db.query('UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?', [password, id], callback);
  }
};

module.exports = User;