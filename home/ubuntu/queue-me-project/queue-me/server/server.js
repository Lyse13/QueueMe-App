const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/queue-me')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3002, () => {
      console.log('Server running on port 3002');
    });
  })
  .catch(err => console.error(err));
