const express = require('express');
const router = express.Router();
const { joinQueue, getUserQueue, getQueuePosition } = require('../controllers/queueController');

router.post('/join', joinQueue);
router.get('/user/:user_id', getUserQueue);
router.get('/position/:queue_id', getQueuePosition);

module.exports = router;