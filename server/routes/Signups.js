const express = require("express");
const router = express.Router();
const { Signups, Users } = require("../models");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/sendMail")
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { email, name, intro, baseUrl } = req.body;

  if (!email || !name || !intro) {
    return res.status(400).json({ message: "Signup information is insufficient." });
  }

  try {
    // Check if the email already exists in Signups or Users
    const existingSignup = await Signups.findOne({ where: { email } });
    const existingUser = await Users.findOne({ where: { email } });

    if (existingSignup || existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Check if the email already exists in Signups or Users
    const existingNameSignup = await Signups.findOne({ where: { name } });
    const existingNameUser = await Users.findOne({ where: { name } });

    if (existingNameSignup || existingNameUser) {
      return res.status(400).json({ message: "There is someone who has same user name. Please use unique user name." });
    }

    // Add new signup request
    await Signups.create({ email, name, intro });
    // send email to admin to review. (to all admins)
    const membersLink = `${baseUrl}/members`;
    const adminList = await Users.findAll({ where: { admin: 1 } });
    const adminEmails = adminList.map(admin => admin.email);
    console.log(adminList, adminEmails);
    if (adminEmails.length === 0) {
        res.status(500).json({ message: "An error occurred on communicating with admin but your signup request is in process. Please contact admin to review your request." });
    } else {
      await sendMail({
        to: adminEmails.join(","),
        subject: `New member request : ${name}(${email})`,
        text: `Click here to review new member ${name}(${email}) registration in: ${membersLink}`, // Plain text version
        html: `<p>Click <a href="${membersLink}">here</a> to review new member registration: ${name}(${email})</p>`, // HTML version
      });
    }

    res.status(201).json({ message: "Signup request submitted successfully.\nPlease wait for your admin to review your membership.\nYou will receive an email notification once your admin approves or rejects." });
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
      name: signup.name,
      password: "null", // Passwordless
      intro: signup.intro,
      admin: 0, // Default to regular user
      login_token: null,
      token_expiry: null,
      last_login_at: null,
    });

    // Remove the signup request from Signups table
    await signup.destroy();

    // TODO : send email to approved email.
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
    // TODO : send email to rejected email.

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
