document.addEventListener('DOMContentLoaded', (event) => {
    const chatId = window.location.pathname.split('/').slice(-2, -1)[0];
    // Отримує chatId з URL-адреси.
    const chatSocket = new WebSocket(
        'wss://' + window.location.host + '/ws/chat/' + chatId + '/'
    );
    
    // Створює новий WebSocket-з'єднання з сервером за адресою /ws/chat/<chatId>/.

    const messagesContainer = document.querySelector('.messages');
    // Знаходить контейнер для повідомлень у DOM, де будуть відображатися отримані повідомлення.

    chatSocket.onopen = function(e) {
        console.log('WebSocket connection opened');
    };

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

        // Показуємо сповіщення, якщо вкладка не активна або користувач не дивиться на чат
        if (document.hidden) {
            if (Notification.permission === 'granted') {
                const notification = new Notification("Нове повідомлення", {
                    body: `${data.username}: ${data.message}`,
                    icon: '/path/to/icon.png'
                });

                // Налаштовуємо дію на натискання сповіщення
                notification.onclick = function() {
                    window.focus();  // Зробити вкладку активною
                    this.close();    // Закрити сповіщення
                };
            }
        }
    };

    chatSocket.onclose = function(e) {
        // Ця функція викликається, коли WebSocket-з'єднання несподівано закривається.
        console.error('Chat socket closed unexpectedly');
    };

    chatSocket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    document.querySelector('#chat-form').onsubmit = function(e) {
        // Ця функція викликається при відправленні форми повідомлень.
        e.preventDefault();
        const messageInputDom = document.querySelector('#message-input');
        const message = messageInputDom.value;
        // Отримує значення введеного повідомлення.
        if (chatSocket.readyState === WebSocket.OPEN) {
            chatSocket.send(JSON.stringify({
                'message': message,
                'username': user 
            }));
        } else {
            console.error('WebSocket is not open. readyState=' + chatSocket.readyState);
        }
        // Відправляє повідомлення на WebSocket-сервер у форматі JSON.
        messageInputDom.value = '';
        // Очищає поле введення повідомлень.
    };

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
