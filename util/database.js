require("dotenv").config();
const mongdb = require("mongodb");

const MongoClient = mongdb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    `mongodb+srv://jakubsnode:kytne2-tuccut-hogceT@jakubsnode-ac2qp.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )
    .then(client => {
      console.log("Connnected");
      callback(client);
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = mongoConnect;
