/*
    Chatty - Chat Application Server
    
    This Node.js script serves as the server for the Chatty chat application. It sets up
    the Express server, connects to a MongoDB database to store chat messages, and handles
    HTTP requests for sending and retrieving messages.

    Author: Sherali Ozodov
    Course: CSC 337
    File: server.js
*/

// Import required modules
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

// Connect to the MongoDB database
const db = mongoose.connection;
const mongoDBURL = 'mongodb://0.0.0.0/chatty';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });

// Handle MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for chat messages
const Schema = mongoose.Schema;
const ChatMessageSchema = new Schema({
  time: Number,
  alias: String,
  message: String,
});

// Create a model based on the schema
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

// Serve static files from the 'public_html' directory
app.use(express.static('./public_html'));
app.use(bodyParser.json());

// Handle POST requests to save chat messages
app.post('/chats/post', (req, res) => {
  const { alias, message } = req.body;
  const newChatMessage = new ChatMessage({
    time: Date.now(),
    alias,
    message,
  });

  newChatMessage
    .save()
    .then((savedMessage) => {
      // Send a successful response
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error saving message:', error);
      // Send a server error response
      res.sendStatus(500);
    });
});

// Handle GET requests to retrieve chat messages
app.get('/chats', (req, res) => {
  ChatMessage.find({})
    .then((messages) => {
      // Map retrieved messages to a simplified format
      const chatData = messages.map((message) => ({
        alias: message.alias,
        message: message.message,
      }));
      // Send the chat data as JSON response
      res.json(chatData);
    })
    .catch((error) => {
      console.error('Error fetching messages:', error);
      res.sendStatus(500);
    });
});

// Start the Express app and listen on the specified port
app.listen(port, () => {
  console.log(`Chatty app is listening on port ${port}`);
});
