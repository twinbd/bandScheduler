const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(cors());
const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

const eventsRouter = require("./routes/Events");
app.use("/events", eventsRouter);

const songsRouter = require("./routes/Songs");
app.use("/songs", songsRouter);

const musiciansRouter = require("./routes/Musicians");
app.use("/musicians", musiciansRouter);

const signupsRouter = require("./routes/Signups");
app.use("/signups", signupsRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
