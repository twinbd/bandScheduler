const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { sign } = require("jsonwebtoken");

// registration
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      admin: 0, // Explicitly setting admin to false for new users
    });
    res.json("Success");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });
  if (!user) return res.json({ error: "User doesn't exist" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match)
      return res.json({ error: "Wrong username and password combination" });

    const accessToken = sign(
      { username: user.username, id: user.id, admin: user.admin },
      "importantsecret"
    );
    return res.json({
      token: accessToken,
      username: username,
      id: user.id,
      admin: user.admin,
    });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo);
});

// get all users
router.get("/allusers", async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["username", "id"], // Only fetch username and id
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then((match) => {
    if (!match) {
      return res.json({ error: "Wrong old password entered" });
    }

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("Success");
    });
  });
});

router.post("/loginpl", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Find user by email (stored in the username column)
    const user = await Users.findOne({ where: { username: email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with token and expiry
    await user.update({ login_token: token, token_expiry: expiry });

    // Configure Nodemailer with Amazon SES
    console.log(process.env.AWS_SES_REGION);
    const transporter = nodemailer.createTransport({
      host: process.env.AWS_SES_REGION, // SES SMTP endpoint
      port: 587, // TLS port
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.AWS_SES_SMTP_USER, // SES SMTP username
        pass: process.env.AWS_SES_SMTP_PASS, // SES SMTP password
      },
    });

    // Construct login link
    const loginLink = `http://localhost:3000/verify-token?token=${token}`;

    // Send email with login link
    await transporter.sendMail({
      from: `"Band Scheduler" <no-reply@band-schedule.com>`, // Use a verified sender email
      to: email, // Recipient email
      subject: "Your Login Link",
      text: `Click here to log in: ${loginLink}`, // Plain text version
      html: `<p>Click <a href="${loginLink}">here</a> to log in.</p>`, // HTML version
    });

    res.status(200).json({ message: "Login link sent to your email." });
  } catch (error) {
    console.error("Error processing login:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the login." });
  }
});

module.exports = router;
