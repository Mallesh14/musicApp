const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let rooms = {};

router.post('/create', (req, res) => {
  const roomCode = uuidv4().slice(0, 6).toUpperCase();
  rooms[roomCode] = {
    users: [],
    currentSong: null,
    gameState: null
  };
  res.json({ roomCode });
});

router.post('/join', (req, res) => {
  const { roomCode } = req.body;
  if (rooms[roomCode]) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

module.exports = router;
