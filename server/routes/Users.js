const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

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

module.exports = router;
