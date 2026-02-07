const { MongoClient } = require("mongodb");

const MONGO_DB_URL = process.env.MONGO_DB_URL;

let db = {};

async function connectDB() {
  const client = await MongoClient.connect(MONGO_DB_URL);
  const database = client.db("e_comm");

  db.website = database.collection("website");
  db.user = database.collection("user");
  db.categories = database.collection("category");
  db.subCategories = database.collection("subCategory");
  db.cart = database.collection("cart");
  db.products = database.collection("products");

  db.address = database.collection("address");
  db.payments = database.collection("payments");

  db.sentBox = database.collection('sentBox');
  db.mobileMessages = database.collection("mobileMessages");

  console.log("MongoDB connected");
}

module.exports = {
  connectDB,
  db
};
