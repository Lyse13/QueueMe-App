const Service = require('../models/Service');
const Queue = require('../models/Queue'); // Assuming you have a Queue model

exports.getAllServices = (req, res) => {
  Service.getAll((err, services) => {
    if (err) {
      console.error("Error fetching services:", err);
      return res.status(500).json({ message: "Failed to load services." });
    }

    // Fetch queue lengths for each service
    const servicesWithQueueLength = services.map(service => {
      return new Promise((resolve, reject) => {
        Queue.countWaitingByServiceId(service.id, (err, count) => {
          if (err) {
            console.error(`Error counting queue for service ${service.id}:`, err);
            // Even if there's an error, return the service without queue length
            resolve({ ...service, currentQueueLength: 0 }); 
          } else {
            resolve({ ...service, currentQueueLength: count });
          }
        });
      });
    });

    Promise.all(servicesWithQueueLength)
      .then(results => {
        res.json({ services: results });
      })
      .catch(error => {
        console.error("Error processing services with queue lengths:", error);
        res.status(500).json({ message: "Failed to load services with queue lengths." });
      });
  });
};

