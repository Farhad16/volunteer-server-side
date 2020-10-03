const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neh82.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventsCollection = client.db("volunteer").collection("events");

    app.post('/addEvents', (req, res) => {
        const events = req.body;
        console.log(events);
        eventsCollection.insertOne(events)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.get('/getAllEvents', (req, res) => {
        eventsCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
});


app.get('/', function (req, res) {
    res.send('hello world')
})

app.listen(process.env.PORT || port, () => console.log("App listen"))
