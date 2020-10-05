const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neh82.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventsCollection = client.db("volunteer").collection("events");
    const registerCollection = client.db("volunteer").collection("registerVolunteer");

    app.post('/addEvent', (req, res) => {
        const events = req.body;

        eventsCollection.insertOne(events)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/getAllEvents', (req, res) => {
        eventsCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/singleEvent/:id', (req, res) => {
        const id = req.params.id
        eventsCollection.find({ _id: ObjectId(id) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post('/register', (req, res) => {
        const registerVolunteer = req.body
        registerCollection.insertOne(registerVolunteer)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/volunteeringList/:email', (req, res) => {
        const email = req.params.email
        registerCollection.find({ email: email })
            .toArray((err, document) => {
                res.send(document)
            })
    });


    app.delete('/deleteRegistered/:id', (req, res) => {
        console.log(req.params.id);
        registerCollection.deleteOne({
            _id: req.params.id
        })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    app.get('/getAllVolunteer', (req, res) => {
        registerCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })


});


app.get('/', function (req, res) {
    res.send('hello world')
})

app.listen(process.env.PORT || port, () => console.log("App listen"))
