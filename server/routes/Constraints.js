const express = require("express");
const router = express.Router();
const { Constraints } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const { userId, eventId } = req.query;

  if (!userId || !eventId) {
    return res.status(400).json({ error: "userId and eventId are required." });
  }

  try {
    const constraints = await Constraints.findAll({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
    res.json(constraints.map((c) => c.timeSlot)); // Return only time slots
  } catch (error) {
    console.error("Error fetching constraints:", error);
    res.status(500).json({ error: "Error fetching constraints." });
  }
});

// Fetch all rows from the Constraints table
router.get("/all", validateToken, async (req, res) => {
  try {
    const constraints = await Constraints.findAll();
    res.json(constraints); // Return all rows in their entirety
  } catch (error) {
    console.error("Error fetching all constraints:", error);
    res.status(500).json({ error: "Error fetching all constraints." });
  }
});

// Add a single constraint
router.post("/", validateToken, async (req, res) => {
  const { userId, eventId, unavailableTime } = req.body; // Accepts a single `unavailableTime`

  // Validate input
  if (!userId || !eventId || typeof unavailableTime !== "number") {
    return res.status(400).json({
      error:
        "Invalid input data. Ensure userId, eventId, and unavailableTime are correct.",
    });
  }

  try {
    // Insert the single constraint
    const newConstraint = await Constraints.create({
      userId: userId,
      eventId: eventId,
      unavailableTime: unavailableTime, // Insert the unavailable time
    });

    res.json({
      message: "Constraint added successfully.",
      data: newConstraint,
    });
  } catch (error) {
    console.error("Error adding constraint:", error);

    if (error.name === "SequelizeValidationError") {
      res.status(400).json({
        error: "Validation error: " + error.errors[0].message,
      });
    } else {
      res.status(500).json({
        error: "Error adding constraint to the database.",
      });
    }
  }
});

// Delete all constraints for a specific user and event
router.delete("/", validateToken, async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ error: "userId and eventId are required." });
  }

  try {
    await Constraints.destroy({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });

    res.json({ message: "Constraints deleted successfully." });
  } catch (error) {
    console.error("Error deleting constraints:", error);
    res.status(500).json({ error: "Error deleting constraints." });
  }
});

module.exports = router;
