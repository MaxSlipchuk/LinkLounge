document.addEventListener('DOMContentLoaded', (event) => {
    const chatId = window.location.pathname.split('/').slice(-2, -1)[0];
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + chatId + '/'
    );

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const messages = document.querySelector('.messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
        messages.appendChild(messageElement);
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
            'username': user // передаємо username як параметр
        }));
        messageInputDom.value = '';
    };
});