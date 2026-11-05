const { MongoClient } = require("mongodb");

let clientPromise;

async function getUsersCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  const client = await clientPromise;
  return client
    .db(process.env.MONGODB_DATABASE || "username_collector")
    .collection("users");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

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
          ? "MongoDB is not configured yet. Add MONGODB_URI to your Vercel environment variables."
          : "Could not save your username. Please try again."
    });
  }
};
