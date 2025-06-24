const db = require('./db');

const Queue = {
  join: (user_id, service_id, callback) => {
    db.query('INSERT INTO queues (user_id, service_id) VALUES (?, ?)', [user_id, service_id], callback);
  },
  getUserQueue: (user_id, callback) => {
    db.query(
      'SELECT q.*, s.name as service_name FROM queues q JOIN services s ON q.service_id = s.id WHERE q.user_id = ? AND q.status = \"waiting\"',
      [user_id],
      callback
    );
  },
  getQueuePosition: (queue_id, callback) => {
    db.query(
      'SELECT COUNT(*) as position FROM queues WHERE service_id = (SELECT service_id FROM queues WHERE id = ?) AND status = \"waiting\" AND id <= ?',
      [queue_id, queue_id],
      callback
    );
  }
};

module.exports = Queue;