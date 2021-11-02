const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 1000;
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
    const orderdata = client.db("midtownHotelorder");
    const servicesCollection = database.collection("services");
    const orderCollection = orderdata.collection("myorder");
    // get Api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get api for single data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleBookingInfo = await servicesCollection.findOne(query);
      // console.log(singleBookingInfo);
      res.send(singleBookingInfo);
    });

    // post Api
    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      // console.log(result);
      res.json(result);
    });

    // get api
    app.get("/manageallorder", async (req, res) => {
      const manageorder = await orderCollection.find({}).toArray();
      res.send(manageorder);
    });

    // delete api for my booking
    app.delete("/mybooking/:id", async (req, res) => {
      const bookingId = req.params.id;
      const query = { _id: ObjectId(bookingId) };
      const deleteBooking = await orderCollection.deleteOne(query);
      // console.log(deleteBooking);
      res.json(deleteBooking);
    });

    // update api for status
    app.put("/mybooking/:id", async (req, res) => {
      const updateId = req.params.id;
      const updatedStatus = req.body;
      // console.log(updatedStatus);
      const filter = { _id: ObjectId(updateId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedStatus.status,
        },
      };
      const approvedres = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log(result);
      res.json(approvedres);
    });

    // get api using email
    app.get("/mybooking/:email", async (req, res) => {
      const email = req.params.email;
      const mybookings = await orderCollection.find({ email }).toArray();
      // console.log(mybookings);
      res.send(mybookings);
    });

    // post api for all order
    app.post("/placebook", async (req, res) => {
      const placebookings = req.body;
      const result = await orderCollection.insertOne(placebookings);
      // console.log("A document was inserted with the _id:", result);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("midtown hotel Server");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
