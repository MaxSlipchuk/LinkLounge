document.addEventListener('DOMContentLoaded', (event) => {
    const chatId = window.location.pathname.split('/').slice(-2, -1)[0];
    // Отримує chatId з URL-адреси.
    const chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + chatId + '/'
    );
    // Створює новий WebSocket-з'єднання з сервером за адресою /ws/chat/<chatId>/.

    const messagesContainer = document.querySelector('.messages');
    // Знаходить контейнер для повідомлень у DOM, де будуть відображатися отримані повідомлення.

    chatSocket.onmessage = function(e) {
    // Ця функція викликається щоразу, коли WebSocket отримує нове повідомлення.
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
    // Ця функція викликається, коли WebSocket-з'єднання несподівано закривається.
        console.error('Chat socket closed unexpectedly');
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
    // Ця функція викликається при відправленні форми повідомлень.
        e.preventDefault();
        const messageInputDom = document.querySelector('#message-input');
        const message = messageInputDom.value;
        // Отримує значення введеного повідомлення.
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user 
        }));
        // Відправляє повідомлення на WebSocket-сервер у форматі JSON.
        messageInputDom.value = '';
        // Очищає поле введення повідомлень.
    };

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});