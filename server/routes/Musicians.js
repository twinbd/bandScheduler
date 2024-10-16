const express = require("express");
const router = express.Router();
const { Musicians, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Create new musician
router.post("/", validateToken, async (req, res) => {
  try {
    const { name, instrument, status, requesterId, SongId } = req.body;
    const newMusician = await Musicians.create({
      name,
      instrument,
      status,
      requesterId,
      SongId,
    });
    res.json(newMusician);
  } catch (error) {
    res.status(500).json({ error: "error creating musician" });
  }
});

// Get all musicians for a specific song
router.get("/:songId", async (req, res) => {
  try {
    const songId = req.params.songId;
    const musicians = await Musicians.findAll({
      where: { SongId: songId },
      include: [
        {
          model: Users, // Join with the Users model
          attributes: ["username"], // Only select the username attribute from Users
          as: "Requester", // Alias to match the association defined in the model
        },
      ],
    });
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

// Update musician status
router.put("/status/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id; // The ID of the musician to update
    const { status } = req.body; // New status value

    // Find the musician by ID and update the status
    const updatedMusician = await Musicians.update(
      { status }, // Update status column
      { where: { id: id } } // Where clause to target the specific musician
    );

    if (updatedMusician[0] === 0) {
      return res.status(404).json({ error: "Musician not found" });
    }

    res.json({
      success: true,
      message: "Musician status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating musician status" });
  }
});

module.exports = router;
