require("dotenv").config();

const express = require("express");
const path = require("path");
const usersHandler = require("./api/users");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.all("/api/users", usersHandler);

app.listen(port, () => {
  console.log(`Username collector is running at http://localhost:${port}`);
});
