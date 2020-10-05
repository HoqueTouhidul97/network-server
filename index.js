const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParse = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParse.json());

const info = { user: 'volunteer', pass: 'Arabian79', db: 'volunteerNetwork' };

const port = 5000;



const uri = `mongodb+srv://volunteer:Arabian79@cluster0.dc1pe.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const events = client.db("volunteerNetwork").collection("events");

    app.post('/registeredUser', (req, res) => {
        const registeredData = req.body;
        events.insertOne(registeredData)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.get('/enrolledEvents', (req, res) => {
        events.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.delete('/delete/:id', (req, res) => {
        events.deleteOne({ _id: ObjectId(req.params.id) })
            .then( result => {
                res.send(result.deletedCount > 0)
                console.log(result);
            })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World')
});


app.listen( process.env.PORT || port)