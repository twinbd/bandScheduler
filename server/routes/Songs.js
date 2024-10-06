const express = require("express");
const router = express.Router();
const { Songs } = require("../models");

// Create new song
router.post("/", async (req, res) => {
  try {
    const song = req.body;
    const newSong = await Songs.create(song);
    res.json(newSong);
  } catch (error) {
    res.status(500).json({ error: "Error creating song" });
  }
});

// Get all songs for a specific event
router.get("/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const songs = await Songs.findAll({ where: { EventId: eventId } });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching songs for this event" });
  }
});

module.exports = router;
