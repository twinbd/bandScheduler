const express = require("express");
const router = express.Router();
const { Events, Songs } = require("../models");

// Create a new event
router.post("/", async (req, res) => {
  try {
    const { title, year, month } = req.body;
    const newEvent = await Events.create({ title, year, month });
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Events.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

module.exports = router;
