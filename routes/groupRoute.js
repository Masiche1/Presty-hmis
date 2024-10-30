// routes/groupRoute.js
const express = require('express');
const { createGroup, getGroups } = require('../controllers/groupController');
const router = express.Router();

router.post('/groups', createGroup);
router.get('/groups', getGroups);

module.exports = router;
