const Queue = require('../models/Queue');

exports.joinQueue = (req, res) => {
  const { user_id, service_id } = req.body;
  Queue.join(user_id, service_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error joining queue' });
    res.json({ message: 'Joined queue successfully', queue_id: result.insertId });
  });
};

exports.getUserQueue = (req, res) => {
  const { user_id } = req.params;
  Queue.getUserQueue(user_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user queue' });
    res.json(results);
  });
};

exports.getQueuePosition = (req, res) => {
  const { queue_id } = req.params;
  Queue.getQueuePosition(queue_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching queue position' });
    res.json(results[0]);
  });
};