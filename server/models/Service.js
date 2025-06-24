const db = require('./db');

const Service = {
  getAll: (callback) => {
    db.query('SELECT * FROM services', callback);
  }
};

module.exports = Service;