const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Send a message
router.post('/', async (req, res) => {
  const { sender, receiver, text } = req.body;
  try {
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get messages between two users
router.get('/:user1/:user2', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.user1, receiver: req.params.user2 },
        { sender: req.params.user2, receiver: req.params.user1 },
      ],
    }).sort({ sentAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
