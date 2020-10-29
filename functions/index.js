const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://abcdefg123456.firebaseio.com"
});

const typeDefs = gql`
  type Cat {
      name: String,
      description: String
  }

  type Query{
      cats:[ Cat ]
  }
  `
const resolvers = {
    Query: {
        cats: () => {
            return admin
                .database()
                .ref('cats')
                .once("value")
                .then((snap) => snap.val())
                .then((val) => Object.keys(val).map((key) => val[key]))
        }
    }
}

const app = express();
const server = new ApolloServer({
    typeDefs, resolvers
})
server.applyMiddleware({ app, path: "/", cors: true })

exports.graphql = functions.https.onRequest(app)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
