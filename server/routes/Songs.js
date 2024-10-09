const express = require("express");
const router = express.Router();
const { Songs } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

// Create new song
router.post("/", validateToken, async (req, res) => {
  try {
    const { title, artist, link, EventId } = req.body;
    const newSong = await Songs.create({ title, artist, link, EventId });
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

// Delete a song
router.delete("/:songId", validateToken, async (req, res) => {
  const songId = req.params.songId;
  await Songs.destroy({
    where: {
      id: songId,
    },
  });
  res.json("Deleted Successfully");
});

module.exports = router;
