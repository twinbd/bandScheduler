const express = require("express");
const router = express.Router();
const { Signups, Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the email already exists in Signups or Users
    const existingSignup = await Signups.findOne({ where: { email } });

    // undo this comment for later development
    // const existingUser = await Users.findOne({ where: { email } });

    // if (existingSignup || existingUser) {
    //   return res.status(400).json({ message: "Email already exists." });
    // }

    // Add new signup request
    await Signups.create({ email, name });
    res.status(201).json({ message: "Signup request submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

router.get("/signup", async (req, res) => {
  try {
    const signups = await Signups.findAll();
    res.status(200).json(signups);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching signups." });
  }
});

router.post("/approve-signup/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const signup = await Signups.findByPk(id);

    if (!signup) {
      return res.status(404).json({ message: "Signup request not found." });
    }

    // Add the user to the Users table
    await Users.create({
      username: signup.email,
      password: "null", // Passwordless
      admin: 0, // Default to regular user
      login_token: null,
      token_expiry: null,
      last_login_at: null,
    });

    // Remove the signup request from Signups table
    await signup.destroy();

    res.status(200).json({
      message: "Signup request approved and user added to the system.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while approving the signup." });
  }
});

router.delete("/reject-signup/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const signup = await Signups.findByPk(id);

    if (!signup) {
      return res.status(404).json({ message: "Signup request not found." });
    }

    // Remove the signup request
    await signup.destroy();

    res.status(200).json({ message: "Signup request rejected and deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while rejecting the signup." });
  }
});

module.exports = router;
