const express = require('express');
const router = express.Router();
const TestObject = require('../models/testObjects');
const { Collection } = require('mongoose');
const keycloak = require('../config/keycloak-config.js').getKeycloak();
const MongoClient = require('mongodb').MongoClient;

//Keycloak vorerst deaktiviert, da vue_web noch kein Keycloak implementiert hat

const uri = process.env.DATABASE_CONNECTION_STRING;
// const uri = 'mongodb+srv://mongoDB_prod_root:root@mongodbprod.psxhr.gcp.mongodb.net/test?retryWrites=true&w=majority';
// const uri = 'mongodb://root:root@192.168.178.70:27017'; //port optional bei standardport
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var collection;
client.connect().then(() => {
    collection = client.db('test').collection('testobjects');
    console.log('Connected to DB');
}).catch(err => {
    console.log(err);
});

//Gibt alle Eintraege in der Collection testobjects aus
router.get('/', keycloak.protect('user'), async (req, res) => {
    try {
        collection.find().toArray().then(testObject => {
            res.send(testObject);
        })
    } catch (err) {
        res.json({ message: err });
    }
});

//Fügt Eintrag der der testobjects Collection hinzu
router.post('/', keycloak.protect('admin'), async (req, res) => {
    const testObject = new TestObject({
        name: req.body.name,
        age: req.body.age
    });

    try {
        collection.insertOne(testObject);
        // const savedTestObject = await testObject.save();
        // res.json(savedTestObject);
    } catch (err) {
        res.json({ message: err });
    }
});

router.delete('/:id', keycloak.protect('admin'), async (req, res) => {
    collection.deleteOne({ name: req.params.id }).then(() => {
        res.send("Deleted");
    }).catch(err => {
        console.log(err);
    });
    // await TestObject.deleteOne({ _id: req.params.id }).catch(err => {
    //     console.log(err);
    // });
});
module.exports = router;