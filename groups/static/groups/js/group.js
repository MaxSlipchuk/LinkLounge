document.addEventListener('DOMContentLoaded', function() {
    const groupName = document.getElementById("group-name").textContent;
    const user = document.getElementById("user-name").textContent;
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/groups/' + groupName + '/'
    );

    chatSocket.onopen = function(e) {
        console.log("WebSocket connection opened:", e);
    };

    chatSocket.onmessage = function(e) {
        console.log("Message received from server:", e.data);
        const data = JSON.parse(e.data);
        const messageContainer = document.querySelector('.messages');
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        if (data.username === user) {
            newMessage.classList.add('me');
            newMessage.classList.add('message-username');
        } else {
            newMessage.classList.add('other');
            newMessage.classList.add('message-username');
        }
        newMessage.innerHTML = `
            <div class="message-content">
                <strong class="message-username"><span>@</span>${data.username}</strong>
                <span class="message-text">${data.message}</span>
            </div>
        `;
        messageContainer.appendChild(newMessage);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed:", e);
    };

    chatSocket.onerror = function(e) {
        console.log("WebSocket error:", e);
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
        e.preventDefault();
        const messageInput = document.querySelector('#message-input');
        const message = messageInput.value;
        console.log("Sending message:", message);
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user
        }));
        messageInput.value = '';
    };

    const messageContainer = document.querySelector('.messages');
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
});