document.addEventListener('DOMContentLoaded', function() {
    const groupName = document.getElementById("group-name").textContent;
    const user = document.getElementById("user-name").textContent;
    
    // Встановлюємо з'єднання WebSocket з сервером
    const chatSocket = new WebSocket(
        'wss://' + window.location.host + '/ws/groups/' + groupName + '/'
    );
    
    const messageInputDom = document.querySelector('#message-input');
    const sendButton = document.querySelector('.btn-send');

    // деактивувати кнопку
    sendButton.disabled = true;

    // активація або дезактивація кнопки
    messageInputDom.addEventListener('input', function() {
        if (messageInputDom.value.trim() === '') {
            sendButton.disabled = true;  // якщо поле порожнє або містить лише пробіли
        } else {
            sendButton.disabled = false; // активуємо, якщо є текст
        }
    });

    // Обробник події відкриття WebSocket з'єднання
    chatSocket.onopen = function(e) {
        console.log("WebSocket connection opened:", e);
    };

    // Обробник події отримання повідомлення від сервера
    chatSocket.onmessage = function(e) {
        console.log("Message received from server:", e.data);
        const data = JSON.parse(e.data);
        const messageContainer = document.querySelector('.messages');
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');

        // Додаємо класи для повідомлення, в залежності від того, хто його відправив
        if (data.username === user) {
            newMessage.classList.add('me');
            newMessage.classList.add('message-username');
        } else {
            newMessage.classList.add('other');
            newMessage.classList.add('message-username');
        }

        // Вставляємо нове повідомлення в контейнер
        newMessage.innerHTML = `
            <div class="message-content">
                <strong class="message-username"><span>@</span>${data.username}</strong>
                <span class="message-text">${data.message}</span>
            </div>
        `;
        messageContainer.appendChild(newMessage);

        // Прокручуємо контейнер до низу, щоб показати нове повідомлення
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    // Обробник події закриття WebSocket з'єднання
    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed:", e);
    };

    // Обробник події помилки WebSocket з'єднання
    chatSocket.onerror = function(e) {
        console.log("WebSocket error:", e);
    };

    // Обробник події відправлення форми повідомлення
    document.querySelector('#chat-form').onsubmit = function(e) {
        e.preventDefault();
        const messageInput = document.querySelector('#message-input');
        const message = messageInput.value;
        console.log("Sending message:", message);

        // Відправляємо повідомлення на сервер через WebSocket
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': user
        }));

        // Очищаємо поле вводу після відправлення повідомлення
        messageInput.value = '';
    };

    // Прокручуємо контейнер повідомлень до низу при завантаженні сторінки
    const messageContainer = document.querySelector('.messages');
    messageContainer.scrollTop = messageContainer.scrollHeight;
});