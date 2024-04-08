'use strict';

var usernamePage = document.querySelector('#username');
var chatPage = document.querySelector('#chat');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#messageInput');
var messageArea = document.querySelector('#messages');
var connectingElement = document.querySelector('#connecting');
var messageSender = document.querySelector('#messageSender');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0',
    '#cddc39', '#ff5722', '#795548', '#607d8b'
]


function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send(
        "/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );
    connectingElement.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Refresh the page.';
    connectingElement.style.color = 'red';
}

function getAvatarColor(sender) {
    var hash = 0;
    for (var i = 0; i < sender.length; i++) {
        hash = sender.charCodeAt(i) + ((hash << 5) - hash);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    let spanMessage = document.createElement('span');
    let messageSenderName = document.createTextNode(message.sender);
    spanMessage.style['background-color'] = getAvatarColor(message.sender);
    spanMessage.appendChild(messageSenderName);
    messageElement.appendChild(spanMessage);

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        messageElement.appendChild(document.createTextNode(' joined!'));
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        messageElement.appendChild(document.createTextNode(' left!'));
    } else {
        messageElement.classList.add('chat-message');

        let textElement = document.createElement('p');
        let messageText = document.createTextNode(message.content);
        textElement.appendChild(messageText);
        messageElement.appendChild(textElement);
    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {

        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();

}

function connect(event) {
    username = document.querySelector('#usernameInput').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');


        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);