const express = require('express');
const Match = require('../models/Match');
const User = require('../models/User');
const router = express.Router();

// Get matches for a user
router.get('/:userId', async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.params.userId }, { user2: req.params.userId }],
    }).populate('user1 user2');

    res.json(matches);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
