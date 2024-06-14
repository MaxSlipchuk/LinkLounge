document.addEventListener('DOMContentLoaded', (event) => {
    const chatId = window.location.pathname.split('/').slice(-2, -1)[0];
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + chatId + '/'
    );

    const messagesContainer = document.querySelector('.messages');

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (data.username === user) {
            messageElement.classList.add('me');
        } else {
            messageElement.classList.add('other');
        }
        messageElement.innerHTML = `
            <div class="message-content">
                <strong class="message-username"><span>@</span>${data.username}</strong>
                <span class="message-text">${data.message}</span>
            </div>`;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
        e.preventDefault();
        const messageInputDom = document.querySelector('#message-input');
        const message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user 
        }));
        messageInputDom.value = '';
    };

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});