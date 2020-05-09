const express = require("express");
const postsRouter = require("./router/postsRouter");
const server = express();
server.use(express.json());
server.use("/api/posts", postsRouter);
server.get("/", (req, res) => {
  res.send(`<h2>WELCOME TO NODE PROJECT 2</h2>`);
});
module.exports = server;
