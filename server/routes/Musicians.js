const express = require("express");
const router = express.Router();
const { Musicians } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Create new musician
router.post("/", validateToken, async (req, res) => {
  try {
    const { name, instrument, SongId } = req.body;
    const newMusician = await Musicians.create({ name, instrument, SongId });
    res.json(newMusician);
  } catch (error) {
    res.status(500).json({ error: "error creating musician" });
  }
});

// Get all musicians for a specific song
router.get("/:songId", async (req, res) => {
  try {
    const songId = req.params.songId;
    const musicians = await Musicians.findAll({ where: { SongId: songId } });
    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: "error fetching musicians for the song" });
  }
});

// Delete a musician
router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  await Musicians.destroy({
    where: {
      id: id,
    },
  });
  res.json("Deleted Successfully");
});

module.exports = router;
