const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 1000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4i3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("midtownHotel");
    const servicesCollection = database.collection("services");
    // get Api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // post Api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      /*     const service = {
        name: "Executive King Room",
        address: "NewYork",
        price: 6000,
        desc: "Executive King Room; King bed; luxury bath amenities; Kassatex linen; robes and slippers; LG Styler Closet; streaming TV; WiFi",
        picture:
          "https://image-tc.galaxy.tf/wijpeg-ae5bc5wozkii82wulgrwzx6s7/standard.jpg?crop=107%2C0%2C1707%2C1280&width=372",
      }; */
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("again and again Server");
});

app.listen(port, () => {
  console.log("li dgdfgdgstening", port);
});
