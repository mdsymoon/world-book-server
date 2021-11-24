const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const app = express();
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 4000;

// middleWare

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8cqw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookCollection = client.db("WorldBook").collection("BookList");
  const favCollection = client.db("WorldBook").collection("FavList");

  // post api book list

  app.post("/addBook", (req, res) => {
    const { name, price, writer } = req.body;
    const file = req.files.file;

    const newImg = file.data;
    const encImg = newImg.toString("base64");

    const img = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    bookCollection.insertOne({ name, price, writer, img }).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // get api book list

  app.get("/bookList", (req, res) => {
    bookCollection.find().toArray((err, bookList) => {
      res.send(bookList);
    });
  });

  // post api favorite book

  app.post("/addToFav", (req, res) => {
    const {name, price, writer, img ,email} = req.body;
    favCollection.insertOne({name, price, writer, img ,email}).then((result) => {
      res.send(result.insertedCount > 0);
    })
  })

});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
