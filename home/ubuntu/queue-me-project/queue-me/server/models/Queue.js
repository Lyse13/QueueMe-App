const db = require("./db");

const Queue = {
  join: (user_id, service_id, callback) => {
    db.query("INSERT INTO queues (user_id, service_id) VALUES (?, ?)", [user_id, service_id], callback);
  },
  getUserQueue: (user_id, callback) => {
    db.query(
      "SELECT q.*, s.name as service_name FROM queues q JOIN services s ON q.service_id = s.id WHERE q.user_id = ? AND q.status = \"waiting\"",
      [user_id],
      callback
    );
  },
  getQueuePosition: (queue_id, callback) => {
    db.query(
      "SELECT COUNT(*) as position FROM queues WHERE service_id = (SELECT service_id FROM queues WHERE id = ?) AND status = \"waiting\" AND id <= ?",
      [queue_id, queue_id],
      callback
    );
  },
  findAll: (callback) => {
    db.query("SELECT q.*, u.name as customerName, s.name as serviceName FROM queues q JOIN users u ON q.user_id = u.id JOIN services s ON q.service_id = s.id", (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  
  findByServiceId: (service_id, callback) => {
    db.query("SELECT q.*, u.name as customerName, s.name as serviceName FROM queues q JOIN users u ON q.user_id = u.id JOIN services s ON q.service_id = s.id WHERE q.service_id = ? AND q.status = \"waiting\" ORDER BY q.joined_at ASC", [service_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  updateQueueEntryStatus: (queueEntryId, status, callback) => {
    db.query("UPDATE queues SET status = ? WHERE id = ?", [status, queueEntryId], callback);
  },
  updateServiceQueueStatus: (serviceId, status, callback) => {
    // This would typically pause new entries to the queue for a service
    // For simplicity, we\\\\'ll just log it here.
    console.log(`Service ${serviceId} queue status updated to ${status}`);
    callback(null, { message: `Service ${serviceId} queue status updated to ${status}` });
  },
  countWaitingByServiceId: (serviceId, callback) => {
    db.query("SELECT COUNT(*) as count FROM queues WHERE service_id = ? AND status IN (\"waiting\", \"serving\")", [serviceId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count);
    });
  },
};

module.exports = Queue;
