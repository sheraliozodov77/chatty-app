/*
    Chatty - Chat Application JavaScript
    
    This JavaScript file is responsible for the functionality of the Chatty chat application.
    It includes functions to send messages to the server, fetch and display messages, and handle
    user interactions within the chat interface.

    Author: Sherali Ozodov
    Course: CSC 337
    File: client.js
*/

// Get references to the message input field, alias input field, and chat window
const messageInput = document.getElementById('message');
const aliasInput = document.getElementById('alias');
const sendButton = document.querySelector('.send-button input[type="submit"]');
const chatWindow = document.querySelector('.chat-window');

// Function to send a message to the server
const sendMessageToServer = (event) => {
  event.preventDefault();

  const message = messageInput.value;
  const alias = aliasInput.value;

  if (message) {
    const messageData = { alias, message };

    // Send an AJAX request to the server with JSON data
    fetch('/chats/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
      .then((response) => {
        if (response.ok) {
          // Clear the message input field
          messageInput.value = '';
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  }
};

// Add a click event listener to the send button
sendButton.addEventListener('click', sendMessageToServer);

// Function to fetch and update messages from the server
const fetchAndDisplayMessages = () => {
  // Send an AJAX GET request to the server to fetch chat messages
  fetch('/chats')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error fetching messages');
      }
    })
    .then((data) => {
      // Clear the chat window
      chatWindow.innerHTML = '';

      // Loop through the fetched messages and append them to the chat window
      data.forEach((messageObj, index) => {
        const messageElement = document.createElement('div');

        if (index === 0) {
          // Add margin to the top of the first message
          messageElement.style.paddingTop = '25px';
        }
        else {
          // Add margin between messages
          messageElement.style.paddingTop = '5px';
        }

        // Apply padding to the alias element
        const aliasElement = document.createElement('strong');
        aliasElement.textContent = messageObj.alias + ': ';
        aliasElement.style.paddingLeft = '25px';

        messageElement.appendChild(aliasElement);
        messageElement.innerHTML += `${messageObj.message}`;

        chatWindow.appendChild(messageElement);
      });
    })
    .catch((error) => {
      console.error('Error fetching messages:', error);
    });
};
// Fetch and update messages every 1 second
setInterval(fetchAndDisplayMessages, 1000);
