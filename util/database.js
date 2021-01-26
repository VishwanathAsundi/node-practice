const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://vishwanath123:hfAOw9f86oGiHT3q@cluster0.6lk21.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//     useNewUrlParser: true
// });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });


const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://xyz:xyz@cluster0.6lk21.mongodb.net/<dbname>?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(client => {
        console.log("Connected!");
        cb(client);
    }).catch(e => {
        console.log(e);
    });
}

module.exports = mongoConnect;