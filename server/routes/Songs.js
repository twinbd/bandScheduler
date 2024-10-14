const express = require("express");
const router = express.Router();
const { Songs, Users } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

// Create new song
router.post("/", validateToken, async (req, res) => {
  try {
    const { title, artist, link, status, EventId, requesterId } = req.body;
    const newSong = await Songs.create({
      title,
      artist,
      link,
      status,
      EventId,
      requesterId,
    });
    res.json(newSong);
  } catch (error) {
    res.status(500).json({ error: "Error creating song" });
  }
});

// Get all songs for a specific event, including the username of the requester
router.get("/:eventId", async (req, res) => {
  console.log("Fetching songs route hit");
  try {
    const eventId = req.params.eventId;
    console.log("Event ID:", eventId); // Log the eventId to see if it's being passed

    const songs = await Songs.findAll({
      where: { EventId: eventId },
      include: [
        {
          model: Users, // Include the Users model
          attributes: ["username"], // Only fetch the username
          as: "Requester", // Alias for the requester association
        },
      ],
    });

    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error); // Log the detailed error
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

// Route to update the status of a song
router.put("/status/:songId", validateToken, async (req, res) => {
  try {
    const { songId } = req.params;
    const { status } = req.body; // Status will be passed in the request body

    // Update the song's status
    const updatedSong = await Songs.update(
      { status },
      { where: { id: songId } }
    );

    if (updatedSong[0] === 0) {
      return res
        .status(404)
        .json({ error: "Song not found or no changes made" });
    }

    res.json({ message: "Song status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating song status" });
  }
});

module.exports = router;
