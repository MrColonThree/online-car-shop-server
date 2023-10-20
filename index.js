const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 7000;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@automotivedb.lg2unci.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const bannerCollection = client.db("bannerDB").collection("banners");
    const productCollection = client.db("productDB").collection("products");
    const brandCollection = client.db("BrandDB").collection("brands");
    const cartCollection = client.db("cartDB").collection("cartProduct");
    const teamCollection = client.db("teamDB").collection("team");
    const contactCollection = client.db("contactDB").collection("contact");

    // to get banner data
    app.get("/banners", async (req, res) => {
      const cursor = bannerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // to get brands
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brand/:name", async (req, res) => {
      const name = req.params.name;
      const query = { brand_name: name };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    // to get products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // to get cart products
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    // to get team members
    app.get("/team", async (req, res) => {
      const cursor = teamCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // to get contact data
    app.get("/contact", async (req, res) => {
      const cursor = contactCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // to add products
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    // to add products in cart
    app.post("/cart", async (req, res) => {
      const cartProduct = req.body;
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result);
    });
    // to update products
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = req.body;
      const options = { upsert: true };
      const product = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          image: updatedProduct.image,
          type: updatedProduct.type,
          rating: updatedProduct.rating,
          price: updatedProduct.price,
          details: updatedProduct.details,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Online car shop is running");
});

app.listen(port, () => {
  console.log(`ONLINE CAR SHOP IS RUNNING ON PORT ${port}`);
});
