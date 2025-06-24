const Service = require('../models/Service');

exports.getAllServices = (req, res) => {
  Service.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching services' });
    res.json(results);
  });
};