const express = require("express");
const router = express.Router();
const { Musicians } = require("../models");

router.post("/", async (req, res) => {
  try {
    const musician = req.body;
    const newMusician = await Musicians.create(musician);
    res.json(newMusician);
  } catch (error) {
    res.status(500).json({ error: "error creating musician" });
  }
});

// Get all musicians for a specific song
router.get("/:songId", async (req, res) => {
  try {
    const songId = req.params;
    const musicians = await Musicians.findAll({ where: { SongId: songId } });
    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: "error fetching musicians for the song" });
  }
});

module.exports = router;
