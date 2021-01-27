const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://xyz:xyz@cluster0.6lk21.mongodb.net/shop?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(client => {
        console.log("Connected!");
        _db = client.db();
        cb();
    }).catch(e => {
        console.log(e);
        throw e;
    });
}
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'Not connected to DB';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;