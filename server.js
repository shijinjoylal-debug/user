require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;
const client = process.env.MONGODB_URI
  ? new MongoClient(process.env.MONGODB_URI)
  : null;
let databasePromise;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

async function getUsersCollection() {
  if (!client) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!databasePromise) {
    databasePromise = client.connect().then(() =>
      client.db(process.env.MONGODB_DATABASE || "username_collector")
    );
  }

  const database = await databasePromise;
  return database.collection("users");
}

app.post("/api/users", async (req, res) => {
  const username =
    typeof req.body?.username === "string" ? req.body.username.trim() : "";

  if (!username || username.length > 50) {
    return res.status(400).json({
      error: "Enter a username between 1 and 50 characters."
    });
  }

  try {
    const users = await getUsersCollection();
    const result = await users.insertOne({
      username,
      createdAt: new Date()
    });

    return res.status(201).json({
      message: "Username saved.",
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error("Could not save username:", error.message);
    const status = error.message === "MONGODB_URI is not configured." ? 503 : 500;
    return res.status(status).json({
      error:
        status === 503
          ? "MongoDB is not configured yet. Add MONGODB_URI to your .env file."
          : "Could not save your username. Please try again."
    });
  }
});

app.listen(port, () => {
  console.log(`Username collector is running at http://localhost:${port}`);
});

async function closeMongoConnection() {
  if (client) {
    await client.close();
  }
}

process.on("SIGINT", async () => {
  await closeMongoConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeMongoConnection();
  process.exit(0);
});
