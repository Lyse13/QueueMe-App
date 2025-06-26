const db = require("./db");

const Service = {
  getAll: (callback) => {
    db.query("SELECT * FROM services", callback);
  },
  findById: (id, callback) => {
    db.query("SELECT * FROM services WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  create: (serviceData, callback) => {
    db.query("INSERT INTO services SET ?", serviceData, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  update: (id, serviceData, callback) => {
    db.query("UPDATE services SET ? WHERE id = ?", [serviceData, id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  delete: (id, callback) => {
    db.query("DELETE FROM services WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
};

module.exports = Service;
